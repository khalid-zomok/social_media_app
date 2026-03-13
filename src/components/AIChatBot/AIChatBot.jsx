import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Input,
  ScrollShadow,
} from "@heroui/react";
import { MdOutlineSmartToy, MdClose, MdSend } from "react-icons/md";
import { GoogleGenerativeAI } from "@google/generative-ai";

// إعداد النموذج (يفضل وضع المفتاح في ملف .env)
// Add "v1" to the configuration object
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);

// Force the model to use the stable version
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash",
  systemInstruction: `
    أنت المساعد الذكي الخاص بمنصة "Zomok X" - وهي منصة تواصل اجتماعي عصرية.
    معلومات عن التطبيق:
    - الاسم: Zomok X 
    - التقنيات المستخدمة: React, HeroUI, Tailwind CSS.
    - المزايا: واجهة مستخدم سريعة، تصميم Responsive، ودعم كامل للمحتوى التفاعلي.
    - المطور: المهندس (خالد الزمك)، خبير في هندسة النظم والـ Frontend.
    دورك:
    - ساعد المستخدمين في التنقل داخل التطبيق.
    - جاوب على أسئلتهم بخصوص كيفية استخدام Zomok X.
    - خلي أسلوبك "Cool" وعصري ويناسب منصات السوشيال ميديا.
    - لو سألك حد عن "Cosmos"، قوله ده مشروع تاني للمهندس، إحنا هنا في Zomok X!
  `
});
console.log("Is the key loaded?", !!import.meta.env.VITE_GEMINI_KEY);
export default function AIChatBot({ isOpen, setIsOpen }) {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "مرحباً! أنا مساعدك الذكي في مشروع Cosmos. كيف يمكنني مساعدتك؟",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // التمرير لأسفل عند إضافة رسالة جديدة
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { role: "user", text: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const result = await model.generateContent(inputValue);
      const response = await result.response;
      const botMessage = { role: "bot", text: response.text() };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      // Extracting the detailed message
      const serverError = error.message || "Unknown Server Error";
      console.error("Full Gemini Error Object:", error);

      setMessages((prev) => [
        ...prev,
        { role: "bot", text: `Dev Debug: ${serverError}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        isIconOnly
        className="rounded-full w-14 h-14 bg-pink-600 shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <MdOutlineSmartToy size={30} color="white" />
      </Button>
    );
  }

  return (
    <Card className="w-80 h-[500px] bg-zinc-900 border border-zinc-800 shadow-2xl flex flex-col">
      <CardHeader className="flex justify-between items-center bg-zinc-800/50 p-3">
        <div className="flex items-center gap-2">
          <MdOutlineSmartToy size={22} className="text-pink-500" />
          <span className="font-bold text-sm text-zinc-100">Cosmos AI</span>
        </div>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          onClick={() => setIsOpen(false)}
        >
          <MdClose size={20} />
        </Button>
      </CardHeader>

      <CardBody className="flex-1 p-0 overflow-hidden">
        <ScrollShadow ref={scrollRef} className="h-full p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl text-xs shadow-sm ${
                  msg.role === "user"
                    ? "bg-pink-600 text-white rounded-tr-none"
                    : "bg-zinc-800 text-zinc-200 rounded-tl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="text-[10px] text-zinc-500 animate-pulse">
              Gemini is thinking...
            </div>
          )}
        </ScrollShadow>
      </CardBody>

      <div className="p-4 border-t border-zinc-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2"
        >
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask Cosmos AI..."
            size="sm"
            variant="flat"
            classNames={{ inputWrapper: "bg-zinc-800" }}
          />
          <Button
            isIconOnly
            size="sm"
            className="bg-pink-600"
            onClick={handleSendMessage}
            isLoading={isLoading}
          >
            {!isLoading && <MdSend size={16} color="white" />}
          </Button>
        </form>
      </div>
    </Card>
  );
}
