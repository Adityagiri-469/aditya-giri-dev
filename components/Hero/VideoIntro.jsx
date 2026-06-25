'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import CinematicLayer from './CinematicLayer';
import HeroControls from './HeroControls';
import ScrollIndicator from './ScrollIndicator';
import styles from './VideoIntro.module.css';

/**
 * VideoIntro
 * -----------
 * Fullscreen cinematic hero. Composition (back to front):
 *  1. Blurred ambient duplicate video (fills frame, heavy blur, scaled up)
 *  2. Sharp foreground video, masked at top/bottom so the ambient glow
 *     bleeds through exactly where the dark readability gradients sit
 *  3. Dark gradient + vignette overlays for text contrast
 *  4. Three.js bokeh particle layer (CinematicLayer)
 *  5. Letterbox bars (signature reveal: curtain-open on load)
 *  6. Foreground content: eyebrow, stacked name, subtitle, timecode
 *  7. Controls (play/pause, mute, sound hint) + scroll indicator
 */
export default function VideoIntro({
  videoSrc = '/videos/hero.mp4',
  posterSrc,
  eyebrow = 'FRONTEND ENGINEER — SHOWREEL',
  firstName = 'ADITYA',
  lastName = 'GIRI',
  subtitle = 'Creative engineer crafting immersive, motion-driven interfaces with React, Three.js & WebGL.',
  reelLabel = 'REEL 01',
  nextSectionId = 'work',
}) {
  const containerRef = useRef(null);
  const fgVideoRef = useRef(null);
  const bgVideoRef = useRef(null);
  const topBarRef = useRef(null);
  const bottomBarRef = useRef(null);
  const videoLayerRef = useRef(null);
  const eyebrowRef = useRef(null);
  const nameLine1Ref = useRef(null);
  const nameLine2Ref = useRef(null);
  const subtitleRef = useRef(null);
  const timecodeRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showSoundHint, setShowSoundHint] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [videoFailed, setVideoFailed] = useState(false);

  // ---- GSAP entrance sequence ------------------------------------------
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          [
            videoLayerRef.current,
            eyebrowRef.current,
            nameLine1Ref.current,
            nameLine2Ref.current,
            subtitleRef.current,
            timecodeRef.current,
          ],
          { opacity: 1, y: 0, clearProps: 'transform' }
        );
        gsap.set([topBarRef.current, bottomBarRef.current], { height: '4%' });
        return;
      }

      gsap.set(topBarRef.current, { height: '42%' });
      gsap.set(bottomBarRef.current, { height: '42%' });
      gsap.set(videoLayerRef.current, { opacity: 0 });
      gsap.set(
        [eyebrowRef.current, subtitleRef.current, timecodeRef.current],
        { opacity: 0, y: 18 }
      );
      gsap.set([nameLine1Ref.current, nameLine2Ref.current], {
        opacity: 0,
        yPercent: 100,
      });

      const tl = gsap.timeline({ delay: 0.15, defaults: { ease: 'power3.out' } });

      tl.to(videoLayerRef.current, { opacity: 1, duration: 1.1 })
        .to(
          [topBarRef.current, bottomBarRef.current],
          { height: '4%', duration: 1.3, ease: 'expo.out' },
          0.1
        )
        .to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.8 }, 0.7)
        .to(
          nameLine1Ref.current,
          { opacity: 1, yPercent: 0, duration: 1, ease: 'expo.out' },
          0.85
        )
        .to(
          nameLine2Ref.current,
          { opacity: 1, yPercent: 0, duration: 1, ease: 'expo.out' },
          0.97
        )
        .to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.8 }, 1.35)
        .to(timecodeRef.current, { opacity: 1, y: 0, duration: 0.7 }, 1.5);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // ---- Auto-hide "tap for sound" hint -----------------------------------
  useEffect(() => {
    const timer = setTimeout(() => setShowSoundHint(false), 4500);
    return () => clearTimeout(timer);
  }, []);

  // ---- Live timecode synced to real video playback ----------------------
  useEffect(() => {
    const video = fgVideoRef.current;
    if (!video) return;
    const handleTimeUpdate = () => setElapsed(video.currentTime || 0);
    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, []);

  const formattedTime = formatTimecode(elapsed);

  // ---- Controls handlers --------------------------------------------------
  const togglePlay = useCallback(() => {
    const fg = fgVideoRef.current;
    const bg = bgVideoRef.current;
    if (!fg) return;
    if (isPlaying) {
      fg.pause();
      bg?.pause();
      setIsPlaying(false);
    } else {
      fg.play().catch(() => {});
      bg?.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    const fg = fgVideoRef.current;
    if (!fg) return;
    const next = !isMuted;
    fg.muted = next;
    setIsMuted(next);
    setShowSoundHint(false);
  }, [isMuted]);

  const handleScrollClick = useCallback(() => {
    const target = document.getElementById(nextSectionId);
    target?.scrollIntoView({ behavior: 'smooth' });
  }, [nextSectionId]);

  return (
    <div className={styles.stickyWrapper}>
      <section ref={containerRef} className={styles.hero} aria-label="Introduction">
        <div ref={videoLayerRef} className={styles.videoLayer}>
          {/* Blurred ambient duplicate */}
          <video
            ref={bgVideoRef}
            className={styles.bgVideo}
            src={videoSrc}
            poster={posterSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
          />

          {/* Sharp foreground video */}
          {!videoFailed ? (
            <video
              ref={fgVideoRef}
              className={styles.fgVideo}
              src={videoSrc}
              poster={posterSrc}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              preload="auto"
              onError={() => setVideoFailed(true)}
            />
          ) : (
            <div className={styles.videoFallback}>
              <p>Add your video to <code>/public/videos/hero.mp4</code></p>
            </div>
          )}
        </div>

        {/* Readability overlays */}
        <div className={styles.gradientTop} aria-hidden="true" />
        <div className={styles.gradientBottom} aria-hidden="true" />
        <div className={styles.vignette} aria-hidden="true" />

        

        {/* Letterbox curtain bars (signature reveal element) */}
        <div ref={topBarRef} className={styles.letterboxTop} aria-hidden="true" />
        <div ref={bottomBarRef} className={styles.letterboxBottom} aria-hidden="true" />

        {/* Live reel timecode */}
        <div ref={timecodeRef} className={styles.timecode}>
          {reelLabel} <span className={styles.timecodeDivider}>—</span> {formattedTime}
        </div>

        {/* Foreground content */}
        <div className={styles.content}>
          <p ref={eyebrowRef} className={styles.eyebrow}>
            {eyebrow}
          </p>

          <h1 className={styles.name}>
            <span ref={nameLine1Ref} className={styles.nameLine}>
              {firstName}
            </span>
            <span ref={nameLine2Ref} className={styles.nameLine}>
              {lastName}
            </span>
          </h1>

          <p ref={subtitleRef} className={styles.subtitle}>
            {subtitle}
          </p>
        </div>

        <HeroControls
          isPlaying={isPlaying}
          isMuted={isMuted}
          showSoundHint={showSoundHint}
          onTogglePlay={togglePlay}
          onToggleMute={toggleMute}
        />

        <ScrollIndicator onClick={handleScrollClick} />
      </section>
    </div>
  );
}

function formatTimecode(seconds) {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `00:${mins}:${secs}`;
}
