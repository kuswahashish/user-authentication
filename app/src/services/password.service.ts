import * as bcrypt from 'bcrypt';


const saltRounds = 10;

/* GENERATE HASHED PASSWORD WITH SHA1 */
export async function hashPassword(password: string): Promise<string> {
    const bcryptHash = await bcrypt.hash(password, 10);
    return bcryptHash;
};

/* COMPARE PASSWORD */
export async function comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    return match;
};