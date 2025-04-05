'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import '../adminglobal.css';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import MDEditor from '@uiw/react-md-editor';
import ReactMarkdown from 'react-markdown';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  author: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  view_count: number;
  is_published: boolean;
  category_id: number | null;
  meta_description: string;
  meta_keywords: string;
}

interface Category {
  id: number;
  name: string;
}

export default function AdminBlog() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    author: '',
    meta_description: '',
    meta_keywords: '',
    image_url: '',
    category_id: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  });
  const [isCropping, setIsCropping] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const isAdmin = Cookies.get('adminSession');
      if (!isAdmin) {
        toast.error('Lütfen önce giriş yapın');
        router.push('/admin/login');
      }
    };

    const fetchPosts = async () => {
      let query = supabase.from('blog').select('*').order('created_at', { ascending: false });

      if (filter === 'published') {
        query = query.eq('is_published', true);
      } else if (filter === 'draft') {
        query = query.eq('is_published', false);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching posts:', error);
        toast.error('Bloglar yüklenirken bir hata oluştu');
        return;
      }

      setPosts(data || []);
    };

    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }

      setCategories(data || []);
    };

    checkAuth();
    fetchPosts();
    fetchCategories();
  }, [filter]);

  const handleStatusChange = async (id: number, newStatus: boolean) => {
    const { error } = await supabase
      .from('blog')
      .update({ is_published: newStatus })
      .eq('id', id);

    if (error) {
      toast.error('Durum güncellenirken bir hata oluştu');
      return;
    }

    setPosts(posts.map(post => 
      post.id === id ? { ...post, is_published: newStatus } : post
    ));
    
    toast.success('Durum başarıyla güncellendi');
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu blog yazısını silmek istediğinize emin misiniz?')) {
      return;
    }

    const { error } = await supabase
      .from('blog')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Blog silinirken bir hata oluştu');
      return;
    }

    setPosts(posts.filter(post => post.id !== id));
    toast.success('Blog başarıyla silindi');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setIsCropping(true);
        setCrop({
          unit: '%',
          width: 100,
          height: 100,
          x: 0,
          y: 0,
        });
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  const getCroppedImg = (
    image: HTMLImageElement,
    crop: Crop,
    fileName: string,
  ): Promise<File> => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas is empty'));
            return;
          }
          const croppedFile = new File([blob], fileName, {
            type: 'image/jpeg',
          });
          resolve(croppedFile);
        },
        'image/jpeg',
        1,
      );
    });
  };

  const handleCropComplete = async () => {
    if (!imageRef.current || !completedCrop || !imageFile) {
      return;
    }

    try {
      const croppedFile = await getCroppedImg(
        imageRef.current,
        completedCrop,
        imageFile.name,
      );
      setImageFile(croppedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(croppedFile);
      setIsCropping(false);
    } catch (e) {
      console.error(e);
      toast.error('Görsel kırpma işlemi başarısız oldu');
    }
  };

  const handleCropCancel = () => {
    setIsCropping(false);
    setImageFile(null);
    setImagePreview('');
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image_url;

      // Eğer yeni bir resim yüklendiyse
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      if (isEditing && selectedPost) {
        // Blog güncelleme
        const { data, error } = await supabase
          .from('blog')
          .update({
            ...formData,
            category_id: formData.category_id ? Number(formData.category_id) : null,
            image_url: imageUrl
          })
          .eq('id', selectedPost.id)
          .select()
          .single();

        if (error) throw error;

        setPosts(posts.map(post => 
          post.id === selectedPost.id ? data : post
        ));
        toast.success('Blog başarıyla güncellendi');
      } else {
        // Yeni blog ekleme
        const { data, error } = await supabase
          .from('blog')
          .insert([{
            ...formData,
            category_id: formData.category_id ? Number(formData.category_id) : null,
            slug: generateSlug(formData.title),
            view_count: 0,
            is_published: false,
            image_url: imageUrl
          }])
          .select()
          .single();

        if (error) throw error;

        setPosts([...posts, data]);
        toast.success('Blog başarıyla eklendi');
      }

      closeModal();
    } catch (error: any) {
      console.error('Error saving blog:', error);
      toast.error(error.message || 'Blog kaydedilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (post?: BlogPost) => {
    if (post) {
      setIsEditing(true);
      setSelectedPost(post);
      setFormData({
        title: post.title,
        summary: post.summary,
        content: post.content,
        author: post.author,
        meta_description: post.meta_description || '',
        meta_keywords: post.meta_keywords || '',
        image_url: post.image_url || '',
        category_id: post.category_id?.toString() || '',
      });
      if (post.image_url) {
        setImagePreview(post.image_url);
      }
    } else {
      setIsEditing(false);
      setSelectedPost(null);
      setFormData({
        title: '',
        summary: '',
        content: '',
        author: '',
        meta_description: '',
        meta_keywords: '',
        image_url: '',
        category_id: '',
      });
      setImagePreview('');
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
    setIsEditing(false);
    setFormData({
      title: '',
      summary: '',
      content: '',
      author: '',
      meta_description: '',
      meta_keywords: '',
      image_url: '',
      category_id: '',
    });
    setImagePreview('');
    setImageFile(null);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-');
  };

  const openPreviewModal = (post: BlogPost) => {
    setPreviewPost(post);
    setIsPreviewModalOpen(true);
  };

  const closePreviewModal = () => {
    setPreviewPost(null);
    setIsPreviewModalOpen(false);
  };

  return (
    <div className="admin-page">
      <nav className="admin-navbar">
        <div className="admin-container">
          <div className="admin-navbar-content">
            <h1 className="admin-title mb-0">Blog Yönetimi</h1>
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
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`admin-button ${filter === 'all' ? 'admin-button-primary' : 'admin-button-secondary'}`}
              >
                Tümü
              </button>
              <button
                onClick={() => setFilter('published')}
                className={`admin-button ${filter === 'published' ? 'admin-button-primary' : 'admin-button-secondary'}`}
              >
                Yayında
              </button>
              <button
                onClick={() => setFilter('draft')}
                className={`admin-button ${filter === 'draft' ? 'admin-button-primary' : 'admin-button-secondary'}`}
              >
                Taslak
              </button>
            </div>
            <button
              onClick={() => openModal()}
              className="admin-button admin-button-success"
            >
              Yeni Blog Ekle
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Başlık</th>
                  <th>Yazar</th>
                  <th>Kategori</th>
                  <th>Görüntülenme</th>
                  <th>Tarih</th>
                  <th>Durum</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td className="font-medium">{post.title}</td>
                    <td>{post.author}</td>
                    <td>{categories.find(c => c.id === post.category_id)?.name || '-'}</td>
                    <td>{post.view_count}</td>
                    <td>{new Date(post.created_at).toLocaleDateString('tr-TR')}</td>
                    <td>
                      <span className={`admin-status-badge ${
                        post.is_published 
                          ? 'admin-status-badge-success' 
                          : 'admin-status-badge-warning'
                      }`}>
                        {post.is_published ? 'Yayında' : 'Taslak'}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openPreviewModal(post)}
                          className="admin-button admin-button-info"
                        >
                          Gör
                        </button>
                        <button
                          onClick={() => openModal(post)}
                          className="admin-button admin-button-primary"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleStatusChange(post.id, !post.is_published)}
                          className={`admin-button ${
                            post.is_published 
                              ? 'admin-button-warning' 
                              : 'admin-button-success'
                          }`}
                        >
                          {post.is_published ? 'Taslağa Al' : 'Yayınla'}
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
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

      {/* Blog Ekleme/Düzenleme Modal */}
      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {isEditing ? 'Blog Düzenle' : 'Yeni Blog Ekle'}
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
                  <label className="admin-label">Başlık</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        title: e.target.value
                      });
                    }}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Kapak Görseli</label>
                  <div className="space-y-2">
                    {isCropping ? (
                      <div className="space-y-4">
                        <ReactCrop
                          crop={crop}
                          onChange={(c) => setCrop(c)}
                          onComplete={(c) => setCompletedCrop(c)}
                          aspect={16 / 9}
                        >
                          <img
                            ref={imageRef}
                            src={imagePreview}
                            alt="Crop preview"
                            className="max-h-[400px] w-full object-contain"
                          />
                        </ReactCrop>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleCropComplete}
                            className="admin-button admin-button-success"
                          >
                            Kırp
                          </button>
                          <button
                            type="button"
                            onClick={handleCropCancel}
                            className="admin-button admin-button-danger"
                          >
                            İptal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {imagePreview && (
                          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="admin-input"
                        />
                      </>
                    )}
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Özet</label>
                  <textarea
                    className="admin-input"
                    rows={3}
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">İçerik</label>
                  <div className="markdown-editor-container">
                    <MDEditor
                      value={formData.content}
                      onChange={(value) => setFormData({ ...formData, content: value || '' })}
                      height={400}
                      preview="live"
                    />
                  </div>
                  <div className="markdown-help">
                    <h4>Markdown Kullanımı:</h4>
                    <ul>
                      <li><strong>Başlık:</strong> # Başlık 1, ## Başlık 2, ### Başlık 3</li>
                      <li><strong>Kalın:</strong> **kalın metin**</li>
                      <li><strong>İtalik:</strong> *italik metin*</li>
                      <li><strong>Liste:</strong> - Madde 1</li>
                      <li><strong>Numaralı Liste:</strong> 1. Madde 1</li>
                      <li><strong>Link:</strong> [bağlantı metni](url)</li>
                      <li><strong>Resim:</strong> ![alt metin](resim-url)</li>
                      <li><strong>Alıntı:</strong> > Alıntı metni</li>
                      <li><strong>Kod Bloğu:</strong> ```kod```</li>
                    </ul>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Yazar</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Meta Açıklama</label>
                  <textarea
                    className="admin-input"
                    rows={2}
                    value={formData.meta_description}
                    onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Meta Anahtar Kelimeler</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={formData.meta_keywords}
                    onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
                    placeholder="örnek, anahtar, kelimeler"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Kategori</label>
                  <select
                    className="admin-input"
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    required
                  >
                    <option value="">Kategori Seçin</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
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

      {/* Blog Önizleme Modal */}
      {isPreviewModalOpen && previewPost && (
        <div className="admin-modal-overlay" onClick={closePreviewModal}>
          <div className="admin-modal admin-modal-blog-preview" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                Blog Önizleme
              </h3>
              <button
                onClick={closePreviewModal}
                className="admin-modal-close"
              >
                ✕
              </button>
            </div>
            
            <div className="admin-modal-body">
              <div className="blog-preview">
                {previewPost.image_url && (
                  <div className="blog-preview-image">
                    <img
                      src={previewPost.image_url}
                      alt={previewPost.title}
                    />
                  </div>
                )}
                
                <h1 className="blog-preview-title">
                  {previewPost.title}
                </h1>
                
                <div className="blog-preview-meta">
                  <div className="blog-preview-meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {previewPost.author}
                  </div>
                  <div className="blog-preview-meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(previewPost.created_at).toLocaleDateString('tr-TR')}
                  </div>
                </div>

                <div className="blog-preview-summary">
                  {previewPost.summary}
                </div>

                <div className="blog-preview-content">
                  {previewPost.content.includes('**') || 
                   previewPost.content.includes('*') || 
                   previewPost.content.includes('#') || 
                   previewPost.content.includes('[') || 
                   previewPost.content.includes('```') ? (
                    <ReactMarkdown>{previewPost.content}</ReactMarkdown>
                  ) : (
                    <div className="blog-content-text">
                      {previewPost.content.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 