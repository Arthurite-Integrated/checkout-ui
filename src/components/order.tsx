import { useState, useEffect } from "react";
import { ErrorComponent } from "./ErrorPage";
import { Toast } from "../utils/Toast";
import type { UseQueryResult } from "@tanstack/react-query";

interface Product {
  id: string;
  name: string;
  price: string;
  quantity: number;
}

interface Order {
  id: string;
  products: Product[];
  total_price: number;
  status: string;
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export default function OrdersComponent({ 
  business, 
  queryResult: { isPending, error, data }, 
}: { 
  business: any; 
  queryResult: UseQueryResult<Order[], Error> | any; 
}) {
  business && isPending && Toast("Loading orders...", false);
  business && error && Toast(error.message, true);

  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (data) setFilteredOrders(data);
  }, [data]);

  useEffect(() => {
    if (!data) return;
    
    let filtered = data;

    if (statusFilter !== "all") {
      filtered = filtered.filter((order: Order) => order.status === statusFilter);
    }

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((order: Order) =>
        order.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.user_id?.toString().includes(searchQuery) ||
        order.products?.some(product => 
          product.name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    setFilteredOrders(filtered);
  }, [data, searchQuery, statusFilter]);

  const formatPrice = (price: any): string => {
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? "0.00" : numPrice.toFixed(2);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-amber-500';
      case 'approved':
        return 'bg-emerald-500';
      default:
        return 'bg-gray-500';
    }
  };

  return business ? (
    <div className="space-y-6">
      {/* Header with Search & Filter */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">Orders</h3>
          <p className="text-sm text-gray-400 mt-1">
            {data?.length || 0} total • {filteredOrders.length} showing
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#1a1b1b] border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
          </select>

          <div className="relative">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Search orders..."
              className="pl-4 pr-10 py-2 bg-[#1a1b1b] border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 w-full sm:w-64"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Orders List */}
      {!filteredOrders || filteredOrders.length === 0 ? (
        <div className="text-center text-gray-400 bg-[#1a1b1b] p-8 rounded-xl border border-gray-700">
          <p className="text-lg">
            {isPending ? "Loading orders..." : searchQuery || statusFilter !== "all" ? "No matching orders" : "No orders found"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order: Order) => (
            <div key={order.id} className="bg-[#1a1b1b] border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-all duration-200">
              {/* Compact Order Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium text-sm">#{order.id.slice(-6)}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 space-y-0.5">
                    <p className="truncate">{order.first_name} {order.last_name} • {order.email}</p>
                    <p>ID: {order.user_id} • {order.products?.length || 0} items</p>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-lg font-bold text-emerald-400">₦{formatPrice(order.total_price)}</p>
                  <div className="flex gap-1 mt-1">
                    {order.status === 'pending' ? (
                      <button className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-md transition-colors">
                        Approve
                      </button>
                    ) : (
                      <span className="px-3 py-1 bg-emerald-600/20 text-emerald-400 text-xs rounded-md">
                        Approved ✓
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Compact Products Grid */}
              <div className="border-t border-gray-700 pt-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {order.products?.slice(0, 6).map((product: Product, index: number) => {
                    const itemTotal = parseFloat(product.price) * product.quantity;
                    return (
                      <div key={product.id || index} className="bg-[#111111] p-2 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-white truncate">
                              {product.name?.charAt(0).toUpperCase() + product.name?.slice(1) || "Unknown"}
                            </p>
                            <p className="text-xs text-gray-400">
                              {product.quantity} × ₦{formatPrice(product.price)}
                            </p>
                          </div>
                          <span className="text-xs font-medium text-emerald-400 ml-2">
                            ₦{formatPrice(itemTotal)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {order.products?.length > 6 && (
                    <div className="bg-[#111111] p-2 rounded-lg flex items-center justify-center">
                      <span className="text-xs text-gray-400">
                        +{order.products.length - 6} more
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Expandable Details */}
              <details className="mt-3">
                <summary className="text-xs text-gray-400 cursor-pointer hover:text-white transition-colors">
                  View full order details
                </summary>
                <div className="mt-2 pt-2 border-t border-gray-700 text-xs text-gray-300">
                  <p><span className="font-medium">Full Order ID:</span> {order.id}</p>
                  <p><span className="font-medium">Customer Email:</span> {order.email}</p>
                  <p><span className="font-medium">User ID:</span> {order.user_id}</p>
                </div>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  ) : (
    <ErrorComponent msg="No business information found. Please set up your business details to access orders." />
  );
}