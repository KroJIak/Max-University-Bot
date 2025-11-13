import type { FC } from 'react';

import { ArrowRightIcon } from '@components/icons';
import type { ServiceItem } from './types';
import styles from './PlatformsSection.module.scss';

type PlatformsSectionProps = {
  title: string;
  items: ServiceItem[];
  onOpen?: () => void;
};

export const PlatformsSection: FC<PlatformsSectionProps> = ({ title, items, onOpen }) => {
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <button
          type="button"
          className={styles.moreButton}
          aria-label={`Открыть раздел ${title}`}
          onClick={onOpen}
        >
          <ArrowRightIcon className={styles.moreIcon} />
        </button>
      </header>

      <div className={styles.list}>
        {items.map((item) => (
          <div key={item.id} className={styles.item}>
            <button type="button" className={styles.card} aria-label={item.title}>
              <span className={styles.cardIcon} aria-hidden="true">
                {item.icon}
              </span>
            </button>
            <span className={styles.cardLabel}>{item.title}</span>
          </div>
        ))}
      </div>
    </section>
  );
};


