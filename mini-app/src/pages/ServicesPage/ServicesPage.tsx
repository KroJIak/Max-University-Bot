import { PlatformsSection, PrimaryServicesSection } from '@components/Services';
import type { ServiceItem } from '@components/Services';
import styles from './ServicesPage.module.scss';

const primaryServices: ServiceItem[] = [
  { id: 'schedule', title: 'Расписание', icon: '🗓️' },
  { id: 'teachers', title: 'Преподаватели', icon: '👩‍🏫' },
  { id: 'requests', title: 'Справки и запросы', icon: '📝' },
  { id: 'contacts', title: 'Контакты', icon: '☎️' },
];

const platformServices: ServiceItem[] = [
  { id: 'courses', title: 'Курсы', icon: '✅' },
  { id: 'portfolio', title: 'Портфолио', icon: '🗂️' },
  { id: 'schedule', title: 'Расписание', icon: '📆' },
  { id: 'paid', title: 'Услуги', icon: '💳' },
];

type ServicesPageProps = {
  onOpenSchedule?: () => void;
};

export function ServicesPage({ onOpenSchedule }: ServicesPageProps) {
  const handlePrimarySelect = (item: ServiceItem) => {
    if (item.id === 'schedule') {
      onOpenSchedule?.();
    }
  };

  return (
    <div className={styles.page}>
      <PrimaryServicesSection
        title="Основные сервисы"
        items={primaryServices}
        onItemSelect={handlePrimarySelect}
      />
      <PlatformsSection title="Веб-платформы" items={platformServices} />
    </div>
  );
}

