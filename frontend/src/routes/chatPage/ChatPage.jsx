import "./chatPage.scss";
import NewPrompt from "../../components/newPrompt/NewPrompt";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import Markdown from "react-markdown";
import { IKImage } from "imagekitio-react";
import { useMemo } from "react";

const ChatPage = () => {
  const path = useLocation().pathname;

  // Memoize chatId so it's not recomputed on every render
  const chatId = useMemo(() => path.split("/").pop(), [path]);

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () =>
      fetch(`http://localhost:5000/api/chats/${chatId}`, {
        credentials: "include",
      }).then((res) => res.json()),
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div className="chatPage">
      <div className="wrapper">
        <div className="chat">
          {data?.history?.length > 0 ? (
            data.history.map((message, i) => (
              <div key={i}>
                {message.img && (
                  <IKImage
                    urlEndpoint="https://ik.imagekit.io/d1h8p1z8h"
                    path={message.img}
                    height="300"
                    width="400"
                    transformation={[{ height: 300, width: 400 }]}
                    loading="lazy"
                  />
                )}
                <div className={message.role === "user" ? "message user" : "message"}>
                  <Markdown>{message.parts[0].text}</Markdown>
                </div>
              </div>
            ))
          ) : (
            <p>No chat history available</p>
          )}
          {data && <NewPrompt data={data} />}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
