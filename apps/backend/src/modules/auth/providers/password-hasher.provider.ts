import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

export interface IPasswordHasher {
  hash(plainText: string): Promise<string>;
  compare(plainText: string, hashed: string): Promise<boolean>;
}

const KEY_LENGTH = 64;

function deriveKey(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, KEY_LENGTH, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(derivedKey);
    });
  });
}

export class ScryptPasswordHasher implements IPasswordHasher {
  async hash(plainText: string): Promise<string> {
    const salt = randomBytes(16).toString("hex");
    const derivedKey = await deriveKey(plainText, salt);
    return `${salt}:${derivedKey.toString("hex")}`;
  }

  async compare(plainText: string, hashed: string): Promise<boolean> {
    const [salt, key] = hashed.split(":");
    if (!salt || !key) {
      return false;
    }
    const keyBuffer = Buffer.from(key, "hex");
    const derivedKey = await deriveKey(plainText, salt);
    return keyBuffer.length === derivedKey.length && timingSafeEqual(derivedKey, keyBuffer);
  }
}
