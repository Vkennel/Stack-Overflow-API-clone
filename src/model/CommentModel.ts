import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  question_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Questions",
  },
  comment: String,
  created_at: {
    type: Date,
    default: Date.now(),
  },
  user: Object,
});

export default mongoose.model("Comments", commentSchema);
