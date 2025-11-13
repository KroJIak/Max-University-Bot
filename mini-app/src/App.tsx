import { useCallback, useEffect, useMemo, useState } from 'react';

import { Layout } from './layout';
import type { FooterNavKey } from './layout/Footer';
import { LoginPage } from './pages/LoginPage';
import { MainPage } from './pages/MainPage';
import { NewsPage } from './pages/NewsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SchedulePage } from './pages/SchedulePage';
import { ServicesPage } from './pages/ServicesPage';

type PageKey = 'login' | 'home' | 'services' | 'profile' | 'scheduleDetail' | 'newsDetail';

type PageConfig = {
  title: string;
  showAvatar?: boolean;
  footerActive: FooterNavKey;
  render: () => JSX.Element;
  onBack?: () => void;
};

export function App() {
  const [history, setHistory] = useState<PageKey[]>(['login']);

  const activePage = history[history.length - 1];

  const pushPage = useCallback((page: PageKey) => {
    setHistory((trail) => {
      const current = trail[trail.length - 1];
      if (current === page) {
        return trail;
      }

      return [...trail, page];
    });
  }, []);

  const replaceRoot = useCallback((page: FooterNavKey) => {
    setHistory([page]);
  }, []);

  const handleBack = useCallback(() => {
    setHistory((trail) => {
      if (trail.length <= 1) {
        return trail;
      }

      return trail.slice(0, -1);
    });
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    });
  }, [activePage]);

  const pageConfig: PageConfig = useMemo(() => {
    if (activePage === 'home') {
      return {
        title: 'Главная',
        showAvatar: false,
        footerActive: 'home',
        render: () => (
          <MainPage
            onOpenFullSchedule={() => pushPage('scheduleDetail')}
            onOpenAllNews={() => pushPage('newsDetail')}
          />
        ),
      };
    }

    if (activePage === 'services') {
      return {
        title: 'Сервисы',
        showAvatar: false,
        footerActive: 'services',
        render: () => <ServicesPage onOpenSchedule={() => pushPage('scheduleDetail')} />,
      };
    }

    if (activePage === 'profile') {
      return {
        title: 'Профиль',
        showAvatar: false,
        footerActive: 'profile',
        render: () => <ProfilePage />,
      };
    }

    if (activePage === 'scheduleDetail') {
      return {
        title: 'Расписание',
        showAvatar: false,
        footerActive: history.includes('services') ? 'services' : 'home',
        render: () => <SchedulePage />,
        onBack: history.length > 1 ? handleBack : undefined,
      };
    }

    return {
      title: 'Новости',
      showAvatar: false,
      footerActive: 'home',
      render: () => <NewsPage />,
      onBack: history.length > 1 ? handleBack : undefined,
    };
  }, [activePage, handleBack, history, pushPage]);

  const handleLoginComplete = useCallback(
    (payload: { universityId: string; email: string; password: string }) => {
      console.log('[login]', payload);
      setHistory(['home']);
    },
    [],
  );

  if (activePage === 'login') {
    return <LoginPage onLogin={handleLoginComplete} />;
  }

  return (
    <Layout
      title={pageConfig.title}
      activePage={pageConfig.footerActive}
      onNavigate={replaceRoot}
      showAvatar={pageConfig.showAvatar}
      onBack={pageConfig.onBack}
    >
      {pageConfig.render()}
    </Layout>
  );
}

export default App;

