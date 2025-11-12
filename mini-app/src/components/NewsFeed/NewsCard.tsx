import type { FC } from 'react';

import type { NewsItem } from '../../shared/types/news';
import styles from './NewsFeed.module.scss';

type NewsCardProps = {
  item: NewsItem;
};

export const NewsCard: FC<NewsCardProps> = ({ item }) => {
  return (
    <article className={styles.card}>
      <div className={styles.thumbnail}>
        <img src={item.image} alt={item.title} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{item.title}</h3>
        <p className={styles.meta}>{item.description}</p>
      </div>
    </article>
  );
};

