// src/fibonacci/fibonacci-worker.host.ts
import {
    Injectable,
    OnApplicationBootstrap,
    OnApplicationShutdown,
  } from '@nestjs/common'; // Importing necessary decorators and interfaces from NestJS
  import { randomUUID } from 'crypto'; // Importing randomUUID function to generate unique IDs
  import { join } from 'path'; // Importing join function to create file paths
  import { filter, firstValueFrom, fromEvent, map, Observable } from 'rxjs'; // Importing RxJS operators and functions for reactive programming
  import { Worker } from 'worker_threads'; // Importing Worker class to create and manage worker threads
  
  @Injectable()
  export class FibonacciWorkerHost
    implements OnApplicationBootstrap, OnApplicationShutdown
  {
    private worker: Worker; // Worker instance for managing the worker thread
    private messages$: Observable<{ id: string; result: number }>; // Observable to handle messages from the worker thread
  
    // Lifecycle hook executed when the application starts
    onApplicationBootstrap() {
      // Initializing the worker thread with the specified script
      this.worker = new Worker(join(__dirname, 'fibonacci.worker.js'));
      // Creating an observable from the worker's message events
      this.messages$ = fromEvent(this.worker, 'message') as Observable<{
        id: string;
        result: number;
      }>;
    }
  
    // Lifecycle hook executed when the application shuts down
    async onApplicationShutdown() {
      // Terminating the worker thread
      this.worker.terminate();
    }
  
    // Method to send a task to the worker thread and get the result
    run(n: number) {
      const uniqueId = randomUUID(); // Generating a unique ID for the task
      // Sending a message to the worker thread with the input number and unique ID
      this.worker.postMessage({ n, id: uniqueId });
  
      // Returning a promise that resolves with the result of the Fibonacci calculation
      return firstValueFrom(
        // Convert the observable to a promise
        this.messages$.pipe(
          // Filter messages to only include those with the matching unique ID
          filter(({ id }) => id === uniqueId),
          // Extract the result from the message
          map(({ result }) => result),
        ),
      );
    }
  }