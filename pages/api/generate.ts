import { GoogleGenerativeAI } from "@google/generative-ai";
import type { NextApiRequest, NextApiResponse } from "next";

const MODEL_NAME = "gemini-1.5-flash-latest";
const DEFAULT_TEMPERATURE = 0.7;
const DEFAULT_MAX_TOKENS = 1024;

interface GenerateRequest {
  profile: string;
  job: string;
  temperature?: number;
  maxTokens?: number;
}

interface GenerateResponse {
  text: string;
  provider: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GenerateResponse | ErrorResponse>
) {
  // Only allow POST requests
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    // Extract and validate request data
    const { profile, job, temperature, maxTokens }: GenerateRequest = req.body;

    if (!profile || !job) {
      return res.status(400).json({ 
        error: "Missing required fields",
        details: "Both 'profile' and 'job' fields are required" 
      });
    }

    if (profile.trim().length < 10) {
      return res.status(400).json({ 
        error: "Profile too short",
        details: "Profile must be at least 10 characters long" 
      });
    }

    if (job.trim().length < 20) {
      return res.status(400).json({ 
        error: "Job description too short",
        details: "Job description must be at least 20 characters long" 
      });
    }

    // Get API key from environment
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not configured");
      return res.status(500).json({ 
        error: "Server configuration error",
        details: "API key is not configured" 
      });
    }

    // Create optimized prompt
    const prompt = `You are an expert resume writer and career coach. Generate a professional resume snippet based on the following information.

USER PROFILE:
${profile.trim()}

JOB DESCRIPTION:
${job.trim()}

Please provide a well-structured resume snippet with:

1. PROFESSIONAL SUMMARY (2-3 sentences that highlight key strengths and align with the job)
2. KEY ACHIEVEMENTS (3-4 bullet points with quantifiable results when possible)
3. RELEVANT SKILLS (extracted from both profile and job requirements)
4. ATS OPTIMIZATION NOTES (brief suggestions for keyword alignment)

Format your response in clear sections. Focus on:
- Quantifiable achievements and impact
- Keywords that match the job description
- Professional tone and compelling narrative
- ATS-friendly formatting suggestions

Make it specific, impactful, and tailored to this exact role.`;

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // Configure generation parameters
    const generationConfig = {
      temperature: temperature || DEFAULT_TEMPERATURE,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: maxTokens || DEFAULT_MAX_TOKENS,
    };

    // Generate content
    console.log("Calling Gemini API...");
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });

    const response = result.response;
    const text = response.text();

    if (!text || text.trim().length === 0) {
      return res.status(500).json({ 
        error: "Empty response from AI",
        details: "The AI service returned an empty response" 
      });
    }

    console.log("Successfully generated resume content");
    
    // Return successful response
    return res.status(200).json({ 
      text: text.trim(), 
      provider: "gemini" 
    });

  } catch (error: any) {
    console.error("Error in generate API:", error);
    
    // Handle specific error types
    if (error.message?.includes('API key')) {
      return res.status(401).json({ 
        error: "Authentication failed",
        details: "Invalid or expired API key" 
      });
    }
    
    if (error.message?.includes('quota') || error.message?.includes('limit')) {
      return res.status(429).json({ 
        error: "Rate limit exceeded",
        details: "API quota limit reached. Please try again later." 
      });
    }

    if (error.message?.includes('blocked') || error.message?.includes('safety')) {
      return res.status(400).json({ 
        error: "Content filtered",
        details: "Content was filtered by safety systems. Please try different input." 
      });
    }

    // Generic server error
    return res.status(500).json({ 
      error: "Internal server error"
    });
  }
}