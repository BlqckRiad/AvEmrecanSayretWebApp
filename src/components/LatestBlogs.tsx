'use client';

import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

const LatestBlogs = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blog')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;
        setPosts(data || []);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err.message);
      }
    };

    fetchPosts();
  }, []);

  if (error) return null;
  if (!posts || posts.length === 0) return null;

  return (
    <section className="latest-blogs">
      <h2 className="latest-blogs-title">
        Son Blog Yazıları
      </h2>
      <div className="latest-blogs-grid">
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
              <h3 className="blog-card-title">
                {post.title}
              </h3>
              <p className="blog-card-meta">
                {new Date(post.created_at).toLocaleDateString('tr-TR')}
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
      <div className="view-all-blogs">
        <Link 
          href="/blog"
          className="view-all-blogs-button"
        >
          Tüm Yazıları Gör
        </Link>
      </div>
    </section>
  );
};

export default LatestBlogs; 