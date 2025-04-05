'use client';

const services = [
  {
    title: "Aile Hukuku",
    description: "Boşanma, nafaka, velayet ve miras davalarında profesyonel hukuki destek sağlıyoruz. Aile hukukunda uzman kadromuzla yanınızdayız.",
    icon: "⚖️"
  },
  {
    title: "Ceza Hukuku",
    description: "Ceza davalarında savunma ve hukuki danışmanlık hizmetleri sunuyoruz. Tecrübeli ekibimizle haklarınızı koruyoruz.",
    icon: "🏛️"
  },
  {
    title: "Ticaret Hukuku",
    description: "Şirket kurulumu, ticari davalar ve sözleşme hazırlama konularında kapsamlı hukuki danışmanlık hizmeti veriyoruz.",
    icon: "📋"
  },
  {
    title: "İş Hukuku",
    description: "İşçi-işveren uyuşmazlıkları ve iş davalarında uzman kadromuzla çözüm odaklı hizmet sunuyoruz.",
    icon: "💼"
  },
  {
    title: "İcra Hukuku ve Alacak Takibi",
    description: "Alacak tahsili, icra takibi ve iflas süreçlerinde profesyonel hukuki destek sağlıyoruz.",
    icon: "📊"
  },
  {
    title: "Vergi Hukuku",
    description: "Vergi uyuşmazlıkları, vergi denetimleri ve vergi planlaması konularında uzman hukuki danışmanlık hizmeti veriyoruz.",
    icon: "💰"
  },
];

export default function Services() {
  return (
    <section className="services">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2>Uzmanlık Alanlarımız</h2>
          <p>
            Hukuki süreçlerinizde profesyonel ve güvenilir çözümler sunuyoruz
          </p>
        </div>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">
                <span style={{ fontSize: '2rem' }}>{service.icon}</span>
              </div>
              <h3 className="service-title">{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 