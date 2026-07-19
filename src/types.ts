export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Guest' | 'Student' | 'Instructor' | 'Teaching Assistant' | 'Content Reviewer' | 'Administrator' | 'Super Administrator';
  points: number;
  completedLessons: string[]; // lessonIds
  solvedLabs: string[]; // labIds
  badges: Badge[];
  joinedAt: string;
  completedDailyChallenges?: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface CourseModule {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  difficultyAr: 'مبتدئ' | 'متوسط' | 'متقدم';
  duration: string; // e.g. "5 hours"
  durationAr?: string;
  durationEn?: string;
  lessonsCount: number;
  labsCount: number;
  quizzesCount: number;
  skills: string[];
  skillsAr: string[];
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  duration: string;
  hasVideo: boolean;
  videoUrl?: string; // simulation URL
  hasPdf: boolean;
  pdfUrl?: string;
  hasLab: boolean;
  lab?: Lab;
  hasQuiz: boolean;
  quiz?: Quiz;
  hasAssignment: boolean;
  assignmentDescription?: string;
}

export interface Lab {
  id: string;
  lessonId: string;
  title: string;
  titleEn: string;
  scenario: string;
  scenarioEn: string;
  objective: string;
  objectiveEn: string;
  hints: string[];
  hintsAr: string[];
  envType: 'Linux' | 'Web' | 'Network';
  tools: string[];
  points: number;
  expectedFlag: string;
  commands?: string; // details on what commands can be run
}

export interface QuizQuestion {
  id: string;
  type: 'MCQ' | 'TrueFalse' | 'Matching' | 'Ordering' | 'FillInBlank' | 'CodeAnalysis' | 'ScenarioBased';
  question: string;
  questionEn: string;
  options?: string[]; // for MCQ, Matching
  optionsEn?: string[];
  matchingPairs?: { left: string; right: string }[]; // for Matching
  correctAnswer: string | string[] | { [key: string]: string }; // normalized answers
  explanation: string;
  explanationEn: string;
  points: number;
}

export interface Quiz {
  id: string;
  lessonId: string;
  timeLimitSeconds: number;
  questions: QuizQuestion[];
}

export interface TerminalLog {
  id: string;
  timestamp: string;
  command: string;
  output: string;
  type: 'input' | 'output' | 'error' | 'success';
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    role: string;
    points: number;
  };
  category: string;
  upvotes: number;
  repliesCount: number;
  createdAt: string;
  replies: ForumReply[];
}

export interface ForumReply {
  id: string;
  content: string;
  author: {
    name: string;
    role: string;
    points: number;
  };
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
  points?: number;
  duration?: number;
}

