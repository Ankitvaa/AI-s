import express from "express";
import ImageKit from "imagekit";
import cors from "cors";
import mongoose from "mongoose";
import bodyparser from "body-parser";
import UserChats from "./models/userChats.js";  // Fixed import with .js
import Chat from "./models/chats.js";  // Fixed import with .js
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import dotenv from "dotenv";
dotenv.config();

const port = process.env.port || 5000;
const app = express();

console.log("Clerk Publishable Key:", process.env.CLERK_PUBLISHABLE_KEY);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
  publicKey: process.env.IMAGE_KIT_PUBLICKEY,
  privateKey: process.env.IMAGE_KIT_PRIVATEKEY,
});
app.get("/api/upload", (req, res) => {
  var result = imagekit.getAuthenticationParameters();
  res.send(result);
});

app.get("/api/test/", ClerkExpressRequireAuth(), (req, res) => {
  const clerkUserId = req.auth.userId; // Clerk provided userId
  console.log(clerkUserId);
  console.log("success!");
  res.send("Success");
});

app.post("/api/chats/", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId; // Clerk provided userId
  const { text } = req.body;
  console.log(text);

  try {
    // Create new chat
    const newChat = new Chat({
      userId: userId,
      history: [ { role: "user", parts: [ { text } ] } ],
    });
    const savedChat = await newChat.save();

    // Check if user exists in UserChats
    const userChats = await UserChats.find({ userId: userId });

    if (userChats.length === 0) {
      const newUserChats = new UserChats({
        userId: userId,
        chats: [
          {
            _id: savedChat._id,
            title: text.substring(0, 40),
          },
        ],
      });
      await newUserChats.save();
    } else {
      await UserChats.updateOne(
        { userId: userId },
        {
          $push: {
            chats: {
              _id: savedChat._id,
              title: text.substring(0, 40),
            },
          },
        }
      );
    }

    res.status(200).send(savedChat._id);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error creating Chats!");
  }
});

app.get("/api/userchats", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  try {
    const userChats = await UserChats.find({ userId: userId });
    if (userChats.length > 0) {
      res.status(200).send(userChats[ 0 ].chats);
    } else {
      res.status(404).send("No chats found for this user.");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching userChats");
  }
});

app.get("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId });
    if (chat) {
      res.status(200).send(chat);
    } else {
      res.status(404).send("Chat not found or unauthorized.");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching Chat!");
  }
});

// MongoDB connection
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB Connection Error: ", error);
  }
};

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send('Unauthenticated!');
});

app.listen(port, () => {
  connect();
  console.log("server is running", port);
});
