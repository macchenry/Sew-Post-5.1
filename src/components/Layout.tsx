import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Scissors,
  Store,
  Trophy,
  LayoutDashboard,
  Menu,
  X,
  Search,
  Heart,
  ShoppingBag,
  User,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

export function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/", icon: Trophy },
    { name: "Competitions", href: "/competitions", icon: Trophy },
    { name: "Shops & Brands", href: "/shops", icon: Store },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ];

  const [users, setUsers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  React.useEffect(() => {
    fetch('/api/mock/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        fetch('/api/users/me')
          .then(r => {
            if (r.ok) return r.json();
            return null;
          })
          .then(u => setCurrentUser(u))
          .catch(() => setCurrentUser(null));
      });
  }, []);

  const handleUserSwitch = async (userId: string) => {
    await fetch('/api/mock-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-stone-900 flex flex-col">
      {/* Top Premium Announcement Banner */}
      <div className="bg-stone-950 text-white text-[10px] sm:text-xs uppercase tracking-[0.18em] py-2 sm:py-2.5 px-4 text-center font-medium border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-6 overflow-hidden whitespace-nowrap">
          <span>Free Couture Shipping On Orders Over $150</span>
          <span className="hidden md:inline text-stone-700">•</span>
          <span className="hidden md:inline">Daily Design Competitions active</span>
          <span className="hidden md:inline text-stone-700">•</span>
          <span className="hidden md:inline">Double Your Votes By Watching Ad Showcases</span>
        </div>
      </div>

      {/* Luxury Sticky Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40 shadow-sm backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="bg-stone-900 p-2 rounded-full flex items-center justify-center text-stone-50 shadow-sm">
              <Scissors className="w-4 h-4" />
            </div>
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.18em] text-stone-900 uppercase">
              Sew & Post
            </span>
          </Link>

          {/* Search bar inside header (styled like C-STYLE) */}
          <div className="hidden lg:flex items-center max-w-xs xl:max-w-sm w-full bg-stone-50 border border-stone-200 rounded-full px-4.5 py-1.5 gap-2 group focus-within:border-stone-400 focus-within:bg-white transition-all">
            <Search className="w-4 h-4 text-stone-400 group-focus-within:text-stone-950 transition-colors" />
            <input 
              type="text" 
              placeholder="Search styles, brands, fabrics..." 
              className="text-xs text-stone-800 placeholder-stone-400 bg-transparent border-none outline-none w-full font-light"
            />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 shrink-0">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={clsx(
                  "text-[11px] lg:text-xs uppercase tracking-[0.15em] font-medium transition-colors pb-1",
                  location.pathname === item.href
                    ? "text-stone-950 font-semibold border-b border-stone-950"
                    : "text-stone-500 hover:text-stone-950",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Icons: Heart, Cart, User switcher */}
          <div className="flex items-center gap-4 shrink-0">
            <Link to="/dashboard" title="My Favorites" className="p-1.5 text-stone-500 hover:text-stone-950 hover:bg-stone-50 rounded-full transition-colors hidden sm:inline-block">
              <Heart className="w-4.5 h-4.5" />
            </Link>
            <Link to="/dashboard" title="Shopping Bag" className="p-1.5 text-stone-500 hover:text-stone-950 hover:bg-stone-50 rounded-full transition-colors relative hidden sm:inline-block">
              <ShoppingBag className="w-4.5 h-4.5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-stone-950 rounded-full"></span>
            </Link>

            {/* Premium Role Switcher Profile Icon */}
            <div className="flex items-center gap-1.5 border border-stone-200 hover:border-stone-300 rounded-full px-3 py-1.5 bg-stone-50 hover:bg-white transition-all shadow-xs">
              <User className="w-3.5 h-3.5 text-stone-600" />
              <select 
                className="text-xs bg-transparent border-none outline-none cursor-pointer text-stone-700 font-medium max-w-[100px] sm:max-w-[130px] pr-1.5 truncate"
                value={currentUser?.id || ""}
                onChange={(e) => handleUserSwitch(e.target.value)}
              >
                <option value="" disabled>Switch Role...</option>
                {users.map(u => (
                  <option key={u.id} value={u.id} className="text-stone-900">{u.name} ({u.role})</option>
                ))}
              </select>
            </div>

            {/* Mobile menu toggle */}
            <button
              className="p-1.5 md:hidden text-stone-500 hover:text-stone-950 hover:bg-stone-100 rounded-full transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-stone-200 px-6 py-4 space-y-3.5 shadow-md">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={clsx(
                  "flex items-center gap-3 px-4 py-2.5 rounded-full text-xs uppercase tracking-wider font-medium",
                  location.pathname === item.href
                    ? "bg-stone-950 text-white"
                    : "text-stone-600 hover:bg-stone-50",
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
            <div className="flex justify-around pt-3 border-t border-stone-100">
              <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-xs text-stone-500 font-medium">
                <Heart className="w-4 h-4" /> Favorites
              </Link>
              <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-xs text-stone-500 font-medium">
                <ShoppingBag className="w-4 h-4" /> Shopping Bag
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Outlet />
      </main>

      <footer className="bg-stone-900 text-stone-400 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm tracking-wide">
          <p className="font-serif italic text-lg mb-4 text-stone-300">
            "Style is a way to say who you are without having to speak."
          </p>
          <p>
            &copy; {new Date().getFullYear()} Sew & Post Platform. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
