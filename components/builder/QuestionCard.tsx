"use client";

import { useState } from "react";

interface KickoffQuestion {
  field: string;
  question: string;
  options: string[];
  aiSuggestion?: string;
  required: boolean;
  answered: boolean;
  skipped: boolean;
  answer?: string;
}

interface QuestionCardProps {
  question: KickoffQuestion;
  questionIndex: number;
  totalQuestions: number;
  onAnswer: (field: string, value: string) => void;
  onSkip: (field: string) => void;
  onSkipAll: () => void;
  loading: boolean;
}

export default function QuestionCard({
  question,
  questionIndex,
  totalQuestions,
  onAnswer,
  onSkip,
  onSkipAll,
  loading,
}: QuestionCardProps) {
  const [customAnswer, setCustomAnswer] = useState("");

  const handleOptionClick = (option: string) => {
    if (loading) return;
    onAnswer(question.field, option);
  };

  const handleCustomSubmit = () => {
    if (loading || !customAnswer.trim()) return;
    onAnswer(question.field, customAnswer.trim());
    setCustomAnswer("");
  };

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-400">
          Question {questionIndex + 1} of {totalQuestions}
        </span>
        {totalQuestions - questionIndex > 1 && (
          <button
            onClick={onSkipAll}
            disabled={loading}
            className="text-xs text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            Skip all remaining
          </button>
        )}
      </div>

      <p className="mb-4 text-sm font-medium text-gray-900">
        {question.question}
      </p>

      <div className="mb-3 flex flex-wrap gap-2">
        {question.options.map((option) => (
          <button
            key={option}
            onClick={() => handleOptionClick(option)}
            disabled={loading}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors disabled:opacity-50 ${
              option === question.aiSuggestion
                ? "border-primary-300 bg-primary-50 text-primary-700 hover:bg-primary-100"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {option}
            {option === question.aiSuggestion && (
              <span className="ml-1 text-xs text-primary-500">suggested</span>
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={customAnswer}
          onChange={(e) => setCustomAnswer(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCustomSubmit()}
          placeholder="Or type your own answer..."
          disabled={loading}
          className="flex-1 rounded-lg border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:opacity-50"
        />
        {customAnswer.trim() && (
          <button
            onClick={handleCustomSubmit}
            disabled={loading}
            className="rounded-lg bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
          >
            Send
          </button>
        )}
      </div>

      <div className="mt-3 text-right">
        <button
          onClick={() => onSkip(question.field)}
          disabled={loading}
          className="text-sm text-gray-400 hover:text-gray-600 disabled:opacity-50"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
