// src/fibonacci/fibonacci.worker.ts
import { parentPort } from 'worker_threads';

// Function to calculate Fibonacci number
function fib(n: number): number {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}

// Event listener for messages from the main thread
parentPort?.on('message', ({ n, id }) => {
  const result = fib(n);
  // Send the result back to the main thread
  parentPort.postMessage({ result, id });
});