"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  MapPin,
  RefreshCw,
  Compass,
  Eye,
  SlidersHorizontal,
  X,
  AlertCircle,
} from "lucide-react";

interface Place {
  name: string;
  name_en: string;
  slug: string;
  category: string;
  category_en: string;
  area: string;
  city: string;
  city_slug: string;
  region: "north" | "central" | "south";
  desc: string;
  desc_en: string;
  photo_url: string;
  photo_credit: string;
  photo_license: string;
  photo_status: string;
  lat: number | null;
  lng: number | null;
  maps_url: string;
  published: boolean;
}

const CATEGORIES = [
  "Historic Sites",
  "Nature & Lakes",
  "Beaches & Islands",
  "Temples & Pagodas",
  "Markets & Food",
  "Scenic Routes",
  "Modern Architecture",
  "Museums",
  "Waterfalls & Caves",
  "Culture & Villages",
  "Attractions",
];

const REGIONS: ("north" | "central" | "south")[] = ["north", "central", "south"];

export default function AdminPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0 });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [publishedFilter, setPublishedFilter] = useState("all");

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    slug: "",
    name_en: "",
    name: "",
    region: "north" as "north" | "central" | "south",
    city: "Hanoi",
    category_en: "Historic Sites",
    desc_en: "",
    photo_url: "",
    photo_credit: "Owner",
    photo_license: "CC BY-SA 4.0",
    lat: "",
    lng: "",
    maps_url: "",
    published: false,
  });

  // Fetch places from API
  const fetchPlaces = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "25",
        q: search,
        region: regionFilter,
        published: publishedFilter,
      });

      const res = await fetch(`/api/places?${params.toString()}`);
      const data = await res.json();

      setPlaces(data.places || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setStats(data.stats || { total: 0, published: 0, draft: 0 });
    } catch (err) {
      console.error("Failed to load places:", err);
    } finally {
      setLoading(false);
    }
  }, [page, search, regionFilter, publishedFilter]);

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  // Show temporary toast message
  const showToast = (text: string, type: "success" | "error" = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3500);
  };

  // Quick toggle publish status
  const handleTogglePublish = async (place: Place) => {
    const newStatus = !place.published;
    try {
      const res = await fetch("/api/places", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: place.slug, published: newStatus }),
      });
      const data = await res.json();

      if (data.success) {
        setPlaces((prev) =>
          prev.map((p) => (p.slug === place.slug ? { ...p, published: newStatus } : p))
        );
        setStats((prev) => ({
          ...prev,
          published: newStatus ? prev.published + 1 : prev.published - 1,
          draft: newStatus ? prev.draft - 1 : prev.draft + 1,
        }));
        showToast(`Updated "${place.name_en}" to ${newStatus ? "PUBLISHED" : "DRAFT"}`);
      }
    } catch (err) {
      showToast("Failed to toggle publish status", "error");
    }
  };

  // Delete place
  const handleDeletePlace = async (place: Place) => {
    if (!confirm(`Are you sure you want to delete "${place.name_en}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/places?slug=${encodeURIComponent(place.slug)}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        showToast(`Deleted place: ${place.name_en}`);
        fetchPlaces();
      } else {
        showToast(data.error || "Failed to delete", "error");
      }
    } catch (err) {
      showToast("Delete request failed", "error");
    }
  };

  // Open modal for Create
  const handleOpenAdd = () => {
    setModalMode("add");
    setFormData({
      slug: "",
      name_en: "",
      name: "",
      region: "north",
      city: "Hanoi",
      category_en: "Historic Sites",
      desc_en: "",
      photo_url: "",
      photo_credit: "Wikimedia Commons",
      photo_license: "CC BY-SA 4.0",
      lat: "",
      lng: "",
      maps_url: "",
      published: true,
    });
    setModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (place: Place) => {
    setModalMode("edit");
    setFormData({
      slug: place.slug,
      name_en: place.name_en,
      name: place.name || place.name_en,
      region: place.region,
      city: place.city || "Hanoi",
      category_en: place.category_en || "Historic Sites",
      desc_en: place.desc_en || place.desc || "",
      photo_url: place.photo_url || "",
      photo_credit: place.photo_credit || "",
      photo_license: place.photo_license || "CC BY-SA 4.0",
      lat: place.lat ? place.lat.toString() : "",
      lng: place.lng ? place.lng.toString() : "",
      maps_url: place.maps_url || "",
      published: place.published,
    });
    setModalOpen(true);
  };

  // Submit modal form (Add or Edit)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const method = modalMode === "add" ? "POST" : "PUT";
      const res = await fetch("/api/places", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        showToast(
          modalMode === "add"
            ? `Successfully created "${formData.name_en}"!`
            : `Updated "${formData.name_en}"!`
        );
        setModalOpen(false);
        fetchPlaces();
      } else {
        showToast(data.error || "Failed to save place", "error");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* 1. TOP HEADER */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-teal-500 text-white flex items-center justify-center font-serif font-bold text-lg shadow-sm">
              V
            </span>
            <div>
              <h1 className="font-serif text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Vietnam Atlas <span className="text-xs px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-sans font-medium border border-teal-500/30">Owner Control Panel</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchPlaces()}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-teal-400" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-teal-400" />
              <span>View Live Website</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </Link>
          </div>
        </div>
      </header>

      {/* TOAST MESSAGE */}
      {message && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-medium text-white ${
              message.type === "success" ? "bg-teal-600" : "bg-rose-600"
            }`}
          >
            {message.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{message.text}</span>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* 2. STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Total Places
              </span>
              <span className="font-serif text-3xl font-bold text-slate-900 mt-1 block">
                {stats.total.toLocaleString()}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
              <Compass className="w-6 h-6" />
            </div>
          </div>

          <div
            onClick={() => setPublishedFilter(publishedFilter === "true" ? "all" : "true")}
            className={`bg-white rounded-2xl p-5 border shadow-sm flex items-center justify-between cursor-pointer transition-all ${
              publishedFilter === "true" ? "border-teal-500 ring-2 ring-teal-500/20" : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div>
              <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider block">
                Published &amp; Live
              </span>
              <span className="font-serif text-3xl font-bold text-teal-700 mt-1 block">
                {stats.published.toLocaleString()}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div
            onClick={() => setPublishedFilter(publishedFilter === "false" ? "all" : "false")}
            className={`bg-white rounded-2xl p-5 border shadow-sm flex items-center justify-between cursor-pointer transition-all ${
              publishedFilter === "false" ? "border-amber-500 ring-2 ring-amber-500/20" : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div>
              <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider block">
                Drafts (Unpublished)
              </span>
              <span className="font-serif text-3xl font-bold text-amber-700 mt-1 block">
                {stats.draft.toLocaleString()}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <XCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* 3. TOOLBAR (Search + Filters + Add Button) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex-1 flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[240px] flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search English name, Vietnamese name, city..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-colors"
              />
            </div>

            {/* Region Filter */}
            <select
              value={regionFilter}
              onChange={(e) => {
                setRegionFilter(e.target.value);
                setPage(1);
              }}
              className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-teal-500"
            >
              <option value="all">All Regions</option>
              <option value="north">North Vietnam</option>
              <option value="central">Central Vietnam</option>
              <option value="south">South Vietnam</option>
            </select>

            {/* Status Filter */}
            <select
              value={publishedFilter}
              onChange={(e) => {
                setPublishedFilter(e.target.value);
                setPage(1);
              }}
              className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-teal-500"
            >
              <option value="all">All Status</option>
              <option value="true">Live Only (Published)</option>
              <option value="false">Drafts Only</option>
            </select>
          </div>

          {/* ADD PLACE BUTTON */}
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5 shrink-0 min-h-[40px]"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Place</span>
          </button>
        </div>

        {/* 4. PLACES TABLE */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 w-16">Photo</th>
                  <th className="py-3 px-4">Place Name</th>
                  <th className="py-3 px-4">Region / City</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {places.map((place) => (
                  <tr key={place.slug} className="hover:bg-slate-50/70 transition-colors">
                    {/* Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden relative border border-slate-200 shrink-0">
                        {place.photo_url ? (
                          <Image
                            src={place.photo_url}
                            alt={place.name_en}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <MapPin className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Name */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 text-sm">
                        {place.name_en}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {place.name}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        /{place.slug}
                      </span>
                    </td>

                    {/* Region / City */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
                            place.region === "north"
                              ? "bg-teal-50 text-teal-700 border border-teal-200"
                              : place.region === "central"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {place.region}
                        </span>
                      </div>
                      <span className="text-slate-600 font-medium">
                        {place.city || place.area}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium text-[11px] border border-slate-200">
                        {place.category_en || place.category}
                      </span>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(place)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                          place.published
                            ? "bg-teal-100 text-teal-800 hover:bg-teal-200 border border-teal-300"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-300"
                        }`}
                        title="Click to toggle Published / Draft"
                      >
                        {place.published ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                            <span>Live</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-slate-400" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {place.published && (
                          <Link
                            href={`/places/${place.slug}`}
                            target="_blank"
                            className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="View on site"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(place)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit Place"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePlace(place)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Place"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {places.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      No places found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span>
              Showing Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium shadow-sm"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. MODAL DIALOG (Add / Edit Place) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h3 className="font-serif text-2xl font-bold text-slate-900">
                {modalMode === "add" ? "Add New Place" : "Edit Place"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    English Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    placeholder="e.g. Cat Ba National Park"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Vietnamese Local Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Vườn quốc gia Cát Bà"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 text-slate-900"
                  />
                </div>
              </div>

              {/* Region & City & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Region *
                  </label>
                  <select
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 text-slate-900"
                  >
                    <option value="north">North Vietnam</option>
                    <option value="central">Central Vietnam</option>
                    <option value="south">South Vietnam</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    City / Province *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Hai Phong"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category_en}
                    onChange={(e) => setFormData({ ...formData, category_en: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 text-slate-900"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  English Description
                </label>
                <textarea
                  rows={3}
                  value={formData.desc_en}
                  onChange={(e) => setFormData({ ...formData, desc_en: e.target.value })}
                  placeholder="Describe highlights, history, or scenic appeal..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 text-slate-900"
                />
              </div>

              {/* Photo URL & Credit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Photo URL (Wikimedia Commons)
                  </label>
                  <input
                    type="url"
                    value={formData.photo_url}
                    onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                    placeholder="https://thumb.wikimedia.org/..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Photo Credit &amp; License
                  </label>
                  <input
                    type="text"
                    value={formData.photo_credit}
                    onChange={(e) => setFormData({ ...formData, photo_credit: e.target.value })}
                    placeholder="e.g. Steffen Schmitz — CC BY-SA 4.0"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 text-slate-900"
                  />
                </div>
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="text"
                    value={formData.lat}
                    onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                    placeholder="e.g. 20.8038"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Longitude
                  </label>
                  <input
                    type="text"
                    value={formData.lng}
                    onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                    placeholder="e.g. 106.9996"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 text-slate-900"
                  />
                </div>
              </div>

              {/* Published Switch */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
                  />
                  <span className="font-semibold text-slate-800">
                    Publish immediately (Show live on website)
                  </span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium shadow-sm transition-colors flex items-center gap-1.5"
                >
                  {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                  <span>{modalMode === "add" ? "Create Place" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
