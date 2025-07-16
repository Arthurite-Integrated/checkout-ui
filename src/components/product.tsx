import { BadgeCheck, CloudDownload, Edit3, ExternalLink, Package, Plus, Trash2 } from "lucide-react";
import { ErrorComponent } from "./ErrorPage";
import { DeleteProductModal } from "./Modal";
import { InfoToast, Toast } from "../utils/Toast";
import server from "../server";
import { useState } from "react";
import { useQueryClient, type UseQueryResult } from "@tanstack/react-query";
import { useAuthStore } from "../store";

export default function ProductsComponent({
  business,
  queryResult: { isPending, error, data },
}: {
  business: any;
  queryResult: UseQueryResult<any, Error> | any;
}) {
  const { setSpreadsheet, spreadsheet } = useAuthStore();
  const queryClient = useQueryClient();
  business && isPending && Toast("Loading products...", false);
  business && error && Toast(error.message, true);

  // Products state with all required fields
  const [newProduct, setNewProduct] = useState<any>({
    name: "",
    image: "",
    price: "",
    kg: "",
    quantity: "",
    description: "",
  });

  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [validationErrors, setValidationErrors] = useState<any>({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any | null>(null);
  const [isApplySheet, setIsApplySheet] = useState(false);
  const [isSyncingSheet, setIsSyncingSheet] = useState(false);

  // Function to populate form with product data for editing
  const startEditProduct = (product: any) => {
    setNewProduct({
      name: product.name,
      image: product.image,
      price: product.price.toString(),
      kg: product.kg.toString(),
      quantity: product.quantity.toString(),
      description: product.description,
    });
    setEditingProduct(product);
    setIsEditMode(true);
    setValidationErrors({});

    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Function to cancel editing
  const cancelEdit = () => {
    setNewProduct({
      name: "",
      image: "",
      price: "",
      kg: "",
      quantity: "",
      description: "",
    });
    setEditingProduct(null);
    setIsEditMode(false);
    setValidationErrors({});
  };

  // Function to validate all product fields
  const validateProduct = () => {
    const errors = {
      name: "",
      image: "",
      price: "",
      kg: "",
      quantity: "",
      description: "",
    };

    // Name validation
    if (!newProduct.name.trim()) {
      errors.name = "Product name is required";
    } else if (newProduct.name.trim().length < 2) {
      errors.name = "Product name must be at least 2 characters";
    }

    // Image validation
    if (!newProduct.image.trim()) {
      errors.image = "Product image URL is required";
    } else if (
      !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(newProduct.image)
    ) {
      errors.image =
        "Please enter a valid image URL (jpg, jpeg, png, gif, webp)";
    }

    // Price validation
    if (!newProduct.price.trim()) {
      errors.price = "Price is required";
    } else if (
      isNaN(Number(newProduct.price)) ||
      Number(newProduct.price) <= 0
    ) {
      errors.price = "Price must be a valid positive number";
    }

    // Weight validation
    if (!newProduct.kg.trim()) {
      errors.kg = "Weight is required";
    } else if (isNaN(Number(newProduct.kg)) || Number(newProduct.kg) <= 0) {
      errors.kg = "Weight must be a valid positive number";
    }

    // Quantity validation
    if (!newProduct.quantity.trim()) {
      errors.quantity = "Quantity is required";
    } else if (
      isNaN(Number(newProduct.quantity)) ||
      Number(newProduct.quantity) < 0 ||
      !Number.isInteger(Number(newProduct.quantity))
    ) {
      errors.quantity = "Quantity must be a valid whole number (0 or greater)";
    }

    // Description validation
    if (!newProduct.description.trim()) {
      errors.description = "Product description is required";
    } else if (newProduct.description.trim().length < 10) {
      errors.description = "Description must be at least 10 characters";
    }

    return errors;
  };

  // Function to add a new product with validation
  const addProduct = async () => {
    // Reset previous errors
    setValidationErrors({});

    // Validate all fields
    const errors = validateProduct();

    // Check if there are any validation errors
    if (Object.values(errors).some((error) => error !== "")) {
      setValidationErrors(errors);
      Toast("Please fix all validation errors before submitting", true);
      return;
    }

    // If validation passes, proceed with adding the product
    const product = {
      name: newProduct.name.trim().toLowerCase(),
      image: newProduct.image.trim(),
      price: newProduct.price,
      kg: newProduct.kg,
      quantity: Number(newProduct.quantity),
      description: newProduct.description.trim(),
    };

    try {
      const { code, message, status, data } = await server.createProduct({
        ...product,
        business_id: business.id,
      });
      console.log(message, code, status, data);

      if (status !== "CREATED") {
        Toast(message, true);
        return;
      }

      Toast(message, false);
      queryClient.invalidateQueries({ queryKey: ["products"] });

      // Reset the form
      setNewProduct({
        name: "",
        image: "",
        price: "",
        kg: "",
        quantity: "",
        description: "",
      });
    } catch (error) {
      Toast("Failed to add product", true);
    }
  };

  // Function to update a product
  const updateProduct = async () => {
    // Reset previous errors
    setValidationErrors({});

    // Validate all fields
    const errors = validateProduct();

    // Check if there are any validation errors
    if (Object.values(errors).some((error) => error !== "")) {
      setValidationErrors(errors);
      Toast("Please fix all validation errors before updating", true);
      return;
    }

    // If validation passes, proceed with updating the product
    const updatedProductData = {
      name: newProduct.name.trim().toLowerCase(),
      image: newProduct.image.trim(),
      price: newProduct.price,
      kg: newProduct.kg,
      quantity: Number(newProduct.quantity),
      description: newProduct.description.trim(),
    };

    try {
      // Call your update product API here
      const { code, message, status, data } = await server.updateProduct(
        editingProduct.id,
        { ...updatedProductData, business_id: business.id }
      );
      console.log(message, code, status, data);

      if (status !== "OK") {
        Toast(message, true);
        return;
      }

      Toast(message, false);
      queryClient.invalidateQueries({ queryKey: ["products"] });

      // Reset the form and exit edit mode
      cancelEdit();
    } catch (error) {
      Toast("Failed to update product", true);
    }
  };

  async function handleApplySheet() {
    try {
      setIsApplySheet(true)
      InfoToast("Applying for sheet...");
      const { code, message, status, data } = await server.applySheet(business.id);
      if (status !== "CREATED") {
        Toast(message, true);
        return;
      }
      Toast(message);
      console.log(message, code, status, data);
      setSpreadsheet(data);
    } catch(e: any) {
      Toast(e.message, true);
    } finally {
      setIsApplySheet(false);
    }
  }

  async function handleSheetSync() {
    try {
      setIsSyncingSheet(true)
      InfoToast("Syncing sheet to Database...");

      const { message, status } = await server.syncSheet(business.id, spreadsheet.id);
      if (status !== "OK") {
        Toast(message, true);
        return;
      }
      Toast(message);
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch(e: any) {
      Toast(e.message, true);
    } finally {
      setIsSyncingSheet(false);
    }
  }

  return business ? (
    <div className="space-y-8">
      {/* Add/Edit Product Form */}
      <div className="bg-[#2a2b2b] p-6 rounded-2xl border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">
            {isEditMode ? "Edit Product" : "Add New Product"}
          </h3>
          {
            spreadsheet ? 
<div className="relative mb-3 w-full sm:w-1/2 rounded-xl p-2 flex flex-row items-center justify-between gap-2">

  {/* Refresh Button */}
  <div
    onClick={handleSheetSync}
    className="px-3 gap-1 h-10 bg-[#202121] rounded-xl flex items-center justify-center text-white font-semibold cursor-pointer"
  >
    <CloudDownload
      className={`w-5 h-auto text-amber-400 transition-transform duration-500 ${
        isSyncingSheet ? "animate-bounce" : ""
      }`}
    />
  </div>

  {/* Input with Access Button */}
  <div className="relative flex-1 flex items-center">
    <input
      type="text"
      value={spreadsheet.spreadsheet_url}
      readOnly
      disabled
      className="w-full px-4 py-2 bg-[#202121] text-white placeholder-gray-500 rounded-l-xl"
    />
    <button
      onClick={() => window.open(spreadsheet.spreadsheet_url, '_blank')}
      className="px-3 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-r-xl hover:from-yellow-600 hover:to-amber-700 transition-all duration-200 flex items-center gap-1"
    >
      <ExternalLink className="w-5 h-auto text-white" />
      <span>Access</span>
    </button>
  </div>

</div>

            :
          <div onClick={handleApplySheet} className="w-fit px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 border border-amber-500 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 group cursor-pointer">
            <BadgeCheck className="w-5 h-5 text-white transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
            <span className={`ml-2 transition-all duration-300 group-hover:translate-x-1 ${isApplySheet ? 'animate-pulse' : ''}`}>{ isApplySheet ? 'Processing...' : 'Apply for Sheet'}</span>
          </div>
          }
          {isEditMode && (
            <button
              onClick={cancelEdit}
              className="px-3 py-1.5 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-all duration-200"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Compact Form Container */}
        <div className="space-y-4">
          {/* First Row - Name and Image */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Product Name */}
            <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-300">
                  Product Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  className={`w-full px-3 py-2 bg-[#202121] border rounded-lg text-white text-sm placeholder-gray-500 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-colors ${
                    validationErrors.name ? "border-red-500" : "border-transparent"
                  }`}
                />
              {validationErrors.name && (
                <p className="text-red-400 text-xs">{validationErrors.name}</p>
              )}
            </div>

            {/* Image URL */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-300">
                Image URL *
              </label>
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={newProduct.image}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, image: e.target.value })
                }
                className={`w-full px-3 py-2 bg-[#202121] border rounded-lg text-white text-sm placeholder-gray-500 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-colors ${
                    validationErrors.image ? "border-red-500" : "border-transparent"
                  }`}
              />
              {validationErrors.image && (
                <p className="text-red-400 text-xs">{validationErrors.image}</p>
              )}
            </div>
          </div>

          {/* Second Row - Price, Weight, and Quantity */}
          <div className="grid grid-cols-3 gap-4">
            {/* Price */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-300">
                Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
                className={`w-full px-3 py-2 bg-[#202121] border rounded-lg text-white text-sm placeholder-gray-500 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-colors ${
                    validationErrors.price ? "border-red-500" : "border-transparent"
                  }`}
              />
              {validationErrors.price && (
                <p className="text-red-400 text-xs">{validationErrors.price}</p>
              )}
            </div>

            {/* Weight */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-300">
                Weight (kg) *
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newProduct.kg}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, kg: e.target.value })
                }
                className={`w-full px-3 py-2 bg-[#202121] border rounded-lg text-white text-sm placeholder-gray-500 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-colors ${
                    validationErrors.kg ? "border-red-500" : "border-transparent"
                  }`}
              />
              {validationErrors.kg && (
                <p className="text-red-400 text-xs">{validationErrors.kg}</p>
              )}
            </div>

            {/* Quantity */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-300">
                Quantity *
              </label>
              <input
                type="number"
                placeholder="0"
                min="0"
                value={newProduct.quantity}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, quantity: e.target.value })
                }
                className={`w-full px-3 py-2 bg-[#202121] border rounded-lg text-white text-sm placeholder-gray-500 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-colors ${
                    validationErrors.quantity ? "border-red-500" : "border-transparent"
                  }`}
              />
              {validationErrors.quantity && (
                <p className="text-red-400 text-xs">
                  {validationErrors.quantity}
                </p>
              )}
            </div>
          </div>

          {/* Third Row - Description and Button */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
            {/* Description */}
            <div className="lg:col-span-3 space-y-1">
              <label className="block text-xs font-medium text-gray-300">
                Description *
              </label>
              <textarea
                placeholder="Enter product description (minimum 10 characters)"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                rows={2}
                className={`w-full px-3 py-2 bg-[#202121] border rounded-lg text-white text-sm placeholder-gray-500 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-colors ${
                    validationErrors.description ? "border-red-500" : "border-transparent"
                  }`}
              />
              {validationErrors.description && (
                <p className="text-red-400 text-xs">
                  {validationErrors.description}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="lg:col-span-1">
              <button
                onClick={isEditMode ? updateProduct : addProduct}
                className={`w-full h-14 mb-2 px-4 py-2 ${
                  isEditMode
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    : "bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700"
                } text-white text-sm rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 font-medium shadow-md hover:shadow-lg`}
              >
                {isEditMode ? (
                  <>
                    <Edit3 size={16} />
                    <span>Update</span>
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    <span>Add</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <DeleteProductModal
        isModalOpen={productToDelete !== null}
        setIsModalOpen={() => setProductToDelete(null)}
        productId={productToDelete?.id}
        business_id={business.id}
        editingProduct={editingProduct}
        cancelEdit={cancelEdit}
      />

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data && data.length > 0 ? (
          data.map((product: any) => (
            <div
              key={product.id}
              className={`bg-[#2a2b2b] rounded-2xl border overflow-hidden group transition-all duration-200 ${
                editingProduct && editingProduct.id === product.id
                  ? "border-amber-500 shadow-lg shadow-amber-500/20"
                  : "border-gray-700 hover:border-amber-500/50"
              }`}
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3 bg-black bg-opacity-60 p-2 rounded-xl text-white flex items-center justify-center space-x-1">
                  <button
                    onClick={() => startEditProduct(product)}
                    className={`rounded-full p-2 transition-colors ${
                      editingProduct && editingProduct.id === product.id
                        ? "bg-amber-600"
                        : "hover:bg-amber-600"
                    }`}
                    title="Edit Product"
                  >
                    <Edit3 size={16} />
                  </button>
                  {/* ✅ FIXED: Pass the entire product object */}
                  <button
                    onClick={() => setProductToDelete(product)}
                    className="hover:bg-red-600 rounded-full p-2 transition-colors"
                    title="Delete Product"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                {editingProduct && editingProduct.id === product.id && (
                  <div className="absolute top-3 left-3 bg-amber-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                    Editing
                  </div>
                )}
              </div>
              <div className="p-4">
                <h4 className="text-lg font-semibold text-white mb-1">
                  {product.name}
                </h4>
                <p className="text-sm text-gray-400 mb-2">
                  ₦{product.price} | {product.kg} kg | Qty: {product.quantity}
                </p>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {product.description}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400 py-12">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No products found</p>
            <p className="text-sm">Add your first product to get started</p>
          </div>
        )}
      </div>
    </div>
  ) : (
    <ErrorComponent msg="No business information found. Please set up your business details." />
  );
}