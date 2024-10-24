import { IKImage } from "imagekitio-react";
import Upload from "../upload/Upload";
import "./newPrompt.scss";
import React, { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import model from "../../lib/gemini";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const NewPrompt = ({ data }) => {
  const urlEndpoint = "https://ik.imagekit.io/d1h8p1z8h";
  const endRef = useRef(null);
  const [img, setImg] = useState({
    isloading: "",
    error: "",
    dbData: {},
    aiData: {},
  });

const chat = model.startChat({
  history: data?.history.map(({ role, parts }) => ({
    role, // Make sure role is passed correctly
    parts: parts.map(({ text }) => ({ text })), // Ensure parts are mapped correctly
  })),
  generationConfig: {
    // maxOutputTokens: 100,
  },
});


  const [question, setQuestion] = useState("");
  const [ans, setAns] = useState("");
  const [completeAns, setCompleteAns] = useState(""); // New state to hold the complete answer

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [data, question, ans]);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      return await fetch(`http://localhost:5000/api/chats/${data._id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.length ? question : undefined,
          answer: completeAns.length ? completeAns : undefined, // Use completeAns instead of img.dbData.filePath
          img: img.dbData.filePath || undefined,
        }),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat", data._id] }).then(() => {
        setQuestion("");
        setAns("");
        setCompleteAns(""); // Reset completeAns after successful mutation
        setImg({
          isloading: "",
          error: "",
          dbData: {},
          aiData: {},
        });
      });
    },
    onError: (error) => {
      console.error("Error creating chat:", error);
      alert("Failed to create a new chat");
    },
  });

const add = async (text, isInitial = false) => {
  if (!isInitial) setQuestion(text); // Only set the question if not an initial call
  try {
    const result = await chat.sendMessageStream(
      Object.entries(img.aiData).length ? [img.aiData] : [text]
    );
    let accumulatetext = "";
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      accumulatetext += chunkText;
      setAns(accumulatetext);
      setCompleteAns(accumulatetext); // Set the complete answer in a separate state
    }
    mutation.mutate(); // Call the mutation after setting the complete answer
  } catch (error) {
    console.error("Error generating content:", error);
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const text = e.target.text.value;
  if (!text) return;
  await add(text, false); // This is a user-submitted question, not initial
  e.target.reset();
};

const hasRun = useRef(false); // Use boolean value to track if useEffect has run

useEffect(() => {
  if (!hasRun.current && data?.history?.length === 1) {
    const initialText = data.history[0].parts[0]?.text; // Safely access the text
    if (initialText) {
      add(initialText, true); // Pass the text of the initial message
    }
    hasRun.current = true; // Mark as executed to avoid rerunning
  }
}); // Add `data` as a dependency to ensure effect runs when data is loaded

  return (
    <>
      {img.dbData?.filePath && (
        <IKImage
          urlEndpoint={urlEndpoint}
          path={img.dbData.filePath}
          width="380px"
          transformation={[{ width: 380 }]}
        />
      )}
      {question && <div className="message user">{question}</div>}
      {completeAns && ( // Display the complete answer instead of ans
        <div className="message">
          <Markdown>{completeAns}</Markdown>
        </div>
      )}
      <div className="endChat" ref={endRef}></div>
      <form className="newForm" onSubmit={handleSubmit}>
        <Upload setImg={setImg} />
        <input id="file" type="file" multiple={false} hidden />
        <input type="text" name="text" placeholder="Ask anything...." />
        <button>
          <img src="/arrow.png" alt="" />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;