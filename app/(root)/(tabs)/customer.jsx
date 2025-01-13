import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  FlatList,
  ScrollView,
} from "react-native";

import icons from "../../../constants/icons";

const url = "https://primebay-backend.onrender.com/api/v1/user/app/all";

const Spacer = ({ height = 10 }) => <View style={{ height }} />;

const App = () => {
  const [users, setUsers] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setUsers(data.users);
        // console.log(photoUrls)
      } catch (error) {
        console.log("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  const onRefreshHandler = () => {
    const fetchData = async () => {
      try {
        console.log("I am running");
        const response = await fetch(url);
        const data = await response.json();
        setUsers(data.users);
        // console.log(data.products);
      } catch (error) {
        console.log("Error fetching the data", error);
      }
    };
    fetchData();
  };

  const deleteCustomer = (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this user?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
        },
      ]
    );
  };

  const renderRow = ({ item, index }) => (
    <View style={styles.tableRow}>
      <View style={[styles.cell, styles.avatarCell]}>
        <Image source={{ uri: item.photo }} style={styles.avatar} />
      </View>
      <Text style={[styles.cell, styles.textCell]}>{item.name}</Text>
      <Text style={[styles.cell, styles.textCell]}>{item.gender}</Text>
      <Text style={[styles.cell, styles.emailCell]}>{item.email}</Text>
      <Text style={[styles.cell, styles.textCell]}>{item.role}</Text>
      {/* <TouchableOpacity
        style={[styles.cell, styles.actionCell]}
        onPress={() => deleteCustomer(item._id)}
      >
        <Image source={icons.deleteIcon} className="size-8" />
      </TouchableOpacity> */}
    </View>
  );

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity style={styles.refresh} onPress={onRefreshHandler}>
          <Image source={icons.refreshIcon} className="size-9" />
        </TouchableOpacity>
        <Text style={styles.header}>C U S T O M E R S</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator>
          <View className="mt-2">
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, styles.avatarCell]}>Avatar</Text>
              <Text style={[styles.headerCell, styles.textCell]}>Name</Text>
              <Text style={[styles.headerCell, styles.textCell]}>Gender</Text>
              <Text style={[styles.headerCell, styles.emailCell]}>Email</Text>
              <Text style={[styles.headerCell, styles.textCell]}>Role</Text>
              {/* <Text style={[styles.headerCell, styles.actionCell]}>Action</Text> */}
            </View>
            {/* Table Rows */}
            <FlatList
              data={users}
              renderItem={renderRow}
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
            />
          </View>
        </ScrollView>
      </View>
      <Spacer height={60} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "white",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f1f1",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "white",
  },
  headerCell: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
  },
  cell: {
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  avatarCell: {
    width: 70,
  },
  textCell: {
    width: 100,
  },
  emailCell: {
    width: 200,
  },
  actionCell: {
    width: 60,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  deleteText: {
    color: "red",
    fontSize: 20,
    fontWeight: "bold",
  },
  refresh: {
    position: "absolute",
    top: 2,
    left: 16,
    width: 50,
    height: 50,
  },
});

export default App;
