import { timingSafeEqual, createHmac, pbkdf2Sync, randomBytes, randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export type AuthUser = {
  id: string;
  fullName: string;
  companyName: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
};

export type SessionUser = {
  id: string;
  fullName: string;
  companyName: string;
  email: string;
};

type UserDatabase = {
  users: AuthUser[];
};

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const SESSION_COOKIE = "swiftpath_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
const PASSWORD_ITERATIONS = 120_000;
const PASSWORD_KEY_LENGTH = 64;
const PASSWORD_DIGEST = "sha512";

function getSessionSecret() {
  return process.env.AUTH_SECRET || "swiftpath-local-development-secret-change-me";
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function toPublicUser(user: AuthUser): SessionUser {
  return {
    id: user.id,
    fullName: user.fullName,
    companyName: user.companyName,
    email: user.email
  };
}

async function readDatabase(): Promise<UserDatabase> {
  try {
    const contents = await readFile(USERS_FILE, "utf8");
    const parsed = JSON.parse(contents) as Partial<UserDatabase>;
    return { users: Array.isArray(parsed.users) ? parsed.users : [] };
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return { users: [] };
    throw error;
  }
}

async function writeDatabase(database: UserDatabase) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(USERS_FILE, `${JSON.stringify(database, null, 2)}\n`, "utf8");
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, PASSWORD_ITERATIONS, PASSWORD_KEY_LENGTH, PASSWORD_DIGEST).toString("hex");
  return `pbkdf2:${PASSWORD_ITERATIONS}:${salt}:${hash}`;
}

function verifyPassword(password: string, storedHash: string) {
  const [scheme, iterationsValue, salt, hash] = storedHash.split(":");
  if (scheme !== "pbkdf2" || !iterationsValue || !salt || !hash) return false;

  const iterations = Number(iterationsValue);
  if (!Number.isInteger(iterations) || iterations <= 0) return false;

  const candidate = pbkdf2Sync(password, salt, iterations, PASSWORD_KEY_LENGTH, PASSWORD_DIGEST);
  const expected = Buffer.from(hash, "hex");
  return expected.length === candidate.length && timingSafeEqual(expected, candidate);
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

function encodePayload(payload: object) {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

function decodePayload<T>(payload: string): T | null {
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
}

export function getSessionCookieName() {
  return SESSION_COOKIE;
}

export function getSessionMaxAgeSeconds() {
  return SESSION_MAX_AGE_SECONDS;
}

export async function createUser(input: {
  fullName: string;
  companyName: string;
  email: string;
  password: string;
}) {
  const database = await readDatabase();
  const email = normalizeEmail(input.email);

  if (database.users.some((user) => user.email === email)) {
    return { error: "An account already exists for this email." as const };
  }

  const now = new Date().toISOString();
  const user: AuthUser = {
    id: randomUUID(),
    fullName: input.fullName.trim(),
    companyName: input.companyName.trim(),
    email,
    passwordHash: hashPassword(input.password),
    createdAt: now,
    updatedAt: now
  };

  database.users.push(user);
  await writeDatabase(database);

  return { user: toPublicUser(user) };
}

export async function authenticateUser(emailInput: string, password: string) {
  const database = await readDatabase();
  const email = normalizeEmail(emailInput);
  const user = database.users.find((candidate) => candidate.email === email);

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return null;
  }

  return toPublicUser(user);
}

export async function findSessionUser(userId: string) {
  const database = await readDatabase();
  const user = database.users.find((candidate) => candidate.id === userId);
  return user ? toPublicUser(user) : null;
}

export async function updateUserProfile(
  userId: string,
  input: {
    fullName: string;
    companyName: string;
    email: string;
  }
) {
  const database = await readDatabase();
  const userIndex = database.users.findIndex((candidate) => candidate.id === userId);
  if (userIndex === -1) return { error: "User not found." as const };

  const email = normalizeEmail(input.email);
  const emailOwner = database.users.find((candidate) => candidate.email === email);
  if (emailOwner && emailOwner.id !== userId) {
    return { error: "This email is already used by another account." as const };
  }

  const updatedUser: AuthUser = {
    ...database.users[userIndex],
    fullName: input.fullName.trim(),
    companyName: input.companyName.trim(),
    email,
    updatedAt: new Date().toISOString()
  };

  database.users[userIndex] = updatedUser;
  await writeDatabase(database);

  return { user: toPublicUser(updatedUser) };
}

export function createSessionToken(user: SessionUser) {
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const payload = encodePayload({ sub: user.id, exp: expiresAt });
  return `${payload}.${sign(payload)}`;
}

export async function verifySessionToken(token?: string) {
  if (!token) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature || sign(payload) !== signature) return null;

  const decoded = decodePayload<{ sub?: string; exp?: number }>(payload);
  if (!decoded?.sub || !decoded.exp || decoded.exp < Date.now()) return null;

  return findSessionUser(decoded.sub);
}
