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
import React, { useState, useEffect } from "react";

const url = "https://primebay-backend.onrender.com/api/v1/dashboard/app/stats";
// const data = [
//   {
//     id: "675075bc96f7de66a9edf6d5",
//     quantity: 1,
//     discount: 0,
//     amount: 57,
//     status: "Delivered",
//   },
//   {
//     id: "6750c6ba69aaf405fb98e06a",
//     quantity: 1,
//     discount: 0,
//     amount: 57,
//     status: "Delivered",
//   },
//   {
//     id: "67515b1c82d95f0a6da9d85e",
//     quantity: 1,
//     discount: 0,
//     amount: 64,
//     status: "Delivered",
//   },
//   {
//     id: "6752f175a1de5929c5e81fc8",
//     quantity: 1,
//     discount: 0,
//     amount: 13,
//     status: "Delivered",
//   },
// ];

export default function TopTransactions() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setStats(data.stats.latestTransactions);
      } catch (error) {
        console.log("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  return (
    <ScrollView style={styles.container} horizontal>
      <View>
        <Text className="text-3xl font-bold px-6 pb-3">TOP TRANSACTIONS</Text>
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.headerText, { width: 200 }]}>
            Id
          </Text>
          <Text style={[styles.cell, styles.headerText, { width: 80 }]}>
            Quantity
          </Text>
          <Text style={[styles.cell, styles.headerText, { width: 80 }]}>
            Discount
          </Text>
          <Text style={[styles.cell, styles.headerText, { width: 80 }]}>
            Amount
          </Text>
          <Text style={[styles.cell, styles.headerText, { width: 120 }]}>
            Status
          </Text>
        </View>
        {/* Table Data */}
        {stats.map((stats) => (
          <View key={stats._id} style={styles.row}>
            <Text style={[styles.cell, { width: 230 }]}>{stats._id}</Text>
            <Text style={[styles.cell, { width: 80 }]}>{stats.quantity}</Text>
            <Text style={[styles.cell, { width: 80 }]}>{stats.discount}</Text>
            <Text style={[styles.cell, { width: 80 }]}>{stats.amount}</Text>
            <Text style={[styles.cell, { width: 120 }]}>{stats.status}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  headerRow: {
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 2,
    borderColor: "#ccc",
  },
  cell: {
    flex: 1,
    textAlign: "center",
    paddingHorizontal: 5,
    paddingVertical: 2,
    fontSize: 14,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 15,
  },
});
