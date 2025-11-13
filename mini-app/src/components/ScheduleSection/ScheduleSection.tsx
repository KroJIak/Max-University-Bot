import { useMemo, useState } from 'react';

import { ArrowRightIcon } from '@components/icons';
import { useSubgroup } from '@shared/state/subgroup';
import { filterLessonsBySubgroup } from '@shared/utils/schedule';
import type { DayTab, ScheduleItem } from '@shared/types/schedule';
import { ScheduleCard } from './ScheduleCard';
import { ScheduleTabs } from './ScheduleTabs';
import styles from './ScheduleSection.module.scss';

type ScheduleSectionProps = {
  title?: string;
  tabs: DayTab[];
  scheduleByTab: Record<string, ScheduleItem[]>;
  onOpenFullSchedule?: () => void;
};

export function ScheduleSection({
  title = 'Расписание',
  tabs,
  scheduleByTab,
  onOpenFullSchedule,
}: ScheduleSectionProps) {
  const [activeTab, setActiveTab] = useState(() => tabs[0]?.id ?? '');
  const { subgroup } = useSubgroup();

  const schedule = useMemo(() => {
    if (!activeTab) {
      return [];
    }

    const lessons = scheduleByTab[activeTab] ?? [];
    return filterLessonsBySubgroup(lessons, subgroup);
  }, [activeTab, scheduleByTab, subgroup]);

  if (!tabs.length) {
    return null;
  }

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <button
          className={styles.moreButton}
          type="button"
          aria-label="Открыть расписание"
          onClick={onOpenFullSchedule}
        >
          <ArrowRightIcon className={styles.moreIcon} />
        </button>
      </header>

      <ScheduleTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className={styles.list}>
        {schedule.map((lesson) => (
          <ScheduleCard key={lesson.id} item={lesson} />
        ))}
      </div>
    </section>
  );
}

