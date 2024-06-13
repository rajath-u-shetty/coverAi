"use client";
import { useState } from "react";

const StreamCoverLetter = () => {
  const [coverLetter, setCoverLetter] = useState("");

  const handleGenerate = async () => {
    const response = await fetch("/api/chatgpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Software Engineer",
        requirements: "Knowledge of React, Node.js, and Python",
        pdfContent: "Resume content here...",
      }),
    });

    const eventSource = new EventSource(response.url);

    eventSource.onmessage = (event) => {
      setCoverLetter((prev) => prev + event.data);
    };

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      eventSource.close();
    };
  };

  return (
    <div>
      <button onClick={handleGenerate}>Generate Cover Letter</button>
      <div>
        <h2>Generated Cover Letter</h2>
        <pre>{coverLetter}</pre>
      </div>
    </div>
  );
};

export default StreamCoverLetter;
