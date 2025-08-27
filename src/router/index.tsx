import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '../components/Layout';
import HomePage from '../pages/HomePage';
import LearnPage from '../pages/LearnPage';
import VocabularyLearning from '../pages/VocabularyLearning';
import ProgressPage from '../pages/ProgressPage';
import CollectionsPage from '../pages/CollectionsPage';
import SettingsPage from '../pages/SettingsPage';
import NotFoundPage from '../pages/NotFoundPage';

// 路由配置
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'learn',
        element: <LearnPage />
      },
      {
        path: 'vocabulary-learning',
        element: <VocabularyLearning />
      },
      {
        path: 'progress',
        element: <ProgressPage />
      },
      {
        path: 'collections',
        element: <CollectionsPage />
      },
      {
        path: 'settings',
        element: <SettingsPage />
      }
    ]
  }
]);

// 路由提供者组件
export function AppRouter() {
  return <RouterProvider router={router} />;
}

export default router;