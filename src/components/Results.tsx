import React, { useEffect, useState } from 'react';
import { calculateWPM, calculateAccuracy } from '../utils/gameUtils';
import { RefreshCw, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { fetchFeedback } from '../services/geminiService'; // Renamed to snippetService in idea, but keeping existing filename to avoid confusion
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ResultsProps {
    stats: {
        correctChars: number;
        mistakes: number;
        totalChars: number;
        timeElapsed: number;
        language: string;
    };
    onRestart: () => void;
}

const Results: React.FC<ResultsProps> = ({ stats, onRestart }) => {
    const { addXP, isAuthenticated } = useAuth();
    const [feedback, setFeedback] = useState("Analyzing performance...");
    const [saved, setSaved] = useState(false);
    
    const wpm = calculateWPM(stats.correctChars, stats.timeElapsed);
    const accuracy = calculateAccuracy(stats.correctChars, stats.totalChars);
    
    // Mock for chart until we fetch history
    const data = [
      { name: 'Current', wpm: wpm },
    ];

    useEffect(() => {
        const getAIResponse = async () => {
            const msg = await fetchFeedback(stats.mistakes, wpm, accuracy);
            setFeedback(msg);
        };
        getAIResponse();

        const saveResult = async () => {
            if (isAuthenticated && !saved) {
                try {
                    await api.post('api/results', {
                        wpm,
                        accuracy,
                        language: stats.language,
                        mistakes: stats.mistakes,
                        duration: stats.timeElapsed
                    });
                    
                    const xpEarned = Math.round(wpm * (accuracy / 100));
                    addXP(xpEarned);
                    setSaved(true);
                } catch (e) {
                    console.error("Failed to save result", e);
                }
            }
        };
        saveResult();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-3xl font-bold text-slate-100 mb-8 text-center">Test Complete</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-dark-surface p-6 rounded-xl border border-slate-700 text-center">
                    <p className="text-slate-400 text-sm uppercase tracking-wider font-semibold">WPM</p>
                    <p className="text-6xl font-bold text-brand-500 mt-2">{wpm}</p>
                </div>
                <div className="bg-dark-surface p-6 rounded-xl border border-slate-700 text-center">
                    <p className="text-slate-400 text-sm uppercase tracking-wider font-semibold">Accuracy</p>
                    <p className="text-6xl font-bold text-emerald-500 mt-2">{accuracy}%</p>
                </div>
                <div className="bg-dark-surface p-6 rounded-xl border border-slate-700 text-center">
                    <p className="text-slate-400 text-sm uppercase tracking-wider font-semibold">Mistakes</p>
                    <p className="text-6xl font-bold text-rose-500 mt-2">{stats.mistakes}</p>
                </div>
            </div>

            <div className="bg-dark-surface p-6 rounded-xl border border-slate-700 mb-8">
                 <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                    <span className="text-purple-400">✨</span> Performance Feedback
                 </h3>
                 <p className="text-slate-300 italic">"{feedback}"</p>
            </div>

            <div className="flex justify-center gap-4">
                <button 
                    onClick={onRestart}
                    className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
                >
                    <RefreshCw size={20} />
                    Try Again
                </button>
                 {!isAuthenticated && (
                     <button 
                        className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-semibold transition-colors"
                        onClick={() => alert("Please login to save results.")}
                    >
                        <Save size={20} />
                        Login to Save
                    </button>
                 )}
                 {isAuthenticated && saved && (
                     <div className="flex items-center gap-2 px-6 py-3 text-emerald-500 font-semibold">
                         Saved!
                     </div>
                 )}
            </div>
        </div>
    );
};

export default Results;
