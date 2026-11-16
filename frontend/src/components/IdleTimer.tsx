import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { authApi } from '../services/api/authApi';

const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const WARNING_BEFORE_MS = 2 * 60 * 1000; // 2 minutes
const HEARTBEAT_INTERVAL_MS = 4 * 60 * 1000; // 4 minutes

const IdleTimer: React.FC = () => {
  const { user, logout, isInitialized } = useAuthStore();
  const [showWarning, setShowWarning] = useState(false);
  // Set when a user logs in (see effect below); Date.now() must not run during render.
  const lastActivityRef = useRef<number>(0);
  const heartbeatRef = useRef<number>(0);

  const handleActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    if (showWarning) {
      setShowWarning(false);
    }
  }, [showWarning]);

  const sendHeartbeat = useCallback(async () => {
    if (!user) return;
    try {
      await authApi.activity();
      heartbeatRef.current = Date.now();
    } catch (error) {
      console.error('Heartbeat failed', error);
    }
  }, [user]);

  // Start the idle and heartbeat clocks at login. Kept separate from the effect
  // below, which re-runs whenever the warning toggles and must not reset them.
  useEffect(() => {
    if (!user) return;
    const now = Date.now();
    lastActivityRef.current = now;
    heartbeatRef.current = now;
  }, [user]);

  useEffect(() => {
    if (!isInitialized || !user) return;

    const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach(event => window.addEventListener(event, handleActivity));

    const interval = setInterval(() => {
      const now = Date.now();
      const idleTime = now - lastActivityRef.current;

      if (idleTime >= IDLE_TIMEOUT_MS) {
        logout();
      } else if (idleTime >= IDLE_TIMEOUT_MS - WARNING_BEFORE_MS) {
        setShowWarning(true);
      }

      // Throttled heartbeat: every 4 minutes if there was any activity since last heartbeat
      if (now - heartbeatRef.current >= HEARTBEAT_INTERVAL_MS) {
        sendHeartbeat();
      }
    }, 10000); // Check every 10 seconds

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      clearInterval(interval);
    };
  }, [user, isInitialized, handleActivity, logout, sendHeartbeat]);

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="card w-96 bg-base-100 shadow-xl border border-primary">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-warning">Session Timeout</h2>
          <p>Your session is about to expire due to inactivity.</p>
          <div className="card-actions mt-4">
            <button className="btn btn-primary" onClick={handleActivity}>
              Stay Logged In
            </button>
            <button className="btn btn-ghost" onClick={() => logout()}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdleTimer;
