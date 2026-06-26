import React, { useState, useEffect } from "react";
import { X, Play, Award } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (votes: number) => void;
}

export const AdModal: React.FC<AdModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setTimeLeft(30);
      setIsPlaying(false);
      setShowPrompt(true);
    } else {
      setIsPlaying(false);
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeLeft]);

  const handleSkip = () => {
    const timeWatched = 30 - timeLeft;
    let votes = 1;
    if (timeWatched >= 30) votes = 3;
    else if (timeWatched >= 15) votes = 2;

    onComplete(votes);
  };

  const startAd = () => {
    setShowPrompt(false);
    setIsPlaying(true);
  };

  const getRewardText = () => {
    const timeWatched = 30 - timeLeft;
    if (timeWatched >= 30) return "3 Votes (Maximum Reward!)";
    if (timeWatched >= 15) return "2 Votes (Good!)";
    return "1 Vote (Basic)";
  };

  const getButtonText = () => {
    const timeWatched = 30 - timeLeft;
    if (timeWatched >= 30) return "Claim 3 Votes";
    if (timeWatched >= 15) return "Skip & Claim 2 Votes";
    return "Skip & Claim 1 Vote";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="ad-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <motion.div
            key="ad-modal-content"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative"
          >
            {showPrompt ? (
              <div className="p-8 text-center bg-white">
                <div className="mx-auto bg-stone-100 w-16 h-16 flex items-center justify-center rounded-full mb-6">
                  <Award className="w-8 h-8 text-rose-900" />
                </div>
                <h2 className="text-3xl font-serif font-bold mb-4 text-stone-900">
                  Boost Your Vote
                </h2>
                <p className="text-stone-600 mb-8 font-light">
                  Watch a quick sponsor message to multiply your voting power.
                </p>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm uppercase tracking-widest font-bold text-stone-500 mb-2 border-b border-stone-100 pb-2">
                    <span>Action</span>
                    <span>Reward</span>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-stone-700">Skip Ad</span>
                    <span className="font-serif italic text-rose-900 font-bold">
                      1 Vote
                    </span>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-stone-700">Watch 15s</span>
                    <span className="font-serif italic text-rose-900 font-bold">
                      2 Votes
                    </span>
                  </div>
                  <div className="flex justify-between text-sm items-center pb-6">
                    <span className="text-stone-700">Watch 30s</span>
                    <span className="font-serif italic text-rose-900 font-bold">
                      3 Votes
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-6">
                  <button
                    onClick={startAd}
                    className="w-full py-4 uppercase tracking-widest font-bold text-xs transition-all bg-stone-900 text-stone-50 hover:bg-stone-800 shadow-lg"
                  >
                    Watch Ad (Up to 3 Votes)
                  </button>
                  <button
                    onClick={() => onComplete(1)}
                    className="w-full py-4 uppercase tracking-widest font-bold text-xs transition-all bg-white border border-stone-200 text-stone-500 hover:bg-stone-50 hover:text-stone-900"
                  >
                    Skip Ad (1 Vote)
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="bg-stone-900 p-6 text-stone-50 flex justify-between items-center border-b border-stone-800">
                  <h3 className="font-bold tracking-widest uppercase text-sm flex items-center gap-3">
                    <Play className="w-4 h-4 fill-current text-rose-500" />
                    Sponsor Message
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="font-serif italic text-rose-400 text-lg">
                      00:{timeLeft.toString().padStart(2, "0")}
                    </div>
                    <button
                      onClick={onClose}
                      className="text-stone-400 hover:text-stone-50 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Ad Content Placeholder */}
                <div className="aspect-video bg-stone-100 flex flex-col items-center justify-center text-stone-900 p-8 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-stone-200/50" />
                  <div className="relative z-10 max-w-sm">
                    <h2 className="text-3xl font-serif font-bold mb-4">
                      Maison de Couture
                    </h2>
                    <p className="text-stone-600 font-light mb-8">
                      Discover the new standard of elegance. Shop the Spring
                      2026 collection today.
                    </p>
                    <div className="inline-block border border-stone-900 px-6 py-3 uppercase tracking-widest text-xs font-bold text-stone-900">
                      Shop Collection
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-stone-300">
                    <motion.div
                      className="h-full bg-rose-900"
                      initial={{ width: "0%" }}
                      animate={{ width: `${((30 - timeLeft) / 30) * 100}%` }}
                      transition={{ duration: 1, ease: "linear" }}
                    />
                  </div>
                </div>

                {/* Footer / Controls */}
                <div className="p-8 bg-white">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3 text-sm text-stone-600">
                      <Award
                        className={`w-5 h-5 ${timeLeft <= 15 ? "text-rose-500" : "text-stone-300"}`}
                      />
                      <span className="uppercase tracking-widest text-xs font-bold">
                        Reward Status:{" "}
                        <span className="text-rose-900 font-serif italic text-sm ml-1">
                          {getRewardText()}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="w-full bg-stone-100 h-1">
                      <div
                        className={`h-1 transition-all duration-500 ${
                          timeLeft === 0
                            ? "bg-stone-900"
                            : timeLeft <= 15
                              ? "bg-rose-500"
                              : "bg-stone-300"
                        }`}
                        style={{ width: `${((30 - timeLeft) / 30) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-stone-400">
                      <span>Start (1 Vote)</span>
                      <span>15s (2 Votes)</span>
                      <span>30s (3 Votes)</span>
                    </div>
                  </div>

                  <button
                    onClick={handleSkip}
                    className={`w-full mt-10 py-4 uppercase tracking-widest font-bold text-xs transition-all flex items-center justify-center gap-3 ${
                      timeLeft === 0
                        ? "bg-stone-900 text-stone-50 hover:bg-stone-800 shadow-xl"
                        : "bg-white border border-stone-200 text-stone-500 hover:bg-stone-50 hover:text-stone-900"
                    }`}
                  >
                    {timeLeft === 0 ? (
                      <>
                        <Check className="w-4 h-4" />
                        Claim 3 Votes
                      </>
                    ) : (
                      getButtonText()
                    )}
                  </button>

                  {timeLeft > 0 && (
                    <p className="text-center text-xs font-light text-stone-400 mt-4 italic">
                      Watch longer to increase your vote impact.
                    </p>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

function Check(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
