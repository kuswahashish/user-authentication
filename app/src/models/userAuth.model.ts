import mongoose, { Document, Schema } from 'mongoose';

export interface IUserAuth extends Document {
  user_id: mongoose.Types.ObjectId;
  auth_token: string;
  ref_token: string;
  expire_at: Date
}

const UserAuthSchema: Schema = new Schema({
  user_id: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  auth_token: { type: String, required: true },
  ref_token: { type: String, required: true },
  expire_at: { type: Date, default: () => Date.now() + 2 * 60 * 60 * 1000, require: true }
});

export default mongoose.model<IUserAuth>('user_auth', UserAuthSchema);
