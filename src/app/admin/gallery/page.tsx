"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Camera,
  Plus,
  Trash2,
  Edit2,
  X,
  Check,
  AlertCircle,
  Upload,
  Link as LinkIcon,
  Search,
  Filter,
  Calendar,
  Sparkles,
  Maximize2,
  RefreshCw,
} from "lucide-react";
import { GalleryItemData } from "@/lib/types";

const ALBUM_CATEGORIES = [
  { id: "CAMPUS", label: "Campus Life" },
  { id: "SPORTS", label: "Sports Gala" },
  { id: "EVENTS", label: "Events & Celebrations" },
  { id: "ACADEMICS", label: "Academics & Labs" },
  { id: "CEREMONY", label: "Prize Distribution" },
];

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItemData | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("CAMPUS");
  const [date, setDate] = useState("September 2025");
  const [imageUrl, setImageUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [uploadType, setUploadType] = useState<"FILE" | "URL">("FILE");

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      if (data && data.items) {
        setItems(data.items);
      }
    } catch {
      console.error("Failed to load gallery");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setTitle("");
    setDescription("");
    setCategory("CAMPUS");
    setDate(
      new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })
    );
    setImageUrl("");
    setFeatured(false);
    setSelectedFile(null);
    setFilePreview(null);
    setUploadType("FILE");
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: GalleryItemData) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description || "");
    setCategory(item.category);
    setDate(item.date || "");
    setImageUrl(item.imageUrl);
    setFeatured(item.featured);
    setSelectedFile(null);
    setFilePreview(item.imageUrl);
    setUploadType("URL");
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setFilePreview(previewUrl);
      if (!title) {
        // Autocomplete title from filename
        const cleanName = file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[-_]/g, " ");
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);

    let finalImageUrl = imageUrl;

    try {
      // If uploading a file, upload it first
      if (uploadType === "FILE" && selectedFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadRes = await fetch("/api/gallery/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        setUploading(false);

        if (!uploadRes.ok || !uploadData.ok) {
          setFormError(uploadData.error || "Failed to upload file.");
          setSaving(false);
          return;
        }

        finalImageUrl = uploadData.imageUrl;
      }

      if (!finalImageUrl) {
        setFormError("Please select an image file or provide an image URL.");
        setSaving(false);
        return;
      }

      // Now create or update gallery record
      if (editingItem) {
        // Update
        const res = await fetch("/api/gallery", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingItem.id,
            title,
            description,
            imageUrl: finalImageUrl,
            category,
            date,
            featured,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          setFormError(data.error || "Failed to update photo.");
          setSaving(false);
          return;
        }
        setSuccessMessage("Photo details updated successfully.");
      } else {
        // Create
        const res = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description,
            imageUrl: finalImageUrl,
            category,
            date,
            featured,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          setFormError(data.error || "Failed to add photo.");
          setSaving(false);
          return;
        }
        setSuccessMessage("New photo added to school gallery successfully!");
      }

      setIsModalOpen(false);
      loadGallery();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch {
      setFormError("Network error while saving photo.");
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const handleDelete = async (item: GalleryItemData) => {
    if (!confirm(`Are you sure you want to remove photo "${item.title}"?`)) return;

    try {
      const res = await fetch(`/api/gallery?id=${item.id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.ok) {
        setItems((prev) => prev.filter((i) => i.id !== item.id));
        setSuccessMessage("Photo removed successfully.");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        alert(data.error || "Failed to delete photo.");
      }
    } catch {
      alert("Network error deleting photo.");
    }
  };

  // Filtered Items
  const filtered = items.filter((item) => {
    if (filterCategory !== "ALL" && item.category !== filterCategory) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      item.title.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q)) ||
      (item.date && item.date.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#1B2A4A] px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider mb-1.5">
            <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Media Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            School Photo Gallery & Albums
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Upload and organize official campus photographs, sports events, science fairs, and school celebrations.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-[#1B2A4A] hover:bg-[#111C32] text-white px-5 py-3 rounded-2xl text-xs font-bold shadow-md transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>Upload New Photo</span>
        </button>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-sm animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Photos
          </span>
          <p className="text-2xl font-black text-[#1B2A4A] mt-1">{items.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Published</p>
        </div>

        <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200 shadow-sm">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
            Campus Life
          </span>
          <p className="text-2xl font-black text-emerald-800 mt-1">
            {items.filter((i) => i.category === "CAMPUS").length}
          </p>
          <p className="text-[11px] text-emerald-600 mt-0.5">Grounds & Labs</p>
        </div>

        <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 shadow-sm">
          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
            Sports Gala
          </span>
          <p className="text-2xl font-black text-amber-800 mt-1">
            {items.filter((i) => i.category === "SPORTS").length}
          </p>
          <p className="text-[11px] text-amber-600 mt-0.5">Athletics & Games</p>
        </div>

        <div className="bg-purple-50/80 p-4 rounded-2xl border border-purple-200 shadow-sm">
          <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider block">
            Celebrations
          </span>
          <p className="text-2xl font-black text-purple-800 mt-1">
            {items.filter((i) => i.category === "EVENTS").length}
          </p>
          <p className="text-[11px] text-purple-600 mt-0.5">Festivals & Arts</p>
        </div>

        <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-200 shadow-sm col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">
            Academics / Awards
          </span>
          <p className="text-2xl font-black text-blue-800 mt-1">
            {items.filter((i) => i.category === "ACADEMICS" || i.category === "CEREMONY").length}
          </p>
          <p className="text-[11px] text-blue-600 mt-0.5">Science & Awards</p>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilterCategory("ALL")}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              filterCategory === "ALL"
                ? "bg-[#1B2A4A] text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Categories ({items.length})
          </button>
          {ALBUM_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                filterCategory === cat.id
                  ? "bg-[#1B2A4A] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat.label} ({items.filter((i) => i.category === cat.id).length})
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search photo title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Photos Grid */}
      {loading ? (
        <div className="p-20 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-[#1B2A4A]" />
          <span>Loading gallery photos...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Camera className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-800">No Photos Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No photographs match your query. Click "Upload New Photo" above to add new school memories.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition"
            >
              {/* Image Container */}
              <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                <div className="absolute top-2.5 left-2.5">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-full">
                    {item.category}
                  </span>
                </div>

                {item.featured && (
                  <div className="absolute top-2.5 right-2.5">
                    <span className="text-[9px] font-black uppercase tracking-wider bg-[#D4AF37] text-[#111C32] px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Featured
                    </span>
                  </div>
                )}
              </div>

              {/* Card Details */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                    <span>{item.date || "Recent"}</span>
                    <span>By {item.uploadedBy}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href={item.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-bold text-[#1B2A4A] hover:underline flex items-center gap-1"
                  >
                    <Maximize2 className="w-3 h-3 text-[#D4AF37]" />
                    <span>View Full Image</span>
                  </a>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-[#1B2A4A] hover:bg-slate-100 transition cursor-pointer"
                      title="Edit photo info"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title="Delete photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#1B2A4A] text-white flex items-center justify-center">
                  <Camera className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                    {editingItem ? "Edit Photo Details" : "Upload School Photo"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Add high-quality photos for students, parents, and public visitors.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              {/* Upload Mode Selector (File vs URL) */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[10px]">
                  Photo Source
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setUploadType("FILE")}
                    className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition cursor-pointer border ${
                      uploadType === "FILE"
                        ? "bg-[#1B2A4A] text-white border-[#1B2A4A] shadow-sm"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Upload from Device</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUploadType("URL")}
                    className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition cursor-pointer border ${
                      uploadType === "URL"
                        ? "bg-[#1B2A4A] text-white border-[#1B2A4A] shadow-sm"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Provide Image URL</span>
                  </button>
                </div>
              </div>

              {/* Mode 1: File Upload Drop Area */}
              {uploadType === "FILE" && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Select Image File (JPG, PNG, WEBP)
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-[#1B2A4A] rounded-2xl p-5 text-center cursor-pointer bg-slate-50/60 hover:bg-slate-100/60 transition group"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="w-10 h-10 rounded-full bg-slate-200 group-hover:bg-[#1B2A4A] group-hover:text-white transition flex items-center justify-center mx-auto mb-2 text-slate-600">
                      <Upload className="w-5 h-5" />
                    </div>
                    {selectedFile ? (
                      <p className="font-bold text-slate-900 truncate">
                        Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)
                      </p>
                    ) : (
                      <>
                        <p className="font-bold text-slate-800">
                          Click to select a photo from your computer/mobile
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          High resolution images up to 10MB supported
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Mode 2: Direct Image URL */}
              {uploadType === "URL" && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Image Direct URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setFilePreview(e.target.value);
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-mono text-xs text-slate-900 focus:bg-white focus:outline-none"
                  />
                </div>
              )}

              {/* Live Preview Box */}
              {filePreview && (
                <div className="bg-slate-100 p-2 rounded-2xl border border-slate-200">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 px-1">
                    Photo Preview
                  </p>
                  <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-black/5">
                    <img
                      src={filePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Photo Title / Event Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Exhibition Model Demonstration"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              {/* Category & Date Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Album / Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-semibold text-slate-800 focus:bg-white focus:outline-none"
                  >
                    {ALBUM_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Event Date / Month
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. September 2025"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Photo Description / Caption (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief story, student achievements, or context of this photo..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-[#1B2A4A] focus:ring-0 cursor-pointer"
                />
                <label htmlFor="featured" className="text-slate-700 font-semibold cursor-pointer">
                  Feature this photo prominently on the gallery header
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="inline-flex items-center gap-2 bg-[#1B2A4A] hover:bg-[#111C32] text-white px-5 py-2.5 rounded-xl font-bold shadow transition cursor-pointer disabled:opacity-50"
                >
                  {saving || uploading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" />
                      <span>{uploading ? "Uploading Image..." : "Saving..."}</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{editingItem ? "Update Photo" : "Publish Photo"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
