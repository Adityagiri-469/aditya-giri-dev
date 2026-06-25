'use client';

import styles from './SkillsGrid.module.css';

/**
 * SkillsGrid
 * -----------
 * Renders skills grouped into labeled rows (Languages, Tools, etc.),
 * each item a small glass pill. Pure presentation — entrance animation
 * is driven by the parent (AboutSection) via refs/ScrollTrigger so it
 * stays in the same reveal sequence as the rest of the section.
 */
export default function SkillsGrid({ groups, innerRef }) {
  return (
    <div ref={innerRef} className={styles.grid}>
      {groups.map((group) => (
        <div key={group.label} className={styles.row}>
          <span className={styles.rowLabel}>{group.label}</span>
          <div className={styles.pills}>
            {group.items.map((item) => (
              <span key={item} className={styles.pill}>
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
