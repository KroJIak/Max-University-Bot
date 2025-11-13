import {
  ProfileInfoSection,
  ProfileLogoutButton,
  ProfileSettingsSection,
  ProfileStatsSection,
  ProfileSubgroupSection,
  ProfileSummarySection,
  ProfileUniversitySection,
} from '@components/Profile';
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
      { id: 'theme', icon: '🎨', title: 'Внешний вид' },
      { id: 'notifications', icon: '🔔', title: 'Уведомления и звуки' },
    ],
  },
  {
    id: 'support',
    items: [
      { id: 'about', icon: 'ℹ️', title: 'О приложении' },
      { id: 'support', icon: '🆘', title: 'Служба поддержки' },
      { id: 'improvements', icon: '⭐️', title: 'Предложить улучшение' },
    ],
  },
];

const infoRows = [
  { id: 'faculty', label: 'Факультет', value: 'Экономики и управления' },
  { id: 'speciality', label: 'Специальность', value: 'Бизнес-информатика' },
  { id: 'major', label: 'Профиль', value: 'Управление продуктами' },
  { id: 'group', label: 'Группа', value: 'ЭК-04-22' },
  { id: 'gradebook-number', label: 'Номер зачётки', value: 'ЭК220456' },
];

const contactRows = [
  { id: 'username', label: 'MAX ID', value: '@a.ivanova' },
  { id: 'email', label: 'Почта', value: 'a.ivanova@student.maxuniversity.ru' },
  { id: 'phone', label: 'Телефон', value: '+7 (999) 123-45-67' },
  { id: 'birthday', label: 'Дата рождения', value: '14 мая 2003' },
];

export function ProfilePage() {
  return (
    <div className={styles.page}>
      <ProfileUniversitySection name="Макс Университет" />
      <ProfileSummarySection
        name="Иванова Александра Сергеевна"
        subtitle="Студентка, 3 курс"
      />
      <ProfileInfoSection rows={infoRows} />
      <ProfileSubgroupSection />
      <ProfileInfoSection rows={contactRows} />
      <ProfileStatsSection cards={statCards} />
      <ProfileSettingsSection groups={settingsGroups} />
      <ProfileLogoutButton />
    </div>
  );
}

