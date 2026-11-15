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

interface CityItem {
  city_slug: string;
  city: string;
  region: "north" | "central" | "south";
  photo_url: string;
  photo_credit: string;
  photo_license: string;
  count: number;
  available_photos?: {
    place_name_en: string;
    place_slug: string;
    photo_url: string;
    photo_credit: string;
  }[];
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

  const [activeTab, setActiveTab] = useState<"places" | "cities" | "guides" | "photos">("places");

  // CITIES & DESTINATIONS STATE
  const [citiesList, setCitiesList] = useState<CityItem[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [cityRegionFilter, setCityRegionFilter] = useState("all");

  // City Edit Modal state
  const [cityModalOpen, setCityModalOpen] = useState(false);
  const [cityForm, setCityForm] = useState<{
    city_slug: string;
    city: string;
    region: "north" | "central" | "south";
    photo_url: string;
    photo_credit: string;
    photo_license: string;
    available_photos: {
      place_name_en: string;
      place_slug: string;
      photo_url: string;
      photo_credit: string;
    }[];
  }>({
    city_slug: "",
    city: "",
    region: "north",
    photo_url: "",
    photo_credit: "",
    photo_license: "CC BY-SA 4.0",
    available_photos: [],
  });
  const [citySaving, setCitySaving] = useState(false);

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

  // Fetch cities/destinations from API
  const fetchCities = useCallback(async () => {
    setCitiesLoading(true);
    try {
      const res = await fetch("/api/cities");
      const data = await res.json();
      if (data.success) {
        setCitiesList(data.cities || []);
      }
    } catch (err) {
      console.error("Failed to load cities:", err);
    } finally {
      setCitiesLoading(false);
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
      fetchCities();
    }
  }, [isAuthenticated, fetchCommunityPhotos, fetchAllPlacesList, fetchCities]);

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

  // City cover photo edit handlers
  const handleOpenEditCity = (c: CityItem) => {
    setCityForm({
      city_slug: c.city_slug,
      city: c.city,
      region: c.region,
      photo_url: c.photo_url || "",
      photo_credit: c.photo_credit || "Wikimedia Commons",
      photo_license: c.photo_license || "CC BY-SA 4.0",
      available_photos: c.available_photos || [],
    });
    setCityModalOpen(true);
  };

  const handleCityFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityForm.city_slug) return;
    setCitySaving(true);
    try {
      const res = await fetch("/api/cities", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city_slug: cityForm.city_slug,
          photo_url: cityForm.photo_url,
          photo_credit: cityForm.photo_credit,
          photo_license: cityForm.photo_license,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Updated cover photo for ${cityForm.city}!`);
        setCityModalOpen(false);
        fetchCities();
      } else {
        showToast(data.error || "Failed to update city cover photo", "error");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to update city cover photo", "error");
    } finally {
      setCitySaving(false);
    }
  };

  // 1. Loading session check
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Traditional Dong Son Bronze Drum Embossed Background Watermark */}
        <div
          className="fixed inset-0 pointer-events-none z-0 opacity-[0.16] bg-repeat bg-center"
          style={{
            backgroundImage: "url('/dong-son-texture.jpg')",
            backgroundSize: "900px auto",
            backgroundAttachment: "fixed",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 flex flex-col items-center">
          <RefreshCw className="w-8 h-8 animate-spin text-teal-600 mb-3" />
          <p className="text-sm font-medium text-slate-600">Verifying secure administrative session...</p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated: Show sleek Login Screen with Dong Son Bronze Drum background
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Traditional Dong Son Bronze Drum Embossed Background Watermark */}
        <div
          className="fixed inset-0 pointer-events-none z-0 opacity-[0.16] bg-repeat bg-center"
          style={{
            backgroundImage: "url('/dong-son-texture.jpg')",
            backgroundSize: "900px auto",
            backgroundAttachment: "fixed",
          }}
          aria-hidden="true"
        />

        {/* Soft radial vignette: leaves center clear & gives subtle depth */}
        <div
          className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(250,247,242,0.85)_100%)]"
          aria-hidden="true"
        />

        {/* Login Card */}
        <div className="max-w-md w-full bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-7 sm:p-9 shadow-2xl shadow-slate-900/10 relative z-10 text-slate-900">
          {/* Header */}
          <div className="text-center mb-7">
            <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-4 shadow-lg shadow-amber-500/20 border-2 border-amber-400/50 bg-teal-800 flex items-center justify-center">
              <Image
                src="/logo-icon.png"
                alt="Vietnam Atlas Logo"
                width={64}
                height={64}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Restricted Access</span>
            </div>
            <h1 className="font-brand font-black text-2xl sm:text-3xl tracking-tight bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 bg-clip-text text-transparent uppercase">
              Vietnam Atlas
            </h1>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">
              Owner Control Panel
            </p>
          </div>

          {/* Error Banner */}
          {loginError && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
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
                  placeholder="Enter your admin email..."
                  required
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:bg-white focus:ring-1 focus:ring-teal-600 transition-all font-mono"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Owner Password (Mật khẩu)
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
                  placeholder="Enter your password..."
                  required
                  className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:bg-white focus:ring-1 focus:ring-teal-600 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 transition-colors"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading || !loginEmail || !loginPassword}
              className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm rounded-xl shadow-lg shadow-teal-700/20 transition-all flex items-center justify-center gap-2"
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

          {/* Back link */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-teal-700 font-medium transition-colors inline-flex items-center gap-1"
            >
              <span>← Return to Public Website</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]/70 text-slate-900 pb-20">
      {/* 1. TOP HEADER */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-sm shrink-0 border border-amber-400/40 bg-teal-800 flex items-center justify-center">
              <Image
                src="/logo-icon.png"
                alt="Vietnam Atlas Logo"
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="font-brand font-black text-lg tracking-tight bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent flex items-center gap-2 uppercase">
                Vietnam Atlas <span className="text-xs px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-sans font-medium border border-teal-500/30 normal-case">Owner Control Panel</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                fetchPlaces();
                fetchCities();
                fetchGuides();
                fetchCommunityPhotos();
              }}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading || citiesLoading || guidesLoading || communityLoading ? "animate-spin text-teal-400" : ""}`} />
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
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-200/80 rounded-2xl w-fit border border-slate-300/60 shadow-inner">
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
            onClick={() => setActiveTab("cities")}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "cities"
                ? "bg-white text-teal-800 shadow-md border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <MapPin className="w-4 h-4 text-teal-600" />
            <span>Destinations &amp; Cities ({citiesList.length})</span>
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
        {/* TAB 2: DESTINATIONS & CITIES COVER PHOTOS */}
        {/* ============================================================== */}
        {activeTab === "cities" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-teal-600" />
                  <span>Destinations &amp; City Cover Photos</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Manage the primary cover photo for all 24 published provinces and cities shown on /destinations, homepage, and city detail pages.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 border border-teal-200">
                  {citiesList.length} Total Destinations
                </span>
              </div>
            </div>

            {/* SEARCH & REGION FILTER BAR */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter destinations by name..."
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-teal-500 text-slate-800"
                />
                {citySearch && (
                  <button
                    onClick={() => setCitySearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                {(["all", "north", "central", "south"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setCityRegionFilter(r)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium capitalize transition-all shrink-0 ${
                      cityRegionFilter === r
                        ? "bg-slate-900 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {r === "all" ? "All Regions" : `${r} Vietnam`}
                  </button>
                ))}
              </div>
            </div>

            {/* CITIES GRID */}
            {citiesLoading ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <RefreshCw className="w-6 h-6 animate-spin text-teal-600 mx-auto mb-2" />
                <p className="text-xs text-slate-500">Loading destination photos...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {citiesList
                  .filter((c) => {
                    const matchSearch =
                      !citySearch ||
                      c.city.toLowerCase().includes(citySearch.toLowerCase()) ||
                      c.city_slug.toLowerCase().includes(citySearch.toLowerCase());
                    const matchRegion = cityRegionFilter === "all" || c.region === cityRegionFilter;
                    return matchSearch && matchRegion;
                  })
                  .map((c) => {
                    const regionColor =
                      c.region === "north"
                        ? "bg-teal-500/90 text-white"
                        : c.region === "central"
                        ? "bg-amber-500/90 text-white"
                        : "bg-emerald-600/90 text-white";

                    return (
                      <div
                        key={c.city_slug}
                        className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
                      >
                        {/* Cover Image Container */}
                        <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                          {c.photo_url ? (
                            <Image
                              src={c.photo_url}
                              alt={c.city}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100">
                              <Camera className="w-8 h-8 mb-1 opacity-50" />
                              <span className="text-[11px]">No cover photo</span>
                            </div>
                          )}

                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

                          {/* Top Badges */}
                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                            <span
                              className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm backdrop-blur-sm ${regionColor}`}
                            >
                              {c.region} Vietnam
                            </span>
                            <span className="text-[11px] font-semibold bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-full shadow-sm">
                              {c.count} Places Listed
                            </span>
                          </div>

                          {/* City Name overlay on image */}
                          <div className="absolute bottom-3 left-3 right-3 text-white">
                            <h3 className="font-serif text-xl font-bold tracking-tight drop-shadow-md">
                              {c.city}
                            </h3>
                            <span className="text-[11px] font-mono text-slate-300 opacity-90">
                              /cities/{c.city_slug}
                            </span>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
                          <div className="text-[11px] text-slate-500 space-y-1">
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="font-semibold text-slate-700">Photo Credit:</span>
                              <span className="truncate" title={c.photo_credit || "Unspecified"}>
                                {c.photo_credit || "Unspecified"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-slate-700">License:</span>
                              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-mono">
                                {c.photo_license || "CC BY-SA 4.0"}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEditCity(c)}
                              className="flex-1 py-2 px-3 bg-teal-50 hover:bg-teal-100 active:bg-teal-200 text-teal-800 text-xs font-semibold rounded-xl border border-teal-200/80 transition-colors flex items-center justify-center gap-1.5"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-teal-600" />
                              <span>Change Cover Photo</span>
                            </button>

                            <Link
                              href={`/cities/${c.city_slug}`}
                              target="_blank"
                              className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                              title={`View public page for ${c.city}`}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: PRACTICAL TRAVEL GUIDES MANAGEMENT */}
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
      {/* 5. EDIT CITY COVER PHOTO MODAL */}
      {cityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                    {cityForm.region} Vietnam
                  </span>
                  <span className="text-xs font-mono text-slate-400">/cities/{cityForm.city_slug}</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-slate-900 mt-1">
                  Change Cover Photo: {cityForm.city}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choose from existing places in {cityForm.city} or paste a custom high-resolution image URL.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCityModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCityFormSubmit} className="space-y-5">
              {/* Live Preview Box */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Current Cover Photo Live Preview
                </label>
                <div className="relative h-56 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner flex items-center justify-center">
                  {cityForm.photo_url ? (
                    <>
                      <Image
                        src={cityForm.photo_url}
                        alt={cityForm.city}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-3 left-4 right-4 text-white text-xs pointer-events-none">
                        <p className="font-serif font-bold text-base">{cityForm.city}</p>
                        <p className="text-[11px] text-slate-300 opacity-90 truncate">
                          Photo: {cityForm.photo_credit || "Uncredited"} — {cityForm.photo_license}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-slate-400">
                      <Camera className="w-8 h-8 mx-auto mb-1 opacity-50" />
                      <p className="text-xs">No image URL specified yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 1-Click Pick from Existing Places */}
              {cityForm.available_photos && cityForm.available_photos.length > 0 && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-slate-800">
                      Quick-Pick from Places in {cityForm.city} ({cityForm.available_photos.length} photos)
                    </label>
                    <span className="text-[11px] text-teal-700 font-medium">Click any thumbnail to select</span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-1">
                    {cityForm.available_photos.map((item, idx) => {
                      const isSelected = cityForm.photo_url === item.photo_url;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setCityForm((prev) => ({
                              ...prev,
                              photo_url: item.photo_url,
                              photo_credit: item.photo_credit || prev.photo_credit,
                            }));
                          }}
                          className={`relative h-20 rounded-xl overflow-hidden border-2 transition-all group text-left ${
                            isSelected
                              ? "border-teal-600 ring-2 ring-teal-500/40 shadow-md scale-[1.02]"
                              : "border-transparent hover:border-slate-300 opacity-80 hover:opacity-100"
                          }`}
                          title={`Use photo from: ${item.place_name_en}`}
                        >
                          <Image
                            src={item.photo_url}
                            alt={item.place_name_en}
                            fill
                            sizes="120px"
                            className="object-cover"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          <span className="absolute bottom-1 left-1.5 right-1.5 text-[9px] font-medium text-white truncate drop-shadow">
                            {item.place_name_en}
                          </span>
                          {isSelected && (
                            <div className="absolute top-1 right-1 bg-teal-600 text-white rounded-full p-0.5 shadow">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Custom Image URL inputs */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Photo URL (Unsplash, Wikimedia, Direct CDN URL) *
                  </label>
                  <input
                    type="url"
                    required
                    value={cityForm.photo_url}
                    onChange={(e) => setCityForm({ ...cityForm, photo_url: e.target.value })}
                    placeholder="https://images.unsplash.com/... or https://upload.wikimedia.org/..."
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Photo Credit / Photographer *
                    </label>
                    <input
                      type="text"
                      required
                      value={cityForm.photo_credit}
                      onChange={(e) => setCityForm({ ...cityForm, photo_credit: e.target.value })}
                      placeholder="e.g. Jakub Hałun, Elena Rostova, Unsplash"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      License
                    </label>
                    <select
                      value={cityForm.photo_license}
                      onChange={(e) => setCityForm({ ...cityForm, photo_license: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 text-slate-900"
                    >
                      <option value="CC BY-SA 4.0">CC BY-SA 4.0</option>
                      <option value="CC BY 4.0">CC BY 4.0</option>
                      <option value="CC BY-SA 3.0">CC BY-SA 3.0</option>
                      <option value="CC0">CC0 (Public Domain)</option>
                      <option value="Unsplash License">Unsplash License</option>
                      <option value="Editorial Use">Editorial Use</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Form buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCityModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={citySaving || !cityForm.photo_url}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white rounded-xl font-medium text-xs shadow-md shadow-teal-700/20 transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {citySaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Save Cover Photo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
