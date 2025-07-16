import { useState, useEffect } from "react";
import { ErrorComponent } from "./ErrorPage";
import { Toast } from "../utils/Toast";
import type { UseQueryResult } from "@tanstack/react-query";

export default function UsersComponent({ 
  business, 
  queryResult: { isPending, error, data }, 
}: { 
  business: any; 
  queryResult: UseQueryResult<any, Error> | any; 
}) {
  business && isPending && Toast("Loading users...", false);
  business && error && Toast(error.message, true);

  // ✅ Add local state for filtered users and search query
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Update filtered users when data changes
  useEffect(() => {
    if (data) {
      setFilteredUsers(data);
    }
  }, [data]);

  // ✅ Filter users based on search query
  useEffect(() => {
    if (!data) return;
    
    if (searchQuery.trim() === "") {
      setFilteredUsers(data);
    } else {
      const filtered = data.filter((user: any) =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [data, searchQuery]);

  return business ? (
    <div className="space-y-8">
      {/* User Count & Filters */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-0">
          <h3 className="text-xl font-semibold text-white">Users</h3>
          <span className="text-sm text-gray-400">
            Total Users: {data?.length || 0} {searchQuery && `(${filteredUsers.length} filtered)`}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Search users by name, email, or phone"
            className="px-4 py-2 bg-[#202121] border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors md:w-120"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="px-3 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>
      
      {/* No users message */}
      {!filteredUsers || filteredUsers.length === 0 ? (
        <div className="text-center text-white">
          <p>
            {isPending 
              ? "Loading users..." 
              : searchQuery 
                ? `No users found matching "${searchQuery}"` 
                : "No users found"
            }
          </p>
        </div>
      ) : (
        <div>
          {/* Users List */}
          {filteredUsers.map((user: any) => (
            <div
              key={user.id}
              className="bg-[#2a2b2b] p-6 rounded-2xl border border-gray-700 flex justify-between items-center mb-4"
            >
              <div className="flex items-center space-x-4 justify-between">
                <div className="text-white">
                  <h4 className="font-semibold">{user.name}</h4>
                  <p className="text-sm text-gray-400"><b>{user.id}</b></p>
                  <p className="text-sm text-gray-400">Name: {user.first_name} {user.last_name}</p>
                  <p className="text-sm text-gray-400">Email: {user.email}</p>
                  <p className="text-sm text-gray-400">Phone: {user.phone}</p>
                </div>
              </div>
                <div className="flex items-center space-x-4 md:flex-col md:space-x-0 md:space-y-2">
                <button
                  // onClick={() => setEditingUser(user)}
                  className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-xl hover:from-yellow-600 hover:to-amber-700 transition-all duration-200"
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
  ) : (
    <ErrorComponent msg="No business information found. Please set up your business details to access users." />
  );
}