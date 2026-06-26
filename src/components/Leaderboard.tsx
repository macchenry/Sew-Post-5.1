import React from 'react';
import { Trophy } from 'lucide-react';

interface Entry {
  id: number;
  name: string;
  description: string;
  image: string;
  votes: number;
}

interface LeaderboardProps {
  entries: Entry[];
}

export function Leaderboard({ entries }: LeaderboardProps) {
  const sortedEntries = [...entries].sort((a, b) => b.votes - a.votes);

  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-8 md:p-12 shadow-sm">
      <div className="flex flex-col items-center mb-10 space-y-4 text-center">
        <div className="bg-stone-50 p-4 rounded-full border border-stone-100">
          <Trophy className="w-8 h-8 text-stone-900" />
        </div>
        <h2 className="text-4xl font-serif font-bold text-stone-900 tracking-tight">Current Leaderboard</h2>
        <p className="text-stone-500 font-medium tracking-wide">Top performing competition entries</p>
      </div>

      <div className="space-y-6">
        {sortedEntries.map((entry, index) => (
          <div key={entry.id} className="flex items-center gap-4 md:gap-8 p-4 md:p-6 rounded-2xl border border-stone-100 bg-stone-50/50 hover:bg-white hover:shadow-md transition-all">
            <div className="w-12 md:w-16 text-center shrink-0">
              <span className={`text-4xl font-serif font-bold ${index === 0 ? 'text-amber-600' : index === 1 ? 'text-stone-600' : index === 2 ? 'text-amber-800' : 'text-stone-300'}`}>
                {index + 1}
              </span>
            </div>
            
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-xl overflow-hidden shrink-0 border border-stone-200">
              <img loading="lazy" src={entry.image} alt={entry.name} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-xl md:text-2xl font-serif font-bold text-stone-900 truncate mb-1">{entry.name}</h3>
              <p className="text-sm text-stone-500 line-clamp-1 md:line-clamp-2">{entry.description}</p>
            </div>

            <div className="text-right shrink-0 px-2 md:px-4">
              <p className="text-2xl md:text-3xl font-serif font-bold text-stone-900">{entry.votes.toLocaleString()}</p>
              <p className="text-xs font-medium tracking-widest text-stone-400 uppercase mt-1">Votes</p>
            </div>
          </div>
        ))}
        {entries.length === 0 && (
          <div className="text-center py-12 text-stone-500 font-serif text-lg">
            No entries found.
          </div>
        )}
      </div>
    </div>
  );
}
