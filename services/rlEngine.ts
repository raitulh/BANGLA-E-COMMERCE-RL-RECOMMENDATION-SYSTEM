
import { AlgorithmType, ContextVector, Product } from '../types';

/**
 * Utility for matrix operations needed for LinUCB
 */
class MatrixMath {
  static identity(size: number): number[][] {
    return Array.from({ length: size }, (_, i) =>
      Array.from({ length: size }, (_, j) => (i === j ? 1 : 0))
    );
  }

  static add(A: number[][], B: number[][]): number[][] {
    return A.map((row, i) => row.map((val, j) => val + B[i][j]));
  }

  static outerProduct(v: number[]): number[][] {
    return v.map(x => v.map(y => x * y));
  }

  static dot(A: number[][], v: number[]): number[] {
    return A.map(row => row.reduce((sum, val, i) => sum + val * v[i], 0));
  }

  static scalarMultiply(A: number[][], s: number): number[][] {
    return A.map(row => row.map(val => val * s));
  }

  // Simplified matrix inversion (Gaussian elimination for small fixed dimension 11)
  static inverse(M: number[][]): number[][] {
    const n = M.length;
    let A = M.map(row => [...row]);
    let I = this.identity(n);

    for (let i = 0; i < n; i++) {
      let pivot = A[i][i];
      if (Math.abs(pivot) < 1e-10) {
        // Tweak for stability
        pivot = 1e-10;
      }
      for (let j = 0; j < n; j++) {
        A[i][j] /= pivot;
        I[i][j] /= pivot;
      }
      for (let k = 0; k < n; k++) {
        if (k !== i) {
          let factor = A[k][i];
          for (let j = 0; j < n; j++) {
            A[k][j] -= factor * A[i][j];
            I[k][j] -= factor * I[i][j];
          }
        }
      }
    }
    return I;
  }
}

export class RLEngine {
  // Common state
  private totalImpressions: number = 0;
  private pulls: Record<string, number> = {};
  private rewards: Record<string, number> = {};

  // Thompson Sampling state (Beta distributions: alpha=successes, beta=failures)
  private tsAlpha: Record<string, number> = {};
  private tsBeta: Record<string, number> = {};

  // LinUCB state (A matrix and b vector per product)
  private linA: Record<string, number[][]> = {};
  private linB: Record<string, number[]> = {};
  private readonly contextDim = 11;
  private readonly alpha_linucb = 1.5;

  constructor(products: Product[]) {
    products.forEach(p => {
      this.pulls[p.id] = 1; // Start with 1 to avoid div by zero
      this.rewards[p.id] = 0;
      this.tsAlpha[p.id] = 1;
      this.tsBeta[p.id] = 1;
      this.linA[p.id] = MatrixMath.identity(this.contextDim);
      this.linB[p.id] = Array(this.contextDim).fill(0);
    });
  }

  public recommend(
    algorithm: AlgorithmType,
    products: Product[],
    context: ContextVector,
    n: number = 5
  ): { product: Product; score: number }[] {
    let scored: { product: Product; score: number }[] = [];

    switch (algorithm) {
      case AlgorithmType.RANDOM:
        scored = products.map(p => ({ product: p, score: Math.random() }));
        break;

      case AlgorithmType.UCB:
        const logTotal = Math.log(Math.max(1, this.totalImpressions));
        scored = products.map(p => {
          const mean = this.rewards[p.id] / this.pulls[p.id];
          const ucb = mean + Math.sqrt((2 * logTotal) / this.pulls[p.id]);
          return { product: p, score: ucb };
        });
        break;

      case AlgorithmType.THOMPSON_SAMPLING:
        scored = products.map(p => {
          // Simple approximation of Beta sampling via Normal if needed, 
          // but let's use a basic random generator centered around the mean
          const a = this.tsAlpha[p.id];
          const b = this.tsBeta[p.id];
          const mean = a / (a + b);
          const variance = (a * b) / (Math.pow(a + b, 2) * (a + b + 1));
          const score = mean + (Math.random() - 0.5) * Math.sqrt(variance) * 4;
          return { product: p, score };
        });
        break;

      case AlgorithmType.LINUCB:
        scored = products.map(p => {
          const A_inv = MatrixMath.inverse(this.linA[p.id]);
          const theta = A_inv.map(row => 
            row.reduce((sum, val, i) => sum + val * this.linB[p.id][i], 0)
          );
          
          const p_t = theta.reduce((sum, val, i) => sum + val * context[i], 0);
          const var_t = context.reduce((sum, val, i) => {
            const inner = A_inv[i].reduce((s, a_val, j) => s + a_val * context[j], 0);
            return sum + val * inner;
          }, 0);
          
          const score = p_t + this.alpha_linucb * Math.sqrt(Math.max(0, var_t));
          return { product: p, score };
        });
        break;
    }

    return scored.sort((a, b) => b.score - a.score).slice(0, n);
  }

  public update(
    algorithm: AlgorithmType,
    productId: string,
    reward: number,
    context: ContextVector
  ) {
    this.totalImpressions++;
    this.pulls[productId]++;
    this.rewards[productId] += reward;

    if (algorithm === AlgorithmType.THOMPSON_SAMPLING) {
      if (reward > 0) this.tsAlpha[productId]++;
      else this.tsBeta[productId]++;
    }

    if (algorithm === AlgorithmType.LINUCB) {
      const outer = MatrixMath.outerProduct(context);
      this.linA[productId] = MatrixMath.add(this.linA[productId], outer);
      this.linB[productId] = this.linB[productId].map((val, i) => val + reward * context[i]);
    }
  }
}
