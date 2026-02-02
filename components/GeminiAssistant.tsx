
import React, { useState } from 'react';
import { getCourseSuggestions } from '../services/geminiService';
import { Course } from '../types';
import { Icons } from '../constants';

interface GeminiAssistantProps {
  courses: Course[];
}

const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ courses }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    const suggestion = await getCourseSuggestions(query, courses);
    setResult(suggestion);
    setLoading(false);
  };

  return (
    <div className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ${isOpen ? 'w-full max-w-md' : 'w-14'}`}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center text-white"
        >
          <Icons.Sparkles className="w-7 h-7" />
        </button>
      ) : (
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[80vh]">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Icons.Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="font-bold">EduBridge AI Advisor</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded-lg p-1">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto custom-scrollbar min-h-[300px]">
            {result ? (
              <div className="prose prose-slate prose-sm prose-blue max-w-none">
                <div className="bg-blue-50 p-4 rounded-xl text-slate-700 leading-relaxed whitespace-pre-wrap mb-4">
                  {result}
                </div>
                <button 
                  onClick={() => setResult(null)}
                  className="text-blue-600 font-semibold flex items-center hover:underline"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  Ask another question
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icons.Academic className="w-8 h-8 text-slate-400" />
                </div>
                <h4 className="text-slate-800 font-bold mb-2">How can I help you today?</h4>
                <p className="text-sm text-slate-500 px-6">
                  Try asking: "Find me a Diploma in IT under RM 20,000" or "Which universities are in Kuala Lumpur?"
                </p>
              </div>
            )}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>

          {!result && !loading && (
            <form onSubmit={handleAsk} className="p-4 border-t border-slate-100 bg-slate-50">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ask the AI advisor..."
                  className="w-full pl-4 pr-12 py-3 bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default GeminiAssistant;
