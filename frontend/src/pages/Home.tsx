import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI } from '../services/api';
import type { Blog } from '../types/api';
import { Calendar, User } from 'lucide-react';

const Home: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // For the home page, we'll show all blogs (you might want to create a public endpoint)
        // For now, let's create a mock response since we need authentication
        setBlogs([
          {
            id: '1',
            title: 'Welcome to Our Blogging Platform',
            content: 'This is a sample blog post to demonstrate our beautiful Medium-like interface. Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
            author_id: '1',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: '2',
            title: 'The Future of Web Development',
            content: 'Web development is constantly evolving. Here are some trends that are shaping the future of how we build applications...',
            author_id: '2',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            updated_at: new Date(Date.now() - 86400000).toISOString(),
          },
        ]);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch blogs');
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const truncateContent = (content: string, maxLength: number = 200) => {
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero section */}
      <div className="bg-yellow-400 border-b border-black">
        <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-6xl md:text-8xl font-medium text-black mb-6">
              Human stories & ideas
            </h1>
            <p className="text-xl text-black mb-8">
              A place to read, write, and deepen your understanding
            </p>
            <Link 
              to="/register"
              className="inline-block bg-black text-white px-12 py-3 rounded-full text-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Start reading
            </Link>
          </div>
        </div>
      </div>

      {/* Blog posts */}
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Stories</h2>
        
        <div className="space-y-8">
          {blogs.map((blog) => (
            <article key={blog.id} className="border-b border-gray-200 pb-8">
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                <User size={16} />
                <span>Author</span>
                <span>•</span>
                <Calendar size={16} />
                <span>{formatDate(blog.created_at!)}</span>
              </div>
              
              <Link to={`/blog/${blog.id}`} className="block group">
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-600 transition-colors">
                  {blog.title}
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                  {truncateContent(blog.content)}
                </p>
                <div className="text-sm text-gray-500">
                  Read more →
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
