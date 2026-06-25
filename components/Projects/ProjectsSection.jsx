'use client';

import styles from './ProjectsSection.module.css';

/**
 * ProjectsSection
 * ----------------
 * Each card is `position: sticky` with a slightly increasing `top` offset
 * per index — as the page scrolls, each new card slides up and settles a
 * little lower than the last, fanning into a stack rather than instantly
 * snapping over the previous one. Pure CSS, no JS animation required.
 */
export default function ProjectsSection({
  id = 'work',
  eyebrow = 'SELECTED WORK',
  heading = 'Projects',
  projects = [
    {
      category: 'Personal Project',
      title: 'Calculator App',
      description:
        'A clean, responsive calculator built to nail the fundamentals — semantic HTML, modular CSS, and vanilla JavaScript logic with no framework crutches.',
      href: 'https://adityagiri-469.github.io/reckon--calculator/',
    },
    {
      category: 'Personal Project',
      title: 'FixItPro',
      description:
        'A home appliance services website connecting customers with repair technicians — built with clear service categories and a frictionless booking flow.',
      href: 'https://adityagiri-469.github.io/FixitPro-Home-Appliance-Servives/',
    },
    {
      category: 'Personal Project',
      title: 'Shine Bridal Studio',
      description:
        'A bridal studio showcase site designed to feel as polished as the work it represents — a gallery-driven layout with a soft, elegant visual language.',
      href: 'https://adityagiri-469.github.io/shine-beauty-bridal-studio/',
    },
  ],
}) {
  return (
    <section id={id} className={styles.section}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2 className={styles.heading}>{heading}</h2>
      </div>

      <div className={styles.stack}>
        {projects.map((project, i) => (
          <div
            key={project.title}
            className={styles.card}
            style={{ top: `calc(6vh + ${i * 18}px)`, zIndex: i + 1 }}
          >
            <div className={styles.cardTop}>
              <span className={styles.cardIndex}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className={styles.cardCategory}>{project.category}</span>
              {project.href && (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.liveLink}
                >
                  Live Project ↗
                </a>
              )}
            </div>

            <h3 className={styles.cardTitle}>{project.title}</h3>
            <p className={styles.cardDescription}>{project.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
