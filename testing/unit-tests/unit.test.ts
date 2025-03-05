import { sum } from "../end-to-end-tests/sum";

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(4);
});
