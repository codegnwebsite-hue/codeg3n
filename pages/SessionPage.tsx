
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Lock, ExternalLink, Shield, Loader2, Ticket, AlertCircle, Home } from 'lucide-react';
import { APP_CONFIG } from '../constants';

interface SessionData {
  cp1: boolean;
  cp2: boolean;
  lastClickTime?: number;
  lastStep?: number;
  uid?: string;
  service?: string;
}

const SessionPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const stored = localStorage.getItem(`session_${slug}`);
    if (stored) {
      setSession(JSON.parse(stored));
      localStorage.setItem('active_session_slug', slug);
      setError(false);
    } else {
      // For demo purposes, if a slug is provided but not in localstorage, 
      // we'll "auto-initialize" it to make the link look valid.
      // In a real app, this would fetch from a database.
      const newSession: SessionData = {
        cp1: false,
        cp2: false,
        uid: "DiscordUser",
        service: "Verification",
        createdAt: Date.now()
      } as any;
      localStorage.setItem(`session_${slug}`, JSON.stringify(newSession));
      localStorage.setItem('active_session_slug', slug);
      setSession(newSession);
      setError(false);
    }
    setLoading(false);
  }, [slug]);

  const handleCheckpoint = (step: number) => {
    if (!slug || !session) return;
    
    const updated = { ...session, lastClickTime: Date.now(), lastStep: step };
    localStorage.setItem(`session_${slug}`, JSON.stringify(updated));
    localStorage.setItem('active_session_slug', slug);
    setSession(updated);

    const link = step === 1 ? APP_CONFIG.CHECKPOINT_1_LINK : APP_CONFIG.CHECKPOINT_2_LINK;
    window.location.href = link;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="glass p-12 rounded-3xl border-red-500/20">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Invalid Link</h2>
          <p className="text-gray-400 mb-8">
            This verification link is invalid or has expired. Please go back to our Discord server.
          </p>
          <Link to="/" className="inline-flex items-center space-x-2 bg-white/5 hover:bg-white/10 text-white font-bold py-4 px-8 rounded-2xl transition-all border border-white/10">
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  const isComplete = session.cp1 && session.cp2;

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <div className="glass rounded-3xl overflow-hidden shadow-2xl">
        <div className="bg-indigo-600/10 p-6 border-b border-white/5">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center space-x-2">
              <Shield className="w-5 h-5 text-indigo-400" />
              <span>Session: <span className="text-indigo-400 font-mono text-sm">{slug}</span></span>
            </h2>
            <div className="flex space-x-1">
              <div className={`w-2 h-2 rounded-full transition-colors duration-500 ${session.cp1 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-white/10'}`} />
              <div className={`w-2 h-2 rounded-full transition-colors duration-500 ${session.cp2 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-white/10'}`} />
            </div>
          </div>
          {session.uid && (
            <div className="mt-2 text-[10px] text-gray-500 font-mono uppercase tracking-widest flex items-center space-x-2">
              <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
              <span>Discord Auth: {session.uid}</span>
            </div>
          )}
        </div>

        <div className="p-8 text-center">
          {!isComplete ? (
            <div className="space-y-6">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Verification Flow</h3>
                <p className="text-gray-400 text-sm">Follow the checkpoints to prove you are human.</p>
              </div>

              <div className={`p-6 rounded-2xl border transition-all duration-300 ${session.cp1 ? 'bg-green-500/5 border-green-500/20' : 'bg-white/5 border-white/5 hover:border-indigo-500/30'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${session.cp1 ? 'bg-green-500/20 text-green-400 rotate-12' : 'bg-indigo-500/20 text-indigo-400'}`}>
                      {session.cp1 ? <CheckCircle2 className="w-7 h-7" /> : <span className="font-black text-xl">1</span>}
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-lg">Checkpoint 1</p>
                      <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">{session.cp1 ? 'Status: Verified' : 'Status: Pending'}</p>
                    </div>
                  </div>
                  {!session.cp1 && (
                    <button 
                      onClick={() => handleCheckpoint(1)}
                      className="bg-white text-black px-6 py-3 rounded-xl text-sm font-black hover:bg-indigo-50 transition-all active:scale-95 flex items-center space-x-2 shadow-lg"
                    >
                      <span>START</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className={`p-6 rounded-2xl border transition-all duration-300 ${
                session.cp2 ? 'bg-green-500/5 border-green-500/20' : 
                !session.cp1 ? 'bg-black/40 border-white/5 opacity-50 cursor-not-allowed' : 
                'bg-white/5 border-white/5 hover:border-indigo-500/30'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                      session.cp2 ? 'bg-green-500/20 text-green-400 rotate-12' : 
                      !session.cp1 ? 'bg-white/5 text-gray-600' : 
                      'bg-indigo-500/20 text-indigo-400'
                    }`}>
                      {!session.cp1 ? <Lock className="w-6 h-6" /> : session.cp2 ? <CheckCircle2 className="w-7 h-7" /> : <span className="font-black text-xl">2</span>}
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-lg">Checkpoint 2</p>
                      <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">
                        {session.cp2 ? 'Status: Verified' : !session.cp1 ? 'Status: Locked' : 'Status: Pending'}
                      </p>
                    </div>
                  </div>
                  {session.cp1 && !session.cp2 && (
                    <button 
                      onClick={() => handleCheckpoint(2)}
                      className="bg-white text-black px-6 py-3 rounded-xl text-sm font-black hover:bg-indigo-50 transition-all active:scale-95 flex items-center space-x-2 shadow-lg"
                    >
                      <span>START</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="w-24 h-24 bg-green-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.2)] rotate-3">
                <CheckCircle2 className="w-12 h-12 text-green-400" />
              </div>
              <h3 className="text-3xl font-black mb-3 italic uppercase tracking-tighter">Access Granted</h3>
              <p className="text-gray-400 mb-10 text-base leading-relaxed">
                Verification complete. Your session <span className="text-white font-mono">{slug}</span> is now active.
              </p>
              <a 
                href={APP_CONFIG.DISCORD_INVITE}
                className="flex items-center justify-center space-x-3 bg-[#5865F2] hover:bg-[#4752C4] text-white font-black py-5 rounded-2xl transition-all shadow-[0_10px_20px_rgba(88,101,242,0.3)] hover:-translate-y-1"
              >
                <Ticket className="w-6 h-6" />
                <span className="text-lg">CLAIM YOUR ROLE</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionPage;
