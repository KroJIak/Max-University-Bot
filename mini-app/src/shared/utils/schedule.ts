import type { ScheduleItem, SubgroupSelection } from '../types/schedule';

const matchMap: Record<SubgroupSelection, 'all' | 'subgroup1' | 'subgroup2' | null> = {
  full: null,
  subgroup1: 'subgroup1',
  subgroup2: 'subgroup2',
};

export function filterLessonsBySubgroup(
  lessons: ScheduleItem[],
  subgroup: SubgroupSelection,
): ScheduleItem[] {
  const required = matchMap[subgroup];

  if (!required) {
    return lessons;
  }

  return lessons.filter((lesson) => {
    if (!lesson.audience || lesson.audience === 'all') {
      return true;
    }

    return lesson.audience === required;
  });
}


