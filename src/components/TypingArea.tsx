import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameMode, CodingLanguage } from '../types';
import { fetchCodeSnippet } from '../services/geminiService';
import { Loader2, RefreshCw } from 'lucide-react';

interface TypingAreaProps {
 language: CodingLanguage;
 duration: GameMode;
 onFinish: (stats: {
  correctChars: number;
  mistakes: number;
  totalChars: number;
  timeElapsed: number;
  language: string;
 }) => void;
}

const TypingArea: React.FC<TypingAreaProps> = ({
 language,
 duration,
 onFinish,
}) => {
 const [codeSnippet, setCodeSnippet] = useState<string>('');
 const [isLoading, setIsLoading] = useState(true);
 const [input, setInput] = useState('');
 const [startTime, setStartTime] = useState<number | null>(null);
 const [timeLeft, setTimeLeft] = useState<number>(duration);
 const [isActive, setIsActive] = useState(false);
 const [mistakes, setMistakes] = useState(0);

 const inputRef = useRef<HTMLInputElement>(null);
 const codeContainerRef = useRef<HTMLDivElement>(null);
 const hasFinished = useRef(false);

 // =========================
 // Load First Snippet / Restart
 // =========================
 const loadSnippet = useCallback(async () => {
  setIsLoading(true);
  setInput('');
  setStartTime(null);
  setTimeLeft(duration);
  setIsActive(false);
  setMistakes(0);
  hasFinished.current = false;

  const response = await fetchCodeSnippet(language);
  setCodeSnippet(response.code);
  setIsLoading(false);

  setTimeout(() => inputRef.current?.focus(), 100);
 }, [language, duration]);

 useEffect(() => {
  loadSnippet();
 }, [loadSnippet]);

 // =========================
 // Load Next Snippet
 // =========================
 const loadNextSnippet = async () => {
  const response = await fetchCodeSnippet(language);
  setCodeSnippet(response.code);
  setInput('');
  setTimeout(() => inputRef.current?.focus(), 50);
 };

 // =========================
 // Finish Test (Reusable)
 // =========================
 const finishTest = () => {
  if (hasFinished.current) return;
  hasFinished.current = true;

  const correctChars = calculateCorrectChars(input, codeSnippet);

  const elapsed =
   startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;

  onFinish({
   correctChars,
   mistakes,
   totalChars: input.length,
   timeElapsed: elapsed,
   language,
  });

  setIsActive(false);
  setTimeLeft(0);
 };

 // =========================
 // Manual End Button
 // =========================
 const handleEndTest = () => {
  finishTest();
 };

 // =========================
 // Timer Logic
 // =========================
 useEffect(() => {
  let interval: number;

  if (isActive && timeLeft > 0) {
   interval = window.setInterval(() => {
    setTimeLeft((prev) => {
     if (prev <= 1) {
      finishTest();
      return 0;
     }
     return prev - 1;
    });
   }, 1000);
  }

  return () => clearInterval(interval);
 }, [isActive]);

 const calculateCorrectChars = (typed: string, target: string) => {
  let correct = 0;
  for (let i = 0; i < typed.length; i++) {
   if (typed[i] === target[i]) correct++;
  }
  return correct;
 };

 // =========================
 // Input Handler
 // =========================
 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (timeLeft === 0) return;

  const val = e.target.value;

  if (!isActive && val.length === 1) {
   setIsActive(true);
   setStartTime(Date.now());
  }

  if (val.length > input.length) {
   const idx = val.length - 1;
   if (val[idx] !== codeSnippet[idx]) {
    setMistakes((prev) => prev + 1);
   }
  }

  if (val.length <= codeSnippet.length) {
   setInput(val);
  }

  if (val.length === codeSnippet.length) {
   loadNextSnippet();
  }
 };

 // =========================
 // Auto Scroll Caret
 // =========================
 useEffect(() => {
  const cursor = document.getElementById('caret');
  if (cursor && codeContainerRef.current) {
   const container = codeContainerRef.current;
   const cursorTop = cursor.offsetTop;
   const containerHeight = container.clientHeight;
   const scrollTop = container.scrollTop;

   if (cursorTop > scrollTop + containerHeight - 60) {
    container.scrollTo({
     top: cursorTop - containerHeight / 2,
     behavior: 'smooth',
    });
   }
  }
 }, [input]);

 const renderCode = () => {
  return codeSnippet.split('').map((char, index) => {
   let className =
    'font-mono text-xl opacity-50 text-slate-500';

   if (index < input.length) {
    if (input[index] === char) {
     className =
      'font-mono text-xl text-brand-500 font-bold';
    } else {
     className =
      'font-mono text-xl text-red-500 bg-red-900/20';
    }
   }

   if (char === '\n') {
    return (
     <span key={index} className="block h-6 w-full"></span>
    );
   }

   return (
    <span key={index} className={className}>
     {index === input.length && (
      <span
       id="caret"
       className="absolute inline-block w-0.5 h-6 bg-yellow-400 animate-cursor-blink"
      />
     )}
     {char}
    </span>
   );
  });
 };

 return (
  <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
   <div className="flex justify-between items-center bg-dark-surface p-4 rounded-xl border border-slate-700 shadow-sm">

    <div className="text-slate-400 font-medium">
     Time Left:{' '}
     <span className="font-mono text-2xl text-brand-500">
      {timeLeft}s
     </span>
    </div>

    <div className="flex gap-3">
     {/* 🔥 End Test Button */}
     <button
      onClick={handleEndTest}
      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
     >
      End Test
     </button>

     <button
      onClick={loadSnippet}
      className="p-2 rounded-full hover:bg-slate-700 text-slate-400"
     >
      <RefreshCw size={20} />
     </button>
    </div>
   </div>

   {/* Code Area */}
   <div
    className="relative min-h-[400px] bg-dark-bg rounded-xl p-8 border border-slate-700 shadow-inner cursor-text overflow-hidden"
   >
    {isLoading ? (
     <div className="absolute inset-0 flex items-center justify-center text-brand-500">
      <Loader2 className="animate-spin w-10 h-10" />
      <span className="ml-3 font-semibold">
       Loading {language} snippet...
      </span>
     </div>
    ) : (
     <div
      ref={codeContainerRef}
      className="h-[360px] overflow-y-auto whitespace-pre-wrap break-all leading-relaxed relative"
     >
      {renderCode()}
     </div>
    )}

    <input
     ref={inputRef}
     type="text"
     className="opacity-0 absolute"
     value={input}
     onChange={handleInputChange}
    />
   </div>
  </div>
 );
};

export default TypingArea;
