import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import type { SubgroupSelection } from '../types/schedule';

type SubgroupContextValue = {
  subgroup: SubgroupSelection;
  setSubgroup: (value: SubgroupSelection) => void;
};

const STORAGE_KEY = 'max-university-subgroup';

const SubgroupContext = createContext<SubgroupContextValue | null>(null);

const SUBGROUP_OPTIONS: { id: SubgroupSelection; label: string }[] = [
  { id: 'full', label: 'Вся группа' },
  { id: 'subgroup1', label: 'Подгруппа 1' },
  { id: 'subgroup2', label: 'Подгруппа 2' },
];

const FALLBACK_SUBGROUP: SubgroupSelection = 'full';

function readStoredSubgroup(): SubgroupSelection {
  if (typeof window === 'undefined') {
    return FALLBACK_SUBGROUP;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'subgroup1' || stored === 'subgroup2' || stored === 'full') {
    return stored;
  }

  return FALLBACK_SUBGROUP;
}

export function SubgroupProvider({ children }: PropsWithChildren) {
  const [subgroup, setSubgroupState] = useState<SubgroupSelection>(() => readStoredSubgroup());

  const setSubgroup = useCallback((value: SubgroupSelection) => {
    setSubgroupState(value);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, subgroup);
  }, [subgroup]);

  const value = useMemo<SubgroupContextValue>(
    () => ({
      subgroup,
      setSubgroup,
    }),
    [subgroup, setSubgroup],
  );

  return <SubgroupContext.Provider value={value}>{children}</SubgroupContext.Provider>;
}

export function useSubgroup(): SubgroupContextValue {
  const context = useContext(SubgroupContext);

  if (!context) {
    throw new Error('useSubgroup must be used within SubgroupProvider');
  }

  return context;
}

export function useSubgroupOptions() {
  return SUBGROUP_OPTIONS;
}


