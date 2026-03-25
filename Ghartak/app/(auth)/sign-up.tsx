import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React, { useRef, useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SignUp() {
  const { signUp, setActive } = useSignUp();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);

  const otpInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (showOTP && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [showOTP]);

  // STEP 1: Create user + send OTP
  const handleSubmit = async () => {
    if (!signUp || !setActive) return;

    if (!emailAddress || !password) {
      Alert.alert("Error", "Email and password required");
      return;
    }

    try {
      setLoading(true);

      await signUp.create({
        emailAddress,
        password,
        firstName,
        lastName,
      });

      // send OTP
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setShowOTP(true);
    } catch (err: any) {
      Alert.alert(
        "Sign Up Error",
        err?.errors?.[0]?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP
  const handleVerify = async () => {
    if (!signUp || !setActive) return;

    if (!code) {
      Alert.alert("Error", "OTP is required");
      return;
    }

    try {
      setLoading(true);

      const result = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (result.status !== "complete") {
        Alert.alert("Error", "Verification incomplete");
        return;
      }

      // Activate session
      await setActive({ session: result.createdSessionId });

      router.replace("/profile");
    } catch (err: any) {
      Alert.alert(
        "Verification Error",
        err?.errors?.[0]?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.push("/")}>
            <Ionicons name="home-outline" size={26} color="#333" />
          </Pressable>

          <Text style={styles.headerTitle}>Create Account</Text>

          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={26} color="#333" />
          </Pressable>
        </View>

        <View style={styles.card}>
          {showOTP ? (
            <>
              <Text style={styles.title}>Verify Email</Text>

              <TextInput
                ref={otpInputRef}
                style={styles.input}
                value={code}
                placeholder="Enter OTP"
                keyboardType="numeric"
                onChangeText={setCode}
              />

              <Pressable
                style={[styles.button, loading && styles.disabled]}
                onPress={handleVerify}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>
                    Verify & Complete
                  </Text>
                )}
              </Pressable>
            </>
          ) : (
            <>
              <Text style={styles.title}>Sign Up</Text>

              <TextInput
                style={styles.input}
                value={firstName}
                placeholder="First Name"
                onChangeText={setFirstName}
              />

              <TextInput
                style={styles.input}
                value={lastName}
                placeholder="Last Name"
                onChangeText={setLastName}
              />

              <TextInput
                style={styles.input}
                value={emailAddress}
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={setEmailAddress}
              />

              <TextInput
                style={styles.input}
                value={password}
                placeholder="Password"
                secureTextEntry
                onChangeText={setPassword}
              />

              <Pressable
                style={[styles.button, loading && styles.disabled]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Sign Up</Text>
                )}
              </Pressable>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f7fb" },
  container: { flex: 1, padding: 20, justifyContent: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: { fontSize: 18, fontWeight: "600" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 3,
  },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    backgroundColor: "#fafafa",
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  disabled: { opacity: 0.5 },
});