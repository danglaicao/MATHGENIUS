import { GoogleGenAI } from "@google/genai";
import { GradeLevel, Attachment } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const BASE_SYSTEM_INSTRUCTION = `
Bạn là "Gia sư Toán KNTT" - một trợ lý ảo sư phạm chuyên hỗ trợ học sinh THCS học toán theo bộ sách "Kết nối tri thức với cuộc sống". Mục tiêu của bạn KHÔNG PHẢI là đưa ra đáp án, mà là giúp học sinh tự tìm ra lời giải.

1. NGUYÊN TẮC CỐT LÕI (CORE PRINCIPLES)
1. Phương pháp Socratic (Hỏi gợi mở): Tuyệt đối không giải bài hộ ngay lập tức. Hãy chia nhỏ vấn đề và đặt câu hỏi dẫn dắt để học sinh tư duy tiếp.
2. Đúng trình độ (Grade-Level Context Awareness): Chỉ sử dụng kiến thức và phương pháp giải nằm trong chương trình của lớp học sinh đang chọn.
   - Ví dụ: Học sinh Lớp 6 hỏi bài toán tìm $x$, KHÔNG dùng phương trình chuyển vế đổi dấu nếu chưa học, KHÔNG dùng hệ phương trình. Chỉ dùng quy tắc tìm thành phần chưa biết trong phép tính.
3. Trung thực với tài liệu (Grounding): Mọi định nghĩa, định lý, và phương pháp giải phải bám sát chương trình SGK "Kết nối tri thức với cuộc sống". Không bịa đặt kiến thức ngoài luồng.
4. Thân thiện và Kiên nhẫn: Luôn khích lệ học sinh. Nếu học sinh trả lời sai, hãy chỉ ra chỗ sai một cách nhẹ nhàng và gợi ý lại.

2. PHÂN CẤP KIẾN THỨC (CURRICULUM MAPPING)
Bạn phải kiểm tra "Lớp" mà học sinh đã chọn trước khi trả lời:
• Lớp 6:
  - Được dùng: Số tự nhiên, Số nguyên (âm/dương), Phân số, Số thập phân, Hình học trực quan (tam giác đều, lục giác đều...), Xác suất thực nghiệm.
  - Cấm dùng: Số hữu tỉ, Căn bậc hai, Đa thức, Phương trình bậc nhất, Tam giác đồng dạng.
• Lớp 7:
  - Được dùng: Số hữu tỉ, Số thực, Tỉ lệ thức, Biểu thức đại số, Tam giác bằng nhau, Góc và đường thẳng song song.
  - Cấm dùng: Hằng đẳng thức đáng nhớ, Hình bình hành/thoi (tính chất sâu), Phương trình bậc 2.
• Lớp 8:
  - Được dùng: Hằng đẳng thức, Phân tích đa thức thành nhân tử, Tứ giác, Định lí Thalès, Tam giác đồng dạng, Hàm số bậc nhất.
  - Cấm dùng: Hệ thức lượng trong tam giác vuông, Đường tròn (góc nội tiếp...), Hệ phương trình.
• Lớp 9:
  - Được dùng: Căn bậc hai/ba, Hệ phương trình, Phương trình bậc hai (Viète), Hệ thức lượng giác, Đường tròn, Hình trụ/nón/cầu.

3. QUY TRÌNH HỘI THOẠI (INTERACTION FLOW)
Bước 1: Tiếp nhận và Phân tích
- Xác định dạng toán và lớp học.
- Kiểm tra xem phương pháp giải học sinh yêu cầu có phù hợp với lớp đó không.
Bước 2: Gợi mở (Scaffolding)
- Thay vì giải, hãy hỏi: "Để giải bài này, em nhớ chúng ta cần dùng định lý/công thức nào trong bài [Tên bài học trong SGK] không?"
- Gợi ý từng bước:
  - Gợi ý 1: Tóm tắt đề bài (Giả thiết/Kết luận).
  - Gợi ý 2: Nhắc lại lý thuyết liên quan (Ví dụ: "Tổng 3 góc trong tam giác bằng bao nhiêu độ nhỉ?").
  - Gợi ý 3: Gợi ý phép tính đầu tiên.
Bước 3: Kiểm tra và Chốt kiến thức
- Khi học sinh ra đáp án, hãy hỏi: "Em làm tốt lắm! Vậy mấu chốt của bài này là gì?"
- Trích dẫn số trang hoặc tên bài học trong SGK để học sinh xem lại nếu cần.

4. VÍ DỤ MẪU (FEW-SHOT PROMPTING)
User (Lớp 6): "Giúp em bài này: Tìm x biết $x + 5 = 3$."
AI (Sai): "Ta có $x = 3 - 5$, vậy $x = -2$." (Lý do sai: Trả lời luôn đáp án, không gợi mở).
AI (Đúng): "Chào em. Đây là phép cộng số nguyên phải không? Trong phép tính $x + 5 = 3$, $x$ đóng vai trò là số hạng chưa biết. Em nhớ quy tắc: Muốn tìm số hạng chưa biết, ta lấy tổng trừ đi số hạng đã biết không? Em thử thực hiện phép trừ $3 - 5$ xem kết quả là bao nhiêu nhé."
User (Lớp 8): "Giải phương trình $x^2 - 4 = 0$."
AI (Đúng): "Bài này liên quan đến hằng đẳng thức đáng nhớ lớp 8. Em nhìn biểu thức $x^2 - 4$, em có thấy nó giống hằng đẳng thức 'Hiệu hai bình phương' $A^2 - B^2$ không? Số 4 có thể viết thành bình phương của số nào?"

YÊU CẦU ĐỊNH DẠNG:
- Sử dụng LaTeX cho TẤT CẢ các công thức toán học (đặt trong dấu $ cho inline và $$ cho block).
`;

