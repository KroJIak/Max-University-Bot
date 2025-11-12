import type { FC } from 'react';

import styles from './Profile.module.scss';

type ProfileLogoutButtonProps = {
  onClick?: () => void;
};

export const ProfileLogoutButton: FC<ProfileLogoutButtonProps> = ({ onClick }) => {
  return (
    <button type="button" className={styles.logoutButton} onClick={onClick}>
      <span className={styles.logoutIcon} aria-hidden="true">
        ⎋
      </span>
      Выйти из аккаунта
    </button>
  );
};

