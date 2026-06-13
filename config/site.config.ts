// 博客配置文件
// VITE_SITE_URL 环境变量优先于此处的 url 配置
export const siteConfig = {
  title: 'ZSFan 的博客',
  subtitle: '凡的博客',
  description: 'ZSFan 的个人博客，记录技术与生活',
  logo: '/logo.png',
  seoImage: '/logo.png',
  footerText: '©2026 ZSFan 的 Blog',
  url: 'https://blog-buh.pages.dev',
  social: {
    github: 'https://github.com/ZSFan888/',
    email: 'mailto:zsfan-nb@hotmail.com',
    rawEmail: 'zsfan-nb@hotmail.com',
  },
  author: {
    name: 'ZSFan',
    avatar: 'https://q1.qlogo.cn/g?b=qq&nk=1453508737&s=100',
    role: '开发者',
    bio: '你好！我是 ZSFan，欢迎来到我的博客。这里记录我的技术探索与生活随笔。',
  },
  toc: {
    collapseInactiveRootBranches: true,
  },
  friendsPage: {
    repoUrl: 'https://github.com/ZSFan888/Blog',
    repoFriendsUrl: 'https://github.com/ZSFan888/Blog/tree/main/friends',
    repoFriendsDir: 'friends',
    announcement: '友链申请请前往 GitHub 仓库，在 friends 目录下参考已有 JSON 格式新增文件并提交 PR。提交前请确认已添加本站友链。',
  },
  beian: {
    text: '',
    url: '',
  },
};
