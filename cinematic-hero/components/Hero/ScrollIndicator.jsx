'use client';

import styles from './ScrollIndicator.module.css';

export default function ScrollIndicator({ onClick, label = 'Scroll' }) {
  return (
    <button type="button" className={styles.indicator} onClick={onClick} aria-label="Scroll to next section">
      <span className={styles.label}>{label}</span>
      <span className={styles.line}>
        <span className={styles.pulse} />
      </span>
    </button>
  );
}
