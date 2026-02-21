import React, { useState } from 'react';
import { CodingLanguage, GameMode } from '../types';
import TypingArea from './TypingArea';
import Results from './Results';
import { Play, Clock, Code2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const [selectedLang, setSelectedLang] = useState<CodingLanguage>(CodingLanguage.JAVASCRIPT);
  const [selectedTime, setSelectedTime] = useState<GameMode>(GameMode.TIME_60);
  
  const [lastStats, setLastStats] = useState<any>(null);

  const startTest = () => {
    setIsPlaying(true);
    setShowResults(false);
  };

  const handleFinish = (stats: any) => {
    setLastStats(stats);
    setIsPlaying(false);
    setShowResults(true);
  };

  const handleRestart = () => {
    setShowResults(false);
    setIsPlaying(true);
  };

  if (showResults && lastStats) {
      return <Results stats={lastStats} onRestart={handleRestart} />;
  }

  if (isPlaying) {
      return <TypingArea language={selectedLang} duration={selectedTime} onFinish={handleFinish} />;
  }

  return (
    <div className="max-w-3xl mx-auto text-center py-12 animate-fade-in">
        <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                Master the Art of <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-500">Code Typing</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
                Improve your programming speed and accuracy with real code snippets.
            </p>
        </div>

        <div className="bg-dark-surface p-8 rounded-2xl border border-slate-700 shadow-xl">
            {/* Language Selector */}
            <div className="mb-8">
                <label className="flex items-center justify-center gap-2 text-slate-300 font-semibold mb-4">
                    <Code2 size={18} /> Select Language
                </label>
                <div className="flex flex-wrap justify-center gap-3">
                    {Object.values(CodingLanguage).map((lang) => (
                        <button
                            key={lang}
                            onClick={() => setSelectedLang(lang)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                                selectedLang === lang 
                                ? 'bg-brand-500/10 border-brand-500 text-brand-400 shadow-[0_0_15px_rgba(14,165,233,0.3)]' 
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750 hover:border-slate-600'
                            }`}
                        >
                            {lang}
                        </button>
                    ))}
                </div>
            </div>

            {/* Time Selector */}
            <div className="mb-8">
                 <label className="flex items-center justify-center gap-2 text-slate-300 font-semibold mb-4">
                    <Clock size={18} /> Duration
                </label>
                <div className="flex justify-center gap-3">
                    {[30, 60, 120].map((time) => (
                        <button
                            key={time}
                            onClick={() => setSelectedTime(time as GameMode)}
                             className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                                selectedTime === time 
                                ? 'bg-brand-500/10 border-brand-500 text-brand-400' 
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750 hover:border-slate-600'
                            }`}
                        >
                            {time}s
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={startTest}
                className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold rounded-xl shadow-lg transform transition hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 mx-auto"
            >
                <Play fill="currentColor" size={20} />
                Start Typing Test
            </button>
        </div>
    </div>
  );
};

export default Dashboard;