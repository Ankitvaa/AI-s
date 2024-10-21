import { IKImage } from "imagekitio-react";
import Upload from "../upload/Upload";
import "./newPrompt.scss";
import React, { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import model from "../../lib/gemini";

const NewPrompt = () => {
  const urlEndpoint = "https://ik.imagekit.io/d1h8p1z8h";
  // const publicKey = "public_XBkh4xZ+M3eBCp3EqWB+NnJMNEA=";
  const endRef = useRef(null);
  const [img, setImg] = useState({
    isloading: "",
    error: "",
    dbData: {},
    aiData: {},
  });

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Hello" }],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ],
  });

  const [question, setQuestion] = useState();
  const [ans, setAns] = useState();

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [question, ans]);

  const add = async (text) => {
    setQuestion(text);
    try {
      const result = await chat.sendMessageStream(
        Object.entries(img.aiData).length ? [img.aiData] : [text]
      );
      let accumulatetext = "";
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        accumulatetext += chunkText;
        setAns(accumulatetext);
      }
      setImg({ isloading: false, error: "", dbData: {}, aiData: {} });
    } catch (error) {
      console.error("Error generating content:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;
    await add(text);
    e.target.reset();
  };

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
      {ans && (
        <div className="message">
          <Markdown>{ans}</Markdown>
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
