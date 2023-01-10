import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../utils/constants";

export const encryptPassword = (password: string) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};
