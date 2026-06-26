import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Image as ImageIcon } from "lucide-react";

interface Competition {
  id: number;
  title: string;
  description: string;
  category: string;
  image_url: string;
  start_date: string;
  end_date: string;
  status: string;
}

export function Competitions() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [filter, setFilter] = useState("active");

  useEffect(() => {
    fetch("/api/competitions")
      .then((res) => res.json())
      .then((data) => setCompetitions(data))
      .catch((err) => console.error(err));
  }, []);

  const filteredCompetitions = competitions.filter(c => c.status === filter);

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-serif tracking-tight text-stone-900 mb-4">
            Competitions
          </h1>
          <p className="text-lg text-stone-500">
            Discover the latest fashion competitions. Enter your designs, vote for your favorites, and celebrate creativity.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-stone-200 overflow-x-auto pb-[1px] scrollbar-hide">
        {['active', 'upcoming', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-6 py-3 font-medium text-sm capitalize transition-colors border-b-2 whitespace-nowrap ${
              filter === status
                ? "border-stone-900 text-stone-900"
                : "border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300"
            }`}
          >
            {status} ({competitions.filter(c => c.status === status).length})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCompetitions.length === 0 ? (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-stone-200 rounded-3xl">
            <p className="text-stone-500 text-lg">No {filter} competitions at the moment.</p>
          </div>
        ) : (
          filteredCompetitions.map((comp) => (
            <Link
              key={comp.id}
              to={`/competitions/${comp.id}`}
              className="group block bg-white border border-stone-200 rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col"
            >
              <div className="aspect-[16/10] bg-stone-100 relative overflow-hidden">
                {comp.image_url ? (
                  <img loading="lazy" src={comp.image_url} alt={comp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-300">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span
                    className={`text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-full shadow-sm ${
                      comp.status === "active" ? "bg-green-500 text-white" : 
                      comp.status === "upcoming" ? "bg-blue-500 text-white" : 
                      "bg-stone-800 text-white"
                    }`}
                  >
                    {comp.status}
                  </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                {comp.category && (
                  <span className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-2 block">
                    {comp.category}
                  </span>
                )}
                <h3 className="text-2xl font-serif font-bold text-stone-900 group-hover:text-stone-600 transition-colors mb-3">
                  {comp.title}
                </h3>
                <p className="text-stone-500 line-clamp-2 mb-6">
                  {comp.description}
                </p>
                <div className="mt-auto pt-4 border-t border-stone-100 flex items-center justify-between text-sm text-stone-500">
                  <span className="flex items-center gap-2 font-medium">
                    <Calendar className="w-4 h-4 text-stone-400" /> 
                    {new Date(comp.end_date).toLocaleDateString()}
                  </span>
                  <span className="text-stone-900 font-bold group-hover:translate-x-1 transition-transform">
                    View Details &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
