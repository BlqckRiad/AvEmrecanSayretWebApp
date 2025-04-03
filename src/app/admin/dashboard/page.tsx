'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import '../adminglobal.css';
import Cookies from 'js-cookie';

interface ContactMessage {
  id: number;
  full_name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    const checkAuth = () => {
      const isAdmin = Cookies.get('adminSession');
      if (!isAdmin) {
        toast.error('Lütfen önce giriş yapın');
        router.push('/admin/login');
      }
    };

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      setMessages(data || []);
    };

    checkAuth();
    fetchMessages();
  }, []);

  const handleLogout = () => {
    Cookies.remove('adminSession');
    router.push('/admin/login');
    toast.success('Çıkış yapıldı');
  };

  return (
    <div className="admin-page">
      <nav className="admin-navbar">
        <div className="admin-container">
          <div className="admin-navbar-content">
            <h1 className="admin-title mb-0">Admin Dashboard</h1>
            <div className="flex gap-4">
              <button
                onClick={() => router.push('/admin/blog')}
                className="admin-button admin-button-primary"
              >
                Blog Yönetimi
              </button>
              <button
                onClick={() => router.push('/admin/categories')}
                className="admin-button admin-button-primary"
              >
                Kategori Yönetimi
              </button>
              <button
                onClick={() => router.push('/admin/contact')}
                className="admin-button admin-button-primary"
              >
                İletişim Mesajları
              </button>
              <button
                onClick={handleLogout}
                className="admin-button admin-button-danger"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="admin-container py-8">
        <div className="admin-card">
          <h2 className="admin-title">İletişim Mesajları</h2>
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ad Soyad</th>
                  <th>Email</th>
                  <th>Konu</th>
                  <th>Mesaj</th>
                  <th>Tarih</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((message: ContactMessage) => (
                  <tr key={message.id}>
                    <td>{message.full_name}</td>
                    <td>{message.email}</td>
                    <td>{message.subject}</td>
                    <td>{message.message}</td>
                    <td>
                      {new Date(message.created_at).toLocaleDateString('tr-TR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
} 