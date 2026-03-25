"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import MarketingHeader from "@/components/marketing/Header";
import MarketingFooter from "@/components/marketing/Footer";
import {
  Search,
  MapPin,
  Phone,
  Star,
  Clock,
  CheckCircle2,
  Filter,
  ChevronDown,
  Heart,
  Stethoscope,
  Building2,
  Users,
  X,
  Globe,
  Award,
  GraduationCap,
  Calendar,
  Video,
  Mail,
  Printer,
  Share2,
  ThumbsUp,
  MessageSquare,
  Shield,
  BadgeCheck,
  Languages,
  Briefcase,
  Brain,
  Baby,
  Bone,
  Eye,
  HeartPulse,
  Loader2,
  AlertCircle,
  User,
} from "lucide-react";

// Provider type matching our API
interface APIProvider {
  id: string;
  npi: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  title?: string;
  credential?: string;
  gender?: string;
  specialty?: string;
  primaryTaxonomy?: string;
  primaryTaxonomyDesc?: string;
  secondaryTaxonomyDesc?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  county?: string;
  phone?: string;
  fax?: string;
  email?: string;
  acceptingNewPatients?: boolean;
  languages?: string[];
  licenseState?: string;
  licenseNumber?: string;
  practiceId?: string;
}

// Display provider type for the UI
interface DisplayProvider {
  id: string;
  npi: string;
  name: string;
  credentials: string;
  specialty: string;
  subspecialties: string[];
  gender: string;
  languages: string[];
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  accepting: boolean;
  telehealth: boolean;
  practiceName: string;
  networkStatus: string;
}

// Language code to name mapping
const languageNames: Record<string, string> = {
  eng: "English",
  spa: "Spanish",
  cmn: "Mandarin",
  yue: "Cantonese",
  vie: "Vietnamese",
  kor: "Korean",
  jpn: "Japanese",
  ara: "Arabic",
  hin: "Hindi",
  por: "Portuguese",
  fra: "French",
  deu: "German",
  rus: "Russian",
  tgl: "Tagalog",
  ita: "Italian",
  pol: "Polish",
};

function transformProvider(p: APIProvider): DisplayProvider {
  // Build name from parts or use existing name
  let displayName = p.name || "";
  if (p.firstName || p.lastName) {
    const parts = [p.firstName, p.lastName].filter(Boolean);
    displayName = parts.join(" ");
    if (p.title) {
      displayName = `Dr. ${displayName}`;
    }
  }

  // Build credentials string
  const credentials = p.credential || p.title || "";

  // Get specialty - prefer primaryTaxonomyDesc for more detail
  const specialty = p.primaryTaxonomyDesc || p.specialty || "General Practice";

  // Build subspecialties from secondary taxonomy
  const subspecialties: string[] = [];
  if (p.secondaryTaxonomyDesc) {
    subspecialties.push(p.secondaryTaxonomyDesc);
  }

  // Map language codes to names
  const languages = (p.languages || []).map(
    (code) => languageNames[code] || code
  );
  if (languages.length === 0) {
    languages.push("English");
  }

  return {
    id: p.id,
    npi: p.npi,
    name: displayName,
    credentials,
    specialty,
    subspecialties,
    gender: p.gender || "",
    languages,
    address: p.address || "",
    city: p.city || "",
    state: p.state || "AZ",
    zip: p.zip || "",
    phone: p.phone || "",
    email: p.email || "",
    accepting: p.acceptingNewPatients !== false,
    telehealth: false, // Not in our data yet
    practiceName: "", // Would need practice lookup
    networkStatus: "In-Network",
  };
}

