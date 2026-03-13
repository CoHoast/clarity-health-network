"use client";

import { useState, useMemo } from "react";
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
} from "lucide-react";

// Extended provider data with full profiles (18 providers)
const providers = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    credentials: "MD, FAAFP",
    specialty: "Family Medicine",
    subspecialties: ["Preventive Care", "Women's Health", "Geriatrics"],
    gender: "Female",
    languages: ["English", "Spanish"],
    yearsExperience: 15,
    address: "1234 Health Way, Suite 100",
    city: "Cleveland",
    state: "OH",
    zip: "44101",
    phone: "(216) 555-0123",
    fax: "(216) 555-0124",
    email: "sjohnson@clevelandmedical.com",
    rating: 4.9,
    reviews: 127,
    accepting: true,
    nextAvailable: "Tomorrow, 9:00 AM",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
    distance: "0.8 mi",
    telehealth: true,
    npi: "1234567890",
    practiceName: "Cleveland Family Medical Center",
    officeHours: {
      monday: "8:00 AM - 5:00 PM",
      tuesday: "8:00 AM - 5:00 PM",
      wednesday: "8:00 AM - 5:00 PM",
      thursday: "8:00 AM - 7:00 PM",
      friday: "8:00 AM - 3:00 PM",
      saturday: "Closed",
      sunday: "Closed",
    },
    education: [
      { type: "Medical School", name: "Johns Hopkins University School of Medicine", year: "2006" },
      { type: "Residency", name: "Cleveland Clinic - Family Medicine", year: "2009" },
    ],
    certifications: [
      { name: "American Board of Family Medicine", status: "Board Certified", expiry: "2027" },
    ],
    hospitalAffiliations: ["Cleveland Clinic Main Campus", "University Hospitals Cleveland Medical Center"],
    conditionsTreated: ["Diabetes", "Hypertension", "Asthma", "Thyroid Disorders", "Anxiety", "Depression"],
    proceduresPerformed: ["Annual Physicals", "Immunizations", "Minor Procedures", "Joint Injections"],
    bio: "Dr. Sarah Johnson is a board-certified family medicine physician with over 15 years of experience providing comprehensive primary care.",
    patientReviews: [
      { rating: 5, date: "Feb 2026", title: "Excellent doctor!", text: "Dr. Johnson is incredibly thorough and takes time to listen.", author: "Sarah M.", waitTime: "Under 15 min", bedsideManner: 5 },
      { rating: 5, date: "Jan 2026", title: "Highly recommend", text: "Best doctor I've ever had. Always follows up.", author: "Michael R.", waitTime: "15-30 min", bedsideManner: 5 },
    ],
    networkStatus: "In-Network",
    memberSince: "2015",
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    credentials: "MD, FACP",
    specialty: "Internal Medicine",
    subspecialties: ["Diabetes Management", "Cardiovascular Prevention"],
    gender: "Male",
    languages: ["English", "Mandarin", "Cantonese"],
    yearsExperience: 12,
    address: "5678 Wellness Blvd",
    city: "Cleveland",
    state: "OH",
    zip: "44102",
    phone: "(216) 555-0456",
    fax: "(216) 555-0457",
    email: "mchen@ohiohealth.com",
    rating: 4.8,
    reviews: 94,
    accepting: true,
    nextAvailable: "Today, 2:30 PM",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
    distance: "1.2 mi",
    telehealth: true,
    npi: "2345678901",
    practiceName: "Ohio Internal Medicine Associates",
    officeHours: {
      monday: "7:30 AM - 5:00 PM",
      tuesday: "7:30 AM - 5:00 PM",
      wednesday: "7:30 AM - 5:00 PM",
      thursday: "7:30 AM - 5:00 PM",
      friday: "7:30 AM - 4:00 PM",
      saturday: "9:00 AM - 12:00 PM",
      sunday: "Closed",
    },
    education: [
      { type: "Medical School", name: "Stanford University School of Medicine", year: "2010" },
      { type: "Residency", name: "UCSF Medical Center - Internal Medicine", year: "2013" },
    ],
    certifications: [
      { name: "American Board of Internal Medicine", status: "Board Certified", expiry: "2028" },
    ],
    hospitalAffiliations: ["MetroHealth Medical Center", "Cleveland Clinic Fairview Hospital"],
    conditionsTreated: ["Type 2 Diabetes", "Hypertension", "High Cholesterol", "Obesity", "Heart Disease Prevention"],
    proceduresPerformed: ["Comprehensive Physical Exams", "Diabetes Management", "Cardiovascular Risk Assessment"],
    bio: "Dr. Michael Chen is an internist specializing in adult primary care with a focus on diabetes management.",
    patientReviews: [
      { rating: 5, date: "Feb 2026", title: "Amazing doctor", text: "Dr. Chen helped me get my diabetes under control.", author: "David K.", waitTime: "Under 15 min", bedsideManner: 5 },
    ],
    networkStatus: "In-Network",
    memberSince: "2018",
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    credentials: "MD, FAAP",
    specialty: "Pediatrics",
    subspecialties: ["Newborn Care", "Adolescent Medicine", "Developmental Pediatrics"],
    gender: "Female",
    languages: ["English", "Spanish", "Portuguese"],
    yearsExperience: 10,
    address: "9012 Care Center Dr",
    city: "Cleveland",
    state: "OH",
    zip: "44103",
    phone: "(216) 555-0789",
    fax: "(216) 555-0790",
    email: "erodriguez@kidshealth.com",
    rating: 4.9,
    reviews: 156,
    accepting: true,
    nextAvailable: "Wed, Mar 15",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
    distance: "2.1 mi",
    telehealth: true,
    npi: "3456789012",
    practiceName: "Cleveland Pediatric Partners",
    officeHours: {
      monday: "8:00 AM - 6:00 PM",
      tuesday: "8:00 AM - 6:00 PM",
      wednesday: "8:00 AM - 6:00 PM",
      thursday: "8:00 AM - 6:00 PM",
      friday: "8:00 AM - 5:00 PM",
      saturday: "8:00 AM - 12:00 PM",
      sunday: "Closed",
    },
    education: [
      { type: "Medical School", name: "University of Pennsylvania Perelman School of Medicine", year: "2012" },
      { type: "Residency", name: "Children's Hospital of Philadelphia - Pediatrics", year: "2015" },
    ],
    certifications: [
      { name: "American Board of Pediatrics", status: "Board Certified", expiry: "2028" },
    ],
    hospitalAffiliations: ["Cleveland Clinic Children's", "Rainbow Babies & Children's Hospital"],
    conditionsTreated: ["Well-Child Care", "Asthma", "Allergies", "ADHD", "Ear Infections", "Childhood Obesity"],
    proceduresPerformed: ["Well-Child Visits", "Immunizations", "Developmental Screenings", "Sports Physicals"],
    bio: "Dr. Emily Rodriguez is a compassionate pediatrician dedicated to providing exceptional care for children.",
    patientReviews: [
      { rating: 5, date: "Mar 2026", title: "Best pediatrician ever!", text: "Dr. Rodriguez is wonderful with my kids.", author: "Amanda S.", waitTime: "Under 15 min", bedsideManner: 5 },
    ],
    networkStatus: "In-Network",
    memberSince: "2016",
  },
  {
    id: 4,
    name: "Cleveland General Hospital",
    credentials: "",
    specialty: "Hospital",
    subspecialties: ["Emergency Services", "Surgery", "Maternity", "Cardiology", "Oncology"],
    gender: "",
    languages: ["English", "Spanish", "ASL Interpreters Available"],
    yearsExperience: 75,
    address: "100 Medical Center Way",
    city: "Cleveland",
    state: "OH",
    zip: "44101",
    phone: "(216) 555-1000",
    fax: "(216) 555-1001",
    email: "info@clevelandgeneral.org",
    rating: 4.7,
    reviews: 312,
    accepting: true,
    nextAvailable: "24/7 ER",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=400&fit=crop",
    distance: "1.5 mi",
    telehealth: false,
    npi: "4567890123",
    practiceName: "Cleveland General Hospital",
    officeHours: {
      monday: "24 Hours",
      tuesday: "24 Hours",
      wednesday: "24 Hours",
      thursday: "24 Hours",
      friday: "24 Hours",
      saturday: "24 Hours",
      sunday: "24 Hours",
    },
    education: [],
    certifications: [
      { name: "The Joint Commission", status: "Accredited", expiry: "2027" },
      { name: "Level II Trauma Center", status: "Certified", expiry: "2026" },
    ],
    hospitalAffiliations: [],
    conditionsTreated: ["Emergency Care", "Cardiac Care", "Cancer Treatment", "Orthopedic Surgery"],
    proceduresPerformed: ["Emergency Surgery", "Heart Surgery", "Joint Replacement", "Cancer Surgery"],
    bio: "Cleveland General Hospital has been serving the community for over 75 years.",
    patientReviews: [
      { rating: 5, date: "Feb 2026", title: "Excellent emergency care", text: "The ER staff was incredible.", author: "Robert M.", waitTime: "30-45 min", bedsideManner: 5 },
    ],
    networkStatus: "In-Network",
    memberSince: "2010",
  },
  {
    id: 5,
    name: "Dr. James Williams",
    credentials: "DO, FAOAO",
    specialty: "Orthopedics",
    subspecialties: ["Sports Medicine", "Joint Replacement", "Spine Care"],
    gender: "Male",
    languages: ["English"],
    yearsExperience: 18,
    address: "456 Bone & Joint Center",
    city: "Cleveland",
    state: "OH",
    zip: "44104",
    phone: "(216) 555-2345",
    fax: "(216) 555-2346",
    email: "jwilliams@clevelandortho.com",
    rating: 4.8,
    reviews: 88,
    accepting: true,
    nextAvailable: "Thu, Mar 16",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop",
    distance: "3.4 mi",
    telehealth: true,
    npi: "5678901234",
    practiceName: "Cleveland Orthopedic & Sports Medicine",
    officeHours: {
      monday: "8:00 AM - 5:00 PM",
      tuesday: "8:00 AM - 5:00 PM",
      wednesday: "8:00 AM - 5:00 PM",
      thursday: "8:00 AM - 5:00 PM",
      friday: "8:00 AM - 4:00 PM",
      saturday: "Closed",
      sunday: "Closed",
    },
    education: [
      { type: "Medical School", name: "Ohio University Heritage College of Osteopathic Medicine", year: "2004" },
      { type: "Residency", name: "Cleveland Clinic - Orthopedic Surgery", year: "2009" },
    ],
    certifications: [
      { name: "American Osteopathic Board of Orthopedic Surgery", status: "Board Certified", expiry: "2027" },
    ],
    hospitalAffiliations: ["Cleveland Clinic", "University Hospitals Ahuja Medical Center"],
    conditionsTreated: ["ACL Injuries", "Rotator Cuff Tears", "Arthritis", "Fractures", "Herniated Discs"],
    proceduresPerformed: ["Knee Replacement", "Hip Replacement", "Arthroscopic Surgery", "ACL Reconstruction"],
    bio: "Dr. James Williams is a fellowship-trained orthopedic surgeon specializing in sports medicine.",
    patientReviews: [
      { rating: 5, date: "Feb 2026", title: "Saved my knee!", text: "Dr. Williams performed my ACL surgery and I'm back to playing basketball.", author: "Jason B.", waitTime: "Under 15 min", bedsideManner: 5 },
    ],
    networkStatus: "In-Network",
    memberSince: "2014",
  },
  {
    id: 6,
    name: "Dr. Lisa Patel",
    credentials: "MD, FACOG",
    specialty: "OB/GYN",
    subspecialties: ["High-Risk Pregnancy", "Minimally Invasive Surgery", "Menopause Management"],
    gender: "Female",
    languages: ["English", "Hindi", "Gujarati"],
    yearsExperience: 14,
    address: "789 Women's Health Pavilion",
    city: "Cleveland",
    state: "OH",
    zip: "44105",
    phone: "(216) 555-3456",
    fax: "(216) 555-3457",
    email: "lpatel@womenswellness.com",
    rating: 4.9,
    reviews: 203,
    accepting: true,
    nextAvailable: "Mon, Mar 18",
    image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop",
    distance: "2.8 mi",
    telehealth: true,
    npi: "6789012345",
    practiceName: "Women's Wellness Center of Cleveland",
    officeHours: {
      monday: "8:00 AM - 5:00 PM",
      tuesday: "8:00 AM - 5:00 PM",
      wednesday: "8:00 AM - 5:00 PM",
      thursday: "8:00 AM - 7:00 PM",
      friday: "8:00 AM - 4:00 PM",
      saturday: "By Appointment",
      sunday: "Closed",
    },
    education: [
      { type: "Medical School", name: "Case Western Reserve University School of Medicine", year: "2008" },
      { type: "Residency", name: "University Hospitals Cleveland - OB/GYN", year: "2012" },
    ],
    certifications: [
      { name: "American Board of Obstetrics and Gynecology", status: "Board Certified", expiry: "2028" },
    ],
    hospitalAffiliations: ["University Hospitals Cleveland Medical Center", "Cleveland Clinic Hillcrest Hospital"],
    conditionsTreated: ["Pregnancy Care", "Fibroids", "Endometriosis", "PCOS", "Menopause"],
    proceduresPerformed: ["Prenatal Care", "Labor & Delivery", "C-Sections", "Hysterectomy", "Laparoscopic Surgery"],
    bio: "Dr. Lisa Patel is a board-certified OB/GYN with expertise in high-risk obstetrics.",
    patientReviews: [
      { rating: 5, date: "Mar 2026", title: "Delivered my baby!", text: "Dr. Patel was with me through my entire pregnancy.", author: "Michelle K.", waitTime: "15-30 min", bedsideManner: 5 },
    ],
    networkStatus: "In-Network",
    memberSince: "2017",
  },
  {
    id: 7,
    name: "Dr. Robert Anderson",
    credentials: "MD, FACC",
    specialty: "Cardiology",
    subspecialties: ["Interventional Cardiology", "Heart Failure", "Preventive Cardiology"],
    gender: "Male",
    languages: ["English", "German"],
    yearsExperience: 22,
    address: "200 Heart Center Drive",
    city: "Cleveland",
    state: "OH",
    zip: "44106",
    phone: "(216) 555-4567",
    fax: "(216) 555-4568",
    email: "randerson@heartcenter.com",
    rating: 4.9,
    reviews: 178,
    accepting: true,
    nextAvailable: "Fri, Mar 17",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop",
    distance: "4.2 mi",
    telehealth: true,
    npi: "7890123456",
    practiceName: "Cleveland Heart & Vascular Institute",
    officeHours: {
      monday: "7:00 AM - 4:00 PM",
      tuesday: "7:00 AM - 4:00 PM",
      wednesday: "7:00 AM - 4:00 PM",
      thursday: "7:00 AM - 4:00 PM",
      friday: "7:00 AM - 3:00 PM",
      saturday: "Closed",
      sunday: "Closed",
    },
    education: [
      { type: "Medical School", name: "Harvard Medical School", year: "1999" },
      { type: "Residency", name: "Massachusetts General Hospital - Internal Medicine", year: "2002" },
      { type: "Fellowship", name: "Cleveland Clinic - Cardiology", year: "2005" },
    ],
    certifications: [
      { name: "American Board of Internal Medicine - Cardiovascular Disease", status: "Board Certified", expiry: "2027" },
      { name: "American Board of Internal Medicine - Interventional Cardiology", status: "Board Certified", expiry: "2027" },
    ],
    hospitalAffiliations: ["Cleveland Clinic", "University Hospitals"],
    conditionsTreated: ["Coronary Artery Disease", "Heart Failure", "Arrhythmia", "Hypertension", "Valve Disease"],
    proceduresPerformed: ["Cardiac Catheterization", "Angioplasty", "Stent Placement", "Echocardiogram"],
    bio: "Dr. Robert Anderson is a nationally recognized cardiologist with over 22 years of experience.",
    patientReviews: [
      { rating: 5, date: "Feb 2026", title: "Life saver", text: "Dr. Anderson caught a blockage that other doctors missed.", author: "William T.", waitTime: "15-30 min", bedsideManner: 5 },
    ],
    networkStatus: "In-Network",
    memberSince: "2012",
  },
  {
    id: 8,
    name: "Dr. Jennifer Kim",
    credentials: "MD, FAAD",
    specialty: "Dermatology",
    subspecialties: ["Medical Dermatology", "Cosmetic Dermatology", "Skin Cancer"],
    gender: "Female",
    languages: ["English", "Korean"],
    yearsExperience: 11,
    address: "321 Skin Health Center",
    city: "Cleveland",
    state: "OH",
    zip: "44107",
    phone: "(216) 555-5678",
    fax: "(216) 555-5679",
    email: "jkim@clevskin.com",
    rating: 4.8,
    reviews: 145,
    accepting: true,
    nextAvailable: "Tue, Mar 14",
    image: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=400&h=400&fit=crop",
    distance: "2.5 mi",
    telehealth: true,
    npi: "8901234567",
    practiceName: "Cleveland Dermatology Associates",
    officeHours: {
      monday: "9:00 AM - 5:00 PM",
      tuesday: "9:00 AM - 5:00 PM",
      wednesday: "9:00 AM - 5:00 PM",
      thursday: "9:00 AM - 6:00 PM",
      friday: "9:00 AM - 4:00 PM",
      saturday: "Closed",
      sunday: "Closed",
    },
    education: [
      { type: "Medical School", name: "Yale School of Medicine", year: "2011" },
      { type: "Residency", name: "NYU Langone - Dermatology", year: "2015" },
    ],
    certifications: [
      { name: "American Board of Dermatology", status: "Board Certified", expiry: "2028" },
    ],
    hospitalAffiliations: ["Cleveland Clinic", "MetroHealth Medical Center"],
    conditionsTreated: ["Acne", "Eczema", "Psoriasis", "Skin Cancer", "Rosacea", "Hair Loss"],
    proceduresPerformed: ["Skin Biopsies", "Mohs Surgery", "Botox", "Fillers", "Laser Treatment"],
    bio: "Dr. Jennifer Kim is a board-certified dermatologist providing comprehensive skin care.",
    patientReviews: [
      { rating: 5, date: "Feb 2026", title: "Clear skin finally!", text: "Dr. Kim helped me with my acne after years of struggling.", author: "Jessica L.", waitTime: "Under 15 min", bedsideManner: 5 },
    ],
    networkStatus: "In-Network",
    memberSince: "2019",
  },
  {
    id: 9,
    name: "Dr. David Martinez",
    credentials: "MD, FACS",
    specialty: "General Surgery",
    subspecialties: ["Minimally Invasive Surgery", "Hernia Repair", "Gallbladder Surgery"],
    gender: "Male",
    languages: ["English", "Spanish"],
    yearsExperience: 16,
    address: "500 Surgical Center Blvd",
    city: "Cleveland",
    state: "OH",
    zip: "44108",
    phone: "(216) 555-6789",
    fax: "(216) 555-6790",
    email: "dmartinez@clevsurgery.com",
    rating: 4.7,
    reviews: 67,
    accepting: true,
    nextAvailable: "Wed, Mar 15",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop",
    distance: "3.8 mi",
    telehealth: true,
    npi: "9012345678",
    practiceName: "Cleveland Surgical Associates",
    officeHours: {
      monday: "8:00 AM - 4:30 PM",
      tuesday: "8:00 AM - 4:30 PM",
      wednesday: "8:00 AM - 4:30 PM",
      thursday: "8:00 AM - 4:30 PM",
      friday: "8:00 AM - 3:00 PM",
      saturday: "Closed",
      sunday: "Closed",
    },
    education: [
      { type: "Medical School", name: "University of Michigan Medical School", year: "2005" },
      { type: "Residency", name: "Cleveland Clinic - General Surgery", year: "2010" },
    ],
    certifications: [
      { name: "American Board of Surgery", status: "Board Certified", expiry: "2026" },
    ],
    hospitalAffiliations: ["Cleveland Clinic", "University Hospitals"],
    conditionsTreated: ["Hernias", "Gallbladder Disease", "Appendicitis", "Colon Disease"],
    proceduresPerformed: ["Laparoscopic Surgery", "Hernia Repair", "Cholecystectomy", "Appendectomy"],
    bio: "Dr. David Martinez is a board-certified general surgeon specializing in minimally invasive techniques.",
    patientReviews: [
      { rating: 5, date: "Jan 2026", title: "Quick recovery", text: "Laparoscopic surgery was a breeze. Back to work in a week.", author: "Mark P.", waitTime: "Under 15 min", bedsideManner: 4 },
    ],
    networkStatus: "In-Network",
    memberSince: "2015",
  },
  {
    id: 10,
    name: "Dr. Amanda Wilson",
    credentials: "MD, DFAPA",
    specialty: "Mental Health",
    subspecialties: ["Depression", "Anxiety", "PTSD", "Adult Psychiatry"],
    gender: "Female",
    languages: ["English"],
    yearsExperience: 13,
    address: "150 Behavioral Health Way",
    city: "Cleveland",
    state: "OH",
    zip: "44109",
    phone: "(216) 555-7890",
    fax: "(216) 555-7891",
    email: "awilson@mindwell.com",
    rating: 4.9,
    reviews: 112,
    accepting: true,
    nextAvailable: "Mon, Mar 18",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    distance: "1.9 mi",
    telehealth: true,
    npi: "0123456789",
    practiceName: "MindWell Psychiatry",
    officeHours: {
      monday: "9:00 AM - 6:00 PM",
      tuesday: "9:00 AM - 6:00 PM",
      wednesday: "9:00 AM - 6:00 PM",
      thursday: "9:00 AM - 7:00 PM",
      friday: "9:00 AM - 5:00 PM",
      saturday: "Closed",
      sunday: "Closed",
    },
    education: [
      { type: "Medical School", name: "Columbia University Vagelos College of Physicians and Surgeons", year: "2009" },
      { type: "Residency", name: "Johns Hopkins Hospital - Psychiatry", year: "2013" },
    ],
    certifications: [
      { name: "American Board of Psychiatry and Neurology", status: "Board Certified", expiry: "2027" },
    ],
    hospitalAffiliations: ["Cleveland Clinic Lutheran Hospital", "University Hospitals"],
    conditionsTreated: ["Depression", "Anxiety", "Bipolar Disorder", "PTSD", "OCD", "ADHD"],
    proceduresPerformed: ["Psychiatric Evaluation", "Medication Management", "Psychotherapy"],
    bio: "Dr. Amanda Wilson is a compassionate psychiatrist dedicated to mental health and wellness.",
    patientReviews: [
      { rating: 5, date: "Feb 2026", title: "Changed my life", text: "Dr. Wilson helped me overcome severe anxiety. Forever grateful.", author: "Anonymous", waitTime: "Under 15 min", bedsideManner: 5 },
    ],
    networkStatus: "In-Network",
    memberSince: "2018",
  },
  {
    id: 11,
    name: "Dr. Thomas Lee",
    credentials: "MD, FACEP",
    specialty: "Urgent Care",
    subspecialties: ["Emergency Medicine", "Occupational Medicine", "Sports Injuries"],
    gender: "Male",
    languages: ["English", "Vietnamese"],
    yearsExperience: 9,
    address: "888 Quick Care Lane",
    city: "Cleveland",
    state: "OH",
    zip: "44110",
    phone: "(216) 555-8901",
    fax: "(216) 555-8902",
    email: "tlee@quickcare.com",
    rating: 4.6,
    reviews: 234,
    accepting: true,
    nextAvailable: "Walk-ins Welcome",
    image: "https://images.unsplash.com/photo-1612349316228-5942a9b489c2?w=400&h=400&fit=crop",
    distance: "0.5 mi",
    telehealth: false,
    npi: "1234509876",
    practiceName: "QuickCare Urgent Care",
    officeHours: {
      monday: "8:00 AM - 8:00 PM",
      tuesday: "8:00 AM - 8:00 PM",
      wednesday: "8:00 AM - 8:00 PM",
      thursday: "8:00 AM - 8:00 PM",
      friday: "8:00 AM - 8:00 PM",
      saturday: "9:00 AM - 6:00 PM",
      sunday: "10:00 AM - 4:00 PM",
    },
    education: [
      { type: "Medical School", name: "Ohio State University College of Medicine", year: "2013" },
      { type: "Residency", name: "MetroHealth - Emergency Medicine", year: "2016" },
    ],
    certifications: [
      { name: "American Board of Emergency Medicine", status: "Board Certified", expiry: "2028" },
    ],
    hospitalAffiliations: ["MetroHealth Medical Center"],
    conditionsTreated: ["Minor Injuries", "Infections", "Sprains", "Burns", "Flu", "COVID-19"],
    proceduresPerformed: ["Wound Care", "X-Rays", "Lab Tests", "IV Fluids", "Splinting"],
    bio: "Dr. Thomas Lee provides fast, quality urgent care for non-life-threatening conditions.",
    patientReviews: [
      { rating: 5, date: "Mar 2026", title: "No wait!", text: "In and out in 30 minutes. Great care for my sprained ankle.", author: "Tyler S.", waitTime: "Under 15 min", bedsideManner: 4 },
    ],
    networkStatus: "In-Network",
    memberSince: "2020",
  },
  {
    id: 12,
    name: "Dr. Catherine Brown",
    credentials: "MD, FAAN",
    specialty: "Neurology",
    subspecialties: ["Headache Medicine", "Multiple Sclerosis", "Movement Disorders"],
    gender: "Female",
    languages: ["English", "French"],
    yearsExperience: 17,
    address: "600 Neuro Center Drive",
    city: "Cleveland",
    state: "OH",
    zip: "44111",
    phone: "(216) 555-9012",
    fax: "(216) 555-9013",
    email: "cbrown@clevelandneuro.com",
    rating: 4.8,
    reviews: 89,
    accepting: true,
    nextAvailable: "Thu, Mar 21",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&sat=-100",
    distance: "5.1 mi",
    telehealth: true,
    npi: "2345609876",
    practiceName: "Cleveland Neurology Institute",
    officeHours: {
      monday: "8:30 AM - 5:00 PM",
      tuesday: "8:30 AM - 5:00 PM",
      wednesday: "8:30 AM - 5:00 PM",
      thursday: "8:30 AM - 5:00 PM",
      friday: "8:30 AM - 4:00 PM",
      saturday: "Closed",
      sunday: "Closed",
    },
    education: [
      { type: "Medical School", name: "Duke University School of Medicine", year: "2004" },
      { type: "Residency", name: "Mayo Clinic - Neurology", year: "2008" },
      { type: "Fellowship", name: "Cleveland Clinic - Headache Medicine", year: "2009" },
    ],
    certifications: [
      { name: "American Board of Psychiatry and Neurology", status: "Board Certified", expiry: "2027" },
      { name: "United Council for Neurologic Subspecialties - Headache Medicine", status: "Certified", expiry: "2026" },
    ],
    hospitalAffiliations: ["Cleveland Clinic", "University Hospitals"],
    conditionsTreated: ["Migraines", "Multiple Sclerosis", "Parkinson's Disease", "Epilepsy", "Neuropathy"],
    proceduresPerformed: ["EMG/Nerve Conduction", "EEG", "Botox for Migraines", "Lumbar Puncture"],
    bio: "Dr. Catherine Brown is a fellowship-trained neurologist specializing in headache medicine.",
    patientReviews: [
      { rating: 5, date: "Feb 2026", title: "Finally migraine relief", text: "After years of migraines, Dr. Brown found a treatment that works!", author: "Rachel W.", waitTime: "15-30 min", bedsideManner: 5 },
    ],
    networkStatus: "In-Network",
    memberSince: "2014",
  },
  {
    id: 13,
    name: "Dr. Kevin O'Brien",
    credentials: "MD, FAAOS",
    specialty: "Orthopedics",
    subspecialties: ["Hand Surgery", "Upper Extremity", "Trauma"],
    gender: "Male",
    languages: ["English"],
    yearsExperience: 14,
    address: "750 Hand & Arm Center",
    city: "Cleveland",
    state: "OH",
    zip: "44112",
    phone: "(216) 555-0234",
    fax: "(216) 555-0235",
    email: "kobrien@handcenter.com",
    rating: 4.9,
    reviews: 76,
    accepting: true,
    nextAvailable: "Tue, Mar 19",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&hue=20",
    distance: "4.7 mi",
    telehealth: false,
    npi: "3456709876",
    practiceName: "Cleveland Hand & Upper Extremity Center",
    officeHours: {
      monday: "8:00 AM - 5:00 PM",
      tuesday: "8:00 AM - 5:00 PM",
      wednesday: "8:00 AM - 5:00 PM",
      thursday: "8:00 AM - 5:00 PM",
      friday: "8:00 AM - 3:00 PM",
      saturday: "Closed",
      sunday: "Closed",
    },
    education: [
      { type: "Medical School", name: "University of Pittsburgh School of Medicine", year: "2007" },
      { type: "Residency", name: "Hospital for Special Surgery - Orthopedics", year: "2012" },
      { type: "Fellowship", name: "Curtis National Hand Center - Hand Surgery", year: "2013" },
    ],
    certifications: [
      { name: "American Board of Orthopaedic Surgery", status: "Board Certified", expiry: "2027" },
      { name: "Certificate of Added Qualifications in Surgery of the Hand", status: "Certified", expiry: "2027" },
    ],
    hospitalAffiliations: ["Cleveland Clinic", "University Hospitals"],
    conditionsTreated: ["Carpal Tunnel", "Trigger Finger", "Fractures", "Arthritis", "Nerve Injuries"],
    proceduresPerformed: ["Carpal Tunnel Release", "Tendon Repair", "Fracture Fixation", "Joint Replacement"],
    bio: "Dr. Kevin O'Brien is a fellowship-trained hand surgeon treating conditions of the hand, wrist, and elbow.",
    patientReviews: [
      { rating: 5, date: "Jan 2026", title: "Excellent surgeon", text: "Fixed my carpal tunnel. No more numbness!", author: "Daniel F.", waitTime: "Under 15 min", bedsideManner: 4 },
    ],
    networkStatus: "In-Network",
    memberSince: "2016",
  },
  {
    id: 14,
    name: "Dr. Maria Garcia",
    credentials: "MD, FACE",
    specialty: "Endocrinology",
    subspecialties: ["Diabetes", "Thyroid Disorders", "Osteoporosis"],
    gender: "Female",
    languages: ["English", "Spanish"],
    yearsExperience: 12,
    address: "400 Hormone Health Blvd",
    city: "Cleveland",
    state: "OH",
    zip: "44113",
    phone: "(216) 555-1234",
    fax: "(216) 555-1235",
    email: "mgarcia@endocare.com",
    rating: 4.7,
    reviews: 91,
    accepting: true,
    nextAvailable: "Fri, Mar 22",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&hue=30",
    distance: "3.2 mi",
    telehealth: true,
    npi: "4567809876",
    practiceName: "Cleveland Endocrine Associates",
    officeHours: {
      monday: "8:00 AM - 4:30 PM",
      tuesday: "8:00 AM - 4:30 PM",
      wednesday: "8:00 AM - 4:30 PM",
      thursday: "8:00 AM - 4:30 PM",
      friday: "8:00 AM - 3:00 PM",
      saturday: "Closed",
      sunday: "Closed",
    },
    education: [
      { type: "Medical School", name: "University of Miami Miller School of Medicine", year: "2009" },
      { type: "Residency", name: "Cleveland Clinic - Internal Medicine", year: "2012" },
      { type: "Fellowship", name: "University Hospitals - Endocrinology", year: "2014" },
    ],
    certifications: [
      { name: "American Board of Internal Medicine - Endocrinology", status: "Board Certified", expiry: "2028" },
    ],
    hospitalAffiliations: ["Cleveland Clinic", "University Hospitals"],
    conditionsTreated: ["Type 1 Diabetes", "Type 2 Diabetes", "Thyroid Disease", "Osteoporosis", "Adrenal Disorders"],
    proceduresPerformed: ["Thyroid Ultrasound", "Fine Needle Aspiration", "Continuous Glucose Monitoring", "Insulin Pump Management"],
    bio: "Dr. Maria Garcia is a board-certified endocrinologist specializing in diabetes and thyroid disorders.",
    patientReviews: [
      { rating: 5, date: "Feb 2026", title: "Thyroid expert", text: "Dr. Garcia figured out my thyroid issues when others couldn't.", author: "Nancy H.", waitTime: "15-30 min", bedsideManner: 5 },
    ],
    networkStatus: "In-Network",
    memberSince: "2017",
  },
  {
    id: 15,
    name: "Dr. Steven Park",
    credentials: "MD, FAAO",
    specialty: "Ophthalmology",
    subspecialties: ["Cataract Surgery", "LASIK", "Glaucoma"],
    gender: "Male",
    languages: ["English", "Korean"],
    yearsExperience: 19,
    address: "950 Eye Care Center",
    city: "Cleveland",
    state: "OH",
    zip: "44114",
    phone: "(216) 555-2345",
    fax: "(216) 555-2346",
    email: "spark@visioncare.com",
    rating: 4.9,
    reviews: 167,
    accepting: true,
    nextAvailable: "Wed, Mar 20",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&hue=50",
    distance: "2.9 mi",
    telehealth: false,
    npi: "5678909876",
    practiceName: "Cleveland Eye Institute",
    officeHours: {
      monday: "8:00 AM - 5:00 PM",
      tuesday: "8:00 AM - 5:00 PM",
      wednesday: "8:00 AM - 5:00 PM",
      thursday: "8:00 AM - 5:00 PM",
      friday: "8:00 AM - 4:00 PM",
      saturday: "9:00 AM - 12:00 PM",
      sunday: "Closed",
    },
    education: [
      { type: "Medical School", name: "Cornell University Medical College", year: "2002" },
      { type: "Residency", name: "Wills Eye Hospital - Ophthalmology", year: "2006" },
    ],
    certifications: [
      { name: "American Board of Ophthalmology", status: "Board Certified", expiry: "2027" },
    ],
    hospitalAffiliations: ["Cleveland Clinic Cole Eye Institute", "University Hospitals Eye Institute"],
    conditionsTreated: ["Cataracts", "Glaucoma", "Macular Degeneration", "Diabetic Retinopathy", "Dry Eye"],
    proceduresPerformed: ["Cataract Surgery", "LASIK", "Glaucoma Surgery", "Retinal Injections"],
    bio: "Dr. Steven Park is a fellowship-trained ophthalmologist specializing in cataract and refractive surgery.",
    patientReviews: [
      { rating: 5, date: "Mar 2026", title: "I can see again!", text: "Cataract surgery was quick and painless. Vision is perfect.", author: "George M.", waitTime: "Under 15 min", bedsideManner: 5 },
    ],
    networkStatus: "In-Network",
    memberSince: "2013",
  },
  {
    id: 16,
    name: "Dr. Elizabeth Taylor",
    credentials: "DPM, FACFAS",
    specialty: "Podiatry",
    subspecialties: ["Foot Surgery", "Sports Medicine", "Diabetic Foot Care"],
    gender: "Female",
    languages: ["English"],
    yearsExperience: 11,
    address: "275 Foot & Ankle Center",
    city: "Cleveland",
    state: "OH",
    zip: "44115",
    phone: "(216) 555-3456",
    fax: "(216) 555-3457",
    email: "etaylor@footcare.com",
    rating: 4.8,
    reviews: 83,
    accepting: true,
    nextAvailable: "Mon, Mar 18",
    image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop&hue=40",
    distance: "3.6 mi",
    telehealth: false,
    npi: "6789009876",
    practiceName: "Cleveland Foot & Ankle Specialists",
    officeHours: {
      monday: "8:30 AM - 5:00 PM",
      tuesday: "8:30 AM - 5:00 PM",
      wednesday: "8:30 AM - 5:00 PM",
      thursday: "8:30 AM - 5:00 PM",
      friday: "8:30 AM - 4:00 PM",
      saturday: "Closed",
      sunday: "Closed",
    },
    education: [
      { type: "Podiatry School", name: "Ohio College of Podiatric Medicine", year: "2011" },
      { type: "Residency", name: "Cleveland Clinic - Podiatric Surgery", year: "2014" },
    ],
    certifications: [
      { name: "American Board of Foot and Ankle Surgery", status: "Board Certified", expiry: "2027" },
    ],
    hospitalAffiliations: ["Cleveland Clinic", "MetroHealth Medical Center"],
    conditionsTreated: ["Bunions", "Plantar Fasciitis", "Diabetic Foot Ulcers", "Hammertoes", "Ankle Sprains"],
    proceduresPerformed: ["Bunion Surgery", "Hammertoe Correction", "Wound Care", "Orthotics"],
    bio: "Dr. Elizabeth Taylor is a board-certified podiatrist specializing in foot and ankle conditions.",
    patientReviews: [
      { rating: 5, date: "Feb 2026", title: "Pain-free feet!", text: "Finally got my bunion fixed. Should have done it years ago!", author: "Barbara K.", waitTime: "Under 15 min", bedsideManner: 5 },
    ],
    networkStatus: "In-Network",
    memberSince: "2018",
  },
  {
    id: 17,
    name: "Dr. Richard Thompson",
    credentials: "MD, FCCP",
    specialty: "Pulmonology",
    subspecialties: ["Asthma", "COPD", "Sleep Disorders"],
    gender: "Male",
    languages: ["English"],
    yearsExperience: 15,
    address: "800 Lung Health Center",
    city: "Cleveland",
    state: "OH",
    zip: "44116",
    phone: "(216) 555-4567",
    fax: "(216) 555-4568",
    email: "rthompson@lungcare.com",
    rating: 4.7,
    reviews: 72,
    accepting: true,
    nextAvailable: "Thu, Mar 21",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&hue=60",
    distance: "4.4 mi",
    telehealth: true,
    npi: "7890109876",
    practiceName: "Cleveland Pulmonary Associates",
    officeHours: {
      monday: "8:00 AM - 4:30 PM",
      tuesday: "8:00 AM - 4:30 PM",
      wednesday: "8:00 AM - 4:30 PM",
      thursday: "8:00 AM - 4:30 PM",
      friday: "8:00 AM - 3:00 PM",
      saturday: "Closed",
      sunday: "Closed",
    },
    education: [
      { type: "Medical School", name: "Washington University School of Medicine", year: "2006" },
      { type: "Residency", name: "Cleveland Clinic - Internal Medicine", year: "2009" },
      { type: "Fellowship", name: "University Hospitals - Pulmonary/Critical Care", year: "2012" },
    ],
    certifications: [
      { name: "American Board of Internal Medicine - Pulmonary Disease", status: "Board Certified", expiry: "2027" },
    ],
    hospitalAffiliations: ["Cleveland Clinic", "University Hospitals"],
    conditionsTreated: ["Asthma", "COPD", "Pulmonary Fibrosis", "Sleep Apnea", "Lung Cancer"],
    proceduresPerformed: ["Bronchoscopy", "Pulmonary Function Tests", "Sleep Studies", "Thoracentesis"],
    bio: "Dr. Richard Thompson is a board-certified pulmonologist treating respiratory conditions.",
    patientReviews: [
      { rating: 5, date: "Jan 2026", title: "Breathing better", text: "Dr. Thompson got my COPD under control. Life changing.", author: "James W.", waitTime: "15-30 min", bedsideManner: 4 },
    ],
    networkStatus: "In-Network",
    memberSince: "2015",
  },
  {
    id: 18,
    name: "Lakewood Urgent Care Center",
    credentials: "",
    specialty: "Urgent Care",
    subspecialties: ["Walk-in Care", "Occupational Health", "Minor Emergencies"],
    gender: "",
    languages: ["English", "Spanish"],
    yearsExperience: 12,
    address: "1500 Detroit Ave",
    city: "Lakewood",
    state: "OH",
    zip: "44107",
    phone: "(216) 555-5678",
    fax: "(216) 555-5679",
    email: "info@lakewoodurgent.com",
    rating: 4.5,
    reviews: 289,
    accepting: true,
    nextAvailable: "Walk-ins Welcome",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=400&fit=crop",
    distance: "6.2 mi",
    telehealth: false,
    npi: "8901209876",
    practiceName: "Lakewood Urgent Care Center",
    officeHours: {
      monday: "8:00 AM - 9:00 PM",
      tuesday: "8:00 AM - 9:00 PM",
      wednesday: "8:00 AM - 9:00 PM",
      thursday: "8:00 AM - 9:00 PM",
      friday: "8:00 AM - 9:00 PM",
      saturday: "9:00 AM - 7:00 PM",
      sunday: "10:00 AM - 5:00 PM",
    },
    education: [],
    certifications: [
      { name: "Urgent Care Association", status: "Accredited", expiry: "2027" },
    ],
    hospitalAffiliations: ["Lakewood Hospital"],
    conditionsTreated: ["Minor Injuries", "Illnesses", "Sprains", "Cuts", "Infections", "Flu/Cold"],
    proceduresPerformed: ["X-Rays", "Lab Tests", "Stitches", "Splinting", "IV Fluids"],
    bio: "Lakewood Urgent Care provides fast, affordable care for non-life-threatening conditions.",
    patientReviews: [
      { rating: 4, date: "Mar 2026", title: "Quick service", text: "Got seen quickly on a busy Saturday. Good care.", author: "Samantha J.", waitTime: "30-45 min", bedsideManner: 4 },
    ],
    networkStatus: "In-Network",
    memberSince: "2016",
  },
];

