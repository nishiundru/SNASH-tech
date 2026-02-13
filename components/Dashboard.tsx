
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, CareerAnalysisResult, ChatMessage } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, Radar 
} from 'recharts';
import { 
  LayoutDashboard, FileCheck, Target, TrendingUp, Calendar, CheckCircle2, 
  AlertTriangle, ArrowRight, ExternalLink, Lightbulb, User, Info, MessageSquare, Send, Sparkles, Loader2
} from 'lucide-react';
import { chatWithMentor, optimizeBullet } from '../services/geminiService';

interface Props {
  profile: UserProfile;
  result: CareerAnalysisResult;
}

const Dashboard: React.FC<Props> = ({ profile, result }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'resume' | 'skills' | 'career' | 'roadmap' | 'chat'>('overview');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [bulletToOptimize, setBulletToOptimize] = useState('');
  const [optimizedBullet, setOptimizedBullet] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isChatLoading) return;
    
    const userMsg: ChatMessage = { role: 'user', text: currentMessage };
    setChatHistory(prev => [...prev, userMsg]);
    setCurrentMessage('');
    setIsChatLoading(true);
    
    try {
      const response = await chatWithMentor(currentMessage, chatHistory);
      setChatHistory(prev => [...prev, response]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleOptimizeBullet = async () => {
    if (!bulletToOptimize.trim()) return;
    setIsOptimizing(true);
    try {
      const result = await optimizeBullet(bulletToOptimize, profile.targetRole);
      setOptimizedBullet(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const NavItem = ({ id, label, icon: Icon }: { id: typeof activeTab; label: string; icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
        activeTab === id 
          ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' 
          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-wrap gap-2 p-1 bg-slate-200/50 rounded-xl w-fit">
        <NavItem id="overview" label="Overview" icon={LayoutDashboard} />
        <NavItem id="resume" label="Resume Audit" icon={FileCheck} />
        <NavItem id="skills" label="Skill Gap" icon={Target} />
        <NavItem id="career" label="Trajectories" icon={TrendingUp} />
        <NavItem id="roadmap" label="Roadmap" icon={Calendar} />
        <NavItem id="chat" label="Ask Mentor" icon={MessageSquare} />
      </div>

      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-600">
                <Info className="w-5 h-5" /> Strategic Summary
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg italic">"{result.overallSummary}"</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h4 className="text-slate-500 text-sm font-medium mb-1">Resume Impact Score</h4>
                <div className="text-4xl font-black text-indigo-600">{result.evaluation.score}/100</div>
              </div>
              <div className="bg-indigo-600 p-6 rounded-2xl text-white flex flex-col justify-between">
                <h4 className="text-indigo-100 text-sm font-medium">Ready for deep dive?</h4>
                <button onClick={() => setActiveTab('chat')} className="mt-4 flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-xl font-bold text-sm w-fit shadow-lg shadow-indigo-900/20">
                   Chat with Mentor <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <h3 className="text-lg font-bold mb-4">Market Readiness</h3>
             <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={result.skills.map(s => ({ subject: s.name, A: s.importance * 10 }))}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" fontSize={10} />
                    <Radar name="Skills" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'resume' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold mb-4">Impact Analysis</h3>
              <div className="space-y-4">
                {result.evaluation.impactScores.map((impact, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex justify-between mb-1">
                      <span className="font-bold text-slate-700">{impact.metric}</span>
                      <span className="text-indigo-600 font-black">{impact.score}/10</span>
                    </div>
                    <p className="text-sm text-slate-500">{impact.feedback}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-slate-900 p-6 rounded-2xl text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-400">
                <Sparkles className="w-5 h-5" /> Bullet Point Optimizer (Flash)
              </h3>
              <p className="text-sm text-slate-400 mb-4">Paste a weak resume point to rewrite it instantly with quantified impact.</p>
              <textarea 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm focus:ring-1 focus:ring-indigo-500 outline-none mb-4 min-h-[100px]"
                placeholder="e.g. Responsible for managing the website frontend..."
                value={bulletToOptimize}
                onChange={(e) => setBulletToOptimize(e.target.value)}
              />
              <button 
                onClick={handleOptimizeBullet}
                disabled={isOptimizing || !bulletToOptimize}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isOptimizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Optimize Point
              </button>
              {optimizedBullet && (
                <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10 animate-in slide-in-from-bottom-2">
                  <div className="text-xs font-bold text-indigo-400 uppercase mb-2">High Impact Result:</div>
                  <p className="text-sm italic leading-relaxed">"{optimizedBullet}"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'chat' && (
        <div className="max-w-4xl mx-auto flex flex-col h-[70vh] bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                <Sparkles className="text-white w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">VidyaGuide Mentor</h3>
                <p className="text-[10px] text-emerald-600 font-black uppercase tracking-tighter flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Live Search Enabled
                </p>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 max-w-[150px] text-right">Powered by Gemini 3 Pro for deep market intelligence.</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {chatHistory.length === 0 && (
              <div className="text-center py-20 opacity-50 space-y-4">
                <MessageSquare className="w-12 h-12 mx-auto text-slate-300" />
                <p className="text-sm font-medium">Ask about market trends, companies, or salary negotiations.</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <button onClick={() => setCurrentMessage("What are the top 5 companies hiring for this role in 2026?")} className="text-xs px-3 py-1 bg-slate-100 rounded-full hover:bg-indigo-50 hover:text-indigo-600">"Top 5 companies hiring in 2026?"</button>
                  <button onClick={() => setCurrentMessage("How do I negotiate a better salary for this position?")} className="text-xs px-3 py-1 bg-slate-100 rounded-full hover:bg-indigo-50 hover:text-indigo-600">"How to negotiate salary?"</button>
                </div>
              </div>
            )}
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 text-slate-800 shadow-sm border border-slate-200'}`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  {msg.sources && (
                    <div className="mt-4 pt-3 border-t border-slate-200 space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sources:</p>
                      <div className="flex flex-wrap gap-2">
                        {msg.sources.map((s, si) => (
                          <a key={si} href={s.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded text-[10px] text-indigo-600 font-bold hover:bg-indigo-50">
                            {s.title.substring(0, 20)}... <ExternalLink className="w-2 h-2" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 rounded-2xl p-4 flex gap-2">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100">
            <div className="relative">
              <input 
                type="text"
                placeholder="Ask your mentor anything..."
                className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none shadow-inner"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button 
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || isChatLoading}
                className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Other tabs remain largely the same, now with better spacing and context */}
      {activeTab === 'skills' && (
        <div className="grid md:grid-cols-3 gap-6">
           {(['Hard', 'Soft', 'Missing'] as const).map(cat => (
             <div key={cat} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
               <h4 className="text-sm font-bold text-slate-500 uppercase mb-4">{cat} Skills</h4>
               <div className="space-y-2">
                 {result.skills.filter(s => s.category === cat).map((s, i) => (
                   <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg group">
                     <span className="font-semibold text-slate-700">{s.name}</span>
                     <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setCurrentMessage(`How can I learn ${s.name} effectively?`); setActiveTab('chat'); }} className="text-xs text-indigo-600 font-bold hover:underline">Learn</button>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
