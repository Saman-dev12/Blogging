import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { Blog } from '../types/api';
import { Calendar, User, Edit, Trash2, Plus } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        const response = await blogAPI.getBlogs();
        setBlogs(response.blogs);
      } catch (err: any) {
        setError('Failed to fetch your posts');
      } finally {
        setLoading(false);
      }
    };

    fetchUserBlogs();
  }, []);

  const handleDelete = async (blogId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await blogAPI.deleteBlog(blogId);
        setBlogs(blogs.filter(blog => blog.id !== blogId));
      } catch (err) {
        alert('Failed to delete post');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substr(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {user?.username || 'Your Profile'}
            </h1>
            <p className="text-gray-600">{user?.email}</p>
          </div>
          
          <Link
            to="/create"
            className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
          >
            <Plus size={20} />
            <span>Write story</span>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">{blogs.length}</div>
            <div className="text-gray-600">Stories published</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {blogs.reduce((acc, blog) => acc + blog.content.split(' ').length, 0)}
            </div>
            <div className="text-gray-600">Total words</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {user?.created_at ? new Date(user.created_at).getFullYear() : new Date().getFullYear()}
            </div>
            <div className="text-gray-600">Member since</div>
          </div>
        </div>

        {/* Blog posts */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Your Stories</h2>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {blogs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">You haven't published any stories yet.</div>
              <Link
                to="/create"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
              >
                <Plus size={20} />
                <span>Write your first story</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {blogs.map((blog) => (
                <div key={blog.id} className="border-b border-gray-200 pb-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                        <Calendar size={16} />
                        <span>{formatDate(blog.created_at!)}</span>
                        {blog.updated_at !== blog.created_at && (
                          <>
                            <span>•</span>
                            <span>Updated {formatDate(blog.updated_at!)}</span>
                          </>
                        )}
                      </div>
                      
                      <Link to={`/blog/${blog.id}`} className="block group">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-600 transition-colors">
                          {blog.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {truncateContent(blog.content)}
                        </p>
                      </Link>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Link
                        to={`/edit/${blog.id}`}
                        className="flex items-center space-x-1 px-3 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Edit size={16} />
                        <span className="hidden sm:inline">Edit</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="flex items-center space-x-1 px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
