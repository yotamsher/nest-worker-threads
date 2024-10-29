import { Injectable } from '@nestjs/common';
import { FibonacciWorkerHost } from './fibonacci-worker.host';
import { Piscina } from 'piscina';
import { resolve } from 'path';

@Injectable()
export class FibonacciService {
    constructor(private readonly fibonacciWorkerHost: FibonacciWorkerHost) {}

    // Initializing Piscina with the path to the Piscina worker script
    fibonacciWorkerPiscina = new Piscina({
        filename: resolve(__dirname, 'fibonacci.worker.piscina.js'),
    });

    // Synchronous Fibonacci calculation
    calculateFibonacciSync(n: number): number {
        if (n <= 1) return n;
        return (
            this.calculateFibonacciSync(n - 1) + this.calculateFibonacciSync(n - 2)
        );
    }


    // Asynchronous Fibonacci calculation using worker threads
    calculateFibonacciWorker(n: number): Promise<number> {
        return this.fibonacciWorkerHost.run(n);
    }

    // Asynchronous Fibonacci calculation using Piscina
    calculateFibonacciPiscina(n: number): Promise<number> {
        return this.fibonacciWorkerPiscina.run(n); // Delegate the task to the Piscina worker pool
    }
}
