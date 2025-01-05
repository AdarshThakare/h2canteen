import { Tabs } from "expo-router";
import { Image, Text, View } from "react-native";
import icons from "../../../constants/icons";
import React from "react";

const TabIcon = ({ focused, icon, title }) => {
  return (
    <View className="flex-1 mt-2 flex flex-col items-center">
      <Image
        source={icon}
        tintColor={focused ? "#0061FF" : "#666876"}
        resizeMode="contain"
        className="size-6"
      />
      <Text
        className={`${
          focused
            ? "text-primary-300 font-rubik-medium"
            : "text-black-200 font-rubik"
        } text-xs w-full text-center mt-1`}
      >
        {/* {" "} */}
        {title}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "white",
          position: "absolute",
          borderTopColor: "#0061FF1A",
          borderTopWidth: 1,
          minHeight: 70,
        },
      }}
    >
      <Tabs.Screen
        name="product"
        options={{
          title: "Product",
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return (
              <TabIcon icon={icons.product} focused={focused} title="Product" />
            );
          },
        }}
      />
      <Tabs.Screen
        name="customer"
        options={{
          title: "Customer",
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return (
              <TabIcon
                icon={icons.customer}
                focused={focused}
                title="Customer"
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return (
              <TabIcon
                icon={icons.dashboard}
                focused={focused}
                title="Dashboard"
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="discount"
        options={{
          title: "Discount",
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return (
              <TabIcon
                icon={icons.discount}
                focused={focused}
                title="Discount"
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return (
              <TabIcon icon={icons.order} focused={focused} title="Orders" />
            );
          },
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
