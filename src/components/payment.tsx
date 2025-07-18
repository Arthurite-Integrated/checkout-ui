import { useState, useEffect } from "react";
import { ErrorComponent } from "./ErrorPage";
import { Toast } from "../utils/Toast";
import type { UseQueryResult } from "@tanstack/react-query";

interface Payment {
  id: string;
  reference: string;
  status: string;
  amount: number;
  gateway_response: string;
  paid_at: string;
  email: string;
  phone: string;
  order_id: string;
  currency: string;
}

export default function PaymentsComponent({ 
  business, 
  queryResult: { isPending, error, data }, 
}: { 
  business: any; 
  queryResult: UseQueryResult<Payment[], Error> | any; 
}) {
  business && isPending && Toast("Loading payments...", false);
  business && error && Toast(error.message, true);

  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (data) setFilteredPayments(data);
  }, [data]);

  useEffect(() => {
    if (!data) return;
    
    let filtered = data;

    if (statusFilter !== "all") {
      filtered = filtered.filter((payment: Payment) => payment.status === statusFilter);
    }

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((payment: Payment) =>
        payment.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.phone?.includes(searchQuery) ||
        payment.order_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.gateway_response?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPayments(filtered);
  }, [data, searchQuery, statusFilter]);

  const formatPrice = (amount: number): string => {
    return (amount / 100).toFixed(2); // Convert kobo to naira
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'bg-emerald-500';
      case 'failed':
        return 'bg-red-500';
      case 'pending':
        return 'bg-amber-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getGatewayResponseColor = (response: string) => {
    switch (response.toLowerCase()) {
      case 'successful':
      case 'approved':
        return 'text-emerald-400';
      case 'failed':
      case 'declined':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);

  return business ? (
    <div className="space-y-6">
      {/* Header with Stats & Filters */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">Payment Transactions</h3>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-400">
            <span>{data?.length || 0} total payments</span>
            <span>{filteredPayments.length} showing</span>
            <span className="text-emerald-400 font-medium">
              Total: ₦{formatPrice(totalAmount)}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#1a1b1b] border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </select>

          <div className="relative">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Search payments..."
              className="pl-4 pr-10 py-2 bg-[#1a1b1b] border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-full sm:w-64"
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
      
      {/* Payments List */}
      {!filteredPayments || filteredPayments.length === 0 ? (
        <div className="text-center text-gray-400 bg-[#1a1b1b] p-8 rounded-xl border border-gray-700">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <p className="text-lg">
            {isPending ? "Loading payments..." : searchQuery || statusFilter !== "all" ? "No matching payments" : "No payments found"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPayments.map((payment: Payment) => (
            <div key={payment.id} className="bg-[#1a1b1b] border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-all duration-200">
              {/* Payment Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium text-sm">#{payment.reference}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                    <span className={`text-xs font-medium ${getGatewayResponseColor(payment.gateway_response)}`}>
                      {payment.gateway_response}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 space-y-0.5">
                    <p className="truncate">{payment.email}</p>
                    <p>Phone: {payment.phone} • {formatDate(payment.paid_at)}</p>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-lg font-bold text-emerald-400">₦{formatPrice(payment.amount)}</p>
                  <p className="text-xs text-gray-400">{payment.currency}</p>
                </div>
              </div>

              {/* Payment Details */}
              <div className="border-t border-gray-700 pt-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="bg-[#111111] p-3 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Payment ID</p>
                    <p className="text-xs font-mono text-white truncate">{payment.id}</p>
                  </div>
                  <div className="bg-[#111111] p-3 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Order ID</p>
                    <p className="text-xs font-mono text-white truncate">{payment.order_id}</p>
                  </div>
                  <div className="bg-[#111111] p-3 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Reference</p>
                    <p className="text-xs font-mono text-white">{payment.reference}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-700">
                <div className="text-xs text-gray-400">
                  Paid at {new Date(payment.paid_at).toLocaleString()}
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors">
                    View Receipt
                  </button>
                  <button className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded-md transition-colors">
                    Export
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Card */}
      {filteredPayments.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-4 rounded-xl text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-90">Total Revenue (Filtered)</p>
              <p className="text-2xl font-bold">₦{formatPrice(totalAmount)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">Transactions</p>
              <p className="text-xl font-semibold">{filteredPayments.length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : (
    <ErrorComponent msg="No business information found. Please set up your business details to access payments." />
  );
}