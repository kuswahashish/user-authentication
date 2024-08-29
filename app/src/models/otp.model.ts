import mongoose, { Document, Schema } from 'mongoose';

export interface IOtp extends Document {
    user_id: string;
    user_email: string;
    otp: string;

}

const OtpSchema: Schema = new Schema({
    user_id: { type: String, required: true, ref: "User" },
    user_email: { type: String, required: true, ref: "User" },
    otp: { type: String, required: true },
});

export default mongoose.model<IOtp>('otp', OtpSchema);
