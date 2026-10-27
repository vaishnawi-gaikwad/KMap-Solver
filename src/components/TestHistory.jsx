
import React, { useEffect, useState } from 'react';
import { getTestHistory } from '../utils/testHistory';

export default function TestHistory({ onClose }) {
  const [attempts, setAttempts] = useState([]);
  const [selectedAttempt, setSelectedAttempt] = useState(null);

  useEffect(() => {
    setAttempts(getTestHistory());
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 p-4">
      <div className="mx-auto my-8 max-w-4xl rounded-2xl border border-[#4FC3B8]/30 bg-[#0B1715] p-5 text-white sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-[#4FC3B8]">
            Test History
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg border border-white/20 px-4 py-2 hover:bg-white/10"
          >
            Close
          </button>
        </div>

        {selectedAttempt ? (
          <div>
            <button
              onClick={() => setSelectedAttempt(null)}
              className="mb-5 rounded-lg border border-[#4FC3B8]/40 px-4 py-2 text-[#4FC3B8]"
            >
              ← Back to History
            </button>

            <h3 className="mb-2 text-xl font-bold">
              {selectedAttempt.difficulty} Test Review
            </h3>
            <p className="mb-6 text-white/60">
              Score: {selectedAttempt.score} | {selectedAttempt.pct}%
            </p>

            <div className="space-y-5">
              {(selectedAttempt.questions || []).map((q, index) => {
                const chosen = selectedAttempt.answers?.[q.id];
const correctIndex = q.correctIndex;
                const correct = q.correctAnswer ?? q.answer;

                return (
                  <div
                    key={q.id ?? index}
                    className="rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <h4 className="mb-3 font-semibold">
                      Q{index + 1}. {q.question || q.text}
                    </h4>

                    {q.options?.map((option, optionIndex) => {
                      const optionText =
                        typeof option === 'object'
                          ? option.text ?? option.label ?? JSON.stringify(option)
                          : option;

                      return (
                        <p key={optionIndex} className="mb-2 text-sm">
                          {String.fromCharCode(65 + optionIndex)}. {optionText}
                        </p>
                      );
                    })}

                  
<p className="mt-3 text-sm text-[#4FC3B8]">
  Your answer:{' '}
  {chosen == null
    ? 'Not answered'
    : `${['A', 'B', 'C', 'D'][chosen]}. ${q.options[chosen]}`}
</p>
<p className="mt-1 text-sm text-green-400">
  Correct answer:{' '}
  {correctIndex == null
    ? 'Not available'
    : `${['A', 'B', 'C', 'D'][correctIndex]}. ${q.options[correctIndex]}`}
</p>


                    {q.explanation && (
                      <p className="mt-3 text-sm text-white/70">
                        Explanation: {q.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : attempts.length === 0 ? (
          <p className="py-10 text-center text-white/60">
            No test attempts saved yet. Complete a practice test to see your history here.
          </p>
        ) : (
          <div className="space-y-4">
            {attempts.map((attempt) => (
              <div
                key={attempt.id}
                className="flex flex-col justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center"
              >
                <div>
                  <h3 className="font-bold">
                    {attempt.difficulty} Test
                  </h3>
                  <p className="mt-1 text-sm text-white/60">
                    {formatDate(attempt.date)}
                  </p>
                  <p className="mt-1 text-sm">
                    Score: {attempt.score} | {attempt.pct}%
                  </p>
                </div>

                <button
                  onClick={() => setSelectedAttempt(attempt)}
                  className="rounded-lg bg-[#4FC3B8] px-5 py-2 font-bold text-[#07110F] hover:bg-[#69E3D8]"
                >
                  Review Test
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
