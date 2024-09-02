import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  first_name: string,
  middle_name: string,
  last_name: string,
  profile_picture: string,
  email: string,
  address: string,
  phone_number: string,
  age: string,
  password: string
}

const UserSchema: Schema = new Schema({
  first_name: { type: String, required: true },
  middle_name: { type: String, },
  last_name: { type: String, required: true },
  profile_picture: { type: String },
  email: { type: String, required: true, unique: true },
  address: { type: String },
  phone_number: { type: String },
  age: { type: String, required: true },
  password: { type: String, required: true },
  is_2FA: { type: Boolean, default: false }
});

export default mongoose.model<IUser>('User', UserSchema);
