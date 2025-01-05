import {
  Text,
  View,
  StyleSheet,
  Switch,
  SafeAreaView,
  ScrollView,
  Dimensions,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";

const CategoryItem = ({ value, heading }) => {
  return (
    <View style={styles.row}>
      {/* Heading */}
      <Text style={styles.heading}>{heading}</Text>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            {
              backgroundColor: "#009989",
              width: `${value}%`, // Adjust width based on the value
            },
          ]}
        />
      </View>

      {/* Value Percentage */}
      <Text style={styles.value}>{value}%</Text>
    </View>
  );
};

const CategoryTable = ({ dataArray }) => {
  return (
    <View style={styles.container}>
      <Text className="pt-2 pb-6 text-3xl font-bold">INVENTORY</Text>
      <FlatList
        data={dataArray}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <CategoryItem value={item.value} heading={item.heading} />
        )}
      />
    </View>
  );
};

const url = "https://primebay-backend.onrender.com/api/v1/dashboard/app/stats";

export default function InventoryList() {
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        const dataArray = data.stats.categoryCount;

        const ans = dataArray.map((item) => {
          const key = Object.keys(item)[0]; // Access the key
          const value = item[key]; // Access the value

          return {
            heading: key, // Map the key to `heading`
            value: value, // Map the value to `value`
          };
        });

        setCategoryData(ans); // Set the ans array as the state
      } catch (error) {
        console.log("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  return (
    <View style={styles.appContainer}>
      <CategoryTable dataArray={categoryData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  heading: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  progressBarContainer: {
    flex: 2,
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    overflow: "hidden",
    marginHorizontal: 10,
  },
  progressBar: {
    height: "100%",
    borderRadius: 5,
  },
  value: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  appContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
});
