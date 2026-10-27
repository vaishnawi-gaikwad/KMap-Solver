import React, { useState, useCallback } from 'react';
import {
  X, ChevronLeft, ChevronRight, CheckCircle2, XCircle,
  BookOpen, RotateCcw, Trophy, AlertTriangle, ExternalLink,
  ArrowLeft, Zap
} from 'lucide-react';
import { QUESTION_SETS } from '../data/practiceQuestions';

import TestHistory from './TestHistory';
import { saveTestAttempt } from '../utils/testHistory';


// ─── View Constants ────────────────────────────────────────────────────────────
const VIEW = { DIFFICULTY: 'difficulty', TEST: 'test', RESULT: 'result' };

const DIFFICULTY_META = {
  easy: {
    label: 'Easy',
    color: 'text-emerald-400',
    border: 'border-emerald-500/50',
    bg: 'bg-emerald-900/20',
    activeBg: 'bg-emerald-700/30',
    activeBorder: 'border-emerald-400',
    dot: 'bg-emerald-400',
desc: "Fundamentals, terminology, cell ordering, adjacency, basic grouping, and don't-care definitions.",
  },
  medium: {
    label: 'Medium',
    color: 'text-amber-400',
    border: 'border-amber-500/50',
    bg: 'bg-amber-900/20',
    activeBg: 'bg-amber-700/30',
    activeBorder: 'border-amber-400',
    dot: 'bg-amber-400',
    desc: "Wraparound adjacency, prime implicants, essential prime implicants, SOP/POS simplification, and don't-care applications.",
  },
  hard: {
    label: 'Hard',
    color: 'text-rose-400',
    border: 'border-rose-500/50',
    bg: 'bg-rose-900/20',
    activeBg: 'bg-rose-700/30',
        activeBorder: 'border-rose-400',
    dot: 'bg-rose-400',
    desc: "Challenging problems involving minimization, grouping decisions, Boolean expressions, and don't-care conditions.",
  },
};

// ─── Main PracticeMode component (rendered as overlay in App.jsx) ──────────────
export default function PracticeMode({ onClose }) {
  const [view, setView] = useState(VIEW.DIFFICULTY);
  const [difficulty, setDifficulty] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});         // { questionIndex: selectedOptionIndex }
  const [submitted, setSubmitted] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  
const [showHistory, setShowHistory] = useState(false);


  // ── Derived data ─────────────────────────────────────────────────────────────
  const questions = difficulty ? QUESTION_SETS[difficulty] : [];

  // ── Navigation helpers ────────────────────────────────────────────────────────
  const handleStartTest = useCallback(() => {
    setCurrentQ(0);
    setAnswers({});
    setSubmitted(false);
    setConfirmSubmit(false);
    setView(VIEW.TEST);
  }, []);

  const handleChooseDifficulty = useCallback(() => {
    setView(VIEW.DIFFICULTY);
    setDifficulty(null);
    setCurrentQ(0);
    setAnswers({});
    setSubmitted(false);
    setConfirmSubmit(false);
  }, []);

  const handleRetry = useCallback(() => {
    setCurrentQ(0);
    setAnswers({});
    setSubmitted(false);
    setConfirmSubmit(false);
    setView(VIEW.TEST);
  }, []);

  const handleSelectAnswer = (optionIdx) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [currentQ]: optionIdx }));
  };

  const handleSaveAndNext = () => {
    if (currentQ < questions.length - 1) setCurrentQ(q => q + 1);
  };

    
