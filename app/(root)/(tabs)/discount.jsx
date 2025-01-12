import React, { useEffect, useState } from "react";
import { Alert, Button, Image, ToastAndroid } from "react-native";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import icons from "../../../constants/icons";

const url =
  "https://primebay-backend.onrender.com/api/v1/payment/app/coupon/all";
const { width } = Dimensions.get("window");
const addurl =
  "https://primebay-backend.onrender.com/api/v1/payment/app/coupon/new";

const App = () => {
  const [discounts, setDiscounts] = useState([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [manageModalVisible, setManageModalVisible] = useState(false);
  const [preManageModalVisible, setPreManageModalVisible] = useState(false);
  const [code, setCode] = useState("");
  const [amount, setAmount] = useState(0);
  const [updateId, setUpdateId] = useState("");
  const [updateCode, setUpdateCode] = useState("");
  const [updateAmount, setUpdateAmount] = useState(0);
  const [selectedDiscount, setSelectedDiscount] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setDiscounts(data.coupons);
      } catch (error) {
        console.log("Error fetching data", error);
      }
    };
    fetchData();
  }, [discounts]);

  const openAddModal = () => {
    setAddModalVisible(true);
  };

  const closeAddModal = () => {
    setAddModalVisible(false);
  };

  const openDeleteModal = () => {
    setDeleteModalVisible(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalVisible(false);
  };

  const openPreManageModal = () => {
    setPreManageModalVisible(true);
  };

  const closePreManageModal = () => {
    setPreManageModalVisible(false);
  };

  const openManageModal = () => {
    setManageModalVisible(true);
    setUpdateId(selectedDiscount?._id);
    setUpdateCode(selectedDiscount?.code);
    setUpdateAmount(selectedDiscount?.amount?.toString());
  };

  const closeManageModal = () => {
    setManageModalVisible(false);
  };

  //ADD A NEW DISCOUNT
  const addDiscountHandler = async () => {
    if (!code || !amount) {
      Alert.alert("Incomplete Details", "Please Enter both, Code and Amount");
      return;
    }

    console.log("Code : ", code);
    console.log("Amount : ", amount);

    try {
      const response = await fetch(addurl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: code,
          amount: parseFloat(amount),
        }),
      });
      if (response.ok) {
        ToastAndroid.show("Discount added successfully!", ToastAndroid.SHORT);
      } else {
        ToastAndroid.show("Failed to add discount.", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setCode("");
    setAmount("");
    setAddModalVisible(false);
  };

  const handleSelect = (discount) => {
    setSelectedDiscount(discount);
    console.log("Selected Discount: ", selectedDiscount);
  };

  const deleteDiscountHandler = async (id) => {
    try {
      const delUrl =
        "https://primebay-backend.onrender.com/api/v1/payment/app/coupon/" + id;
      const response = await fetch(delUrl, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        ToastAndroid.show("Coupon deleted successfully!", ToastAndroid.SHORT);
      } else {
        ToastAndroid.show("Failed to delete coupon.", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onSaveHandler = async () => {
    if (!updateCode || !updateAmount) {
      Alert.alert("Invalid Details", "Code and Amount are required!");
      return;
    }

    try {
      const putUrl =
        "https://primebay-backend.onrender.com/api/v1/payment/app/coupon/" +
        updateId;
      const response = await fetch(putUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: updateCode,
          amount: parseFloat(updateAmount),
        }),
      });
      if (response.ok) {
        ToastAndroid.show("Coupon Updated successfully!", ToastAndroid.SHORT);
      } else {
        ToastAndroid.show("Failed to update the coupon.", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, { width: width * 0.4 }]}>{item._id}</Text>
      <Text style={[styles.cell, { width: width * 0.3 }]}>{item.code}</Text>
      <Text style={[styles.cell, { width: width * 0.25 }]}>{item.amount}</Text>
      <TouchableOpacity
        style={[styles.cell, { width: width * 0.25 }]}
        onPress={() => {
          handleSelect(item);
          openPreManageModal();
        }}
      >
        <Text style={styles.manageButton}>Manage</Text>
      </TouchableOpacity>
      <Modal
        animationType="none"
        transparent={true}
        closeRequest={closePreManageModal}
        visible={preManageModalVisible}
      >
        <View style={styles.modalContainerA}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Are You Sure?</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closePreManageModal}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <View className="flex justify-center items-center">
              <Text className="text-center text-lg px-5 py-3">
                Contents of the coupon you selected will be overwritten. Please
                press 'Proceed' to update the values for this coupon!
              </Text>
            </View>
            <View className="flex flex-row justify-center gap-6 items-center py-3">
              <TouchableOpacity
                className="bg-gray-200 mt-3 px-5 py-1 rounded-xl"
                onPress={closePreManageModal}
              >
                <Text className="font-bold text-xl text-center py-2">
                  CANCEL
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-green-500 mt-3 px-5 py-1 rounded-xl"
                onPress={() => {
                  handleSelect(item);
                  closePreManageModal();
                  openManageModal();
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
      <TouchableOpacity
        style={[styles.cell, { width: width * 0.25 }]}
        onPress={() => {
          handleSelect(item);
          openDeleteModal();
        }}
      >
        <Image source={icons.deleteIcon} style={{ width: 30, height: 30 }} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>D I S C O U N T S</Text>
      <ScrollView horizontal>
        <View>
          {/* Table Header */}
          <View style={styles.headerRow}>
            <Text style={[styles.headerCell, { width: width * 0.4 }]}>Id</Text>
            <Text style={[styles.headerCell, { width: width * 0.3 }]}>
              Code
            </Text>
            <Text style={[styles.headerCell, { width: width * 0.25 }]}>
              Amount
            </Text>
            <Text style={[styles.headerCell, { width: width * 0.25 }]}>
              Action
            </Text>
            <Text style={[styles.headerCell, { width: width * 0.25 }]}>
              Delete
            </Text>
          </View>

          {/* Table Rows */}
          <FlatList
            data={discounts}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.table}
          />
        </View>
      </ScrollView>

      {
        // Discount Modal
        selectedDiscount && (
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
                    Do you really want to delete the current discount? Press
                    'Proceed' to continue to delete!
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
                      handleSelect(selectedDiscount);
                      deleteDiscountHandler(selectedDiscount._id);
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

      {/* Manage Discount Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={manageModalVisible}
        onRequestClose={closeManageModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              onPress={closeManageModal}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Manage Discount</Text>
            <Text></Text>
            {selectedDiscount && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Code"
                  value={updateCode}
                  onChangeText={(text) => setUpdateCode(text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Amount"
                  keyboardType="numeric"
                  value={updateAmount}
                  onChangeText={(text) => setUpdateAmount(text)}
                />
                <View className="flex flex-row justify-center gap-6 items-center py-3">
                  <TouchableOpacity
                    className="bg-gray-200 mt-3 px-5 py-1 rounded-xl"
                    onPress={closeManageModal}
                  >
                    <Text className="font-bold text-xl text-center py-2">
                      CANCEL
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-blue-500 mt-3 px-5 py-1 rounded-xl"
                    onPress={() => {
                      onSaveHandler(selectedDiscount._id);
                      closeManageModal();
                    }}
                  >
                    <Text className="font-bold text-white text-xl text-center py-2">
                      SAVE
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Add Discount Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addModalVisible}
        onRequestClose={closeAddModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeAddModal}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Discount</Text>
            <TextInput
              style={styles.input}
              placeholder="Code"
              value={code}
              onChangeText={(text) => {
                setCode(text);
              }}
            />
            <TextInput
              style={styles.input}
              placeholder="Amount"
              keyboardType="numeric"
              value={amount}
              onChangeText={(text) => {
                setAmount(text);
              }}
            />
            <TouchableOpacity
              className="bg-blue-500 mt-3 px-8 mb-2 py-1 rounded-xl"
              onPress={addDiscountHandler}
            >
              <Text className="font-bold text-white text-xl text-center py-2">
                ADD
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Discount Button */}
      <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  table: {
    paddingBottom: 16,
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
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
  },
  cell: {
    fontSize: 16,
    paddingHorizontal: 8,
    textAlign: "center",
    alignItems: "center",
  },
  manageButton: {
    color: "#007BFF",
    fontWeight: "bold",
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
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginTop: 10,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
  },
  addButton: {
    position: "absolute",
    bottom: 86,
    right: 16,
    backgroundColor: "#007BFF",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  addButtonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
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
