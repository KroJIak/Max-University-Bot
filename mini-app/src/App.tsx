import { useState } from 'react';

import { Layout } from './layout';
import type { FooterNavKey } from './layout/Footer';
import { MainPage } from './pages/MainPage';
import { NewsPage } from './pages/NewsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SchedulePage } from './pages/SchedulePage';
import { ServicesPage } from './pages/ServicesPage';

type PageConfig = {
  title: string;
  showAvatar?: boolean;
  footerActive: FooterNavKey;
  render: () => JSX.Element;
  onBack?: () => void;
};

export function App() {
  const [activePage, setActivePage] = useState<'home' | 'services' | 'profile' | 'scheduleDetail' | 'newsDetail'>('home');

  const pageConfig: PageConfig =
    activePage === 'home'
      ? {
          title: 'Главная',
          showAvatar: false,
          footerActive: 'home',
          render: () => (
            <MainPage
              onOpenFullSchedule={() => setActivePage('scheduleDetail')}
              onOpenAllNews={() => setActivePage('newsDetail')}
            />
          ),
        }
      : activePage === 'services'
        ? {
            title: 'Сервисы',
            showAvatar: false,
            footerActive: 'services',
            render: () => <ServicesPage />,
          }
        : activePage === 'profile'
          ? {
              title: 'Профиль',
              showAvatar: false,
              footerActive: 'profile',
              render: () => <ProfilePage />,
            }
          : activePage === 'scheduleDetail'
            ? {
                title: 'Расписание',
                showAvatar: false,
                footerActive: 'home',
                render: () => <SchedulePage />,
                onBack: () => setActivePage('home'),
              }
            : {
                title: 'Новости',
                showAvatar: false,
                footerActive: 'home',
                render: () => <NewsPage />,
                onBack: () => setActivePage('home'),
              };

  return (
    <Layout
      title={pageConfig.title}
      activePage={pageConfig.footerActive}
      onNavigate={setActivePage}
      showAvatar={pageConfig.showAvatar}
      onBack={pageConfig.onBack}
    >
      {pageConfig.render()}
    </Layout>
  );
}

export default App;