const handleSubmitConfirm = () => {
  saveTestAttempt({
    difficulty,
    score,
    pct,
    answers: Object.fromEntries(
      questions.map((q, idx) => [q.id, answers[idx] ?? null])
    ),
    questions: questions.map((q) => ({
      ...q,
      options: [...q.options],
    })),
  });

  setSubmitted(true);
  setConfirmSubmit(false);
  setView(VIEW.RESULT);
};


  // ── Score ─────────────────────────────────────────────────────────────────────
  const score = questions.reduce((acc, q, idx) => {
    return answers[idx] === q.correctIndex ? acc + 1 : acc;
  }, 0);
  const pct = Math.round((score / (questions.length || 1)) * 100);

  const unansweredCount = questions.length - Object.keys(answers).length;

  return (
    <div className="fixed inset-0 z-50 bg-[#07110F]/95 backdrop-blur-sm flex flex-col overflow-y-auto animate-in fade-in duration-200">

      {/* ── Top Bar ─────────────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 bg-[#0F2622]/95 border-b border-[#22423D] px-4 py-3 flex items-center justify-between backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#4FC3B8]/10 border border-[#4FC3B8]/30 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-[#4FC3B8]" />
          </div>
          <div>
            <span className="text-sm font-extrabold text-slate-100">K-Map Practice Test</span>
            {difficulty && view !== VIEW.DIFFICULTY && (
              <span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-full ${DIFFICULTY_META[difficulty].bg} ${DIFFICULTY_META[difficulty].color} border ${DIFFICULTY_META[difficulty].border}`}>
                {DIFFICULTY_META[difficulty].label}
              </span>
            )}
          </div>
        </div>

        {/* Progress indicator in test view */}
        {view === VIEW.TEST && (
          <span className="text-xs text-[#8BA8A3] font-mono hidden sm:block">
            Q {currentQ + 1} / {questions.length}
          </span>
        )}

        <button
          onClick={onClose}
          className="w-9 h-9 rounded-xl bg-[#172A27] hover:bg-[#22423D] text-slate-400 hover:text-rose-400 flex items-center justify-center transition-colors"
          title="Close practice mode"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* ── Views ───────────────────────────────────────────────────────────────── */}
      <div className="flex-1 w-full max-w-3xl mx-auto px-4 py-6">

        {/* ─ DIFFICULTY SELECTION ─────────────────────────────────────────────── */}
       
{view === VIEW.DIFFICULTY && (
  showHistory ? (
    <TestHistory onClose={() => setShowHistory(false)} />
  ) : (
    <DifficultyScreen
      difficulty={difficulty}
      setDifficulty={setDifficulty}
      onStart={handleStartTest}
      onOpenHistory={() => setShowHistory(true)}
    />
  )
)}


        {/* ─ TEST ─────────────────────────────────────────────────────────────── */}
        {view === VIEW.TEST && (
          <TestScreen
            questions={questions}
            currentQ={currentQ}
            setCurrentQ={setCurrentQ}
            answers={answers}
            onSelectAnswer={handleSelectAnswer}
            onSaveAndNext={handleSaveAndNext}
            unansweredCount={unansweredCount}
            confirmSubmit={confirmSubmit}
            setConfirmSubmit={setConfirmSubmit}
            onSubmitConfirm={handleSubmitConfirm}
            difficulty={difficulty}
          />
        )}

        {/* ─ RESULT ───────────────────────────────────────────────────────────── */}
        {view === VIEW.RESULT && (
          <ResultScreen
            questions={questions}
            answers={answers}
            score={score}
            pct={pct}
            difficulty={difficulty}
            onRetry={handleRetry}
            onChooseDifficulty={handleChooseDifficulty}
          />
        )}

      </div>

      {/* Confirm submit modal */}
      {confirmSubmit && (
        <ConfirmDialog
          unansweredCount={unansweredCount}
          onConfirm={handleSubmitConfirm}
          onCancel={() => setConfirmSubmit(false)}
        />
      )}

    </div>
  );
}

