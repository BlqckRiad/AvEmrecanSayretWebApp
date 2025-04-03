'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import '../adminglobal.css';
import Cookies from 'js-cookie';

interface Category {
  id: number;
  name: string;
}

export default function AdminCategories() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    const checkAuth = () => {
      const isAdmin = Cookies.get('adminSession');
      if (!isAdmin) {
        toast.error('Lütfen önce giriş yapın');
        router.push('/admin/login');
      }
    };

    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching categories:', error);
        toast.error('Kategoriler yüklenirken bir hata oluştu');
        return;
      }

      setCategories(data || []);
    };

    checkAuth();
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && selectedCategory) {
        const { error } = await supabase
          .from('blog_categories')
          .update({ name: categoryName })
          .eq('id', selectedCategory.id);

        if (error) throw error;

        setCategories(categories.map(category =>
          category.id === selectedCategory.id ? { ...category, name: categoryName } : category
        ));
        toast.success('Kategori başarıyla güncellendi');
      } else {
        const { data, error } = await supabase
          .from('blog_categories')
          .insert([{ name: categoryName }])
          .select()
          .single();

        if (error) throw error;

        setCategories([...categories, data]);
        toast.success('Kategori başarıyla eklendi');
      }

      closeModal();
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) {
      return;
    }

    const { error } = await supabase
      .from('blog_categories')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Kategori silinirken bir hata oluştu');
      return;
    }

    setCategories(categories.filter(category => category.id !== id));
    toast.success('Kategori başarıyla silindi');
  };

  const openModal = (category?: Category) => {
    if (category) {
      setIsEditing(true);
      setSelectedCategory(category);
      setCategoryName(category.name);
    } else {
      setIsEditing(false);
      setSelectedCategory(null);
      setCategoryName('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    setIsEditing(false);
    setCategoryName('');
  };

  return (
    <div className="admin-page">
      <nav className="admin-navbar">
        <div className="admin-container">
          <div className="admin-navbar-content">
            <h1 className="admin-title mb-0">Kategori Yönetimi</h1>
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
          <div className="flex justify-end mb-6">
            <button
              onClick={() => openModal()}
              className="admin-button admin-button-success"
            >
              Yeni Kategori Ekle
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Kategori Adı</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.id}</td>
                    <td>{category.name}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal(category)}
                          className="admin-button admin-button-primary"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="admin-button admin-button-danger"
                        >
                          Sil
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

      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {isEditing ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
              </h3>
              <button
                onClick={closeModal}
                className="admin-modal-close"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label className="admin-label">Kategori Adı</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="admin-modal-footer">
                <button
                  type="button"
                  onClick={closeModal}
                  className="admin-button admin-button-secondary"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="admin-button admin-button-primary"
                >
                  {isEditing ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 