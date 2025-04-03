'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import '../adminglobal.css';
import Cookies from 'js-cookie';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Supabase bağlantısını kontrol et
      const { data: connectionTest } = await supabase.from('users').select('count').limit(1);
      
      if (!connectionTest) {
        toast.error('Veritabanı bağlantısı kurulamadı');
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          toast.error('Kullanıcı adı veya şifre hatalı');
        } else {
          toast.error('Bir hata oluştu: ' + error.message);
        }
        return;
      }

      if (data) {
        // Cookie'ye oturum bilgisini kaydet (7 gün geçerli)
        Cookies.set('adminSession', 'true', { expires: 7 });
        toast.success('Başarıyla giriş yapıldı');
        router.push('/admin/dashboard');
      } else {
        toast.error('Kullanıcı adı veya şifre hatalı');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error?.message || 'Giriş yapılırken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-page flex items-center justify-center">
      <div className="admin-card w-96">
        <h1 className="admin-title text-center">Admin Girişi</h1>
        <form onSubmit={handleLogin}>
          <div className="admin-form-group">
            <label className="admin-label">
              Kullanıcı Adı
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="admin-input"
              required
              disabled={isLoading}
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-input"
              required
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className="admin-button admin-button-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
} 