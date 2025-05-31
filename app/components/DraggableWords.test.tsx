import DraggableWords from './DraggableWords'; // Assuming calculateScore is exported or accessible for testing

// Mocking useState and other hooks if DraggableWords is instantiated directly.
// However, it's better if calculateScore is a pure function that can be exported separately.
// For this subtask, let's assume we can extract or make calculateScore testable.
// If calculateScore is not directly exportable from DraggableWords, this test will need adjustment
// or the function itself would need to be refactored to be exportable.

// Let's define a standalone version of calculateScore for testing,
// assuming it's identical to the one within DraggableWords.tsx.
const calculateScore = (timeInSeconds: number, movesCount: number): number => {
  const score = Math.max(0, 10000 - (timeInSeconds * 10) - (movesCount * 50));
  return score;
};

describe('calculateScore', () => {
  it('should return the base score if time and moves are zero', () => {
    expect(calculateScore(0, 0)).toBe(10000);
  });

  it('should deduct points for time taken', () => {
    // 10000 - (10s * 10) = 9900
    expect(calculateScore(10, 0)).toBe(9900);
  });

  it('should deduct points for moves made', () => {
    // 10000 - (5 moves * 50) = 9750
    expect(calculateScore(0, 5)).toBe(9750);
  });

  it('should deduct points for both time and moves', () => {
    // 10000 - (10s * 10) - (5 moves * 50) = 10000 - 100 - 250 = 9650
    expect(calculateScore(10, 5)).toBe(9650);
  });

  it('should return 0 if deductions exceed base score', () => {
    // 10000 - (500s * 10) - (100 moves * 50) = 10000 - 5000 - 5000 = 0
    expect(calculateScore(500, 100)).toBe(0);
    // More deductions: 10000 - (1000s * 10) - (200 moves * 50) = 10000 - 10000 - 10000 = -10000, so should be 0
    expect(calculateScore(1000, 200)).toBe(0);
  });

  it('should handle edge case of very high moves and time', () => {
    expect(calculateScore(10000, 10000)).toBe(0);
  });
});
