export type ScheduleType = 'lecture' | 'practice';

export type LessonAudience = 'all' | 'subgroup1' | 'subgroup2';

export type SubgroupSelection = 'full' | 'subgroup1' | 'subgroup2';

export type ScheduleItem = {
  id: string;
  start: string;
  end: string;
  title: string;
  type: ScheduleType;
  room: string;
  note: string;
  audience?: LessonAudience;
};

export type DayTab = {
  id: string;
  label: string;
  description: string;
};

