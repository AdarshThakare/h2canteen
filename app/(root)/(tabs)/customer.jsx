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
  Modal,
  ToastAndroid,
} from "react-native";

import icons from "../../../constants/icons";

const url = "https://primebay-backend.onrender.com/api/v1/user/app/all";

const Spacer = ({ height = 10 }) => <View style={{ height }} />;

const App = () => {
  const [users, setUsers] = useState();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.log("Error fetching data", error);
      }
    };
    fetchData();
  }, [users]);

  const openDeleteModal = () => {
    setDeleteModalVisible(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalVisible(false);
  };

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

  const deleteUserHandler = async (id) => {
    try {
      const delUrl =
        "https://primebay-backend.onrender.com/api/v1/user/app/" + id;
      const response = await fetch(delUrl, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        ToastAndroid.show("User deleted successfully!", ToastAndroid.SHORT);
      } else {
        ToastAndroid.show("Failed to delete user.", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSelect = (user) => {
    setSelectedUser(user);
    console.log("Selected Discount: ", selectedUser);
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
        onPress={() => {
          handleSelect(item);
          openDeleteModal();
        }}
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
        {
          // Discount Modal
          selectedUser && (
            <Modal
              animationType="fade"
              transparent={true}
              visible={deleteModalVisible}
              onRequestClose={closeDeleteModal}
            >
              <View style={styles.modalContainerA}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalHeader}>Are You Sure?</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={closeDeleteModal}
                  >
                    <Text style={styles.closeButtonText}>X</Text>
                  </TouchableOpacity>
                  <View className="flex justify-center items-center">
                    <Text className="text-center text-lg px-5 py-3">
                      Do you really want to delete the current user? Press
                      'Proceed' to continue to delete.
                    </Text>
                    <Text className="text-center text-lg px-5 py-3">
                      This Action CANNOT be Undone.
                    </Text>
                  </View>
                  <View className="flex flex-row justify-center gap-6 items-center py-3">
                    <TouchableOpacity
                      className="bg-gray-200 mt-3 px-5 py-1 rounded-xl"
                      onPress={closeDeleteModal}
                    >
                      <Text className="font-bold text-xl text-center py-2">
                        CANCEL
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="bg-red-500 mt-3 px-5 py-1 rounded-xl"
                      onPress={() => {
                        handleSelect(selectedUser);
                        deleteUserHandler(selectedUser._id);
                        closeDeleteModal();
                      }}
                    >
                      <Text className="font-bold text-white text-xl text-center py-2">
                        PROCEED
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          )
        }
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
    width: 80,
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
  modalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#f1f1f1",
    paddingVertical: 8,
    marginTop: 8,
  },
  headerCell: {
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 8,
    textAlign: "center",
  },
  modalContainerA: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(26, 26, 26, 0.18)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    width: "92%",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  closeButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#666666",
    width: 30,
    height: 30,
    borderRadius: 28,
    justifyContent: "center",
    position: "absolute",
    top: 13,
    right: 13,
  },
});

export default App;