// Normalize specialty names for grouping
function normalizeSpecialty(specialty: string): string {
  const lower = specialty.toLowerCase();

  // Primary Care groupings
  if (
    lower.includes("family") ||
    lower.includes("general practice") ||
    lower === "family medicine"
  ) {
    return "Family Medicine";
  }
  if (lower.includes("internal medicine") && !lower.includes("subspecialty")) {
    return "Internal Medicine";
  }
  if (lower.includes("pediatric") && !lower.includes("subspecialty")) {
    return "Pediatrics";
  }

  // Behavioral Health
  if (
    lower.includes("psychiatr") ||
    lower.includes("psychology") ||
    lower.includes("mental health") ||
    lower.includes("counselor") ||
    lower.includes("clinical social worker") ||
    lower.includes("behavioral")
  ) {
    return "Behavioral Health";
  }

  // Cardiology
  if (lower.includes("cardio") || lower.includes("heart")) {
    return "Cardiology";
  }

  // OB/GYN
  if (lower.includes("obstetric") || lower.includes("gynecolog")) {
    return "OB/GYN";
  }

  // Orthopedics
  if (
    lower.includes("orthop") ||
    lower.includes("orthopaedic") ||
    lower.includes("sports medicine")
  ) {
    return "Orthopedics";
  }

  // Dermatology
  if (lower.includes("dermatolog")) {
    return "Dermatology";
  }

  // Neurology
  if (lower.includes("neurolog")) {
    return "Neurology";
  }

  // Ophthalmology
  if (lower.includes("ophthalmolog") || lower.includes("optometr")) {
    return "Eye Care";
  }

  // Gastroenterology
  if (lower.includes("gastro")) {
    return "Gastroenterology";
  }

  // Pulmonology
  if (lower.includes("pulmon")) {
    return "Pulmonology";
  }

  // Oncology
  if (lower.includes("oncolog")) {
    return "Oncology";
  }

  // Urology
  if (lower.includes("urolog")) {
    return "Urology";
  }

  // Radiology
  if (lower.includes("radiolog")) {
    return "Radiology";
  }

  // Emergency
  if (lower.includes("emergency") || lower.includes("urgent care")) {
    return "Emergency/Urgent Care";
  }

  // Physical Therapy
  if (lower.includes("physical therap")) {
    return "Physical Therapy";
  }

  // Chiropractic
  if (lower.includes("chiroprac")) {
    return "Chiropractic";
  }

  // Podiatry
  if (lower.includes("podiatr")) {
    return "Podiatry";
  }

  // Dental
  if (lower.includes("dent")) {
    return "Dental";
  }

  // Surgery
  if (lower.includes("surgery") || lower.includes("surgeon")) {
    return "Surgery";
  }

  // Return original if no match
  return specialty;
}

