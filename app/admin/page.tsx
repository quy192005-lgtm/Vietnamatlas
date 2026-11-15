"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
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
  BookOpen,
  X,
  AlertCircle,
  Clock,
  Tag,
  Camera,
  Lock,
  EyeOff,
  LogOut,
  Key,
  ShieldCheck,
  Mail,
} from "lucide-react";

const LocationPickerMap = dynamic(() => import("@/components/LocationPickerMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[200px] w-full bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-xs text-slate-400">
      Loading interactive map...
    </div>
  ),
});

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
  extra_photos?: { src: string; credit_name: string }[];
}

interface Guide {
  slug: string;
  title: string;
  subtitle: string;
  readingTime: string;
  category: string;
  heroImage: string;
  photoCredit: string;
  photoLicense: string;
  problemStatement?: string;
}

interface CommunityPhotoItem {
  id: string;
  place_slug: string;
  place_name_en: string;
  place_name: string;
  city: string;
  region: "north" | "central" | "south";
  src: string;
  credit_name: string;
  index: number;
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

export default function AdminPage() {
  // AUTH STATE
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [activeTab, setActiveTab] = useState<"places" | "guides" | "photos">("places");

  // PLACES STATE
  const [places, setPlaces] = useState<Place[]>([]);
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0 });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters for places
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [publishedFilter, setPublishedFilter] = useState("all");

  // Place Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Place Form state
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
    extra_photos: [] as { src: string; credit_name: string }[],
  });

  // GUIDES STATE
  const [guides, setGuides] = useState<Guide[]>([]);
  const [guidesLoading, setGuidesLoading] = useState(false);
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [guideModalMode, setGuideModalMode] = useState<"add" | "edit">("add");
  const [guideSaving, setGuideSaving] = useState(false);

  // Guide Form state
  const [guideForm, setGuideForm] = useState({
    slug: "",
    title: "",
    subtitle: "",
    category: "Transportation",
    readingTime: "5 min read",
    heroImage: "",
    photoCredit: "Wikimedia Commons",
    photoLicense: "CC BY-SA 4.0",
    problemStatement: "",
  });

  // COMMUNITY PHOTOS STATE
  const [communityPhotos, setCommunityPhotos] = useState<CommunityPhotoItem[]>([]);
  const [communityLoading, setCommunityLoading] = useState(false);
  const [photoSearch, setPhotoSearch] = useState("");
  const [allPlacesList, setAllPlacesList] = useState<{ slug: string; name_en: string; city: string }[]>([]);

  // Community Photo Modal state
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [photoModalMode, setPhotoModalMode] = useState<"add" | "edit">("add");
  const [photoForm, setPhotoForm] = useState({
    place_slug: "",
    src: "",
    credit_name: "",
    index: 0,
  });
  const [photoSaving, setPhotoSaving] = useState(false);

  // Fetch community photos from API
  const fetchCommunityPhotos = useCallback(async () => {
    setCommunityLoading(true);
    try {
      const res = await fetch("/api/community-photos");
      const data = await res.json();
      if (data.success) {
        setCommunityPhotos(data.photos || []);
      }
    } catch (err) {
      console.error("Failed to load community photos:", err);
    } finally {
      setCommunityLoading(false);
    }
  }, []);

  // Fetch full list of places for dropdown
  const fetchAllPlacesList = useCallback(async () => {
    try {
      const res = await fetch("/api/places?limit=1000&published=all");
      const data = await res.json();
      if (data.places) {
        setAllPlacesList(
          data.places.map((p: any) => ({
            slug: p.slug,
            name_en: p.name_en || p.name,
            city: p.city || "Vietnam",
          }))
        );
      }
    } catch (err) {
      console.error("Failed to fetch places list:", err);
    }
  }, []);

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

  // Fetch guides from API
  const fetchGuides = useCallback(async () => {
    setGuidesLoading(true);
    try {
      const res = await fetch("/api/guides");
      const data = await res.json();
      setGuides(data.guides || []);
    } catch (err) {
      console.error("Failed to load guides:", err);
    } finally {
      setGuidesLoading(false);
    }
  }, []);

  // Check session on mount
  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/auth");
      const data = await res.json();
      setIsAuthenticated(Boolean(data.authenticated));
      setAdminEmail(data.email || null);
    } catch {
      setIsAuthenticated(false);
      setAdminEmail(null);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPlaces();
    }
  }, [isAuthenticated, fetchPlaces]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchGuides();
    }
  }, [isAuthenticated, fetchGuides]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCommunityPhotos();
      fetchAllPlacesList();
    }
  }, [isAuthenticated, fetchCommunityPhotos, fetchAllPlacesList]);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();

      if (data.success) {
        setIsAuthenticated(true);
        setAdminEmail(data.email || loginEmail);
        setLoginPassword("");
        showToast("Welcome back, Webmaster!");
      } else {
        setLoginError(data.error || "Incorrect email or password. Please try again.");
      }
    } catch {
      setLoginError("Failed to authenticate. Please check server connection.");
    } finally {
      setLoginLoading(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      setIsAuthenticated(false);
      setAdminEmail(null);
      showToast("Logged out successfully");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Show temporary toast message
  const showToast = (text: string, type: "success" | "error" = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3500);
  };

  // Quick toggle publish status for places
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

  // Open modal for Create Place
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
      extra_photos: [],
    });
    setModalOpen(true);
  };

  // Open modal for Edit Place
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
      extra_photos: place.extra_photos || [],
    });
    setModalOpen(true);
  };

  // Submit modal form (Add or Edit Place)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const method = modalMode === "add" ? "POST" : "PUT";
      const payload = {
        ...formData,
        extra_photos: (formData.extra_photos || []).filter(
          (p) => p.src && p.src.trim().length > 0
        ),
      };
      const res = await fetch("/api/places", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

  // GUIDES HANDLERS
  const handleOpenAddGuide = () => {
    setGuideModalMode("add");
    setGuideForm({
      slug: "",
      title: "",
      subtitle: "",
      category: "Transportation",
      readingTime: "6 min read",
      heroImage: "",
      photoCredit: "Wikimedia Commons",
      photoLicense: "CC BY-SA 4.0",
      problemStatement: "",
    });
    setGuideModalOpen(true);
  };

  const handleOpenEditGuide = (guide: Guide) => {
    setGuideModalMode("edit");
    setGuideForm({
      slug: guide.slug,
      title: guide.title,
      subtitle: guide.subtitle,
      category: guide.category,
      readingTime: guide.readingTime,
      heroImage: guide.heroImage,
      photoCredit: guide.photoCredit,
      photoLicense: guide.photoLicense,
      problemStatement: guide.problemStatement || "",
    });
    setGuideModalOpen(true);
  };

  const handleDeleteGuide = async (guide: Guide) => {
    if (!confirm(`Are you sure you want to delete guide: "${guide.title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/guides?slug=${encodeURIComponent(guide.slug)}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        showToast(`Deleted guide: ${guide.title}`);
        fetchGuides();
      } else {
        showToast(data.error || "Failed to delete guide", "error");
      }
    } catch (err) {
      showToast("Delete request failed", "error");
    }
  };

  const handleGuideSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuideSaving(true);

    try {
      const method = guideModalMode === "add" ? "POST" : "PUT";
      const res = await fetch("/api/guides", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(guideForm),
      });
      const data = await res.json();

      if (data.success) {
        showToast(
          guideModalMode === "add"
            ? `Successfully published new guide: "${guideForm.title}"!`
            : `Updated guide: "${guideForm.title}"!`
        );
        setGuideModalOpen(false);
        fetchGuides();
      } else {
        showToast(data.error || "Failed to save guide", "error");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to save guide", "error");
    } finally {
      setGuideSaving(false);
    }
  };

  // COMMUNITY PHOTOS HANDLERS
  const handleOpenAddPhoto = () => {
    setPhotoModalMode("add");
    setPhotoForm({
      place_slug: allPlacesList[0]?.slug || "hoan-kiem-lake",
      src: "",
      credit_name: "",
      index: 0,
    });
    setPhotoModalOpen(true);
  };

  const handleOpenEditPhoto = (photo: CommunityPhotoItem) => {
    setPhotoModalMode("edit");
    setPhotoForm({
      place_slug: photo.place_slug,
      src: photo.src,
      credit_name: photo.credit_name,
      index: photo.index,
    });
    setPhotoModalOpen(true);
  };

  const handleDeleteCommunityPhoto = async (photo: CommunityPhotoItem) => {
    if (!confirm(`Are you sure you want to remove photo by "${photo.credit_name}" from ${photo.place_name_en}?`)) {
      return;
    }
    try {
      const res = await fetch(
        `/api/community-photos?place_slug=${encodeURIComponent(photo.place_slug)}&index=${photo.index}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.success) {
        showToast(`Removed photo by ${photo.credit_name}`);
        fetchCommunityPhotos();
        fetchPlaces();
      } else {
        showToast(data.error || "Failed to remove photo", "error");
      }
    } catch (err) {
      showToast("Delete request failed", "error");
    }
  };

  const handlePhotoFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhotoSaving(true);
    try {
      const method = photoModalMode === "add" ? "POST" : "PUT";
      const res = await fetch("/api/community-photos", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(photoForm),
      });
      const data = await res.json();
      if (data.success) {
        showToast(
          photoModalMode === "add"
            ? "Successfully added community photo!"
            : "Successfully updated community photo!"
        );
        setPhotoModalOpen(false);
        fetchCommunityPhotos();
        fetchPlaces();
      } else {
        showToast(data.error || "Failed to save photo", "error");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to save photo", "error");
    } finally {
      setPhotoSaving(false);
    }
  };

  // 1. Loading session check
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <RefreshCw className="w-8 h-8 animate-spin text-teal-400 mb-3" />
        <p className="text-sm font-medium text-slate-300">Checking admin session...</p>
      </div>
    );
  }

  // 2. Unauthenticated: Show sleek Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-7 sm:p-9 shadow-2xl relative z-10">
          {/* Header */}
          <div className="text-center mb-7">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 to-teal-400 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/20 border border-teal-400/30">
              <Lock className="w-7 h-7" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[11px] font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Restricted Access</span>
            </div>
            <h1 className="font-serif text-2xl font-bold text-white tracking-tight">
              Owner Control Panel
            </h1>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Vietnam Atlas editorial administration. Please enter your secret owner password to continue.
            </p>
          </div>

          {/* Error Banner */}
          {loginError && (
            <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Owner Email (Email quản trị viên)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => {
                    setLoginEmail(e.target.value);
                    if (loginError) setLoginError("");
                  }}
                  placeholder="admin@vietnamatlas.com"
                  required
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-mono"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Owner Password (Mật khẩu chủ web)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    if (loginError) setLoginError("");
                  }}
                  placeholder="Enter admin password..."
                  required
                  className="w-full pl-10 pr-11 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 transition-colors"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading || !loginEmail || !loginPassword}
              className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-500 active:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm rounded-xl shadow-lg shadow-teal-600/30 transition-all flex items-center justify-center gap-2"
            >
              {loginLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  <span>Sign In as Admin</span>
                </>
              )}
            </button>
          </form>

          {/* Helpful note for owner */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1.5">
            <p className="flex items-center gap-1.5 text-slate-300 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
              <span>Default Email: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-teal-300 font-mono">admin@vietnamatlas.com</code></span>
            </p>
            <p className="flex items-center gap-1.5 text-slate-300 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
              <span>Default Password: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-teal-300 font-mono">vietnamatlas2026</code></span>
            </p>
            <p className="text-slate-500 pt-1">
              You can customize your admin email &amp; password in <code className="text-slate-400">.env.local</code> (<code className="text-slate-400">ADMIN_EMAIL=...</code> and <code className="text-slate-400">ADMIN_PASSWORD=...</code>).
            </p>
          </div>

          {/* Back link */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-teal-400 transition-colors inline-flex items-center gap-1"
            >
              <span>← Return to Public Website</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
              onClick={() => {
                fetchPlaces();
                fetchGuides();
                fetchCommunityPhotos();
              }}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading || guidesLoading || communityLoading ? "animate-spin text-teal-400" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {adminEmail && (
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300">
                <Mail className="w-3.5 h-3.5 text-teal-400" />
                <span className="font-mono text-[11px]">{adminEmail}</span>
              </div>
            )}

            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-teal-400" />
              <span>View Live Website</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="px-3.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-white text-xs font-medium rounded-lg border border-rose-500/30 transition-colors flex items-center gap-1.5"
              title="Sign out of Admin session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
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
        
        {/* TOP SECTION SWITCHER TABS */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-200/80 rounded-2xl w-fit border border-slate-300/60 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab("places")}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "places"
                ? "bg-white text-teal-800 shadow-md border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Compass className="w-4 h-4 text-teal-600" />
            <span>Places Directory ({stats.total.toLocaleString()})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("guides")}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "guides"
                ? "bg-white text-teal-800 shadow-md border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span>Practical Travel Guides ({guides.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("photos")}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "photos"
                ? "bg-white text-emerald-800 shadow-md border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Camera className="w-4 h-4 text-emerald-600" />
            <span>Traveller Photos ({communityPhotos.length})</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: PLACES MANAGEMENT */}
        {/* ============================================================== */}
        {activeTab === "places" && (
          <div className="space-y-6">
            {/* STATS CARDS */}
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

            {/* TOOLBAR */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="flex-1 flex flex-wrap items-center gap-3">
                {/* Search */}
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

              {/* Add Button */}
              <button
                type="button"
                onClick={handleOpenAdd}
                className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5 shrink-0 min-h-[40px]"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Place</span>
              </button>
            </div>

            {/* PLACES TABLE */}
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

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900 text-sm">
                              {place.name_en}
                            </span>
                            {place.extra_photos && place.extra_photos.length > 0 && (
                              <span
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-semibold"
                                title={`${place.extra_photos.length} community traveller photo(s)`}
                              >
                                <Camera className="w-3 h-3 text-emerald-600" />
                                <span>{place.extra_photos.length}</span>
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {place.name}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            /{place.slug}
                          </span>
                        </td>

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
                          <span className="text-slate-700 font-medium text-xs block">
                            {place.city || place.area}
                          </span>
                          <div className="text-[10px] font-mono mt-0.5 flex items-center gap-1 text-slate-500">
                            <MapPin className="w-3 h-3 text-teal-600 shrink-0" />
                            {place.lat && place.lng ? (
                              <span>
                                {place.lat.toFixed(3)}, {place.lng.toFixed(3)}
                              </span>
                            ) : (
                              <span className="text-amber-600 font-sans font-medium">No coords</span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium text-[11px] border border-slate-200">
                            {place.category_en || place.category}
                          </span>
                        </td>

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
        )}

        {/* ============================================================== */}
        {/* TAB 2: PRACTICAL TRAVEL GUIDES MANAGEMENT */}
        {/* ============================================================== */}
        {activeTab === "guides" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-slate-900">
                  Practical Travel Guides Articles
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage the guide cards displayed on the homepage and at /guides.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddGuide}
                className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Guide Article</span>
              </button>
            </div>

            {/* GUIDES GRID / LIST */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {guides.map((guide) => (
                <div
                  key={guide.slug}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-all"
                >
                  {/* Photo Preview */}
                  <div className="sm:w-48 h-40 sm:h-auto bg-slate-100 relative shrink-0">
                    {guide.heroImage ? (
                      <Image
                        src={guide.heroImage}
                        alt={guide.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 192px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <BookOpen className="w-8 h-8" />
                      </div>
                    )}
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/90 text-teal-800 shadow-sm backdrop-blur-sm">
                      {guide.category}
                    </span>
                  </div>

                  {/* Content Info */}
                  <div className="p-5 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{guide.readingTime}</span>
                        <span>•</span>
                        <span className="font-mono text-[10px]">/{guide.slug}</span>
                      </div>

                      <h3 className="font-serif text-base font-bold text-slate-900 leading-snug line-clamp-2 mb-2">
                        {guide.title}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {guide.subtitle}
                      </p>
                    </div>

                    <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-slate-400 truncate max-w-[150px]">
                        Photo: {guide.photoCredit || "Uncredited"}
                      </span>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/guides/${guide.slug}`}
                          target="_blank"
                          className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View live article"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleOpenEditGuide(guide)}
                          className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-medium transition-colors flex items-center gap-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteGuide(guide)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete guide"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: TRAVELLER PHOTOS MANAGEMENT */}
        {/* ============================================================== */}
        {activeTab === "photos" && (
          <div className="space-y-6">
            {/* TOP BAR WITH TITLE & QUICK ACTIONS */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-bold text-slate-900">
                    Community Traveller Photos
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Review and curate photos submitted by travellers across Vietnam.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSedSSyHAN82tmE3R0w49ZtyeIkb1IJX3KE8wucWfYa2tqq0gQ/edit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  title="Open Google Form editor and see submitted photos in Drive"
                >
                  <span>Google Form Responses</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>

                <Link
                  href="/traveller-photos"
                  target="_blank"
                  className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>Live Gallery</span>
                </Link>

                <button
                  type="button"
                  onClick={handleOpenAddPhoto}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Traveller Photo</span>
                </button>
              </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                    Published Photos
                  </span>
                  <span className="font-serif text-3xl font-bold text-slate-900 mt-1 block">
                    {communityPhotos.length}
                  </span>
                  <span className="text-[11px] text-emerald-600 font-medium mt-1 inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Displayed across live atlas
                  </span>
                </div>
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                  <Camera className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                    Destinations Featured
                  </span>
                  <span className="font-serif text-3xl font-bold text-slate-900 mt-1 block">
                    {new Set(communityPhotos.map((p) => p.place_slug)).size}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Places with community photos
                  </span>
                </div>
                <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600">
                  <MapPin className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                    Submission Form
                  </span>
                  <span className="text-base font-bold text-slate-900 mt-1 block">
                    Google Form Connected
                  </span>
                  <a
                    href="https://forms.gle/z6L8VxdauT9QKJet5"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-teal-600 hover:text-teal-700 font-medium mt-1 inline-flex items-center gap-1"
                  >
                    <span>forms.gle/z6L8VxdauT9QKJet5</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                  <ExternalLink className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* SEARCH BAR */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by destination name, city, or traveller name..."
                  value={photoSearch}
                  onChange={(e) => setPhotoSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              {photoSearch && (
                <button
                  type="button"
                  onClick={() => setPhotoSearch("")}
                  className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 font-medium"
                >
                  Clear
                </button>
              )}
            </div>

            {/* PHOTOS GRID */}
            {(() => {
              const q = photoSearch.toLowerCase().trim();
              const filtered = communityPhotos.filter((p) => {
                if (!q) return true;
                return (
                  p.place_name_en.toLowerCase().includes(q) ||
                  p.place_name.toLowerCase().includes(q) ||
                  p.city.toLowerCase().includes(q) ||
                  p.credit_name.toLowerCase().includes(q)
                );
              });

              if (communityLoading) {
                return (
                  <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                    <RefreshCw className="w-6 h-6 animate-spin text-emerald-600 mx-auto mb-2" />
                    <span className="text-xs text-slate-500">Loading community photos...</span>
                  </div>
                );
              }

              if (filtered.length === 0) {
                return (
                  <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Camera className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-slate-900 mb-1">
                      No traveller photos found
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                      {photoSearch
                        ? "No results matched your search. Try a different keyword."
                        : "No traveller photos published yet. Click the button below to add your first photo!"}
                    </p>
                    <button
                      type="button"
                      onClick={handleOpenAddPhoto}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl shadow-sm transition-colors inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add First Traveller Photo</span>
                    </button>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filtered.map((photo) => (
                    <div
                      key={photo.id}
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col group"
                    >
                      {/* Image Preview */}
                      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photo.src}
                          alt={photo.place_name_en}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-medium shadow-sm">
                          <MapPin className="w-3 h-3 text-emerald-400" />
                          <span>{photo.place_name_en}</span>
                        </div>
                        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-slate-700 text-[10px] font-semibold">
                          {photo.city}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 flex flex-col justify-between flex-1">
                        <div>
                          <div className="flex items-center gap-1.5 text-slate-800 font-semibold text-xs">
                            <Camera className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Photo: {photo.credit_name}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1 truncate" title={photo.src}>
                            {photo.src}
                          </p>
                        </div>

                        <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                          <Link
                            href={`/places/${photo.place_slug}`}
                            target="_blank"
                            className="text-[11px] text-teal-600 hover:text-teal-700 font-medium inline-flex items-center gap-1"
                          >
                            <span>View on Place</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditPhoto(photo)}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                              title="Edit photo or credit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCommunityPhoto(photo)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete photo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

      </div>

      {/* 5. MODAL DIALOG (Add / Edit Place) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 max-h-[90vh] overflow-y-auto">
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

              {/* Community Traveller Photos */}
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/70 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800 text-xs">
                      <Camera className="w-4 h-4 text-emerald-600" />
                      <span>Community Traveller Photos ({formData.extra_photos?.length || 0})</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Photos submitted by visitors and approved by admin. Displayed on Traveller Photos &amp; Place page.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        extra_photos: [...(prev.extra_photos || []), { src: "", credit_name: "" }],
                      }));
                    }}
                    className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Photo</span>
                  </button>
                </div>

                {formData.extra_photos && formData.extra_photos.length > 0 ? (
                  <div className="space-y-2.5 pt-1">
                    {formData.extra_photos.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white rounded-xl border border-emerald-100 flex items-start gap-3 shadow-xs"
                      >
                        {item.src ? (
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200 mt-0.5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.src}
                              alt="preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-slate-100 border border-dashed border-slate-300 shrink-0 flex items-center justify-center text-slate-400 mt-0.5">
                            <Camera className="w-4 h-4" />
                          </div>
                        )}

                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                              Photo URL
                            </label>
                            <input
                              type="url"
                              value={item.src}
                              onChange={(e) => {
                                const updated = [...(formData.extra_photos || [])];
                                updated[idx] = { ...updated[idx], src: e.target.value };
                                setFormData({ ...formData, extra_photos: updated });
                              }}
                              placeholder="https://images.unsplash.com/... or Google Drive URL"
                              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-900"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                              Traveller Name (Credit)
                            </label>
                            <input
                              type="text"
                              value={item.credit_name}
                              onChange={(e) => {
                                const updated = [...(formData.extra_photos || [])];
                                updated[idx] = { ...updated[idx], credit_name: e.target.value };
                                setFormData({ ...formData, extra_photos: updated });
                              }}
                              placeholder="e.g. John Doe, Sarah..."
                              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-900"
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const updated = (formData.extra_photos || []).filter((_, i) => i !== idx);
                            setFormData({ ...formData, extra_photos: updated });
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0 mt-3"
                          title="Remove photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-2.5 bg-white/70 rounded-xl border border-dashed border-emerald-200 text-xs text-slate-500">
                    No community photos added yet for this place.
                  </div>
                )}
              </div>

              {/* Map Coordinates & Interactive Location Picker */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800 text-xs">
                    <MapPin className="w-4 h-4 text-teal-600" />
                    <span>Map Coordinates &amp; Pin Location (Tọa độ bản đồ)</span>
                  </div>
                  {formData.lat && formData.lng && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${formData.lat},${formData.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-teal-600 hover:text-teal-700 font-medium inline-flex items-center gap-1"
                    >
                      <span>Check on Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Latitude (Vĩ độ - Lat)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.lat}
                      onChange={(e) => {
                        const newLat = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          lat: newLat,
                          maps_url:
                            newLat && prev.lng
                              ? `https://www.google.com/maps/search/?api=1&query=${newLat},${prev.lng}`
                              : prev.maps_url,
                        }));
                      }}
                      placeholder="e.g. 20.7398"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Longitude (Kinh độ - Lng)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.lng}
                      onChange={(e) => {
                        const newLng = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          lng: newLng,
                          maps_url:
                            prev.lat && newLng
                              ? `https://www.google.com/maps/search/?api=1&query=${prev.lat},${newLng}`
                              : prev.maps_url,
                        }));
                      }}
                      placeholder="e.g. 105.2364"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 text-slate-900"
                    />
                  </div>
                </div>

                {/* Quick Paste & Search Helper */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 text-[11px]">
                  <div className="flex items-center gap-1.5 flex-1 min-w-[220px]">
                    <span className="text-slate-500 whitespace-nowrap">Dán nhanh:</span>
                    <input
                      type="text"
                      placeholder="Paste 'lat, lng' (VD: 20.7398, 105.2364)"
                      onChange={(e) => {
                        const raw = e.target.value.trim();
                        const parts = raw.split(/[\s,]+/).filter(Boolean);
                        if (parts.length >= 2) {
                          const pLat = parseFloat(parts[0]);
                          const pLng = parseFloat(parts[1]);
                          if (!isNaN(pLat) && !isNaN(pLng)) {
                            setFormData((prev) => ({
                              ...prev,
                              lat: pLat.toString(),
                              lng: pLng.toString(),
                              maps_url: `https://www.google.com/maps/search/?api=1&query=${pLat},${pLng}`,
                            }));
                          }
                        }
                      }}
                      className="flex-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${formData.name || formData.name_en} ${formData.city} Vietnam`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium inline-flex items-center gap-1 transition-colors"
                    title="Mở Google Maps tìm địa điểm này để lấy tọa độ"
                  >
                    <span>🔍 Tìm trên Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Interactive Leaflet Mini Map Picker */}
                <div className="pt-2">
                  <label className="block font-medium text-slate-600 mb-1.5 text-[11px]">
                    Click trên bản đồ hoặc kéo thả ghim để chọn vị trí chính xác:
                  </label>
                  <LocationPickerMap
                    lat={formData.lat ? parseFloat(formData.lat) : null}
                    lng={formData.lng ? parseFloat(formData.lng) : null}
                    onChange={(newLat, newLng) => {
                      setFormData((prev) => ({
                        ...prev,
                        lat: newLat.toString(),
                        lng: newLng.toString(),
                        maps_url: `https://www.google.com/maps/search/?api=1&query=${newLat},${newLng}`,
                      }));
                    }}
                  />
                </div>
              </div>

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

      {/* 6. MODAL DIALOG (Add / Edit Guide Article) */}
      {guideModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h3 className="font-serif text-2xl font-bold text-slate-900">
                {guideModalMode === "add" ? "Add New Travel Guide" : "Edit Travel Guide"}
              </h3>
              <button
                type="button"
                onClick={() => setGuideModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGuideSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={guideForm.title}
                  onChange={(e) => setGuideForm({ ...guideForm, title: e.target.value })}
                  placeholder="e.g. How to Book Sleeper Buses Across Vietnam"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Subtitle / Summary *
                </label>
                <input
                  type="text"
                  required
                  value={guideForm.subtitle}
                  onChange={(e) => setGuideForm({ ...guideForm, subtitle: e.target.value })}
                  placeholder="e.g. Practical advice on overnight routes, reputable bus operators, and booking online..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={guideForm.category}
                    onChange={(e) => setGuideForm({ ...guideForm, category: e.target.value })}
                    placeholder="e.g. Transportation, Visas & Entry, Connectivity..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Reading Time
                  </label>
                  <input
                    type="text"
                    value={guideForm.readingTime}
                    onChange={(e) => setGuideForm({ ...guideForm, readingTime: e.target.value })}
                    placeholder="e.g. 5 min read"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 text-slate-900"
                  />
                </div>
              </div>

              {/* Photo settings */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Hero Image URL (Wikimedia Commons) *
                </label>
                <input
                  type="url"
                  required
                  value={guideForm.heroImage}
                  onChange={(e) => setGuideForm({ ...guideForm, heroImage: e.target.value })}
                  placeholder="https://thumb.wikimedia.org/..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Photo Credit
                  </label>
                  <input
                    type="text"
                    value={guideForm.photoCredit}
                    onChange={(e) => setGuideForm({ ...guideForm, photoCredit: e.target.value })}
                    placeholder="e.g. Jakub Hałun"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Photo License
                  </label>
                  <input
                    type="text"
                    value={guideForm.photoLicense}
                    onChange={(e) => setGuideForm({ ...guideForm, photoLicense: e.target.value })}
                    placeholder="e.g. CC BY-SA 4.0"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setGuideModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={guideSaving}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium shadow-sm transition-colors flex items-center gap-1.5"
                >
                  {guideSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                  <span>{guideModalMode === "add" ? "Create Article" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. COMMUNITY PHOTO MODAL (ADD / EDIT) */}
      {photoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-slate-900">
                    {photoModalMode === "add" ? "Add Traveller Photo" : "Edit Traveller Photo"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Publish an authentic traveller photo to the atlas.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPhotoModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePhotoFormSubmit} className="space-y-4">
              {/* Destination selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Destination (Địa điểm) *
                </label>
                {photoModalMode === "add" ? (
                  <select
                    value={photoForm.place_slug}
                    onChange={(e) => setPhotoForm({ ...photoForm, place_slug: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-900"
                  >
                    {allPlacesList.map((p) => (
                      <option key={p.slug} value={p.slug}>
                        {p.name_en} ({p.city})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl font-medium text-slate-700">
                    {allPlacesList.find((p) => p.slug === photoForm.place_slug)?.name_en || photoForm.place_slug}
                  </div>
                )}
              </div>

              {/* Photo URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Photo URL *
                </label>
                <input
                  type="url"
                  value={photoForm.src}
                  onChange={(e) => setPhotoForm({ ...photoForm, src: e.target.value })}
                  placeholder="https://... (Google Drive, Unsplash, Imgur, CDN)"
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-900"
                />
              </div>

              {/* Preview */}
              {photoForm.src && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-medium text-slate-500 block mb-2">
                    Photo Preview:
                  </span>
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photoForm.src}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Credit name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Traveller Name (Tác giả) *
                </label>
                <input
                  type="text"
                  value={photoForm.credit_name}
                  onChange={(e) => setPhotoForm({ ...photoForm, credit_name: e.target.value })}
                  placeholder="e.g. Elena Rostova, Marcus Vance..."
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-900"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Credit format on live site: Photo: <strong>{photoForm.credit_name || "Name"}</strong> — traveller contribution
                </p>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPhotoModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={photoSaving}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-xs shadow-sm transition-colors flex items-center gap-1.5"
                >
                  {photoSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>{photoModalMode === "add" ? "Publish to Live Site" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
