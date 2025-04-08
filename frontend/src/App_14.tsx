import React, { useState } from "react";
import MapComponent from "./components/MapComponent";

const App: React.FC = () => {
  const items = ["Global", "Item 01", "Item 02", "Item 03", "Item 04", "Item 05", "Item 06", "Item 07", "Item 08", "Item 09", "Item 10"];
  const [selectedItem, setSelectedItem] = useState<string>("Global");
  const [year, setYear] = useState<number>(2025);

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYear(Number(e.target.value));
  };

  return (
    <div className="flex flex-col items-center pt-20 min-h-screen bg-gray-50">
      {/* Main layout : Sidebar + Map */}
      <div className="flex flex-row w-full justify-center max-w-[1400px]">
        
        {/* Sidebar */}
        <div className="w-[250px] p-4 bg-gray-100 rounded-md shadow-md mr-8">
          <h1 className="text-lg font-bold mb-6 text-center">
            Risques encourus sur le littoral français
          </h1>
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <button
                key={item}
                onClick={() => setSelectedItem(item)}
                className={`py-2 px-4 rounded ${
                  selectedItem === item ? "bg-blue-500 text-white" : "bg-white border"
                } ${item === "Global" ? "text-lg font-bold" : "text-base"}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="flex justify-center items-center">
          <div className="w-[1500px] h-[600px] bg-gray-300 rounded-md shadow-md overflow-hidden">
            <MapComponent />
          </div>
        </div>

      </div>

      {/* Timeline */}
      <div className="relative w-[1000px] h-[200px] mt-12">

        {/* Background timeline */}
        <div className="absolute top-1/2 left-0 right-0 h-[50px] -translate-y-1/2 rounded-md overflow-hidden bg-gray-400">
          {/* Rupture à l'année actuelle */}
          <div
            style={{
              width: `${((year - 1800) / (2100 - 1800)) * 100}%`,
              height: "100%",
              backgroundColor: "#826E43",
            }}
          />
        </div>

        {/* Year marker */}
        <div
          className="absolute flex items-center justify-center font-bold text-white border-4 border-white rounded-full"
          style={{
            backgroundColor: "#114a66",
            width: "80%",
            height: "40px",
            left: `${((year - 1800) / (2100 - 1800)) * 100}%`,
            top: "50%",
            transform: "translate(100, 50)",
          }}
        >
          {year}
        </div>

        {/* Hidden real range input */}
        <input
          type="range"
          min={1800}
          max={2100}
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="absolute top-1/2 left-0 w-full cursor-pointer opacity-50"
          style={{ height: "30px", transform: "translateY(50)" }}
        />

        {/* Start and end labels */}
        <div className="absolute bottom-0 left-0 text-sm font-bold text-gray-700">1800</div>
        <div className="absolute bottom-0 right-0 text-sm font-bold text-gray-700">2100</div>
      </div>
    </div>
  );
};

export default App;
