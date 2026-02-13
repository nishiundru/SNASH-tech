
import React, { useState, useCallback, useEffect } from 'react';
import { UserProfile, AppState, CareerAnalysisResult } from './types';
import { analyzeCareer } from './services/geminiService';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import { Loader2, Sparkles, Key } from 'lucide-react';

// Define the expected global interface for key selection
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    // Fixed: Removed readonly modifier to match the existing global declaration in the environment
    aistudio: AIStudio;
  }
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.ONBOARDING);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [analysisResult, setAnalysisResult] = useState<CareerAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState<boolean>(false);

  useEffect(() => {
    const checkKey = async () => {
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasKey(selected);
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    // Initiate selection and immediately assume success to prevent race conditions
    await window.aistudio.openSelectKey();
    setHasKey(true);
  };

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
      // Handle key expiration or invalidation by prompting re-selection
      if (err.message === "API_KEY_NOT_FOUND") {
        setHasKey(false);
        setError("Your API key session expired or is invalid. Please select a valid key from a paid GCP project.");
      } else {
        setError("Analysis failed. Please try again with more detailed resume text.");
      }
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
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${hasKey ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
              <Key className="w-3 h-3" />
              {hasKey ? 'Key Active' : 'Key Required'}
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
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {appState === AppState.ONBOARDING && (
          <Onboarding 
            onSubmit={handleStartAnalysis} 
            error={error} 
            hasKey={hasKey}
            onSelectKey={handleSelectKey}
          />
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
                Scanning resume impact metrics using Gemini 3 Pro reasoning. This takes a few moments.
              </p>
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
