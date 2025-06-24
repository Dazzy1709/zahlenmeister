import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  username: { type: String, required: true },
  profilePicture: { type: String, default: 'https://zahlenmeisterr.s3.eu-central-1.amazonaws.com/default-profile.png' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Message', messageSchema);