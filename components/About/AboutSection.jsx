'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SkillsGrid from './SkillsGrid';
import styles from './AboutSection.module.css';

/**
 * AboutSection
 * -------------
 * The panel that slides up over the hero. Continues the hero's "film reel"
 * motif (FRAME 02 label) so the two sections read as one continuous piece,
 * but otherwise calms down: no video, no particles — just type, a portrait
 * frame, a skills grid, and a quiet stagger reveal triggered on scroll.
 */
export default function AboutSection({
  id = 'about',
  eyebrow = 'ABOUT',
  frameLabel = 'FRAME 02',
  heading = 'I build clean, responsive websites — and I am leveling up fast.',
  paragraphs = [
    "I'm Aditya, a frontend developer focused on building clean, responsive websites with HTML, CSS, and JavaScript. I like keeping things simple: solid fundamentals over framework shortcuts, and interfaces that work well on every screen.",
    "Right now I'm deepening my JavaScript, picking up Data Structures & Algorithms, and working toward full-stack development — turning static pages into dynamic, data-driven applications.",
  ],
  skillGroups = [
    {
      label: 'Languages & Web',
      items: ['HTML5', 'CSS3', 'JavaScript', 'Python', 'Java (Basic)'],
    },
    {
      label: 'Tools & Practices',
      items: ['Git', 'GitHub', 'VS Code', 'Responsive Web Design'],
    },
    {
      label: 'Currently Learning',
      items: ['Data Structures & Algorithms', 'Full-Stack Development'],
    },
    {
      label: 'Soft Skills',
      items: ['Problem Solving', 'Team Collaboration', 'Quick Learning', 'Communication'],
    },
  ],
  portraitSrc,
}) {
  const sectionRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headingRef = useRef(null);
  const bodyRef = useRef(null);
  const skillsRef = useRef(null);
  const portraitRef = useRef(null);
  const [portraitFailed, setPortraitFailed] = useState(!portraitSrc);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          [
            eyebrowRef.current,
            headingRef.current,
            bodyRef.current,
            skillsRef.current,
            portraitRef.current,
          ],
          { opacity: 1, y: 0, clearProps: 'transform' }
        );
        return;
      }

      gsap.set(
        [eyebrowRef.current, headingRef.current, bodyRef.current],
        { opacity: 0, y: 28 }
      );
      gsap.set(portraitRef.current, { opacity: 0, y: 36, scale: 0.97 });
      gsap.set(skillsRef.current.children, { opacity: 0, y: 20 });

      gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      })
        .to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.7 })
        .to(headingRef.current, { opacity: 1, y: 0, duration: 0.9 }, 0.08)
        .to(portraitRef.current, { opacity: 1, y: 0, scale: 1, duration: 1 }, 0.15)
        .to(bodyRef.current, { opacity: 1, y: 0, duration: 0.8 }, 0.3)
        .to(
          skillsRef.current.children,
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
          0.45
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id={id} ref={sectionRef} className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.textCol}>
          <p ref={eyebrowRef} className={styles.eyebrow}>
            {eyebrow}
          </p>

          <h2 ref={headingRef} className={styles.heading}>
            {heading}
          </h2>

          <div ref={bodyRef} className={styles.body}>
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>

        <div ref={portraitRef} className={styles.portraitCol}>
          <span className={styles.frameLabel}>{frameLabel}</span>
          {!portraitFailed ? (
            <img
              src={portraitSrc}
              alt="Portrait"
              className={styles.portraitImg}
              onError={() => setPortraitFailed(true)}
            />
          ) : (
            <div className={styles.portraitFallback}>
              <p>
                Add your photo to <code>cinematic-hero/public/images/portrait.jpg</code>
              </p>
            </div>
          )}
        </div>
      </div>

      <SkillsGrid groups={skillGroups} innerRef={skillsRef} />
    </section>
  );
}
