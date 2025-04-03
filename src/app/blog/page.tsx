'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  author: string;
  image_url: string | null;
  created_at: string;
  view_count: number;
  category_id: number;
}

interface Category {
  id: number;
  name: string;
}

export default function BlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');

      if (!error && data) {
        setCategories(data);
      }
    };

    const fetchPosts = async () => {
      let query = supabase
        .from('blog')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory);
      }

      const { data, error } = await query;

      if (!error && data) {
        setPosts(data);
      }
      setLoading(false);
    };

    fetchCategories();
    fetchPosts();
  }, [selectedCategory]);

  return (
    <>
      <Navbar />
      <div className="blog-page">
        <div className="container">
          <div className="blog-page-header">
            <h1 className="blog-page-title">Blog</h1>
            <p className="blog-page-subtitle">
              Güncel yazılarımız ve makalelerimiz ile bilgi dünyasını keşfedin
            </p>
          </div>

          {/* Kategori Filtreleme */}
          <div className="blog-categories">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`blog-category-button ${!selectedCategory ? 'active' : ''}`}
            >
              Tümü
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`blog-category-button ${selectedCategory === category.id ? 'active' : ''}`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="blog-grid">
              {posts.map((post) => (
                <Link 
                  href={`/blog/${post.slug}`} 
                  key={post.id}
                  className="blog-card"
                >
                  {post.image_url && (
                    <div className="blog-card-image">
                      <img
                        src={post.image_url}
                        alt={post.title}
                      />
                    </div>
                  )}
                  <div className="blog-card-content">
                    <h2 className="blog-card-title">
                      {post.title}
                    </h2>
                    <p className="blog-card-meta">
                      {new Date(post.created_at).toLocaleDateString('tr-TR')} • {post.view_count} görüntülenme
                    </p>
                    <p className="blog-card-summary">
                      {post.summary}
                    </p>
                    <span className="blog-card-link">
                      Devamını Oku →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">Bu kategoride henüz blog yazısı bulunmuyor.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
} 