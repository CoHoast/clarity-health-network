"use client";

import { useState } from "react";
import { ArrowLeft, User, Mail, Building2, Calendar, Users, Shield, Check } from "lucide-react";
import Link from "next/link";

const steps = ["Employee Info", "Coverage", "Dependents", "Review"];

export default function AddEmployeePage() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/employer/roster" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Employee</h1>
          <p className="text-gray-500">Enroll a new employee in the health plan</p>
        </div>
      </div>

      {/* Steps */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center">
              <div className={`flex items-center gap-2 ${i <= currentStep ? "text-teal-600" : "text-gray-400"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i < currentStep ? "bg-teal-500 text-white" : 
                  i === currentStep ? "bg-teal-100 text-teal-600 border-2 border-teal-500" : 
                  "bg-gray-100 text-gray-400"
                }`}>
                  {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className="hidden sm:block text-sm font-medium">{step}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-12 sm:w-24 h-0.5 mx-2 ${i < currentStep ? "bg-teal-500" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        {currentStep === 0 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Employee Information</h2>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" placeholder="John" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input type="text" placeholder="Smith" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" placeholder="john.smith@acme.com" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 appearance-none bg-white">
                    <option>Select department</option>
                    <option>Engineering</option>
                    <option>Marketing</option>
                    <option>Sales</option>
                    <option>HR</option>
                    <option>Finance</option>
                    <option>Operations</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hire Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="date" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input type="date" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SSN (Last 4 digits)</label>
              <input type="text" placeholder="••••" maxLength={4} className="w-32 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-center tracking-widest" />
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Select Coverage</h2>
            
            <div className="space-y-3">
              {[
                { name: "Silver PPO", price: "$450/mo", description: "Basic coverage with $2,500 deductible" },
                { name: "Gold PPO", price: "$650/mo", description: "Enhanced coverage with $1,500 deductible", recommended: true },
                { name: "Platinum PPO", price: "$850/mo", description: "Premium coverage with $500 deductible" },
              ].map((plan) => (
                <label key={plan.name} className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer hover:border-teal-300 ${plan.recommended ? "border-teal-500 bg-teal-50" : "border-gray-200"}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="plan" className="w-4 h-4 text-teal-500 focus:ring-teal-500" defaultChecked={plan.recommended} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{plan.name}</span>
                        {plan.recommended && <span className="px-2 py-0.5 bg-teal-500 text-white text-xs rounded-full">Recommended</span>}
                      </div>
                      <p className="text-sm text-gray-500">{plan.description}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-900">{plan.price}</span>
                </label>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coverage Effective Date</label>
              <input type="date" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Add Dependents</h2>
              <button className="text-teal-600 hover:text-teal-700 text-sm font-medium">+ Add Dependent</button>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No dependents added yet</p>
              <button className="mt-3 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 text-sm font-medium">
                Add Dependent
              </button>
            </div>

            <p className="text-sm text-gray-500">Dependents can include spouse and children under 26 years old.</p>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Review & Submit</h2>
            
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Employee</span>
                <span className="font-medium text-gray-900">John Smith</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="text-gray-700">john.smith@acme.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Department</span>
                <span className="text-gray-700">Engineering</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Plan</span>
                <span className="font-medium text-teal-600">Gold PPO</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Dependents</span>
                <span className="text-gray-700">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Effective Date</span>
                <span className="text-gray-700">April 1, 2026</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between">
                <span className="text-gray-500">Monthly Premium</span>
                <span className="font-semibold text-gray-900">$650.00</span>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1 w-4 h-4 text-teal-500 focus:ring-teal-500 rounded" />
              <span className="text-sm text-gray-600">I confirm that the information provided is accurate and the employee has completed the required enrollment forms.</span>
            </label>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            className={`px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg ${currentStep === 0 ? "invisible" : ""}`}
          >
            Back
          </button>
          <button
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 font-medium"
          >
            {currentStep === steps.length - 1 ? "Submit Enrollment" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
