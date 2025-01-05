import {
  Text,
  View,
  StyleSheet,
  Switch,
  SafeAreaView,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import OrderStatus from "./orderStatus";
import Svg, { Circle } from "react-native-svg";

export default function WidgetItem({
  heading,
  value,
  percent,
  color,
  amount = false,
  size = 120,
  strokeWidth = 12,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  const formattedPercent =
    percent > 10000 ? 9999 : percent < -10000 ? -9999 : percent;

  return (
    <View className="flex flex-row items-center justify-between mx-6 mt-4 p-6 bg-white rounded-2xl .elevation-8 shadow-lg shadow-black">
      {/* Widget Info */}
      <View className="flex flex-col">
        <Text className="font text-lg mb-1">{heading}</Text>
        <Text className="text-4xl font-semibold mb-2">
          {amount ? `₹${value}` : value}
        </Text>
        {percent > 0 ? (
          <Text className="text-2xl font-semibold text-green-500">
            {/* TODO : RISE_ARROW */}
            {formattedPercent}%
          </Text>
        ) : (
          <Text className="text-2xl font-semibold text-red-500">
            {/* TODO : FALL_ARROW */}
            {formattedPercent}%
          </Text>
        )}
      </View>

      {/* Widget Circle */}
      <View className="justify-center items-center">
        <Svg width={size} height={size}>
          {/* Background Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e6e6e6"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Foreground Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </Svg>
        {/* Text in the Center */}
        <View className="justify-center items-center absolute">
          <Text
            className="font-semibold text-2xl"
            style={{ color }}
          >{`${percent}%`}</Text>
        </View>
      </View>
    </View>
  );
}
