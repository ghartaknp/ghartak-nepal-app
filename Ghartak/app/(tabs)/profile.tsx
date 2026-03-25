import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { useRouter, type Href } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, PROFILE_MENU } from "@/constants";
import Header from "@/components/Header";

export default function Profile() {
  const { user, isLoaded } = useUser();
  const { isSignedIn, signOut } = useAuth();
  const router = useRouter();

  if (!isLoaded) return null;

  // ✅ GUEST UI (NO REDIRECT)
  if (!isSignedIn || !user) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
        <Header title="Profile" />

        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 18, marginBottom: 20 }}>
            You are browsing as Guest
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/sign-in")}
            style={{
              backgroundColor: "#2563eb",
              padding: 12,
              borderRadius: 8,
              width: 200,
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/sign-up")}
            style={{
              backgroundColor: "#34d399",
              padding: 12,
              borderRadius: 8,
              width: 200,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ✅ LOGGED IN UI
  const handleLogout = async () => {
    await signOut();
    router.replace("/profile"); // refresh UI after logout
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <Header title="Profile" />

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <Image
            source={{ uri: user.imageUrl }}
            style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 10 }}
          />
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            {user.firstName} {user.lastName}
          </Text>
          <Text>{user.primaryEmailAddress?.emailAddress}</Text>
        </View>

        {PROFILE_MENU.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => item.route && router.push(item.route as Href)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 12,
              borderBottomWidth: index !== PROFILE_MENU.length - 1 ? 1 : 0,
              borderColor: "#ddd",
            }}
          >
            <Ionicons name={item.icon as any} size={20} color={COLORS.primary} />
            <Text style={{ flex: 1, marginLeft: 10 }}>
              {item.title}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.secondary} />
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          onPress={handleLogout}
          style={{
            backgroundColor: "red",
            padding: 12,
            borderRadius: 8,
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            Log Out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}