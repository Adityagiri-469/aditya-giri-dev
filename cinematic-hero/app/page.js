import VideoIntro from '../components/Hero/VideoIntro';
import AboutSection from '../components/About/AboutSection';
import ServicesSection from '../components/Services/ServicesSection';
import ProjectsSection from '../components/Projects/ProjectsSection';
import ContactSection from '../components/Contact/ContactSection';

export default function Home() {
  return (
    <main>
      <VideoIntro
        videoSrc="/videos/hero.mp4"
        eyebrow="FRONTEND ENGINEER — SHOWREEL"
        firstName="ADITYA"
        lastName="GIRI"
        subtitle="Creative engineer crafting immersive, motion-driven interfaces with React, Three.js & WebGL."
        reelLabel="REEL 01"
        nextSectionId="about"
      />

      <AboutSection id="about" portraitSrc="/images/portrait.jpg" />
      <ServicesSection id="services" />
      <ProjectsSection id="work" />
      <ContactSection id="contact" />
    </main>
  );
}
