import React from "react";
import "./chatList.scss";
import { Link } from "react-router-dom";
import {
  useQuery,
} from '@tanstack/react-query'

const ChatList = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      fetch("http://localhost:5000/api/userchats",{
        credentials:"include"
      }).then((res) =>
        res.json(),
      ),
  })
  return (
    <div className="chatList">
      <span className="title">DashBoard</span>
      <Link to="/dashboard">Create a new Chat</Link>
      <Link to="">Explore Ankit AI</Link>
      <Link to="">Contact</Link>
      <hr />
      <span className="title">Recent Chats</span>
      <div className="list">
        {
          isPending? "loading...": error?"something went wrong":
          data.map((chat)=>(
            <Link to={`/dashboard/chats/${chat._id}`} key={chat._id}>{chat.title}</Link>
          ))
        }
        
      </div>
    </div>
  );
};

export default ChatList;
