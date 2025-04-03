import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Lock, Trash2, AlertCircle, Shield, Trash, X } from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  roll_number: string;
  college: string;
  date_of_birth: string;
  created_at: string;
}

interface Auction {
  id: string;
  title: string;
  description: string;
  image_url: string;
  link: string;
  user_id: string;
  created_at: string;
}

const ADMIN_PASSWORD = 'admin123'; // In a real app, this should be stored securely

export default function DatabaseViewer() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'record' | 'table'; table: string; id?: string; name?: string; }| null>(null);
  const [deleteStatus, setDeleteStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [selectedRecords, setSelectedRecords] = useState<{ [key: string]: Set<string> }>({ profiles: new Set(), auctions: new Set() });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  async function fetchData() {
    try {
      setLoading(true);
      setError(null);

      // Fetch profiles with RLS bypass to ensure admin access
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;
      setProfiles(profilesData || []);

      // Fetch auctions with RLS bypass to ensure admin access
      const { data: auctionsData, error: auctionsError } = await supabase
        .from('auctions')
        .select('*')
        .order('created_at', { ascending: false });

      if (auctionsError) throw auctionsError;
      setAuctions(auctionsData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError(null);
      setPassword('');
    } else {
      setError('Invalid password');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm || isDeleting) return;

    try {
      setIsDeleting(true);
      setDeleteStatus(null);

      if (deleteConfirm.type === 'record' && deleteConfirm.id) {
        // Delete single record
        const { error: deleteError } = await supabase
          .from(deleteConfirm.table)
          .delete()
          .eq('id', deleteConfirm.id);

        if (deleteError) throw deleteError;

        // Update local state immediately
        if (deleteConfirm.table === 'profiles') {
          setProfiles(prev => prev.filter(p => p.id !== deleteConfirm.id));
        } else {
          setAuctions(prev => prev.filter(a => a.id !== deleteConfirm.id));
        }
      } else if (deleteConfirm.type === 'table') {
        // Delete multiple records
        const ids = Array.from(selectedRecords[deleteConfirm.table]);
        
        const { error: deleteError } = await supabase
          .from(deleteConfirm.table)
          .delete()
          .in('id', ids);

        if (deleteError) throw deleteError;

        // Update local state immediately
        if (deleteConfirm.table === 'profiles') {
          setProfiles(prev => prev.filter(p => !ids.includes(p.id)));
        } else {
          setAuctions(prev => prev.filter(a => !ids.includes(a.id)));
        }

        // Clear selections
        setSelectedRecords(prev => ({
          ...prev,
          [deleteConfirm.table]: new Set()
        }));
      }

      setDeleteStatus({
        success: true,
        message: 'Records deleted successfully'
      });

      // Close the modal
      setDeleteConfirm(null);
    } catch (err) {
      setDeleteStatus({
        success: false,
        message: err instanceof Error ? err.message : 'Failed to delete records'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleRecordSelection = (table: string, id: string) => {
    setSelectedRecords(prev => {
      const newSet = new Set(prev[table]);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return { ...prev, [table]: newSet };
    });
  };

  const toggleAllRecords = (table: string, records: Profile[] | Auction[]) => {
    setSelectedRecords(prev => {
      const newSet = new Set(prev[table]);
      if (newSet.size === records.length) {
        newSet.clear();
      } else {
        records.forEach(record => newSet.add(record.id));
      }
      return { ...prev, [table]: newSet };
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <div className="bg-white p-8 rounded-xl shadow-sm">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Database Access</h2>
          {error && (
            <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Enter admin password"
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full">
              Access Database
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-gray-600">Loading database contents...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {deleteStatus && (
        <div className={`p-4 rounded-lg ${deleteStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {deleteStatus.message}
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Profiles Table ({profiles.length} records)</h2>
          {selectedRecords.profiles.size > 0 && (
            <button
              onClick={() => setDeleteConfirm({ type: 'table', table: 'profiles' })}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              disabled={isDeleting}
            >
              <Trash className="h-4 w-4" />
              Delete Selected ({selectedRecords.profiles.size})
            </button>
          )}
        </div>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                  <input
                    type="checkbox"
                    checked={selectedRecords.profiles.size === profiles.length}
                    onChange={() => toggleAllRecords('profiles', profiles)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">College</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Birth</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {profiles.map((profile) => (
                <tr key={profile.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedRecords.profiles.has(profile.id)}
                      onChange={() => toggleRecordSelection('profiles', profile.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{profile.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{profile.roll_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{profile.college}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(profile.date_of_birth).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(profile.created_at).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setDeleteConfirm({ type: 'record', table: 'profiles', id: profile.id, name: profile.name })}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Delete profile"
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Auctions Table ({auctions.length} records)</h2>
          {selectedRecords.auctions.size > 0 && (
            <button
              onClick={() => setDeleteConfirm({ type: 'table', table: 'auctions' })}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              disabled={isDeleting}
            >
              <Trash className="h-4 w-4" />
              Delete Selected ({selectedRecords.auctions.size})
            </button>
          )}
        </div>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                  <input
                    type="checkbox"
                    checked={selectedRecords.auctions.size === auctions.length}
                    onChange={() => toggleAllRecords('auctions', auctions)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {auctions.map((auction) => (
                <tr key={auction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedRecords.auctions.has(auction.id)}
                      onChange={() => toggleRecordSelection('auctions', auction.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{auction.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap max-w-xs truncate">{auction.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img src={auction.image_url} alt={auction.title} className="h-10 w-10 object-cover rounded" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a href={auction.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      View
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{auction.user_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(auction.created_at).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setDeleteConfirm({ type: 'record', table: 'auctions', id: auction.id, name: auction.title })}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Delete auction"
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
              <button 
                onClick={() => setDeleteConfirm(null)} 
                className="text-gray-500 hover:text-gray-700"
                disabled={isDeleting}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mb-6">
              {deleteConfirm.type === 'record' && (
                <p className="text-gray-600">
                  Are you sure you want to delete {deleteConfirm.table === 'profiles' ? 'the profile for' : 'the auction'}{' '}
                  <span className="font-semibold">{deleteConfirm.name}</span>?
                </p>
              )}
              {deleteConfirm.type === 'table' && (
                <p className="text-gray-600">
                  Are you sure you want to delete {selectedRecords[deleteConfirm.table].size} selected{' '}
                  {deleteConfirm.table}?
                </p>
              )}
              <p className="text-red-600 mt-2 text-sm">This action cannot be undone.</p>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn-secondary"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}