const specialties = [
  "All Specialties",
  "Family Medicine",
  "Internal Medicine",
  "Pediatrics",
  "Cardiology",
  "Dermatology",
  "Endocrinology",
  "General Surgery",
  "Mental Health",
  "Neurology",
  "OB/GYN",
  "Ophthalmology",
  "Orthopedics",
  "Podiatry",
  "Pulmonology",
  "Urgent Care",
  "Hospital",
];

type Provider = typeof providers[0];

export default function FindProviderPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [specialty, setSpecialty] = useState("All Specialties");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "reviews" | "locations">("overview");
  const [acceptingOnly, setAcceptingOnly] = useState(false);
  const [telehealthOnly, setTelehealthOnly] = useState(false);
  const [sortBy, setSortBy] = useState("distance");

  // Filter and sort providers
  const filteredProviders = useMemo(() => {
    let result = [...providers];

    // Filter by search term (name, specialty, practice name)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.specialty.toLowerCase().includes(term) ||
        p.practiceName.toLowerCase().includes(term) ||
        p.subspecialties.some(s => s.toLowerCase().includes(term))
      );
    }

    // Filter by specialty
    if (specialty !== "All Specialties") {
      result = result.filter(p => p.specialty === specialty);
    }

    // Filter by location
    if (location) {
      const loc = location.toLowerCase();
      result = result.filter(p => 
        p.city.toLowerCase().includes(loc) ||
        p.state.toLowerCase().includes(loc) ||
        p.zip.includes(loc)
      );
    }

    // Filter by accepting new patients
    if (acceptingOnly) {
      result = result.filter(p => p.accepting);
    }

    // Filter by telehealth
    if (telehealthOnly) {
      result = result.filter(p => p.telehealth);
    }

    // Sort
    switch (sortBy) {
      case "distance":
        result.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "reviews":
        result.sort((a, b) => b.reviews - a.reviews);
        break;
    }

    return result;
  }, [searchTerm, location, specialty, acceptingOnly, telehealthOnly, sortBy]);

  const handleSearch = () => {
    // Search is already reactive via useMemo
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MarketingHeader />

      {/* Search Header */}
      <section className="bg-gradient-to-br from-[teal-600] to-[#003366] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-6">Find a Provider</h1>
          
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative md:col-span-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Doctor name or keyword"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[teal-600] focus:border-transparent text-gray-900"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="City, State or ZIP"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[teal-600] focus:border-transparent text-gray-900"
                />
              </div>
              <div className="relative">
                <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[teal-600] focus:border-transparent text-gray-900 appearance-none"
                >
                  {specialties.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              <button 
                onClick={handleSearch}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[teal-600] text-white font-semibold rounded-lg hover:bg-[teal-700] transition-colors"
              >
                <Search className="w-5 h-5" />
                Search
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${showFilters ? 'border-[teal-600] bg-teal-50 text-[teal-600]' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <button 
                onClick={() => setAcceptingOnly(!acceptingOnly)}
                className={`px-4 py-2 border rounded-lg transition-colors ${acceptingOnly ? 'border-[teal-600] bg-teal-50 text-[teal-600]' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                Accepting New Patients
              </button>
              <button 
                onClick={() => setTelehealthOnly(!telehealthOnly)}
                className={`px-4 py-2 border rounded-lg transition-colors ${telehealthOnly ? 'border-[teal-600] bg-teal-50 text-[teal-600]' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                Telehealth Available
              </button>
            </div>

            {/* Extended Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200 grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700">
                    <option>Any</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700">
                    <option>Any</option>
                    <option>English</option>
                    <option>Spanish</option>
                    <option>Mandarin</option>
                    <option>Korean</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Distance</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700">
                    <option>Any distance</option>
                    <option>Within 5 miles</option>
                    <option>Within 10 miles</option>
                    <option>Within 25 miles</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700">
                    <option>Any rating</option>
                    <option>4+ stars</option>
                    <option>4.5+ stars</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              Showing <span className="font-semibold">{filteredProviders.length}</span> providers
              {location && <span> near {location}</span>}
              {specialty !== "All Specialties" && <span> in {specialty}</span>}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700"
              >
                <option value="distance">Distance</option>
                <option value="rating">Rating</option>
                <option value="reviews">Most Reviews</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>

          {filteredProviders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No providers found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters.</p>
              <button 
                onClick={() => {
                  setSearchTerm("");
                  setLocation("");
                  setSpecialty("All Specialties");
                  setAcceptingOnly(false);
                  setTelehealthOnly(false);
                }}
                className="text-[teal-600] font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              {filteredProviders.map((provider, i) => (
                <motion.div
                  key={provider.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex gap-4">
                    <img
                      src={provider.image}
                      alt={provider.name}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-gray-900">{provider.name}{provider.credentials && `, ${provider.credentials}`}</h3>
                          <p className="text-[teal-600] text-sm">{provider.specialty}</p>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                          <Heart className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold text-gray-900">{provider.rating}</span>
                        </div>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600">{provider.reviews} reviews</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600">{provider.distance}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{provider.address}, {provider.city}, {provider.state}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{provider.phone}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      {provider.accepting && (
                        <span className="flex items-center gap-1 text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          Accepting New Patients
                        </span>
                      )}
                      {provider.telehealth && (
                        <span className="flex items-center gap-1 text-xs px-2 py-1 bg-teal-50 text-teal-700 rounded-full">
                          <Video className="w-3 h-3" />
                          Telehealth
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                        <Clock className="w-3 h-3" />
                        Next: {provider.nextAvailable}
                      </span>
                    </div>

                    <div className="flex items-center justify-end mt-4">
                      <button 
                        onClick={() => setSelectedProvider(provider)}
                        className="px-4 py-2 bg-[teal-600] text-white text-sm font-semibold rounded-lg hover:bg-[teal-700] transition-colors"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Users, value: "50,000+", label: "Providers" },
              { icon: Building2, value: "500+", label: "Hospitals" },
              { icon: Stethoscope, value: "100+", label: "Specialties" },
              { icon: MapPin, value: "50", label: "States" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-[teal-600]" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MarketingFooter />

      {/* Provider Profile Modal */}
      <AnimatePresence>
        {selectedProvider && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 overflow-y-auto"
            onClick={() => setSelectedProvider(null)}
          >
            <div className="min-h-screen py-8 px-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-[teal-600] to-[#003366] text-white p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-6">
                      <img
                        src={selectedProvider.image}
                        alt={selectedProvider.name}
                        className="w-28 h-28 rounded-xl object-cover border-4 border-white/20"
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-medium rounded">
                            {selectedProvider.networkStatus}
                          </span>
                          {selectedProvider.telehealth && (
                            <span className="px-2 py-0.5 bg-white/20 text-white text-xs font-medium rounded flex items-center gap-1">
                              <Video className="w-3 h-3" /> Telehealth
                            </span>
                          )}
                        </div>
                        <h2 className="text-2xl font-bold">{selectedProvider.name}{selectedProvider.credentials && `, ${selectedProvider.credentials}`}</h2>
                        <p className="text-blue-200">{selectedProvider.specialty}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{selectedProvider.rating}</span>
                            <span className="text-blue-200">({selectedProvider.reviews} reviews)</span>
                          </div>
                          {selectedProvider.yearsExperience > 0 && (
                            <span className="text-blue-200">{selectedProvider.yearsExperience} years experience</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedProvider(null)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-3 mt-6">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white text-[teal-600] font-semibold rounded-lg hover:bg-teal-50 transition-colors">
                      <Calendar className="w-4 h-4" />
                      Schedule Appointment
                    </button>
                    <a href={`tel:${selectedProvider.phone}`} className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors">
                      <Phone className="w-4 h-4" />
                      {selectedProvider.phone}
                    </a>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors">
                      <Heart className="w-4 h-4" />
                      Save
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <div className="flex">
                    {[
                      { id: "overview", label: "Overview" },
                      { id: "reviews", label: `Reviews (${selectedProvider.reviews})` },
                      { id: "locations", label: "Location & Hours" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                          activeTab === tab.id
                            ? "border-[teal-600] text-[teal-600]"
                            : "border-transparent text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                  {activeTab === "overview" && (
                    <div className="space-y-8">
                      {/* About */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">About</h3>
                        <p className="text-gray-600">{selectedProvider.bio}</p>
                      </div>

                      {/* Quick Info Grid */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 rounded-xl p-4">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Stethoscope className="w-5 h-5 text-[teal-600]" />
                            Specialties
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-[teal-600] text-white text-sm rounded-full">{selectedProvider.specialty}</span>
                            {selectedProvider.subspecialties.map((sub) => (
                              <span key={sub} className="px-3 py-1 bg-white border border-gray-200 text-gray-700 text-sm rounded-full">{sub}</span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Languages className="w-5 h-5 text-[teal-600]" />
                            Languages
                          </h4>
                          <p className="text-gray-600">{selectedProvider.languages.join(", ")}</p>
                        </div>
                      </div>

                      {/* Education */}
                      {selectedProvider.education.length > 0 && (
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-[teal-600]" />
                            Education & Training
                          </h3>
                          <div className="space-y-3">
                            {selectedProvider.education.map((edu, i) => (
                              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-2 h-2 bg-[teal-600] rounded-full mt-2"></div>
                                <div>
                                  <p className="font-medium text-gray-900">{edu.name}</p>
                                  <p className="text-sm text-gray-600">{edu.type} • {edu.year}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Certifications */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <Award className="w-5 h-5 text-[teal-600]" />
                          Board Certifications
                        </h3>
                        <div className="grid md:grid-cols-2 gap-3">
                          {selectedProvider.certifications.map((cert, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                              <BadgeCheck className="w-5 h-5 text-green-600" />
                              <div>
                                <p className="font-medium text-gray-900">{cert.name}</p>
                                <p className="text-sm text-green-600">{cert.status} • Expires {cert.expiry}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Hospital Affiliations */}
                      {selectedProvider.hospitalAffiliations.length > 0 && (
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-[teal-600]" />
                            Hospital Affiliations
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedProvider.hospitalAffiliations.map((hospital) => (
                              <span key={hospital} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm">{hospital}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Network Info */}
                      <div className="bg-teal-50 rounded-xl p-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <Shield className="w-5 h-5 text-[teal-600]" />
                          Network Information
                        </h3>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Network Status</p>
                            <p className="font-semibold text-green-600">{selectedProvider.networkStatus}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Member Since</p>
                            <p className="font-semibold text-gray-900">{selectedProvider.memberSince}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">NPI Number</p>
                            <p className="font-mono text-gray-900">{selectedProvider.npi}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "reviews" && (
                    <div className="space-y-6">
                      {/* Rating Summary */}
                      <div className="bg-gray-50 rounded-xl p-6">
                        <div className="flex items-center gap-8">
                          <div className="text-center">
                            <p className="text-5xl font-bold text-gray-900">{selectedProvider.rating}</p>
                            <div className="flex justify-center my-2">
                              {[1,2,3,4,5].map((s) => (
                                <Star key={s} className={`w-5 h-5 ${s <= Math.round(selectedProvider.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                              ))}
                            </div>
                            <p className="text-sm text-gray-600">{selectedProvider.reviews} reviews</p>
                          </div>
                          <div className="flex-1 space-y-2">
                            {[5,4,3,2,1].map((stars) => (
                              <div key={stars} className="flex items-center gap-3">
                                <span className="text-sm text-gray-600 w-3">{stars}</span>
                                <Star className="w-4 h-4 text-yellow-400" />
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-yellow-400 rounded-full" 
                                    style={{ width: `${stars === 5 ? 85 : stars === 4 ? 12 : 3}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Individual Reviews */}
                      <div className="space-y-4">
                        {selectedProvider.patientReviews.map((review, i) => (
                          <div key={i} className="border border-gray-200 rounded-xl p-5">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  {[1,2,3,4,5].map((s) => (
                                    <Star key={s} className={`w-4 h-4 ${s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                                  ))}
                                </div>
                                <h4 className="font-semibold text-gray-900 mt-1">{review.title}</h4>
                              </div>
                              <span className="text-sm text-gray-500">{review.date}</span>
                            </div>
                            <p className="text-gray-600 mb-4">{review.text}</p>
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-4 text-gray-500">
                                <span>Wait time: {review.waitTime}</span>
                                <span>Bedside manner: {"★".repeat(review.bedsideManner)}</span>
                              </div>
                              <span className="font-medium text-gray-700">— {review.author}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "locations" && (
                    <div className="space-y-6">
                      {/* Location Card */}
                      <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <div className="text-center text-gray-500">
                            <MapPin className="w-8 h-8 mx-auto mb-2" />
                            <p>Interactive Map</p>
                          </div>
                        </div>
                        
                        <div className="p-5">
                          <h3 className="font-bold text-gray-900 mb-1">{selectedProvider.practiceName}</h3>
                          <p className="text-gray-600 mb-4">
                            {selectedProvider.address}<br />
                            {selectedProvider.city}, {selectedProvider.state} {selectedProvider.zip}
                          </p>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-500">Phone</p>
                              <a href={`tel:${selectedProvider.phone}`} className="text-[teal-600] font-medium">{selectedProvider.phone}</a>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Fax</p>
                              <p className="text-gray-900">{selectedProvider.fax}</p>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[teal-600] text-white font-medium rounded-lg hover:bg-[teal-700]">
                              <MapPin className="w-4 h-4" />
                              Get Directions
                            </button>
                            <a href={`tel:${selectedProvider.phone}`} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50">
                              <Phone className="w-4 h-4" />
                              Call Office
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Office Hours */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Clock className="w-5 h-5 text-[teal-600]" />
                          Office Hours
                        </h3>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="space-y-2">
                            {Object.entries(selectedProvider.officeHours).map(([day, hours]) => (
                              <div key={day} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                                <span className="font-medium text-gray-900 capitalize">{day}</span>
                                <span className={hours === "Closed" ? "text-gray-400" : "text-gray-600"}>{hours}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
