import type { FC } from 'react';

import { BackIcon } from '@components/icons';
import styles from '../../layout/Header/Header.module.scss';

type HeaderBackButtonProps = {
  onClick: () => void;
};

export const HeaderBackButton: FC<HeaderBackButtonProps> = ({ onClick }) => {
  return (
    <button type="button" className={styles.action} aria-label="Назад" onClick={onClick}>
      <BackIcon className={styles.icon} />
    </button>
  );
};

