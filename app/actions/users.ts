import fs from "fs";
import path from "path";

const usersFilePath = path.join(process.cwd(), "users.json");

export function readUsers() {
  const data = fs.readFileSync(usersFilePath, "utf-8");
  return JSON.parse(data);
}

export function writeUsers(users: any[]) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}