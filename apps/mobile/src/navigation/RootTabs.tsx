import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { UserRole } from "@dvc/shared";
import { useAuth } from "../hooks/useAuth";
import { colors } from "../theme";
import { DirectorHomeScreen } from "../screens/dashboard/DirectorHomeScreen";
import { ProjectManagerHomeScreen } from "../screens/dashboard/ProjectManagerHomeScreen";
import { SupervisorHomeScreen } from "../screens/dashboard/SupervisorHomeScreen";
import { CustomerHomeScreen } from "../screens/dashboard/CustomerHomeScreen";
import { ProjectsScreen } from "../screens/projects/ProjectsScreen";
import { AddExpenseScreen } from "../screens/expenses/AddExpenseScreen";
import { VendorsScreen } from "../screens/vendors/VendorsScreen";
import { ActivitiesScreen } from "../screens/progress/ActivitiesScreen";
import { SitePhotosScreen } from "../screens/photos/SitePhotosScreen";
import { CustomerProgressScreen } from "../screens/progress/CustomerProgressScreen";
import { CustomerPhotosScreen } from "../screens/photos/CustomerPhotosScreen";
import { CustomerDocumentsScreen } from "../screens/more/CustomerDocumentsScreen";
import { MoreScreen } from "../screens/more/MoreScreen";
import { ProfileScreen } from "../screens/profile/ProfileScreen";

export type RootTabParamList = {
  Home: undefined;
  Projects: undefined;
  Activities: undefined;
  Progress: undefined;
  AddExpense: undefined;
  Vendors: undefined;
  SitePhotos: undefined;
  Photos: undefined;
  Documents: undefined;
  More: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <View style={styles.iconWrap}>
      <Text style={[styles.iconText, focused && styles.iconFocused]}>{label}</Text>
    </View>
  );
}

function HomeForRole() {
  const { user } = useAuth();
  switch (user?.role) {
    case UserRole.DIRECTOR:
      return <DirectorHomeScreen />;
    case UserRole.PROJECT_MANAGER:
      return <ProjectManagerHomeScreen />;
    case UserRole.SITE_SUPERVISOR:
      return <SupervisorHomeScreen />;
    case UserRole.CUSTOMER:
      return <CustomerHomeScreen />;
    default:
      return <DirectorHomeScreen />;
  }
}

/** Role-aware bottom navigation shells (PRD §4). */
export function RootTabs() {
  const { user } = useAuth();
  const role = user?.role;

  if (role === UserRole.CUSTOMER) {
    return (
      <Tab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.navy },
          headerTintColor: colors.white,
          tabBarActiveTintColor: colors.teal,
          tabBarInactiveTintColor: colors.grey500,
          tabBarStyle: { backgroundColor: colors.white, borderTopColor: colors.border },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeForRole}
          options={{
            title: "Home",
            tabBarIcon: ({ focused }) => <TabIcon label="⌂" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Progress"
          component={CustomerProgressScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon label="◎" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Photos"
          component={CustomerPhotosScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon label="▣" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Documents"
          component={CustomerDocumentsScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon label="☰" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon label="☺" focused={focused} />,
          }}
        />
      </Tab.Navigator>
    );
  }

  if (role === UserRole.SITE_SUPERVISOR) {
    return (
      <Tab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.navy },
          headerTintColor: colors.white,
          tabBarActiveTintColor: colors.teal,
          tabBarInactiveTintColor: colors.grey500,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeForRole}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon label="⌂" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Activities"
          component={ActivitiesScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon label="☰" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="AddExpense"
          component={AddExpenseScreen}
          options={{
            title: "Add Expense",
            tabBarLabel: "Expense",
            tabBarIcon: ({ focused }) => (
              <View style={[styles.fab, focused && styles.fabFocused]}>
                <Text style={styles.fabText}>+</Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="SitePhotos"
          component={SitePhotosScreen}
          options={{
            title: "Site Photos",
            tabBarIcon: ({ focused }) => <TabIcon label="▣" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="More"
          component={MoreScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon label="⋯" focused={focused} />,
          }}
        />
      </Tab.Navigator>
    );
  }

  // Director + Project Manager share the same shell; data is project-scoped on the API.
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.navy },
        headerTintColor: colors.white,
        tabBarActiveTintColor: colors.teal,
        tabBarInactiveTintColor: colors.grey500,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeForRole}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="⌂" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Projects"
        component={ProjectsScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="▦" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="AddExpense"
        component={AddExpenseScreen}
        options={{
          title: "Add Expense",
          tabBarLabel: "Expense",
          tabBarIcon: ({ focused }) => (
            <View style={[styles.fab, focused && styles.fabFocused]}>
              <Text style={styles.fabText}>+</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Vendors"
        component={VendorsScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="☷" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="⋯" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconWrap: { alignItems: "center", justifyContent: "center" },
  iconText: { fontSize: 16, color: colors.grey500 },
  iconFocused: { color: colors.teal, fontWeight: "700" },
  fab: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.teal,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  fabFocused: { backgroundColor: colors.tealDark },
  fabText: { color: colors.white, fontSize: 28, fontWeight: "600", marginTop: -2 },
});
