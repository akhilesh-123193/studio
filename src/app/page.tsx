"use client";

import { Upload } from "lucide-react";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { extractTextFromDocument } from "@/services/document-processing";

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    async (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      setIsLoading(true);

      const file = e.dataTransfer.files[0];
      if (file && file.type === "application/pdf") {
        // TODO:
        // 1. Generate a session ID (UUID).
        // 2. Store the document in Firebase storage, using the session ID as part of the path.
        // 3. Trigger a Cloud Function that:
        //    a. Extracts text from the PDF.
        //    b. Splits text into chunks.
        //    c. Generates embeddings for semantic search.
        //    d. Stores embeddings and metadata temporarily in Firestore with the session ID.
        // 4. Redirect to /chat?sessionId={sessionId}.

        // For now, just extract text locally.
        const text = await extractTextFromDocument(file);
        console.log("Extracted text:", text);

        // Redirect to chat page with session ID or some form of state.
        router.push("/chat");
      } else {
        alert("Please upload a PDF file.");
      }

      setIsLoading(false);
    },
    [router]
  );

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    const file = e.target.files?.[0];

    if (file && file.type === "application/pdf") {
      // TODO:
      // 1. Generate a session ID (UUID).
      // 2. Store the document in Firebase storage, using the session ID as part of the path.
      // 3. Trigger a Cloud Function that:
      //    a. Extracts text from the PDF.
      //    b. Splits text into chunks.
      //    c. Generates embeddings for semantic search.
      //    d. Stores embeddings and metadata temporarily in Firestore with the session ID.
      // 4. Redirect to /chat?sessionId={sessionId}.

      // For now, just extract text locally.
      const text = await extractTextFromDocument(file);
      console.log("Extracted text:", text);

      // Redirect to chat page with session ID or some form of state.
      router.push("/chat");
    } else {
      alert("Please upload a PDF file.");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <h1 className="text-2xl font-semibold mb-4">
        Upload your PDF document to start chatting with it.
      </h1>

      <div
        className={`border-2 border-dashed rounded-lg p-16 flex flex-col items-center justify-center transition-colors duration-300 ${
          isDragging
            ? "border-accent bg-accent/20"
            : "border-muted hover:border-accent"
        } ${isLoading ? "animate-pulse" : ""}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {isLoading ? (
          <p>Processing...</p>
        ) : (
          <>
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">
              Drag and drop a PDF here or click to select a file
            </p>
          </>
        )}
      </div>

      {!isLoading && (
        <>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".pdf"
            onChange={handleFileSelect}
          />
          <label htmlFor="file-upload" className="mt-4">
            <Button asChild variant="outline">
              <span className="mr-2">Select File</span>
            </Button>
          </label>
          <p className="mt-4 text-sm text-muted-foreground">PDF files only.</p>
        </>
      )}
    </div>
  );
}
