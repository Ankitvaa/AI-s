import "./chatPage.scss";
import NewPrompt from "../../components/newPrompt/NewPrompt";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import Markdown from "react-markdown";
import { IKImage } from "imagekitio-react";

const ChatPage = () => {
  const path = useLocation().pathname;
  const chatId = path.split("/").pop(); // Assuming chatId is the last part of the URL

  // Fetch chat data using the chatId
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ['chat', chatId],  // Correct query key
    queryFn: () =>
      fetch(`http://localhost:5000/api/chats/${chatId}`, {  // Correct API endpoint
        credentials: "include",
      }).then((res) => res.json()),
  });
  console.log(data)

  return (
    <div className="chatPage">
      <div className="wrapper">
        <div className="chat">
          {isLoading && <p>Loading...</p>}
          {isError && <p>Error: {error.message}</p>}
          {data?.history?.length > 0 ? (
            data.history.map((message, i) => (
              <>
              {
                message.img && (
                  <IKImage
                  urlEndpoint="https://ik.imagekit.io/d1h8p1z8h"
                  path={message.img}
                  height="300"
                  width="400"
                  transformation={[{height:300,width:400}]}
                  loading="lazy"
                  />
                )
              }
              <div className={message.role==="user"?"message user":"message"} key={i}>
                <Markdown>{message.parts[0].text}</Markdown>
              </div>
          </>
            ))
          ) : (
            <p>No chat history available</p>
          )}
          <NewPrompt />
        </div>
      </div>
      </div>
      );
    };

export default ChatPage;

