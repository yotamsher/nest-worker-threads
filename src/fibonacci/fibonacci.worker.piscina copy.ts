// src/fibonacci/fibonacci.worker.piscina.ts
function fib2(n: number, ): number {
    if (n < 2) return n;
    return fib2(n - 1) + fib2(n - 2);
  }
  
  module.exports = (n: number) => {
    return fib2(n);
  };