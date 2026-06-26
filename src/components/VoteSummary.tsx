import React from "react";
import { motion } from "motion/react";
import { Share2, RefreshCw } from "lucide-react";

interface VoteSummaryProps {
  dresses: Array<{ id: number; name: string; votes: number; image: string }>;
  userVote: { dressId: number; votes: number } | null;
  onReset: () => void;
}

export const VoteSummary: React.FC<VoteSummaryProps> = ({
  dresses,
  userVote,
  onReset,
}) => {
  const sortedDresses = [...dresses].sort((a, b) => b.votes - a.votes);
  const userSelectedDress = dresses.find((d) => d.id === userVote?.dressId);

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-none shadow-2xl overflow-hidden border border-stone-200"
      >
        <div className="bg-stone-900 p-12 text-center text-stone-50">
          <h2 className="text-4xl font-bold mb-4 tracking-tight">
            Vote Successfully Cast
          </h2>
          <p className="text-stone-300 font-light text-lg">
            Thank you for participating. You contributed
            <span className="font-serif text-rose-400 text-2xl mx-2 italic">
              {userVote?.votes}
            </span>
            votes to
            <span className="font-bold text-white text-xl mx-2 uppercase tracking-wide">
              {userSelectedDress?.name}
            </span>
            .
          </p>
        </div>

        <div className="p-12">
          <h3 className="text-sm font-bold text-stone-400 tracking-widest uppercase mb-10 text-center">
            Live Standings
          </h3>

          <div className="space-y-8">
            {sortedDresses.map((dress, index) => (
              <div key={dress.id} className="relative group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                  <div className="flex items-center gap-4">
                    <span
                      className={`flex items-center justify-center w-6 h-6 text-sm font-serif italic ${
                        index === 0
                          ? "text-rose-900 font-bold text-xl"
                          : "text-stone-400"
                      }`}
                    >
                      #{index + 1}
                    </span>
                    <span
                      className={`font-bold uppercase tracking-wide ${index === 0 ? "text-stone-900" : "text-stone-600"}`}
                    >
                      {dress.name}
                    </span>
                    {userVote?.dressId === dress.id && (
                      <span className="text-[10px] bg-rose-100 text-rose-900 px-2 py-1 uppercase tracking-widest font-bold">
                        Your Pick
                      </span>
                    )}
                  </div>
                  <span
                    className={`font-serif italic ${index === 0 ? "text-rose-900 text-xl font-bold" : "text-stone-500"}`}
                  >
                    {dress.votes.toLocaleString()} votes
                  </span>
                </div>

                <div className="w-full bg-stone-100 h-1 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(dress.votes / (sortedDresses[0].votes || 1)) * 100}%`,
                    }}
                    transition={{
                      duration: 1.5,
                      delay: index * 0.1,
                      ease: "easeOut",
                    }}
                    className={`h-full ${
                      index === 0 ? "bg-rose-900" : "bg-stone-300"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-col sm:flex-row gap-4 justify-center pt-8 border-t border-stone-100">
            <button className="flex items-center justify-center gap-2 px-8 py-4 bg-stone-900 text-stone-50 uppercase tracking-widest text-xs font-bold hover:bg-stone-800 transition-colors">
              <Share2 className="w-4 h-4" />
              Share Results
            </button>
            <button
              onClick={onReset}
              className="flex items-center justify-center gap-2 px-8 py-4 border border-stone-200 text-stone-500 uppercase tracking-widest text-xs font-bold hover:bg-stone-50 hover:text-stone-900 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Demo Reset
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
