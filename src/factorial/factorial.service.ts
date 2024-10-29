import { Injectable } from '@nestjs/common';

@Injectable()
export class FactorialService {
    calculateFactorialPiscina(n: number) {
        throw new Error('Method not implemented.');
    }
    calculateFactorialWorker(n: number) {
        throw new Error('Method not implemented.');
    }
    calculateFactorialSync(n: number): number {
        if (n <= 1) return n;
        return (
            n * this.calculateFactorialSync(n-1)
        );   
     }

    calculateFactorialaSync(n: number): number {
        if (n <= 1) return n;
        else {
            var i = 1;
            for (var i = 1; i < n; i += 5) 
                {
                }
                return i;
            }
    }

}
