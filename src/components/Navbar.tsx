'use client'

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [homepageUrl, setHomepageUrl] = useState('https://emrecansayret.com');
  const router = useRouter();

  const navigation = [
    { name: 'Ana Sayfa', href: '/home' },
    { name: 'Hizmetlerimiz', href: '/hizmetlerimiz' },
    { name: 'Blog', href: '/blog' },
    { name: 'İletişim', href: '/iletisim' },
  ];

  const handleNavigation = (href: string) => {
    setIsMenuOpen(false);
    if (href.startsWith('http')) {
      window.location.href = href;
    } else {
      router.push(href);
    }
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link 
          href={homepageUrl || '/'} 
          className="navbar-brand"
          onClick={(e) => {
            if (homepageUrl) {
              e.preventDefault();
              window.location.href = homepageUrl;
            }
          }}
        >
          Av. Emrecan Sayret
        </Link>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="navbar-link"
              onClick={(e) => {
                if (item.href.startsWith('http')) {
                  e.preventDefault();
                  handleNavigation(item.href);
                } else {
                  setIsMenuOpen(false);
                }
              }}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <button
          className="navbar-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
} 