'use client';
import FooterLinks from './FooterLinks';

export interface FooterLink {
  text: string;
  href: string;
}

export interface SocialLink {
  platform: string;
  href: string;
  target?: string;
}

export interface FooterData {
  columns: {links: FooterLink[]}[];
  socials: SocialLink[];
  // copyright: string;
}

// const getCurrentYear = () => new Date().getFullYear();

const footerData = {
  columns: [
    {
      links: [
        {text: 'HJÄLP', href: '/hjalp'},
        {text: 'MINA KÖP', href: '/mina-kop'},
        {text: 'RETURNERINGAR', href: '/returneringar'},
      ],
    },
    {
      links: [
        {text: 'FÖRETAG', href: '/foretag'},
        {text: 'PRESS', href: '/press'},
      ],
    },
    {
      links: [
        {text: 'NIKLAS OUTLET', href: '/niklas-outlet'},
        {text: 'SITE MAP', href: '/site-map'},
        {text: 'HÅLLBARHET', href: '/hallbarhet'},
      ],
    },
    {
      links: [
        {text: 'PRESENTKUPONG', href: '/presentkupong'},
        {text: 'BUTIKER', href: '/butiker'},
      ],
    },
  ],
  socials: [
    {platform: 'INSTAGRAM', href: 'https:/instagram.com', target: '_blank'},
    {platform: 'FACEBOOK', href: 'https:/facebook.com', target: '_blank'},
    {platform: 'YOUTUBE', href: 'https:/youtube.com', target: '_blank'},
    {platform: 'X', href: 'https:/x.com', target: '_blank'},
    {platform: 'TIKTOK', href: 'https:/tiktok.com', target: '_blank'},
    {platform: 'SPOTIFY', href: 'https:/spotify.com', target: '_blank'},
    {platform: 'PINTEREST', href: 'https:/pinterest.com', target: '_blank'},
    {
      platform: 'LINKEDIN',
      href: 'https:/linkedin.com/company',
      target: '_blank',
    },
  ],

  // copyright: `${getCurrentYear()} - Designed by Nikas`,
};

function Footer() {
  return (
    <footer className='text-black border-t border-gray-100'>
      <FooterLinks data={footerData} />
    </footer>
  );
}

export default Footer;
