import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  ArrowUpRight, 
  Sparkles, 
  MessageSquare, 
  X, 
  Send 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Import authentic African fashion images
import kenteGown from "../assets/images/kente_gown_1782307335160.jpg";
import ankaraDress from "../assets/images/ankara_dress_1782307348765.jpg";
import smockDress from "../assets/images/smock_dress_1782307362580.jpg";
import kabaSlit from "../assets/images/kaba_slit_1782307375426.jpg";

// Map names to imported images for fallback
const MOCK_IMAGES: Record<string, string> = {
  "Royal Kente Gown": kenteGown,
  "Modern Ankara Flare": ankaraDress,
  "Northern Smock Couture": smockDress,
  "Kaba & Slit Elegance": kabaSlit,
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export function Home() {
  const navigate = useNavigate();
  const [activeEntries, setActiveEntries] = useState<any[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(true);

  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'model', text: string }>>([
    { role: 'model', text: "Akwaaba! I am S&P Beta, your personal African Fashion & Voting Buddy. Ask me about custom fabrics, local tailor shops, how to vote, or how watching ads boosts your favorite designer's score! How can I inspire your style today?" }
  ]);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Suggested questions
  const suggestionPills = [
    "How does vote boosting work?",
    "Suggest a dress for a traditional gala",
    "What is the difference between Ankara & Kente?",
    "List Ghanaian shops I can visit"
  ];

  // Load active competition entries dynamically from database
  useEffect(() => {
    setLoadingEntries(true);
    fetch('/api/competitions')
      .then(res => res.json())
      .then(comps => {
        // Find the active competition or default to the first one
        const activeComp = comps.find((c: any) => c.status === 'active') || comps[0];
        if (activeComp) {
          fetch(`/api/competitions/${activeComp.id}`)
            .then(res => res.json())
            .then(data => {
              if (data && data.entries) {
                setActiveEntries(data.entries);
              }
              setLoadingEntries(false);
            })
            .catch(() => setLoadingEntries(false));
        } else {
          setLoadingEntries(false);
        }
      })
      .catch(err => {
        console.error("Error loading entries:", err);
        setLoadingEntries(false);
      });
  }, []);

  // Scroll chatbot to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, chatLoading]);

  // Handle chatbot submit
  const handleChatSubmit = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    
    const userMessage = textToSend;
    setChatInput("");
    setChatHistory(prev => [...prev, { role: 'user', text: userMessage }]);
    setChatLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: chatHistory.map(h => ({ role: h.role === 'user' ? 'user' : 'model', text: h.text }))
        })
      });

      const data = await response.json();
      setChatHistory(prev => [...prev, { role: 'model', text: data.text || "I apologize, but I had trouble processing that request." }]);
    } catch (e) {
      console.error(e);
      setChatHistory(prev => [...prev, { role: 'model', text: "I'm having a bit of trouble connecting to the network. Please verify your connection!" }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#FAF6EE] min-h-screen font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="bg-[#202020] w-full text-white pt-12 pb-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Large Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative h-[400px] sm:h-[500px] lg:h-[600px] w-full rounded-[2rem] overflow-hidden shadow-2xl"
          >
             <img src={kabaSlit} alt="African Fashion Hero" className="w-full h-full object-cover object-top" />
             <div className="absolute inset-0 bg-stone-900/10"></div>
          </motion.div>
          
          {/* Right Content */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-8 relative z-10"
          >
            <motion.h1 variants={fadeInUp} className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-serif leading-[1.1] tracking-tight">
              Explore<br />Your Fashion<br />Style
            </motion.h1>
            
            <motion.div variants={fadeInUp} className="flex items-center gap-4">
               <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 shadow-lg shrink-0">
                 <img src={ankaraDress} alt="New Authentic Collections" className="w-full h-full object-cover" />
               </div>
               <span className="text-sm font-medium tracking-wide text-gray-300">New Authentic<br />Collections</span>
            </motion.div>
            
            <motion.p variants={fadeInUp} className="text-gray-400 max-w-md text-sm sm:text-base leading-relaxed font-light">
               Discover authentic prints, timeless patterns, and hand-tailored luxury from Africa's finest bespoke designer shops.
            </motion.p>
            
            <motion.div variants={fadeInUp}>
              <Link to="/competitions" className="inline-flex items-center justify-center bg-[#FF6A38] text-white px-8 py-3.5 rounded-full font-medium transition-all hover:bg-[#e55a28] hover:shadow-xl hover:-translate-y-0.5 shadow-lg shadow-[#FF6A38]/20">
                Shop Now <Sparkles className="ml-2 w-4 h-4" />
              </Link>
            </motion.div>
            
            {/* Small overlapping image on right */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              className="hidden lg:block absolute -right-12 top-1/2 -translate-y-1/2 w-48 h-64 rounded-2xl overflow-hidden border-4 border-[#202020] shadow-2xl z-20"
            >
               <img src={smockDress} alt="Accent Fashion" className="w-full h-full object-cover" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Ticker */}
      <div className="w-full bg-[#FF6A38] text-white py-3 flex overflow-hidden whitespace-nowrap shadow-md relative z-10">
         <div className="animate-marquee flex gap-4 text-xs sm:text-sm font-medium tracking-widest uppercase items-center">
            {Array.from({length: 10}).map((_, i) => (
              <React.Fragment key={i}>
                <span>Get Discount Up To 25%</span>
                <span className="mx-2 opacity-50">✻</span>
              </React.Fragment>
            ))}
         </div>
      </div>

      {/* 2. LATEST TOP FASHION */}
      <section className="py-24 sm:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
         <motion.div
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, margin: "-100px" }}
           variants={fadeInUp}
         >
           <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#202020] max-w-2xl mx-auto leading-[1.15] tracking-tight">
              Latest Top <br />
              <span className="text-[#FF6A38] italic">African</span> <br />
              Bespoke Fashion
           </h2>
           <div className="mt-10 relative z-10">
              <Link to="/shops" className="inline-block bg-[#FF6A38] text-white px-8 py-3.5 rounded-full text-sm font-medium transition-all hover:bg-[#e55a28] hover:shadow-xl shadow-lg shadow-[#FF6A38]/20">
                View all categories
              </Link>
           </div>
         </motion.div>
         
         {/* Images on sides - Absolute positioning */}
         <motion.div 
           initial={{ opacity: 0, x: -50 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 1, ease: "easeOut" }}
           className="hidden lg:block absolute left-4 xl:left-8 top-1/2 -translate-y-1/2 w-[22rem] h-[28rem] rounded-[2rem] overflow-hidden shadow-2xl"
         >
            <img src={ankaraDress} alt="Modern Ankara Flare" className="w-full h-full object-cover object-center" />
         </motion.div>
         <motion.div 
           initial={{ opacity: 0, x: 50 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 1, ease: "easeOut" }}
           className="hidden lg:block absolute right-4 xl:right-8 top-1/2 -translate-y-1/2 w-[22rem] h-[28rem] rounded-[2rem] overflow-hidden shadow-2xl"
         >
            <img src={kenteGown} alt="Royal Kente Gown" className="w-full h-full object-cover object-top" />
         </motion.div>
      </section>

      {/* 3. NEW COLLECTIONS */}
      <section className="py-16 sm:py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
          >
            <motion.div variants={fadeInUp} className="lg:col-span-4 space-y-6">
              <span className="text-[#FF6A38] font-medium text-xs sm:text-sm tracking-widest uppercase block">New Collections</span>
              <h2 className="text-4xl sm:text-5xl font-serif text-[#202020] leading-tight">Authentic<br />Collection</h2>
              <p className="text-gray-500 text-sm leading-relaxed max-w-sm font-light">
                Discover vibrant prints and hand-tailored luxury that celebrate African heritage with a modern twist.
              </p>
              <div className="pt-2">
                <Link to="/competitions" className="inline-flex items-center gap-3 text-[#202020] text-sm font-medium group">
                  <span className="border-b-2 border-transparent group-hover:border-[#202020] transition-colors pb-0.5">See more pieces<br />for this arrival</span>
                  <div className="w-10 h-10 rounded-full bg-[#FF6A38] flex items-center justify-center text-white group-hover:scale-105 group-hover:shadow-lg transition-all shadow-[#FF6A38]/20">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </Link>
              </div>
            </motion.div>
            
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <motion.div variants={fadeInUp} className="space-y-5 group cursor-pointer" onClick={() => navigate('/shops?category=Modern')}>
                 <div className="aspect-[3/4] sm:aspect-auto sm:h-[450px] rounded-[2rem] overflow-hidden bg-stone-100 shadow-md group-hover:shadow-xl transition-shadow duration-300">
                   <img src={ankaraDress} alt="Ankara Summer Styles" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                 </div>
                 <div className="flex items-center justify-between px-2">
                   <h3 className="font-serif text-lg text-[#202020] font-medium max-w-[150px] leading-tight">Ankara Summer Styles</h3>
                   <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 group-hover:bg-[#202020] group-hover:text-white group-hover:border-[#202020] transition-all">
                     <ArrowUpRight className="w-5 h-5"/>
                   </div>
                 </div>
              </motion.div>
              
              <motion.div variants={fadeInUp} className="space-y-5 group cursor-pointer" onClick={() => navigate('/shops?category=Bespoke')}>
                 <div className="aspect-[3/4] sm:aspect-auto sm:h-[450px] rounded-[2rem] overflow-hidden bg-stone-100 shadow-md group-hover:shadow-xl transition-shadow duration-300">
                   <img src={smockDress} alt="Northern Smock Elegance" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                 </div>
                 <div className="flex items-center justify-between px-2">
                   <h3 className="font-serif text-lg text-[#202020] font-medium max-w-[150px] leading-tight">Northern Smock Elegance</h3>
                   <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 group-hover:bg-[#202020] group-hover:text-white group-hover:border-[#202020] transition-all">
                     <ArrowUpRight className="w-5 h-5"/>
                   </div>
                 </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. OUR BEST SELLER */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-[#FF6A38] font-medium text-xs sm:text-sm tracking-widest uppercase block">New Collections</span>
              <h2 className="text-4xl sm:text-5xl font-serif text-[#202020] mt-2 tracking-tight">Our Best Seller</h2>
            </div>
            <p className="text-gray-500 text-sm max-w-xs md:text-right font-light leading-relaxed">
              Handpicked bespoke designs favored by our community. Discover the finest craftsmanship.
            </p>
          </motion.div>
          
          {loadingEntries ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="animate-pulse bg-white rounded-2xl h-80"></div>
              ))}
            </div>
          ) : activeEntries.length === 0 ? (
            <motion.div variants={fadeInUp} className="text-center py-16 bg-white rounded-3xl border border-stone-100">
              <p className="text-stone-500 text-sm font-light">No best sellers found yet. Explore boutique shops directly!</p>
              <Link to="/shops" className="inline-block bg-[#202020] text-white px-6 py-3 rounded-full text-sm font-medium mt-4">Browse Shops</Link>
            </motion.div>
          ) : (
            <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {activeEntries.slice(0, 4).map((entry) => {
                const displayImg = MOCK_IMAGES[entry.product_name] || entry.image_url || kenteGown;
                return (
                  <motion.div 
                    variants={fadeInUp}
                    key={entry.id} 
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col group cursor-pointer"
                    onClick={() => navigate(`/competitions/${entry.competition_id}`)}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
                      <img 
                        loading="lazy" 
                        src={displayImg} 
                        alt={entry.product_name} 
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" 
                      />
                    </div>
                    <div className="p-5 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium mb-1">{entry.shop_name}</p>
                        <h3 className="font-serif text-base font-bold text-[#202020] leading-snug line-clamp-1">
                          {entry.product_name}
                        </h3>
                      </div>
                      <p className="font-sans text-[#FF6A38] font-bold">${entry.price?.toFixed(2) || '150.00'}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* 5. DEALS OF THE MONTH */}
      <section className="bg-[#202020] text-white overflow-hidden">
         <motion.div 
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, margin: "-100px" }}
           variants={staggerContainer}
           className="max-w-7xl mx-auto flex flex-col md:flex-row items-center"
         >
            <motion.div variants={fadeInUp} className="w-full md:w-1/2 p-8 md:p-16 lg:p-24 flex justify-center relative">
               <div className="relative w-64 h-80 sm:w-80 sm:h-[26rem] rounded-[2rem] overflow-hidden shadow-2xl z-10 transform -rotate-2">
                 <img src={kenteGown} alt="Deal of the Month" className="w-full h-full object-cover object-top" />
               </div>
               {/* Decorative background circle */}
               <motion.div 
                 initial={{ scale: 0.8, opacity: 0 }}
                 whileInView={{ scale: 1, opacity: 0.2 }}
                 transition={{ duration: 1.5, ease: "easeOut" }}
                 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-[#FF6A38] rounded-full blur-[100px]"
               ></motion.div>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="w-full md:w-1/2 p-8 md:p-16 lg:p-24 space-y-8 text-center md:text-left z-10 relative">
               <h2 className="text-4xl sm:text-5xl font-serif tracking-tight text-white">Deals of the Month</h2>
               <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-md mx-auto md:mx-0 font-light">
                 Vote and boost your favorite designers this month to unlock exclusive discounts on their latest bespoke collections.
               </p>
               
               <div className="flex gap-4 justify-center md:justify-start py-4">
                  <div className="text-center">
                    <div className="text-4xl sm:text-5xl font-light text-white">09</div>
                    <div className="text-[10px] text-gray-400 uppercase mt-2 tracking-widest font-medium">Hours</div>
                  </div>
                  <div className="text-4xl sm:text-5xl font-light text-[#FF6A38]">:</div>
                  <div className="text-center">
                    <div className="text-4xl sm:text-5xl font-light text-white">24</div>
                    <div className="text-[10px] text-gray-400 uppercase mt-2 tracking-widest font-medium">Minutes</div>
                  </div>
                  <div className="text-4xl sm:text-5xl font-light text-[#FF6A38]">:</div>
                  <div className="text-center">
                    <div className="text-4xl sm:text-5xl font-light text-white">46</div>
                    <div className="text-[10px] text-gray-400 uppercase mt-2 tracking-widest font-medium">Seconds</div>
                  </div>
               </div>
               
               <div>
                 <Link to="/products" className="inline-block bg-[#FF6A38] text-white px-8 py-3.5 rounded-full text-sm font-medium transition-all hover:bg-[#e55a28] hover:shadow-xl shadow-lg shadow-[#FF6A38]/20">
                   Shop All Product <ArrowRight className="inline ml-1 w-4 h-4" />
                 </Link>
               </div>
            </motion.div>
         </motion.div>
      </section>

      {/* 6. GET TO KNOW MORE ABOUT US */}
      <section className="py-24 sm:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <motion.div 
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, margin: "-100px" }}
           variants={staggerContainer}
         >
           <motion.div variants={fadeInUp} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
              <div className="md:w-1/2">
                 <span className="text-[#FF6A38] font-medium text-xs sm:text-sm tracking-widest uppercase block">New Collections</span>
                 <h2 className="text-4xl sm:text-5xl font-serif text-[#202020] mt-2 tracking-tight leading-tight">Get to know<br />More About Us</h2>
              </div>
              <div className="md:w-1/2 text-gray-500 text-sm sm:text-base leading-relaxed font-light md:border-l-2 border-stone-200 md:pl-10">
                 We connect fashion lovers with authentic African tailors and designers. Vote for your favorite competition pieces, boost their scores by engaging with creative showcases, and purchase bespoke apparel directly from the artisans who craft them.
              </div>
           </motion.div>
           <motion.div 
             variants={fadeInUp}
             className="w-full h-64 sm:h-96 md:h-[32rem] rounded-[2rem] overflow-hidden bg-stone-100 shadow-2xl"
           >
              <img src={kabaSlit} alt="About Us Fashion" className="w-full h-full object-cover object-top hover:scale-[1.02] transition-transform duration-700" />
           </motion.div>
         </motion.div>
      </section>

      {/* 7. FLOATING CHATBOT ASSISTANT (The S&P Shopping/Voting Buddy) */}
      <div className="fixed bottom-6 right-6 z-50">
        
        {/* Toggle Button */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-[#202020] hover:bg-black text-white rounded-full p-4 shadow-2xl flex items-center justify-center relative group focus:outline-none transition-all active:scale-95"
        >
          {isChatOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <MessageSquare className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6A38] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#FF6A38]"></span>
              </span>
            </>
          )}
        </button>

        {/* Chat Window */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute bottom-20 right-0 w-[350px] sm:w-[400px] h-[550px] bg-white border border-stone-200 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col z-50"
            >
              {/* Chat Header */}
              <div className="bg-[#202020] p-6 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-stone-800 p-2 rounded-full">
                    <Sparkles className="w-4 h-4 text-[#FF6A38]" />
                  </div>
                  <div className="text-left">
                    <p className="font-serif font-bold text-base tracking-wide flex items-center gap-1.5">
                      S&P Beta <span className="bg-[#FF6A38] text-white text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded font-sans font-bold">AI Helper</span>
                    </p>
                    <p className="text-[10px] text-gray-400 font-light">Sew & Post Smart Stylist</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="text-gray-400 hover:text-white p-1 hover:bg-stone-800 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-6 overflow-y-auto bg-[#FAF6EE] space-y-4 scrollbar-hide text-left">
                {chatHistory.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-[#202020] text-white rounded-br-none' 
                          : 'bg-white border border-stone-200 text-[#202020] rounded-bl-none shadow-xs'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                ))}
                
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-stone-200 rounded-2xl rounded-bl-none px-4 py-3 text-xs text-gray-500 shadow-xs flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#FF6A38] rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-[#FF6A38] rounded-full animate-bounce delay-100"></span>
                      <span className="w-1.5 h-1.5 bg-[#FF6A38] rounded-full animate-bounce delay-200"></span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Suggestion Pills */}
              <div className="p-4 bg-white border-t border-stone-100 text-left">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-2 ml-1">Suggestions</p>
                <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto scrollbar-hide">
                  {suggestionPills.map((pill) => (
                    <button
                      key={pill}
                      onClick={() => handleChatSubmit(pill)}
                      className="text-[10px] text-gray-600 hover:text-[#202020] bg-stone-50 hover:bg-stone-100 border border-stone-200 px-3 py-1.5 rounded-full transition-colors font-medium cursor-pointer"
                    >
                      {pill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input form */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleChatSubmit(chatInput);
                }}
                className="p-4 border-t border-stone-200 bg-white flex items-center gap-2"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about fabrics, voting rules, shops..."
                  className="flex-1 bg-stone-50 border border-stone-200 rounded-full px-4.5 py-2.5 text-xs focus:ring-1 focus:ring-[#202020] focus:bg-white outline-none font-light"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || chatLoading}
                  className="bg-[#FF6A38] hover:bg-[#e55a28] disabled:bg-gray-200 text-white rounded-full p-2.5 flex items-center justify-center transition-colors shadow-xs active:scale-95 disabled:scale-100 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}

