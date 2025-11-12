import { NewsList } from '@components/NewsFeed';
import { newsItems } from '../MainPage/data';
import styles from './NewsPage.module.scss';

export function NewsPage() {
  return (
    <div className={styles.page}>
      <NewsList items={newsItems} pageSize={10} />
    </div>
  );
}

