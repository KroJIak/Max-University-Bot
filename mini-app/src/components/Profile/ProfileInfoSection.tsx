import type { FC } from 'react';

import styles from './Profile.module.scss';

type InfoRow = {
  id: string;
  label: string;
  value: string;
};

type ProfileInfoSectionProps = {
  rows: InfoRow[];
};

export const ProfileInfoSection: FC<ProfileInfoSectionProps> = ({ rows }) => {
  return (
    <section className={styles.card}>
      {rows.map((row) => (
        <div key={row.id} className={styles.row}>
          <span className={styles.label}>{row.label}</span>
          <span className={styles.value}>{row.value}</span>
        </div>
      ))}
    </section>
  );
};

