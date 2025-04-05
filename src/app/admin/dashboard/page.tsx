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

interface BlogPost {
  id: number;
  title: string;
  view_count: number;
  is_published: boolean;
}

interface Category {
  id: number;
  name: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState({
    totalBlogs: 0,
    publishedBlogs: 0,
    totalViews: 0,
    avgViews: 0,
    totalMessages: 0,
    totalCategories: 0
  });

  useEffect(() => {
    const checkAuth = () => {
      const isAdmin = Cookies.get('adminSession');
      if (!isAdmin) {
        toast.error('Lütfen önce giriş yapın');
        router.push('/admin/login');
      }
    };

    const fetchData = async () => {
      // Blog istatistikleri
      const { data: blogData, error: blogError } = await supabase
        .from('blog')
        .select('*');

      if (!blogError && blogData) {
        setBlogPosts(blogData);
        const published = blogData.filter(post => post.is_published);
        const totalViews = blogData.reduce((sum, post) => sum + (post.view_count || 0), 0);
        
        setStats(prev => ({
          ...prev,
          totalBlogs: blogData.length,
          publishedBlogs: published.length,
          totalViews: totalViews,
          avgViews: published.length > 0 ? Math.round(totalViews / published.length) : 0
        }));
      }

      // Kategori istatistikleri
      const { data: categoryData, error: categoryError } = await supabase
        .from('blog_categories')
        .select('*');

      if (!categoryError && categoryData) {
        setCategories(categoryData);
        setStats(prev => ({
          ...prev,
          totalCategories: categoryData.length
        }));
      }

      // İletişim mesajları
      const { data: messageData, error: messageError } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (!messageError && messageData) {
        setMessages(messageData);
        setStats(prev => ({
          ...prev,
          totalMessages: messageData.length
        }));
      }
    };

    checkAuth();
    fetchData();
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
        {/* İstatistik Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="admin-card stats-card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="stats-title">Toplam Blog</h3>
                <p className="stats-value">{stats.totalBlogs}</p>
                <p className="stats-subtitle">{stats.publishedBlogs} yayında</p>
              </div>
              <div className="icon-wrapper bg-blue-100">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="admin-card stats-card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="stats-title">Toplam Görüntülenme</h3>
                <p className="stats-value">{stats.totalViews}</p>
                <p className="stats-subtitle">Ortalama: {stats.avgViews}</p>
              </div>
              <div className="icon-wrapper bg-green-100">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="admin-card stats-card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="stats-title">İletişim Mesajları</h3>
                <p className="stats-value">{stats.totalMessages}</p>
                <p className="stats-subtitle">{categories.length} kategori</p>
              </div>
              <div className="icon-wrapper bg-purple-100">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Son İletişim Mesajları */}
        <div className="admin-card">
          <h2 className="admin-title">Son İletişim Mesajları</h2>
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
                {messages.slice(0, 5).map((message: ContactMessage) => (
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
          {messages.length > 5 && (
            <div className="mt-4 text-right">
              <button
                onClick={() => router.push('/admin/contact')}
                className="admin-button admin-button-primary"
              >
                Tüm Mesajları Gör
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 