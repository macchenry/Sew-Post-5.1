import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DressSelection } from "../components/DressSelection";
import { Leaderboard } from "../components/Leaderboard";
import { AdModal } from "../components/AdModal";
import { VoteSummary } from "../components/VoteSummary";
import { CountdownTimer } from "../components/CountdownTimer";
import { Trophy } from "lucide-react";

import kenteGown from "../assets/images/kente_gown_1782307335160.jpg";
import ankaraDress from "../assets/images/ankara_dress_1782307348765.jpg";
import smockDress from "../assets/images/smock_dress_1782307362580.jpg";
import kabaSlit from "../assets/images/kaba_slit_1782307375426.jpg";

// Map product images for demo purposes
const MOCK_IMAGES: Record<string, string> = {
  "Royal Kente Gown": kenteGown,
  "Modern Ankara Flare": ankaraDress,
  "Northern Smock Couture": smockDress,
  "Kaba & Slit Elegance": kabaSlit,
};

export function CompetitionDetails() {
  const { id } = useParams<{ id: string }>();
  const [competition, setCompetition] = useState<any>(null);
  const [dresses, setDresses] = useState<any[]>([]);
  const [selectedDressId, setSelectedDressId] = useState<number | null>(null);
  const [isAdOpen, setIsAdOpen] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [userVote, setUserVote] = useState<{
    dressId: number;
    votes: number;
  } | null>(null);

  useEffect(() => {
    fetch(`/api/competitions/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCompetition(data);
        const mappedDresses = data.entries.map((entry: any) => ({
          id: entry.id, // entry id used for voting
          name: entry.product_name,
          description: `By ${entry.shop_name}`,
          image: entry.image_url || MOCK_IMAGES[entry.product_name] || kenteGown,
          votes: entry.votes,
          shopLogo: entry.shop_logo,
          shopName: entry.shop_name,
        }));
        setDresses(mappedDresses);
      })
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    try {
      const savedVote = localStorage.getItem(`sew-post-vote-${id}`);
      if (savedVote && savedVote !== "undefined") {
        const parsedVote = JSON.parse(savedVote);
        setHasVoted(true);
        setUserVote(parsedVote);
      }
    } catch (e) {
      console.error("Failed to parse saved vote:", e);
      localStorage.removeItem(`sew-post-vote-${id}`);
    }
  }, [id]);

  const handleDressSelect = (dressId: number) => {
    if (hasVoted) return;
    setSelectedDressId(dressId);
  };

  const handleVoteClick = () => {
    if (!selectedDressId) return;
    setIsAdOpen(true);
  };

  const handleAdComplete = async (votesEarned: number) => {
    setIsAdOpen(false);

    if (selectedDressId) {
      try {
        await fetch("/api/vote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            entryId: selectedDressId,
            votes: votesEarned,
          }),
        });

        // Update local state
        const newDresses = dresses.map((dress) =>
          dress.id === selectedDressId
            ? { ...dress, votes: dress.votes + votesEarned }
            : dress,
        );
        setDresses(newDresses);

        const voteData = { dressId: selectedDressId, votes: votesEarned };
        setUserVote(voteData);
        setHasVoted(true);

        // Persist to local storage
        localStorage.setItem(`sew-post-vote-${id}`, JSON.stringify(voteData));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleReset = () => {
    // For demo purposes, allow resetting
    localStorage.removeItem(`sew-post-vote-${id}`);
    setHasVoted(false);
    setUserVote(null);
    setSelectedDressId(null);
  };

  if (!competition)
    return <div className="py-20 text-center">Loading competition...</div>;

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 rounded-full text-sm font-medium text-stone-600 uppercase tracking-widest">
          <Trophy className="w-4 h-4" />
          {competition.status}
        </div>
        <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-stone-900">
          {competition.title}
        </h1>
        <p className="text-lg text-stone-600">{competition.description}</p>
        
        {competition.status === 'active' && competition.end_date && (
          <CountdownTimer endDate={competition.end_date} />
        )}
      </div>

      <div>
        {!competition.voting_enabled ? (
          <div className="space-y-12">
            <div className="bg-stone-50 border border-stone-200 rounded-3xl p-8 text-center">
              <h3 className="text-xl font-serif text-stone-900 mb-2">Voting is currently disabled</h3>
              <p className="text-stone-500">Voting is not available for this competition at this time.</p>
            </div>
            <Leaderboard entries={dresses} />
          </div>
        ) : !hasVoted ? (
          <div className="space-y-24">
            <DressSelection
              dresses={dresses}
              selectedDressId={selectedDressId}
              onSelect={handleDressSelect}
              onVoteClick={handleVoteClick}
            />
            <Leaderboard entries={dresses} />
          </div>
        ) : (
          <VoteSummary
            dresses={dresses}
            userVote={userVote}
            onReset={handleReset}
          />
        )}
      </div>

      <AdModal
        isOpen={isAdOpen}
        onClose={() => setIsAdOpen(false)}
        onComplete={handleAdComplete}
      />
    </div>
  );
}
