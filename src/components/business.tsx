import { useState } from "react";
import { useAuthStore } from "../store";
import type { BusinessError } from "../types/Error";
import { Toast } from "../utils/Toast";
import { Building2, Camera, Edit3, Smile, UploadCloud } from "lucide-react";
import type { Business } from "../types/business.type";
import { useQueryClient } from "@tanstack/react-query";
import server from "../server";

export default function BusinessComponent({ business }: { business: Business }) {
  const { registerBusiness, setBusiness } = useAuthStore();
  const [newBusiness, setNewBusiness] = useState({
    name: "",
    email: "",
    address: {
      street: "",
      state: "",
      country: "",
    },
  });
  const [editingBusiness, setEditingBusiness] = useState(false);
  const [validationErrors, setValidationErrors] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(business?.name);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const [updatedFields, setUpdatedFields] = useState<{
    name?: string;
    image?: string;
  }>({});

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImageBase64(base64String);
        setUpdatedFields((prev) => ({ ...prev, image: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    try {
      const { message, status, data } = await server.updateBusiness({...updatedFields, business_id: business.id});
      if (status !== "OK") {
        Toast(message, true);
        return;
      }
      console.log(data);
      setBusiness({...business, ...data});
      console.log(await business);
      Toast(message);
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch(e: any) {
      Toast(e.message, true);
    } finally {
      setIsEditing(false);
      setImageBase64(null);
      setUpdatedFields({});
    }

    // Reset states

  };

  async function handleBusinessSubmit() {
    // Reset previous errors
    setValidationErrors({});

    // Validate all fields
    const errors: BusinessError = {
      name: "",
      email: "",
      street: "",
      state: "",
      country: "",
    };

    if (!newBusiness.name.trim()) errors.name = "Business name is required";

    if (!newBusiness.email.trim()) errors.email = "Business email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newBusiness.email)) errors.email = "Please enter a valid email address";

    if (!newBusiness.address.street.trim()) errors.street = "Street address is required";

    if (!newBusiness.address.state.trim()) errors.state = "State is required";

    if (!newBusiness.address.country.trim()) errors.country = "Country is required";

    // If there are errors, show them and don't submit
    console.log(Object.keys(errors).length);
    if (Object.values(errors).some((error) => error !== "")) {
      setValidationErrors(errors);
      Toast("Please fill in all required fields", true);
      return;
    }

    // If validation passes, proceed with submission
    await registerBusiness(
      newBusiness.name,
      newBusiness.email,
      newBusiness.address.street,
      newBusiness.address.state,
      newBusiness.address.country
    );
    setNewBusiness({
      name: "",
      email: "",
      address: {
        street: "",
        state: "",
        country: "",
      },
    });
    setEditingBusiness(false);
  }

  return (
    <div className="space-y-8">
      {/* Business Info */}
      {!business ? (
        <div className="bg-[#2a2b2b] p-6 rounded-2xl border border-gray-700">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-10 h-10 text-amber-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Welcome to Your Business Hub
              </h3>
              <p className="text-gray-400">Let's get your business profile set up</p>
            </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Button to Add Business */}
            <button
              onClick={() => setEditingBusiness(true)}
              className="group p-6 border-2 border-dashed border-amber-600/30 rounded-2xl hover:border-amber-500 hover:bg-amber-500/5 transition-all duration-200 text-center"
            >
              <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-500/20 transition-colors">
                <Building2 className="w-8 h-8 text-amber-400" />
              </div>
              <p className="font-semibold text-white mb-2">Add Business</p>
              <p className="text-sm text-gray-400">
                Set up your business profile
              </p>
            </button>

              {/* Welcome Message */}
              <div className="group p-8 rounded-3xl bg-gradient-to-r from-yellow-500 to-amber-600 hover:border-amber-500 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Smile className="w-8 h-8 text-white" />
                  </div>
                  <p className="font-semibold text-white mb-2">
                    Let's get you started...
                  </p>
                  <p className="text-sm text-orange-100">Ready to build something amazing?</p>
                </div>
              </div>
          </div>

          {/* Add Business Form */}
          {editingBusiness && (
            <div className="mt-6">
              <h4 className="text-lg text-white my-2">Add Business Info</h4>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleBusinessSubmit();
                }}
              >
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Business Name"
                      className={`w-full p-3 bg-[#202121] text-white border rounded-xl ${
                        validationErrors.name
                          ? "border-red-500"
                          : "border-transparent"
                      }`}
                      value={newBusiness.name}
                      onChange={(e) =>
                        setNewBusiness({ ...newBusiness, name: e.target.value })
                      }
                    />
                    {validationErrors.name && (
                      <p className="text-red-400 text-sm mt-1">
                        {validationErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      type="email"
                      placeholder="Business Email"
                      className={`w-full p-3 bg-[#202121] text-white border rounded-xl ${
                        validationErrors.email
                          ? "border-red-500"
                          : "border-transparent"
                      }`}
                      value={newBusiness.email}
                      onChange={(e) =>
                        setNewBusiness({
                          ...newBusiness,
                          email: e.target.value,
                        })
                      }
                    />
                    {validationErrors.email && (
                      <p className="text-red-400 text-sm mt-1">
                        {validationErrors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div>
                      <input
                        type="text"
                        placeholder="Street Address"
                        className={`w-full p-3 bg-[#202121] text-white border rounded-xl ${
                          validationErrors.street
                            ? "border-red-500"
                            : "border-transparent"
                        }`}
                        value={newBusiness.address.street}
                        onChange={(e) =>
                          setNewBusiness({
                            ...newBusiness,
                            address: {
                              ...newBusiness.address,
                              street: e.target.value,
                            },
                          })
                        }
                      />
                      {validationErrors.street && (
                        <p className="text-red-400 text-sm mt-1">
                          {validationErrors.street}
                        </p>
                      )}
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="State"
                        className={`w-full p-3 bg-[#202121] text-white border rounded-xl ${
                          validationErrors.state
                            ? "border-red-500"
                            : "border-transparent"
                        }`}
                        value={newBusiness.address.state}
                        onChange={(e) =>
                          setNewBusiness({
                            ...newBusiness,
                            address: {
                              ...newBusiness.address,
                              state: e.target.value,
                            },
                          })
                        }
                      />
                      {validationErrors.state && (
                        <p className="text-red-400 text-sm mt-1">
                          {validationErrors.state}
                        </p>
                      )}
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="Country"
                        className={`w-full p-3 bg-[#202121] text-white border rounded-xl ${
                          validationErrors.country
                            ? "border-red-500"
                            : "border-transparent"
                        }`}
                        value={newBusiness.address.country}
                        onChange={(e) =>
                          setNewBusiness({
                            ...newBusiness,
                            address: {
                              ...newBusiness.address,
                              country: e.target.value,
                            },
                          })
                        }
                      />
                      {validationErrors.country && (
                        <p className="text-red-400 text-sm mt-1">
                          {validationErrors.country}
                        </p>
                      )}
                    </div>
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
        <div className="flex flex-col gap-4 bg-[#2a2b2b] p-6 rounded-2xl border border-gray-700 max-w-xl w-full">
      <div className="flex gap-6 items-start">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-4">Business Info</h3>
          {isEditing ? (
            <div className="flex gap-2 mb-2">
              <input
                className="bg-gray-800 text-white px-2 py-1 rounded border border-gray-600 w-full max-w-xs"
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  setUpdatedFields((prev) => ({ ...prev, name: e.target.value }));
                }}
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm text-gray-400">Name: {business.name}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="text-gray-400 hover:text-white"
              >
                <Edit3 size={16} />
              </button>
            </div>
          )}
          <p className="text-sm text-gray-400 mb-2">Email: {business.email}</p>
          {business.address ? (
            <p className="text-sm text-gray-400">
              Address: {business.address.street}, {business.address.state},{" "}
              {business.address.country}
            </p>
          ) : (
            <p className="text-sm text-gray-400">No Address Assigned</p>
          )}
        </div>

        <div className="flex flex-col items-center relative">
          {imageBase64 ? (
            <img
              src={imageBase64}
              alt="Business"
              className="w-28 h-28 rounded-full object-cover border-2 border-gray-600 shadow-lg transition-transform duration-300 hover:scale-105"
            />
          ) : 
          business.image ? (
            <div className="w-28 h-28 rounded-full bg-gray-800 flex items-center justify-center border-2 border-gray-600 shadow-inner">
              <img
              src={business.image}
              alt="Business"
              className="w-28 h-28 rounded-full object-cover border-2 border-gray-600 shadow-lg transition-transform duration-300 hover:scale-105"
            />
            </div>
          ) : (
            <div className="w-28 h-28 rounded-full bg-gray-800 flex items-center justify-center border-2 border-gray-600 shadow-inner">
              <p className='text-center text-gray-400 text-sm'>Upload your business logo</p>
            </div>
          )}
          <label className="absolute bottom-0 translate-y-1/2 bg-gray-700 hover:bg-gray-600 border border-gray-500 p-2 rounded-full cursor-pointer shadow-md transition-colors duration-200">
            <Camera size={16} className="text-white" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {(isEditing || imageBase64) && (
        <button
          onClick={handleUpdate}
          className="mt-4 bg-green-600 hover:bg-green-500 transition-colors duration-200 text-white px-4 py-2 rounded flex items-center gap-2 self-start"
        >
          <UploadCloud size={16} /> Save
        </button>
      )}
    </div>
      )}
    </div>
  );
}