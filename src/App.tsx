import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from './components/Layout';

const Home = lazy(() => import('./pages/Home').then((module) => ({ default: module.Home })));
const Post = lazy(() => import('./pages/Post').then((module) => ({ default: module.Post })));
const About = lazy(() => import('./pages/About').then((module) => ({ default: module.About })));
const ArchivePage = lazy(() => import('./pages/Archive').then((module) => ({ default: module.ArchivePage })));
const Stats = lazy(() => import('./pages/Stats').then((module) => ({ default: module.Stats })));
const Friends = lazy(() => import('./pages/Friends').then((module) => ({ default: module.Friends })));
const Tags = lazy(() => import('./pages/Tags').then((module) => ({ default: module.Tags })));
const NotFound = lazy(() => import('./pages/NotFound').then((module) => ({ default: module.NotFound })));

const RouteFallback: React.FC = () => (
  <div className="mx-auto flex min-h-[40vh] max-w-7xl items-center justify-center px-4 text-sm text-zinc-500 dark:text-zinc-400">
    页面加载中...
  </div>
);

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const routeKey = location.pathname;

  return (
    <Layout>
      <Suspense fallback={<RouteFallback />}>
        <Routes location={location} key={routeKey}>
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<Post />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/tags" element={<Tags />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <Router>
        <AppRoutes />
      </Router>
    </HelmetProvider>
  );
};

export default App;
