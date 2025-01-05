import {
  Text,
  View,
  StyleSheet,
  Switch,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { BarChart, StackedBarChart } from "react-native-chart-kit";
import { Circle, Image } from "react-native-svg";
import icons from "../constants/icons";

const getLastSixMonths = () => {
  const months = [];
  const today = new Date();

  for (let i = 0; i < 6; i++) {
    // Get the month and year by subtracting months
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthName = date.toLocaleString("default", { month: "short" }); // Month name (e.g., January)
    const year = date.getFullYear(); // Year
    months.push(`${monthName}`);
  }

  return months.reverse(); // Reverse to get the months in ascending order
};

// Example usage
const latestSixMonths = getLastSixMonths();

export default function CustomBarChart({
  data_1 = [12, 303, 834, 1923, 900, 210],
  data_2 = [403, 54, 654, 628, 354, 434],
  title_1,
  title_2,
  bgColor_1 = "#007bff",
  bgColor_2 = "#ff6347",
  labels = latestSixMonths,
}) {
  const chartData = {
    labels: labels,
    legend: [title_1, title_2],
    data: data_1.map((value, index) => [value, data_2[index] || 0]),
    barColors: [bgColor_1, bgColor_2],
  };

  const screenWidth = Dimensions.get("window").width;

  return (
    <ScrollView className="w-full h-500 bg-white" horizontal>
      <View className="flex flex-col justify-start items-start p-2 mx-4 my-2">
        <Text className="py-2 text-3xl font-bold ">
          REVENUE & TRANSACTION CHART
        </Text>
        <StackedBarChart
          data={chartData}
          width={Math.max(screenWidth, chartData.labels.length * 80)} // Makes the chart scrollable
          height={300}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          hideLegend={true}
          fromZero // Start y-axis from 0
        />
      </View>
    </ScrollView>
  );
}
