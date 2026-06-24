'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ServicesSection.module.css';

export default function ServicesSection({
  id = 'services',
  eyebrow = 'WHAT I DO',
  heading = 'Services',
  services = [
    {
      title: 'Responsive Web Design',
      description:
        'Building clean, mobile-first layouts that hold up across every screen size, using semantic HTML5 and modern CSS3.',
    },
    {
      title: 'Frontend Development',
      description:
        'Turning designs into functional, interactive pages with vanilla JavaScript — solid fundamentals over unnecessary frameworks.',
    },
    {
      title: 'Version Control & Deployment',
      description:
        'Managing projects with Git & GitHub, and shipping live, deployable sites that are easy to maintain and update.',
    },
    {
      title: 'Currently Expanding Into',
      description:
        'Full-stack development, Data Structures & Algorithms, and modern JavaScript — leveling up from static sites to dynamic, data-driven applications.',
    },
  ],
}) {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set([headerRef.current, ...listRef.current.children], {
          opacity: 1,
          y: 0,
        });
        return;
      }

      gsap.set(headerRef.current, { opacity: 0, y: 24 });
      gsap.set(listRef.current.children, { opacity: 0, y: 26 });

      gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
      })
        .to(headerRef.current, { opacity: 1, y: 0, duration: 0.8 })
        .to(
          listRef.current.children,
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 },
          0.2
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id={id} ref={sectionRef} className={styles.section}>
      <div ref={headerRef} className={styles.header}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2 className={styles.heading}>{heading}</h2>
      </div>

      <div ref={listRef} className={styles.list}>
        {services.map((service, i) => (
          <div key={service.title} className={styles.row}>
            <span className={styles.index}>{String(i + 1).padStart(2, '0')}</span>
            <div className={styles.rowContent}>
              <h3 className={styles.rowTitle}>{service.title}</h3>
              <p className={styles.rowDescription}>{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
