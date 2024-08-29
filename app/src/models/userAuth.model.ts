import mongoose, { Document, Schema } from 'mongoose';

export interface IUserAuth extends Document {
  user_id: string;
  auth_token: string;
  ref_token: string;

}

const UserAuthSchema: Schema = new Schema({
  user_id: { type: String, required: true, ref: "User" },
  auth_token: { type: String, required: true },
  ref_token: { type: String, required: true },
});

export default mongoose.model<IUserAuth>('user_auth', UserAuthSchema);
