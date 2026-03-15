import { auth } from "@configs/firebase";

export async function getToken(): Promise<string | null> {
  const user = auth.currentUser;
  const token = user ? await user.getIdToken() : null;
  return token;
}