import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

// ============================================================================
// 1. SAFETY CORE: ERROR BOUNDARY
// ============================================================================
interface ErrorBoundaryProps {
  children?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: string;
}

// Add types for window.katex
declare global {
  interface Window {
    katex: any;
  }
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Explicitly declare props to fix TS error "Property 'props' does not exist"
  readonly props: Readonly<ErrorBoundaryProps>;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
  }

  state: ErrorBoundaryState = { hasError: false, error: "" };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error: error.toString() };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("CRASH DETECTED:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-gray-900 flex items-center justify-center p-6 text-center font-sans z-[9999]">
          <div className="bg-white/10 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border border-white/10 max-w-md text-white">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-400 border border-red-500/30">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <h2 className="font-bold text-2xl mb-2 tracking-tight">System Malfunction</h2>
            <p className="text-gray-300 mb-6 text-sm">Giao diện gặp sự cố. Vui lòng khởi động lại hệ thống.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl font-bold shadow-lg shadow-red-500/30 hover:scale-105 transition-all"
            >
              Reboot System
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ============================================================================
// 2. ULTRA-REFINED ICONS (Inline SVG, Stroke 1.5)
// ============================================================================

const Icons = {
  Send: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  ),
  User: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  ),
  Bot: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
      <line x1="8" y1="21" x2="16" y2="21"></line>
      <line x1="12" y1="17" x2="12" y2="21"></line>
    </svg>
  ),
  Back: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6"/>
    </svg>
  ),
  Warning: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  ),
  Paperclip: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
    </svg>
  ),
  File: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
      <polyline points="13 2 13 9 20 9"></polyline>
    </svg>
  ),
  X: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
  Sparkles: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z"/>
    </svg>
  ),
  Brain: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
    </svg>
  ),
  Message: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  Check: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Refresh: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
      <path d="M21 3v5h-5"/>
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
      <path d="M3 21v-5h5"/>
    </svg>
  ),
  Book: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  Keyboard: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
      <line x1="6" y1="8" x2="6" y2="8"></line>
      <line x1="10" y1="8" x2="10" y2="8"></line>
      <line x1="14" y1="8" x2="14" y2="8"></line>
      <line x1="18" y1="8" x2="18" y2="8"></line>
      <line x1="6" y1="12" x2="6" y2="12"></line>
      <line x1="10" y1="12" x2="10" y2="12"></line>
      <line x1="14" y1="12" x2="14" y2="12"></line>
      <line x1="18" y1="12" x2="18" y2="12"></line>
      <line x1="7" y1="16" x2="17" y2="16"></line>
    </svg>
  ),
  Shield: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
  ),
  Bulb: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a6 6 0 0 1 6 6c0 2.97-1 3.5-2 4.5V15h-4v-2.5c-1-1-2-1.52-2-4.5a6 6 0 0 1 6-6z"></path>
      <path d="M10 18h4"></path>
      <path d="M10 21h4"></path>
    </svg>
  )
};

// ============================================================================
// 3. LOGIC & CONFIG
// ============================================================================

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
  });
};

const BAD_WORDS = ['ngu', 'đần', 'chó', 'lợn', 'heo', 'điên', 'khùng', 'câm', 'cút', 'đm', 'vcl', 'đéo', 'chết', 'giết'];

const GRADES = [
  { id: 6, label: "LỚP 6", subtitle: "Khởi động hành trình", color: "from-emerald-400 to-teal-600", shadow: "shadow-emerald-500/40" },
  { id: 7, label: "LỚP 7", subtitle: "Khám phá hình học", color: "from-blue-400 to-indigo-600", shadow: "shadow-blue-500/40" },
  { id: 8, label: "LỚP 8", subtitle: "Tư duy đại số", color: "from-violet-400 to-fuchsia-600", shadow: "shadow-violet-500/40" },
  { id: 9, label: "LỚP 9", subtitle: "Chinh phục đỉnh cao", color: "from-orange-400 to-rose-600", shadow: "shadow-orange-500/40" },
];