// ─── Difficulty Selection Screen ───────────────────────────────────────────────
function DifficultyScreen({
  difficulty,
  setDifficulty,
  onStart,
  onOpenHistory,
}) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-[#4FC3B8]/10 border border-[#4FC3B8]/30 flex items-center justify-center mx-auto mb-4">
          <Zap className="w-8 h-8 text-[#4FC3B8]" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-100">Choose Difficulty</h2>
        <p className="text-sm text-[#8BA8A3]">Select a difficulty level, then click <strong>Start Test</strong> to begin 20 questions.</p>
      </div>

      <div className="space-y-3">
        {['easy', 'medium', 'hard'].map(level => {
          const meta = DIFFICULTY_META[level];
          const isSelected = difficulty === level;
          return (
            <button
              key={level}
              onClick={() => setDifficulty(level)}
              className={`w-full p-4 rounded-2xl border-2 text-left transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#07110F] ${
                isSelected
                  ? `${meta.activeBg} ${meta.activeBorder} focus:ring-[#4FC3B8]`
                  : `${meta.bg} ${meta.border} hover:border-opacity-80 focus:ring-[#22423D]`
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${meta.dot} ${isSelected ? 'ring-2 ring-white/30 ring-offset-1 ring-offset-transparent' : ''}`} />
                <span className={`text-base font-extrabold ${meta.color}`}>{meta.label}</span>
                {isSelected && (
                  <span className="ml-auto text-xs font-bold text-white/60">Selected ✓</span>
                )}
              </div>
              <p className="mt-1.5 text-xs text-[#8BA8A3] ml-6">{meta.desc}</p>
              <p className="mt-1 text-[11px] text-[#4FC3B8]/70 ml-6 font-mono">20 Questions</p>
            </button>
          );
        })}
      </div>

      <button
        onClick={onStart}
        disabled={!difficulty}
        className="w-full py-4 rounded-full bg-[#4FC3B8] hover:bg-[#69E3D8] disabled:opacity-40 disabled:cursor-not-allowed text-[#07110F] font-extrabold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#4FC3B8]/20 transition-all active:scale-95"
      >
        <Zap className="w-5 h-5 fill-[#07110F]" />
        Start Test
      </button>
      
<button
  onClick={onOpenHistory}
  className="w-full py-3 rounded-full bg-[#172A27] hover:bg-[#22423D] border border-[#4FC3B8]/40 text-[#4FC3B8] font-bold text-sm transition-all"
>
  My Test History
</button>

    </div>
  );
}

// ─── Test Screen ───────────────────────────────────────────────────────────────
function TestScreen({
  questions, currentQ, setCurrentQ,
  answers, onSelectAnswer, onSaveAndNext,
  unansweredCount, confirmSubmit, setConfirmSubmit, onSubmitConfirm,
  difficulty
}) {
  const q = questions[currentQ];
  const selectedOption = answers[currentQ] ?? null;
  const meta = DIFFICULTY_META[difficulty];

  return (
    <div className="space-y-5 animate-in fade-in duration-150">

      {/* Progress Dots */}
      <div className="bg-[#172A27] border border-[#22423D] rounded-2xl p-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {questions.map((_, idx) => {
            const isAnswered = answers[idx] !== undefined;
            const isCurrent = idx === currentQ;
            return (
              <button
                key={idx}
                onClick={() => setCurrentQ(idx)}
                title={`Question ${idx + 1}${isAnswered ? ' (answered)' : ' (unanswered)'}`}
                className={`w-7 h-7 rounded-lg text-[10px] font-bold transition-all focus:outline-none focus:ring-1 focus:ring-[#4FC3B8] ${
                  isCurrent
                    ? `${meta.activeBg} ${meta.color} border-2 ${meta.activeBorder}`
                    : isAnswered
                    ? 'bg-[#4FC3B8]/25 text-[#4FC3B8] border border-[#4FC3B8]/40'
                    : 'bg-[#0F2622] text-slate-500 border border-[#22423D] hover:border-[#4FC3B8]/40'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[11px] text-[#8BA8A3]">
          Answered: <span className="text-[#4FC3B8] font-bold">{Object.keys(answers).length}</span> / {questions.length}
          {unansweredCount > 0 && <span className="text-amber-400"> · {unansweredCount} unanswered</span>}
        </p>
      </div>

      {/* Question Card */}
      <div className="bg-[#172A27] border border-[#22423D] rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
        {/* Question header */}
        <div className="flex items-start gap-3">
          <span className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-extrabold ${meta.activeBg} ${meta.color} border ${meta.activeBorder}`}>
            {currentQ + 1}
          </span>
          <div className="flex-1 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#8BA8A3]">
              {q.source}
            </p>
            <p className="text-sm sm:text-base font-semibold text-slate-100 leading-relaxed">
              {q.question}
            </p>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {q.options.map((opt, oIdx) => {
            const isSelected = selectedOption === oIdx;
            const optLabel = ['A', 'B', 'C', 'D'][oIdx];
            return (
              <button
                key={oIdx}
                onClick={() => onSelectAnswer(oIdx)}
                className={`w-full p-3.5 rounded-2xl border-2 text-left text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#172A27] focus:ring-[#4FC3B8] ${
                  isSelected
                    ? 'bg-[#4FC3B8]/20 border-[#4FC3B8] text-slate-100'
                    : 'bg-[#0F2622] border-[#244742] text-slate-300 hover:border-[#4FC3B8]/50 hover:text-slate-100'
                }`}
              >
                <span className={`font-extrabold font-mono mr-2 ${isSelected ? 'text-[#4FC3B8]' : 'text-[#8BA8A3]'}`}>
                  {optLabel}.
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#22423D]">
          <button
            onClick={() => setCurrentQ(q => Math.max(0, q - 1))}
            disabled={currentQ === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0F2622] hover:bg-[#22423D] border border-[#244742] text-slate-300 hover:text-white text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <button
            onClick={onSaveAndNext}
            disabled={selectedOption === null || currentQ === questions.length - 1}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#4FC3B8]/10 hover:bg-[#4FC3B8]/20 border border-[#4FC3B8]/40 hover:border-[#4FC3B8] text-[#4FC3B8] text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Save & Next
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentQ(q => Math.min(questions.length - 1, q + 1))}
            disabled={currentQ === questions.length - 1}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0F2622] hover:bg-[#22423D] border border-[#244742] text-slate-300 hover:text-white text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Submit button */}
      <button
        onClick={() => setConfirmSubmit(true)}
        className="w-full py-3.5 rounded-full bg-rose-700/30 hover:bg-rose-700/50 border-2 border-rose-600/50 hover:border-rose-500 text-rose-300 hover:text-rose-200 font-extrabold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
      >
        <CheckCircle2 className="w-5 h-5" />
        Submit Test
      </button>

    </div>
  );
}

// ─── Confirm Submit Dialog ─────────────────────────────────────────────────────
function ConfirmDialog({ unansweredCount, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#0F2622] border border-[#244742] rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-900/40 border border-amber-700/50 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <h3 className="text-base font-extrabold text-slate-100">Submit Test?</h3>
        </div>

        {unansweredCount > 0 ? (
          <p className="text-sm text-amber-200">
            You have <strong className="text-amber-400">{unansweredCount} unanswered question{unansweredCount > 1 ? 's' : ''}</strong>. Unanswered questions will be marked incorrect. Are you sure you want to submit?
          </p>
        ) : (
          <p className="text-sm text-slate-300">All questions answered. Submit the test now?</p>
        )}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-2xl bg-[#172A27] border border-[#22423D] text-slate-300 hover:text-white text-sm font-bold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl bg-rose-700 hover:bg-rose-600 text-white text-sm font-extrabold transition-colors"
          >
            Yes, Submit
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Result Screen ─────────────────────────────────────────────────────────────
function ResultScreen({ questions, answers, score, pct, difficulty, onRetry, onChooseDifficulty }) {
    const [reviewOpen, setReviewOpen] = useState(true);
  const meta = DIFFICULTY_META[difficulty];

  const scoreColor = pct >= 75 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-rose-400';
  const scoreBg = pct >= 75 ? 'bg-emerald-900/30 border-emerald-600/50' : pct >= 50 ? 'bg-amber-900/30 border-amber-600/50' : 'bg-rose-900/30 border-rose-600/50';

  return (
    <div className="space-y-5 animate-in fade-in duration-200">

      {/* Score Card */}
      <div className={`rounded-3xl border p-6 text-center space-y-3 ${scoreBg}`}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto bg-[#0F2622] border border-[#244742]">
          <Trophy className={`w-8 h-8 ${scoreColor}`} />
        </div>
        <div>
          <p className="text-[#8BA8A3] text-sm font-semibold">Your Score</p>
          <p className={`text-5xl font-extrabold ${scoreColor}`}>{score}<span className="text-2xl text-[#8BA8A3]">/{questions.length}</span></p>
          <p className={`text-xl font-bold mt-1 ${scoreColor}`}>{pct}%</p>
        </div>
        <p className="text-xs text-[#8BA8A3]">
          Difficulty: <span className={`font-bold ${meta.color}`}>{meta.label}</span>
        </p>
        {pct >= 75 ? (
          <p className="text-emerald-300 text-sm font-semibold">Excellent work! 🎉</p>
        ) : pct >= 50 ? (
          <p className="text-amber-300 text-sm font-semibold">Good effort — review the explanations below to improve.</p>
        ) : (
          <p className="text-rose-300 text-sm font-semibold">Keep practicing! Study the explanations carefully.</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => setReviewOpen(r => !r)}
          className="py-3 rounded-2xl bg-[#172A27] border border-[#22423D] hover:border-[#4FC3B8]/50 text-slate-200 hover:text-[#4FC3B8] text-sm font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          {reviewOpen ? 'Hide Review' : 'Review Answers'}
        </button>
        <button
          onClick={onRetry}
          className="py-3 rounded-2xl bg-[#4FC3B8]/10 border border-[#4FC3B8]/40 hover:border-[#4FC3B8] text-[#4FC3B8] text-sm font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Retry Test
        </button>
        <button
          onClick={onChooseDifficulty}
          className="py-3 rounded-2xl bg-[#172A27] border border-[#22423D] hover:border-[#8BA8A3] text-slate-300 hover:text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Choose Difficulty
        </button>
      </div>

      {/* Per-question Review */}
      {reviewOpen && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider">Detailed Review</h3>
          {questions.map((q, idx) => {
            const userAnswer = answers[idx];
            const isCorrect = userAnswer === q.correctIndex;
            const isUnanswered = userAnswer === undefined;

            return (
              <div
                key={q.id}
                className={`rounded-2xl border p-4 space-y-3 ${
                  isUnanswered
                    ? 'bg-[#172A27] border-[#22423D]'
                    : isCorrect
                    ? 'bg-emerald-900/15 border-emerald-700/40'
                    : 'bg-rose-900/15 border-rose-700/40'
                }`}
              >
                {/* Question header */}
                <div className="flex items-start gap-2">
                  <div className="shrink-0 mt-0.5">
                    {isUnanswered ? (
                      <div className="w-5 h-5 rounded-full bg-[#22423D] border border-[#8BA8A3]/40 flex items-center justify-center">
                        <span className="text-[9px] text-[#8BA8A3] font-bold">?</span>
                      </div>
                    ) : isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-[#8BA8A3] font-semibold mb-0.5">Q{idx + 1} · {q.source}</p>
                    <p className="text-sm font-semibold text-slate-100">{q.question}</p>
                  </div>
                </div>

                {/* Answer comparison */}
                <div className="space-y-1.5 text-xs font-mono">
                  {!isUnanswered && (
                    <div className={`flex items-center gap-2 ${isCorrect ? 'text-emerald-300' : 'text-rose-300'}`}>
                      <span className="font-bold">Your answer:</span>
                      <span>{['A', 'B', 'C', 'D'][userAnswer]}. {q.options[userAnswer]}</span>
                    </div>
                  )}
                  {isUnanswered && (
                    <div className="text-[#8BA8A3]">
                      <span className="font-bold">Your answer:</span> <span className="italic">Not answered</span>
                    </div>
                  )}
                  {!isCorrect && (
                    <div className="text-emerald-300">
                      <span className="font-bold">Correct answer:</span> {['A', 'B', 'C', 'D'][q.correctIndex]}. {q.options[q.correctIndex]}
                    </div>
                  )}
                </div>

                {/* Explanation */}
                <div className="bg-[#0F2622] rounded-xl p-3 space-y-2">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <span className="font-bold text-[#4FC3B8]">Explanation: </span>
                    {q.explanation}
                  </p>

                  {!isCorrect && (
                    <div className="pt-1 border-t border-[#22423D] space-y-1">
                      <p className="text-[11px] text-amber-300">
                        <span className="font-bold">Subtopic to revise:</span> {q.subtopic}
                      </p>
                      {q.studyLink && (
                        <a
                          href={q.studyLink}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center gap-1 text-[11px] text-[#4FC3B8] hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Study resource for this subtopic
                        </a>
                      )}
                    </div>
                  )}

                  {isCorrect && q.studyLink && (
                    <a
                      href={q.studyLink}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1 text-[11px] text-[#4FC3B8]/70 hover:text-[#4FC3B8] hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Learn more about {q.subtopic}
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
