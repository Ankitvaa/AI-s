import React from "react";
import "./dashBoard.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "@clerk/clerk-react";  // Uncomment if you're using Clerk for authentication

const DashBoard = () => {
  // const { userId } = useAuth();  // Uncomment if using Clerk

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (text) => {
      const response = await fetch("http://localhost:5000/api/chats/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      }).then(res=>res.json());
// 
      if (!response.ok) {
        throw new Error("Failed to create a new chat");
      }

      const data = await response.json();
      return data; // Assuming your API returns an object with the chat ID
    },
    onSuccess: (data) => {
      // Assuming the returned data has an 'id' field
      if (data && data.id) {
        queryClient.invalidateQueries({ queryKey: ["userChats"] });
        navigate(`/dashboard/chats/${data.id}`);
      }
    },
    onError: (error) => {
      console.error("Error creating chat:", error);
      alert("Failed to create a new chat");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;

    mutation.mutate(text);
  };

  return (
    <div className="dashboardPage">
      <div className="texts">
        <div className="logo">
          <img src="/logo.png" alt="Logo" />
          <h1>Ankit AI</h1>
        </div>
        <div className="options">
          <div className="option">
            <img src="/chat.png" alt="Chat Icon" />
            <span>Create A New Chat</span>
          </div>
          <div className="option">
            <img src="/image.png" alt="Image Analysis" />
            <span>Analyze Image</span>
          </div>
          <div className="option">
            <img src="/code.png" alt="Code Help" />
            <span>Help me with my code</span>
          </div>
        </div>
      </div>

      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <input type="text" name="text" placeholder="Ask me anything..." />
          <button type="submit">
            <img src="/arrow.png" alt="Submit" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashBoard;
