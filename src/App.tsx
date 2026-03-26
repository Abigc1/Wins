/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, Copy, Crown, ShieldCheck, TrendingUp, Zap, Clock, Trophy, Lock, Bell, BellOff, Settings, CheckCircle2, Share2, Gift, Users, ChevronDown, ChevronUp, Info, AlertTriangle, PieChart, BarChart3, Wallet, Activity, Shield, Target } from "lucide-react";
import { FOLDERS } from "./constants";
import { cn } from "./lib/utils";
import { useState, useEffect, ReactNode } from "react";
import { MatchDetail } from "./types";

// --- Components ---

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-charcoal flex flex-col items-center justify-center"
    >
      <div className="relative">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-32 h-32 rounded-full border-2 border-gold/20 flex items-center justify-center"
        >
          <motion.div
            animate={{ 
              rotate: [0, 180, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-24 h-24 rounded-full gold-gradient flex items-center justify-center"
          >
            <Lock className="w-10 h-10 text-charcoal" />
          </motion.div>
        </motion.div>
        
        {/* Pulsing rings */}
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
            className="absolute inset-0 rounded-full border border-gold/30"
          />
        ))}
      </div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center"
      >
        <h2 className="text-xl font-bold tracking-[0.3em] gold-text-gradient uppercase mb-2">
          Initializing Vault
        </h2>
        <div className="w-48 h-[1px] bg-white/10 mx-auto relative overflow-hidden">
          <motion.div
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 gold-gradient"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

