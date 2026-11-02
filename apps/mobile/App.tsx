import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "./src/hooks/useAuth";
import { AuthStack } from "./src/navigation/AuthStack";
import { RootTabs } from "./src/navigation/RootTabs";
import { SplashScreen } from "./src/screens/auth/SplashScreen";
import { colors } from "@dvc/shared";

function AppNavigator() {
  const { user, bootstrapping } = useAuth();

  if (bootstrapping) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {user ? <RootTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="light" backgroundColor={colors.navy} />
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
