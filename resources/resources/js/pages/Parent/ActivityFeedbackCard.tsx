import React, { useState } from 'react';

interface ActivityFeedbackProps {
    activityTitle?: string;
    onSubmitted?: (feedback: { rating: string; comment: string }) => void;
}

export default function ActivityFeedbackCard({ 
    activityTitle = "Phonics & Sound Match (Home Reinforcement)",
    onSubmitted 
}: ActivityFeedbackProps) {
    const [selectedRating, setSelectedRating] = useState<string>('Great Engagement');
    const [comment, setComment] = useState<string>('');
    const [submitted, setSubmitted] = useState<boolean>(false);

    const ratings = [
        { label: 'Great Engagement', emoji: '🌟', color: 'bg-emerald-50 text-emerald-800 border-slate-200' },
        { label: 'Needed Help', emoji: '💡', color: 'bg-amber-50 text-amber-800 border-slate-200' },
        { label: 'A Bit Challenging', emoji: '🧩', color: 'bg-rose-50 text-rose-800 border-slate-200' }
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        if (onSubmitted) {
            onSubmitted({ rating: selectedRating, comment });
        }
        setTimeout(() => setSubmitted(false), 4000);
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200/70 p-6 sm:p-8 space-y-5 shadow-sm w-full">
            <div className="space-y-1">
                <h2 className="text-sm font-bold text-slate-900">Quick Activity Feedback</h2>
                <p className="text-[11px] text-slate-500">How did Alex respond to: <span className="font-semibold text-slate-700">{activityTitle}</span>?</p>
            </div>

            <hr className="border-slate-100 my-2" />

            {submitted ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
                    <span>✓</span> Thank you! Your feedback has been shared with Teacher Mara or progress tracking.
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    {/* Rating Emojis / Pills */}
                    <div className="space-y-1.5">
                        <label className="font-bold text-slate-700 block">Response Level</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            {ratings.map(r => (
                                <button
                                    key={r.label}
                                    type="button"
                                    onClick={() => setSelectedRating(r.label)}
                                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                                        selectedRating === r.label 
                                            ? `${r.color} ring-2 ring-emerald-400 shadow-2xs` 
                                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                    }`}
                                >
                                    <span>{r.emoji}</span>
                                    <span>{r.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Short Comment Input */}
                    <div className="space-y-1.5">
                        <label className="font-bold text-slate-700 block">Short Note for Teacher (Optional)</label>
                        <textarea 
                            rows={2}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="e.g., Completed easily after lunch, enjoyed the sound animations..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-medium resize-none"
                        />
                    </div>

                    <div className="flex items-center justify-end pt-1">
                        <button 
                            type="submit"
                            className="px-5 py-2.5 rounded-xl bg-[#4B8B6B] hover:bg-[#3d7255] text-white text-xs font-bold cursor-pointer transition-all shadow-xs"
                        >
                            Send Activity Feedback
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}