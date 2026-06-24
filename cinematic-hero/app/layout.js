import './globals.css';

// NOTE: Replace this with your real deployed URL once you have one
// (e.g. https://aditya-giri.vercel.app). It's used to resolve the
// social-preview image paths below into full URLs.
const siteUrl = 'https://aditya-giri-portfolio.vercel.app';

export const metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: 'Aditya Giri | Frontend Developer Portfolio',
    template: '%s | Aditya Giri',
  },
  description:
    'Portfolio of Aditya Giri, a frontend developer building clean, responsive websites with HTML, CSS, and JavaScript. Explore projects, skills, and ways to get in touch.',
  keywords: [
    'Aditya Giri',
    'Aditya Giri portfolio',
    'Frontend Developer',
    'Web Developer Portfolio',
    'HTML CSS JavaScript Developer',
    'Responsive Web Design',
    'Junior Web Developer',
    'Python Developer',
    'GitHub Portfolio',
    'Web Developer India',
  ],
  authors: [{ name: 'Aditya Giri' }],
  creator: 'Aditya Giri',

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: 'Aditya Giri | Frontend Developer Portfolio',
    description:
      'Portfolio of Aditya Giri, a frontend developer building clean, responsive websites with HTML, CSS, and JavaScript.',
    url: siteUrl,
    siteName: 'Aditya Giri Portfolio',
    images: ['/images/og-image.jpg'],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Aditya Giri | Frontend Developer Portfolio',
    description:
      'Portfolio of Aditya Giri, a frontend developer building clean, responsive websites with HTML, CSS, and JavaScript.',
    images: ['/images/og-image.jpg'],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0907',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
