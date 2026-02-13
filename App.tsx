
import React, { useState, useCallback } from 'react';
import { UserProfile, AppState, CareerAnalysisResult } from './types';
import { analyzeCareer } from './services/geminiService';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import { Loader2, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.ONBOARDING);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [analysisResult, setAnalysisResult] = useState<CareerAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartAnalysis = useCallback(async (profile: UserProfile) => {
    setUserProfile(profile);
    setAppState(AppState.ANALYZING);
    setError(null);
    try {
      const result = await analyzeCareer(profile);
      setAnalysisResult(result);
      setAppState(AppState.DASHBOARD);
    } catch (err: any) {
      console.error(err);
      setError("Analysis failed. Please try again with more detailed resume text.");
      setAppState(AppState.ONBOARDING);
    }
  }, []);

  const handleReset = () => {
    setAppState(AppState.ONBOARDING);
    setUserProfile(null);
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100">
      {/* Header */}
      <nav className="sticky top-0 z-50 glass-effect border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              VidyaGuide AI
            </h1>
          </div>
          {appState === AppState.DASHBOARD && (
            <button 
              onClick={handleReset}
              className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
            >
              Start New Session
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {appState === AppState.ONBOARDING && (
          <Onboarding onSubmit={handleStartAnalysis} error={error} />
        )}

        {appState === AppState.ANALYZING && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full"></div>
              <Loader2 className="w-16 h-16 text-indigo-600 animate-spin relative" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Performing Forensic Analysis...</h2>
              <p className="text-slate-500 max-w-md mx-auto">
                Scanning resume impact metrics, mapping 2026 market trends, and building your custom roadmap.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full max-w-xs text-xs font-medium text-slate-400">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div> ATS Audit</div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></div> Skill Mapping</div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div> Market Trends</div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div> Learning Paths</div>
            </div>
          </div>
        )}

        {appState === AppState.DASHBOARD && analysisResult && userProfile && (
          <Dashboard profile={userProfile} result={analysisResult} />
        )}
      </main>
      
      <footer className="py-8 text-center text-slate-400 text-sm border-t border-slate-200 mt-20">
        &copy; 2024 VidyaGuide AI. Empowering the workforce of 2026.
      </footer>
    </div>
  );
};

export default App;
