/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import {
  VideoContainer,
  VideoWrapper,
  Video,
  EndCallBtn,
  EndMockBtn,
  StatusTextContainer,
  StatusCall,
  Livetext,
  Subtitle,
} from "../styles";
import Agent from "/aiAgent.mp4";

interface CallScreenProps {
  handleEndCall: () => void;
  questions: string[];
}

interface ConversationEntry {
  question: string;
  answer: string;
}

const CallScreen: React.FC<CallScreenProps> = ({
  handleEndCall,
  questions,
}) => {
  // State management //
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isQuestionSpeaking, setIsQuestionSpeaking] = useState(false);
  const [conversation, setConversation] = useState<ConversationEntry[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Parse questions //
  const [actualQuestions, setActualQuestions] = useState<string[]>([]);
  useEffect(() => {
    if (questions.length > 0) {
      const rawInput = questions[0];
      const cleanInput = rawInput
        .replace(/^```\n?/, "")
        .replace(/```\n?$/, "")
        .replace(/^['"]/, "")
        .replace(/['"]$/, "")
        .replace(/^(\[)?\[/, "[")
        .replace(/\](\])?\s*$/, "]")
        .trim();
      try {
        const parsedQuestions = JSON.parse(cleanInput);
        if (
          Array.isArray(parsedQuestions) &&
          parsedQuestions.every((q) => typeof q === "string")
        ) {
          setActualQuestions(parsedQuestions);
        } else {
          throw new Error("Invalid questions format");
        }
      } catch (error) {
        console.error("Error parsing questions:", error);
        console.error("Raw input:", rawInput);
        console.error("Cleaned input:", cleanInput);
        setError("Could not parse interview questions.");
      }
    }
  }, [questions]);

  // Refs for speech and video //
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Speak current question //
  const speakQuestion = (question: string) => {
    if (synthesisRef.current) {
      try {
        setIsQuestionSpeaking(true);
        setCurrentTranscript("");
        controlVideoPlayback("question");
        const utterance = new SpeechSynthesisUtterance(question);
        utterance.rate = 0.9;
        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find(
          (voice) =>
            voice.name.includes("Female") ||
            voice.name.includes("Google UK English Female")
        );
        if (femaleVoice) {
          utterance.voice = femaleVoice;
        }
        utterance.onend = () => {
          setTimeout(() => {
            setIsQuestionSpeaking(false);
            startListening();
          }, 2000);
        };

        synthesisRef.current?.speak(utterance);
      } catch (err) {
        console.error("Speech synthesis error:", err);
        setError("Could not speak the question.");
        setIsQuestionSpeaking(false);
      }
    }
  };

  // Initialize speech recognition //
  useEffect(() => {
    if (
      !("SpeechRecognition" in window) &&
      !("webkitSpeechRecognition" in window)
    ) {
      setError(
        "Speech recognition is not supported in this browser. Please use Chrome or Edge."
      );
      return;
    }

    // Speech recognition //
    const SpeechRecognition = (window.SpeechRecognition ||
      window.webkitSpeechRecognition) as SpeechRecognitionConstructor;
    try {
      speechRecognitionRef.current = new SpeechRecognition();
      speechRecognitionRef.current.continuous = true;
      speechRecognitionRef.current.interimResults = true;
      speechRecognitionRef.current.lang = "en-US";
      speechRecognitionRef.current.onresult = (
        event: SpeechRecognitionEvent
      ) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join(" ");
        setCurrentTranscript(transcript);
        if (event.results[event.results.length - 1].isFinal) {
          const finalTranscript = transcript.trim();
          setConversation((prev) => {
            const updatedConversation = [...prev];
            updatedConversation.push({
              question: actualQuestions[currentQuestionIndex],
              answer: finalTranscript,
            });
            return updatedConversation;
          });
          setIsListening(false);
          setCurrentTranscript("");
          controlVideoPlayback("question");
          setTimeout(() => {
            if (currentQuestionIndex < actualQuestions.length - 1) {
              const nextIndex = currentQuestionIndex + 1;
              setCurrentQuestionIndex(nextIndex);
              speakQuestion(actualQuestions[nextIndex]);
            } else {
              endInterview();
            }
          }, 2000);
        }
      };

      // Handle recognition errors //
      speechRecognitionRef.current.onerror = (
        event: SpeechRecognitionErrorEvent
      ) => {
        console.error("Speech recognition error:", event.error);
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
        controlVideoPlayback("question");
      };
      synthesisRef.current = window.speechSynthesis;
      if (actualQuestions.length > 0) {
        speakQuestion(actualQuestions[0]);
      }
    } catch (err) {
      setError("Failed to initialize speech recognition.");
      console.error(err);
    }
    return () => {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
    };
  }, [actualQuestions]);

  // Start listening //
  const startListening = () => {
    if (speechRecognitionRef.current && !isQuestionSpeaking) {
      try {
        setIsListening(true);
        setCurrentTranscript("");
        controlVideoPlayback("listening");
        speechRecognitionRef.current.start();
      } catch (err) {
        console.error("Listening start error:", err);
        setError("Could not start listening.");
        setIsListening(false);
        controlVideoPlayback("question");
      }
    }
  };

  // Video playback control //
  const controlVideoPlayback = (state: "question" | "listening" | "end") => {
    if (!videoRef.current) return;

    try {
      switch (state) {
        case "question":
          videoRef.current.play();
          break;
        case "listening":
          videoRef.current.pause();
          break;
        case "end":
          videoRef.current.pause();
          break;
      }
    } catch (err) {
      console.error("Video playback error:", err);
    }
  };

  // End interview //
  const endInterview = () => {
    controlVideoPlayback("end");
    if (synthesisRef.current) {
      const utterance = new SpeechSynthesisUtterance(
        "Thank you for your time. The interview is now complete."
      );
      synthesisRef.current.speak(utterance);
    }
    handleEndCall();
  };

  return (
    <>
      <VideoContainer>
        <VideoWrapper>
          <Video
            ref={videoRef}
            controls={false}
            playsInline
            autoPlay
            muted
            loop
          >
            <source src={Agent} type="video/mp4" />
            Your browser does not support the video tag.
          </Video>
        </VideoWrapper>
      </VideoContainer>
      <StatusTextContainer>
        <StatusCall>
          {isQuestionSpeaking
            ? "Speaking..."
            : isListening
            ? "Listening..."
            : "Waiting for response"}
        </StatusCall>
        {/* Real-time transcript display */}
        {isListening && currentTranscript && (
          <Livetext>Transcript: {currentTranscript}</Livetext>
        )}
        {error && <Subtitle style={{ color: "fb4141" }}>{error}</Subtitle>}
      </StatusTextContainer>
      <EndCallBtn>
        <EndMockBtn onClick={handleEndCall}>End call</EndMockBtn>
      </EndCallBtn>
    </>
  );
};

export default CallScreen;
