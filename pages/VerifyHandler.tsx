
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { APP_CONFIG } from '../constants';

const VerifyHandler: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [success, setSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    const uid = searchParams.get('uid');
    const token = searchParams.get('token');

    // If uid+token present, use the new validation flow
    if (uid && token) {
      (async () => {
        try {
          const resp = await fetch('/api/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uid, token })
          });
          const data = await resp.json();
          if (resp.ok && data.success) {
            setSuccess(true);
          } else {
            setError(data.error || 'Validation failed');
            setSuccess(false);
          }
        } catch (err) {
          setError('Network error validating token');
          setSuccess(false);
        } finally {
          setLoading(false);
        }
      })();
      return;
    }

    // Fallback to legacy session flow
    const slugFromUrl = searchParams.get('slug');
    const activeSlug = slugFromUrl || localStorage.getItem('active_session_slug');
    const step = parseInt(searchParams.get('step') || '0');

    if (!activeSlug || isNaN(step)) {
      setError("No active session found. Please use the link provided by our Discord bot.");
      setLoading(false);
      return;
    }

    const sessionKey = `session_${activeSlug}`;
    const stored = localStorage.getItem(sessionKey);

    if (!stored) {
      setError("Session expired or invalid. Please request a new link in Discord.");
      setLoading(false);
      return;
    }

    const session = JSON.parse(stored);
    const now = Date.now();

    const timeSinceClick = now - (session.lastClickTime || 0);
    const isValidStep = session.lastStep === step;
    const isRecent = timeSinceClick < APP_CONFIG.VERIFY_WINDOW_MS;

    if (isValidStep && isRecent) {
      const updated = {
        ...session,
        [`cp${step}`]: true,
        lastClickTime: undefined,
        lastStep: undefined
      };
      
      localStorage.setItem(sessionKey, JSON.stringify(updated));

      setTimeout(() => {
        navigate(`/v/${activeSlug}`);
      }, 1000);
    } else {
      if (!isRecent) {
        setError("Checkpoint window expired. Please try again from the session page.");
      } else {
        setError("Invalid verification sequence. Follow the steps provided.");
      }
      setLoading(false);
    }
  }, [searchParams, navigate]);

  // UID/token flow UI
  if (loading && success === null && !error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <div className="space-y-6 animate-pulse">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full"></div>
            <Loader2 className="w-16 h-16 animate-spin text-indigo-500 mx-auto relative z-10" />
          </div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter">Validating...</h2>
          <p className="text-gray-500 text-sm max-w-xs mx-auto">Connecting to secure verification service. Please wait.</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <div className="glass p-10 rounded-[2.5rem] max-w-md w-full border-green-500/20 shadow-2xl">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Verification Successful</h2>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">Your Discord account is now verified. You may close this page.</p>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center justify-center space-x-2 w-full bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl transition-all border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO HUB</span>
          </button>
        </div>
      </div>
    );
  }

  // Error UI
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="glass p-10 rounded-[2.5rem] max-w-md w-full border-red-500/20 shadow-2xl">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Verification Failed</h2>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">{error}</p>
        <button 
          onClick={() => navigate('/')}
          className="flex items-center justify-center space-x-2 w-full bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl transition-all border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO HUB</span>
        </button>
      </div>
    </div>
  );
};

export default VerifyHandler;
