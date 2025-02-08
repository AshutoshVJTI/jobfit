"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { LatexPreview } from "../latex/LatexPreview";
import { ResumePDF } from "../pdf/ResumePDF";
import { analyzeResume, generateLatex } from "@/app/lib/openai";
import { saveResume, getResume } from "@/app/lib/firestore";

export function ResumeEditor() {
  const { user } = useAuth();
  const [latex, setLatex] = useState("");
  const [generatedLatex, setGeneratedLatex] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Load saved resume when user logs in
  useEffect(() => {
    async function loadResume() {
      if (!user) return;
      
      try {
        const savedResume = await getResume(user.uid);
        if (savedResume) {
          setLatex(savedResume.latex);
        }
      } catch (err) {
        console.error('Error loading resume:', err);
        setError('Failed to load saved resume');
      }
    }

    loadResume();
  }, [user]);

  // Save resume when latex changes (with debounce)
  useEffect(() => {
    if (!user || !latex) return;

    const timeoutId = setTimeout(async () => {
      setSaving(true);
      try {
        await saveResume(user.uid, latex);
      } catch (err) {
        console.error('Error auto-saving resume:', err);
      } finally {
        setSaving(false);
      }
    }, 1000); // Save after 1 second of no changes

    return () => clearTimeout(timeoutId);
  }, [latex, user]);

  const handleLatexChange = (value: string) => {
    setLatex(value);
    setError(null);
  };

  const handleUseGenerated = () => {
    if (generatedLatex) {
      setLatex(generatedLatex);
      setGeneratedLatex(""); // Clear the generated field after using it
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("Please sign in to use this feature");
      return;
    }

    if (!latex.trim() || !jobDescription.trim()) {
      setError("Please enter both LaTeX content and job description");
      return;
    }

    setLoading(true);
    try {
      const result = await analyzeResume(latex, jobDescription);
      setSuggestions(result);
      setError(null);
    } catch (err) {
      setError("Failed to analyze the resume");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLatex = async () => {
    if (!user) {
      setError("Please sign in to use this feature");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please enter a job description");
      return;
    }

    setGenerating(true);
    setError(null);
    
    try {
      const generated = await generateLatex(
        jobDescription,
        latex.trim() || undefined
      );
      
      // Validate the generated LaTeX before setting it
      if (!generated.includes('\\documentclass') || !generated.includes('\\end{document}')) {
        throw new Error('Invalid LaTeX generated');
      }
      
      setGeneratedLatex(generated);
    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : "Failed to generate LaTeX resume");
      setGeneratedLatex(""); // Clear any partial results
    } finally {
      setGenerating(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-lg mb-4">Please sign in to use the Resume Optimizer</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="jobDescription" className="block text-sm font-medium">
            Job Description
          </label>
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full h-32 p-3 border rounded-md text-sm bg-background border-foreground/20"
            placeholder="Paste the job description here..."
          />
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleGenerateLatex}
            disabled={generating}
            className="px-4 py-2 bg-foreground text-background rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {generating ? "Generating..." : "Generate Resume"}
          </button>
        </div>

        {generatedLatex && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium">
                Generated LaTeX Resume
              </label>
              <button
                type="button"
                onClick={handleUseGenerated}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Use This Version
              </button>
            </div>
            <textarea
              value={generatedLatex}
              readOnly
              className="w-full h-64 p-3 border rounded-md font-mono text-sm bg-gray-50 border-foreground/20"
            />
          </div>
        )}

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="latex" className="block text-sm font-medium">
              Your LaTeX Resume
            </label>
            {saving && (
              <span className="text-sm text-foreground/60">Saving...</span>
            )}
          </div>
          <textarea
            id="latex"
            value={latex}
            onChange={(e) => handleLatexChange(e.target.value)}
            className="w-full h-64 p-3 border rounded-md font-mono text-sm bg-background border-foreground/20"
            placeholder="Edit your LaTeX code here..."
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            type="submit"
            disabled={loading || generating}
            className="px-4 py-2 bg-foreground text-background rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
          
          {latex && <ResumePDF latex={latex} />}
        </div>
      </form>

      <div className="space-y-6">
        {error && (
          <div className="p-4 border border-red-500 rounded-md bg-red-50 text-red-700">
            {error}
          </div>
        )}

        {suggestions && (
          <div className="p-4 border rounded-md bg-green-50">
            <h3 className="font-medium mb-2">Suggestions</h3>
            <p className="whitespace-pre-wrap">{suggestions}</p>
          </div>
        )}
      </div>
    </div>
  );
} 