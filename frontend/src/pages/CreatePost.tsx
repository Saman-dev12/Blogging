import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { CreateBlogPayload } from '../types/api';
import { Save, Eye } from 'lucide-react';

const CreatePost: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setError('');

    try {
      const payload: CreateBlogPayload = {
        ...formData,
        author_id: user.id,
      };
      
      const response = await blogAPI.createBlog(payload);
      navigate(`/blog/${response.blog.id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Write a story</h1>
            <p className="text-gray-600 mt-2">Share your thoughts with the world</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => setPreview(!preview)}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
            >
              <Eye size={16} />
              <span>{preview ? 'Edit' : 'Preview'}</span>
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={loading || !formData.title.trim() || !formData.content.trim()}
              className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save size={16} />
              <span>{loading ? 'Publishing...' : 'Publish'}</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {preview ? (
          /* Preview Mode */
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-6 font-serif">
              {formData.title || 'Your story title...'}
            </h2>
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {formData.content || 'Start writing your story...'}
              </div>
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Title"
                className="w-full text-4xl font-bold border-none outline-none placeholder-gray-400 font-serif"
                required
              />
            </div>

            <div>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Tell your story..."
                rows={20}
                className="w-full text-lg border-none outline-none placeholder-gray-400 resize-none leading-relaxed"
                required
              />
            </div>
          </form>
        )}

        {/* Tips */}
        <div className="mt-12 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Writing tips</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Write a compelling title that captures your story's essence</li>
            <li>• Start with a hook to grab readers' attention</li>
            <li>• Break up long paragraphs for better readability</li>
            <li>• Use preview mode to see how your story will look to readers</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
