import React from 'react';
import { Scale, FileText, Bookmark, History, Sparkles, AlertCircle, CheckCircle2, Shield } from 'lucide-react';
import { HealthStatus } from '../types';

interface HeaderProps {
  health: HealthStatus | null;
  activeTab: 'draft' | 'preview' | 'templates' | 'history';
  setActiveTab: (tab: 'draft' | 'preview' | 'templates' | 'history') => void;
  hasDocument: boolean;
  onOpenTemplates: () => void;
  onOpenHistory: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  health,
  activeTab,
  setActiveTab,
  hasDocument,
  onOpenTemplates,
  onOpenHistory,
}) => {
  const isDemo = !health?.gemini_configured;

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('draft')}>
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif text-xl font-bold tracking-tight text-white">LegalEase</span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  AI Legal Tech
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">AI-Powered Legal Document Generator</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('draft')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                activeTab === 'draft'
                  ? 'bg-slate-800 text-amber-400 border border-slate-700'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Draft Studio</span>
            </button>

            {hasDocument && (
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                  activeTab === 'preview'
                    ? 'bg-slate-800 text-amber-400 border border-slate-700'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Document Preview</span>
              </button>
            )}

            <button
              onClick={onOpenTemplates}
              className="px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors flex items-center space-x-1.5"
            >
              <Bookmark className="w-4 h-4 text-cyan-400" />
              <span>Templates</span>
            </button>

            <button
              onClick={onOpenHistory}
              className="px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors flex items-center space-x-1.5"
            >
              <History className="w-4 h-4 text-indigo-400" />
              <span>History</span>
            </button>
          </nav>

          {/* Engine Status Badge */}
          <div className="flex items-center space-x-3">
            {isDemo ? (
              <div
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-950/60 border border-amber-600/40 text-amber-300 text-xs shadow-sm cursor-help"
                title="Demo Mode: Deterministic legal templates active. Ready for college demo presentation."
              >
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-medium hidden sm:inline">Demo Mode Active</span>
                <span className="font-medium sm:hidden">Demo</span>
              </div>
            ) : (
              <div
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs shadow-sm"
                title="Google Gemini AI is configured & ready."
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-medium hidden sm:inline">Gemini 3.8 Flash Online</span>
                <span className="font-medium sm:hidden">Gemini AI</span>
              </div>
            )}

            <div className="hidden lg:flex items-center text-xs text-slate-400 pl-2 border-l border-slate-700">
              <Shield className="w-3.5 h-3.5 mr-1 text-slate-400" />
              <span>FastAPI Architecture</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
