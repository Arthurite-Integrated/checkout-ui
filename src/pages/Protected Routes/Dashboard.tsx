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
                <span>Refresh</span>
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

                {/* Enhanced Analytics Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Order Status Overview */}
                  <div className="bg-[#2a2b2b] border border-gray-700 p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-white">Order Status</h3>
                      <button 
                        onClick={() => setActiveTab("orders")}
                        className="text-amber-400 hover:text-amber-300 text-sm font-medium"
                      >
                        View All →
                      </button>
                    </div>
                    <div className="space-y-4">
                      {orders.length > 0 ? (
                        <>
                          {/* Pending Orders */}
                          <div className="flex items-center justify-between p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                              <span className="text-white font-medium">Pending Orders</span>
                            </div>
                            <span className="text-amber-400 font-bold">
                              {orders.filter((order: any) => order.status === 'pending').length}
                            </span>
                          </div>
                          
                          {/* Approved Orders */}
                          <div className="flex items-center justify-between p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                              <span className="text-white font-medium">Approved Orders</span>
                            </div>
                            <span className="text-emerald-400 font-bold">
                              {orders.filter((order: any) => order.status === 'approved').length}
                            </span>
                          </div>

                          {/* Total Revenue from Orders */}
                          <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              <span className="text-white font-medium">Order Value</span>
                            </div>
                            <span className="text-blue-400 font-bold">
                              ₦{orders.reduce((sum: number, order: any) => sum + order.total_price, 0).toFixed(2)}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8 text-gray-400">
                          <Star className="w-12 h-12 mx-auto mb-3 opacity-30" />
                          <p>No orders yet</p>
                          <p className="text-sm">Orders will appear here when customers make purchases</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment Analytics */}
                  <div className="bg-[#2a2b2b] border border-gray-700 p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-white">Payment Analytics</h3>
                      <button 
                        onClick={() => setActiveTab("payments")}
                        className="text-emerald-400 hover:text-emerald-300 text-sm font-medium"
                      >
                        View All →
                      </button>
                    </div>
                    <div className="space-y-4">
                      {payments.length > 0 ? (
                        <>
                          {/* Successful Payments */}
                          <div className="flex items-center justify-between p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                              <span className="text-white font-medium">Successful</span>
                            </div>
                            <span className="text-emerald-400 font-bold">
                              {payments.filter((payment: any) => payment.status === 'success').length}
                            </span>
                          </div>

                          {/* Today's Revenue */}
                          <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              <span className="text-white font-medium">Today's Revenue</span>
                            </div>
                            <span className="text-blue-400 font-bold">
                              ₦{payments
                                .filter((payment: any) => {
                                  const today = new Date().toDateString();
                                  const paymentDate = new Date(payment.paid_at).toDateString();
                                  return paymentDate === today;
                                })
                                .reduce((sum: number, payment: any) => sum + payment.amount, 0) / 100}.00
                            </span>
                          </div>

                          {/* Average Transaction */}
                          <div className="flex items-center justify-between p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                              <span className="text-white font-medium">Average Transaction</span>
                            </div>
                            <span className="text-purple-400 font-bold">
                              ₦{payments.length > 0 ? 
                                (payments.reduce((sum: number, payment: any) => sum + payment.amount, 0) / payments.length / 100).toFixed(2) : 
                                "0.00"
                              }
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8 text-gray-400">
                          <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-30" />
                          <p>No payments yet</p>
                          <p className="text-sm">Payment analytics will show here</p>
                        </div>
                      )}
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
