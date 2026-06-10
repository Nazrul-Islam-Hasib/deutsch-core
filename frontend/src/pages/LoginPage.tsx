import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    console.log('Login attempt:', { email, password, success });
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Global Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] scanlines opacity-20"></div>
      
      {/* Background decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]"></div>

      <div className="card w-full max-w-md bg-black/60 backdrop-blur-xl border border-primary/20 shadow-[0_0_50px_rgba(255,124,245,0.1)] z-10">
        <div className="card-body p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-primary font-headline tracking-[0.3em] uppercase mb-2">DEUTSCH_CORE</h1>
            <p className="text-[10px] font-headline tracking-[0.2em] text-secondary/60 uppercase">System Authentication Required</p>
          </div>
          
          {error && (
            <div className="bg-error/10 border border-error/50 text-error px-4 py-3 text-xs font-headline tracking-widest uppercase mb-6 animate-pulse">
              [ERROR]: {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-headline text-[10px] tracking-widest uppercase text-primary/70">Access_ID (Email)</span>
              </label>
              <input
                type="email"
                placeholder="USER@CORE.ARC"
                className="bg-black/40 border border-primary/30 text-primary placeholder:text-primary/20 px-4 py-3 focus:outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(255,124,245,0.3)] transition-all font-mono text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-headline text-[10px] tracking-widest uppercase text-primary/70">Security_Key (Password)</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="bg-black/40 border border-primary/30 text-primary placeholder:text-primary/20 px-4 py-3 focus:outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(255,124,245,0.3)] transition-all font-mono text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                className={`w-full bg-primary text-on-primary py-4 font-headline font-black text-xs tracking-[0.3em] uppercase hover:brightness-110 shadow-[0_0_20px_rgba(255,124,245,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={isLoading}
              >
                {isLoading ? 'ESTABLISHING_LINK...' : 'INITIALIZE_AUTH'}
              </button>
            </div>
          </form>

          <div className="mt-10 text-center">
            <p className="text-[10px] font-headline tracking-widest text-primary/40 uppercase">
              No authorization?{' '}
              <Link to="/signup" className="text-secondary hover:text-secondary/80 transition-colors underline decoration-secondary/30">
                Register_New_Operator
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
