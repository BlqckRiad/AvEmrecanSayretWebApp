'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import '../adminglobal.css';
import Cookies from 'js-cookie';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  created_at: string;
  is_checked: boolean;
}

export default function AdminContact() {
  const router = useRouter();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const isAdmin = Cookies.get('adminSession');
      if (!isAdmin) {
        toast.error('Lütfen önce giriş yapın');
        router.push('/admin/login');
      }
    };

    const fetchMessages = async () => {
      let query = supabase.from('iletisim').select('*').order('created_at', { ascending: false });

      if (filter === 'pending') {
        query = query.eq('is_checked', false);
      } else if (filter === 'completed') {
        query = query.eq('is_checked', true);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching messages:', error);
        toast.error('Mesajlar yüklenirken bir hata oluştu');
        return;
      }

      setMessages(data || []);
    };

    checkAuth();
    fetchMessages();
  }, [filter]);

  const handleStatusChange = async (id: number, newStatus: boolean) => {
    const { error } = await supabase
      .from('iletisim')
      .update({ is_checked: newStatus })
      .eq('id', id);

    if (error) {
      toast.error('Durum güncellenirken bir hata oluştu');
      return;
    }

    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, is_checked: newStatus } : msg
    ));
    
    toast.success('Durum başarıyla güncellendi');
  };

  const openModal = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMessage(null);
    setIsModalOpen(false);
  };

  return (
    <div className="admin-page">
      <nav className="admin-navbar">
        <div className="admin-container">
          <div className="admin-navbar-content">
            <h1 className="admin-title mb-0">İletişim Yönetimi</h1>
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="admin-button admin-button-secondary"
            >
              Dashboard'a Dön
            </button>
          </div>
        </div>
      </nav>

      <main className="admin-container py-8">
        <div className="admin-card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="admin-title">İletişim Mesajları</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`admin-button ${filter === 'all' ? 'admin-button-primary' : 'admin-button-secondary'}`}
              >
                Tümü
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`admin-button ${filter === 'pending' ? 'admin-button-primary' : 'admin-button-secondary'}`}
              >
                Bekleyenler
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`admin-button ${filter === 'completed' ? 'admin-button-primary' : 'admin-button-secondary'}`}
              >
                İşlem Yapılanlar
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ad Soyad</th>
                  <th>Email</th>
                  <th>Telefon</th>
                  <th className="w-1/4">Konu</th>
                  <th>Tarih</th>
                  <th>Durum</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((message) => (
                  <tr key={message.id}>
                    <td>{message.name}</td>
                    <td>{message.email}</td>
                    <td>{message.phone}</td>
                    <td className="max-w-xs overflow-hidden">
                      <div className="truncate">{message.subject}</div>
                    </td>
                    <td>
                      {new Date(message.created_at).toLocaleDateString('tr-TR')}
                    </td>
                    <td>
                      <span className={`px-2 py-1 rounded text-sm ${
                        message.is_checked 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {message.is_checked ? 'İşlem Yapıldı' : 'Bekliyor'}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal(message)}
                          className="admin-button admin-button-primary"
                        >
                          Detay
                        </button>
                        <button
                          onClick={() => handleStatusChange(message.id, !message.is_checked)}
                          className={`admin-button ${
                            message.is_checked 
                              ? 'admin-button-warning' 
                              : 'admin-button-success'
                          }`}
                        >
                          {message.is_checked ? 'Bekleyene Al' : 'İşlem Yapıldı'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Detay Modal */}
      {isModalOpen && selectedMessage && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Mesaj Detayı</h3>
              <button
                onClick={closeModal}
                className="admin-modal-close"
              >
                ✕
              </button>
            </div>
            
            <div className="admin-modal-body">
              <div className="admin-grid admin-grid-cols-2">
                <div>
                  <label className="admin-label">Gönderen</label>
                  <p className="text-gray-900">{selectedMessage.name}</p>
                </div>
                
                <div>
                  <label className="admin-label">Tarih</label>
                  <p className="text-gray-900">
                    {new Date(selectedMessage.created_at).toLocaleString('tr-TR')}
                  </p>
                </div>
                
                <div>
                  <label className="admin-label">Email</label>
                  <p className="text-gray-900">{selectedMessage.email}</p>
                </div>
                
                <div>
                  <label className="admin-label">Telefon</label>
                  <p className="text-gray-900">{selectedMessage.phone}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="admin-label">Konu</label>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedMessage.subject}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="admin-label">Mesaj</label>
                <div className="bg-gray-50 rounded-lg p-3 max-h-60 overflow-y-auto">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="admin-label">Durum</label>
                <span className={`admin-status-badge ${
                  selectedMessage.is_checked 
                    ? 'admin-status-badge-success' 
                    : 'admin-status-badge-warning'
                }`}>
                  {selectedMessage.is_checked ? 'İşlem Yapıldı' : 'Bekliyor'}
                </span>
              </div>
            </div>
            
            <div className="admin-modal-footer">
              <button
                onClick={() => {
                  handleStatusChange(selectedMessage.id, !selectedMessage.is_checked);
                  closeModal();
                }}
                className={`admin-button ${
                  selectedMessage.is_checked 
                    ? 'admin-button-warning' 
                    : 'admin-button-success'
                }`}
              >
                {selectedMessage.is_checked ? 'Bekleyene Al' : 'İşlem Yapıldı'}
              </button>
              <button
                onClick={closeModal}
                className="admin-button admin-button-secondary"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 