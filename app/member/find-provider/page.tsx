"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Star,
  Phone,
  Calendar,
  Clock,
  Filter,
  ChevronDown,
  Heart,
  Video,
  CheckCircle2,
  Navigation,
  Building2,
  User,
  X,
  SlidersHorizontal,
  Map,
  List,
} from "lucide-react";

const specialties = [
  "All Specialties",
  "Primary Care",
  "Internal Medicine",
  "Family Medicine",
  "Pediatrics",
  "OB/GYN",
  "Cardiology",
  "Dermatology",
  "Orthopedics",
  "Neurology",
  "Psychiatry",
  "Ophthalmology",
  "ENT",
  "Urgent Care",
];

const providers = [
  {
    id: 1,
    name: "Dr. Sarah Chen, MD",
    specialty: "Primary Care",
    practice: "Cleveland Family Medicine",
    address: "1234 Health Way, Suite 100",
    city: "Cleveland",
    distance: "0.8 mi",
    rating: 4.9,
    reviews: 245,
    acceptingNew: true,
    telehealth: true,
    nextAvailable: "Tomorrow",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop",
    languages: ["English", "Mandarin"],
    education: "Stanford Medical School",
    insuranceAccepted: true,
  },
  {
    id: 2,
    name: "Dr. Michael Roberts, MD",
    specialty: "Primary Care",
    practice: "Westside Medical Group",
    address: "5678 Wellness Blvd",
    city: "Cleveland",
    distance: "1.2 mi",
    rating: 4.8,
    reviews: 189,
    acceptingNew: true,
    telehealth: true,
    nextAvailable: "Today",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop",
    languages: ["English", "Spanish"],
    education: "Johns Hopkins",
    insuranceAccepted: true,
  },
  {
    id: 3,
    name: "Dr. Emily Watson, MD",
    specialty: "Dermatology",
    practice: "Skin Health Specialists",
    address: "910 Medical Plaza Dr",
    city: "Cleveland",
    distance: "2.1 mi",
    rating: 4.9,
    reviews: 312,
    acceptingNew: false,
    telehealth: true,
    nextAvailable: "Mar 25",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&h=150&fit=crop",
    languages: ["English"],
    education: "Harvard Medical School",
    insuranceAccepted: true,
  },
  {
    id: 4,
    name: "Dr. James Wilson, DO",
    specialty: "Family Medicine",
    practice: "Family Care Partners",
    address: "2468 Care Center Way",
    city: "Lakewood",
    distance: "3.5 mi",
    rating: 4.7,
    reviews: 156,
    acceptingNew: true,
    telehealth: false,
    nextAvailable: "Mar 20",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&h=150&fit=crop",
    languages: ["English"],
    education: "Ohio University",
    insuranceAccepted: true,
  },
  {
    id: 5,
    name: "Dr. Lisa Park, MD",
    specialty: "Cardiology",
    practice: "Heart & Vascular Institute",
    address: "3579 Cardio Center Dr",
    city: "Cleveland",
    distance: "4.2 mi",
    rating: 4.9,
    reviews: 278,
    acceptingNew: true,
    telehealth: true,
    nextAvailable: "Mar 22",
    image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=150&h=150&fit=crop",
    languages: ["English", "Korean"],
    education: "Yale School of Medicine",
    insuranceAccepted: true,
  },
  {
    id: 6,
    name: "Dr. Robert Garcia, MD",
    specialty: "Orthopedics",
    practice: "Cleveland Bone & Joint",
    address: "1357 Ortho Way",
    city: "Cleveland",
    distance: "5.0 mi",
    rating: 4.8,
    reviews: 203,
    acceptingNew: true,
    telehealth: false,
    nextAvailable: "Mar 21",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop",
    languages: ["English", "Spanish"],
    education: "UCLA Medical School",
    insuranceAccepted: true,
  },
];

