'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const services = [
  {
    title: 'Aile ve Miras Hukuku',
    description: 'Boşanma, nafaka, velayet ve miras davalarında profesyonel hukuki destek sağlıyoruz.',
    details: [
      'Boşanma davaları ve anlaşmalı boşanma süreçleri',
      'Nafaka ve tazminat talepleri',
      'Velayet ve kişisel ilişki tesisi',
    ]
  },
  {
    title: 'Ceza Hukuku Danışmanlığı',
    description: 'Ceza davalarında savunma ve hukuki danışmanlık hizmetleri sunuyoruz.',
    details: [
      'Savunma stratejisi oluşturma ve uygulama',
      'Şikayet ve dava açma süreçleri',
      'Tutuklama ve kefalet talepleri',
    ]
  },
  {
    title: 'Tüketici Hakları Hukuku',
    description: 'Tüketici hakları ihlalleri ve tüketici davalarında hukuki destek sağlıyoruz.',
    details: [
      'Ayıplı mal ve hizmet davaları',
      'Tüketici sözleşmeleri ve iade süreçleri',
      'Sözleşme ihlali ve tazminat talepleri',
    ]
  },
  {
    title: 'İş Hukuku',
    description: 'İşçi-işveren uyuşmazlıkları ve iş davalarında uzman kadromuzla çözüm odaklı hizmet.',
    details: [
      'İş kazası ve meslek hastalığı davaları',
      'Toplu iş hukuku uyuşmazlıkları',
      'İşe iade davaları'
    ]
  },
  {
    title: 'Şirketler ve Ticaret Hukuku',
    description: 'Burayı bir yazı ayarla.',
    details: [
      'Şirket kuruluş ve sözleşmeleri',
      'Hissedar ve ortalıklık sözleşmeleri',      
      'Ticari uyuşmazlık ve alacak davaları',      
    ]
  },
  {
    title: 'Sözleşme Hukuku',
    description: 'Buraya bir yazı ayarla.',
    details: [
      'Ticari sözleşmelerin hazırlanması ve incelenmesi',
      'Sözleşme ihlalleri ve fesih süreçleri',
      'Alacak tahsili ve icra işlemleri',
      
    ]
  },
  {
    title: 'Yabancılar ve Vatandaşlık Hukuku',
    description: 'Buraya bir yazı ayarla.',
    details: [
      'Oturma izni ve çalışma izni başvuruları',
      'Vatandaşlık başvuruları ve süreçleri',
      'Göç hukuku ve vize işlemleri',
    ]
  },
  {
    title: 'Uluslararası Ticaret Hukuku',
    description: 'Buraya bir yazı ayarla.',
    details: [
      'Yabancı yatırım ve şirket açılışları',
      'Uluslararası ticaret sözleşmeleri',
      'Gümrük ve vergi mevzuatı danışmanlığı',
    ]
  },
  {
    title: 'Fikri Mülkiyet Hukuku',
    description: 'Buraya bir yazı ayarla.',
    details: [
      'Marka, patent ve tasarım tescil başvuruları',
      'Telif hakkı ihlalleri ve tazminat talepleri',
      'Lisanslama ve yetkilendirme işlemleri',
    ]
  },
];

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <div className="services-page">
        <div className="container">
          <h1 className="text-center text-4xl font-playfair font-bold text-primary mb-6">
            Hizmetlerimiz
          </h1>
          <p className="services-intro">
            Hukuki süreçlerinizde profesyonel ve güvenilir çözümler sunuyoruz. 
            Uzman kadromuzla her alanda yanınızdayız.
          </p>

          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="service-card-detailed">
                <div className="service-card-left">
                  <h2>{service.title}</h2>
                  <p className="service-description">{service.description}</p>
                </div>
                <div className="service-card-right">
                  <ul className="service-details">
                    {service.details.map((detail, i) => (
                      <li key={i}>
                        <span className="bullet">•</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 