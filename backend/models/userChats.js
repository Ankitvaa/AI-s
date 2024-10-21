import mongoose from "mongoose";
const UserchatsSchema = new mongoose.Schema({
    userId: {
        type: String,
        require: true
    },
    chats: [
        {

            _id: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
            title: { type: String },

            createdAt: {
                type: Date,
                default: Date.now()
            },
        },
    ],
},
    { timestamps: true }
);

export default mongoose.model.userChats || mongoose.model("userchats", UserchatsSchema)