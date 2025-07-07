import { useState } from 'react';
import { ShoppingCart, Package, Building2, Smile as Smile, QrCode, Edit3, Trash2, Menu, Home, Users, Star, TrendingUp, Plus } from 'lucide-react';
import logo from './../../assets/logo.png'
import text from './../../assets/text_1.png'
import { useAuthStore } from './../../store';
import { useNavigate } from 'react-router-dom';
import ErrorPage from '../../components/ErrorPage';
import QRCode from 'react-qr-code';
import env from '../../config/env';
import { useQuery } from '@tanstack/react-query';
import api from '../../utils/axios';

async function fetchUsers() {
  try {
    const { data: { data } } = await api({
      method: "get",
      url: '/user',
    })
    console.log("Spectra: ",data)
    return data
  } catch(e) {
    console.log(e)
    throw new Error('Error fetching users')
  }
}

async function fetchProducts() {

}

function UsersComponent() {
  const { isPending, error, data } = useQuery({ queryKey: ['users'], queryFn: fetchUsers })
  return (
    <div className="space-y-8">
      {/* User Count & Filters */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-0">
          <h3 className="text-xl font-semibold text-white">Users</h3>
          <span className="text-sm text-gray-400">Total Users: {/*data.length*/}</span>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search users"
            className="px-4 py-2 bg-[#202121] border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
          />
        </div>
      </div>
      { error ? console.log(`Error: ${error}`) : ""}
      {/* No users message */}
      {!data || data.length === 0 ? (
        <div className="text-center text-white">
          <p>{isPending ? "Loading users..." : "No users found"}</p>
        </div>
      ) : (
        <div>
          {/* Users List */}
          {data.map((user) => (
            <div key={user.id} className="bg-[#2a2b2b] p-6 rounded-2xl border border-gray-700 flex justify-between items-center mb-4">
              <div className="text-white">
                <h4 className="font-semibold">{user.name}</h4>
                <p className="text-sm text-gray-400">User ID: {user.id}</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  // onClick={() => setEditingUser(user)}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-xl hover:from-yellow-600 hover:to-amber-700 transition-all duration-200"
                >
                  Edit
                </button>
                <button
                  // onClick={() => deleteUser(user.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ProductsComponent() {
  // const {isPending, error, data} = useQuery({queryKey: ['products'], queryFn: })
  return (
    <div className="space-y-8">
      {/* Add Product Form */}
      <div className="bg-[#2a2b2b] p-8 rounded-2xl border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-6">Add New Product</h3>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-3">
            <label className="block text-sm font-medium text-gray-300 mb-2">Product Name</label>
            <input
              type="text"
              placeholder="Enter product name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              className="w-full px-4 py-3 bg-[#202121] border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="lg:col-span-3">
            <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={newProduct.image}
              onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
              className="w-full px-4 py-3 bg-[#202121] border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Price ($)</label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={newProduct.price}
              onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
              className="w-full px-4 py-3 bg-[#202121] border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Weight (kg)</label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={newProduct.kg}
              onChange={(e) => setNewProduct({...newProduct, kg: e.target.value})}
              className="w-full px-4 py-3 bg-[#202121] border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="lg:col-span-2 flex items-end">
            <button
              onClick={addProduct}
              className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-xl hover:from-yellow-600 hover:to-amber-700 transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
            >
              <Plus size={20} />
              <span>Add Product</span>
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-[#2a2b2b] rounded-2xl border border-gray-700 overflow-hidden group hover:border-amber-500/50 transition-all duration-200">
            <div className="relative">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 right-3                         bg-black bg-opacity-40 p-2 rounded-xl text-white flex items-center justify-center space-x-1">
                <button onClick={() => setEditingProduct(product)} className="hover:bg-amber-600 rounded-full p-2">
                  <Edit3 size={16} />
                </button>
                <button onClick={() => deleteProduct(product.id)} className="hover:bg-red-600 rounded-full p-2">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h4 className="text-lg font-semibold text-white">{product.name}</h4>
              <p className="text-sm text-gray-400">${product.price} | {product.kg} kg</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { logout, isAuthenticated, business, user } = useAuthStore()
  const navigate = useNavigate()
  const [newBusiness, setNewBusiness] = useState({
    name: '',
    address: {
      street: '',
      state: '',
      country: '',
    },
    phone: '',
    email: ''
  });
  async function handleBusinessSubmit() {
    
  }
  const tgLink = `${env.VITE_CLIENT_URL}/qr/${business.id}`;
  const qrLink = `${env.VITE_TELEGRAM_BOT_URL}?start=${business.id}`;
  // Products state
  const [products, setProducts] = useState([
    { id: 1, name: 'Bananas', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=200&fit=crop', price: 2.50, kg: 1.2 },
    { id: 2, name: 'Apples', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=200&fit=crop', price: 3.20, kg: 0.8 }
  ]);
  const [newProduct, setNewProduct] = useState({ name: '', image: '', price: '', kg: '' });
  const [editingProduct, setEditingProduct] = useState(null);

  // Carts state
  const [carts, setCarts] = useState([
    { id: 1, user_id: 'user_123', products: [{ id: 1, name: 'Bananas', quantity: 2, price: 2.50 }, { id: 2, name: 'Apples', quantity: 1, price: 3.20 }] },
    { id: 2, user_id: 'user_456', products: [{ id: 1, name: 'Bananas', quantity: 1, price: 2.50 }] }
  ]);
  const [users, setUsers] = useState([{name: "Spectra Gee", id:123}, {name: "Mera Ge", id:13}])
  const [editingCart, setEditingCart] = useState(null);

  // Business state
  // const [business, setBusiness] = useState({});
  const [editingBusiness, setEditingBusiness] = useState(false);

  // QR Code link


  // Functions to calculate percentage changes
  const calculatePercentageChange = (newValue, oldValue) => {
    if (oldValue === 0) return 0;
    return ((newValue - oldValue) / oldValue) * 100;
  };

  // Function to add a new product
  const addProduct = () => {
    if (newProduct.name && newProduct.price && newProduct.kg) {
      const product = {
        id: Date.now(),
        name: newProduct.name,
        image: newProduct.image || 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=300&h=200&fit=crop',
        price: parseFloat(newProduct.price),
        kg: parseFloat(newProduct.kg)
      };
      setProducts([...products, product]);
      setNewProduct({ name: '', image: '', price: '', kg: '' });
    }
  };

  // Function to update a product
  const updateProduct = (id, updatedProduct) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
    setEditingProduct(null);
  };

  // Function to delete a product
  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  // Function to update a cart
  const updateCart = (cartId, updatedProducts) => {
    setCarts(carts.map(cart => cart.id === cartId ? { ...cart, products: updatedProducts } : cart));
    setEditingCart(null);
  };

  // Function to delete a cart
  const deleteCart = (cartId) => {
    setCarts(carts.filter(cart => cart.id !== cartId));
  };

  // Function to copy QR Link
  const copyQRLink = () => {
    navigator.clipboard.writeText(qrLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  async function handleLogout() {
    logout()
    navigate('/')
  }

  // Menu item for sidebar navigation
  const MenuItem = ({ icon: Icon, label, tabKey, badge }:{icon: any, label: string, tabKey: any, badge: any}) => (
    <button
      onClick={() => {
        setActiveTab(tabKey);
        setSidebarOpen(false);
      }}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
        activeTab === tabKey
          ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg'
          : 'text-gray-400 hover:bg-gray-700 hover:text-white'
      }`}
    >
      <div className="flex items-center space-x-3">
        <Icon size={20} />
        <span className="font-medium">{label}</span>
      </div>
      {badge && (
        <span className={`text-xs px-2 py-1 rounded-full ${activeTab === tabKey ? 'bg-white/20 text-white' : 'bg-amber-600 text-white'}`}>
          {badge}
        </span>
      )}
    </button>
  );

  {return isAuthenticated ? (
    <div className="min-h-screen bg-[#202121]">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-screen w-72 bg-[#2a2b2b] z-50 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:fixed lg:h-screen`}>
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            {/* <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center"> */}
              <img src={logo} className='h-auto w-10'/>
              {/* <Package className="w-6 h-6 text-white" /> */}
            {/* </div> */}
            <div className='flex flex-col gap-1 -mb-3'>
              <img src={text} className='h-auto w-30'/>
              <p className="text-sm text-gray-400">Admin Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="p-6 space-y-3">
          <MenuItem icon={Home} label="Dashboard" tabKey="dashboard" badge={null}/>
          <MenuItem icon={Package} label="Products" tabKey="products" badge={products.length} />
          <MenuItem icon={ShoppingCart} label="User Carts" tabKey="carts" badge={carts.length} />
          <MenuItem icon={Users} label="Users" tabKey="users" badge={null}/>
          <MenuItem icon={Building2} label="Business Info" tabKey="business" badge={null}/>
          <MenuItem icon={QrCode} label="QR Store Link" tabKey="qr" badge={null}/>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-gradient-to-r from-yellow-500/10 to-amber-600/10 border border-amber-600/20 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-amber-400">Pro Version</span>
            </div>
            <p className="text-xs text-gray-400">You're using the professional dashboard</p>
          </div>
          <button
            title="Logout"
            onClick={handleLogout}
            className="py-5 px-10 w-full rounded-lg mt-3 text-white bg-red-600 transform transition-all duration-300 ease-in-out hover:bg-red-700 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Header */}
        <header className="bg-[#2a2b2b] border-b border-gray-700 px-6 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
              >
                <Menu size={24} />
              </button>
              <div>
                <h2 className="text-xl font-semibold text-white capitalize">
                  {activeTab === 'dashboard' ? 'Dashboard' :
                    activeTab === 'qr' ? 'QR Store Link' : 
                    activeTab.replace('-', ' ')}
                </h2>
                <p className="text-sm text-gray-400">
                  {activeTab === 'dashboard' ? 'Manage your supermarket efficiently' :
                    activeTab === 'qr' ? 'Share your store with customers' :
                    `Manage your ${activeTab.replace('-', ' ')}`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Online</span>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center text-white font-semibold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6 flex-1 overflow-y-auto">
          {/* Dashboard Overview */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#2a2b2b] p-6 rounded-2xl border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Total Products</p>
                      <p className="text-3xl font-bold text-white">{products.length}</p>
                      <p className="text-xs text-green-400 mt-1 flex items-center">
                        <TrendingUp size={12} className="mr-1" />
                        +{calculatePercentageChange(products.length, products.length - 1).toFixed(2)}% from last month
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                      <Package className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-[#2a2b2b] p-6 rounded-2xl border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Active Carts</p>
                      <p className="text-3xl font-bold text-white">{carts.length}</p>
                      <p className="text-xs text-green-400 mt-1 flex items-center">
                        <TrendingUp size={12} className="mr-1" />
                        +8% from yesterday
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6 text-purple-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-[#2a2b2b] p-6 rounded-2xl border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Total Revenue</p>
                      <p className="text-3xl font-bold text-white">$2,450</p>
                      <p className="text-xs text-green-400 mt-1 flex items-center">
                        <TrendingUp size={12} className="mr-1" />
                        +15% this week
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                      <span className="text-green-400 text-xl font-bold">$</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#2a2b2b] p-6 rounded-2xl border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Customers</p>
                      <p className="text-3xl font-bold text-white">156</p>
                      <p className="text-xs text-green-400 mt-1 flex items-center">
                        <TrendingUp size={12} className="mr-1" />
                        +24 new this week
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-amber-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-[#2a2b2b] p-8 rounded-2xl border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <button
                    onClick={() => setActiveTab('products')}
                    className="group p-6 border-2 border-dashed border-amber-600/30 rounded-2xl hover:border-amber-500 hover:bg-amber-500/5 transition-all duration-200 text-center"
                  >
                    <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-500/20 transition-colors">
                      <Package className="w-8 h-8 text-amber-400" />
                    </div>
                    <p className="font-semibold text-white mb-2">Add New Product</p>
                    <p className="text-sm text-gray-400">Expand your inventory</p>
                  </button>

                  <button
                    onClick={() => setActiveTab('carts')}
                    className="group p-6 border-2 border-dashed border-amber-600/30 rounded-2xl hover:border-amber-500 hover:bg-amber-500/5 transition-all duration-200 text-center"
                  >
                    <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-500/20 transition-colors">
                      <ShoppingCart className="w-8 h-8 text-amber-400" />
                    </div>
                    <p className="font-semibold text-white mb-2">Manage Carts</p>
                    <p className="text-sm text-gray-400">View customer orders</p>
                  </button>

                  <button
                    onClick={() => setActiveTab('business')}
                    className="group p-6 border-2 border-dashed border-amber-600/30 rounded-2xl hover:border-amber-500 hover:bg-amber-500/5 transition-all duration-200 text-center"
                  >
                    <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-500/20 transition-colors">
                      <Building2 className="w-8 h-8 text-amber-400" />
                    </div>
                    <p className="font-semibold text-white mb-2">{business?.name ? 'Edit Business Info' : 'Add Business'}</p>
                    <p className="text-sm text-gray-400">Manage your business info</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Products Section */}
          {activeTab === 'products' && (
            <div className="space-y-8">
              {/* Add Product Form */}
              <div className="bg-[#2a2b2b] p-8 rounded-2xl border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-6">Add New Product</h3>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
                  <div className="lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Product Name</label>
                    <input
                      type="text"
                      placeholder="Enter product name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      className="w-full px-4 py-3 bg-[#202121] border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    />
                  </div>

                  <div className="lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                      className="w-full px-4 py-3 bg-[#202121] border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      className="w-full px-4 py-3 bg-[#202121] border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newProduct.kg}
                      onChange={(e) => setNewProduct({...newProduct, kg: e.target.value})}
                      className="w-full px-4 py-3 bg-[#202121] border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    />
                  </div>

                  <div className="lg:col-span-2 flex items-end">
                    <button
                      onClick={addProduct}
                      className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-xl hover:from-yellow-600 hover:to-amber-700 transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
                    >
                      <Plus size={20} />
                      <span>Add Product</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-[#2a2b2b] rounded-2xl border border-gray-700 overflow-hidden group hover:border-amber-500/50 transition-all duration-200">
                    <div className="relative">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 right-3                         bg-black bg-opacity-40 p-2 rounded-xl text-white flex items-center justify-center space-x-1">
                        <button onClick={() => setEditingProduct(product)} className="hover:bg-amber-600 rounded-full p-2">
                          <Edit3 size={16} />
                        </button>
                        <button onClick={() => deleteProduct(product.id)} className="hover:bg-red-600 rounded-full p-2">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="text-lg font-semibold text-white">{product.name}</h4>
                      <p className="text-sm text-gray-400">${product.price} | {product.kg} kg</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* QR Section */}
          {activeTab === 'qr' && (
            <div className="space-y-8 flex flex-col">
              {/* <h3 className="text-xl font-semibold text-white mb-6">QR Store Link</h3> */}
              <div className="flex justify-center mb-6">
                  <QRCode 
                    value={qrLink} 
                    className="border-20 border-white h-auto w-[50%] max-h-100 rounded-lg bg-white p-4"
                    // size={200}
                  />
                </div>
              <div className="flex flex-col sm:flex-row items-center justify-center space-x-0 sm:space-x-4">
                {/* Input Box for QR Link */}
                <div className="relative w-full sm:w-1/2 bg-[#202121] border border-gray-600 rounded-xl">
                  <input
                    type="text"
                    value={`${env.VITE_TELEGRAM_BOT_URL}?start=${business.id}`}
                    readOnly
                    disabled
                    className="w-full px-6 py-3 bg-[#202121] text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 rounded-xl"
                  />
                  {console.log(business)}
                  <div className="absolute inset-y-0 -right-4 flex items-center pr-4">
                    <button
                      onClick={() => navigate(`/qr/${business.id}`, {
                        state: { store_name: business.name || 'My Store' }
                      })}
                      // onClick={() => window.open(qrLink, '_blank')}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-600 text-white rounded-tl-lg rounded-bl-lg hover:from-blue-600 hover:to-green-700 transition-all duration-200 flex items-center space-x-2"
                    >
                      {copied ? (
                        <span>Copied!</span>
                      ) : (
                        <>
                          <span>Open Link</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={copyQRLink}
                      className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-tr-lg rounded-br-lg  hover:from-yellow-600 hover:to-amber-700 transition-all duration-200 flex items-center space-x-2"
                    >
                      {copied ? (
                        <span>Copied!</span>
                      ) : (
                        <>
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Carts Section */}
          
          {activeTab === 'carts' && (
            <div className="space-y-8">
              <h3 className="text-xl font-semibold text-white mb-6">Manage User Carts</h3>
              {carts.map((cart) => (
                <div key={cart.id} className="bg-[#2a2b2b] p-6 rounded-2xl border border-gray-700">
                  <h4 className="text-lg font-semibold text-white">User ID: {cart.user_id}</h4>
                  <div className="mt-4">
                    <h5 className="text-sm text-gray-400">Products</h5>
                    {cart.products.map((product, index) => (
                      <div key={index} className="flex justify-between text-sm text-white">
                        <span>{product.name}</span>
                        <span>{product.quantity} x ${product.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Users Section */}
          {activeTab === 'users' && (
            // <div className="space-y-8">
            //   {/* User Count & Filters */}
            //   <div className="flex justify-between items-center">
            //     <div className="flex flex-col gap-0">
            //       <h3 className="text-xl font-semibold text-white">Users</h3>
            //       <span className="text-sm text-gray-400">Total Users: {users.length}</span>
            //     </div>
            //     <div className="flex items-center space-x-2">
            //       <input
            //         type="text"
            //         placeholder="Search users"
            //         className="px-4 py-2 bg-[#202121] border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            //       />
            //     </div>
            //   </div>

            //   {/* No users message */}
            //   {users.length === 0 ? (
            //     <div className="text-center text-white">
            //       <p>No users found</p>
            //     </div>
            //   ) : (
            //     <div>
            //       {/* Users List */}
            //       {users.map((user) => (
            //         <div key={user.id} className="bg-[#2a2b2b] p-6 rounded-2xl border border-gray-700 flex justify-between items-center mb-4">
            //           <div className="text-white">
            //             <h4 className="font-semibold">{user.name}</h4>
            //             <p className="text-sm text-gray-400">User ID: {user.id}</p>
            //           </div>
            //           <div className="flex items-center space-x-4">
            //             <button
            //               onClick={() => setEditingUser(user)}
            //               className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-xl hover:from-yellow-600 hover:to-amber-700 transition-all duration-200"
            //             >
            //               Edit
            //             </button>
            //             <button
            //               onClick={() => deleteUser(user.id)}
            //               className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200"
            //             >
            //               Delete
            //             </button>
            //           </div>
            //         </div>
            //       ))}
            //     </div>
            //   )}
            // </div>
            <UsersComponent/>
          )}
          {activeTab === 'business' && (
  <div className="space-y-8">
    {/* Business Info */}
    {!business ? (
      <div className="bg-[#2a2b2b] p-6 rounded-2xl border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-6">No Business Info Found</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Button to Add Business */}
          <button
            onClick={() => setEditingBusiness(true)}
            className="group p-6 border-2 border-dashed border-amber-600/30 rounded-2xl hover:border-amber-500 hover:bg-amber-500/5 transition-all duration-200 text-center"
          >
            <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-500/20 transition-colors">
              <Building2 className="w-8 h-8 text-amber-400" />
            </div>
            <p className="font-semibold text-white mb-2">Add Business</p>
            <p className="text-sm text-gray-400">Set up your business profile</p>
          </button>

          {/* Button to Assign Business Address */}
          <button
            onClick={() => setEditingAddress(true)}
            className="group p-6 rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-600 hover:border-amber-500 hover:bg-amber-500/5 transition-all duration-200 text-center"
          >
            <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-500/20 transition-colors">
              <Smile className="w-20 h-auto text-white" />
            </div>
            <p className="font-semibold text-white mb-2">Assign Business Address</p>
            {/* <p className="text-sm text-gray-400">Provide your business address</p> */}
          </button>
        </div>

        {/* Add Business Form */}
        {editingBusiness && (
          <div className="mt-6">
            <h4 className="text-lg text-white">Add Business Info</h4>
            <form onSubmit={handleBusinessSubmit}>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Business Name"
                  className="w-full p-3 bg-[#2a2b2b] text-white border border-gray-600 rounded-xl"
                  value={newBusiness.name}
                  onChange={(e) => setNewBusiness({ ...newBusiness, name: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Business Email"
                  className="w-full p-3 bg-[#2a2b2b] text-white border border-gray-600 rounded-xl"
                  value={newBusiness.email}
                  onChange={(e) => setNewBusiness({ ...newBusiness, email: e.target.value })}
                />
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Street Address"
                    className="w-full p-3 bg-[#2a2b2b] text-white border border-gray-600 rounded-xl"
                    value={newBusiness.address.street}
                    onChange={(e) => setNewBusiness({ ...newBusiness, address: { ...newBusiness.address, street: e.target.value } })}
                  />
                  <input
                    type="text"
                    placeholder="State"
                    className="w-full p-3 bg-[#2a2b2b] text-white border border-gray-600 rounded-xl"
                    value={newBusiness.address.state}
                    onChange={(e) => setNewBusiness({ ...newBusiness, address: { ...newBusiness.address, state: e.target.value } })}
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    className="w-full p-3 bg-[#2a2b2b] text-white border border-gray-600 rounded-xl"
                    value={newBusiness.address.country}
                    onChange={(e) => setNewBusiness({ ...newBusiness, address: { ...newBusiness.address, country: e.target.value } })}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 text-white rounded-xl mt-4 hover:bg-amber-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    ) : (
      <div className="bg-[#2a2b2b] p-6 rounded-2xl border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-6">Business Info</h3>
        <p className="text-sm text-gray-400">Name: {business?.name}</p>
        <p className="text-sm text-gray-400">Email: {business?.email}</p>
        {business?.address ? (
          <div>
            <p className="text-sm text-gray-400">Address: {business.address.street}, {business.address.state}, {business.address.country}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-400">No Address Assigned</p>
        )}
      </div>
    )}
  </div>
)}



        </main>
      </div>
    </div>
  ) : <ErrorPage msg="Unauthenticated"/>
}
}
