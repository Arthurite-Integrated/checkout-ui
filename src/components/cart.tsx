import type { UseQueryResult } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { ErrorComponent } from "./ErrorPage";
import { Toast } from "../utils/Toast";

interface Product {
  name: string;
  quantity: number;
  price: number;
}

interface Cart {
  id: string;
  user_id: string;
  products: Product[];
}

interface CartsComponentProps {
  business: any;
  queryResult: UseQueryResult<Cart[], Error> | any;
}

export default function CartsComponent({ business, queryResult: { isPending, error, data }, }: CartsComponentProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Show toast notifications
  if (business && isPending) Toast("Loading cart data...", false);
  if (business && error) Toast(error.message, true);

  // ✅ FIXED: Filter carts based on search term with null safety
  const filteredCarts = useMemo(() => {
    if (!data) return [];
    if (!searchTerm) return data;
    
    return data.filter((cart: any) => {
      // ✅ Safely convert user_id to string and handle null/undefined
      const userId = cart.user_id?.toString()?.toLowerCase() || "";
      const cartId = cart.id?.toString()?.toLowerCase() || "";
      const search = searchTerm.toLowerCase();
      
      return userId.includes(search) || cartId.includes(search);
    });
  }, [data, searchTerm]);

  // ✅ Helper function to safely format price
  const formatPrice = (price: any): string => {
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? "0.00" : numPrice.toFixed(2);
  };

  // ✅ Helper function to safely get numeric value
  const getNumericValue = (value: any): number => {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  };

  // Calculate cart total
  const calculateCartTotal = (products: Product[]): number => {
    return products.reduce((total, product) => {
      const quantity = getNumericValue(product.quantity);
      const price = getNumericValue(product.price);
      return total + (quantity * price);
    }, 0);
  };

  if (!business) {
    return (
      <ErrorComponent msg="No business information found. Please set up your business details to access users carts." />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3 className="text-xl font-semibold text-white">
          Manage User Carts
        </h3>
        
        {/* Search Input */}
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search by User ID or Cart ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-[#2a2b2b] text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Cart Stats */}
      {data && data.length > 0 && (
        <div className="bg-[#2a2b2b] p-4 rounded-lg border border-gray-700">
          <div className="flex flex-wrap gap-6 text-sm text-gray-300">
            <span>Total Carts: <span className="text-white font-semibold">{data.length}</span></span>
            <span>Filtered Results: <span className="text-white font-semibold">{filteredCarts.length}</span></span>
          </div>
        </div>
      )}

      {/* Carts Grid */}
      {!data || data.length === 0 ? (
        <div className="text-center text-white bg-[#2a2b2b] p-8 rounded-lg border border-gray-700">
          <p className="text-lg">{isPending ? "Loading carts..." : "No carts found"}</p>
        </div>
      ) : filteredCarts.length === 0 ? (
        <div className="text-center text-white bg-[#2a2b2b] p-8 rounded-lg border border-gray-700">
          <p className="text-lg">No carts found matching "{searchTerm}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCarts.map((cart: any) => {
            const cartTotal = calculateCartTotal(cart.products || []);
            
            return (
              <div
                key={cart.id}
                className="bg-[#2a2b2b] p-6 rounded-2xl border border-gray-700 hover:border-gray-600 transition-colors"
              >
                {/* Cart Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white">
                      User ID: {cart.user_id || "Unknown"}
                    </h4>
                    <p className="text-sm text-gray-400">
                      {cart.products?.length || 0} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-400">
                      ${formatPrice(cartTotal)}
                    </p>
                    <p className="text-xs text-gray-400">Total</p>
                  </div>
                </div>

                {/* Products List */}
                <div className="space-y-3">
                  <h5 className="text-sm font-medium text-gray-300 border-b border-gray-600 pb-2">
                    Products
                  </h5>
                  
                  {cart.products && cart.products.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {cart.products.map((product: any, index: any) => {
                        const quantity = getNumericValue(product.quantity);
                        const price = getNumericValue(product.price);
                        const itemTotal = quantity * price;
                        
                        return (
                          <div
                            key={index}
                            className="flex justify-between items-center p-3 bg-[#1f2020] rounded-lg"
                          >
                            <div className="flex-1">
                              <span className="text-sm text-white font-medium">
                                {/* ✅ FIXED: Safe string handling */}
                                {product.name ? 
                                  product.name.charAt(0).toUpperCase() + product.name.slice(1) : 
                                  "Unknown Product"
                                }
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-white">
                                {quantity} × ${formatPrice(price)}
                              </div>
                              <div className="text-xs text-gray-400">
                                = ${formatPrice(itemTotal)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 py-4">
                      <p>No products in cart</p>
                    </div>
                  )}
                </div>

                {/* Cart Actions */}
                <div className="mt-4 pt-4 border-t border-gray-600">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <span className="text-xs text-gray-400 break-all overflow-hidden">
                      Cart ID: {cart.id || "Unknown"}
                    </span>
                    <div className="flex gap-2 flex-shrink-0">
                      <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors">
                        View Details
                      </button>
                      <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-md transition-colors">
                        Clear Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}