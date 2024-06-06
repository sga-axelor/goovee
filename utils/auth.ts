import bcrypt from 'bcrypt';

export const ROUNDS = 10;

export const salt = bcrypt.genSaltSync(ROUNDS);

export async function hash(password: string) {
  return password && bcrypt.hash(password, salt);
}

export async function compare(password: string, hash: string) {
  return password && hash && bcrypt.compare(password, hash);
}
