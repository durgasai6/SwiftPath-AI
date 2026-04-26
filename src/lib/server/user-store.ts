import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "users.json");

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

function readUsers(): StoredUser[] {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE, "utf-8"));
}

function writeUsers(users: StoredUser[]) {
  fs.writeFileSync(FILE, JSON.stringify(users, null, 2));
}

export function findUserByEmail(email: string): StoredUser | undefined {
  return readUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser(data: Omit<StoredUser, "id" | "createdAt">): StoredUser {
  const users = readUsers();
  const newUser: StoredUser = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  writeUsers(users);
  return newUser;
}