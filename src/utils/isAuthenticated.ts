// utils/isAuthenticated.ts
import { getToken } from "./auth";

export async function isAuthenticated(): Promise<boolean> {
  const token = await getToken();
  return !!token;
}