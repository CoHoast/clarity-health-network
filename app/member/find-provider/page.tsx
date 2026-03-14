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

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM"
];

const visitTypes = [
  { id: "office", label: "Office Visit", description: "In-person appointment" },
  { id: "telehealth", label: "Telehealth", description: "Video call from home" },
  { id: "wellness", label: "Annual Wellness", description: "Preventive care checkup" },
  { id: "followup", label: "Follow-up", description: "Continue previous treatment" },
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
  const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");
  const [favorites, setFavorites] = useState<number[]>([1, 5]); // Pre-populate with a couple favorites for demo
  
  const toggleFavorite = (providerId: number) => {
    setFavorites(prev => 
      prev.includes(providerId) 
        ? prev.filter(id => id !== providerId)
        : [...prev, providerId]
    );
  };
  
  // Booking modal state
  const [bookingProvider, setBookingProvider] = useState<typeof providers[0] | null>(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedVisitType, setSelectedVisitType] = useState("");
  const [bookingReason, setBookingReason] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleBookAppointment = (provider: typeof providers[0]) => {
    setBookingProvider(provider);
    setBookingStep(1);
    setSelectedDate("");
    setSelectedTime("");
    setSelectedVisitType("");
    setBookingReason("");
    setBookingSuccess(false);
  };

  const handleConfirmBooking = () => {
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingProvider(null);
      setBookingSuccess(false);
    }, 3000);
  };

  // Generate next 14 days for date selection
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Skip Sundays
      if (date.getDay() !== 0) {
        dates.push(date);
      }
    }
    return dates;
  };

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
      const matchesFavorites = activeTab === "all" || favorites.includes(provider.id);
      return matchesSearch && matchesSpecialty && matchesAccepting && matchesTelehealth && matchesFavorites;
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
  }, [searchQuery, specialty, acceptingNew, telehealthOnly, sortBy, activeTab, favorites]);

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
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          {/* Location */}
          <div className="relative w-full md:w-64">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cleveland, OH"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
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
              className="appearance-none pl-4 pr-10 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
                ? "bg-teal-100 text-cyan-700 border border-teal-200"
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
                ? "bg-teal-100 text-cyan-700 border border-teal-200"
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
              className="appearance-none pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
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

      {/* Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "all"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            All Providers
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === "favorites"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Heart className={`w-4 h-4 ${activeTab === "favorites" ? "fill-red-500 text-red-500" : ""}`} />
            Favorites ({favorites.length})
          </button>
        </div>
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
                    <p className="text-cyan-600 font-medium">{provider.specialty}</p>
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
                  <button 
                    onClick={() => handleBookAppointment(provider)}
                    className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Book Appointment
                  </button>
                  <button 
                    onClick={() => window.open(`tel:+12165550${100 + provider.id}`, '_self')}
                    className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </button>
                  <button
                    onClick={() => setSelectedProvider(provider)}
                    className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    View Profile
                  </button>
                  <button 
                    onClick={() => toggleFavorite(provider.id)}
                    className={`p-2 bg-white border rounded-lg transition-colors ${
                      favorites.includes(provider.id)
                        ? "border-red-200 text-red-500"
                        : "border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${favorites.includes(provider.id) ? "fill-red-500" : ""}`} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProviders.length === 0 && activeTab === "favorites" && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-900 font-medium mb-1">No favorite providers yet</p>
          <p className="text-gray-500 mb-4">Click the heart icon on any provider to add them to your favorites</p>
          <button
            onClick={() => setActiveTab("all")}
            className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
          >
            Browse All Providers
          </button>
        </div>
      )}

      {filteredProviders.length === 0 && activeTab === "all" && (
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
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                <button
                  onClick={() => toggleFavorite(selectedProvider.id)}
                  className={`p-2 rounded-full transition-colors ${
                    favorites.includes(selectedProvider.id)
                      ? "bg-red-500 text-white"
                      : "bg-white/80 hover:bg-white text-gray-600"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${favorites.includes(selectedProvider.id) ? "fill-white" : ""}`} />
                </button>
                <button
                  onClick={() => setSelectedProvider(null)}
                  className="p-2 bg-white/80 rounded-full hover:bg-white"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="bg-gradient-to-br from-cyan-400 to-teal-600 p-6 text-center">
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
                  <p className="text-cyan-600 font-medium">{selectedProvider.nextAvailable}</p>
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
                <span className="px-3 py-1.5 bg-teal-50 text-cyan-700 text-sm font-medium rounded-lg flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> In-Network
                </span>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
              <button 
                onClick={() => {
                  setSelectedProvider(null);
                  handleBookAppointment(selectedProvider);
                }}
                className="flex-1 px-4 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Book Appointment
              </button>
              <button 
                onClick={() => window.open(`tel:+12165550${100 + selectedProvider.id}`, '_self')}
                className="px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Phone className="w-5 h-5" />
              </button>
              <button 
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedProvider.address + ' ' + selectedProvider.city)}`, '_blank')}
                className="px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Navigation className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Booking Modal */}
      {bookingProvider && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setBookingProvider(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {bookingSuccess ? (
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Appointment Booked!</h3>
                <p className="text-gray-600 mb-4">
                  Your appointment with {bookingProvider.name} has been confirmed.
                </p>
                <div className="bg-gray-50 rounded-xl p-4 text-left mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="w-5 h-5 text-cyan-600" />
                    <span className="font-medium text-gray-900">
                      {selectedDate && new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="w-5 h-5 text-cyan-600" />
                    <span className="font-medium text-gray-900">{selectedTime}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-cyan-600" />
                    <span className="text-gray-600">{bookingProvider.practice}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">A confirmation email has been sent to your inbox.</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">Book Appointment</h3>
                    <p className="text-sm text-gray-500">Step {bookingStep} of 3</p>
                  </div>
                  <button
                    onClick={() => setBookingProvider(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Provider Summary */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center gap-4">
                    <img
                      src={bookingProvider.image}
                      alt={bookingProvider.name}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{bookingProvider.name}</h4>
                      <p className="text-sm text-cyan-600">{bookingProvider.specialty}</p>
                      <p className="text-sm text-gray-500">{bookingProvider.practice}</p>
                    </div>
                  </div>
                </div>

                {/* Step Content */}
                <div className="p-6">
                  {/* Step 1: Select Date */}
                  {bookingStep === 1 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Select a Date</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {getAvailableDates().map((date) => {
                          const dateStr = date.toISOString().split('T')[0];
                          const isSelected = selectedDate === dateStr;
                          return (
                            <button
                              key={dateStr}
                              onClick={() => setSelectedDate(dateStr)}
                              className={`p-3 rounded-xl text-center transition-colors ${
                                isSelected
                                  ? "bg-teal-600 text-white"
                                  : "bg-gray-50 hover:bg-gray-100 text-gray-900"
                              }`}
                            >
                              <div className="text-xs uppercase tracking-wide opacity-70">
                                {date.toLocaleDateString('en-US', { weekday: 'short' })}
                              </div>
                              <div className="text-lg font-semibold">
                                {date.getDate()}
                              </div>
                              <div className="text-xs opacity-70">
                                {date.toLocaleDateString('en-US', { month: 'short' })}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Select Time & Visit Type */}
                  {bookingStep === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Select a Time</h4>
                        <div className="grid grid-cols-4 gap-2">
                          {timeSlots.map((time) => {
                            const isSelected = selectedTime === time;
                            // Randomly disable some times for realism
                            const isDisabled = time === "11:00 AM" || time === "2:30 PM";
                            return (
                              <button
                                key={time}
                                onClick={() => !isDisabled && setSelectedTime(time)}
                                disabled={isDisabled}
                                className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                                  isDisabled
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : isSelected
                                    ? "bg-teal-600 text-white"
                                    : "bg-gray-50 hover:bg-gray-100 text-gray-900"
                                }`}
                              >
                                {time}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Visit Type</h4>
                        <div className="space-y-2">
                          {visitTypes.map((type) => {
                            const isSelected = selectedVisitType === type.id;
                            const isDisabled = type.id === "telehealth" && !bookingProvider.telehealth;
                            return (
                              <button
                                key={type.id}
                                onClick={() => !isDisabled && setSelectedVisitType(type.id)}
                                disabled={isDisabled}
                                className={`w-full p-4 rounded-xl text-left transition-colors flex items-center gap-4 ${
                                  isDisabled
                                    ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                                    : isSelected
                                    ? "bg-teal-50 border-2 border-teal-500"
                                    : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                                }`}
                              >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                  isSelected ? "bg-teal-100" : "bg-white"
                                }`}>
                                  {type.id === "telehealth" ? (
                                    <Video className={`w-5 h-5 ${isSelected ? "text-cyan-600" : "text-gray-500"}`} />
                                  ) : type.id === "wellness" ? (
                                    <Heart className={`w-5 h-5 ${isSelected ? "text-cyan-600" : "text-gray-500"}`} />
                                  ) : (
                                    <User className={`w-5 h-5 ${isSelected ? "text-cyan-600" : "text-gray-500"}`} />
                                  )}
                                </div>
                                <div>
                                  <p className={`font-medium ${isDisabled ? "text-gray-400" : "text-gray-900"}`}>
                                    {type.label}
                                  </p>
                                  <p className={`text-sm ${isDisabled ? "text-gray-300" : "text-gray-500"}`}>
                                    {isDisabled ? "Not available for this provider" : type.description}
                                  </p>
                                </div>
                                {isSelected && (
                                  <CheckCircle2 className="w-5 h-5 text-cyan-600 ml-auto" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Reason & Confirm */}
                  {bookingStep === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Reason for Visit</h4>
                        <textarea
                          value={bookingReason}
                          onChange={(e) => setBookingReason(e.target.value)}
                          placeholder="Briefly describe your symptoms or reason for the appointment..."
                          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                          rows={3}
                        />
                      </div>

                      {/* Appointment Summary */}
                      <div className="bg-teal-50 rounded-xl p-4">
                        <h4 className="font-medium text-teal-900 mb-3">Appointment Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-cyan-700">Date:</span>
                            <span className="font-medium text-teal-900">
                              {selectedDate && new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-cyan-700">Time:</span>
                            <span className="font-medium text-teal-900">{selectedTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-cyan-700">Visit Type:</span>
                            <span className="font-medium text-teal-900">
                              {visitTypes.find(t => t.id === selectedVisitType)?.label}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-cyan-700">Estimated Copay:</span>
                            <span className="font-medium text-teal-900">$25</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                        <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-amber-900">Cancellation Policy</p>
                          <p className="text-amber-700">Please cancel at least 24 hours in advance to avoid a $25 cancellation fee.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
                  {bookingStep > 1 && (
                    <button
                      onClick={() => setBookingStep(bookingStep - 1)}
                      className="px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Back
                    </button>
                  )}
                  <button
                    onClick={() => setBookingProvider(null)}
                    className="px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <div className="flex-1" />
                  {bookingStep < 3 ? (
                    <button
                      onClick={() => setBookingStep(bookingStep + 1)}
                      disabled={(bookingStep === 1 && !selectedDate) || (bookingStep === 2 && (!selectedTime || !selectedVisitType))}
                      className="px-6 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      onClick={handleConfirmBooking}
                      className="px-6 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
                    >
                      Confirm Booking
                    </button>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
