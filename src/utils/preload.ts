type ModuleLoader = () => Promise<{ default: React.ComponentType }>;

const pageLoaders: Record<string, ModuleLoader> = {
  '/': () => import('../pages/Home').then((m) => ({ default: m.Home })),
  '/archive': () => import('../pages/Archive').then((m) => ({ default: m.ArchivePage })),
  '/tags': () => import('../pages/Tags').then((m) => ({ default: m.Tags })),
  '/stats': () => import('../pages/Stats').then((m) => ({ default: m.Stats })),
  '/friends': () => import('../pages/Friends').then((m) => ({ default: m.Friends })),
  '/about': () => import('../pages/About').then((m) => ({ default: m.About })),
  '/sponsor': () => import('../pages/Sponsor').then((m) => ({ default: m.Sponsor })),
  '/cover': () => import('../pages/CoverGenerator').then((m) => ({ default: m.CoverGenerator })),
};

export { pageLoaders };

/** Preload a page module on hover */
export const preloadPage = (path: string) => {
  if (path.startsWith('/post/')) {
    import('../pages/Post').catch(() => {});
    return;
  }
  const loader = pageLoaders[path];
  if (loader) loader().catch(() => {});
};
