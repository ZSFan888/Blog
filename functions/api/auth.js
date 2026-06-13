/**
 * Cloudflare Pages Functions - GitHub OAuth 代理
 * 用于 Decap CMS 的 GitHub OAuth 认证流程
 * 
 * 环境变量（在 CF Pages 控制台配置）：
 *   OAUTH_CLIENT_ID     - GitHub OAuth App 的 Client ID
 *   OAUTH_CLIENT_SECRET - GitHub OAuth App 的 Client Secret
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  const path = url.pathname.replace('/api/auth', '');

  // Step 1: 重定向到 GitHub 授权页
  if (path === '' || path === '/') {
    const clientId = env.OAUTH_CLIENT_ID;
    if (!clientId) {
      return new Response('OAUTH_CLIENT_ID not configured', { status: 500 });
    }
    const params = new URLSearchParams({
      client_id: clientId,
      scope: 'repo,user',
      state: crypto.randomUUID(),
    });
    return Response.redirect(`https://github.com/login/oauth/authorize?${params}`, 302);
  }

  // Step 2: GitHub 回调，用 code 换取 token
  if (path === '/callback') {
    const code = url.searchParams.get('code');
    if (!code) {
      return new Response('Missing code', { status: 400 });
    }

    const clientId = env.OAUTH_CLIENT_ID;
    const clientSecret = env.OAUTH_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return new Response('OAuth not configured', { status: 500 });
    }

    try {
      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
      });

      const tokenData = await tokenRes.json();

      if (tokenData.error) {
        return new Response(`OAuth error: ${tokenData.error_description}`, { status: 400 });
      }

      // 将 token 通过 postMessage 传回 Decap CMS
      const script = `
        <script>
          (function() {
            function receiveMessage(e) {
              console.log("receiveMessage %o", e);
              window.opener.postMessage(
                'authorization:github:success:${JSON.stringify({ token: tokenData.access_token, provider: 'github' }).replace(/'/g, "\\'")}',
                e.origin
              );
            }
            window.addEventListener("message", receiveMessage, false);
            window.opener.postMessage("authorizing:github", "*");
          })()
        </script>
      `;

      return new Response(`<!DOCTYPE html><html><body>${script}</body></html>`, {
        headers: { 'Content-Type': 'text/html', ...CORS_HEADERS },
      });
    } catch (err) {
      return new Response(`Error: ${err.message}`, { status: 500 });
    }
  }

  return new Response('Not found', { status: 404 });
}
