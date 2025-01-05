import { Text, View, StyleSheet, Switch, ToastAndroid } from "react-native";
import React, { useEffect, useState } from "react";
import { isEnabled } from "react-native/Libraries/Performance/Systrace";

const url =
  "https://primebay-backend.onrender.com/api/v1/dashboard/app/orderStatus";

export default function OrderStatus() {
  const [info, setInfo] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setInfo(data.orderStatusInfo);
        console.log(data.orderStatusInfo);
      } catch (error) {
        console.log("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  const handleToggle = async () => {
    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: "Pd6zWGkSjLTh8IpOobO35dbA2IJ2",
          isEnabled: !info,
        }),
      });

      const data = await response.json();
      setInfo(data.orderStatusInfo);
      console.log(data.orderStatusInfo);
    } catch (error) {
      console.log("Error fetching data", error);
    }
    setInfo((prev) => !prev);
    info
      ? ToastAndroid.show("Order have been Stopped", ToastAndroid.SHORT)
      : ToastAndroid.show("Order will now be Accepted", ToastAndroid.SHORT);
  };

  return (
    <View>
      <Text style={styles.text}>D A S H B O A R D</Text>
      <View className="bg-white flex flex-row items-center justify-between w-full px-6">
        <Text className="font-semibold text-xl">Order Status</Text>

        {/* Switch Section */}
        <View className="flex flex-row items-center justify-between gap-2">
          <Text
            className={`${
              !info ? "text-gray-500 font-medium" : "text-gray-400 font"
            } text-xl `}
          >
            Off
          </Text>
          <Switch
            value={info}
            onValueChange={handleToggle}
            thumbColor={info ? "#1e90ff" : "#f4f3f4"}
            trackColor={{ false: "#ccc", true: "#87cefa" }}
          />
          <Text
            className={`${
              info ? "text-blue-600 font-medium" : "text-gray-400 font"
            } text-xl `}
          >
            On
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
});
