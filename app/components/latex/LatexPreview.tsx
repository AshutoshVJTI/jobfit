"use client";

import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { useEffect, useState } from 'react';

interface LatexPreviewProps {
  latex: string;
}

export function LatexPreview({ latex }: LatexPreviewProps) {
  const [mounted, setMounted] = useState(false);
  
  // Prevent hydration issues with LaTeX rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="p-4 border rounded-md bg-white dark:bg-gray-900">
      <div className="prose dark:prose-invert max-w-none">
        <Latex>{latex}</Latex>
      </div>
    </div>
  );
} 