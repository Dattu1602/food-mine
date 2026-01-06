import { useState, useEffect } from 'react';
import { X, User as UserIcon, MapPin, Phone, Package, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface ProfilePageProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserProfile {
  full_name: string | null;
  address: string | null;
  phone: string | null;
}

interface Order {
  id: string;
  total_price: number;
  status: string;
  name: string;
  address: string;
  created_at: string;
}

export function ProfilePage({ isOpen, onClose }: ProfilePageProps) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({
    full_name: '',
    address: '',
    phone: '',
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      fetchProfile();
      fetchOrders();
    }
  }, [isOpen, user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile({
          full_name: data.full_name,
          address: data.address,
          phone: data.phone,
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const fetchOrders = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          ...profile,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      alert('Profile updated successfully!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8">
        <div className="sticky top-0 bg-white border-b rounded-t-2xl px-8 py-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">Profile</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-orange-500 p-3 rounded-full">
                <UserIcon className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Account Information</h3>
                <p className="text-gray-600 text-sm">{user?.email}</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.full_name || ''}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <MapPin size={16} />
                    <span>Address</span>
                  </div>
                </label>
                <input
                  type="text"
                  value={profile.address || ''}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="123 Main St, City, State, ZIP"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <Phone size={16} />
                    <span>Phone</span>
                  </div>
                </label>
                <input
                  type="tel"
                  value={profile.phone || ''}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </form>
          </div>

          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Package className="text-orange-500" size={24} />
              <h3 className="text-xl font-bold text-gray-900">Order History</h3>
            </div>

            {loading ? (
              <p className="text-gray-600">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="text-gray-600">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-gray-600">{order.name}</p>
                      </div>
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full">
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{order.address}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock size={16} />
                        <span>{new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                      <span className="text-lg font-bold text-orange-500">
                        ${order.total_price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
