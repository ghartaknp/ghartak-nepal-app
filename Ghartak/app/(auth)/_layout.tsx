import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function AuthRoutesLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/profile");
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}