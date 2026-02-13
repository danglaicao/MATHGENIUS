export enum GradeLevel {
  Grade6 = 6,
  Grade7 = 7,
  Grade8 = 8,
  Grade9 = 9
}

export interface Attachment {
  name: string;
  mimeType: string;
  data: string; // Base64 string
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'warning';
  text: string;
  timestamp: number;
  attachments?: Attachment[];
}

export interface PracticeProblem {
  id: string;
  content: string; // The question text (can contain LaTeX)
  topic?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

export type ViewState = 'home' | 'chat';
export type ActiveTab = 'chat' | 'practice';