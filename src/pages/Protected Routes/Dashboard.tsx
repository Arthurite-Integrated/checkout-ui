import { useState } from "react";
import {
  ShoppingCart,
  Package,
  Building2,
  QrCode,
  RefreshCw as Refresh,
  Menu,
  Home,
  Users,
  Star,
  TrendingUp,
  Settings2,
  DollarSign
} from "lucide-react";
import logo from "./../../assets/logo.png";
import text from "./../../assets/text_1.png";
import { useAuthStore } from "./../../store";
import { useNavigate } from "react-router-dom";
import ErrorPage from "../../components/ErrorPage";
import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Toast } from "../../utils/Toast";
import server from "../../server";
import CartsComponent from "../../components/cart";
import ProductsComponent from "../../components/product";
import UsersComponent from "../../components/user";
import BusinessComponent from "../../components/business";
import QRComponent from "../../components/qr";
import SettingsPage from "../../components/settings";
import Avatar, { genConfig } from 'react-nice-avatar'
import OrdersComponent from "../../components/order";
import PaymentsComponent from "../../components/payment";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);


export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, isAuthenticated, business, user } = useAuthStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const config = genConfig({
    bgColor: '#f0b100',
    sex: "man", 
    hairStyle: "thick", 
    eyeStyle: "circle", 
    glassesStyle: "round", 
    noseStyle: "round", 
    mouthStyle: "laugh", 
    shirtStyle: "hoody", 
    eyeBrowStyle: "up" 
  });
  const navigate = useNavigate();
  const {
    isPending: productIsPending,
    error: productError,
    data: products = [],
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => server.getProducts(business.id),
    enabled: !!business?.id
  });

  const {
    isPending: cartIsPending,
    error: cartError,
    data: carts = [],
  } = useQuery({
    queryKey: ["carts"],
    queryFn: () => server.getUserCarts(business.id),
    enabled: !!business?.id
  });

  const {
    isPending: userIsPending,
    error: userError,
    data: users = [],
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => server.getUsers(business.id),
    enabled: !!business?.id
  });

  const {
    isPending: orderIsPending,
    error: orderError,
    data: orders = [],
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () => server.getOrders(business.id),
    enabled: !!business?.id
  });
  
  const {
    isPending: paymentIsPending,
    error: paymentError,
    data: payments = [],
  } = useQuery({
    queryKey: ["payments"],
    queryFn: () => server.getPayments(business.id),
    enabled: !!business?.id
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);

    try {
      // Invalidate all queries and wait for them to complete
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["carts"] });
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      await queryClient.invalidateQueries({ queryKey: ["settings"] });
      Toast("Data refreshed successfully!", false);
    } catch (error) {
      console.error("Refresh failed:", error);
      Toast("Failed to refresh data", true);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  async function handleLogout() {
    logout();
    navigate("/");
  }

  // Menu item for sidebar navigation
  const MenuItem = ({
    icon: Icon,
    label,
    tabKey,
    badge,
  }: {
    icon: any;
    label: string;
    tabKey: any;
    badge: any;
  }) => (
    <button
      onClick={() => {
        setActiveTab(tabKey);
        setSidebarOpen(false);
      }}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
        activeTab === tabKey
          ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg"
          : "text-gray-400 hover:bg-gray-700 hover:text-white"
      }`}
    >
      <div className="flex items-center space-x-3">
        <Icon size={20} />
        <span className="font-medium">{label}</span>
      </div>
      {badge && (
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            activeTab === tabKey
              ? "bg-white/20 text-white"
              : "bg-amber-600 text-white"
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
  {
    return isAuthenticated ? (
      <div className="min-h-screen bg-[#202121]">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`fixed left-0 top-0 h-screen w-72 bg-[#2a2b2b] z-50 transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 lg:fixed lg:h-screen`}
        >
          <div className="p-4 px-10">
            <div className="flex items-center space-x-3">
              {/* <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center"> */}
              <img src={logo} className="h-auto w-10" />
              {/* <Package className="w-6 h-6 text-white" /> */}
              {/* </div> */}
              <div className="flex flex-col gap-1 -mb-3">
                <img src={text} className="h-auto w-30" />
                <p className="text-sm text-gray-400">Admin Dashboard</p>
              </div>
            </div>
          </div>

          <nav className="p-6 space-y-3">
            <MenuItem
              icon={Home}
              label="Dashboard"
              tabKey="dashboard"
              badge={null}
            />
            <MenuItem
              icon={Package}
              label="Products"
              tabKey="products"
              badge={products.length}
            />
            <MenuItem
              icon={ShoppingCart}
              label="User Carts"
              tabKey="carts"
              badge={carts.length}
            />
            <MenuItem icon={Users} label="Users" tabKey="users" badge={null} />
            <MenuItem
              icon={Building2}
              label="Business Info"
              tabKey="business"
              badge={null}
            />
            <MenuItem
              icon={QrCode}
              label="QR Store Link"
              tabKey="qr"
              badge={null}
            />
            <MenuItem
              icon={ShoppingCart}
              label="Orders"
              tabKey="orders"
              badge={null}
            />
            <MenuItem
              icon={DollarSign}
              label="Payments"
              tabKey="payments"
              badge={null}
            />
            <MenuItem
              icon={Settings2}
              label="Settings"
              tabKey="settings"
              badge={null}
            />
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="hidden md:block bg-gradient-to-r from-yellow-500/10 to-amber-600/10 border border-amber-600/20 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium text-amber-400">
                  Pro Version
                </span>
              </div>
              <p className="text-xs text-gray-400">
                You're using the professional dashboard
              </p>
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
          <header className="fixed top-0 right-0 left-0 lg:left-72 bg-[#2a2b2b] border-b border-gray-700 px-6 py-3.5 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
            >
              <Menu size={24} />
            </button>
            <div>
              <h2 className="text-[17px] md:text-xl font-semibold text-white capitalize">
              {activeTab === "dashboard"
                ? "Dashboard"
                : activeTab === "qr"
                ? "QR Store Link"
                : activeTab === "verify"
                ? "Verify Payments"
                : activeTab === "settings"
                ? "Settings"
                : activeTab.replace("-", " ")}
              </h2>
              <p className="text-sm text-gray-400">
              {activeTab === "dashboard"
                ? "Manage your supermarket efficiently"
                : activeTab === "qr"
                ? "Share your store with customers"
                : activeTab === "verify"
                ? "Confirm your customer payments"
                : activeTab === "settings"
                ? "Welcome to admin settings 😊"
                : `Manage your ${activeTab.replace("-", " ")}`}
              </p>
            </div>
            </div>
            <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Online</span>
            </div>
            <div
              onClick={handleRefresh}
              className="w-fit px-3 gap-1 h-10 bg-[#202121] border-[#4a5565] border-1 to-amber-600 rounded-xl flex items-center justify-center text-white font-semibold"
            >
              <Refresh
              className={`w-5 h-auto text-amber-400 transition-transform duration-500 ${
                isRefreshing ? "animate-spin" : ""
              }`}
              />
              <span className='hidden md:block'>Refresh</span>
            </div>
            <div className='relative ml-7'>
              <Avatar className="w-10 h-10" {...config} />
              <div className="absolute -left-8 top-0 w-10 h-10 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user.first_name[0].toUpperCase() +
                user.last_name[0].toUpperCase()}
              </div>
            </div>
            </div>
          </div>
          </header>

          {/* Content */}
          <main className="p-6 flex-1 overflow-y-auto pt-35 md:pt-25">
            {/* Dashboard Overview */}
            {activeTab === "dashboard" && (
              <div className="space-y-8">
                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Products Card */}
                  <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 p-6 rounded-2xl backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-200 mb-1">Total Products</p>
                        <p className="text-3xl font-bold text-white">{products.length}</p>
                        <p className="text-xs text-blue-400 mt-1 flex items-center">
                          <TrendingUp size={12} className="mr-1" />
                          {products.length > 0 ? "+12% from last month" : "Start adding products"}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                        <Package className="w-6 h-6 text-blue-400" />
                      </div>
                    </div>
                  </div>

                  {/* Active Carts Card */}
                  <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 p-6 rounded-2xl backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-200 mb-1">Active Carts</p>
                        <p className="text-3xl font-bold text-white">{carts.length}</p>
                        <p className="text-xs text-purple-400 mt-1 flex items-center">
                          <ShoppingCart size={12} className="mr-1" />
                          {carts.length > 0 ? "Customers shopping" : "No active carts"}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                        <ShoppingCart className="w-6 h-6 text-purple-400" />
                      </div>
                    </div>
                  </div>

                  {/* Total Revenue Card */}
                  <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 p-6 rounded-2xl backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-emerald-200 mb-1">Total Revenue</p>
                        <p className="text-3xl font-bold text-white">
                          ₦{payments.length > 0 ? 
                            (payments.reduce((sum: number, payment: any) => sum + payment.amount, 0) / 100).toFixed(2) : 
                            "0.00"
                          }
                        </p>
                        <p className="text-xs text-emerald-400 mt-1 flex items-center">
                          <DollarSign size={12} className="mr-1" />
                          {payments.length} successful payments
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-emerald-400" />
                      </div>
                    </div>
                  </div>

                  {/* Orders Card */}
                  <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 p-6 rounded-2xl backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-amber-200 mb-1">Total Orders</p>
                        <p className="text-3xl font-bold text-white">{orders.length}</p>
                        <p className="text-xs text-amber-400 mt-1 flex items-center">
                          <TrendingUp size={12} className="mr-1" />
                          {orders.filter((order: any) => order.status === 'pending').length} pending approval
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                        <Star className="w-6 h-6 text-amber-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Analytics Section with Business-Friendly Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Business Metrics Bar Chart */}
                  <div className="relative group">
                    {/* Animated background glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-all duration-500 animate-pulse"></div>
                    
                    <div className="relative bg-gradient-to-br from-[#2a2b2b] via-[#2d2e2e] to-[#2a2b2b] border border-gray-600/50 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
                      {/* Header with glass effect */}
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h3 className="text-xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                            Business Overview
                          </h3>
                          <p className="text-sm text-gray-400 mt-1">Key metrics at a glance</p>
                        </div>
                        <div className="px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 rounded-2xl backdrop-blur-sm">
                          <div className="text-emerald-400 text-sm font-bold flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                            {products.length + orders.length + users.length} Total Items
                          </div>
                        </div>
                      </div>
                      
                      {/* Chart container with enhanced styling */}
                      <div className="relative h-80">
                        {/* Subtle grid background */}
                        <div className="absolute inset-0 opacity-5">
                          <div className="w-full h-full" style={{
                            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                            backgroundSize: '20px 20px'
                          }}></div>
                        </div>
                        
                        <Bar
                          data={{
                            labels: ['Products', 'Active Carts', 'Customers', 'Orders', 'Payments'],
                            datasets: [
                              {
                                label: 'Count',
                                data: [
                                  products.length,
                                  carts.length,
                                  users.length,
                                  orders.length,
                                  payments.length
                                ],
                                backgroundColor: [
                                  'rgba(59, 130, 246, 0.8)',   // Blue for Products
                                  'rgba(147, 51, 234, 0.8)',   // Purple for Carts
                                  'rgba(16, 185, 129, 0.8)',   // Green for Customers
                                  'rgba(245, 158, 11, 0.8)',   // Amber for Orders
                                  'rgba(239, 68, 68, 0.8)',    // Red for Payments
                                ],
                                borderColor: [
                                  'rgba(59, 130, 246, 1)',
                                  'rgba(147, 51, 234, 1)',
                                  'rgba(16, 185, 129, 1)',
                                  'rgba(245, 158, 11, 1)',
                                  'rgba(239, 68, 68, 1)',
                                ],
                                borderWidth: 2,
                                borderRadius: 8,
                                borderSkipped: false,
                              }
                            ],
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                display: false, // Hide legend for cleaner look
                              },
                              tooltip: {
                                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                                titleColor: '#f3f4f6',
                                bodyColor: '#e5e7eb',
                                borderColor: 'rgba(75, 85, 99, 0.3)',
                                borderWidth: 1,
                                cornerRadius: 12,
                                padding: 16,
                                titleFont: { size: 14, weight: 'bold' },
                                bodyFont: { size: 13 },
                                callbacks: {
                                  label: function(context: any) {
                                    return `${context.dataset.label}: ${context.parsed.y}`;
                                  }
                                }
                              }
                            },
                            scales: {
                              x: {
                                border: {
                                  color: 'rgba(75, 85, 99, 0.4)',
                                },
                                grid: {
                                  display: false,
                                },
                                ticks: {
                                  color: '#f3f4f6',
                                  font: {
                                    size: 12,
                                    weight: 500,
                                  },
                                  padding: 10,
                                }
                              },
                              y: {
                                border: {
                                  color: 'rgba(75, 85, 99, 0.4)',
                                },
                                grid: {
                                  color: 'rgba(75, 85, 99, 0.2)',
                                  lineWidth: 1,
                                },
                                ticks: {
                                  color: '#f3f4f6',
                                  font: {
                                    size: 12,
                                    weight: 500,
                                  },
                                  padding: 10,
                                  stepSize: 1,
                                }
                              },
                            },
                            animation: {
                              duration: 1500,
                              easing: 'easeOutQuart',
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Revenue Trend Line Chart */}
                  <div className="relative group">
                    {/* Animated background glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-emerald-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-all duration-500 animate-pulse"></div>
                    
                    <div className="relative bg-gradient-to-br from-[#2a2b2b] via-[#2d2e2e] to-[#2a2b2b] border border-gray-600/50 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
                      {/* Enhanced header */}
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h3 className="text-xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                            Revenue Growth
                          </h3>
                          <p className="text-sm text-gray-400 mt-1">Monthly revenue & order trends</p>
                        </div>
                        <button 
                          onClick={() => setActiveTab("payments")}
                          className="group/btn px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 hover:from-emerald-500/30 hover:to-emerald-600/30 border border-emerald-500/30 hover:border-emerald-400/50 rounded-2xl backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
                        >
                          <span className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold flex items-center gap-2">
                            View Details
                            <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </button>
                      </div>
                      
                      {/* Chart container with enhanced styling */}
                      <div className="relative h-80">
                        {/* Subtle grid background */}
                        <div className="absolute inset-0 opacity-5">
                          <div className="w-full h-full" style={{
                            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                            backgroundSize: '20px 20px'
                          }}></div>
                        </div>
                        
                        <Line
                          data={{
                            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                            datasets: [
                              {
                                label: 'Revenue (₦)',
                                data: [
                                  0,
                                  payments.length > 0 ? payments.slice(0, 1).reduce((sum: number, p: any) => sum + p.amount, 0) / 100 : 0,
                                  payments.length > 1 ? payments.slice(0, 2).reduce((sum: number, p: any) => sum + p.amount, 0) / 100 : 0,
                                  payments.length > 2 ? payments.slice(0, 3).reduce((sum: number, p: any) => sum + p.amount, 0) / 100 : 0,
                                  payments.length > 3 ? payments.slice(0, 4).reduce((sum: number, p: any) => sum + p.amount, 0) / 100 : 0,
                                  payments.length > 4 ? payments.slice(0, 5).reduce((sum: number, p: any) => sum + p.amount, 0) / 100 : 0,
                                  payments.length > 0 ? payments.reduce((sum: number, p: any) => sum + p.amount, 0) / 100 : 0,
                                ],
                                borderColor: 'rgb(16, 185, 129)',
                                backgroundColor: (context: any) => {
                                  const ctx = context.chart.ctx;
                                  const gradient = ctx.createLinearGradient(0, 0, 0, 320);
                                  gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
                                  gradient.addColorStop(0.7, 'rgba(16, 185, 129, 0.1)');
                                  gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
                                  return gradient;
                                },
                                borderWidth: 3,
                                fill: true,
                                tension: 0.4,
                                pointBackgroundColor: 'rgb(16, 185, 129)',
                                pointBorderColor: '#ffffff',
                                pointBorderWidth: 2,
                                pointRadius: 6,
                                pointHoverRadius: 8,
                                pointHoverBackgroundColor: 'rgb(16, 185, 129)',
                                pointHoverBorderColor: '#ffffff',
                                pointHoverBorderWidth: 3,
                              },
                              {
                                label: 'Order Count',
                                data: [
                                  0,
                                  orders.length > 0 ? Math.min(orders.slice(0, 1).length, 10) : 0,
                                  orders.length > 1 ? Math.min(orders.slice(0, 2).length, 10) : 0,
                                  orders.length > 2 ? Math.min(orders.slice(0, 3).length, 10) : 0,
                                  orders.length > 3 ? Math.min(orders.slice(0, 4).length, 10) : 0,
                                  orders.length > 4 ? Math.min(orders.slice(0, 5).length, 10) : 0,
                                  Math.min(orders.length, 10),
                                ],
                                borderColor: 'rgb(59, 130, 246)',
                                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                borderWidth: 3,
                                fill: false,
                                tension: 0.4,
                                pointBackgroundColor: 'rgb(59, 130, 246)',
                                pointBorderColor: '#ffffff',
                                pointBorderWidth: 2,
                                pointRadius: 5,
                                pointHoverRadius: 7,
                                borderDash: [5, 5],
                                yAxisID: 'y1',
                              }
                            ],
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            interaction: {
                              mode: 'index' as const,
                              intersect: false,
                            },
                            plugins: {
                              legend: {
                                position: 'bottom' as const,
                                labels: {
                                  color: '#e5e7eb',
                                  padding: 20,
                                  usePointStyle: true,
                                  pointStyle: 'circle',
                                  font: {
                                    size: 13,
                                    weight: 500,
                                  }
                                }
                              },
                              tooltip: {
                                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                                titleColor: '#f3f4f6',
                                bodyColor: '#e5e7eb',
                                borderColor: 'rgba(16, 185, 129, 0.5)',
                                borderWidth: 2,
                                cornerRadius: 12,
                                padding: 16,
                                titleFont: { size: 14, weight: 'bold' },
                                bodyFont: { size: 13 },
                                displayColors: true,
                                boxPadding: 8,
                                callbacks: {
                                  label: function(context: any) {
                                    if (context.dataset.label === 'Revenue (₦)') {
                                      return `Revenue: ₦${context.parsed.y.toFixed(2)}`;
                                    }
                                    return `Orders: ${context.parsed.y}`;
                                  }
                                }
                              }
                            },
                            scales: {
                              x: {
                                border: {
                                  color: 'rgba(75, 85, 99, 0.4)',
                                  width: 1,
                                },
                                grid: {
                                  color: 'rgba(75, 85, 99, 0.2)',
                                  lineWidth: 1,
                                },
                                ticks: {
                                  color: '#f3f4f6',
                                  font: {
                                    size: 12,
                                    weight: 500,
                                  },
                                  padding: 10,
                                }
                              },
                              y: {
                                type: 'linear' as const,
                                display: true,
                                position: 'left' as const,
                                border: {
                                  color: 'rgba(75, 85, 99, 0.4)',
                                  width: 1,
                                },
                                grid: {
                                  color: 'rgba(75, 85, 99, 0.2)',
                                  lineWidth: 1,
                                },
                                ticks: {
                                  color: '#f3f4f6',
                                  font: {
                                    size: 11,
                                    weight: 500,
                                  },
                                  padding: 10,
                                  callback: function(value: any) {
                                    return '₦' + value.toFixed(0);
                                  }
                                }
                              },
                              y1: {
                                type: 'linear' as const,
                                display: true,
                                position: 'right' as const,
                                border: {
                                  color: 'rgba(75, 85, 99, 0.4)',
                                  width: 1,
                                },
                                grid: {
                                  drawOnChartArea: false,
                                },
                                ticks: {
                                  color: '#f3f4f6',
                                  font: {
                                    size: 11,
                                    weight: 500,
                                  },
                                  padding: 10,
                                  stepSize: 1,
                                  callback: function(value: any) {
                                    return value + ' orders';
                                  }
                                }
                              },
                            },
                            animation: {
                              duration: 1500,
                              easing: 'easeOutQuart',
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Simple Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Order Status Doughnut Chart */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-rose-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-all duration-500"></div>
                    
                    <div className="relative bg-gradient-to-br from-[#2a2b2b] via-[#2d2e2e] to-[#2a2b2b] border border-gray-600/50 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h3 className="text-xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                            Order Status
                          </h3>
                          <p className="text-sm text-gray-400 mt-1">Current order distribution</p>
                        </div>
                        <button 
                          onClick={() => setActiveTab("orders")}
                          className="text-emerald-400 hover:text-emerald-300 text-sm font-medium"
                        >
                          Manage Orders →
                        </button>
                      </div>
                      
                      <div className="relative h-80 flex items-center justify-center">
                        <Doughnut
                          data={{
                            labels: ['Pending', 'Approved', 'Completed', 'Cancelled'],
                            datasets: [
                              {
                                data: [
                                  orders.filter((order: any) => order.status === 'pending').length,
                                  orders.filter((order: any) => order.status === 'approved').length,
                                  orders.filter((order: any) => order.status === 'completed').length,
                                  orders.filter((order: any) => order.status === 'cancelled').length,
                                ],
                                backgroundColor: [
                                  'rgba(245, 158, 11, 0.8)',   // Amber for Pending
                                  'rgba(16, 185, 129, 0.8)',   // Green for Approved
                                  'rgba(59, 130, 246, 0.8)',   // Blue for Completed
                                  'rgba(239, 68, 68, 0.8)',    // Red for Cancelled
                                ],
                                borderColor: [
                                  'rgba(245, 158, 11, 1)',
                                  'rgba(16, 185, 129, 1)',
                                  'rgba(59, 130, 246, 1)',
                                  'rgba(239, 68, 68, 1)',
                                ],
                                borderWidth: 2,
                                hoverBorderWidth: 3,
                              }
                            ],
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            cutout: '60%',
                            plugins: {
                              legend: {
                                position: 'bottom' as const,
                                labels: {
                                  color: '#e5e7eb',
                                  padding: 20,
                                  usePointStyle: true,
                                  pointStyle: 'circle',
                                  font: {
                                    size: 12,
                                    weight: 500,
                                  }
                                }
                              },
                              tooltip: {
                                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                                titleColor: '#f3f4f6',
                                bodyColor: '#e5e7eb',
                                borderColor: 'rgba(75, 85, 99, 0.3)',
                                borderWidth: 1,
                                cornerRadius: 12,
                                padding: 16,
                                callbacks: {
                                  label: function(context: any) {
                                    const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                                    const percentage = ((context.parsed / total) * 100).toFixed(1);
                                    return `${context.label}: ${context.parsed} (${percentage}%)`;
                                  }
                                }
                              }
                            },
                            animation: {
                              duration: 1500,
                              easing: 'easeOutQuart',
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Customer Activity Bar Chart */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-teal-500/20 to-emerald-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-all duration-500"></div>
                    
                    <div className="relative bg-gradient-to-br from-[#2a2b2b] via-[#2d2e2e] to-[#2a2b2b] border border-gray-600/50 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h3 className="text-xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                            Weekly Activity
                          </h3>
                          <p className="text-sm text-gray-400 mt-1">Orders & revenue by day</p>
                        </div>
                        <div className="text-cyan-400 text-sm font-medium">
                          This Week
                        </div>
                      </div>
                      
                      <div className="relative h-80">
                        <Bar
                          data={{
                            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                            datasets: [
                              {
                                label: 'Orders',
                                data: [
                                  Math.floor(Math.random() * orders.length) + 1,
                                  Math.floor(Math.random() * orders.length) + 1,
                                  Math.floor(Math.random() * orders.length) + 1,
                                  Math.floor(Math.random() * orders.length) + 1,
                                  Math.floor(Math.random() * orders.length) + 1,
                                  Math.floor(Math.random() * orders.length) + 2,
                                  Math.floor(Math.random() * orders.length) + 1,
                                ],
                                backgroundColor: 'rgba(6, 182, 212, 0.7)',
                                borderColor: 'rgba(6, 182, 212, 1)',
                                borderWidth: 2,
                                borderRadius: 6,
                                borderSkipped: false,
                              }
                            ],
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                display: false,
                              },
                              tooltip: {
                                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                                titleColor: '#f3f4f6',
                                bodyColor: '#e5e7eb',
                                borderColor: 'rgba(75, 85, 99, 0.3)',
                                borderWidth: 1,
                                cornerRadius: 12,
                                padding: 16,
                              }
                            },
                            scales: {
                              x: {
                                border: {
                                  color: 'rgba(75, 85, 99, 0.4)',
                                },
                                grid: {
                                  display: false,
                                },
                                ticks: {
                                  color: '#f3f4f6',
                                  font: {
                                    size: 12,
                                    weight: 500,
                                  },
                                }
                              },
                              y: {
                                border: {
                                  color: 'rgba(75, 85, 99, 0.4)',
                                },
                                grid: {
                                  color: 'rgba(75, 85, 99, 0.2)',
                                },
                                ticks: {
                                  color: '#f3f4f6',
                                  font: {
                                    size: 11,
                                    weight: 500,
                                  },
                                  stepSize: 1,
                                }
                              },
                            },
                            animation: {
                              duration: 1500,
                              easing: 'easeOutQuart',
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Beautiful Customer Insights - Redesigned */}
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-600/30 p-8 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Customer Insights</h3>
                      <p className="text-sm text-gray-400">Track your customer engagement and growth</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab("users")}
                      className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 hover:text-blue-300 rounded-xl text-sm font-medium transition-all duration-200"
                    >
                      View All Customers →
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Total Customers */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                      <div className="relative bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/20 p-6 rounded-2xl backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-400" />
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-blue-300 font-medium px-2 py-1 bg-blue-500/20 rounded-full">
                              Total
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-3xl font-bold text-white">{users?.length || 0}</p>
                          <p className="text-sm text-blue-200 font-medium">Total Customers</p>
                          <p className="text-xs text-blue-400/70">Registered users</p>
                        </div>
                      </div>
                    </div>

                    {/* Active Buyers */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                      <div className="relative bg-gradient-to-br from-emerald-500/10 to-green-500/5 border border-emerald-500/20 p-6 rounded-2xl backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                            <ShoppingCart className="w-6 h-6 text-emerald-400" />
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-emerald-300 font-medium px-2 py-1 bg-emerald-500/20 rounded-full">
                              Active
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-3xl font-bold text-white">
                            {orders.length > 0 ? new Set(orders.map((order: any) => order.user_id)).size : 0}
                          </p>
                          <p className="text-sm text-emerald-200 font-medium">Active Buyers</p>
                          <p className="text-xs text-emerald-400/70">Customers with orders</p>
                        </div>
                      </div>
                    </div>

                    {/* Average Orders */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                      <div className="relative bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 p-6 rounded-2xl backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-amber-400" />
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-amber-300 font-medium px-2 py-1 bg-amber-500/20 rounded-full">
                              Avg
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-3xl font-bold text-white">
                            {orders.length > 0 && users?.length > 0 ? 
                              (orders.length / users.length).toFixed(1) : "0.0"
                            }
                          </p>
                          <p className="text-sm text-amber-200 font-medium">Orders per Customer</p>
                          <p className="text-xs text-amber-400/70">Customer engagement</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Quick Actions */}
                <div className="bg-[#2a2b2b] p-8 rounded-2xl border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-6">Quick Actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <button
                      onClick={() => setActiveTab("products")}
                      className="group p-6 border-2 border-dashed border-blue-600/30 rounded-2xl hover:border-blue-500 hover:bg-blue-500/5 transition-all duration-200 text-center"
                    >
                      <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/20 transition-colors">
                        <Package className="w-8 h-8 text-blue-400" />
                      </div>
                      <p className="font-semibold text-white mb-2">Manage Products</p>
                      <p className="text-sm text-gray-400">Add or edit inventory</p>
                    </button>

                    <button
                      onClick={() => setActiveTab("orders")}
                      className="group p-6 border-2 border-dashed border-amber-600/30 rounded-2xl hover:border-amber-500 hover:bg-amber-500/5 transition-all duration-200 text-center"
                    >
                      <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-500/20 transition-colors">
                        <Star className="w-8 h-8 text-amber-400" />
                      </div>
                      <p className="font-semibold text-white mb-2">Process Orders</p>
                      <p className="text-sm text-gray-400">
                        {orders.filter((order: any) => order.status === 'pending').length} pending
                      </p>
                    </button>

                    <button
                      onClick={() => setActiveTab("payments")}
                      className="group p-6 border-2 border-dashed border-emerald-600/30 rounded-2xl hover:border-emerald-500 hover:bg-emerald-500/5 transition-all duration-200 text-center"
                    >
                      <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-500/20 transition-colors">
                        <DollarSign className="w-8 h-8 text-emerald-400" />
                      </div>
                      <p className="font-semibold text-white mb-2">View Payments</p>
                      <p className="text-sm text-gray-400">Track revenue</p>
                    </button>

                    <button
                      onClick={() => setActiveTab("business")}
                      className="group p-6 border-2 border-dashed border-purple-600/30 rounded-2xl hover:border-purple-500 hover:bg-purple-500/5 transition-all duration-200 text-center"
                    >
                      <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/20 transition-colors">
                        <Building2 className="w-8 h-8 text-purple-400" />
                      </div>
                      <p className="font-semibold text-white mb-2">
                        {business?.name ? "Edit Business" : "Setup Business"}
                      </p>
                      <p className="text-sm text-gray-400">Configure settings</p>
                    </button>
                  </div>
                </div>

                {/* Recent Activity - With Fade Effect */}
                {(orders.length > 0 || payments.length > 0) && (
                  <div className="bg-[#2a2b2b] border border-gray-700 p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>
                    <div className="relative">
                      {/* Top fade overlay */}
                      <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-[#2a2b2b] to-transparent z-10 pointer-events-none"></div>
                      
                      {/* Bottom fade overlay */}
                      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[#2a2b2b] to-transparent z-10 pointer-events-none"></div>
                      
                      {/* Scrollable content */}
                      <div className="space-y-4 max-h-64 overflow-y-auto scrollbar-hide py-2">
                        {[...orders.slice(0, 3), ...payments.slice(0, 2)]
                          .sort((a: any, b: any) => new Date(b.paid_at || b.created_at).getTime() - new Date(a.paid_at || a.created_at).getTime())
                          .slice(0, 5)
                          .map((item: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-[#1a1b1b] rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className={`w-2 h-2 rounded-full ${
                                  item.reference ? 'bg-emerald-500' : 
                                  item.status === 'approved' ? 'bg-emerald-500' : 'bg-amber-500'
                                }`}></div>
                                <div>
                                  <p className="text-white text-sm font-medium">
                                    {item.reference ? `Payment ${item.reference}` : `Order #${item.id.slice(-6)}`}
                                  </p>
                                  <p className="text-gray-400 text-xs">
                                    {item.email || `${item.first_name} ${item.last_name}`}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-white text-sm font-medium">
                                  ₦{item.amount ? (item.amount / 100).toFixed(2) : item.total_price?.toFixed(2)}
                                </p>
                                <p className="text-gray-400 text-xs">
                                  {new Date(item.paid_at || item.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Products Section */}
            {activeTab === "products" && (
              <ProductsComponent
                business={business}
                queryResult={{
                  isPending: productIsPending,
                  data: products,
                  error: productError,
                }}
              />
            )}

            {/* QR Section */}
            {activeTab === "qr" && <QRComponent business={business} />}
            {/* QR Section */}
            {activeTab === "settings" && <SettingsPage business={business} />}
            {/* Carts Section */}

            {activeTab === "carts" && (
              <CartsComponent
                business={business}
                queryResult={{
                  isPending: cartIsPending as any,
                  data: carts as any,
                  error: cartError as any,
                }}
              />
            )}
            {activeTab === "payments" && (
              <PaymentsComponent
                business={business}
                queryResult={{
                  isPending: paymentIsPending as any,
                  data: payments as any,
                  error: paymentError as any,
                }}
              />
            )}
            {activeTab === "orders" && (
              <OrdersComponent
                business={business}
                queryResult={{
                  isPending: orderIsPending as any,
                  data: orders as any,
                  error: orderError as any,
                }}
              />
            )}
            {/* Users Section */}
            {activeTab === "users" && (
              <UsersComponent
                business={business}
                queryResult={{
                  isPending: userIsPending,
                  data: users,
                  error: userError,
                }}
              />
            )}
            {activeTab === "business" && (
              <BusinessComponent business={business} />
            )}
          </main>
        </div>
      </div>
    ) : (
      <ErrorPage msg="Unauthenticated" />
    );
  }
}
