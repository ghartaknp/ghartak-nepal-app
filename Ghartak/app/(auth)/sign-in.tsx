import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Pressable,
  Text,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInScreen() {
  const { signIn, setActive } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    // ✅ guard against undefined
    if (!signIn || !setActive) {
      Alert.alert("Error", "Auth not ready");
      return;
    }

    if (!email || !password) {
      Alert.alert("Error", "Email and password required");
      return;
    }

    try {
      setLoading(true);

      // ✅ create sign-in attempt
      const result = await signIn.create({
        identifier: email,
        password: password,
      });

      // ✅ activate session
      await setActive({ session: result.createdSessionId });

      // ✅ redirect to profile
      router.replace("/profile");
    } catch (err: any) {
      Alert.alert(
        "Sign-In Failed",
        err?.errors?.[0]?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // Optional: wait until Clerk loads
  if (!signIn || !setActive) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f7fb" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, justifyContent: "center", padding: 20 }}
      >
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 12,
            padding: 14,
            marginBottom: 12,
          }}
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 12,
            padding: 14,
            marginBottom: 12,
          }}
        />

        <Pressable
          onPress={handleSignIn}
          style={{
            backgroundColor: "#2563eb",
            padding: 14,
            borderRadius: 12,
            alignItems: "center",
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff", fontWeight: "600" }}>
              Sign In
            </Text>
          )}
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}