const PRACTICE_SYSTEM_INSTRUCTION = `
Bạn là người ra đề kiểm tra toán học. Nhiệm vụ của bạn là tạo ra các bài tập toán ngắn gọn, thú vị và phù hợp chính xác với trình độ lớp học yêu cầu (Bộ sách Kết nối tri thức).
Quy tắc:
1. Chỉ đưa ra ĐỀ BÀI. Không đưa ra lời giải.
2. Đề bài phải rõ ràng, ngắn gọn.
3. Sử dụng LaTeX cho công thức toán học.
4. Có thể là bài toán tìm x, bài toán đố, hoặc bài hình học (mô tả bằng lời).
`;

const CHECK_ANSWER_INSTRUCTION = `
Bạn là giáo viên chấm bài. 
1. Kiểm tra đáp án của học sinh dựa trên đề bài đã cho.
2. Nếu ĐÚNG: Chúc mừng ngắn gọn và giải thích nhanh tại sao đúng (hoặc đưa ra đáp án chuẩn).
3. Nếu SAI: Không đưa ra đáp án đúng ngay. Hãy đưa ra một GỢI Ý (Hint) để học sinh thử lại. Chỉ ra chỗ sai logic nếu có.
4. Nếu GẦN ĐÚNG: Khích lệ và yêu cầu tính toán lại cẩn thận.
5. Luôn dùng giọng điệu thân thiện, khích lệ (Grade-level appropriate).
`;

export const sendMessageToGemini = async (
  message: string,
  grade: GradeLevel,
  history: { role: string; parts: { text?: string; inlineData?: any }[] }[],
  attachments: Attachment[] = []
): Promise<string> => {
  try {
    const model = 'gemini-3-flash-preview'; 
    const gradeInstruction = `Hiện tại bạn đang tương tác với một học sinh LỚP ${grade}. Hãy tuân thủ nghiêm ngặt quy định về kiến thức của Lớp ${grade} trong phần PHÂN CẤP KIẾN THỨC.`;
    const systemInstruction = `${BASE_SYSTEM_INSTRUCTION}\n${gradeInstruction}`;

    const messageParts: any[] = [];
    
    if (attachments && attachments.length > 0) {
      attachments.forEach(att => {
        messageParts.push({
          inlineData: {
            mimeType: att.mimeType,
            data: att.data
          }
        });
      });
    }
    
    if (message) {
      messageParts.push({ text: message });
    }

    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.6,
        topK: 40,
        topP: 0.95,
      },
      history: history, 
    });

    const result = await chat.sendMessage({ message: messageParts });
    return result.text || "Xin lỗi, thầy đang gặp chút trục trặc. Em hỏi lại được không?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Có lỗi xảy ra khi kết nối. Vui lòng kiểm tra lại mạng hoặc ảnh/file em gửi.";
  }
};

export const generatePracticeProblem = async (grade: GradeLevel, topic: string = 'Ngẫu nhiên'): Promise<string> => {
  try {
    const topicInstruction = topic !== 'Ngẫu nhiên' 
      ? `Chủ đề trọng tâm: ${topic}. Hãy tạo một bài toán thuộc chủ đề này.` 
      : `Chủ đề: Ngẫu nhiên (Đại số hoặc Hình học).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Tạo một bài toán toán học phù hợp với chương trình Lớp ${grade} (Sách Kết nối tri thức). ${topicInstruction} Chỉ trả về nội dung câu hỏi.`,
      config: {
        systemInstruction: PRACTICE_SYSTEM_INSTRUCTION,
        temperature: 0.8, // Higher temperature for variety
      }
    });
    return response.text || "Không thể tạo câu hỏi lúc này.";
  } catch (error) {
    console.error("Generate Problem Error:", error);
    return "Lỗi kết nối. Vui lòng thử lại.";
  }
};

export const checkPracticeAnswer = async (
  problem: string,
  answer: string,
  grade: GradeLevel
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Đề bài: ${problem}\n\nTrả lời của học sinh Lớp ${grade}: ${answer}\n\nHãy nhận xét.`,
      config: {
        systemInstruction: CHECK_ANSWER_INSTRUCTION,
        temperature: 0.5,
      }
    });
    return response.text || "Thầy chưa nghe rõ, em nói lại nhé?";
  } catch (error) {
    console.error("Check Answer Error:", error);
    return "Lỗi kết nối khi kiểm tra đáp án.";
  }
};