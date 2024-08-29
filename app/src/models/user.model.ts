import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  age: number;
  passowrd : string
}

const UserSchema: Schema = new Schema({
  first_name: { type: String, required: true },
  middle_name: { type: String, },
  last_name: { type: String, required: true },
  profile_picture : { type: String },
  email: { type: String, required: true, unique: true },
  address : { type: String },
  phone_number : { type: String },
  age: { type: String, required: true },
  password : {type:String,required:true},
  is_2FA : {type:Boolean,default:false}
});

export default mongoose.model<IUser>('User', UserSchema);