export default function FindProviderPage() {
  const [providers, setProviders] = useState<DisplayProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [specialty, setSpecialty] = useState("All Specialties");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProvider, setSelectedProvider] =
    useState<DisplayProvider | null>(null);
  const [acceptingOnly, setAcceptingOnly] = useState(false);
  const [telehealthOnly, setTelehealthOnly] = useState(false);
  const [genderFilter, setGenderFilter] = useState("Any");
  const [languageFilter, setLanguageFilter] = useState("Any");
  const [sortBy, setSortBy] = useState("name");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const providersPerPage = 20;

  // Fetch providers from API
  useEffect(() => {
    async function fetchProviders() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/providers?limit=10000");
        if (!res.ok) throw new Error("Failed to fetch providers");

        const data = await res.json();
        const transformed = (data.providers || []).map(transformProvider);
        setProviders(transformed);
      } catch (err) {
        console.error("Failed to load providers:", err);
        setError("Failed to load providers. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProviders();
  }, []);

  // Build dynamic specialty list from actual data
  const specialties = useMemo(() => {
    const specMap = new Map<string, number>();
    providers.forEach((p) => {
      const normalized = normalizeSpecialty(p.specialty);
      specMap.set(normalized, (specMap.get(normalized) || 0) + 1);
    });

    // Sort by count, take top 20
    const sorted = Array.from(specMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([name]) => name);

    return ["All Specialties", ...sorted];
  }, [providers]);

  // Build dynamic city list from actual data
  const cities = useMemo(() => {
    const cityMap = new Map<string, number>();
    providers.forEach((p) => {
      if (p.city) {
        cityMap.set(p.city, (cityMap.get(p.city) || 0) + 1);
      }
    });

    // Sort by count, take top 30
    return Array.from(cityMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30)
      .map(([name]) => name);
  }, [providers]);

  // Build language list from actual data
  const allLanguages = useMemo(() => {
    const langSet = new Set<string>();
    providers.forEach((p) => {
      p.languages.forEach((lang) => langSet.add(lang));
    });
    return ["Any", ...Array.from(langSet).sort()];
  }, [providers]);

  // Filter and sort providers
  const filteredProviders = useMemo(() => {
    let result = [...providers];

    // Filter by search term (name, specialty, NPI)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.specialty.toLowerCase().includes(term) ||
          p.npi.includes(term) ||
          p.subspecialties.some((s) => s.toLowerCase().includes(term))
      );
    }

    // Filter by specialty
    if (specialty !== "All Specialties") {
      result = result.filter(
        (p) => normalizeSpecialty(p.specialty) === specialty
      );
    }

    // Filter by location
    if (location) {
      const loc = location.toLowerCase();
      result = result.filter(
        (p) =>
          p.city.toLowerCase().includes(loc) ||
          p.state.toLowerCase().includes(loc) ||
          p.zip.includes(loc) ||
          p.address.toLowerCase().includes(loc)
      );
    }

    // Filter by accepting new patients
    if (acceptingOnly) {
      result = result.filter((p) => p.accepting);
    }

    // Filter by telehealth
    if (telehealthOnly) {
      result = result.filter((p) => p.telehealth);
    }

    // Filter by gender
    if (genderFilter !== "Any") {
      result = result.filter(
        (p) => p.gender.toLowerCase() === genderFilter.toLowerCase()
      );
    }

    // Filter by language
    if (languageFilter !== "Any") {
      result = result.filter((p) => p.languages.includes(languageFilter));
    }

    // Sort
    switch (sortBy) {
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "specialty":
        result.sort((a, b) => a.specialty.localeCompare(b.specialty));
        break;
      case "city":
        result.sort((a, b) => a.city.localeCompare(b.city));
        break;
    }

    return result;
  }, [
    providers,
    searchTerm,
    location,
    specialty,
    acceptingOnly,
    telehealthOnly,
    genderFilter,
    languageFilter,
    sortBy,
  ]);

  // Paginated providers
  const paginatedProviders = useMemo(() => {
    const start = (currentPage - 1) * providersPerPage;
    return filteredProviders.slice(start, start + providersPerPage);
  }, [filteredProviders, currentPage]);

  const totalPages = Math.ceil(filteredProviders.length / providersPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, location, specialty, acceptingOnly, telehealthOnly, genderFilter, languageFilter]);

  const clearFilters = () => {
    setSearchTerm("");
    setLocation("");
    setSpecialty("All Specialties");
    setAcceptingOnly(false);
    setTelehealthOnly(false);
    setGenderFilter("Any");
    setLanguageFilter("Any");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MarketingHeader />

      {/* Search Header */}
      <section className="bg-gradient-to-br from-teal-600 to-cyan-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">Find a Provider</h1>
          <p className="text-teal-100 mb-6">
            Search our network of {providers.length.toLocaleString()} providers across Arizona
          </p>

          <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative md:col-span-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Name, specialty, or NPI"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="City or ZIP"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900"
                  list="city-suggestions"
                />
                <datalist id="city-suggestions">
                  {cities.slice(0, 10).map((city) => (
                    <option key={city} value={city} />
                  ))}
                </datalist>
              </div>
              <div className="relative">
                <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 appearance-none"
                >
                  {specialties.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors">
                <Search className="w-5 h-5" />
                Search
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                  showFilters
                    ? "border-teal-600 bg-teal-50 text-teal-600"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <button
                onClick={() => setAcceptingOnly(!acceptingOnly)}
                className={`px-4 py-2 border rounded-lg transition-colors ${
                  acceptingOnly
                    ? "border-teal-600 bg-teal-50 text-teal-600"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Accepting New Patients
              </button>
            </div>

            {/* Extended Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200 grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={genderFilter}
                    onChange={(e) => setGenderFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700"
                  >
                    <option>Any</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language
                  </label>
                  <select
                    value={languageFilter}
                    onChange={(e) => setLanguageFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700"
                  >
                    {allLanguages.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700"
                  >
                    <option value="name">Name</option>
                    <option value="specialty">Specialty</option>
                    <option value="city">City</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-teal-600 animate-spin mb-4" />
              <p className="text-gray-600">Loading providers...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-red-700">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 text-red-600 font-medium hover:underline"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Results */}
          {!isLoading && !error && (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  Showing{" "}
                  <span className="font-semibold">
                    {paginatedProviders.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold">
                    {filteredProviders.length.toLocaleString()}
                  </span>{" "}
                  providers
                  {location && <span> near {location}</span>}
                  {specialty !== "All Specialties" && (
                    <span> in {specialty}</span>
                  )}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700"
                  >
                    <option value="name">Name</option>
                    <option value="specialty">Specialty</option>
                    <option value="city">City</option>
                  </select>
                </div>
              </div>

              {filteredProviders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No providers found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search criteria or filters.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="text-teal-600 font-medium hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid lg:grid-cols-2 gap-4">
                    {paginatedProviders.map((provider, i) => (
                      <motion.div
                        key={provider.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.02 }}
                        onClick={() => setSelectedProvider(provider)}
                        className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-teal-300 transition-all cursor-pointer"
                      >
                        <div className="flex gap-4">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center flex-shrink-0">
                            <User className="w-7 h-7 text-teal-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-bold text-gray-900 truncate">
                                  {provider.name}
                                  {provider.credentials && (
                                    <span className="font-normal text-gray-500">
                                      , {provider.credentials}
                                    </span>
                                  )}
                                </h3>
                                <p className="text-teal-600 text-sm">
                                  {provider.specialty}
                                </p>
                              </div>
                              {provider.accepting && (
                                <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Accepting
                                </span>
                              )}
                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" />
                                {provider.city}, {provider.state}
                              </span>
                              {provider.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3.5 h-3.5" />
                                  {provider.phone}
                                </span>
                              )}
                            </div>

                            {provider.languages.length > 0 && (
                              <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                                <Languages className="w-3.5 h-3.5" />
                                {provider.languages.slice(0, 3).join(", ")}
                                {provider.languages.length > 3 && (
                                  <span>
                                    +{provider.languages.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>

                      <div className="flex items-center gap-1">
                        {currentPage > 3 && (
                          <>
                            <button
                              onClick={() => setCurrentPage(1)}
                              className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                              1
                            </button>
                            {currentPage > 4 && (
                              <span className="px-2 text-gray-400">...</span>
                            )}
                          </>
                        )}

                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let page: number;
                          if (totalPages <= 5) {
                            page = i + 1;
                          } else if (currentPage <= 3) {
                            page = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            page = totalPages - 4 + i;
                          } else {
                            page = currentPage - 2 + i;
                          }

                          if (page < 1 || page > totalPages) return null;

                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-2 border rounded-lg ${
                                currentPage === page
                                  ? "border-teal-600 bg-teal-50 text-teal-600 font-medium"
                                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}

                        {currentPage < totalPages - 2 && totalPages > 5 && (
                          <>
                            {currentPage < totalPages - 3 && (
                              <span className="px-2 text-gray-400">...</span>
                            )}
                            <button
                              onClick={() => setCurrentPage(totalPages)}
                              className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                              {totalPages}
                            </button>
                          </>
                        )}
                      </div>

                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </section>

      {/* Provider Detail Modal */}
      <AnimatePresence>
        {selectedProvider && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProvider(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-br from-teal-600 to-cyan-700 text-white p-6 rounded-t-2xl">
                <button
                  onClick={() => setSelectedProvider(null)}
                  className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {selectedProvider.name}
                      {selectedProvider.credentials && (
                        <span className="font-normal opacity-80">
                          , {selectedProvider.credentials}
                        </span>
                      )}
                    </h2>
                    <p className="text-teal-100 text-lg">
                      {selectedProvider.specialty}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-sm">
                        <Shield className="w-4 h-4" />
                        {selectedProvider.networkStatus}
                      </span>
                      {selectedProvider.accepting && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/30 rounded-full text-sm">
                          <CheckCircle2 className="w-4 h-4" />
                          Accepting Patients
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Contact Info */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Contact Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    {selectedProvider.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-gray-900">
                            {selectedProvider.address}
                          </p>
                          <p className="text-gray-500">
                            {selectedProvider.city}, {selectedProvider.state}{" "}
                            {selectedProvider.zip}
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedProvider.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <a
                          href={`tel:${selectedProvider.phone}`}
                          className="text-teal-600 hover:underline"
                        >
                          {selectedProvider.phone}
                        </a>
                      </div>
                    )}
                    {selectedProvider.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <a
                          href={`mailto:${selectedProvider.email}`}
                          className="text-teal-600 hover:underline"
                        >
                          {selectedProvider.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Provider Details
                    </h3>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-500">NPI</dt>
                        <dd className="text-gray-900 font-mono">
                          {selectedProvider.npi}
                        </dd>
                      </div>
                      {selectedProvider.gender && (
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Gender</dt>
                          <dd className="text-gray-900">
                            {selectedProvider.gender}
                          </dd>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Network</dt>
                        <dd className="text-gray-900">Arizona Antidote</dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Languages
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProvider.languages.map((lang) => (
                        <span
                          key={lang}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Subspecialties */}
                {selectedProvider.subspecialties.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Additional Specialties
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProvider.subspecialties.map((sub) => (
                        <span
                          key={sub}
                          className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-4 border-t border-gray-200 flex flex-wrap gap-3">
                  {selectedProvider.phone && (
                    <a
                      href={`tel:${selectedProvider.phone}`}
                      className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Call Office
                    </a>
                  )}
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Calendar className="w-4 h-4" />
                    Request Appointment
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Printer className="w-4 h-4" />
                    Print
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <MarketingFooter />
    </div>
  );
}
