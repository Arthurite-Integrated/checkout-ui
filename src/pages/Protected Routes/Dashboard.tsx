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
  ScanBarcode,
  Settings2,
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

  // Functions to calculate percentage changes
  const calculatePercentageChange = (newValue: number, oldValue: number) => {
    if (oldValue === 0) return 0;
    return ((newValue - oldValue) / oldValue) * 100;
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
          <div className="p-4 border-b border-gray-700">
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
              icon={ScanBarcode}
              label="Verify Payment"
              tabKey="verify"
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
          <main className="p-6 flex-1 overflow-y-auto">
            {/* Dashboard Overview */}
            {activeTab === "dashboard" && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-[#2a2b2b] p-6 rounded-2xl border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">
                          Total Products
                        </p>
                        <p className="text-3xl font-bold text-white">
                          {products.length}
                        </p>
                        <p className="text-xs text-green-400 mt-1 flex items-center">
                          <TrendingUp size={12} className="mr-1" />+
                          {calculatePercentageChange(
                            products.length,
                            products.length - 1
                          ).toFixed(2)}
                          % from last month
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
                        <p className="text-sm text-gray-400 mb-1">
                          Active Carts
                        </p>
                        <p className="text-3xl font-bold text-white">
                          {carts.length}
                        </p>
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
                        <p className="text-sm text-gray-400 mb-1">
                          Total Revenue
                        </p>
                        <p className="text-3xl font-bold text-white">${0}</p>
                        <p className="text-xs text-green-400 mt-1 flex items-center">
                          <TrendingUp size={12} className="mr-1" />
                          +15% this week
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                        <span className="text-green-400 text-xl font-bold">
                          $
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#2a2b2b] p-6 rounded-2xl border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Customers</p>
                        <p className="text-3xl font-bold text-white">
                          {users?.length}
                        </p>
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
                  <h3 className="text-xl font-semibold text-white mb-6">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <button
                      onClick={() => setActiveTab("products")}
                      className="group p-6 border-2 border-dashed border-amber-600/30 rounded-2xl hover:border-amber-500 hover:bg-amber-500/5 transition-all duration-200 text-center"
                    >
                      <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-500/20 transition-colors">
                        <Package className="w-8 h-8 text-amber-400" />
                      </div>
                      <p className="font-semibold text-white mb-2">
                        Add New Product
                      </p>
                      <p className="text-sm text-gray-400">
                        Expand your inventory
                      </p>
                    </button>

                    <button
                      onClick={() => setActiveTab("carts")}
                      className="group p-6 border-2 border-dashed border-amber-600/30 rounded-2xl hover:border-amber-500 hover:bg-amber-500/5 transition-all duration-200 text-center"
                    >
                      <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-500/20 transition-colors">
                        <ShoppingCart className="w-8 h-8 text-amber-400" />
                      </div>
                      <p className="font-semibold text-white mb-2">
                        Manage Carts
                      </p>
                      <p className="text-sm text-gray-400">
                        View customer orders
                      </p>
                    </button>

                    <button
                      onClick={() => setActiveTab("business")}
                      className="group p-6 border-2 border-dashed border-amber-600/30 rounded-2xl hover:border-amber-500 hover:bg-amber-500/5 transition-all duration-200 text-center"
                    >
                      <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-500/20 transition-colors">
                        <Building2 className="w-8 h-8 text-amber-400" />
                      </div>
                      <p className="font-semibold text-white mb-2">
                        {business?.name ? "Edit Business Info" : "Add Business"}
                      </p>
                      <p className="text-sm text-gray-400">
                        Manage your business info
                      </p>
                    </button>
                  </div>
                </div>
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
