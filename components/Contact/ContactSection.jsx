'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ContactSection.module.css';

export default function ContactSection({
  id = 'contact',
  eyebrow = 'PICK WHICHEVER CHANNEL SUITS YOU',
  heading = 'Get in Touch',
  channels = [
    { label: 'Email', value: 'adityagiri12100@gmail.com', href: 'mailto:adityagiri12100@gmail.com' },
    { label: 'WhatsApp', value: '+91 7428620561', href: 'https://wa.me/917428620561' },
    {
      label: 'LinkedIn',
      value: '@adityagiri',
      href: 'https://www.linkedin.com/in/aditya-giri-149681400/',
    },
    { label: 'GitHub', value: '@Adityagiri-469', href: 'https://github.com/Adityagiri-469' },
  ],
}) {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set([headingRef.current, ...gridRef.current.children], {
          opacity: 1,
          y: 0,
        });
        return;
      }

      gsap.set(headingRef.current, { opacity: 0, y: 24 });
      gsap.set(gridRef.current.children, { opacity: 0, y: 26 });

      gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
      })
        .to(headingRef.current, { opacity: 1, y: 0, duration: 0.8 })
        .to(
          gridRef.current.children,
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 },
          0.2
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id={id} ref={sectionRef} className={styles.section}>
      <div ref={headingRef} className={styles.header}>
        <h2 className={styles.heading}>{heading}</h2>
        <p className={styles.eyebrow}>{eyebrow}</p>
      </div>

      <div ref={gridRef} className={styles.grid}>
        {channels.map((channel) => (
          <a
            key={channel.label}
            href={channel.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.card}
          >
            <span className={styles.arrow}>↗</span>
            <span className={styles.cardLabel}>{channel.label}</span>
            <span className={styles.cardValue}>{channel.value}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
