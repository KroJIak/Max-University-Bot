import type { ScheduleItem } from '../../shared/types/schedule';
import { ScheduleCard } from '@components/ScheduleSection/components/ScheduleCard';
import styles from './ScheduleDetail.module.scss';

type ScheduleLessonsProps = {
  items: ScheduleItem[];
};

export function ScheduleLessons({ items }: ScheduleLessonsProps) {
  return (
    <section className={styles.listWrapper}>
      <h2 className={styles.listTitle}>Расписание</h2>
      {items.length ? (
        <div className={styles.list}>
          {items.map((lesson) => (
            <ScheduleCard key={lesson.id} item={lesson} />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>На выбранную дату занятий нет</div>
      )}
    </section>
  );
}

