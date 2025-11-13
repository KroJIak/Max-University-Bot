import { useSubgroup, useSubgroupOptions } from '@shared/state/subgroup';
import styles from './Profile.module.scss';

export function ProfileSubgroupSection() {
  const { subgroup, setSubgroup } = useSubgroup();
  const options = useSubgroupOptions();

  return (
    <section className={`${styles.card} ${styles.subgroupCard}`}>
      <div className={styles.subgroupLabel}>Подгруппа</div>
      <div className={styles.subgroupButtons}>
        {options.map((option) => {
          const isActive = subgroup === option.id;
          return (
            <button
              key={option.id}
              type="button"
              className={isActive ? `${styles.subgroupButton} ${styles.subgroupButtonActive}` : styles.subgroupButton}
              onClick={() => setSubgroup(option.id)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      <p className={styles.subgroupHint}>Используется для отображения пар по подгруппам</p>
    </section>
  );
}


