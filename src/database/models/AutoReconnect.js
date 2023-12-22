import { Schema, model } from "mongoose";

const autor = new Schema({
    Guild: {
        type: String,
        required: true
    },
    TextId: {
        type: String,
        required: true
    },
    VoiceId: {
        type: String,
        required: true
    },
});

export default model("AutoReconnect", autor);