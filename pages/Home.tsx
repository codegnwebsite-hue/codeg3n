
import React from 'react';
import { MessageCircle, Zap, Shield, Users, ArrowRight, Lock } from 'lucide-react';
import { APP_CONFIG } from '../constants';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-24 px-4 flex flex-col items-center justify-center text-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0a0a0b] to-[#0a0a0b]">
        <div className="mb-6 inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-widest">
          <Lock className="w-3 h-3" />
          <span>Access Restricted</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tighter">
          Welcome to <span className="gradient-text">{APP_CONFIG.SERVER_NAME}</span>
        </h1>
        <p className="text-gray-400 max-w-2xl text-lg md:text-xl leading-relaxed mb-10">
          Verification links are now exclusive. To get started, you must 
          <span className="text-white font-semibold"> join our Discord server</span> and use the 
          <code className="bg-white/10 px-2 py-0.5 rounded mx-1 text-indigo-300 font-mono text-base">/verify</code> 
          command to generate your unique link.
        </p>
        
        <div className="glass p-8 rounded-3xl border-indigo-500/20 max-w-lg w-full mb-12">
          <h3 className="text-xl font-bold mb-4">Ready to join?</h3>
          <p className="text-sm text-gray-500 mb-8 italic">Join our Discord server to generate a link.</p>
          <a 
            href={APP_CONFIG.DISCORD_INVITE} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center justify-center space-x-3 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold px-10 py-5 rounded-2xl shadow-[0_0_20px_rgba(88,101,242,0.3)] transition-all hover:-translate-y-1 active:scale-95 w-full"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-lg">Join Discord Server</span>
          </a>
        </div>
      </section>

      {/* Feature Section */}
      <section className="w-full max-w-6xl px-4 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass p-8 rounded-2xl border-white/5 hover:border-indigo-500/50 transition-colors group">
          <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
            <Shield className="w-6 h-6 text-indigo-400 group-hover:text-white" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-white">Bot-Verified</h3>
          <p className="text-gray-400 leading-relaxed">
            Our Discord bot generates unique, tamper-proof sessions tied directly to your Discord account.
          </p>
        </div>
        
        <div className="glass p-8 rounded-2xl border-white/5 hover:border-purple-500/50 transition-colors group">
          <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors">
            <Users className="w-6 h-6 text-purple-400 group-hover:text-white" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-white">Secure API</h3>
          <p className="text-gray-400 leading-relaxed">
            Direct generation from the website is disabled to prevent bypass attempts and ensure community quality.
          </p>
        </div>

        <div className="glass p-8 rounded-2xl border-white/5 hover:border-pink-500/50 transition-colors group">
          <div className="w-12 h-12 bg-pink-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-pink-600 transition-colors">
            <Zap className="w-6 h-6 text-pink-400 group-hover:text-white" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-white">Instant Access</h3>
          <p className="text-gray-400 leading-relaxed">
            Once verified through our 3-step process, your roles are automatically granted in the server.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
