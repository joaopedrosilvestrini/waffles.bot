import { Schema, model } from "mongoose";

const setup = new Schema({
    Guild: String,
    Channel: String,
    Message: String,
    voiceChannel: String
});

export default model("Setup", setup);