const AtmosphericBackground = () => (
  <div className="atmosphere">
    <motion.div 
      animate={{ 
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
        x: [0, 50, 0],
        y: [0, 30, 0]
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gold/10 blur-[120px]"
    />
    <motion.div 
      animate={{ 
        scale: [1, 1.3, 1],
        opacity: [0.2, 0.4, 0.2],
        x: [0, -40, 0],
        y: [0, -60, 0]
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gold/5 blur-[150px]"
    />
  </div>
);

// --- Notification System ---

interface NotificationPref {
  matchAlerts: boolean;
  updates: boolean;
  vipAnnouncements: boolean;
}

const NotificationToast = ({ message, type, onClose }: { message: string, type: 'match' | 'update' | 'vip', onClose: () => void }) => {
  const icons = {
    match: <Trophy className="w-5 h-5 text-gold" />,
    update: <Zap className="w-5 h-5 text-blue-400" />,
    vip: <Crown className="w-5 h-5 text-gold" />
  };

  const titles = {
    match: "Match Alert",
    update: "System Update",
    vip: "VIP Announcement"
  };

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      className="fixed top-6 right-6 z-[100] w-80 glass-card p-4 border-gold/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex gap-4 items-start"
    >
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
        {icons[type]}
      </div>
      <div className="flex-1">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gold mb-1">{titles[type]}</h4>
        <p className="text-xs font-medium text-white/80 leading-relaxed">{message}</p>
      </div>
      <button onClick={onClose} className="text-white/20 hover:text-white transition-colors">
        <ChevronLeft className="w-4 h-4 rotate-180" />
      </button>
    </motion.div>
  );
};

const NotificationSettings = ({ isOpen, onClose, prefs, setPrefs }: { 
  isOpen: boolean, 
  onClose: () => void, 
  prefs: NotificationPref, 
  setPrefs: (p: NotificationPref) => void 
}) => {
  if (!isOpen) return null;

  const toggle = (key: keyof NotificationPref) => {
    setPrefs({ ...prefs, [key]: !prefs[key] });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-charcoal/80 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-md glass-card p-8 border-gold/20"
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-gold" />
            <h3 className="text-xl font-black tracking-tighter gold-text-gradient">NOTIFICATIONS</h3>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-xl glass-card flex items-center justify-center">
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {[
            { id: 'matchAlerts', label: 'Match Alerts', desc: 'Real-time updates on your selected matches', icon: Trophy },
            { id: 'updates', label: 'Important Updates', desc: 'Critical system and strategy improvements', icon: Zap },
            { id: 'vipAnnouncements', label: 'VIP Announcements', desc: 'Exclusive high-yield vault releases', icon: Crown },
          ].map((item) => {
            const Icon = item.icon;
            const active = prefs[item.id as keyof NotificationPref];
            return (
              <div 
                key={item.id}
                onClick={() => toggle(item.id as keyof NotificationPref)}
                className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 cursor-pointer hover:border-gold/20 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${active ? 'bg-gold/20 text-gold' : 'bg-white/5 text-white/20'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest">{item.label}</h4>
                    <p className="text-[9px] text-white/30 font-medium">{item.desc}</p>
                  </div>
                </div>
                <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-500 ${active ? 'bg-gold' : 'bg-white/10'}`}>
                  <motion.div 
                    animate={{ x: active ? 24 : 0 }}
                    className="w-4 h-4 rounded-full bg-white shadow-lg"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-8 py-4 rounded-xl gold-gradient text-charcoal font-black tracking-[0.3em] uppercase shadow-[0_20px_40px_rgba(212,175,55,0.2)] shimmer-btn"
        >
          Save Preferences
        </button>
      </motion.div>
    </motion.div>
  );
};

const PageWrapper = ({ children }: { children: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1.02 }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className="min-h-screen w-full max-w-md mx-auto px-6 py-8 relative z-10"
  >
    {children}
  </motion.div>
);

// --- Pages ---

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center h-[80vh] text-center">
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 12, stiffness: 100 }}
          className="w-28 h-28 mb-10 rounded-full gold-gradient flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.4)] animate-float"
        >
          <Trophy className="w-14 h-14 text-charcoal" />
        </motion.div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-6xl font-black tracking-tighter mb-4 gold-text-gradient"
        >
          VICTORY<br />VAULT
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white/40 text-[10px] font-bold tracking-[0.4em] uppercase mb-16"
        >
          Architectural Sports Analysis
        </motion.p>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          onClick={() => navigate("/main")}
          className="w-full py-5 rounded-2xl border border-gold/20 text-gold font-bold tracking-[0.2em] uppercase hover:bg-gold hover:text-charcoal hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] transition-all duration-500 shimmer-btn"
        >
          Enter the Vault
        </motion.button>
      </div>
    </PageWrapper>
  );
};

const MainPage = ({ onOpenNotifs }: { onOpenNotifs: () => void }) => {
  const navigate = useNavigate();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <PageWrapper>
      <header className="mb-12 flex justify-between items-end">
        <div>
          <motion.h2 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-3xl font-black tracking-tight"
          >
            The Vault
          </motion.h2>
          <motion.p 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-gold/50 text-[9px] font-bold uppercase tracking-[0.3em]"
          >
            Select Strategy
          </motion.p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onOpenNotifs}
            className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center border-gold/10 relative group"
          >
            <Bell className="w-6 h-6 text-white/40 group-hover:text-gold transition-colors" />
            <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
          </motion.button>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center border-gold/10"
          >
            <ShieldCheck className="w-6 h-6 text-gold" />
          </motion.div>
        </div>
      </header>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-4 mb-6"
      >
        {FOLDERS.map((folder, index) => (
          <motion.button
            key={folder.id}
            variants={item}
            whileHover={{ 
              y: -5, 
              scale: 1.02,
              borderColor: "rgba(212, 175, 55, 0.5)",
              backgroundColor: "rgba(212, 175, 55, 0.1)",
              boxShadow: "0 8px 30px rgba(212, 175, 55, 0.15)"
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            onClick={() => navigate(`/details/${folder.id}`)}
            className="glass-card p-6 text-left flex flex-col justify-between h-36 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-gold/5 rounded-full blur-2xl group-hover:bg-gold/10 transition-all duration-500" />
            
            <div className="flex justify-between items-start relative z-10">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                <Zap className="w-4 h-4 text-gold/40 group-hover:text-gold transition-colors" />
              </div>
              <span className="text-[10px] text-white/10 font-mono group-hover:text-gold/20 transition-colors">0{index + 1}</span>
            </div>
            <span className="text-[11px] font-black leading-tight tracking-widest uppercase relative z-10">
              {folder.name}
            </span>
          </motion.button>
        ))}
      </motion.div>

      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        whileHover={{ scale: 1.02, y: -2, borderColor: "rgba(212, 175, 55, 0.3)" }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate("/strategy")}
        className="w-full glass-card p-6 mb-4 flex items-center justify-between group border-gold/10"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center border border-gold/20">
            <BarChart3 className="w-5 h-5 text-gold" />
          </div>
          <div className="text-left">
            <h4 className="text-xs font-black uppercase tracking-[0.2em]">Strategy Vault</h4>
            <p className="text-[9px] text-white/30 font-bold uppercase tracking-[0.3em]">30-Day Compounding Plan</p>
          </div>
        </div>
        <ChevronLeft className="w-5 h-5 text-white/20 group-hover:text-gold transition-colors rotate-180" />
      </motion.button>

      <motion.button
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        whileHover={{ scale: 1.02, y: -2, boxShadow: "0 0 40px rgba(212, 175, 55, 0.25)" }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate("/vip")}
        className="w-full h-24 rounded-3xl gold-gradient p-[1px] shadow-[0_20px_40px_rgba(0,0,0,0.4)] group"
      >
        <div className="w-full h-full bg-charcoal rounded-[23px] flex items-center justify-center gap-5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Crown className="w-8 h-8 text-gold" />
          </motion.div>
          <span className="text-xl font-black tracking-[0.25em] gold-text-gradient uppercase">
            VIP GOLD VAULT
          </span>
        </div>
      </motion.button>
    </PageWrapper>
  );
};

const TeamLogo = ({ teamName, className }: { teamName?: string, className?: string }) => {
  const seed = teamName || "placeholder";
  return (
    <div className={cn("w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0", className)}>
      <img 
        src={`https://picsum.photos/seed/${seed}/32/32`} 
        alt={teamName} 
        className="w-full h-full object-cover opacity-80"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

const DetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const folder = FOLDERS.find(f => f.id === id);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"current" | "history">("current");
  const [historyFilter, setHistoryFilter] = useState<"all" | "7days">("all");
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);

  if (!folder) return <div>Not found</div>;

  const toggleExpand = (id: string) => {
    setExpandedMatchId(expandedMatchId === id ? null : id);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(folder.bookingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filterHistory = (matches: MatchDetail[]) => {
    if (historyFilter === "all") return matches;
    return matches.filter(match => {
      if (match.time === "Yesterday") return true;
      const matchDays = parseInt(match.time.split(" ")[0]);
      return !isNaN(matchDays) && matchDays <= 7;
    });
  };

  const displayMatches = activeTab === "current" ? folder.matches : filterHistory(folder.history);

  return (
    <PageWrapper>
      <header className="mb-8 flex items-center gap-5">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center border-gold/10"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
        <div>
          <h2 className="text-2xl font-black tracking-tight">{folder.name}</h2>
          <p className="text-gold/50 text-[9px] font-bold uppercase tracking-[0.3em]">Architectural Analysis</p>
        </div>
      </header>

      {/* Tab Switcher */}
      <div className="flex p-1.5 glass-card mb-10 border-gold/5">
        <button
          onClick={() => setActiveTab("current")}
          className={cn(
            "flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-500",
            activeTab === "current" ? "gold-gradient text-charcoal shadow-lg" : "text-white/30 hover:text-white/50"
          )}
        >
          Current
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={cn(
            "flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-500",
            activeTab === "history" ? "gold-gradient text-charcoal shadow-lg" : "text-white/30 hover:text-white/50"
          )}
        >
          History
        </button>
      </div>

      {/* Filter Switcher for History */}
      {activeTab === "history" && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 px-4 py-3 glass-card border-gold/10"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">History Filter</span>
          <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
            <button
              onClick={() => setHistoryFilter("all")}
              className={cn(
                "px-5 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all duration-500",
                historyFilter === "all" 
                  ? "gold-gradient text-charcoal shadow-lg" 
                  : "text-white/30 hover:text-white/50"
              )}
            >
              All Time
            </button>
            <button
              onClick={() => setHistoryFilter("7days")}
              className={cn(
                "px-5 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all duration-500",
                historyFilter === "7days" 
                  ? "gold-gradient text-charcoal shadow-lg" 
                  : "text-white/30 hover:text-white/50"
              )}
            >
              Last 7 Days
            </button>
          </div>
        </motion.div>
      )}

      <div className="space-y-5 mb-32">
        <AnimatePresence mode="popLayout">
          {displayMatches.map((match, idx) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => toggleExpand(match.id)}
              className="glass-card p-6 relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute top-0 left-0 w-1 h-full gold-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {activeTab === "history" && (
                <div className="absolute top-0 right-0 px-4 py-1.5 gold-gradient rounded-bl-2xl">
                  <span className="text-[9px] font-black text-charcoal uppercase tracking-widest">Settled</span>
                </div>
              )}

              <div className="absolute top-6 right-6 text-white/20 group-hover:text-gold transition-colors">
                {expandedMatchId === match.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
              
              <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-2.5 text-white/30">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-mono font-bold">{match.time}</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-gold/5 border border-gold/10">
                  <span className="text-[11px] font-black text-gold tracking-tighter">{match.odds} ODDS</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mb-3">
                <div className="flex -space-x-3">
                  <TeamLogo teamName={match.homeTeam} className="border-2 border-charcoal relative z-10" />
                  <TeamLogo teamName={match.awayTeam} className="border-2 border-charcoal relative z-0" />
                </div>
                <h3 className="text-base font-black tracking-wide uppercase group-hover:text-gold transition-colors duration-300 pr-8">
                  {match.matchName}
                </h3>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center">
                  <Trophy className="w-3.5 h-3.5 text-gold" />
                </div>
                <p className="text-xs text-white/50 font-bold uppercase tracking-[0.15em]">
                  {match.prediction}
                </p>
              </div>

              <AnimatePresence>
                {expandedMatchId === match.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-6 mt-6 border-t border-white/5 space-y-8">
                      {/* Lineups */}
                      {match.lineups && (
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gold mb-4">Tactical Lineups</h4>
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <span className="text-[8px] font-black text-white/20 uppercase tracking-widest block mb-2">Home</span>
                              {match.lineups.home.map((player, i) => (
                                <div key={i} className="text-[10px] text-white/60 font-medium">{player}</div>
                              ))}
                            </div>
                            <div className="space-y-2">
                              <span className="text-[8px] font-black text-white/20 uppercase tracking-widest block mb-2">Away</span>
                              {match.lineups.away.map((player, i) => (
                                <div key={i} className="text-[10px] text-white/60 font-medium">{player}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Recent Form */}
                      {match.recentForm && (
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gold mb-4">Recent Form</h4>
                          <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Home</span>
                              <div className="flex gap-1.5">
                                {match.recentForm.home.map((res, i) => (
                                  <div key={i} className={cn(
                                    "w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black",
                                    res === 'W' ? "bg-green-500/20 text-green-500" : res === 'L' ? "bg-red-500/20 text-red-500" : "bg-white/10 text-white/50"
                                  )}>{res}</div>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Away</span>
                              <div className="flex gap-1.5">
                                {match.recentForm.away.map((res, i) => (
                                  <div key={i} className={cn(
                                    "w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black",
                                    res === 'W' ? "bg-green-500/20 text-green-500" : res === 'L' ? "bg-red-500/20 text-red-500" : "bg-white/10 text-white/50"
                                  )}>{res}</div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Key Team Statistics */}
                      {match.stats && (
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gold mb-4">Key Team Statistics</h4>
                          <div className="grid grid-cols-2 gap-4">
                            {/* Home Stats */}
                            <div className="glass-card p-4 border-gold/5 bg-white/[0.01]">
                              <div className="flex items-center gap-2 mb-4">
                                <TeamLogo teamName={match.homeTeam} className="w-5 h-5" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Home</span>
                              </div>
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Target className="w-3 h-3 text-gold/60" />
                                    <span className="text-[8px] font-bold text-white/30 uppercase">Avg Goals</span>
                                  </div>
                                  <span className="text-[10px] font-black text-gold">{match.stats.home.avgGoals}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Shield className="w-3 h-3 text-gold/60" />
                                    <span className="text-[8px] font-bold text-white/30 uppercase">Defensive</span>
                                  </div>
                                  <span className="text-[10px] font-black text-gold">{match.stats.home.defensiveRecord}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Activity className="w-3 h-3 text-gold/60" />
                                    <span className="text-[8px] font-bold text-white/30 uppercase">Win Rate</span>
                                  </div>
                                  <span className="text-[10px] font-black text-gold">{match.stats.home.winRate}</span>
                                </div>
                              </div>
                            </div>

                            {/* Away Stats */}
                            <div className="glass-card p-4 border-gold/5 bg-white/[0.01]">
                              <div className="flex items-center gap-2 mb-4">
                                <TeamLogo teamName={match.awayTeam} className="w-5 h-5" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Away</span>
                              </div>
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Target className="w-3 h-3 text-gold/60" />
                                    <span className="text-[8px] font-bold text-white/30 uppercase">Avg Goals</span>
                                  </div>
                                  <span className="text-[10px] font-black text-gold">{match.stats.away.avgGoals}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Shield className="w-3 h-3 text-gold/60" />
                                    <span className="text-[8px] font-bold text-white/30 uppercase">Defensive</span>
                                  </div>
                                  <span className="text-[10px] font-black text-gold">{match.stats.away.defensiveRecord}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Activity className="w-3 h-3 text-gold/60" />
                                    <span className="text-[8px] font-bold text-white/30 uppercase">Win Rate</span>
                                  </div>
                                  <span className="text-[10px] font-black text-gold">{match.stats.away.winRate}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* H2H Statistics */}
                      {match.h2h && (
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gold mb-4">Head-to-Head Statistics</h4>
                          <div className="space-y-3">
                            {match.h2h.map((item, i) => (
                              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <span className="text-[9px] text-white/30 font-bold">{item.date}</span>
                                <span className="text-xs font-black tracking-widest">{item.score}</span>
                                <span className="text-[9px] text-gold font-black uppercase tracking-widest">{item.result}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {!match.lineups && !match.recentForm && !match.h2h && (
                        <div className="text-center py-4">
                          <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">Detailed analysis pending...</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {displayMatches.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Lock className="w-12 h-12 text-white/5 mx-auto mb-4" />
            <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.4em]">No history records</p>
          </motion.div>
        )}
      </div>

      {activeTab === "current" && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-8 left-6 right-6 max-w-md mx-auto z-50"
        >
          <div className="glass-card p-5 flex items-center justify-between gap-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-gold/10">
            <div className="flex flex-col">
              <span className="text-[9px] text-white/30 font-bold uppercase tracking-[0.3em] mb-1.5">Booking Code</span>
              <span className="text-base font-mono font-black tracking-[0.1em] gold-text-gradient">{folder.bookingCode}</span>
            </div>
            <button
              onClick={handleCopy}
              className={cn(
                "flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-500 shadow-xl shimmer-btn",
                copied ? "bg-green-500 text-white" : "gold-gradient text-charcoal"
              )}
            >
              {copied ? <ShieldCheck className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copied ? "Copied" : "Copy Code"}
            </button>
          </div>
        </motion.div>
      )}
    </PageWrapper>
  );
};

const StrategyPage = () => {
  const navigate = useNavigate();
  
  const phases = [
    { week: "Week 1", title: "Capital Growth", desc: "Build initial momentum with high-probability 1.30 odds.", color: "bg-blue-500/20 text-blue-400" },
    { week: "Week 2", title: "Interest Accrual", desc: "Scale the base capital while maintaining strict discipline.", color: "bg-gold/20 text-gold" },
    { week: "Week 3", title: "Compounding Gains", desc: "Exponential growth phase. Focus on risk mitigation.", color: "bg-purple-500/20 text-purple-400" },
    { week: "Week 4", title: "Profit Maximization", desc: "Final push to the target. Harvest points active.", color: "bg-green-500/20 text-green-400" }
  ];

  return (
    <PageWrapper>
      <header className="mb-10 flex items-center gap-6">
        <motion.button 
          whileHover={{ scale: 1.1, backgroundColor: "rgba(212, 175, 55, 0.15)" }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="w-14 h-14 rounded-2xl glass-card flex items-center justify-center border-gold/20"
        >
          <ChevronLeft className="w-7 h-7 text-gold" />
        </motion.button>
        <div>
          <h2 className="text-3xl font-black tracking-tighter gold-text-gradient leading-none mb-1">STRATEGY VAULT</h2>
          <p className="text-gold/40 text-[9px] font-black uppercase tracking-[0.5em]">30-Day Compounding Plan</p>
        </div>
      </header>

      <div className="space-y-8 mb-32">
        {/* Risk Management Warning */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card p-8 border-red-500/30 bg-red-500/5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4">
            <AlertTriangle className="w-8 h-8 text-red-500/20" />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
              <ShieldCheck className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-red-500">Risk Management Protocol</h3>
          </div>
          <p className="text-xs text-white/60 font-medium leading-relaxed mb-6">
            The VictoryVault strategy is built on mathematical precision, but sports analysis always carries inherent risk. Adhere to these protocols for sustainable growth.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <Wallet className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white mb-1">The Affordability Rule</h4>
                <p className="text-[9px] text-white/40 font-medium leading-relaxed">
                  ONLY allocate capital that you can afford to lose. This is an investment strategy, not a guaranteed return. Never use funds meant for essential living expenses.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <PieChart className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white mb-1">35/65 Harvest Strategy</h4>
                <p className="text-[9px] text-white/40 font-medium leading-relaxed">
                  At every harvest point (Day 10, 20, 30), withdraw 35% of total profits to your bank. Re-invest the remaining 65% as your new starting capital for the next phase. This ensures you secure gains while maintaining exponential growth.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Strategy Execution Guide */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 border-gold/20 relative overflow-hidden"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center border border-gold/20">
              <TrendingUp className="w-5 h-5 text-gold" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gold">Execution Guide</h3>
          </div>
          
          <div className="space-y-6">
            {[
              { step: "01", title: "Daily Stake", desc: "Stake your entire current capital on a single 1.30 odds ticket provided in the Vault." },
              { step: "02", title: "Compounding", desc: "If the bet wins, your new capital for the next day is the total payout (Stake × 1.30)." },
              { step: "03", title: "Harvesting", desc: "Every 10 days, stop and split your total balance: 35% to your bank, 65% back to the Vault." },
              { step: "04", title: "Repeat Cycle", desc: "Start the next 10-day phase using only the 65% re-investment capital." }
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-lg font-black text-gold/20 font-mono leading-none">{item.step}</span>
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-white mb-1">{item.title}</h4>
                  <p className="text-[10px] text-white/40 font-medium leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Visual Harvest Flow */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8 border-gold/10 bg-white/[0.01]"
        >
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-8 text-center">Profit Management Cycle</h4>
          
          <div className="relative flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-12">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center border-gold/20 shadow-lg">
                  <Wallet className="w-8 h-8 text-gold" />
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Total Profit</span>
              </div>
              
              <div className="flex-1 h-[1px] bg-gradient-to-r from-gold/50 to-transparent relative mx-4">
                <motion.div 
                  animate={{ x: ["0%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute top-[-2px] w-1 h-1 rounded-full bg-gold shadow-[0_0_10px_gold]"
                />
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center border border-green-500/20 shadow-lg">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest text-green-500">35% Cash-Out</span>
              </div>
            </div>

            <div className="w-full flex justify-center relative">
              <div className="absolute top-[-48px] left-1/2 -translate-x-1/2 h-12 w-[1px] bg-gold/20" />
              <div className="flex flex-col items-center gap-2">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-gold/30 flex items-center justify-center p-2">
                  <div className="w-full h-full rounded-full gold-gradient flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                    <TrendingUp className="w-8 h-8 text-charcoal" />
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gold mt-2">65% Re-Investment</span>
                <p className="text-[8px] text-white/20 font-bold uppercase tracking-widest text-center max-w-[120px]">
                  Fuel for the next 10-day growth phase
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Strategy Phases */}
        <div className="grid grid-cols-1 gap-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 px-2">Strategic Phases</h4>
          {phases.map((phase, idx) => (
            <motion.div
              key={phase.week}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-6 flex items-center gap-6 border-gold/5 group hover:border-gold/20 transition-all"
            >
              <div className={cn("w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0 border border-white/5", phase.color)}>
                <span className="text-[8px] font-black uppercase tracking-tighter opacity-60">Week</span>
                <span className="text-xl font-black leading-none">{idx + 1}</span>
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-1 group-hover:text-gold transition-colors">{phase.title}</h4>
                <p className="text-[10px] text-white/30 font-medium leading-relaxed">{phase.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Daily Progression Table */}
        <div className="glass-card overflow-hidden border-gold/10">
          <div className="p-6 bg-gold/5 border-b border-gold/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-gold" />
              <h4 className="text-xs font-black uppercase tracking-[0.2em]">Daily Progression</h4>
            </div>
            <span className="text-[9px] font-black text-gold/50 uppercase tracking-widest">Target Odds: 1.30</span>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 30 }).map((_, i) => {
                const isHarvest = (i + 1) % 10 === 0;
                const day = i + 1;
                let phase = 1;
                if (day > 10) phase = 2;
                if (day > 20) phase = 3;

                return (
                  <motion.div 
                    key={i} 
                    whileHover={{ scale: 1.1, zIndex: 10 }}
                    className={cn(
                      "aspect-square rounded-xl flex flex-col items-center justify-center border transition-all duration-500 relative group/day",
                      isHarvest ? "bg-gold/20 border-gold shadow-[0_0_15px_rgba(212,175,55,0.2)]" : "bg-white/[0.02] border-white/5"
                    )}
                  >
                    <span className={cn("text-[7px] font-black uppercase tracking-tighter", isHarvest ? "text-gold" : "text-white/20")}>Day</span>
                    <span className={cn("text-xs font-black", isHarvest ? "text-gold" : "text-white/60")}>{day}</span>
                    {isHarvest && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold flex items-center justify-center shadow-lg">
                        <PieChart className="w-2 h-2 text-charcoal" />
                      </div>
                    )}
                    
                    {/* Tooltip-like info on hover */}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-24 p-2 glass-card border-gold/20 opacity-0 group-hover/day:opacity-100 transition-opacity pointer-events-none z-50 text-center">
                      <p className="text-[7px] font-black text-gold uppercase mb-1">Phase {phase}</p>
                      <p className="text-[8px] text-white/60 font-medium">Target: 1.30 Odds</p>
                      {isHarvest && <p className="text-[7px] text-green-400 font-black mt-1 uppercase">Harvest Day!</p>}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
          <div className="p-6 bg-white/[0.02] border-t border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <Info className="w-4 h-4 text-gold/40" />
              <h5 className="text-[9px] text-white/40 font-black uppercase tracking-[0.3em]">Harvest Protocol</h5>
            </div>
            <p className="text-[10px] text-white/20 font-medium leading-relaxed italic">
              "Discipline is the bridge between goals and accomplishment. Stick to the odds, stick to the harvest, and never chase losses."
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

const VipPage = ({ referralBonusActive }: { referralBonusActive: boolean }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [refCopied, setRefCopied] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"weekly" | "monthly" | "yearly">("monthly");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const plans = {
    weekly: { name: "Weekly", price: "₦5,000", duration: "7 Days" },
    monthly: { name: "Monthly", price: "₦15,000", duration: "30 Days" },
    yearly: { name: "Yearly", price: "₦100,000", duration: "365 Days" }
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText("8039297838");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [shareCopied, setShareCopied] = useState(false);

  const handleCopyReferral = () => {
    navigator.clipboard.writeText("VAULT-REF-777");
    setRefCopied(true);
    setTimeout(() => setRefCopied(false), 2000);
  };

  const handleShareReferral = async () => {
    const shareData = {
      title: 'VictoryVault VIP',
      text: 'Unlock elite betting strategies with my VictoryVault referral code: VAULT-REF-777',
      url: window.location.origin
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.log('Error sharing:', err);
          handleCopyReferral();
          setShareCopied(true);
          setTimeout(() => setShareCopied(false), 2000);
        }
      }
    } else {
      handleCopyReferral();
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  return (
    <PageWrapper>
      <header className="mb-12 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: "rgba(212, 175, 55, 0.15)" }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-14 h-14 rounded-2xl glass-card flex items-center justify-center border-gold/20 shadow-lg"
          >
            <ChevronLeft className="w-7 h-7 text-gold" />
          </motion.button>
          <div>
            <h2 className="text-3xl font-black tracking-tighter gold-text-gradient leading-none mb-1">VICTORY VAULT VIP</h2>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-gold/40" />
              <p className="text-gold/40 text-[9px] font-black uppercase tracking-[0.5em]">Architectural Precision</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="px-4 py-2 rounded-full bg-gold/5 border border-gold/20 flex items-center gap-2.5 shadow-inner">
            <div className="w-2 h-2 rounded-full bg-gold animate-pulse shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
            <span className="text-[9px] font-black text-gold uppercase tracking-[0.2em]">Live Status: Active</span>
          </div>
          {referralBonusActive && (
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 flex items-center gap-2"
            >
              <Gift className="w-3.5 h-3.5 text-green-500" />
              <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">7 Days Free Unlocked</span>
            </motion.div>
          )}
        </div>
      </header>

      <div className="grid gap-8">
        {/* Referral Section */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card p-10 border-gold/20 relative overflow-hidden group"
        >
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-gold/5 rounded-full blur-3xl group-hover:bg-gold/10 transition-all duration-1000" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center border border-gold/20 shadow-lg">
                <Users className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h4 className="text-base font-black uppercase tracking-[0.2em]">Refer & Unlock VIP</h4>
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.3em]">Architectural Growth Program</p>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white/[0.01] border border-white/5 mb-8 relative group/code">
              <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover/code:opacity-100 transition-opacity duration-700 rounded-3xl" />
              <div className="flex items-center justify-between mb-6 relative z-10">
                <span className="text-[9px] text-white/20 font-black uppercase tracking-[0.5em]">Your Unique Referral Code</span>
                <div className="px-3 py-1 rounded-full bg-gold/10 border border-gold/20">
                  <span className="text-[8px] text-gold font-black uppercase tracking-widest">Earn 1 Week Free</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
                <span className="text-3xl font-mono font-black tracking-[0.2em] text-white/90 drop-shadow-lg">VAULT-REF-777</span>
                <div className="flex gap-3 w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopyReferral}
                    className={cn(
                      "flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-500 border",
                      refCopied ? "bg-green-500/20 border-green-500/30 text-green-500" : "bg-white/5 border-white/10 text-white/60 hover:border-gold/30 hover:text-gold"
                    )}
                  >
                    {refCopied ? <ShieldCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {refCopied ? "Copied" : "Copy"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2, boxShadow: "0 15px 30px rgba(212,175,55,0.2)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShareReferral}
                    className={cn(
                      "flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-500 shadow-xl",
                      shareCopied ? "bg-green-500 text-white" : "gold-gradient text-charcoal"
                    )}
                  >
                    {shareCopied ? <ShieldCheck className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                    {shareCopied ? "Copied" : "Share"}
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 rounded-2xl bg-gold/5 border border-gold/10">
              <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                <Gift className="w-4 h-4 text-gold" />
              </div>
              <p className="text-[10px] text-white/40 font-bold leading-relaxed uppercase tracking-[0.2em]">
                Bonus access is granted instantly upon your friend's first successful architectural subscription.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Subscription Plans */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Select Tier</h4>
            <span className="text-[9px] font-black text-gold uppercase tracking-widest">Best Value Guaranteed</span>
          </div>
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {(Object.keys(plans) as Array<keyof typeof plans>).map((planKey, idx) => (
              <motion.button
                key={planKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: selectedPlan === planKey ? -4 : 0,
                  scale: selectedPlan === planKey ? 1.02 : 1
                }}
                whileHover="hover"
                whileTap={{ scale: 0.98 }}
                transition={{ delay: 0.2 + (idx * 0.1), type: "spring", stiffness: 300, damping: 20 }}
                onClick={() => setSelectedPlan(planKey)}
                className={cn(
                  "glass-card p-6 flex flex-col items-center gap-3 transition-all duration-500 border-2 relative overflow-hidden group",
                  selectedPlan === planKey ? "border-gold/50 bg-gold/10 shadow-[0_20px_40px_rgba(212,175,55,0.25)]" : "border-white/5 bg-white/[0.02]"
                )}
                variants={{
                  hover: { 
                    y: -12,
                    scale: 1.05,
                    rotateX: 5,
                    rotateY: -5,
                    borderColor: "rgba(212, 175, 55, 0.8)",
                    backgroundColor: "rgba(212, 175, 55, 0.12)",
                    boxShadow: "0 30px 60px rgba(212, 175, 55, 0.3)"
                  }
                }}
              >
                {/* Shimmer Effect on Hover */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/20 to-transparent -translate-x-full"
                    variants={{
                      hover: { 
                        x: "200%",
                        transition: { duration: 1.2, repeat: Infinity, ease: "linear" }
                      }
                    }}
                  />
                </div>

                {/* Border Beam Effect for Selected Plan */}
                {selectedPlan === planKey && (
                  <div className="absolute inset-0 pointer-events-none">
                    <motion.div
                      className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                      className="absolute top-0 right-0 w-[2px] h-full bg-gradient-to-b from-transparent via-gold to-transparent"
                      animate={{ y: ["-100%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.5 }}
                    />
                    <motion.div
                      className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-l from-transparent via-gold to-transparent"
                      animate={{ x: ["100%", "-100%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
                    />
                    <motion.div
                      className="absolute bottom-0 left-0 w-[2px] h-full bg-gradient-to-t from-transparent via-gold to-transparent"
                      animate={{ y: ["100%", "-100%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1.5 }}
                    />
                  </div>
                )}

                {/* Subtle Gold Pulse for Selected Plan */}
                {selectedPlan === planKey && (
                  <motion.div
                    className="absolute inset-0 border-2 border-gold/30 rounded-2xl pointer-events-none"
                    animate={{ 
                      boxShadow: ["0 0 0px rgba(212,175,55,0)", "0 0 30px rgba(212,175,55,0.4)", "0 0 0px rgba(212,175,55,0)"],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}

                {planKey === "monthly" && (
                  <div className="absolute top-0 right-0 px-3 py-1 gold-gradient rounded-bl-xl z-20">
                    <span className="text-[7px] font-black text-charcoal uppercase tracking-widest">Popular</span>
                  </div>
                )}
                {selectedPlan === planKey && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute top-2 left-2 w-5 h-5 rounded-full gold-gradient flex items-center justify-center shadow-lg z-20"
                    >
                      <CheckCircle2 className="w-3 h-3 text-charcoal" />
                    </motion.div>
                    <motion.div 
                      layoutId="plan-active-glow" 
                      className="absolute inset-0 bg-gradient-to-br from-gold/20 via-transparent to-transparent pointer-events-none" 
                    />
                  </>
                )}
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-[0.3em] mb-1 relative z-10",
                  selectedPlan === planKey ? "text-gold" : "text-white/30"
                )}>
                  {plans[planKey].name}
                </span>
                <div className="flex flex-col items-center relative z-10">
                  <span className="text-2xl font-black tracking-tighter mb-1">{plans[planKey].price}</span>
                  <motion.div 
                    variants={{
                      hover: { width: "100%", opacity: 1 }
                    }}
                    className="h-1 w-8 gold-gradient rounded-full opacity-0 transition-all duration-500" 
                  />
                </div>
                <span className="text-[8px] text-white/20 font-black uppercase tracking-[0.4em] relative z-10">{plans[planKey].duration}</span>
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* Hero Section */}
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-12 relative overflow-hidden group border-gold/10"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full -mr-32 -mt-32 blur-[100px] group-hover:bg-gold/10 transition-all duration-1000" />
          
          <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
            <div className="relative">
              <motion.div 
                animate={{ 
                  y: [0, -15, 0],
                  rotateY: [0, 15, -15, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="w-36 h-36 rounded-[3rem] bg-gradient-to-br from-gold/30 via-gold/10 to-transparent border border-gold/40 flex items-center justify-center shadow-[0_30px_60px_rgba(212,175,55,0.2)] relative z-10"
              >
                <Crown className="w-16 h-16 text-gold drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]" />
              </motion.div>
              <div className="absolute inset-0 bg-gold/20 blur-3xl rounded-full -z-10 animate-pulse" />
            </div>
            
            <div className="text-center lg:text-left flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 mb-6">
                <ShieldCheck className="w-3 h-3 text-gold" />
                <span className="text-[8px] font-black text-gold uppercase tracking-widest">Verified Elite Access</span>
              </div>
              <h3 className="text-4xl font-black mb-4 tracking-tighter leading-none">Elite Architectural Membership</h3>
              <p className="text-white/40 text-sm mb-10 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0">
                Unlock our proprietary AI-driven algorithms and architectural betting strategies. Designed for high-net-worth individuals seeking consistent, data-backed high-yield returns.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-4">
                {[
                  { label: "95% Accuracy", icon: ShieldCheck, desc: "Verified Win Rate" },
                  { label: "AI Analysis", icon: Zap, desc: "Real-time Processing" },
                  { label: "Priority Vault", icon: Lock, desc: "Instant Access" },
                  { label: "Max-Bet Access", icon: Trophy, desc: "Unlimited Stakes" }
                ].map((item, idx) => (
                  <motion.div 
                    key={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + (idx * 0.1) }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-gold/20 transition-colors group/item"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gold/5 flex items-center justify-center group-hover/item:bg-gold/10 transition-colors">
                      <item.icon className="w-5 h-5 text-gold/60 group-hover/item:text-gold transition-colors" />
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/80 block mb-0.5">{item.label}</span>
                      <span className="text-[8px] font-bold uppercase tracking-widest text-white/20">{item.desc}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Payment Section */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card overflow-hidden border-gold/20 shadow-2xl"
        >
          <div className="p-8 bg-gold/5 border-b border-gold/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center shadow-lg">
                <Lock className="w-5 h-5 text-charcoal" />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-[0.3em]">Secure Payment Gateway</h4>
                <p className="text-[8px] font-black text-gold/50 uppercase tracking-[0.4em]">End-to-End Encrypted</p>
              </div>
            </div>
            <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Transaction ID: #VV-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
            </div>
          </div>

          <div className="p-10 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] text-white/20 font-black uppercase tracking-[0.5em]">Recipient Institution</span>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="w-3 h-3 rounded-full bg-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                    <span className="text-base font-black tracking-[0.2em] uppercase text-white/90">OPAY DIGITAL BANK</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[9px] text-white/20 font-black uppercase tracking-[0.5em]">Account Beneficiary</span>
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <span className="text-base font-black tracking-[0.2em] uppercase text-white/90">CHIJIOKE PAUL NWEKE</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-end">
                <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-gold/10 relative group shadow-inner">
                  <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[2rem]" />
                  <span className="text-[9px] text-white/20 font-black uppercase tracking-[0.5em] mb-4 block relative z-10">Vault Deposit Account</span>
                  <div className="flex items-center justify-between gap-6 relative z-10">
                    <span className="text-3xl font-mono font-black tracking-tighter gold-text-gradient drop-shadow-lg">8039297838</span>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCopyAccount}
                      className={cn(
                        "flex items-center gap-3 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-500 shadow-xl",
                        copied ? "bg-green-500 text-white" : "bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20"
                      )}
                    >
                      {copied ? <ShieldCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? "Copied" : "Copy"}
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-white/5 flex flex-col lg:flex-row items-center gap-10">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 rounded-full bg-gold" />
                  <h5 className="text-[10px] text-white/50 font-black uppercase tracking-[0.4em]">Verification Protocol</h5>
                </div>
                <p className="text-xs text-white/30 font-medium leading-relaxed max-w-2xl">
                  Initiate a transfer of <span className="text-gold font-black tracking-widest">{plans[selectedPlan].price}</span> for the <span className="text-white/80 font-black">{plans[selectedPlan].name}</span> tier. Our proprietary AI verification engine will finalize your elite activation within <span className="text-white/80 font-black">5-15 minutes</span>.
                </p>
              </div>
              <motion.button 
                whileHover={{ scale: 1.02, y: -5, boxShadow: "0 25px 50px rgba(212,175,55,0.3)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowConfirmation(true)}
                className="w-full lg:w-auto px-16 py-6 rounded-2xl gold-gradient text-charcoal font-black tracking-[0.4em] uppercase shadow-[0_20px_40px_rgba(212,175,55,0.2)] shimmer-btn whitespace-nowrap text-sm"
              >
                Confirm Deposit: {plans[selectedPlan].price}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Payment Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-6 bg-charcoal/80 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="w-full max-w-sm glass-card p-8 border-gold/20 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 gold-gradient" />
              
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mb-6 border border-gold/20">
                  <CheckCircle2 className="w-10 h-10 text-gold" />
                </div>
                
                <h3 className="text-2xl font-black mb-2 tracking-tight">Payment Initiated</h3>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] mb-8">Architectural Verification</p>
                
                <div className="w-full space-y-4 mb-10">
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Selected Plan</span>
                    <span className="text-xs font-black text-white">{plans[selectedPlan].name}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Amount Paid</span>
                    <span className="text-xs font-black text-gold">{plans[selectedPlan].price}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Activation Time</span>
                    <span className="text-xs font-black text-white">5 - 15 Minutes</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gold/5 border border-gold/10 mb-8 w-full">
                  <p className="text-[9px] text-white/50 font-medium leading-relaxed uppercase tracking-widest">
                    Our AI system is now verifying your transaction. You will receive a notification once your VIP access is activated.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShowConfirmation(false);
                    navigate("/main");
                  }}
                  className="w-full py-4 rounded-xl gold-gradient text-charcoal font-black tracking-[0.3em] uppercase shadow-lg shimmer-btn"
                >
                  Back to Vault
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [showNotifSettings, setShowNotifSettings] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState<NotificationPref>({
    matchAlerts: true,
    updates: true,
    vipAnnouncements: true
  });
  const [toast, setToast] = useState<{ message: string, type: 'match' | 'update' | 'vip' } | null>(null);
  const [referralBonusActive, setReferralBonusActive] = useState(false);

  // Simulation of incoming notifications
  useEffect(() => {
    if (loading) return;

    const timers = [
      setTimeout(() => {
        if (notifPrefs.matchAlerts) {
          setToast({ message: "New 2.00 ODDS ticket released in Folder 1!", type: 'match' });
        }
      }, 10000),
      setTimeout(() => {
        if (notifPrefs.vipAnnouncements) {
          setToast({ message: "VIP GOLD VAULT updated with high-yield architectural analysis.", type: 'vip' });
        }
      }, 25000),
      // Simulation: Friend subscribed via referral
      setTimeout(() => {
        setReferralBonusActive(true);
        setToast({ message: "Referral Bonus Unlocked! 1 Week VIP access granted.", type: 'vip' });
      }, 45000)
    ];

    return () => timers.forEach(clearTimeout);
  }, [loading, notifPrefs]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <Router>
      <AtmosphericBackground />
      <AnimatePresence mode="wait">
        {loading ? (
          <LoadingScreen onComplete={() => setLoading(false)} />
        ) : (
          <>
            <AnimatePresence>
              {toast && (
                <NotificationToast 
                  message={toast.message} 
                  type={toast.type} 
                  onClose={() => setToast(null)} 
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showNotifSettings && (
                <NotificationSettings 
                  isOpen={showNotifSettings} 
                  onClose={() => setShowNotifSettings(false)}
                  prefs={notifPrefs}
                  setPrefs={setNotifPrefs}
                />
              )}
            </AnimatePresence>

            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/main" element={<MainPage onOpenNotifs={() => setShowNotifSettings(true)} />} />
              <Route path="/details/:id" element={<DetailsPage />} />
              <Route path="/vip" element={<VipPage referralBonusActive={referralBonusActive} />} />
              <Route path="/strategy" element={<StrategyPage />} />
            </Routes>
          </>
        )}
      </AnimatePresence>
    </Router>
  );
}
