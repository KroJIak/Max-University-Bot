import type { FC } from 'react';

import { ArrowRightIcon } from '@components/icons';
import type { ServiceItem } from './types';
import styles from './PrimaryServicesSection.module.scss';

type PrimaryServicesSectionProps = {
  title: string;
  items: ServiceItem[];
  onOpen?: () => void;
  onItemSelect?: (item: ServiceItem) => void;
};

export const PrimaryServicesSection: FC<PrimaryServicesSectionProps> = ({
  title,
  items,
  onOpen,
  onItemSelect,
}) => {
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

      <div className={styles.grid}>
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={styles.card}
            onClick={() => onItemSelect?.(item)}
          >
            <span className={styles.cardTitle}>{item.title}</span>
            <span className={styles.cardIcon} aria-hidden="true">
              {item.icon}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};


