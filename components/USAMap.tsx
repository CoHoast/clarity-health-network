"use client";

export default function USAMap() {
  // City positions calibrated to USA map boundaries
  // Map spans roughly 15%-85% horizontally, 15%-85% vertically
  const cities = [
    // West Coast
    { left: "18%", top: "22%", city: "Seattle" },
    { left: "16%", top: "32%", city: "Portland" },
    { left: "14%", top: "48%", city: "San Francisco" },
    { left: "16%", top: "58%", city: "Los Angeles" },
    { left: "20%", top: "65%", city: "San Diego" },
    
    // Southwest
    { left: "24%", top: "60%", city: "Phoenix" },
    { left: "30%", top: "55%", city: "Albuquerque" },
    { left: "35%", top: "68%", city: "El Paso" },
    
    // Mountain
    { left: "28%", top: "38%", city: "Salt Lake City" },
    { left: "36%", top: "45%", city: "Denver" },
    { left: "26%", top: "28%", city: "Boise" },
    
    // Central
    { left: "45%", top: "58%", city: "Dallas" },
    { left: "48%", top: "70%", city: "Houston" },
    { left: "42%", top: "68%", city: "San Antonio" },
    { left: "50%", top: "48%", city: "Kansas City" },
    { left: "48%", top: "28%", city: "Minneapolis" },
    { left: "45%", top: "38%", city: "Omaha" },
    { left: "52%", top: "55%", city: "Oklahoma City" },
    
    // Midwest
    { left: "58%", top: "38%", city: "Chicago" },
    { left: "60%", top: "48%", city: "Indianapolis" },
    { left: "55%", top: "52%", city: "St. Louis" },
    { left: "60%", top: "35%", city: "Milwaukee" },
    { left: "56%", top: "28%", city: "Madison" },
    
    // South
    { left: "62%", top: "58%", city: "Nashville" },
    { left: "55%", top: "72%", city: "New Orleans" },
    { left: "68%", top: "62%", city: "Atlanta" },
    { left: "72%", top: "68%", city: "Jacksonville" },
    { left: "75%", top: "80%", city: "Miami" },
    { left: "72%", top: "75%", city: "Tampa" },
    
    // Great Lakes
    { left: "65%", top: "32%", city: "Detroit" },
    { left: "68%", top: "38%", city: "Cleveland" },
    { left: "62%", top: "25%", city: "Grand Rapids" },
    
    // Northeast
    { left: "75%", top: "40%", city: "Pittsburgh" },
    { left: "80%", top: "38%", city: "Philadelphia" },
    { left: "82%", top: "32%", city: "New York" },
    { left: "85%", top: "26%", city: "Boston" },
    { left: "78%", top: "42%", city: "Washington DC" },
    { left: "76%", top: "48%", city: "Richmond" },
    { left: "72%", top: "55%", city: "Charlotte" },
    { left: "78%", top: "55%", city: "Raleigh" },
  ];

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
          {cities.map((city, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2"
              style={{ left: city.left, top: city.top }}
              title={city.city}
            >
              <div 
                className="absolute inset-0 bg-[#10b981] rounded-full opacity-40 animate-ping" 
                style={{ animationDuration: `${2 + (i % 3)}s`, animationDelay: `${(i % 5) * 0.4}s` }} 
              />
              <div className="absolute inset-0.5 bg-[#10b981] rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
