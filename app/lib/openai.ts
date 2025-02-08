import OpenAI from "openai";

// Initialize the OpenAI client to use DeepSeek’s API.
const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com', // as per DeepSeek API docs
  apiKey: process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY,
  dangerouslyAllowBrowser: true,
});

/**
 * Analyze an existing LaTeX resume against a job description.
 * @param latex - The current LaTeX resume content.
 * @param jobDescription - The job description to compare against.
 * @returns Suggestions and recommendations as a string.
 */
export async function analyzeResume(latex: string, jobDescription: string): Promise<string> {
  try {
    // Construct a conversation prompt tailored for resume analysis.
    const messages = [
      {
        role: "system",
        content: "You are an expert resume analyzer. Your task is to examine a LaTeX formatted resume and assess how well it matches a given job description. Provide detailed suggestions for improvement and any necessary adjustments."
      },
      {
        role: "user",
        content: `Here is the LaTeX resume:\n\n${latex}\n\nAnd here is the job description:\n\n${jobDescription}`
      }
    ];

    const response = await openai.chat.completions.create({
      model: "deepseek-chat",  // use the chat model as per DeepSeek API docs
      messages,
      stream: false,
    });

    // Return the assistant's reply.
    return response.choices[0].message.content || "No suggestions available";
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw new Error('Failed to analyze resume');
  }
}

/**
 * Generate or update a resume in LaTeX based on a job description.
 * @param jobDescription - The target job description.
 * @param existingLatex - (Optional) Existing LaTeX content to update.
 * @returns A complete, clean LaTeX resume.
 */
export async function generateLatex(jobDescription: string, existingLatex?: string): Promise<string> {
  try {
    // Create a user message that includes the job description and, if available, existing resume details.
    let userContent = `Job Description:\n${jobDescription}\n\n`;
    if (existingLatex) {
      userContent += `Existing LaTeX Resume:\n${existingLatex}\n\nPlease update the resume to better fit the job description.`;
    } else {
      userContent += `Please generate a complete and professional resume in pure LaTeX format tailored to the job description above.`;
    }

    const messages = [
      {
        role: "system",
        content: "You are a professional resume writer and LaTeX expert. Your output must be in pure LaTeX without any extra commentary. The response must include the complete LaTeX document, including '\\documentclass', '\\begin{document}', and '\\end{document}'."
      },
      {
        role: "user",
        content: userContent
      }
    ];

    const response = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages,
      stream: false,
    });

    // Retrieve and clean up the LaTeX output.
    let latex = response.choices[0].message.content || "";
    latex = latex.trim();
    latex = latex.replace(/```latex\n?/g, '').replace(/```\n?/g, '');

    // Validate that the generated code has the key LaTeX elements.
    if (!latex.includes('\\documentclass') || 
        !latex.includes('\\begin{document}') || 
        !latex.includes('\\end{document}')) {
      console.error('Invalid LaTeX generated:', latex);
      throw new Error('Generated LaTeX is missing required elements');
    }

    // Ensure the content is pure LaTeX (without any extra explanatory text).
    if (latex.includes('Here is') || latex.includes('I have') || latex.includes('This is')) {
      throw new Error('Generated content contains explanatory text');
    }

    return latex;
  } catch (error) {
    console.error('Error generating LaTeX:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate LaTeX resume: ${error.message}`);
    }
    throw new Error('Failed to generate LaTeX resume');
  }
}
