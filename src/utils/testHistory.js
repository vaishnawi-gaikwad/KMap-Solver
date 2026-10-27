
const HISTORY_KEY = 'kmap_solver_test_history_v1';

export function getTestHistory() {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Could not load test history:', error);
    return [];
  }
}

export function saveTestAttempt(attempt) {
  try {
    const history = getTestHistory();

    const newAttempt = {
      ...attempt,
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      date: new Date().toISOString(),
    };

    history.unshift(newAttempt);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));

    return newAttempt;
  } catch (error) {
    console.error('Could not save test history:', error);
    return null;
  }
}
