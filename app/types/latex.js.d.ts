declare module 'latex.js' {
  export class Generator {
    constructor();
    parse(latex: string): {
      toArray(): Promise<any[]>;
    };
    process(latex: string): Promise<{
      domFragment(): { textContent: string };
    }>;
  }
} 