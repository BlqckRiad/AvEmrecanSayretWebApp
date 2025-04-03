'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  meta_description: string;
  meta_keywords: string;
}

interface Category {
  id: number;
  name: string;
}

export default function BlogDetail() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const { data: post, error } = await supabase
        .from('blog')
        .select('*')
        .eq('slug', params.slug)
        .eq('is_published', true)
        .single();

      if (error || !post) {
        router.push('/blog');
        return;
      }

      // Görüntülenme sayısını artır
      const { error: updateError } = await supabase
        .from('blog')
        .update({ view_count: (post.view_count || 0) + 1 })
        .eq('id', post.id);

      if (!updateError) {
        post.view_count = (post.view_count || 0) + 1;
      }

      setPost(post);

      // Kategori bilgisini al
      if (post.category_id) {
        const { data: categoryData } = await supabase
          .from('blog_categories')
          .select('*')
          .eq('id', post.category_id)
          .single();

        if (categoryData) {
          setCategory(categoryData);
        }
      }

      setLoading(false);
    };

    fetchPost();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <>
      <Navbar />
      <article className="blog-detail">
        {/* Hero Section */}
        <div className="blog-hero">
          {post.image_url && (
            <img
              src={post.image_url}
              alt={post.title}
              className="blog-hero-image"
            />
          )}
          <div className="blog-hero-overlay"></div>
        </div>

        <div className="blog-content-wrapper">
          <div className="blog-content">
            {/* Kategori */}
            {category && (
              <Link 
                href={`/blog?category=${category.id}`}
                className="blog-category-tag"
              >
                {category.name}
              </Link>
            )}

            {/* Başlık */}
            <h1 className="blog-detail-title">
              {post.title}
            </h1>

            {/* Meta Bilgiler */}
            <div className="blog-meta">
              <div className="blog-meta-item">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {post.author}
              </div>
              <div className="blog-meta-item">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(post.created_at).toLocaleDateString('tr-TR')}
              </div>
              <div className="blog-meta-item">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {post.view_count} görüntülenme
              </div>
            </div>

            {/* Özet */}
            <div className="blog-summary">
              {post.summary}
            </div>

            {/* İçerik */}
            <div className="blog-content-text">
              {post.content.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </article>
      <Footer />
    </>
  );
} 