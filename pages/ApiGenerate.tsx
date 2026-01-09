
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { APP_CONFIG } from '../constants';

/**
 * API Endpoint Component
 * Target URL: /api/generate?uid=DISCORD_ID&key=YOUR_SECRET&service=SERVICE_NAME
 */
const ApiGenerate: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [response, setResponse] = useState<any>(null);

  useEffect(() => {
    const uid = searchParams.get('uid');
    const providedKey = searchParams.get('key');
    const service = searchParams.get('service') || 'default';

    // 1. Check for Secret Key
    if (!providedKey || providedKey !== APP_CONFIG.API_SECRET) {
      setResponse({
        status: "error",
        code: 401,
        message: "Unauthorized: Invalid or missing API secret key."
      });
      return;
    }

    // 2. Check for Discord User ID
    if (!uid) {
      setResponse({
        status: "error",
        code: 400,
        message: "Bad Request: Missing 'uid' parameter (Discord User ID is required)."
      });
      return;
    }

    // 3. Generate unique token
    // In a real backend, this would be stored in a Database.
    // Since this is a frontend-driven app, we use a consistent token generation 
    // that the bot will pass to the user.
    const token = Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 8);
    
    // 4. Register session locally
    // NOTE: This only works if the bot and user share a browser (unlikely).
    // For a real production bot, you must connect this to a real backend database.
    const sessionData = {
      uid,
      service,
      cp1: false,
      cp2: false,
      createdAt: Date.now()
    };

    localStorage.setItem(`session_${token}`, JSON.stringify(sessionData));

    // 5. Construct Clean URL (No #)
    const protocol = window.location.protocol;
    const host = window.location.host;
    const cleanUrl = `${protocol}//${host}/v/${token}`;

    setResponse({
      status: "success",
      code: 200,
      data: {
        uid: uid,
        service: service,
        token: token,
        verification_url: cleanUrl
      }
    });
  }, [searchParams]);

  // If the request comes from a bot, we want to show ONLY the JSON string
  return (
    <div className="min-h-screen bg-[#050505] text-[#00ff41] font-mono p-4 md:p-10 flex items-start justify-start overflow-hidden">
      <div className="w-full">
        <div className="mb-4 text-gray-600 border-b border-gray-800 pb-2 flex justify-between text-xs md:text-sm">
          <span>API ENDPOINT: /api/generate</span>
          <span className="hidden sm:inline">application/json</span>
        </div>
        <pre className="whitespace-pre-wrap break-all leading-relaxed text-sm md:text-base bg-black/50 p-4 rounded-lg border border-white/5 shadow-2xl">
          {response ? JSON.stringify(response, null, 2) : "// Awaiting secure connection..."}
        </pre>
      </div>
    </div>
  );
};

export default ApiGenerate;
