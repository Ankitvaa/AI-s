import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,  // Fixed the typo from 'require' to 'required'
        },
        history: [
            {
                role: {
                    type: String,
                    enum: [ "user", "model" ],  // Corrected enum type
                    required: true,  // Fixed the typo from 'require' to 'required'
                },
                parts: [
                    {
                        text: {
                            type: String,
                            required: true,  // Fixed the typo from 'require' to 'required'
                        },
                    },
                ],
                img: {
                    type: String,
                    required: false,  // 'required' is optional for this field
                },
            },
        ],
    },
    { timestamps: true }
);

// Export the model
export default mongoose.models.Chat || mongoose.model("Chat", chatSchema);
