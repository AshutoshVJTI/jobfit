import { Generator } from 'latex.js';

export async function processLatex(latex: string): Promise<string[]> {
  try {
    const generator = new Generator();
    const doc = generator.parse(latex);
    const fragments = await doc.toArray();
    
    return fragments.map(fragment => fragment.toString()).filter(Boolean);
  } catch (error) {
    console.error('Error processing LaTeX:', error);
    throw new Error('Failed to process LaTeX document');
  }
} 