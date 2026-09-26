"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Camera,
  Filter,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Sparkles,
  Trophy,
  BookOpen,
  Building,
  PartyPopper,
  Layers,
} from "lucide-react";
import { GalleryItemData } from "@/lib/types";

const CATEGORIES = [
  { id: "ALL", label: "All Photos", icon: Layers },
  { id: "CAMPUS", label: "Campus Life", icon: Building },
  { id: "SPORTS", label: "Sports Gala", icon: Trophy },
  { id: "EVENTS", label: "Events & Celebrations", icon: PartyPopper },
  { id: "ACADEMICS", label: "Academics & Labs", icon: BookOpen },
  { id: "CEREMONY", label: "Prize Distribution", icon: Sparkles },
];

export default function PublicGalleryPage() {
  const [items, setItems] = useState<GalleryItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    loadGallery();
  }, [selectedCategory]);

  const loadGallery = async () => {
    setLoading(true);
    try {
      const url =
        selectedCategory === "ALL"
          ? "/api/gallery"
          : `/api/gallery?category=${encodeURIComponent(selectedCategory)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.items) {
        setItems(data.items);
      }
    } catch {
      console.error("Failed to load gallery photos");
    } finally {
      setLoading(false);
    }
  };

  // Lightbox handlers
  const openLightbox = (index: number) => {
    setActiveLightboxIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setActiveLightboxIndex(null);
    document.body.style.overflow = "auto";
  };

  const prevPhoto = () => {
    if (activeLightboxIndex === null || items.length === 0) return;
    setActiveLightboxIndex((activeLightboxIndex - 1 + items.length) % items.length);
  };

  const nextPhoto = () => {
    if (activeLightboxIndex === null || items.length === 0) return;
    setActiveLightboxIndex((activeLightboxIndex + 1) % items.length);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevPhoto();
      if (e.key === "ArrowRight") nextPhoto();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeLightboxIndex, items]);

  const getCategoryBadgeColor = (cat: string) => {
    switch (cat.toUpperCase()) {
      case "SPORTS":
        return "bg-amber-500/90 text-white";
      case "EVENTS":
        return "bg-purple-600/90 text-white";
      case "ACADEMICS":
        return "bg-blue-600/90 text-white";
      case "CEREMONY":
        return "bg-[#D4AF37] text-[#111C32] font-black";
      case "CAMPUS":
      default:
        return "bg-emerald-600/90 text-white";
    }
  };

  const activePhoto =
    activeLightboxIndex !== null && items[activeLightboxIndex]
      ? items[activeLightboxIndex]
      : null;

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-sans pb-20">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#0D1B3D] via-[#111C32] to-[#1B2A4A] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/30 relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-3.5 py-1 rounded-full text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5" />
            <span>Campus Moments & Photo Archive</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-heading">
            Life at <span className="text-[#D4AF37]">Nayab English Grammer High School</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            A visual chronicle of academic accomplishments, sporting competitions, science exhibitions, cultural galas, and vibrant daily memories in Mirwah.
          </p>

          <div className="pt-2 text-xs text-slate-400 font-semibold flex items-center justify-center gap-2">
            <span>Mirwah Campus</span>
            <span>•</span>
            <span>Preserving Excellence Since 2012</span>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-8">
        {/* Filter Navigation Pills */}
        <div className="bg-white p-2.5 sm:p-3 rounded-2xl sm:rounded-full shadow-lg border border-slate-200 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
                  isSelected
                    ? "bg-[#1B2A4A] text-white shadow-md"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-[#D4AF37]" : "text-slate-400"}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="p-20 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-[#1B2A4A] border-t-transparent rounded-full animate-spin" />
            <p className="font-semibold text-slate-700">Loading campus photo album...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-sm space-y-3">
            <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Camera className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-base text-slate-800">No Photos In This Album Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              School administration is continuously capturing memorable moments. Check back soon or select another category above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <div
                key={item.id}
                onClick={() => openLightbox(index)}
                className="group bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col transform hover:-translate-y-1"
              >
                {/* Photo Container */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="inline-flex items-center gap-1.5 text-xs text-white font-bold">
                      <Maximize2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Click to View Full Size</span>
                    </span>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md backdrop-blur-xs ${getCategoryBadgeColor(
                        item.category
                      )}`}
                    >
                      {item.category}
                    </span>
                  </div>

                  {/* Date Badge */}
                  {item.date && (
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                      <Calendar className="w-3 h-3 text-[#D4AF37]" />
                      <span>{item.date}</span>
                    </div>
                  )}
                </div>

                {/* Caption / Description Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#1B2A4A] transition-colors leading-snug line-clamp-1">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Nayab Official Album</span>
                    <span className="text-[#D4AF37] font-bold group-hover:translate-x-0.5 transition-transform">
                      View Photo →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && activeLightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          {/* Modal Container */}
          <div
            className="relative max-w-5xl w-full max-h-[92vh] flex flex-col rounded-3xl overflow-hidden bg-black/40 border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar with Title & Close */}
            <div className="bg-[#111C32]/90 backdrop-blur-md text-white px-5 py-3.5 flex items-center justify-between border-b border-white/10 z-10">
              <div className="flex items-center gap-2.5 truncate pr-4">
                <span
                  className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${getCategoryBadgeColor(
                    activePhoto.category
                  )}`}
                >
                  {activePhoto.category}
                </span>
                <span className="font-bold text-sm truncate">{activePhoto.title}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                  {activeLightboxIndex + 1} / {items.length}
                </span>
                <button
                  onClick={closeLightbox}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
                  aria-label="Close photo"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Photo Viewing Area */}
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px] max-h-[68vh]">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="max-h-full max-w-full object-contain mx-auto"
              />

              {/* Prev Button */}
              {items.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevPhoto();
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 flex items-center justify-center transition cursor-pointer shadow-lg"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Next Button */}
              {items.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextPhoto();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 flex items-center justify-center transition cursor-pointer shadow-lg"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Caption & Metadata Footer */}
            <div className="bg-[#111C32]/95 text-white p-4 sm:p-5 border-t border-white/10 space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="font-bold text-sm sm:text-base text-white">{activePhoto.title}</h4>
                {activePhoto.date && (
                  <span className="text-xs text-[#D4AF37] font-semibold flex items-center gap-1 shrink-0">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{activePhoto.date}</span>
                  </span>
                )}
              </div>
              {activePhoto.description && (
                <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                  {activePhoto.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