// Define topics based on Vietnamese KNTT curriculum
const TOPICS_BY_GRADE: Record<number, string[]> = {
  6: ["Ngẫu nhiên", "Số tự nhiên", "Số nguyên", "Phân số & Số thập phân", "Hình học trực quan", "Thống kê & Xác suất"],
  7: ["Ngẫu nhiên", "Số hữu tỉ & Số thực", "Góc & Đường thẳng song song", "Tam giác bằng nhau", "Biểu thức đại số"],
  8: ["Ngẫu nhiên", "Đa thức & Hằng đẳng thức", "Phân thức đại số", "Tứ giác & Định lí Thalès", "Hàm số bậc nhất"],
  9: ["Ngẫu nhiên", "Căn bậc hai", "Hệ phương trình", "Phương trình bậc hai", "Hệ thức lượng giác", "Đường tròn"]
};

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getAIResponse = async (text: string, grade: number, history: any[], attachment?: { mimeType: string, data: string }) => {
  try {
    const systemPrompt = `
      Bạn là AI Tutor dạy Toán Lớp ${grade} (Sách KNTT). 
      Phong cách: Truyền cảm hứng, Socratic (Gợi mở), Hiện đại.
      Quy tắc:
      1. KHÔNG giải bài hộ. Dẫn dắt từng bước.
      2. Dùng Unicode đẹp (², ³, √, π, ÷, ≈).
      3. Nếu có ảnh, phân tích chi tiết.
      4. Luôn tích cực.
      5. Quan trọng: Khi viết công thức toán, hãy bao quanh bằng dấu $ (ví dụ $x^2+2x$).
    `;

    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: { systemInstruction: systemPrompt, temperature: 0.6 },
      history: history,
    });

    const messageContent: any[] = [];
    if (attachment) messageContent.push({ inlineData: { mimeType: attachment.mimeType, data: attachment.data } });
    if (text) messageContent.push({ text: text });
    if (messageContent.length === 0) messageContent.push({ text: "." });

    const result = await chat.sendMessage({ message: messageContent });
    return result.text;
  } catch (error) {
    return "Hệ thống đang quá tải. Vui lòng thử lại sau giây lát.";
  }
};

const generatePracticeProblem = async (grade: number, topic: string = 'Ngẫu nhiên') => {
  try {
    const topicInstruction = topic !== 'Ngẫu nhiên' 
      ? `Chủ đề trọng tâm: ${topic}. Hãy tạo một bài toán thuộc chủ đề này.` 
      : `Chủ đề: Ngẫu nhiên (Đại số hoặc Hình học).`;

    const systemPrompt = `
      Bạn là người ra đề kiểm tra toán học cho học sinh Lớp ${grade} (Sách Kết nối tri thức).
      Nhiệm vụ: Tạo ra một bài toán toán học ngắn gọn, thú vị và phù hợp chính xác với trình độ.
      Quy tắc:
      1. Chỉ trả về NỘI DUNG CÂU HỎI. Không đưa ra lời giải.
      2. Đề bài phải rõ ràng.
      3. Sử dụng LaTeX cho công thức toán học (đặt trong dấu $).
      4. Có thể là Đại số hoặc Hình học.
    `;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Tạo một bài toán toán học phù hợp với chương trình Lớp ${grade} (Sách Kết nối tri thức). ${topicInstruction} Chỉ trả về nội dung câu hỏi.`,
      config: { systemInstruction: systemPrompt, temperature: 0.8 }
    });
    return response.text;
  } catch (error) {
    return "Không thể tạo câu hỏi lúc này.";
  }
};

const checkPracticeAnswer = async (problem: string, answer: string, grade: number) => {
  try {
    const systemPrompt = `
      Bạn là giáo viên chấm bài Toán Lớp ${grade}.
      1. Kiểm tra đáp án của học sinh dựa trên đề bài.
      2. Nếu ĐÚNG: Chúc mừng ngắn gọn và giải thích nhanh tại sao đúng.
      3. Nếu SAI: Không đưa ra đáp án đúng ngay. Hãy đưa ra một GỢI Ý (Hint) để học sinh thử lại.
      4. Luôn dùng giọng điệu thân thiện, khích lệ.
      5. Dùng LaTeX cho công thức ($).
    `;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Đề bài: ${problem}\n\nTrả lời của học sinh: ${answer}\n\nHãy nhận xét.`,
      config: { systemInstruction: systemPrompt, temperature: 0.5 }
    });
    return response.text;
  } catch (error) {
    return "Lỗi kết nối khi kiểm tra đáp án.";
  }
};

