import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Sparkles, User, Mail, Lock, AlertCircle, Eye, EyeOff, Upload, FileText, HelpCircle, CheckSquare, GraduationCap, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const getPasswordStrength = () => {
    if (!password) return { level: 0, label: '', color: '' };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { level: 1, label: 'Weak', color: 'bg-red-500' };
    if (score <= 2) return { level: 2, label: 'Fair', color: 'bg-yellow-500' };
    if (score <= 3) return { level: 3, label: 'Good', color: 'bg-blue-500' };
    return { level: 4, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await register(fullName, email, password);
      navigate('/chat');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Email might already exist.');
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
        className="hidden lg:flex flex-col justify-between w-[48%] p-[48px] relative overflow-hidden"
      >
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

        {/* Hero */}
        <div className="relative z-10 -mt-[4px]">
          <h1 className="font-display text-[44px] xl:text-[52px] font-extrabold leading-[1.08] text-white tracking-tight">
            Start Learning<br />
            Smarter with <span className="text-[#10B981]">AI</span>
          </h1>
          <p className="mt-[16px] text-[#94A3B8] text-[14px] leading-relaxed max-w-[400px]">
            Upload study materials, generate exam answers, prepare for vivas, and master your subjects with AI.
          </p>

          {/* Feature Pills */}
          <div className="mt-[32px] space-y-[12px]">
            {[
              { icon: Upload, title: 'Upload PDFs and Notes' },
              { icon: FileText, title: 'Generate 2, 8 and 13 Mark Answers' },
              { icon: HelpCircle, title: 'Viva Preparation' },
              { icon: CheckSquare, title: 'Quiz Generator' },
              { icon: BookOpen, title: 'AI-Powered Study Assistant' },
            ].map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                className="flex items-center gap-[12px]"
              >
                <div className="w-[36px] h-[36px] rounded-[10px] bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center text-[#10B981] shrink-0">
                  <feat.icon size={16} />
                </div>
                <p className="text-[#E2E8F0] text-[13px] font-medium">{feat.title}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Decorative */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 0.5, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative z-10 flex items-end gap-[16px]"
        >
          <div className="w-[200px] h-[120px] rounded-[16px] bg-[#111827] border border-[#1E293B] p-[16px] shadow-xl relative overflow-hidden">
            <div className="flex gap-[6px] mb-[12px]">
              <div className="w-[10px] h-[10px] rounded-full bg-red-500/60" />
              <div className="w-[10px] h-[10px] rounded-full bg-yellow-500/60" />
              <div className="w-[10px] h-[10px] rounded-full bg-green-500/60" />
            </div>
            <div className="space-y-[6px]">
              <div className="h-[8px] w-3/4 bg-[#1E293B] rounded" />
              <div className="h-[8px] w-1/2 bg-[#1E293B] rounded" />
              <div className="h-[8px] w-2/3 bg-[#10B981]/30 rounded" />
            </div>
            <div className="absolute -bottom-[4px] -right-[4px] w-[40px] h-[40px] rounded-[12px] bg-[#10B981]/20 flex items-center justify-center">
              <GraduationCap size={18} className="text-[#10B981]" />
            </div>
          </div>
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="w-[40px] h-[40px] rounded-[12px] bg-[#10B981] flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-[16px]"
          >
            <Sparkles size={14} className="text-white" />
          </motion.div>
        </motion.div>
      </motion.div>


      {/* ========== RIGHT PANEL — Signup Form ========== */}
      <div className="flex-1 flex items-center justify-center p-[24px] relative overflow-y-auto">
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
          {/* Header */}
          <div className="text-center mb-[24px]">
            <h2 className="font-display font-extrabold text-[26px] text-white tracking-tight">
              Create your account
            </h2>
            <p className="text-[14px] text-[#94A3B8] mt-[4px]">
              Join thousands of students learning smarter
            </p>
          </div>

          {/* Error */}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-[20px]">
            {/* Full Name */}
            <div>
              <label className="block text-[13px] font-medium text-[#94A3B8] mb-[8px]">Full Name</label>
              <div className="relative">
                <span className="input-icon-left"><User size={18} /></span>
                <input
                  id="register-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="input-field"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[13px] font-medium text-[#94A3B8] mb-[8px]">Email Address</label>
              <div className="relative">
                <span className="input-icon-left"><Mail size={18} /></span>
                <input
                  id="register-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-field"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[13px] font-medium text-[#94A3B8] mb-[8px]">Password</label>
              <div className="relative">
                <span className="input-icon-left"><Lock size={18} /></span>
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
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
              {/* Strength Indicator */}
              {password && (
                <div className="flex items-center gap-[8px] mt-[8px]">
                  <div className="flex gap-[4px] flex-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-[4px] flex-1 rounded-full transition-all ${
                          i <= strength.level ? strength.color : 'bg-[#1E293B]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-[11px] font-medium whitespace-nowrap ${
                    strength.level <= 1 ? 'text-red-400' :
                    strength.level <= 2 ? 'text-yellow-400' :
                    strength.level <= 3 ? 'text-blue-400' : 'text-[#10B981]'
                  }`}>
                    Password strength: {strength.label}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[13px] font-medium text-[#94A3B8] mb-[8px]">Confirm Password</label>
              <div className="relative">
                <span className="input-icon-left"><Lock size={18} /></span>
                <input
                  id="register-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="input-field"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="input-icon-right cursor-pointer hover:text-[#94A3B8] transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Terms Checkbox — items-center alignment */}
            <label className="flex items-center gap-[10px] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-[18px] h-[18px] rounded-[4px] border-[#1E293B] bg-[#111827] text-[#10B981] focus:ring-[#10B981]/30 focus:ring-offset-0 cursor-pointer shrink-0 accent-[#10B981]"
              />
              <span className="text-[13px] text-[#94A3B8] leading-snug">
                I agree to the{' '}
                <span className="text-[#10B981] hover:text-[#059669] cursor-pointer font-medium">Terms of Service</span>
                {' '}and{' '}
                <span className="text-[#10B981] hover:text-[#059669] cursor-pointer font-medium">Privacy Policy</span>
              </span>
            </label>

            {/* Submit */}
            <div className="pt-[4px]">
              <button
                type="submit"
                disabled={isLoading}
                id="register-submit"
                className="btn-primary"
              >
                {isLoading ? (
                  <div className="flex gap-[4px]">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-[16px] my-[24px]">
            <div className="flex-1 h-px bg-[#1E293B]" />
            <span className="text-[12px] text-[#64748B] uppercase tracking-wider font-medium">or</span>
            <div className="flex-1 h-px bg-[#1E293B]" />
          </div>

          {/* Social Buttons — equal height, consistent radius */}
          <div className="space-y-[12px]">
            <button type="button" className="btn-social">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
            <button type="button" className="btn-social">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
                <rect x="13" y="1" width="10" height="10" fill="#7FBA00"/>
                <rect x="1" y="13" width="10" height="10" fill="#00A4EF"/>
                <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
              </svg>
              Continue with Microsoft
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-[14px] text-[#94A3B8] mt-[24px]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#10B981] font-semibold hover:text-[#059669] transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
