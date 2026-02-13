
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Briefcase, GraduationCap, FileText, Send, AlertCircle, Key, ExternalLink } from 'lucide-react';

interface Props {
  onSubmit: (profile: UserProfile) => void;
  error: string | null;
  hasKey: boolean;
  onSelectKey: () => void;
}

const Onboarding: React.FC<Props> = ({ onSubmit, error, hasKey, onSelectKey }) => {
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<UserProfile['experienceLevel']>('Entry-Level');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (resumeText.trim() && targetRole.trim()) {
      onSubmit({ resumeText, targetRole, experienceLevel });
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-12 text-center space-y-4">
        <h2 className="text-4xl font-extrabold text-slate-900">Your Personal Career Catalyst.</h2>
        <p className="text-lg text-slate-600">
          Upload your resume content and tell us where you want to go. We'll handle the forensic analysis.
        </p>
      </div>

      <div className="space-y-6">
        {/* API Key Selection Card */}
        {!hasKey && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="text-indigo-900 font-bold flex items-center gap-2">
                <Key className="w-5 h-5" /> Gemini 3 Pro Access
              </h3>
              <p className="text-indigo-700 text-sm">
                To use high-fidelity analysis, you must select an API key from a paid GCP project.
                <a 
                  href="https://ai.google.dev/gemini-api/docs/billing" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-1 inline-flex items-center gap-0.5 text-indigo-600 font-bold hover:underline"
                >
                  View Billing Docs <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>
            <button
              onClick={onSelectKey}
              className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700 transition-all whitespace-nowrap"
            >
              Select API Key
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden">
          <div className="p-8 space-y-8">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" /> Target Job Title
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" /> Experience Level
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                >
                  <option value="Student">Student / Intern</option>
                  <option value="Entry-Level">Entry-Level (0-2 years)</option>
                  <option value="Mid-Level">Mid-Level (3-7 years)</option>
                  <option value="Senior">Senior (8+ years)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Resume Content
              </label>
              <textarea
                required
                rows={12}
                placeholder="Paste your professional summary, experience bullet points, and education here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none placeholder:text-slate-400 font-mono text-sm leading-relaxed"
              />
            </div>
          </div>

          <div className="px-8 py-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <p className="text-xs text-slate-500 max-w-sm">
              Analysis requires an active Gemini Pro key. Results may take up to 20 seconds.
            </p>
            <button
              type="submit"
              disabled={!hasKey}
              className={`flex items-center gap-2 px-8 py-3 font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 ${
                hasKey 
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              Start Analysis <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
