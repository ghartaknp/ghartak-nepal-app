import React from "react";
import { View } from "react-native";
import { Tabs } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants";
import { useCart } from "@/context/CartContext";
import type { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";

export default function TabLayout() {
  const { cartItems } = useCart();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: "#CDCDE0",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#F0F0F0",
          height: 60,
          paddingTop: 6,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({
            color,
            focused,
          }: {
            color: string;
            focused: boolean;
          }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          tabBarIcon: ({
            color,
          }: {
            color: string;
            focused: boolean;
          }) => (
            <View style={{ position: "relative" }}>
              <Feather name="shopping-cart" size={24} color={color} />

              {cartItems?.length > 0 && (
                <View
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -6,
                    backgroundColor: "red",
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                  }}
                />
              )}
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          tabBarIcon: ({
            color,
            focused,
          }: {
            color: string;
            focused: boolean;
          }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({
            color,
            focused,
          }: {
            color: string;
            focused: boolean;
          }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}