// ============================================================================
// 4. THE COMPONENT
// ============================================================================

const MathTutorApp = () => {
  const [grade, setGrade] = useState<number | null>(null);
  
  // Tab State: 'chat' | 'practice' | 'guide'
  const [activeTab, setActiveTab] = useState<'chat' | 'practice' | 'guide'>('chat');

  // Chat State
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Practice State
  const [practiceProblem, setPracticeProblem] = useState("");
  const [practiceAnswer, setPracticeAnswer] = useState("");
  const [practiceFeedback, setPracticeFeedback] = useState("");
  const [isPracticeLoading, setIsPracticeLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("Ngẫu nhiên");

  const [onlineCount, setOnlineCount] = useState(128);
  const [selectedFile, setSelectedFile] = useState<{ file: File; previewUrl: string; type: 'image' | 'doc' } | null>(null);
  
  // KaTeX loading state
  const [isKatexLoaded, setIsKatexLoaded] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount(prev => Math.max(80, prev + (Math.floor(Math.random() * 5) - 2)));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Inject KaTeX scripts and styles via CDN
  useEffect(() => {
    const loadKaTeX = async () => {
      if (window.katex) {
        setIsKatexLoaded(true);
        return;
      }

      // Inject CSS if not already present
      if (!document.querySelector('link[href*="katex.min.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
        link.integrity = 'sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV';
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      }

      // Inject JS
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
      script.integrity = 'sha384-XjKyOOlGwcjNTAIQHIpgOno0Hl1YQqzUOEleOLALmuqehneUG+vnGctmUb0ZY0l8';
      script.crossOrigin = 'anonymous';
      script.onload = () => setIsKatexLoaded(true);
      script.onerror = () => console.error("Failed to load KaTeX");
      document.body.appendChild(script);
    };

    loadKaTeX();
  }, []);

  useEffect(() => {
    if (activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, selectedFile, activeTab]);

  const handleSelectGrade = (selectedGrade: number) => {
    setGrade(selectedGrade);
    setMessages([{ id: 'welcome', role: 'model', text: `Chào mừng đến với không gian Toán học Lớp ${selectedGrade}. Hôm nay chúng ta sẽ chinh phục thử thách nào?` }]);
    setPracticeProblem(""); 
    setPracticeAnswer("");
    setPracticeFeedback("");
    setSelectedTopic("Ngẫu nhiên"); // Reset topic
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const isImage = file.type.startsWith('image/');
      if (selectedFile?.previewUrl) URL.revokeObjectURL(selectedFile.previewUrl);
      setSelectedFile({ file, previewUrl: URL.createObjectURL(file), type: isImage ? 'image' : 'doc' });
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeSelectedFile = () => {
    if (selectedFile?.previewUrl) URL.revokeObjectURL(selectedFile.previewUrl);
    setSelectedFile(null);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputValue.trim() && !selectedFile) || isLoading) return;

    if (BAD_WORDS.some(w => inputValue.toLowerCase().includes(w))) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'warning', text: "Ngôn từ không phù hợp với chuẩn mực cộng đồng." }]);
      setInputValue("");
      return;
    }

    let attachmentData = null;
    let attachmentForMsg = null;

    if (selectedFile) {
      attachmentForMsg = { type: selectedFile.type, url: selectedFile.previewUrl, name: selectedFile.file.name };
      try {
        const base64 = await fileToBase64(selectedFile.file);
        attachmentData = { mimeType: selectedFile.file.type, data: base64 };
      } catch (err) { console.error(err); }
    }

    const userMsg = { id: Date.now().toString(), role: 'user', text: inputValue, attachment: attachmentForMsg };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setSelectedFile(null);
    setIsLoading(true);

    try {
      const history = messages.filter(m => m.role !== 'warning').map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: m.text ? [{ text: m.text }] : []
      }));
      const responseText = await getAIResponse(userMsg.text, grade!, history, attachmentData || undefined);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: responseText }]);
    } catch (err) { } finally { setIsLoading(false); }
  };

  const handleNewPracticeProblem = async () => {
    if (!grade) return;
    setIsPracticeLoading(true);
    setPracticeAnswer("");
    setPracticeFeedback("");
    try {
      const problem = await generatePracticeProblem(grade, selectedTopic);
      setPracticeProblem(problem || "Không lấy được câu hỏi.");
    } catch (e) {
      setPracticeProblem("Lỗi kết nối.");
    } finally {
      setIsPracticeLoading(false);
    }
  };

  const handleCheckPracticeAnswer = async () => {
    if (!practiceProblem || !practiceAnswer.trim() || isPracticeLoading) return;
    setIsPracticeLoading(true);
    try {
      const feedback = await checkPracticeAnswer(practiceProblem, practiceAnswer, grade!);
      setPracticeFeedback(feedback || "Không có phản hồi.");
    } catch (e) {
      setPracticeFeedback("Lỗi khi kiểm tra.");
    } finally {
      setIsPracticeLoading(false);
    }
  };

  // --- MESSAGE PARSING & RENDERING ---
  const renderMessageContent = (text: string) => {
    if (!text) return null;
    
    // Fallback if KaTeX is not loaded or no latex detected
    if (!isKatexLoaded || !text.includes('$')) {
      return <span className="whitespace-pre-wrap">{text}</span>;
    }

    // Split text by block math ($$...$$) or inline math ($...$)
    const regex = /(\$\$[\s\S]*?\$\$|\$[^$\n]*?\$)/g;
    const parts = text.split(regex);

    return (
      <span className="whitespace-pre-wrap">
        {parts.map((part, index) => {
          if (part.startsWith('$$') && part.endsWith('$$')) {
             // Block Math
             const math = part.slice(2, -2);
             try {
               const html = window.katex.renderToString(math, { displayMode: true, throwOnError: false });
               return <div key={index} dangerouslySetInnerHTML={{ __html: html }} className="my-2" />;
             } catch {
               return <span key={index}>{part}</span>;
             }
          } else if (part.startsWith('$') && part.endsWith('$')) {
             // Inline Math
             const math = part.slice(1, -1);
             try {
               const html = window.katex.renderToString(math, { displayMode: false, throwOnError: false });
               return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
             } catch {
               return <span key={index}>{part}</span>;
             }
          }
          // Regular text
          return <span key={index}>{part}</span>;
        })}
      </span>
    );
  };

  // --- MESH GRADIENT BACKGROUND ---
  const renderBackground = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#0f0c29]">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/30 blur-[120px] animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] rounded-full bg-indigo-600/30 blur-[100px] animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] rounded-full bg-pink-600/30 blur-[120px] animate-blob animation-delay-4000"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
    </div>
  );

  // --- FLOATING HEADER ---
  const renderHeader = () => (
    <div className="fixed top-6 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl shadow-indigo-500/20 rounded-full px-2 py-2 flex items-center gap-2 sm:gap-4 max-w-4xl w-full justify-between">
        
        {/* Left: Branding & Back */}
        <div className="flex items-center gap-3 pl-2">
           {grade ? (
             <button 
               onClick={() => setGrade(null)}
               className="group flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-bold text-white transition-all border border-white/5"
             >
               <span className="group-hover:-translate-x-1 transition-transform"><Icons.Back /></span>
               <span className="hidden sm:inline">Trở lại</span>
             </button>
           ) : (
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/40">
               <Icons.Sparkles />
             </div>
           )}
           <h1 className="text-white font-bold text-lg tracking-wide hidden sm:block">
             MATH<span className="font-light text-indigo-300">GENIUS</span>
           </h1>
        </div>

        {/* Center: Tab Switcher (Only when grade selected) */}
        {grade && (
          <div className="flex items-center p-1 bg-black/20 rounded-full border border-white/5 backdrop-blur-sm overflow-x-auto no-scrollbar max-w-[220px] sm:max-w-none">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-shrink-0 flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                activeTab === 'chat' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                  : 'text-indigo-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icons.Message /> <span className="hidden sm:inline">Góc Học Tập</span>
            </button>
            <button
              onClick={() => setActiveTab('practice')}
              className={`flex-shrink-0 flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                activeTab === 'practice' 
                  ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-500/30' 
                  : 'text-indigo-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icons.Brain /> <span className="hidden sm:inline">Luyện tập</span>
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`flex-shrink-0 flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                activeTab === 'guide' 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' 
                  : 'text-indigo-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icons.Book /> <span className="hidden sm:inline">Hướng Dẫn</span>
            </button>
          </div>
        )}

        {/* Right: Grade & Online Status */}
        <div className="flex items-center gap-2">
           {grade && <div className="hidden sm:block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white font-bold text-xs tracking-wider">LỚP {grade}</div>}
           <div className="flex items-center gap-2 bg-black/20 px-3 py-2 rounded-full border border-white/5">
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-mono font-bold text-emerald-300">{onlineCount}</span>
           </div>
        </div>
      </div>
    </div>
  );

  const renderGuideMode = () => (
    <div className="relative z-10 flex-1 overflow-y-auto pt-28 pb-10 px-4 scroll-smooth custom-scrollbar flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-10 animate-fade-in-up">
           <h2 className="text-3xl font-bold text-white mb-2">Hướng Dẫn Sử Dụng</h2>
           <p className="text-indigo-200">Làm chủ công cụ học tập quyền năng này chỉ trong vài phút.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Input Math */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 hover:bg-white/15 transition-all group animate-slide-in">
             <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
               <Icons.Keyboard />
             </div>
             <h3 className="text-xl font-bold text-white mb-2">Nhập Công Thức Toán</h3>
             <p className="text-indigo-100/80 text-sm leading-relaxed mb-4">
               Để công thức hiển thị đẹp mắt, hãy đặt chúng trong cặp dấu <code className="bg-black/30 px-1 py-0.5 rounded text-yellow-300">$</code>.
             </p>
             <div className="bg-black/20 rounded-xl p-3 border border-white/5">
               <div className="flex justify-between text-xs text-gray-400 mb-1">
                 <span>Bạn nhập:</span>
                 <span>Hiển thị:</span>
               </div>
               <div className="flex justify-between items-center font-mono text-sm text-emerald-300">
                 <span>$x^2 + 5x = 0$</span>
                 <span dangerouslySetInnerHTML={{ __html: isKatexLoaded ? window.katex.renderToString("x^2 + 5x = 0") : "x^2 + 5x = 0" }} />
               </div>
             </div>
          </div>

          {/* Card 2: Attachments */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 hover:bg-white/15 transition-all group animate-slide-in" style={{animationDelay: '0.1s'}}>
             <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
               <Icons.Paperclip />
             </div>
             <h3 className="text-xl font-bold text-white mb-2">Gửi Ảnh & Tài Liệu</h3>
             <p className="text-indigo-100/80 text-sm leading-relaxed">
               Bấm vào nút <span className="inline-block align-middle"><Icons.Paperclip /></span> để gửi ảnh chụp bài tập hoặc file tài liệu.
             </p>
             <ul className="mt-4 space-y-2 text-sm text-indigo-200">
               <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>Chụp ảnh bài toán khó</li>
               <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>Gửi file đề cương ôn tập</li>
             </ul>
          </div>

          {/* Card 3: Context Tips */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 hover:bg-white/15 transition-all group animate-slide-in" style={{animationDelay: '0.2s'}}>
             <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
               <Icons.Bulb />
             </div>
             <h3 className="text-xl font-bold text-white mb-2">Mẹo Đặt Câu Hỏi</h3>
             <p className="text-indigo-100/80 text-sm leading-relaxed mb-3">
               AI sẽ trả lời tốt hơn nếu em cung cấp đầy đủ thông tin:
             </p>
             <div className="space-y-3">
               <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                 <span className="text-xs font-bold text-red-300 uppercase block mb-1">Không nên</span>
                 <p className="text-white text-sm">"Giải bài này đi."</p>
               </div>
               <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                 <span className="text-xs font-bold text-emerald-300 uppercase block mb-1">Nên</span>
                 <p className="text-white text-sm">"Cho tam giác ABC vuông tại A. Giúp em tìm độ dài cạnh BC biết AB=3, AC=4."</p>
               </div>
             </div>
          </div>

          {/* Card 4: Rules */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 hover:bg-white/15 transition-all group animate-slide-in" style={{animationDelay: '0.3s'}}>
             <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
               <Icons.Shield />
             </div>
             <h3 className="text-xl font-bold text-white mb-2">Quy Tắc Cộng Đồng</h3>
             <p className="text-indigo-100/80 text-sm leading-relaxed mb-4">
               Chúng ta cùng xây dựng một môi trường học tập văn minh, lịch sự nhé.
             </p>
             <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-indigo-200">Không nói tục</span>
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-indigo-200">Tôn trọng lẫn nhau</span>
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-indigo-200">Không spam</span>
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-indigo-200">Hỏi đúng chủ đề</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPracticeMode = () => (
    <div className="relative z-10 flex-1 overflow-y-auto pt-28 pb-10 px-4 scroll-smooth custom-scrollbar flex flex-col items-center">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        
        {/* Welcome / Empty State */}
        {!practiceProblem && (
          <div className="text-center py-10 animate-fade-in-up">
            <div className="w-24 h-24 bg-gradient-to-br from-fuchsia-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-fuchsia-500/30 animate-blob">
              <Icons.Brain />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Chế độ Luyện tập</h2>
            <p className="text-indigo-200 mb-6 max-w-md mx-auto">Chọn chủ đề và thử sức với các bài toán phù hợp trình độ Lớp {grade}!</p>
            
            {/* Topic Selection */}
            {grade && (
              <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-xl mx-auto">
                {TOPICS_BY_GRADE[grade].map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setSelectedTopic(topic)}
                    className={`px-4 py-1.5 rounded-full text-sm font-bold border transition-all ${
                      selectedTopic === topic
                        ? 'bg-fuchsia-500 text-white border-fuchsia-400 shadow-lg shadow-fuchsia-500/30'
                        : 'bg-white/5 text-indigo-200 border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            )}

            <button 
              onClick={handleNewPracticeProblem}
              disabled={isPracticeLoading}
              className="px-8 py-3 bg-white text-indigo-900 font-bold rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 mx-auto"
            >
              {isPracticeLoading ? (
                <span className="w-5 h-5 border-2 border-indigo-900 border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <Icons.Sparkles />
              )}
              {selectedTopic === "Ngẫu nhiên" ? "Bắt đầu ngay" : `Tạo bài: ${selectedTopic}`}
            </button>
          </div>
        )}

        {/* Problem Card */}
        {practiceProblem && (
          <div className="animate-slide-in">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-indigo-500"></div>
               <div className="flex justify-between items-start mb-4">
                 <div className="flex items-center gap-2">
                   <span className="text-xs font-bold text-fuchsia-300 uppercase tracking-widest bg-fuchsia-500/10 px-3 py-1 rounded-full border border-fuchsia-500/20">Câu hỏi</span>
                   {selectedTopic !== "Ngẫu nhiên" && <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">{selectedTopic}</span>}
                 </div>
                 <button onClick={handleNewPracticeProblem} disabled={isPracticeLoading} className="text-indigo-200 hover:text-white transition-colors" title="Bài khác">
                   <Icons.Refresh />
                 </button>
               </div>
               <div className="text-lg sm:text-xl text-white font-medium leading-relaxed">
                 {renderMessageContent(practiceProblem)}
               </div>
            </div>
          </div>
        )}

        {/* Answer Input */}
        {practiceProblem && (
          <div className="animate-slide-in" style={{animationDelay: '0.1s'}}>
            <div className="flex gap-2">
              <textarea 
                value={practiceAnswer}
                onChange={(e) => setPracticeAnswer(e.target.value)}
                placeholder="Nhập câu trả lời của em..."
                className="flex-1 bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-white placeholder-indigo-300/50 focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/50 transition-all resize-none h-24 sm:h-32"
              />
            </div>
            <div className="flex justify-end mt-4">
              <button 
                onClick={handleCheckPracticeAnswer}
                disabled={!practiceAnswer.trim() || isPracticeLoading}
                className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all ${
                  !practiceAnswer.trim() || isPracticeLoading
                  ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:scale-105 active:scale-95 shadow-emerald-500/20'
                }`}
              >
                 {isPracticeLoading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : <Icons.Check />}
                 Kiểm tra
              </button>
            </div>
          </div>
        )}

        {/* Feedback Area */}
        {practiceFeedback && (
          <div className="animate-slide-in" style={{animationDelay: '0.2s'}}>
            <div className="bg-gradient-to-br from-indigo-900/60 to-purple-900/60 backdrop-blur-md border border-indigo-500/30 rounded-3xl p-6 shadow-xl">
               <div className="flex items-center gap-3 mb-3">
                 <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 border border-indigo-500/30">
                   <Icons.Bot />
                 </div>
                 <span className="text-sm font-bold text-indigo-200 uppercase tracking-wide">Nhận xét của thầy</span>
               </div>
               <div className="text-white/90 leading-relaxed">
                 {renderMessageContent(practiceFeedback)}
               </div>
               <div className="mt-6 pt-4 border-t border-white/10 flex justify-center">
                 <button 
                   onClick={handleNewPracticeProblem}
                   className="text-sm font-bold text-fuchsia-300 hover:text-white transition-colors flex items-center gap-2"
                 >
                   <Icons.Refresh /> Thử bài tập khác
                 </button>
               </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );

  // --- GRADE SELECTOR ---
  if (!grade) {
    return (
      <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column' }}>
        {renderBackground()}
        {renderHeader()}
        <div className="relative z-10 flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center">
          <div className="w-full max-w-4xl text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-200 mb-6 tracking-tight drop-shadow-lg">
              Học Toán không khó
            </h2>
            <p className="text-lg text-indigo-200/80 font-light max-w-2xl mx-auto">
              Trợ lý học tập môn Toán THCS. Hãy chọn lớp để bắt đầu trải nghiệm.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl px-4">
            {GRADES.map((g, idx) => (
              <button
                key={g.id}
                onClick={() => handleSelectGrade(g.id)}
                className={`group relative h-64 rounded-[2rem] p-1 transition-all duration-500 hover:scale-105 hover:-translate-y-2`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${g.color} opacity-20 group-hover:opacity-100 blur-xl transition-opacity duration-500 rounded-[2rem]`}></div>
                <div className="absolute inset-0 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-6 flex flex-col justify-between overflow-hidden group-hover:border-white/40 transition-colors">
                   <div className="relative z-10">
                     <span className="text-5xl font-black text-white/90 drop-shadow-md">{g.id}</span>
                     <div className={`h-1 w-12 bg-gradient-to-r ${g.color} mt-4 rounded-full`}></div>
                   </div>
                   <div className="relative z-10">
                     <h3 className="text-xl font-bold text-white mb-1">{g.label}</h3>
                     <p className="text-xs text-indigo-200 font-medium uppercase tracking-widest">{g.subtitle}</p>
                   </div>
                   <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br ${g.color} rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity`}></div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-20 w-full max-w-3xl mx-auto px-4">
            <div className="py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-md border border-white/10 shadow-xl text-center animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <div className="text-white/90 text-sm font-semibold uppercase tracking-widest mb-1 opacity-70">Powered by</div>
              <div className="text-base sm:text-lg font-bold text-white tracking-wide drop-shadow-md bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-white">
                TỔ TOÁN - TIN HỌC, TRƯỜNG THCS CHU VĂN AN
              </div>
            </div>
          </div>
        </div>
        
        {/* CSS Animations */}
        <style>{`
          @keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
          .animate-blob { animation: blob 15s infinite cubic-bezier(0.4, 0, 0.2, 1); }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }
          .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
      </div>
    );
  }

  // --- MAIN RENDER ---
  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column' }}>
      {renderBackground()}
      {renderHeader()}

      {activeTab === 'chat' && (
        <>
          <div className="relative z-10 flex-1 overflow-y-auto pt-28 pb-32 px-4 scroll-smooth custom-scrollbar">
            <div className="max-w-3xl mx-auto flex flex-col gap-6">
              {messages.map((msg) => {
                if (msg.role === 'warning') return (
                    <div key={msg.id} className="flex justify-center animate-bounce-in">
                      <div className="bg-red-500/20 backdrop-blur-md border border-red-500/30 text-red-200 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg">
                        <Icons.Warning /> {msg.text}
                      </div>
                    </div>
                  );

                const isUser = msg.role === 'user';
                return (
                  <div key={msg.id} className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-slide-in`}>
                    <div className={`flex max-w-[85%] sm:max-w-[75%] gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Avatar */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg border border-white/20 ${isUser ? 'bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white' : 'bg-white/80 backdrop-blur text-indigo-900'}`}>
                        {isUser ? <Icons.User /> : <Icons.Bot />}
                      </div>

                      {/* Bubble */}
                      <div className={`p-5 shadow-xl backdrop-blur-md transition-all hover:scale-[1.01] duration-300 ${
                        isUser 
                          ? 'bg-gradient-to-br from-indigo-600/90 to-fuchsia-600/90 border border-white/20 text-white rounded-[1.5rem] rounded-tr-sm' 
                          : 'bg-white/70 border border-white/40 text-slate-800 rounded-[1.5rem] rounded-tl-sm'
                      }`}>
                        {msg.attachment && (
                          <div className="mb-3 rounded-xl overflow-hidden border border-white/20 bg-black/5 shadow-inner">
                            {msg.attachment.type === 'image' ? (
                              <img src={msg.attachment.url} alt="att" className="max-w-full h-auto max-h-72 object-contain mx-auto" />
                            ) : (
                              <div className="flex items-center gap-3 p-4 bg-white/20">
                                <div className="p-2 bg-white/30 rounded-lg text-current"><Icons.File /></div>
                                <span className="text-sm font-bold truncate max-w-[200px]">{msg.attachment.name}</span>
                              </div>
                            )}
                          </div>
                        )}
                        {msg.text && (
                          <div className={`font-medium text-[15px] leading-relaxed ${!isUser && 'text-indigo-900'}`}>
                            {renderMessageContent(msg.text)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {isLoading && (
                <div className="flex justify-start pl-14 animate-pulse">
                  <div className="bg-white/40 backdrop-blur-md px-6 py-4 rounded-[1.5rem] rounded-tl-sm border border-white/30 shadow-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-fuchsia-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-pink-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* FLOATING CONTROL PANEL (INPUT) */}
          <div className="fixed bottom-6 left-0 right-0 px-4 z-50 flex justify-center">
            <div className="w-full max-w-3xl relative">
              
              {/* File Preview (Floating above) */}
              {selectedFile && (
                <div className="absolute bottom-[110%] left-0 animate-slide-up">
                  <div className="bg-white/80 backdrop-blur-xl p-3 pr-8 rounded-2xl shadow-2xl border border-white/50 flex items-center gap-3 relative">
                    <div className="h-12 w-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                      {selectedFile.type === 'image' ? <img src={selectedFile.previewUrl} className="h-full w-full object-cover" /> : <div className="h-full flex items-center justify-center text-gray-400"><Icons.File /></div>}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-indigo-500 uppercase">Selected</span>
                      <span className="text-xs font-bold text-gray-700 truncate max-w-[120px]">{selectedFile.file.name}</span>
                    </div>
                    <button onClick={removeSelectedFile} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:scale-110 transition"><Icons.X /></button>
                  </div>
                </div>
              )}

              <form 
                onSubmit={handleSendMessage} 
                className="flex items-end gap-2 bg-white/60 backdrop-blur-2xl border border-white/40 p-2 rounded-[2rem] shadow-2xl shadow-indigo-900/20 focus-within:bg-white/80 focus-within:border-indigo-300/50 transition-all duration-300"
              >
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*,.pdf,.docx" className="hidden" />

                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-12 h-12 flex items-center justify-center rounded-full text-indigo-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  <Icons.Paperclip />
                </button>

                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); }}}
                  placeholder="Hỏi thầy bất cứ điều gì..."
                  className="flex-1 bg-transparent border-none focus:ring-0 px-2 py-3.5 text-slate-800 placeholder-slate-500 font-medium resize-none max-h-32 min-h-[48px]"
                  rows={1}
                />

                <button 
                  type="submit"
                  disabled={(!inputValue.trim() && !selectedFile) || isLoading}
                  className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 shadow-lg ${
                    (inputValue.trim() || selectedFile) && !isLoading 
                      ? 'bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white hover:shadow-indigo-500/50 hover:scale-105 active:scale-95' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Icons.Send />
                </button>
              </form>
            </div>
          </div>
        </>
      )}

      {activeTab === 'practice' && renderPracticeMode()}
      
      {activeTab === 'guide' && renderGuideMode()}

      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .animate-slide-in { animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slide-up { animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        /* Hide Scrollbar for Chrome/Safari/Opera */
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        /* Utility to hide scrollbar in navigation */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default function App() { return <ErrorBoundary><MathTutorApp /></ErrorBoundary>; }