import React from "react";
import { Check } from "lucide-react";
import { motion } from "motion/react";

interface Dress {
  id: number;
  name: string;
  image: string;
  description: string;
  votes: number;
}

interface DressSelectionProps {
  dresses: Dress[];
  selectedDressId: number | null;
  onSelect: (id: number) => void;
  onVoteClick: () => void;
}

export const DressSelection: React.FC<DressSelectionProps> = ({
  dresses,
  selectedDressId,
  onSelect,
  onVoteClick,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-stone-900 tracking-tight">
          The Final Collection
        </h2>
        <p className="text-lg text-stone-500 max-w-2xl mx-auto font-light">
          Select your favorite design below. Watching our sponsor's message will
          multiply your vote's impact on the final results.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {dresses.map((dress, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            key={dress.id}
            whileHover={{ y: -8 }}
            className={`group relative rounded-none overflow-hidden cursor-pointer transition-all duration-500 ${
              selectedDressId === dress.id
                ? "ring-4 ring-rose-900 ring-offset-4 bg-stone-100"
                : "hover:bg-stone-100"
            }`}
            onClick={() => onSelect(dress.id)}
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-stone-200">
              <img
                src={dress.image}
                alt={dress.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors duration-500" />

              {selectedDressId === dress.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 bg-rose-900 text-white rounded-full p-2 shadow-xl"
                >
                  <Check className="w-5 h-5" />
                </motion.div>
              )}
            </div>

            <div className="p-6 text-center">
              <h3 className="text-xl font-bold mb-2 uppercase tracking-wide text-stone-900">
                {dress.name}
              </h3>
              <p className="text-sm text-stone-500 mb-6 line-clamp-2 leading-relaxed font-light">
                {dress.description}
              </p>

              <div className="pt-4 border-t border-stone-200 flex justify-between items-center text-sm font-medium tracking-wider uppercase text-stone-500">
                <span>Current Standings</span>
                <span className="text-rose-900">
                  {dress.votes.toLocaleString()}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 flex justify-center">
        <button
          onClick={onVoteClick}
          disabled={!selectedDressId}
          className={`px-12 py-4 uppercase tracking-widest font-bold text-sm transition-all duration-300 ${
            selectedDressId
              ? "bg-stone-900 text-stone-50 hover:bg-stone-800 hover:shadow-xl hover:-translate-y-1"
              : "bg-stone-200 text-stone-400 cursor-not-allowed"
          }`}
        >
          {selectedDressId ? "Cast Your Vote" : "Select a Design"}
        </button>
      </div>
    </div>
  );
};
