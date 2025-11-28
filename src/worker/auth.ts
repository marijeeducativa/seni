import { pbkdf2 } from '@noble/hashes/pbkdf2.js';
import { sha256 } from '@noble/hashes/sha2.js';

const ITERATIONS = 100000;
const KEY_LENGTH = 32;

/**
 * Hash a password using PBKDF2
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = Array.from(salt)
    .map((b: number) => b.toString(16).padStart(2, '0'))
    .join('');
  
  const hash = pbkdf2(sha256, password, salt, {
    c: ITERATIONS,
    dkLen: KEY_LENGTH
  });
  
  const hashHex = Array.from(hash)
    .map((b: number) => b.toString(16).padStart(2, '0'))
    .join('');
  
  return `${saltHex}:${hashHex}`;
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [saltHex, hashHex] = storedHash.split(':');
  
  if (!saltHex || !hashHex) {
    return false;
  }
  
  const salt = new Uint8Array(
    saltHex.match(/.{2}/g)!.map(byte => parseInt(byte, 16))
  );
  
  const hash = pbkdf2(sha256, password, salt, {
    c: ITERATIONS,
    dkLen: KEY_LENGTH
  });
  
  const computedHashHex = Array.from(hash)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  return computedHashHex === hashHex;
}

/**
 * Generate a random session token
 */
export function generateSessionToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
