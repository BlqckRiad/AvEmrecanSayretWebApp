import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Av. Emrecan Sayret</h3>
            <p>
              Profesyonel hukuki danışmanlık ve avukatlık hizmetleri için bizimle iletişime geçin.
            </p>
            <div className="footer-contact">
              <p>📞 0555 015 3160</p>
              <p>✉️ emrecansayret@gmail.com</p>
              <p>📍 Sultanbeyli/İSTANBUL</p>
            </div>
          </div>

          <div className="footer-section">
            <h3>Hızlı Bağlantılar</h3>
            <ul className="footer-links">
              <li>
                <Link href="/">Ana Sayfa</Link>
              </li>
              <li>
                <Link href="/hizmetlerimiz">Hizmetlerimiz</Link>
              </li>
              <li>
                <Link href="/iletisim">İletişim</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Çalışma Saatleri</h3>
            <div className="working-hours">
              <p>
                <strong>Pazartesi - Cuma:</strong>
                <br />
                09:00 - 18:00
              </p>
              <p>
                <strong>Cumartesi - Pazar:</strong>
                <br />
                Kapalı
              </p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} Av. Emrecan Sayret. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
} 