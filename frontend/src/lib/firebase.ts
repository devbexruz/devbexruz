import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  UserCredential
} from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyAr4jhq7nPGUgzLIurro7z4m3fQEV-S_f4",
  authDomain: "chiroqchishop.firebaseapp.com",
  projectId: "chiroqchishop",
  storageBucket: "chiroqchishop.firebasestorage.app",
  messagingSenderId: "655373695851",
  appId: "1:655373695851:web:4b190acac1a446dfa4aa2e"
};

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
// Force Google to show account chooser dialog with accounts logged in on the computer
googleProvider.setCustomParameters({
  prompt: "select_account"
});

export async function signInWithGoogleFirebase(): Promise<{
  email: string;
  name: string;
  avatar_url?: string;
  sub?: string;
}> {
  const result: UserCredential = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  if (!user.email) {
    throw new Error("Google hisobingizdan email manzili olinmadi");
  }
  return {
    email: user.email,
    name: user.displayName || user.email.split("@")[0],
    avatar_url: user.photoURL || undefined,
    sub: user.uid
  };
}
