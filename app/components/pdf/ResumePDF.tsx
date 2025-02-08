"use client";

import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';
import { processLatex } from '@/app/lib/latex';
import { pdf } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  section: {
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
  },
  paragraph: {
    marginBottom: 8,
  }
});

interface ResumePDFProps {
  latex: string;
  onDownload?: () => void;
}

export function ResumePDF({ latex, onDownload }: ResumePDFProps) {
  const [processedContent, setProcessedContent] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function process() {
      try {
        const content = await processLatex(latex);
        setProcessedContent(content);
        setError(null);
      } catch (err) {
        setError('Failed to process LaTeX document');
        console.error(err);
      }
    }

    if (latex) {
      process();
    }
  }, [latex]);

  const handleDownload = async () => {
    try {
      const blob = await pdf(
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.section}>
              {processedContent.map((text, index) => (
                <View key={index} style={styles.paragraph}>
                  <Text style={styles.text}>{text}</Text>
                </View>
              ))}
            </View>
          </Page>
        </Document>
      ).toBlob();
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      if (onDownload) {
        onDownload();
      }
    } catch (err) {
      console.error('Failed to download PDF:', err);
      setError('Failed to download PDF');
    }
  };

  if (error) {
    return (
      <div className="p-4 border border-red-500 rounded-md bg-red-50 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div>
      {error ? (
        <div className="p-4 border border-red-500 rounded-md bg-red-50 text-red-700">
          {error}
        </div>
      ) : (
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-foreground text-background rounded-md hover:opacity-90 transition-opacity"
        >
          Download PDF
        </button>
      )}
    </div>
  );
} 