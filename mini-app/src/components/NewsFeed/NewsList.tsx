import { useEffect, useMemo, useRef, useState } from 'react';

import type { NewsItem } from '../../shared/types/news';
import styles from './NewsFeed.module.scss';
import { NewsCard } from './NewsCard';

type NewsListProps = {
  items: NewsItem[];
  pageSize?: number;
};

export function NewsList({ items, pageSize = 10 }: NewsListProps) {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const hasMore = visibleCount < items.length;
  const itemsToRender = useMemo(() => items.slice(0, visibleCount), [items, visibleCount]);

  useEffect(() => {
    if (!hasMore) {
      return;
    }

    const sentinel = sentinelRef.current;
    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCount((prev) => Math.min(prev + pageSize, items.length));
            obs.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '200px 0px',
      },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasMore, items.length, pageSize]);

  return (
    <div className={styles.list}>
      {itemsToRender.map((item) => (
        <NewsCard key={item.id} item={item} />
      ))}
      {hasMore && <div ref={sentinelRef} className={styles.sentinel} />}
    </div>
  );
}

