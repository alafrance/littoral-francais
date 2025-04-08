import React, { useState } from "react";
import MapComponent from "./components/MapComponent";
import { motion, AnimatePresence } from "framer-motion"; // Animation avec Framer Motion

const App: React.FC = () => {
  const [activeSets, setActiveSets] = useState<string[]>(["yellow"]);
  const [year, setYear] = useState<number>(2025);

  const handleItemClick = (item: string) => {
    if (item === "global") {
      setActiveSets(["yellow", "red", "violet"]);
    } else {
      setActiveSets([item]);
    }
  };

  // Données pour la légende
  const pointCounts: Record<string, number> = {
    yellow: 20,
    red: 2,
    violet: 1,
  };

  const totalPoints = activeSets.reduce((acc, set) => acc + (pointCounts[set] || 0), 0);

  return (
    <div className="flex flex-col items-center pt-20 min-h-screen bg-gray-50">
      {/* Sidebar + Carte */}
      <div className="flex flex-row w-full justify-center max-w-[1400px]">
        
        {/* Sidebar */}
        <div className="w-[250px] p-4 bg-gray-100 rounded-md shadow-md mr-8">
          <h1 className="text-lg font-bold mb-6 text-center">
            Risques encourus sur le littoral français
          </h1>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleItemClick("global")}
              className="py-2 px-4 rounded bg-blue-500 text-white text-lg font-bold"
            >
              Global
            </button>
            <button
              onClick={() => handleItemClick("yellow")}
              className="py-2 px-4 rounded bg-white border text-base"
            >
              Item 01 (Jaune)
            </button>
            <button
              onClick={() => handleItemClick("red")}
              className="py-2 px-4 rounded bg-white border text-base"
            >
              Item 02 (Rouge)
            </button>
            <button
              onClick={() => handleItemClick("violet")}
              className="py-2 px-4 rounded bg-white border text-base"
            >
              Item 03 (Violet)
            </button>
          </div>
        </div>

        {/* Carte */}
        <div className="flex flex-col items-center">
          <div className="w-[1000px] h-[600px] bg-gray-300 rounded-md shadow-md overflow-hidden">
            <MapComponent activeSets={activeSets} year={year} />
          </div>

          {/* Légende dynamique */}
          <AnimatePresence>
            {activeSets.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-4 bg-white border rounded-md shadow-sm px-6 py-3 text-sm text-gray-700 flex gap-6"
              >
                {activeSets.includes("yellow") && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div>
                      <span className="font-bold text-yellow-600">Yellow</span> = {pointCounts["yellow"]} points
                    </div>
                  </div>
                )}
                {activeSets.includes("red") && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div>
                      <span className="font-bold text-red-600">Red</span> = {pointCounts["red"]} zones
                    </div>
                  </div>
                )}
                {activeSets.includes("violet") && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <div>
                      <span className="font-bold text-purple-600">Violet</span> = {pointCounts["violet"]} zone
                    </div>
                  </div>
                )}
                {/* Total cumulé */}
                <div className="ml-6 font-semibold text-gray-900">
                  Total : {totalPoints} zones
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Timeline */}
      <div className="flex flex-col items-center w-[1000px] mt-12">
        <div className="mb-2 font-bold text-xl">{year}</div>
        <input
          type="range"
          min={1800}
          max={2100}
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="w-full h-2 bg-gray-400 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between w-full text-sm mt-2">
          <span>1800</span>
          <span>2100</span>
        </div>
      </div>

    </div>
  );
};

export default App;
