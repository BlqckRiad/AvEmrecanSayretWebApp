'use client';

import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Av. Emrecan Sayret</h1>
            <p>
              Hukuki süreçlerinizde profesyonel destek ve danışmanlık hizmeti.
              Uzman kadromuzla yanınızdayız.
            </p>
            <div className="hero-buttons">
              <Link href="/iletisim" className="button button-primary">
                Randevu Alın
              </Link>
              <Link href="/hizmetlerimiz" className="button button-secondary" style={{ marginLeft: '1rem' }}>
                Hizmetlerimiz
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <Image
              src="/images/lawyer-hero.jpg"
              alt="Av. Emrecan Sayret"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
} 