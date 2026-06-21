import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/common/Button';
import { fetchSettings, updateSettings } from '../services/settingsService';
import { 
  Settings as SettingsIcon, Save, RefreshCw, 
  Moon, Sliders, Type, Globe, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Settings Form State
  const [theme, setTheme] = useState('dark');
  const [fontSize, setFontSize] = useState('medium');
  const [language, setLanguage] = useState('en');
  const [defaultMode, setDefaultMode] = useState('normal');
  const [responseLength, setResponseLength] = useState('medium');
  const [citationToggle, setCitationToggle] = useState(true);

  const loadSettings = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchSettings();
      setTheme(data.theme);
      setFontSize(data.font_size);
      setLanguage(data.language);
      setDefaultMode(data.default_mode);
      setResponseLength(data.response_length);
      setCitationToggle(data.citation_toggle);
    } catch (err) {
      console.error('Failed to load settings:', err);
      setError('Could not fetch user preferences.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError('');
    
    try {
      await updateSettings({
        theme,
        font_size: fontSize,
        language,
        default_mode: defaultMode,
        response_length: responseLength,
        citation_toggle: citationToggle
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update preferences.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout>
      {/* Header */}
      <div className="p-6 border-b border-[#1E293B]/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <SettingsIcon size={20} />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-white">App Preferences</h1>
            <p className="text-xs text-slate-500">Configure theme, local model defaults, and styling variables</p>
          </div>
        </div>
      </div>

      {/* Settings Form Container */}
      <div className="flex-1 overflow-auto p-6 max-w-2xl">
        {loading ? (
          <div className="h-48 flex items-center justify-center">
            <span className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs"
                >
                  <CheckCircle2 size={14} className="shrink-0" />
                  <span>Preferences saved successfully!</span>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs"
                >
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Interface Section */}
            <div className="glass rounded-2xl p-6 border border-slate-800/80 space-y-4">
              <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
                <Moon size={16} className="text-emerald-500" />
                Interface Customization
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Theme Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">Theme Mode</label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full bg-slate-950/40 border border-slate-850 text-xs text-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500/50 cursor-pointer"
                  >
                    <option value="dark" className="bg-slate-900 text-slate-200">Dark Mode (Default)</option>
                    <option value="light" className="bg-slate-900 text-slate-200">Light Mode</option>
                    <option value="slate" className="bg-slate-900 text-slate-200">Sleek Slate</option>
                  </select>
                </div>

                {/* Font Size */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">Font Sizing</label>
                  <select
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                    className="w-full bg-slate-950/40 border border-slate-850 text-xs text-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500/50 cursor-pointer"
                  >
                    <option value="small" className="bg-slate-900 text-slate-200">Small</option>
                    <option value="medium" className="bg-slate-900 text-slate-200">Medium</option>
                    <option value="large" className="bg-slate-900 text-slate-200">Large</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Model defaults Section */}
            <div className="glass rounded-2xl p-6 border border-slate-800/80 space-y-4">
              <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
                <Sliders size={16} className="text-emerald-500" />
                AI Model Defaults
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Default Mode */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">Default Response Mode</label>
                  <select
                    value={defaultMode}
                    onChange={(e) => setDefaultMode(e.target.value)}
                    className="w-full bg-slate-950/40 border border-slate-850 text-xs text-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500/50 cursor-pointer"
                  >
                    <option value="normal" className="bg-slate-900 text-slate-200">Normal Chat</option>
                    <option value="2mark" className="bg-slate-900 text-slate-200">2 Mark Answer</option>
                    <option value="8mark" className="bg-slate-900 text-slate-200">8 Mark Answer</option>
                    <option value="13mark" className="bg-slate-900 text-slate-200">13 Mark Answer</option>
                    <option value="viva" className="bg-slate-900 text-slate-200">Viva Preparation</option>
                    <option value="quiz" className="bg-slate-900 text-slate-200">Quiz Generator</option>
                    <option value="notes" className="bg-slate-900 text-slate-200">Notes Generator</option>
                  </select>
                </div>

                {/* Response Length */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">Response Verbosity</label>
                  <select
                    value={responseLength}
                    onChange={(e) => setResponseLength(e.target.value)}
                    className="w-full bg-slate-950/40 border border-slate-850 text-xs text-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500/50 cursor-pointer"
                  >
                    <option value="short" className="bg-slate-900 text-slate-200">Concise / Fast</option>
                    <option value="medium" className="bg-slate-900 text-slate-200">Standard / Detailed</option>
                    <option value="long" className="bg-slate-900 text-slate-200">Exhaustive / Academic</option>
                  </select>
                </div>
              </div>

              {/* Citations Switch */}
              <div className="flex items-center justify-between p-3 bg-slate-950/20 rounded-xl border border-slate-850 mt-2">
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">Show Context Citations</h4>
                  <p className="text-[10px] text-slate-500">Append source document names under responses</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={citationToggle}
                    onChange={(e) => setCitationToggle(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 peer-checked:after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500" />
                </label>
              </div>
            </div>

            {/* Locale Section */}
            <div className="glass rounded-2xl p-6 border border-slate-800/80 space-y-4">
              <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
                <Globe size={16} className="text-emerald-500" />
                Language & Translation
              </h3>
              
              <div className="space-y-1.5 max-w-xs">
                <label className="text-xs font-semibold text-slate-400">Primary Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-slate-950/40 border border-slate-850 text-xs text-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500/50 cursor-pointer"
                >
                  <option value="en" className="bg-slate-900 text-slate-200">English (US)</option>
                  <option value="es" className="bg-slate-900 text-slate-200">Spanish</option>
                  <option value="fr" className="bg-slate-900 text-slate-200">French</option>
                  <option value="de" className="bg-slate-900 text-slate-200">German</option>
                </select>
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={loadSettings}
                disabled={saving}
              >
                Reset
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={saving}
                icon={<Save size={14} />}
              >
                Save Preferences
              </Button>
            </div>
          </form>
        )}
      </div>
    </MainLayout>
  );
}