export default function FindProviderPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [specialty, setSpecialty] = useState("All Specialties");
  const [acceptingNew, setAcceptingNew] = useState(false);
  const [telehealthOnly, setTelehealthOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [selectedProvider, setSelectedProvider] = useState<typeof providers[0] | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("distance");

  const filteredProviders = useMemo(() => {
    let results = providers.filter((provider) => {
      const matchesSearch =
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.practice.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpecialty =
        specialty === "All Specialties" || provider.specialty === specialty;
      const matchesAccepting = !acceptingNew || provider.acceptingNew;
      const matchesTelehealth = !telehealthOnly || provider.telehealth;
      return matchesSearch && matchesSpecialty && matchesAccepting && matchesTelehealth;
    });

    // Sort
    results.sort((a, b) => {
      if (sortBy === "distance") {
        return parseFloat(a.distance) - parseFloat(b.distance);
      } else if (sortBy === "rating") {
        return b.rating - a.rating;
      } else if (sortBy === "availability") {
        return a.nextAvailable === "Today" ? -1 : b.nextAvailable === "Today" ? 1 : 0;
      }
      return 0;
    });

    return results;
  }, [searchQuery, specialty, acceptingNew, telehealthOnly, sortBy]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Find a Provider</h1>
        <p className="text-gray-500 mt-1">Search our network of 50,000+ healthcare providers</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, specialty, or practice..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Location */}
          <div className="relative w-full md:w-64">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cleveland, OH"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Search Button */}
          <button className="px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors">
            Search
          </button>
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Specialty Select */}
          <div className="relative">
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {specialties.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Toggle Filters */}
          <button
            onClick={() => setAcceptingNew(!acceptingNew)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              acceptingNew
                ? "bg-teal-100 text-teal-700 border border-teal-200"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <CheckCircle2 className="w-4 h-4 inline mr-1.5" />
            Accepting New
          </button>

          <button
            onClick={() => setTelehealthOnly(!telehealthOnly)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              telehealthOnly
                ? "bg-teal-100 text-teal-700 border border-teal-200"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Video className="w-4 h-4 inline mr-1.5" />
            Telehealth
          </button>

          <div className="flex-1" />

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="distance">Distance</option>
              <option value="rating">Rating</option>
              <option value="availability">Availability</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}
            >
              <List className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`p-2 rounded ${viewMode === "map" ? "bg-white shadow-sm" : ""}`}
            >
              <Map className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-900">{filteredProviders.length}</span> providers
        </p>
      </div>

      {/* Provider List */}
      <div className="grid gap-4">
        {filteredProviders.map((provider) => (
          <motion.div
            key={provider.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Photo */}
              <img
                src={provider.image}
                alt={provider.name}
                className="w-24 h-24 rounded-xl object-cover shrink-0"
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{provider.name}</h3>
                    <p className="text-teal-600 font-medium">{provider.specialty}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {provider.acceptingNew && (
                      <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                        Accepting New
                      </span>
                    )}
                    {provider.telehealth && (
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full flex items-center gap-1">
                        <Video className="w-3 h-3" /> Telehealth
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-gray-600 mb-2">{provider.practice}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {provider.distance} • {provider.city}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    {provider.rating} ({provider.reviews} reviews)
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Next: {provider.nextAvailable}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <button className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Book Appointment
                  </button>
                  <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Call
                  </button>
                  <button
                    onClick={() => setSelectedProvider(provider)}
                    className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    View Profile
                  </button>
                  <button className="p-2 bg-white border border-gray-200 text-gray-400 rounded-lg hover:text-red-500 hover:border-red-200 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProviders.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No providers found matching your criteria</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
        </div>
      )}

      {/* Provider Detail Modal */}
      {selectedProvider && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedProvider(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <button
                onClick={() => setSelectedProvider(null)}
                className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white z-10"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
              <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-6 text-center">
                <img
                  src={selectedProvider.image}
                  alt={selectedProvider.name}
                  className="w-24 h-24 rounded-full border-4 border-white mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-bold text-white">{selectedProvider.name}</h3>
                <p className="text-teal-100">{selectedProvider.specialty}</p>
                <div className="flex items-center justify-center gap-1 mt-2 text-white">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{selectedProvider.rating}</span>
                  <span className="text-teal-100">({selectedProvider.reviews} reviews)</span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Practice */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Practice</h4>
                <p className="font-medium text-gray-900">{selectedProvider.practice}</p>
                <p className="text-gray-600">{selectedProvider.address}</p>
                <p className="text-gray-600">{selectedProvider.city}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Distance</h4>
                  <p className="text-gray-900">{selectedProvider.distance}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Next Available</h4>
                  <p className="text-teal-600 font-medium">{selectedProvider.nextAvailable}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Languages</h4>
                  <p className="text-gray-900">{selectedProvider.languages.join(", ")}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Education</h4>
                  <p className="text-gray-900">{selectedProvider.education}</p>
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-2">
                {selectedProvider.acceptingNew && (
                  <span className="px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-lg flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Accepting New Patients
                  </span>
                )}
                {selectedProvider.telehealth && (
                  <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg flex items-center gap-1">
                    <Video className="w-4 h-4" /> Telehealth Available
                  </span>
                )}
                <span className="px-3 py-1.5 bg-teal-50 text-teal-700 text-sm font-medium rounded-lg flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> In-Network
                </span>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
              <button className="flex-1 px-4 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2">
                <Calendar className="w-5 h-5" />
                Book Appointment
              </button>
              <button className="px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                <Phone className="w-5 h-5" />
              </button>
              <button className="px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                <Navigation className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
