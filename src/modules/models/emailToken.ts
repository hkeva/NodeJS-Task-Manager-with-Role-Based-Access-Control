import mongoose from "mongoose";

const Schema = mongoose.Schema;

const emailTokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 1800 }, // 1800 seconds = 30 minutes
});

const EmailToken = mongoose.model("EmailToken", emailTokenSchema);

export default EmailToken;
