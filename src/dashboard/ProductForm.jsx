import React, { useState, useEffect } from "react";
import { X, Plus, Upload } from "lucide-react";
import { useProducts } from "../context/ProductContext";

const ProductForm = ({ editingProduct, onClose, onSubmit }) => {
  const { uploadImage, loading } = useProducts();

  const [productFormData, setProductFormData] = useState({
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
    images: [],
    sizes: [],
    colors: [],
    description: "",
    features: [""],
    material: "",
    care: "",
    madeIn: "",
    tags: [""],
  });

  const [pendingImageFiles, setPendingImageFiles] = useState([]); 
  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      setProductFormData({
        id: editingProduct.id || "",
        name: editingProduct.name || "",
        slug: editingProduct.slug || "",
        category: editingProduct.category || "",
        subcategory: editingProduct.subcategory || "",
        price: editingProduct.price || "",
        salePrice: editingProduct.salePrice || "",
        currency: editingProduct.currency || "NGN",
        inStock:
          editingProduct.inStock !== undefined ? editingProduct.inStock : true,
        stockCount: editingProduct.stockCount || "",
        images: editingProduct.images || [],
        sizes: editingProduct.sizes || [],
        colors: editingProduct.colors || [],
        description: editingProduct.description || "",
        features: editingProduct.features?.length
          ? editingProduct.features
          : [""],
        material: editingProduct.material || "",
        care: editingProduct.care || "",
        madeIn: editingProduct.madeIn || "",
        tags: editingProduct.tags?.length ? editingProduct.tags : [""],
      });
    }
  }, [editingProduct]);

  const handleProductFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleArrayFieldChange = (field, index, value) => {
    setProductFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayField = (field) => {
    setProductFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayField = (field, index) => {
    setProductFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSizeToggle = (size) => {
    setProductFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Store files for later upload
    setPendingImageFiles((prev) => [...prev, ...files]);

    // Create preview URLs
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setProductFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...previewUrls],
    }));
  };

  const removeImage = (index) => {
    setProductFormData((prev) => {
      const newImages = prev.images.filter((_, i) => i !== index);
      // Revoke object URL to prevent memory leaks
      if (prev.images[index].startsWith('blob:')) {
        URL.revokeObjectURL(prev.images[index]);
      }
      return {
        ...prev,
        images: newImages,
      };
    });
    
    // Also remove from pending files
    setPendingImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUploadingImages(true);

      // Upload all pending images first
      let uploadedImageUrls = [];
      
      if (pendingImageFiles.length > 0) {
        const uploadPromises = pendingImageFiles.map((file) => uploadImage(file));
        const uploadResults = await Promise.all(uploadPromises);
        uploadedImageUrls = uploadResults;
      }

      // Filter out blob URLs  and keep only real URLs (if editing)
      const existingImageUrls = productFormData.images.filter(
        (img) => !img.startsWith('blob:')
      );

      // Combine existing URLs with newly uploaded URLs
      const allImageUrls = [...existingImageUrls, ...uploadedImageUrls];

      const productData = {
        ...productFormData,
        images: allImageUrls,
        price: Number(productFormData.price),
        salePrice: productFormData.salePrice
          ? Number(productFormData.salePrice)
          : undefined,
        stockCount: Number(productFormData.stockCount),
        features: productFormData.features.filter((f) => f),
        tags: productFormData.tags.filter((t) => t),
      };

      await onSubmit(productData);

      // Clear pending files after successful submission
      setPendingImageFiles([]);
      
    } catch (error) {
      console.error("Error creating product:", error);
      alert(`Failed to create product: ${error.message}`);
    } finally {
      setUploadingImages(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-black tracking-wide uppercase">
          {editingProduct ? "Edit Product" : "Add New Product"}
        </h3>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
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
                value={productFormData.id}
                onChange={handleProductFormChange}
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
                value={productFormData.name}
                onChange={handleProductFormChange}
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
                value={productFormData.slug}
                onChange={handleProductFormChange}
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
                value={productFormData.category}
                onChange={handleProductFormChange}
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
                value={productFormData.subcategory}
                onChange={handleProductFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Select Subcategory</option>
                <option value="shirts">Shirts</option>
                <option value="polos">Polos</option>
                <option value="hoodies">Hoodies</option>
                <option value="caps">Caps</option>
                <option value="tanks">Tanks</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₦) *
              </label>
              <input
                type="number"
                name="price"
                value={productFormData.price}
                onChange={handleProductFormChange}
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
                value={productFormData.salePrice}
                onChange={handleProductFormChange}
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
                value={productFormData.stockCount}
                onChange={handleProductFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="inStock"
              checked={productFormData.inStock}
              onChange={handleProductFormChange}
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
          <p className="text-sm text-gray-600">
            Images will be uploaded when you click Create Product
          </p>

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

          {productFormData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {productFormData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
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
                  {image.startsWith('blob:') && (
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-yellow-500 text-white text-xs rounded">
                      Pending upload
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
                  productFormData.sizes.includes(size)
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
            value={productFormData.colors.join(", ")}
            onChange={(e) =>
              setProductFormData((prev) => ({
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
              value={productFormData.description}
              onChange={handleProductFormChange}
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
                value={productFormData.material}
                onChange={handleProductFormChange}
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
                value={productFormData.care}
                onChange={handleProductFormChange}
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
                value={productFormData.madeIn}
                onChange={handleProductFormChange}
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
          {productFormData.features.map((feature, index) => (
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
              {productFormData.features.length > 1 && (
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
          {productFormData.tags.map((tag, index) => (
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
              {productFormData.tags.length > 1 && (
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
            type="button"
            onClick={handleSubmit}
            disabled={loading || uploadingImages}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 tracking-wide uppercase text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploadingImages
              ? "Uploading images..."
              : loading
              ? "Saving..."
              : editingProduct
              ? "Update Product"
              : "Create Product"}
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
    </div>
  );
};

export default ProductForm;