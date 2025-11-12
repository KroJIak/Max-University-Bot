import { ProfileInfoSection, ProfileLogoutButton, ProfileSettingsSection, ProfileStatsSection, ProfileSummarySection } from '@components/Profile';
import styles from './ProfilePage.module.scss';

type StatCard = {
  id: string;
  title: string;
  value: string;
  suffix: string;
  icon: string;
};

type SettingsGroup = {
  id: string;
  items: { id: string; icon: string; title: string }[];
};

const statCards: StatCard[] = [
  {
    id: 'gradebook',
    title: 'Зачётка',
    value: '3.90',
    suffix: 'ср. балл',
    icon: '🟦',
  },
  {
    id: 'debts',
    title: 'Долги',
    value: '0',
    suffix: 'долгов',
    icon: '😎',
  },
];

const settingsGroups: SettingsGroup[] = [
  {
    id: 'preferences',
    items: [
      { id: 'cache', icon: '⚙️', title: 'Настройки и кэш' },
      { id: 'theme', icon: '🎨', title: 'Внешний вид' },
      { id: 'language', icon: '🌐', title: 'Язык интерфейса' },
      { id: 'notifications', icon: '🔔', title: 'Уведомления и звуки' },
      { id: 'security', icon: '🛡️', title: 'Безопасность' },
    ],
  },
  {
    id: 'support',
    items: [
      { id: 'about', icon: 'ℹ️', title: 'О приложении' },
      { id: 'support', icon: '🆘', title: 'Служба поддержки' },
      { id: 'community', icon: '🔗', title: 'Группа VK' },
      { id: 'improvements', icon: '⭐️', title: 'Предложить улучшение' },
    ],
  },
];

const infoRows = [
  { id: 'faculty', label: 'Факультет', value: 'Экономики и управления' },
  { id: 'group', label: 'Группа', value: 'ЭК-04-22' },
  { id: 'curator', label: 'Куратор', value: 'Ирина Соколова' },
];

export function ProfilePage() {
  return (
    <div className={styles.page}>
      <ProfileSummarySection name="Александра Иванова" subtitle="Студентка, 3 курс" />
      <ProfileInfoSection rows={infoRows} />
      <ProfileStatsSection cards={statCards} />
      <ProfileSettingsSection groups={settingsGroups} />
      <ProfileLogoutButton />
    </div>
  );
}

