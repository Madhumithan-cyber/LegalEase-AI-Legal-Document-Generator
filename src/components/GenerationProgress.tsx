import React, { useEffect, useState } from 'react';
import { Scale, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { DocumentType } from '../types';

interface GenerationProgressProps {
  documentType: DocumentType;
  isDemoMode: boolean;
}

const STEPS = [
  'Verifying contracting parties and legal status...',
  'Synthesizing operative clauses and covenants...',
  'Drafting statutory boilerplate, severability & governing law...',
  'Formatting execution blocks and validating structured schema...',
];

export const GenerationProgress: React.FC<GenerationProgressProps> = ({
  documentType,
  isDemoMode,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 700);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 text-center space-y-5">
        <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-amber-200 border-t-amber-600 animate-spin"></div>
          <Scale className="w-7 h-7 text-amber-600" />
        </div>

        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isDemoMode ? 'LegalEase Deterministic Engine' : 'Google Gemini 3.8 Flash AI'}
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Drafting {documentType}...
          </h3>
          <p className="text-xs text-slate-500">
            Building enforceable legal clauses based on your specifications
          </p>
        </div>

        <div className="space-y-2 text-left bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          {STEPS.map((step, idx) => {
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div
                key={idx}
                className={`flex items-center space-x-2 text-xs transition-opacity duration-300 ${
                  isDone
                    ? 'text-emerald-700 font-medium'
                    : isCurrent
                    ? 'text-amber-800 font-semibold'
                    : 'text-slate-400 opacity-60'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-amber-600 animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                )}
                <span>{step}</span>
              </div>
            );
          })}
        </div>

        <p className="text-[11px] text-slate-400 italic">
          Structured output formatted in compliance with contract drafting standards
        </p>
      </div>
    </div>
  );
};
