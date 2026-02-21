import React, { useEffect, useState } from 'react';
import { LeaderboardEntry } from '../types';
import api from '../services/api';
import { Loader2 } from 'lucide-react';

const Leaderboard: React.FC = () => {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await api.get('api/leaderboard');
                setEntries(res.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load leaderboard. Make sure backend is running.");
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-6">Global Leaderboard</h1>
            
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-brand-500 w-10 h-10" />
                </div>
            ) : error ? (
                 <div className="bg-red-500/10 text-red-500 p-4 rounded-lg border border-red-500/20 text-center">
                    {error}
                </div>
            ) : (
                <div className="bg-dark-surface rounded-xl border border-slate-700 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-800/50 text-slate-400 text-sm uppercase tracking-wider">
                                <th className="p-4 font-semibold">Rank</th>
                                <th className="p-4 font-semibold">User</th>
                                <th className="p-4 font-semibold">Language</th>
                                <th className="p-4 font-semibold">WPM</th>
                                <th className="p-4 font-semibold">Accuracy</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {entries.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">
                                        No scores yet. Be the first!
                                    </td>
                                </tr>
                            )}
                            {entries.map((entry, index) => (
                                <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="p-4">
                                        {index === 0 && <span className="text-yellow-400 font-bold">#1 👑</span>}
                                        {index === 1 && <span className="text-slate-300 font-bold">#2 🥈</span>}
                                        {index === 2 && <span className="text-amber-600 font-bold">#3 🥉</span>}
                                        {index > 2 && <span className="text-slate-500 font-mono">#{index + 1}</span>}
                                    </td>
                                    <td className="p-4 font-medium text-slate-200">{entry.name}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 rounded-md bg-slate-800 text-xs text-brand-400 border border-slate-600">
                                            {entry.language}
                                        </span>
                                    </td>
                                    <td className="p-4 font-bold text-brand-500">{entry.wpm}</td>
                                    <td className="p-4 text-emerald-500">{entry.accuracy}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div className="mt-4 text-center text-slate-500 text-sm">
                * Leaderboards are updated in real-time.
            </div>
        </div>
    );
};

export default Leaderboard;
