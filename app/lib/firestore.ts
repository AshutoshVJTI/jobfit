import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface ResumeData {
  latex: string;
  updatedAt: Date;
}

export async function saveResume(userId: string, latex: string): Promise<void> {
  try {
    const resumeRef = doc(db, 'resumes', userId);
    await setDoc(resumeRef, {
      latex,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error saving resume:', error);
    throw new Error('Failed to save resume');
  }
}

export async function getResume(userId: string): Promise<ResumeData | null> {
  try {
    const resumeRef = doc(db, 'resumes', userId);
    const resumeSnap = await getDoc(resumeRef);
    
    if (resumeSnap.exists()) {
      return resumeSnap.data() as ResumeData;
    }
    return null;
  } catch (error) {
    console.error('Error getting resume:', error);
    throw new Error('Failed to get resume');
  }
} 