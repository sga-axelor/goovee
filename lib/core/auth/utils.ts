import bcrypt from 'bcrypt';

export const ROUNDS = 10;

export async function hash(password: string) {
  return password && bcrypt.hash(password, ROUNDS);
}

export async function compare(password: string, hash: string) {
  return password && hash && bcrypt.compare(password, hash);
}
