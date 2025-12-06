import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { User, Package, MapPin, CreditCard, LogOut, Settings } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { toast } from 'react-toastify';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    firstName: '',
    lastName: ''
  });
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, updateProfile } = useUser();

  // Load user data into form
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        firstName: user.firstName || '',
        lastName: user.lastName || ''
      });
    }
  }, [user]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      toast.info('Please login to view your profile');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto w-11/12 text-center">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto w-11/12">
        {/* Page Title */}
        <h1 className="text-3xl font-bold mb-8 text-gray-900">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              {/* User Info */}
              <div className="flex flex-col items-center mb-6 pb-6 border-b border-gray-200">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User size={32} className="text-gray-500" />
                  )}
                </div>
                <h2 className="font-semibold text-lg text-gray-900 text-center">
                  {user.name || user.firstName || user.email?.split('@')[0] || 'User'}
                </h2>
                <p className="text-sm text-gray-600 text-center">{user.email}</p>
                {user.role === 'admin' && (
                  <span className="mt-2 px-2 py-1 text-xs font-semibold text-white bg-black rounded">
                    Admin
                  </span>
                )}
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('account')}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'account'
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <User size={18} />
                  Account Details
                </button>
                
                <NavLink
                  to="/my-orders"
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
                >
                  <Package size={18} />
                  My Orders
                </NavLink>
                
                {user.role !== 'admin' && (
                  <>
                    <button
                      onClick={() => setActiveTab('addresses')}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === 'addresses'
                          ? 'bg-black text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <MapPin size={18} />
                      Addresses
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('payment')}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === 'payment'
                          ? 'bg-black text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <CreditCard size={18} />
                      Payment Methods
                    </button>
                  </>
                )}
                
                {user.role === 'admin' && (
                  <NavLink
                    to="/admin"
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
                  >
                    <Settings size={18} />
                    Admin Dashboard
                  </NavLink>
                )}
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-4"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white p-6 lg:p-8 rounded-lg shadow-sm">
              {/* Account Details Tab */}
              {activeTab === 'account' && (
                <form onSubmit={handleSubmit}>
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">Account Details</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                    </div>
                    <button 
                      type="submit"
                      disabled={loading}
                      className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>
                    <button className="text-sm font-medium text-black hover:underline">
                      + Add New Address
                    </button>
                  </div>
                  <div className="text-center py-12">
                    <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-600">No addresses saved yet</p>
                    <button className="mt-4 text-sm font-medium text-black hover:underline">
                      Add Your First Address
                    </button>
                  </div>
                </div>
              )}

              {/* Payment Methods Tab */}
              {activeTab === 'payment' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Payment Methods</h2>
                    <button className="text-sm font-medium text-black hover:underline">
                      + Add Card
                    </button>
                  </div>
                  <div className="text-center py-12">
                    <CreditCard size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-600">No payment methods saved</p>
                    <button className="mt-4 text-sm font-medium text-black hover:underline">
                      Add Payment Method
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;