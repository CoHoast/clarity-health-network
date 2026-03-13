"use client";

import Image from "next/image";

export default function USAMap() {
  return (
    <div className="relative max-w-5xl mx-auto">
      {/* USA Map Image with overlay styling */}
      <div className="relative">
        <div 
          className="relative w-full"
          style={{ 
            filter: 'brightness(0) invert(1) opacity(0.3)',
          }}
        >
          <img 
            src="/usa-map.svg" 
            alt="United States Map" 
            className="w-full h-auto"
          />
        </div>
        
        {/* Provider dots overlay */}
        <div className="absolute inset-0">
          {[
            { left: "12%", top: "20%", city: "Seattle" },
            { left: "10%", top: "35%", city: "Portland" },
            { left: "8%", top: "55%", city: "San Francisco" },
            { left: "11%", top: "70%", city: "Los Angeles" },
            { left: "20%", top: "75%", city: "Phoenix" },
            { left: "27%", top: "45%", city: "Salt Lake City" },
            { left: "40%", top: "50%", city: "Denver" },
            { left: "50%", top: "70%", city: "Dallas" },
            { left: "52%", top: "82%", city: "Houston" },
            { left: "53%", top: "55%", city: "Kansas City" },
            { left: "52%", top: "35%", city: "Minneapolis" },
            { left: "60%", top: "45%", city: "Chicago" },
            { left: "65%", top: "52%", city: "Indianapolis" },
            { left: "58%", top: "58%", city: "St. Louis" },
            { left: "68%", top: "62%", city: "Nashville" },
            { left: "75%", top: "68%", city: "Atlanta" },
            { left: "77%", top: "48%", city: "Cleveland" },
            { left: "75%", top: "40%", city: "Detroit" },
            { left: "82%", top: "45%", city: "Pittsburgh" },
            { left: "88%", top: "48%", city: "Washington DC" },
            { left: "90%", top: "42%", city: "Philadelphia" },
            { left: "92%", top: "35%", city: "New York" },
            { left: "95%", top: "28%", city: "Boston" },
            { left: "82%", top: "65%", city: "Charlotte" },
            { left: "85%", top: "88%", city: "Miami" },
            { left: "77%", top: "82%", city: "Tampa" },
            { left: "62%", top: "80%", city: "New Orleans" },
          ].map((city, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2"
              style={{ left: city.left, top: city.top }}
            >
              <div className="absolute inset-0 bg-[#10b981] rounded-full opacity-40 animate-ping" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-0.5 bg-[#10b981] rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
