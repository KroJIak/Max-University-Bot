import type { FC } from 'react';

import { ArrowRightIcon } from '@components/icons';
import styles from './Profile.module.scss';

type SettingsGroupItem = {
  id: string;
  icon: string;
  title: string;
};

type SettingsGroup = {
  id: string;
  items: SettingsGroupItem[];
};

type ProfileSettingsSectionProps = {
  groups: SettingsGroup[];
};

export const ProfileSettingsSection: FC<ProfileSettingsSectionProps> = ({ groups }) => {
  return (
    <section className={styles.settings}>
      {groups.map((group) => (
        <article key={group.id} className={styles.settingsCard}>
          <div className={styles.settingsList}>
            {group.items.map((item) => (
              <button key={item.id} type="button" className={styles.settingsItem}>
                <span className={styles.settingsIcon} aria-hidden="true">
                  {item.icon}
                </span>
                <span className={styles.settingsTitle}>{item.title}</span>
                <ArrowRightIcon className={styles.settingsArrow} />
              </button>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
};

