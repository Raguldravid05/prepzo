import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Sparkles, Mail, Lock, AlertCircle, Eye, EyeOff, Upload, MessageSquare, Target, ArrowRight, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/chat');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#0B1020] flex overflow-hidden">

      {/* ========== LEFT PANEL — Branding ========== */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="hidden lg:flex flex-col justify-between w-[52%] p-[48px] relative overflow-hidden"
      >
        {/* Radial glows */}
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-emerald-500/[0.07] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-20 right-0 w-[300px] h-[300px] bg-emerald-600/[0.04] rounded-full blur-[100px] pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-[12px] relative z-10">
          <div className="w-[40px] h-[40px] rounded-[12px] bg-[#10B981] flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="text-[20px] font-display font-bold text-white tracking-tight">
            Prepzo <span className="text-[#10B981] italic">AI</span>
          </span>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 -mt-[8px]">
          <h1 className="font-display text-[48px] xl:text-[56px] font-extrabold leading-[1.08] text-white tracking-tight">
            Your AI Study<br />
            Companion <span className="inline-block text-[#10B981] ml-1">✦</span>
          </h1>
          <p className="mt-[16px] text-[#94A3B8] text-[16px] leading-relaxed max-w-[420px]">
            Upload your materials, ask questions, generate answers,
            and ace your exams with the power of AI.
          </p>

          {/* Feature Pills */}
          <div className="mt-[40px] space-y-[16px]">
            {[
              { icon: Upload, title: 'Upload & Analyze', desc: 'PDFs, notes, syllabus & more' },
              { icon: MessageSquare, title: 'Ask Anything', desc: 'Get instant, accurate answers' },
              { icon: Target, title: 'Exam Ready', desc: '2, 8, 13 mark answers, viva & quizzes' },
            ].map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.12, duration: 0.5 }}
                className="flex items-center gap-[16px]"
              >
                <div className="w-[40px] h-[40px] rounded-[12px] bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center text-[#10B981] shrink-0">
                  <feat.icon size={18} />
                </div>
                <div>
                  <p className="text-white font-semibold text-[14px]">{feat.title}</p>
                  <p className="text-[#64748B] text-[12px]">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Decorative Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative z-10 flex items-end gap-[16px] mt-[24px]"
        >
          <div className="w-[224px] h-[144px] rounded-[16px] bg-[#111827] border border-[#1E293B] p-[16px] shadow-xl relative overflow-hidden">
            <div className="flex gap-[6px] mb-[12px]">
              <div className="w-[10px] h-[10px] rounded-full bg-red-500/60" />
              <div className="w-[10px] h-[10px] rounded-full bg-yellow-500/60" />
              <div className="w-[10px] h-[10px] rounded-full bg-green-500/60" />
            </div>
            <div className="flex items-end gap-[8px] h-[64px] px-[8px]">
              {[40, 65, 50, 80, 55, 70, 90].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-gradient-to-t from-emerald-500/60 to-emerald-400/30"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="absolute -top-[8px] -right-[8px] w-[36px] h-[36px] rounded-[12px] bg-[#10B981] flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <BarChart3 size={14} className="text-white" />
            </div>
          </div>

          <div className="flex flex-col gap-[12px] mb-[16px]">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="w-[44px] h-[44px] rounded-[12px] bg-[#10B981] flex items-center justify-center shadow-lg shadow-emerald-500/30"
            >
              <Sparkles size={16} className="text-white" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut', delay: 0.8 }}
              className="w-[44px] h-[44px] rounded-[12px] bg-[#10B981] flex items-center justify-center shadow-lg shadow-emerald-500/30 ml-[24px]"
            >
              <Sparkles size={16} className="text-white" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>


      {/* ========== RIGHT PANEL — Login Form ========== */}
      <div className="flex-1 flex items-center justify-center p-[24px] relative">
        {/* Decorative curve */}
        <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-[96px] pointer-events-none">
          <svg viewBox="0 0 100 800" fill="none" className="h-full w-full" preserveAspectRatio="none">
            <path d="M100 0 C 30 200, 70 600, 100 800" stroke="rgba(16,185,129,0.12)" strokeWidth="1.5" fill="none" />
          </svg>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
          className="w-full max-w-[420px]"
        >
          {/* Card Header — 24px gap between sections */}
          <div className="text-center flex flex-col items-center gap-[12px] mb-[32px]">
            <div className="w-[56px] h-[56px] rounded-[16px] bg-[#10B981] flex items-center justify-center text-white shadow-xl shadow-emerald-500/25">
              <Sparkles size={24} />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-[28px] text-white tracking-tight leading-tight">
                Welcome <span className="text-[#10B981] italic">back</span>
              </h2>
              <p className="text-[14px] text-[#94A3B8] mt-[4px]">
                Sign in to continue to Prepzo AI
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-[12px] p-[16px] bg-red-500/10 border border-red-500/20 rounded-[14px] text-red-400 text-[13px] mb-[24px]"
            >
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form — 20px between input groups, 8px label-to-input */}
          <form onSubmit={handleSubmit} className="space-y-[20px]">
            {/* Email */}
            <div>
              <label className="block text-[13px] font-medium text-[#94A3B8] mb-[8px]">
                Email address
              </label>
              <div className="relative">
                <span className="input-icon-left">
                  <Mail size={18} />
                </span>
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-field"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[13px] font-medium text-[#94A3B8] mb-[8px]">
                Password
              </label>
              <div className="relative">
                <span className="input-icon-left">
                  <Lock size={18} />
                </span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-field"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="input-icon-right cursor-pointer hover:text-[#94A3B8] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot — same row, items-center, justify-between */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-[8px] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-[18px] h-[18px] rounded-[4px] border-[#1E293B] bg-[#111827] text-[#10B981] focus:ring-[#10B981]/30 focus:ring-offset-0 cursor-pointer accent-[#10B981]"
                />
                <span className="text-[13px] text-[#94A3B8]">Remember me</span>
              </label>
              <button type="button" className="text-[13px] text-[#10B981] hover:text-[#059669] font-medium transition-colors cursor-pointer">
                Forgot password?
              </button>
            </div>

            {/* Submit — 24px section gap */}
            <div className="pt-[4px]">
              <button
                type="submit"
                disabled={isLoading}
                id="login-submit"
                className="btn-primary"
              >
                {isLoading ? (
                  <div className="flex gap-[4px]">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                ) : (
                  <>
                    Sign In <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Divider — 24px spacing */}
          <div className="flex items-center gap-[16px] my-[24px]">
            <div className="flex-1 h-px bg-[#1E293B]" />
            <span className="text-[12px] text-[#64748B] uppercase tracking-wider font-medium">or</span>
            <div className="flex-1 h-px bg-[#1E293B]" />
          </div>

          {/* Google Button */}
          <button type="button" className="btn-social">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Footer Link — 24px spacing */}
          <p className="text-center text-[14px] text-[#94A3B8] mt-[24px]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#10B981] font-semibold hover:text-[#059669] transition-colors">
              Sign up free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
