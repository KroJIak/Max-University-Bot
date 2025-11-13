import type { FC } from 'react';

import styles from './Profile.module.scss';

type ProfileUniversitySectionProps = {
  name: string;
};

export const ProfileUniversitySection: FC<ProfileUniversitySectionProps> = ({ name }) => {
  return (
    <section className={`${styles.card} ${styles.universityCard}`}>
      <span className={styles.universityName}>{name}</span>
    </section>
  );
};


