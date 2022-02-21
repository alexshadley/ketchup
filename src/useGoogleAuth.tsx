import { useEffect, useState } from "react";
import { useGoogleLogin } from "react-google-login";
import { Auth } from "./calendar";

const GOOGLE_AUTH_KEY = "google-auth";

const storeAuth = (auth: Auth) => {
  localStorage.setItem(GOOGLE_AUTH_KEY, JSON.stringify(auth));
};

const retrieveAuth = (): Auth | null => {
  const authJson = localStorage.getItem(GOOGLE_AUTH_KEY);
  if (!authJson) {
    return null;
  }
  const auth = JSON.parse(authJson) as Auth;
  if (new Date().getTime() > auth.tokenObj.expires_at) {
    return null;
  }
  return auth;
};

const useGoogleAuth = () => {
  const [auth, setAuth] = useState<Auth | null>(null);

  const { signIn, loaded } = useGoogleLogin({
    clientId:
      "840913708709-tifth9epre8k3o0fatsket9tulf5jvrd.apps.googleusercontent.com",
    onSuccess: (response) => {
      storeAuth(response as Auth);
      setAuth(response as Auth);
    },
    onFailure: (response) => console.log(response),
    scope: "https://www.googleapis.com/auth/calendar",
  });

  useEffect(() => {
    if (loaded) {
      const storedAuth = retrieveAuth();
      if (storedAuth) {
        setAuth(storedAuth);
      } else {
        signIn();
      }
    }
  }, [loaded]);

  return auth;
};

export default useGoogleAuth;
