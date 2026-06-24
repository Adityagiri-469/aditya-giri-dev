'use client';

import styles from './HeroControls.module.css';

export default function HeroControls({
  isPlaying,
  isMuted,
  showSoundHint,
  onTogglePlay,
  onToggleMute,
}) {
  return (
    <div className={styles.controls}>
      {showSoundHint && (
        <div className={styles.soundHint} aria-hidden="true">
          <span className={styles.soundHintPulse} />
          Tap for sound
        </div>
      )}

      <div className={styles.glassCluster}>
        <button
          type="button"
          className={styles.glassButton}
          onClick={onTogglePlay}
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
              <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M7 5.5v13a1 1 0 0 0 1.52.85l11-6.5a1 1 0 0 0 0-1.7l-11-6.5A1 1 0 0 0 7 5.5Z" fill="currentColor" />
            </svg>
          )}
        </button>

        <span className={styles.divider} aria-hidden="true" />

        <button
          type="button"
          className={styles.glassButton}
          onClick={onToggleMute}
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        >
          {isMuted ? (
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M4 9v6h4l5 5V4L8 9H4Z" fill="currentColor" />
              <path d="M16.5 9.5 21 14M21 9.5l-4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M4 9v6h4l5 5V4L8 9H4Z" fill="currentColor" />
              <path
                d="M16.2 8.3a5.2 5.2 0 0 1 0 7.4M18.8 5.7a9 9 0 0 1 0 12.6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
