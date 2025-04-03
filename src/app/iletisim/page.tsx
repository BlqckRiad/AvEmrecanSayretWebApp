'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import toast from 'react-hot-toast';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } = await supabase
        .from('iletisim')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          is_checked: false
        }]);

      if (error) throw error;

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      toast.success('Mesajınız başarıyla gönderildi');
    } catch (error: any) {
      console.error('Error sending message:', error);
      setError(error.message || 'Mesaj gönderilirken bir hata oluştu');
      toast.error('Mesaj gönderilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="contact">
        <div className="container">
          <h1 className="text-center text-4xl font-playfair font-bold text-primary mb-8">
            İletişim
          </h1>
          
          <div className="contact-container">
            <div className="contact-info">
              <h3>İletişim Bilgileri</h3>
              <div className="contact-detail">
                <span>📞</span>
                <a href="tel:05550153160" className="text-white hover:opacity-80">
                  0555 015 3160
                </a>
              </div>
              <div className="contact-detail">
                <span>✉️</span>
                <a href="mailto:emrecansayret@gmail.com" className="text-white hover:opacity-80">
                  emrecan.sayret@gmail.com
                </a>
              </div>
              <div className="contact-detail">
                <span>📍</span>
                <p>Sultanbeyli/İSTANBUL</p>
              </div>
              <div className="contact-detail">
                <span>⏰</span>
                <div>
                  <p>Pazartesi - Cuma: 09:00 - 18:00</p>
                  <p>Cumartesi - Pazar: Kapalı</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Adınız Soyadınız</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">E-posta Adresiniz</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Telefon Numaranız</label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Konu</label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Mesajınız</label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                />
              </div>

              <button
                type="submit"
                className="button button-primary w-full"
                disabled={loading}
              >
                {loading ? 'Gönderiliyor...' : 'Gönder'}
              </button>

              {success && (
                <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg">
                  Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}
            </form>
          </div>

          {/* Google Harita */}
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24087.42849407038!2d29.253663239550777!3d40.96021770000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cad0a96722e653%3A0x3c0ec4b87c16f3be!2sSultanbeyli%2C%20%C4%B0stanbul!5e0!3m2!1str!2str!4v1647887817534!5m2!1str!2str"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 