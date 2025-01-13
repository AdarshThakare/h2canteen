import {
  Text,
  View,
  Image,
  StyleSheet,
  Switch,
  ToastAndroid,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { isEnabled } from "react-native/Libraries/Performance/Systrace";

import icons from "../constants/icons";
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
        console.log("On Mount : ", data.orderStatusInfo);
      } catch (error) {
        console.log("Error fetching data", error);
      }
    };
    fetchData();
  }, [info]);

  const onRefreshHandler = () => {
    const fetchData = async () => {
      try {
        console.log("I am running");
        const response = await fetch(url);
        const data = await response.json();
        setInfo(data.orderStatusInfo);

        // console.log(data.products);
      } catch (error) {
        console.log("Error fetching the data", error);
      }
    };
    fetchData();
  };

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
      setInfo((prev) => !prev);
    } catch (error) {
      console.log("Error fetching data", error);
    }
    info
      ? ToastAndroid.show("Order have been Stopped", ToastAndroid.SHORT)
      : ToastAndroid.show("Order will now be Accepted", ToastAndroid.SHORT);
  };

  return (
    <View>
      <TouchableOpacity style={styles.refresh} onPress={onRefreshHandler}>
        <Image
          source={icons.refreshIcon}
          className="size-9 absolute left-1 top-2"
        />
      </TouchableOpacity>
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
    marginTop: 10,
    marginBottom: 10,
  },
  refresh: {
    position: "absolute",
    top: 6,
    left: 20,
    width: 50,
    height: 50,
  },
});
