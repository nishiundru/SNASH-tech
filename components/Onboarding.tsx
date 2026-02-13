
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Briefcase, GraduationCap, FileText, Send, AlertCircle } from 'lucide-react';

interface Props {
  onSubmit: (profile: UserProfile) => void;
  error: string | null;
}

const Onboarding: React.FC<Props> = ({ onSubmit, error }) => {
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
            <p className="text-xs text-slate-400 italic">
              Pro-tip: Include job descriptions or specific achievement bullet points for higher accuracy.
            </p>
          </div>
        </div>

        <div className="px-8 py-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500 max-w-sm">
            By clicking analyze, VidyaGuide AI will process your data using Gemini Flash for rapid career insights.
          </p>
          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5"
          >
            Start Analysis <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Onboarding;
