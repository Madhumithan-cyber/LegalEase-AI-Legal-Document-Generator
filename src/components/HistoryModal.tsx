import React from 'react';
import { X, History, Trash2, ArrowRight, Calendar, Users, FileText } from 'lucide-react';
import { GeneratedDocument } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: GeneratedDocument[];
  onSelectDocument: (doc: GeneratedDocument) => void;
  onDeleteHistoryItem: (id: string) => void;
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectDocument,
  onDeleteHistoryItem,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Document History</h2>
              <p className="text-xs text-slate-500">
                Previously drafted documents saved in your local workspace ({history.length} saved)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of documents */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <FileText className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-medium text-slate-600">No documents drafted yet</p>
              <p className="text-xs text-slate-400">
                Draft a new agreement to see it saved in your revision history.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20 transition-all flex items-center justify-between group"
              >
                <div className="space-y-1 pr-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {item.document_type}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(item.metadata.generated_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-slate-900 line-clamp-1">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-500 flex items-center">
                    <Users className="w-3 h-3 mr-1 text-slate-400" />
                    <span>Parties: {item.parties.map((p) => p.name).join(', ')}</span>
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => {
                      onSelectDocument(item);
                      onClose();
                    }}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
                  >
                    <span>Open</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => onDeleteHistoryItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                    title="Delete document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        {history.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear all document history?')) {
                  onClearHistory();
                }
              }}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium"
            >
              Clear All History
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
