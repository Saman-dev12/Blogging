import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { Blog } from '../types/api';
import { Calendar, User, Edit, Trash2 } from 'lucide-react';

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;
      
      try {
        const response = await blogAPI.getBlog(id);
        setBlog(response.blog);
      } catch (err: any) {
        setError('Failed to fetch blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleDelete = async () => {
    if (!id || !blog) return;
    
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await blogAPI.deleteBlog(id);
        navigate('/profile');
      } catch (err) {
        alert('Failed to delete post');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-xl">{error || 'Blog post not found'}</div>
      </div>
    );
  }

  const isAuthor = isAuthenticated && user?.id === blog.author_id;

  return (
    <div className="min-h-screen bg-white">
      <article className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight font-serif">
            {blog.title}
          </h1>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-gray-600">
              <div className="flex items-center space-x-2">
                <User size={20} />
                <span className="font-medium">Author</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={16} />
                <span>{formatDate(blog.created_at!)}</span>
              </div>
            </div>
            
            {isAuthor && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigate(`/edit/${blog.id}`)}
                  className="flex items-center space-x-1 px-3 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                >
                  <Edit size={16} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center space-x-1 px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {blog.content}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Last updated: {formatDate(blog.updated_at!)}
            </div>
            {!isAuthenticated && (
              <div className="text-sm">
                <span className="text-gray-500">Enjoyed this story? </span>
                <button
                  onClick={() => navigate('/register')}
                  className="text-green-600 hover:text-green-800 font-medium"
                >
                  Sign up to read more
                </button>
              </div>
            )}
          </div>
        </footer>
      </article>
    </div>
  );
};

export default BlogPost;
