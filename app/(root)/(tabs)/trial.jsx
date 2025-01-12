// import React, { useEffect, useState } from "react";
// import { Image } from "react-native";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   TextInput,
//   Modal,
//   StyleSheet,
//   Dimensions,
//   ScrollView,
// } from "react-native";
// import icons from "../../../constants/icons";

// const url =
//   "https://primebay-backend.onrender.com/api/v1/payment/app/coupon/all";
// const { width } = Dimensions.get("window");

// const addurl =
//   "https://primebay-backend.onrender.com/api/v1/payment/app/coupon/new";

// const App = () => {
//   const [coupons, setCoupons] = useState("");
//   const [discounts, setDiscounts] = useState([]);

//   const [modalVisible, setModalVisible] = useState(false);
//   const [addModalVisible, setAddModalVisible] = useState(false);
//   const [currentDiscount, setCurrentDiscount] = useState("");
//   const [newCode, setNewCode] = useState("");
//   const [newAmount, setNewAmount] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(url);
//         const data = await response.json();
//         setCoupons(data.coupons);
//       } catch (error) {
//         console.log("Error fetching data", error);
//       }
//     };
//     fetchData();
//   }, []);

//   const handleManage = (discount) => {
//     setCurrentDiscount(discount);
//     setModalVisible(true);
//   };

//   const handleSave = () => {
//     if (currentDiscount) {
//       setDiscounts((prevDiscounts) =>
//         prevDiscounts.map((discount) =>
//           discount.id === currentDiscount.id
//             ? { ...discount, code: newCode, amount: parseFloat(newAmount) }
//             : discount
//         )
//       );
//       setModalVisible(false);
//       setCurrentDiscount(null);
//     }
//   };

//   const addDiscountHandler = async () => {
//     if (!newCode || !newAmount) {
//       Alert.alert("Invalid Input", "Please Enter both Coupon and Amount");
//       return;
//     }
//   };

//   const renderItem = ({ item }) => (
//     <View style={styles.row}>
//       <Text style={[styles.cell, { width: width * 0.4 }]}>{item._id}</Text>
//       <Text style={[styles.cell, { width: width * 0.2 }]}>{item.code}</Text>
//       <Text style={[styles.cell, { width: width * 0.25 }]}>{item.amount}</Text>
//       <TouchableOpacity
//         style={[styles.cell, { width: width * 0.25 }]}
//         onPress={() => handleManage(item)}
//       >
//         <Text style={styles.manageButton}>Manage</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>D I S C O U N T S</Text>
//       <ScrollView horizontal>
//         <View>
//           {/* Table Header */}
//           <View style={styles.headerRow}>
//             <Text style={[styles.headerCell, { width: width * 0.4 }]}>Id</Text>
//             <Text style={[styles.headerCell, { width: width * 0.2 }]}>
//               Code
//             </Text>
//             <Text style={[styles.headerCell, { width: width * 0.25 }]}>
//               Amount
//             </Text>
//             <Text style={[styles.headerCell, { width: width * 0.25 }]}>
//               Action
//             </Text>
//           </View>

//           {/* Table Rows */}
//           <FlatList
//             data={coupons}
//             renderItem={renderItem}
//             keyExtractor={(item) => item._id}
//             contentContainerStyle={styles.table}
//           />
//         </View>
//       </ScrollView>

//       {/* Manage Discount Modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={setModalVisible(false)}
//       >
//         <View style={styles.modalBackground}>
//           <View style={styles.modalContainer}>
//             <Text style={styles.modalTitle}>Manage Discount</Text>
//             {currentDiscount && (
//               <>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Code"
//                   value={newCode}
//                   onChangeText={setNewCode}
//                 />
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Amount"
//                   keyboardType="numeric"
//                   value={newAmount}
//                   onChangeText={setNewAmount}
//                 />
//                 <TouchableOpacity
//                   onPress={handleSave}
//                   style={styles.saveButton}
//                 >
//                   <Text style={styles.saveButtonText}>Save</Text>
//                 </TouchableOpacity>
//               </>
//             )}
//             <TouchableOpacity
//               onPress={setModalVisible(false)}
//               style={styles.closeButton}
//             >
//               <Text style={styles.closeButtonText}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {/* Add Discount Modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={addModalVisible}
//         onRequestClose={setAddModalVisible(false)}
//       >
//         <View style={styles.modalBackground}>
//           <View style={styles.modalContainer}>
//             <Text style={styles.modalTitle}>Add Discount</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Code"
//               value={newCode}
//               onChangeText={(newCode) => setNewCode(newCode)}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Amount"
//               keyboardType="numeric"
//               value={newAmount}
//               onChangeText={(newAmount) => setNewAmount(newAmount)}
//             />
//             <TouchableOpacity style={styles.saveButton}>
//               <Text style={styles.saveButtonText}>Add</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               onPress={setAddModalVisible(false)}
//               style={styles.closeButton}
//             >
//               <Text style={styles.closeButtonText}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {/* Add Discount Button */}
//       <TouchableOpacity
//         style={styles.addButton}
//         onPress={setAddModalVisible(true)}
//       >
//         <Text style={styles.addButtonText}>+</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: "#fff",
//   },
//   heading: {
//     fontSize: 24,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 10,
//   },
//   table: {
//     paddingBottom: 16,
//   },
//   headerRow: {
//     flexDirection: "row",
//     backgroundColor: "#f1f1f1",
//     paddingVertical: 8,
//     marginTop: 8,
//   },
//   headerCell: {
//     fontSize: 16,
//     fontWeight: "bold",
//     paddingHorizontal: 8,
//     textAlign: "center",
//   },
//   row: {
//     flexDirection: "row",
//     borderBottomWidth: 1,
//     borderBottomColor: "#ccc",
//     paddingVertical: 10,
//   },
//   cell: {
//     fontSize: 16,
//     paddingHorizontal: 8,
//     textAlign: "center",
//   },
//   manageButton: {
//     color: "#007BFF",
//     fontWeight: "bold",
//   },
//   modalBackground: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContainer: {
//     width: "80%",
//     backgroundColor: "white",
//     borderRadius: 8,
//     padding: 16,
//     alignItems: "center",
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 16,
//   },
//   input: {
//     width: "100%",
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 4,
//     padding: 8,
//     marginBottom: 16,
//   },
//   saveButton: {
//     backgroundColor: "#007BFF",
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 4,
//     marginTop: 10,
//   },
//   saveButtonText: {
//     color: "white",
//     fontSize: 16,
//   },
//   closeButton: {
//     marginTop: 16,
//   },
//   closeButtonText: {
//     color: "#007BFF",
//     fontSize: 16,
//   },
//   addButton: {
//     position: "absolute",
//     bottom: 86,
//     right: 16,
//     backgroundColor: "#007BFF",
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     justifyContent: "center",
//     alignItems: "center",
//     elevation: 5,
//   },
//   addButtonText: {
//     color: "white",
//     fontSize: 24,
//     fontWeight: "bold",
//   },
// });

// export default App;
