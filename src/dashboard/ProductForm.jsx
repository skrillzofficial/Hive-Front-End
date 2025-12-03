import React, { useState, useEffect } from "react";
import { X, Plus, Upload } from "lucide-react";
import { useProducts } from "../context/ProductContext";

const ProductForm = ({ editingProduct, onClose, onSubmit }) => {
  const { loading } = useProducts();

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    slug: "",
    category: "",
    subcategory: "",
    price: "",
    salePrice: "",
    currency: "NGN",
    inStock: true,
    stockCount: "",
    sizes: [],
    colors: [],
    description: "",
    features: [""],
    material: "",
    care: "",
    madeIn: "",
    tags: [""],
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        id: editingProduct.id || "",
        name: editingProduct.name || "",
        slug: editingProduct.slug || "",
        category: editingProduct.category || "",
        subcategory: editingProduct.subcategory || "",
        price: editingProduct.price || "",
        salePrice: editingProduct.salePrice || "",
        currency: editingProduct.currency || "NGN",
        inStock: editingProduct.inStock !== undefined ? editingProduct.inStock : true,
        stockCount: editingProduct.stockCount || "",
        sizes: editingProduct.sizes || [],
        colors: editingProduct.colors || [],
        description: editingProduct.description || "",
        features: editingProduct.features?.length ? editingProduct.features : [""],
        material: editingProduct.material || "",
        care: editingProduct.care || "",
        madeIn: editingProduct.madeIn || "",
        tags: editingProduct.tags?.length ? editingProduct.tags : [""],
      });
      
      // Set existing images
      setExistingImages(editingProduct.images || []);
      setImagePreviews(editingProduct.images || []);
    } else {
      // Reset for new product
      setFormData({
        id: "",
        name: "",
        slug: "",
        category: "",
        subcategory: "",
        price: "",
        salePrice: "",
        currency: "NGN",
        inStock: true,
        stockCount: "",
        sizes: [],
        colors: [],
        description: "",
        features: [""],
        material: "",
        care: "",
        madeIn: "",
        tags: [""],
      });
      setImageFiles([]);
      setImagePreviews([]);
      setExistingImages([]);
    }
  }, [editingProduct]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleArrayFieldChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayField = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSizeToggle = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Store actual files
    setImageFiles(prev => [...prev, ...files]);

    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    const preview = imagePreviews[index];
    
    // If it's a new upload (blob URL)
    if (preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
      
      // Find which file to remove (count blob URLs before this index)
      const newUploadIndex = imagePreviews
        .slice(0, index)
        .filter(p => p.startsWith('blob:')).length;
      
      setImageFiles(prev => prev.filter((_, i) => i !== newUploadIndex));
    } else {
      // It's an existing image - remove from existingImages
      setExistingImages(prev => prev.filter(img => img !== preview));
    }
    
    // Remove from previews
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const submitFormData = new FormData();
      
      // Add all text fields
      Object.keys(formData).forEach(key => {
        if (key === 'sizes' || key === 'colors' || key === 'features' || key === 'tags') {
          // Handle arrays
          const filteredArray = formData[key].filter(item => item && item.trim() !== '');
          filteredArray.forEach(item => {
            submitFormData.append(`${key}[]`, item);
          });
        } else if (formData[key] !== undefined && formData[key] !== null && formData[key] !== '') {
          submitFormData.append(key, formData[key]);
        }
      });
      
      // Add existing images (for update only)
      if (editingProduct && existingImages.length > 0) {
        existingImages.forEach(img => {
          submitFormData.append('existingImages[]', img);
        });
      }
      
      // Add new image files
      imageFiles.forEach(file => {
        submitFormData.append('images', file);
      });

      // Call onSubmit with FormData and product ID (if editing)
      await onSubmit(submitFormData, editingProduct?._id);
      
      // Cleanup blob URLs
      imagePreviews.forEach(preview => {
        if (preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
      });

      // Reset form
      setImageFiles([]);
      setImagePreviews([]);
      setExistingImages([]);
      
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`Failed to save product: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-black tracking-wide uppercase">
          {editingProduct ? "Edit Product" : "Add New Product"}
        </h3>
        <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
          <X size={20} />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="font-semibold text-black uppercase tracking-wide">
            Basic Information
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product ID *
              </label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="e.g., PROD-001"
                required
                disabled={editingProduct}
              />
              {editingProduct && (
                <p className="text-xs text-gray-500 mt-1">ID cannot be changed when editing</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              >
                <option value="">Select Category</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcategory
              </label>
              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Select Subcategory</option>
                <option value="shirts">Shirts</option>
                <option value="polos">Polos</option>
                <option value="hoodies">Hoodies</option>
                <option value="caps">Caps</option>
                <option value="tanks">Tanks</option>
                <option value="jumpsuits">Jumpsuits</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₦) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sale Price (₦)
              </label>
              <input
                type="number"
                name="salePrice"
                value={formData.salePrice}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Count *
              </label>
              <input
                type="number"
                name="stockCount"
                value={formData.stockCount}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="inStock"
              checked={formData.inStock}
              onChange={handleInputChange}
              className="w-4 h-4 text-black focus:ring-black border-gray-300 rounded"
            />
            <label className="text-sm font-medium text-gray-700">
              In Stock
            </label>
          </div>
        </div>

        {/* Images */}
        <div className="space-y-4">
          <h4 className="font-semibold text-black uppercase tracking-wide">
            Product Images
          </h4>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <Upload className="w-12 h-12 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600 mb-1">
                Click to select images
              </span>
              <span className="text-xs text-gray-500">PNG, JPG up to 10MB</span>
            </label>
          </div>

          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Product ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                  {preview.startsWith('blob:') && (
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs rounded">
                      New
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sizes */}
        <div className="space-y-4">
          <h4 className="font-semibold text-black uppercase tracking-wide">
            Available Sizes
          </h4>
          <div className="flex flex-wrap gap-2">
            {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => handleSizeToggle(size)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  formData.sizes.includes(size)
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-4">
          <h4 className="font-semibold text-black uppercase tracking-wide">
            Available Colors
          </h4>
          <input
            type="text"
            placeholder="Enter colors separated by commas (e.g., Black, White, Blue)"
            value={formData.colors.join(", ")}
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                colors: e.target.value
                  .split(",")
                  .map((c) => c.trim())
                  .filter((c) => c),
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Description */}
        <div className="space-y-4">
          <h4 className="font-semibold text-black uppercase tracking-wide">
            Product Details
          </h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Material
              </label>
              <input
                type="text"
                name="material"
                value={formData.material}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Care Instructions
              </label>
              <input
                type="text"
                name="care"
                value={formData.care}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Made In
              </label>
              <input
                type="text"
                name="madeIn"
                value={formData.madeIn}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <h4 className="font-semibold text-black uppercase tracking-wide">
            Features
          </h4>
          {formData.features.map((feature, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={feature}
                onChange={(e) =>
                  handleArrayFieldChange("features", index, e.target.value)
                }
                placeholder="Feature"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
              {formData.features.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayField("features", index)}
                  className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField("features")}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <Plus size={16} />
            Add Feature
          </button>
        </div>

        {/* Tags */}
        <div className="space-y-4">
          <h4 className="font-semibold text-black uppercase tracking-wide">
            Tags
          </h4>
          {formData.tags.map((tag, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={tag}
                onChange={(e) =>
                  handleArrayFieldChange("tags", index, e.target.value)
                }
                placeholder="Tag"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
              {formData.tags.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayField("tags", index)}
                  className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField("tags")}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <Plus size={16} />
            Add Tag
          </button>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4 border-t">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 tracking-wide uppercase text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 tracking-wide uppercase text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;