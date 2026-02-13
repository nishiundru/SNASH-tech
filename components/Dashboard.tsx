
import React, { useState } from 'react';
import { UserProfile, CareerAnalysisResult } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { 
  LayoutDashboard, FileCheck, Target, TrendingUp, Calendar, CheckCircle2, 
  AlertTriangle, ArrowRight, ExternalLink, Lightbulb, User, Info
} from 'lucide-react';

interface Props {
  profile: UserProfile;
  result: CareerAnalysisResult;
}

const Dashboard: React.FC<Props> = ({ profile, result }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'resume' | 'skills' | 'career' | 'roadmap'>('overview');

  const radarData = result.skills.map(s => ({
    subject: s.name,
    A: s.importance * 10,
    fullMark: 100,
  }));

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
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 p-1 bg-slate-200/50 rounded-xl w-fit">
        <NavItem id="overview" label="Overview" icon={LayoutDashboard} />
        <NavItem id="resume" label="Resume Audit" icon={FileCheck} />
        <NavItem id="skills" label="Skill Gap" icon={Target} />
        <NavItem id="career" label="Trajectories" icon={TrendingUp} />
        <NavItem id="roadmap" label="Roadmap" icon={Calendar} />
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-600">
                <Info className="w-5 h-5" /> Strategic Summary
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg italic">
                "{result.overallSummary}"
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="text-slate-500 text-sm font-medium mb-1">Resume Impact Score</h4>
                  <div className="text-4xl font-black text-indigo-600">{result.evaluation.score}/100</div>
                </div>
                <div className="mt-4 flex gap-2">
                  <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full" style={{ width: `${result.evaluation.score}%` }}></div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="text-slate-500 text-sm font-medium mb-1">Top Missing Link</h4>
                  <div className="text-xl font-bold text-slate-800">
                    {result.skills.find(s => s.category === 'Missing')?.name || 'N/A'}
                  </div>
                </div>
                <button onClick={() => setActiveTab('skills')} className="mt-4 text-indigo-600 text-xs font-bold flex items-center gap-1 hover:underline">
                  Analyze skill gap <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" /> Target Profile
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</div>
                <div className="font-bold text-slate-700">{profile.targetRole}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Experience</div>
                <div className="font-bold text-slate-700">{profile.experienceLevel}</div>
              </div>
            </div>
            <div className="mt-8">
              <h4 className="text-sm font-bold text-slate-700 mb-4 uppercase">Market Readiness</h4>
              <div className="h-[200px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" fontSize={10} />
                      <Radar name="Skills" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.4} />
                    </RadarChart>
                  </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resume Audit Tab */}
      {activeTab === 'resume' && (
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold mb-6">Impact Metric Analysis</h3>
              <div className="space-y-6">
                {result.evaluation.impactScores.map((impact, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="font-bold text-slate-700">{impact.metric}</span>
                      <span className="text-xs font-black text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded">{impact.score}/10</span>
                    </div>
                    <div className="bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full transition-all duration-1000" style={{ width: `${impact.score * 10}%` }}></div>
                    </div>
                    <p className="text-sm text-slate-500">{impact.feedback}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-indigo-900 text-white p-8 rounded-2xl shadow-xl shadow-indigo-100">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-400" /> Actionable Fixes
              </h3>
              <ul className="space-y-4">
                {result.evaluation.fixSuggestions.map((fix, idx) => (
                  <li key={idx} className="flex gap-3 text-indigo-100 leading-relaxed">
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-indigo-400" />
                    <span className="font-medium text-slate-50">{fix}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold mb-4">ATS Compatibility Check</h3>
              <p className="text-sm text-slate-500 mb-6">Checking presence of high-priority industry keywords for 2026 hiring filters.</p>
              <div className="grid grid-cols-1 gap-3">
                {result.evaluation.atsKeywords.map((kw, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                    <span className="font-mono text-sm text-slate-600">{kw.keyword}</span>
                    {kw.present ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Skill Gap Tab */}
      {activeTab === 'skills' && (
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold mb-8">Skill Priority Matrix</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={result.skills} layout="vertical" margin={{ left: 40, right: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" fontSize={12} width={120} axisLine={false} tickLine={false} />
                  <ReTooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="importance" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {(['Hard', 'Soft', 'Missing'] as const).map(category => (
              <div key={category} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h4 className={`text-sm font-bold uppercase tracking-widest mb-4 ${
                  category === 'Missing' ? 'text-rose-600' : 'text-slate-500'
                }`}>
                  {category} Skills
                </h4>
                <div className="space-y-2">
                  {result.skills.filter(s => s.category === category).map((skill, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                      <span className="font-semibold text-slate-700">{skill.name}</span>
                      <span className="text-[10px] font-black bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        LVL {skill.importance}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Career Trajectories Tab */}
      {activeTab === 'career' && (
        <div className="grid md:grid-cols-3 gap-6">
          {result.careerPaths.map((path, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all group flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-black text-slate-900 leading-tight">{path.title}</h3>
                <TrendingUp className="w-5 h-5 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed flex-grow">
                {path.description}
              </p>
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="text-[10px] font-bold text-emerald-600 uppercase mb-1">2026 Forecast</div>
                  <div className="text-xs font-medium text-emerald-800 leading-snug">{path.marketTrend2026}</div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-400">EST. SALARY RANGE</span>
                  <span className="font-bold text-slate-800">{path.salaryRange}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Roadmap Tab */}
      {activeTab === 'roadmap' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold">Personalized 4-Week Sprint</h3>
            <span className="px-4 py-1 bg-indigo-600 text-white text-xs font-black rounded-full uppercase tracking-tighter">
              Roadmap 2.0
            </span>
          </div>
          
          <div className="relative space-y-12 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-slate-200">
            {result.roadmap.map((step, idx) => (
              <div key={idx} className="relative pl-12">
                <div className="absolute left-0 mt-1 flex items-center justify-center w-10 h-10 rounded-full bg-white border-4 border-indigo-600 shadow-sm">
                  <span className="text-sm font-black text-indigo-600">{step.week}</span>
                </div>
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-lg font-bold text-slate-900 mb-4">{step.topic}</h4>
                  <ul className="grid md:grid-cols-2 gap-4">
                    {step.tasks.map((task, tIdx) => (
                      <li key={tIdx} className="flex gap-3 text-slate-600 text-sm items-start">
                        <div className="w-5 h-5 rounded-md bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 className="w-3 h-3 text-indigo-500" />
                        </div>
                        <span className="leading-snug">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 text-white p-8 rounded-2xl flex items-center justify-between gap-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-12 bg-white/5 rounded-full -mr-12 -mt-12 blur-3xl"></div>
            <div className="relative z-10">
              <h4 className="text-xl font-bold mb-2">Ready to kickstart this sprint?</h4>
              <p className="text-slate-400 text-sm">Download your roadmap as a PDF or sync with your calendar.</p>
            </div>
            <button className="relative z-10 flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-colors whitespace-nowrap">
              Export Roadmap <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
