import React from "react";
import "./dashBoard.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const DashBoard = () => {

   const navigate = useNavigate();
  const queryClient = useQueryClient();


const mutation = useMutation({
  mutationFn: async (text) => {
    const response = await fetch("http://localhost:5000/api/chats/", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const id = await response.json();
    if (!response.ok) {
      throw new Error("Failed to create chat");
    }
    return id;  // Return the data containing the new chat ID
  },
  onSuccess: (id) => {
    if (id) {
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      navigate(`/dashboard/chats/${id}`);
    }
  },
  onError: (error) => {
    console.error("Error creating chat:", error);
    // alert("Failed to create a new chat");
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
            <img src="/image.png" alt="Analysis" />
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
