export enum GameMode {
  TIME_30 = 30,
  TIME_60 = 60,
  TIME_120 = 120,
}

export enum CodingLanguage {
  JAVASCRIPT = 'JavaScript',
  PYTHON = 'Python',
  CPP = 'C++',
  JAVA = 'Java',
  GO = 'Go',
  RUST = 'Rust',
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  xp: number;
  level: number;
}

export interface TestResult {
  id: string;
  date: string;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  language: CodingLanguage;
  duration: number;
  mistakes: number;
}

export interface SnippetResponse {
  code: string;
  language: string;
  source?: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  wpm: number;
  accuracy: number;
  language: CodingLanguage;
  date: string;
}
