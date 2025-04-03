import React, { useState, useEffect } from 'react';
import { Clock, DollarSign, Heart, X, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { z } from 'zod';

interface Auction {
  id: string;
  title: string;
  description: string;
  image_url: string;
  link: string;
  created_at: string;
}

const auctionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  imageUrl: z.string().url('Invalid image URL'),
  link: z.string().url('Invalid link'),
});

function AuctionList() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [sortBy, setSortBy] = useState('latest');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // New auction form state
  const [newAuction, setNewAuction] = useState({
    title: '',
    description: '',
    imageUrl: '',
    link: '',
  });

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    const { data, error } = await supabase
      .from('auctions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching auctions:', error);
      return;
    }

    setAuctions(data || []);
  };

  // Sort auctions
  const sortedAuctions = [...auctions].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      default:
        return 0;
    }
  });

  const handleCreateAuction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate form data
      const validatedData = auctionSchema.parse(newAuction);

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      // Create auction
      const { error: auctionError } = await supabase
        .from('auctions')
        .insert({
          title: validatedData.title,
          description: validatedData.description,
          image_url: validatedData.imageUrl,
          link: validatedData.link,
          user_id: userData.user.id,
        });

      if (auctionError) throw auctionError;

      // Refresh auctions
      await fetchAuctions();

      // Reset form and close modal
      setNewAuction({ title: '', description: '', imageUrl: '', link: '' });
      setIsCreateModalOpen(false);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Active Auctions</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <select 
            className="input-field"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="latest">Sort by: Latest</option>
          </select>
          <button 
            className="btn-primary flex items-center gap-2"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="h-5 w-5" />
            Create Auction
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedAuctions.map((auction) => (
          <div key={auction.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="relative h-48">
              <img
                src={auction.image_url}
                alt={auction.title}
                className="w-full h-full object-cover"
              />
              <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                <Heart className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{auction.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{auction.description}</p>
              <div className="flex justify-between items-center">
                <a 
                  href={auction.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View Details
                </a>
                <div className="flex items-center text-gray-700">
                  <Clock className="h-5 w-5 mr-1" />
                  <span>{new Date(auction.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Auction Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Create New Auction</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            {error && (
              <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
                {error}
              </div>
            )}
            <form onSubmit={handleCreateAuction}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    className="input-field"
                    value={newAuction.title}
                    onChange={(e) => setNewAuction({ ...newAuction, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    className="input-field"
                    value={newAuction.description}
                    onChange={(e) => setNewAuction({ ...newAuction, description: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    className="input-field"
                    value={newAuction.imageUrl}
                    onChange={(e) => setNewAuction({ ...newAuction, imageUrl: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                  <input
                    type="url"
                    className="input-field"
                    value={newAuction.link}
                    onChange={(e) => setNewAuction({ ...newAuction, link: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="mt-6">
                <button 
                  type="submit" 
                  className="btn-primary w-full"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Auction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AuctionList;