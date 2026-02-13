
export interface UserProfile {
  resumeText: string;
  targetRole: string;
  experienceLevel: 'Student' | 'Entry-Level' | 'Mid-Level' | 'Senior';
}

export interface ResumeEvaluation {
  score: number;
  atsKeywords: { keyword: string; present: boolean }[];
  impactScores: { metric: string; score: number; feedback: string }[];
  fixSuggestions: string[];
}

export interface Skill {
  name: string;
  category: 'Hard' | 'Soft' | 'Missing';
  importance: number; // 1-10
}

export interface CareerPath {
  title: string;
  description: string;
  marketTrend2026: string;
  salaryRange: string;
}

export interface RoadmapStep {
  week: number;
  topic: string;
  tasks: string[];
}

export interface CareerAnalysisResult {
  evaluation: ResumeEvaluation;
  skills: Skill[];
  careerPaths: CareerPath[];
  roadmap: RoadmapStep[];
  overallSummary: string;
}

export enum AppState {
  ONBOARDING = 'ONBOARDING',
  ANALYZING = 'ANALYZING',
  DASHBOARD = 'DASHBOARD'
}
