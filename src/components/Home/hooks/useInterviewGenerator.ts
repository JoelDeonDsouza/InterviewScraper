/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist";
import Tesseract from "tesseract.js";
import { load } from "cheerio";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "pdfjs-dist/build/pdf.worker.entry";

// Types //
interface UseInterviewGeneratorReturn {
  url: string;
  setUrl: (url: string) => void;
  file: File | null;
  setFile: (file: File | null) => void;
  extractedText: string;
  loading: boolean;
  error: string;
  userInput: string;
  setUserInput: (input: string) => void;
  handleUrlSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  handleFileUpload: () => Promise<void>;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handleCancel: () => void;
  handleCalling: () => void;
  handleEndCall: () => void;
  isCalling: boolean;
  generateQuestions: () => Promise<void>;
  isGeneratingQuestions: boolean;
  questionsGenerated: boolean;
  questions: string;
}

// Custom error type //
interface ErrorWithMessage {
  message?: string;
}

export const useInterviewGenerator = (
  corsProxy: string
): UseInterviewGeneratorReturn => {
  // State //
  const [url, setUrl] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [userInput, setUserInput] = useState<string>("");
  const [isCalling, setIsCalling] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [questionsGenerated, setQuestionsGenerated] = useState(false);
  const [questions, setQuestions] = useState<string>("");

  // Process PDF file //
  const processPdf = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item) => ("str" in item ? item.str : ""))
          .join(" ");
        fullText += pageText + "\n";
      }
      return fullText;
    } catch (err) {
      console.error("PDF processing error:", err);
      throw new Error("Failed to process PDF");
    }
  };

  // Process image file //
  const processImage = async (file: File): Promise<string> => {
    try {
      const { data } = await Tesseract.recognize(file, "eng");
      return data.text;
    } catch (err) {
      console.error("Image processing error:", err);
      throw new Error("Failed to process image");
    }
  };

  // Handle URL submission //
  const handleUrlSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(corsProxy + url);
      const $ = load(response.data);
      $("script, style").remove();
      const bodyText = $("body").text().replace(/\s+/g, " ").trim();
      setExtractedText(bodyText);
    } catch (err) {
      setError(
        "Failed to fetch URL. You may need a CORS proxy for this operation."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload //
  const handleFileUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      if (fileExtension === "pdf") {
        const text = await processPdf(file);
        setExtractedText(text);
      } else if (["jpg", "jpeg", "png"].includes(fileExtension || "")) {
        const text = await processImage(file);
        setExtractedText(text);
      } else {
        setError("Unsupported file format. Please upload a PDF or image file.");
      }
    } catch (err) {
      setError("Failed to process file. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle file input change //
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
      setUrl("");
    }
  };

  // Handle form submission //
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (url) {
      handleUrlSubmit(e);
    } else if (file) {
      handleFileUpload();
    }
  };

  // Generate interview questions based on job description //
  const generateQuestions = async () => {
    setLoading(true);
    if (!extractedText && !userInput) {
      setError("No job description available to generate questions.");
      return;
    }
    setIsGeneratingQuestions(true);
    setError("");
    setQuestionsGenerated(false);
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY as string;
      if (!apiKey) {
        throw new Error(
          "API key is missing. Please check your environment variables."
        );
      }
      const jobDescription = userInput || extractedText;
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
      const prompt = `Analyze the job description provided below and create interview questions that directly relate to the role's key responsibilities, required skills, and qualifications:
       ${jobDescription}
       Generate 5-7 thoughtful interview questions that:
       - Assess candidate qualifications
       - Explore relevant experience
       - Evaluate technical skills
       - Probe cultural fit
       - Test problem-solving abilities
       Format the questions like this:
       ['["Question 1 text", "Question 2 text", "Question 3 text"]\n']
       Keep all text voice-assistant friendly with no special characters or formatting symbols and output should be only questions inside an array.`;
      // AI to generate interview questions //
      const result = await model.generateContent(prompt);
      const questions = result.response.text();
      // Set interview questions //
      const interviewQuestions = { questions };
      setQuestions(interviewQuestions.questions);
      setQuestionsGenerated(true);
    } catch (err: ErrorWithMessage | unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : (err as ErrorWithMessage)?.message ||
            "An error occurred while generating questions";
      setError(`Error: ${errorMessage}`);
      console.error("Error generating interview questions:", err);
    } finally {
      setLoading(false);
      setIsGeneratingQuestions(false);
    }
  };

  // Auto-generate questions when starting call //
  useEffect(() => {
    if (isCalling && !questionsGenerated && !isGeneratingQuestions) {
      generateQuestions();
    }
  }, [isCalling]);

  // Handle cancel interview //
  const handleCancel = () => {
    setExtractedText("");
    setFile(null);
    setUserInput("");
    setUrl("");
    setQuestionsGenerated(false);
    setQuestions("");
  };

  // Handle calling //
  const handleCalling = () => {
    setIsCalling(true);
  };

  // Handle End call //
  const handleEndCall = () => {
    setIsCalling(false);
  };

  return {
    url,
    setUrl,
    file,
    setFile,
    extractedText,
    loading,
    error,
    userInput,
    setUserInput,
    handleUrlSubmit,
    handleFileUpload,
    handleFileChange,
    handleSubmit,
    handleCancel,
    isCalling,
    handleCalling,
    handleEndCall,
    generateQuestions,
    isGeneratingQuestions,
    questionsGenerated,
    questions,
  };
};
