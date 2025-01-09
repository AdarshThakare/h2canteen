// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   Modal,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   TextInput,
//   Button,
//   ActivityIndicator,
// } from "react-native";

// import * as ImagePicker from "expo-image-picker";
// import icons from "../../../constants/icons";

// const url = "https://primebay-backend.onrender.com/api/v1/product/latest";
// const Spacer = ({ height = 10 }) => <View style={{ height }} />;

// const addurl = "https://primebay-backend.onrender.com/api/v1/product/app/new";
// const ProductTable = () => {
//   //states
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedProductIndex, setSelectedProductIndex] = useState(null);

//   const [products, setProducts] = useState([]);
//   const [photos, setPhotos] = useState("");
//   const [viewPhotos, setViewPhotos] = useState(false);
//   const [editedProduct, setEditedProduct] = useState({});
//   const [addModalVisible, setAddModalVisible] = useState(false);
//   const [addImageModalVisible, setAddImageModalVisible] = useState(false);

//   //image states
//   const [image, setImage] = useState(null); // Store the selected image URI
//   const [uploading, setUploading] = useState(false); // Track upload status
//   const [multimagesResult, setMultimagesResult] = useState([]); // Store the selected image URI
//   const [result, setResult] = useState(""); // Store the selected image URI
//   //getAllProducts
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(url);
//         const data = await response.json();
//         setProducts(data.products);
//         const photoUrls = products.map((products) => products.photos[0]?.url);
//         setPhotos(photoUrls);
//       } catch (error) {
//         console.log("Error fetching data", error);
//       }
//       console.log(multimagesResult.length);
//     };
//     fetchData();
//   }, [photos, multimagesResult]);

//   const pickImage = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

//     if (status !== "granted") {
//       Alert.alert(
//         "Permission Denied",
//         "You need to grant permissions to upload images."
//       );
//       return;
//     }

//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ["images"], // Images only
//       allowsEditing: true, // Allow user to crop the image
//       selectionLimit: 5,
//       quality: 1, // High-quality image
//     });

//     if (!result.canceled) {
//       setImage(result.assets[0].uri); // Save the image URI
//       setResult(result.assets[0]);
//     }
//   };

//   const uploadImage = async () => {
//     if (image.length === 0) {
//       Alert.alert("No Images Selected", "Please select images to upload.");
//       return;
//     }
//     setMultimagesResult((prev) => [...prev, result]);

//     // try {
//     //   const response = await fetch("https://your-backend-api.com/upload", {
//     //     method: "POST",
//     //     headers: {
//     //       "Content-Type": "multipart/form-data",
//     //     },
//     //     body: formData,
//     //   });

//     //   const data = await response.json();

//     //   if (response.ok) {
//     //     Alert.alert("Upload Successful", "Your photo has been uploaded.");
//     //     console.log("Response from server:", data);
//     //   } else {
//     //     console.error("Upload failed:", data);
//     //     Alert.alert(
//     //       "Upload Failed",
//     //       "An error occurred while uploading the photo."
//     //     );
//     //   }
//     // } catch (error) {
//     //   console.error("Error uploading image:", error);
//     //   Alert.alert(
//     //     "Upload Failed",
//     //     "An error occurred while uploading the photo."
//     //   );
//     // } finally {
//     //   setUploading(false);
//     // }
//   };

//   // const [products, setProducts] = useState([
//   //   {
//   //     id: "1",
//   //     name: "Chicken Shawarma",
//   //     description: "Delicious chicken shawarma",
//   //     price: 55,
//   //     stock: 998,
//   //     category: "Shawarma",
//   //     photo: "https://example.com/chicken.jpg",
//   //   },
//   //   {
//   //     id: "2",
//   //     name: "Paneer Shawarma",
//   //     description: "Tasty paneer shawarma",
//   //     price: 55,
//   //     stock: 998,
//   //     category: "Shawarma",
//   //     photo: "https://example.com/paneer.jpg",
//   //   },
//   //   {
//   //     id: "3",
//   //     name: "Kurkure Chat",
//   //     description: "Spicy Kurkure Chat",
//   //     price: 35,
//   //     stock: 999,
//   //     category: "Chat",
//   //     photo: "https://example.com/kurkure.jpg",
//   //   },
//   //   {
//   //     id: "4",
//   //     name: "Lays Chat",
//   //     description: "Crispy Lays Chat",
//   //     price: 35,
//   //     stock: 999,
//   //     category: "Chat",
//   //     photo: "https://example.com/lays.jpg",
//   //   },
//   // ]);

//   //for manaage-modal

//   const openModal = (product, index) => {
//     setSelectedProductIndex(index);
//     setEditedProduct({ ...product });
//     setModalVisible(true);
//   };
//   const closeModal = () => {
//     setModalVisible(false);
//     setSelectedProductIndex(null);
//     setEditedProduct({});
//   };

//   const openViewphotoModal = (product, index) => {
//     setSelectedProductIndex(index);
//     setEditedProduct({ ...product });
//     setViewPhotos(true);
//   };

//   const closeViewPhotoModal = () => {
//     setSelectedProductIndex(null);
//     setEditedProduct({});
//     setViewPhotos(false);
//   };
//   const saveChanges = () => {
//     const updatedProducts = [...products];
//     updatedProducts[selectedProductIndex] = editedProduct;
//     setProducts(updatedProducts);
//     closeModal();
//   };
//   const handleInputChange = (field, value) => {
//     setEditedProduct((prev) => ({ ...prev, [field]: value }));
//   };

//   //for add-modal
//   const setAddProducts = async () => {
//     try {
//       const response = await fetch(addurl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name: "New Product",
//           description: "New Product Description",
//           price: 0,
//           stock: 0,
//           category: "New Category",
//           photo: "https://example.com/new-product.jpg",
//         }),
//       });
//       const data = await response.json();
//       console.log(data);
//     } catch (error) {
//       console.log("Error fetching data", error);
//     }
//   };
//   const addNewProduct = () => {
//     if (
//       !editedProduct.name ||
//       !editedProduct.price ||
//       !editedProduct.category
//     ) {
//       alert("Please fill out all required fields!");
//       return;
//     }

//     // Perform the API request to add the product
//     console.log("New Product:", editedProduct);
//     // Clear the fields after successful addition
//     setEditedProduct({});
//     closeAddModal();
//   };
//   const closeAddModal = () => {
//     setAddModalVisible(false);
//   };

//   //for add-image-modal
//   const openImageModal = () => {
//     setAddImageModalVisible(true);
//   };

//   const closeImageModal = () => {
//     setAddImageModalVisible(false);
//   };

//   const renderHeader = () => (
//     <View style={styles.headerRow}>
//       <Text style={[styles.photoCell, styles.headerText]}>Photo</Text>
//       <Text style={[styles.nameCell, styles.headerText]}>Name </Text>
//       <Text style={[styles.headerCell, styles.headerText]}>Action</Text>
//     </View>
//   );
//   const renderProductItem = ({ item, index }) => (
//     <View style={styles.row}>
//       <TouchableOpacity
//         onPress={() => openViewphotoModal(item, index)}
//         style={styles.photoCell}
//       >
//         <Image
//           source={{ uri: photos[index] }}
//           style={styles.image}
//           resizeMode="contain"
//         />
//       </TouchableOpacity>
//       <Text style={[styles.nameCell, styles.text]}>{item.name}</Text>
//       <TouchableOpacity
//         className="ms-3 mr-1 my-8"
//         style={[styles.headerCell, styles.manageButton]}
//         onPress={() => openModal(item, index)}
//       >
//         <Text style={styles.buttonText}>Manage</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.tableHeader}>P R O D U C T S</Text>
//       <TouchableOpacity
//         style={styles.addButton}
//         onPress={() => {
//           setAddModalVisible(true);
//         }}
//       >
//         <Text style={styles.addButtonText}>+</Text>
//       </TouchableOpacity>

//       <FlatList
//         data={products}
//         keyExtractor={(item) => item._id}
//         renderItem={renderProductItem}
//         ListHeaderComponent={renderHeader}
//         // pagingEnabled={true}
//         // initialNumToRender={5}
//       />

//       {selectedProductIndex !== null && (
//         <Modal
//           animationType="fade"
//           transparent={true}
//           visible={viewPhotos}
//           onRequestClose={closeViewPhotoModal}
//         >
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <Text style={styles.modalHeader}>View Your Photo</Text>
//               <TouchableOpacity
//                 onPress={closeViewPhotoModal}
//                 style={styles.closeButton}
//               >
//                 <Text style={styles.closeButtonText}>X</Text>
//               </TouchableOpacity>

//               {/* Show Selected Image */}
//               <View className="flex justify-center items-center">
//                 {image && (
//                   <Image
//                     source={{ uri: photos[index] }}
//                     style={styles.viewImage}
//                     resizeMode="contain"
//                   />
//                 )}
//               </View>
//             </View>
//           </View>
//         </Modal>
//       )}

//       {selectedProductIndex !== null && (
//         // MANAGE MODEL SECTION
//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={modalVisible}
//           onRequestClose={closeModal}
//         >
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <TouchableOpacity>
//                 <Image source={icons.deleteIcon} className="size-8 absolute" />
//               </TouchableOpacity>
//               <Text style={styles.modalHeader}>Manage Product</Text>
//               <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
//                 <Text style={styles.closeButtonText}>X</Text>
//               </TouchableOpacity>
//               {Object.keys(editedProduct).map((key) => {
//                 //Marker
//                 if (
//                   key === "name" ||
//                   key === "description" ||
//                   key === "price" ||
//                   key === "stock" ||
//                   key === "category" ||
//                   key === "photos.url"
//                 ) {
//                   return (
//                     <View key={key} style={styles.inputRow}>
//                       <Text style={styles.inputLabel}>{key}</Text>
//                       <TextInput
//                         style={styles.input}
//                         value={String(editedProduct[key])}
//                         onChangeText={(value) => handleInputChange(key, value)}
//                       />
//                     </View>
//                   );
//                 }
//               })}
//               <View style={styles.inputRow}>
//                 <Text className="font-bold align-self-center">
//                   Select Photo
//                 </Text>

//                 <TouchableOpacity
//                   className="mx-4 border-2 ms-10 border-blue-700 rounded-3xl"
//                   onPress={openImageModal}
//                 >
//                   <Text style={styles.clickText}>CLICK HERE</Text>
//                 </TouchableOpacity>
//               </View>

//               <Button title="Save" onPress={saveChanges} />
//             </View>
//           </View>
//         </Modal>
//       )}

//       {addModalVisible && (
//         // ADD PRODUCT MODAL SECTION
//         <Modal
//           animationType="fade"
//           transparent={true}
//           visible={addModalVisible}
//           onRequestClose={closeAddModal}
//         >
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               {/* Modal Header */}
//               <Text style={styles.modalHeader}>Add Product</Text>

//               {/* Close Button */}
//               <TouchableOpacity
//                 onPress={closeAddModal}
//                 style={styles.closeButton}
//               >
//                 <Text style={styles.closeButtonText}>X</Text>
//               </TouchableOpacity>

//               {/* Input Fields for New Product */}
//               <View style={styles.inputRow}>
//                 <Text style={styles.inputLabel}>Name</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Enter product name"
//                   value={editedProduct.name || ""}
//                   onChangeText={(value) => handleInputChange("name", value)}
//                 />
//               </View>

//               <View style={styles.inputRow}>
//                 <Text style={styles.inputLabel}>Description</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Enter product description"
//                   value={editedProduct.description || ""}
//                   onChangeText={(value) =>
//                     handleInputChange("description", value)
//                   }
//                 />
//               </View>

//               <View style={styles.inputRow}>
//                 <Text style={styles.inputLabel}>Price</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Enter product price"
//                   keyboardType="numeric"
//                   value={String(editedProduct.price || "")}
//                   onChangeText={(value) => handleInputChange("price", value)}
//                 />
//               </View>

//               <View style={styles.inputRow}>
//                 <Text style={styles.inputLabel}>Stock</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Enter stock quantity"
//                   keyboardType="numeric"
//                   value={String(editedProduct.stock || "")}
//                   onChangeText={(value) => handleInputChange("stock", value)}
//                 />
//               </View>

//               <View style={styles.inputRow}>
//                 <Text style={styles.inputLabel}>Category</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Enter product category"
//                   value={editedProduct.category || ""}
//                   onChangeText={(value) => handleInputChange("category", value)}
//                 />
//               </View>

//               <View style={styles.inputRow}>
//                 <Text style={styles.inputLabel}>Select Photo</Text>

//                 {/* Add Image Button */}

//                 <View style={styles.clickMeButton}>
//                   <TouchableOpacity
//                     className="border-2 py-1 border-blue-700 rounded-3xl"
//                     onPress={openImageModal}
//                   >
//                     <Text style={styles.clickText}>CLICK HERE</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>

//               {/* Save Button */}
//               <Button title="Add Product" onPress={addNewProduct} />
//             </View>
//           </View>
//         </Modal>
//       )}

//       {addImageModalVisible && (
//         <Modal
//           animationType="fade"
//           transparent={true}
//           visible={addImageModalVisible}
//           onRequestClose={closeImageModal}
//         >
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <Text style={styles.modalHeader}>View Your Photo</Text>
//               <TouchableOpacity
//                 onPress={closeImageModal}
//                 style={styles.closeButton}
//               >
//                 <Text style={styles.closeButtonText}>X</Text>
//               </TouchableOpacity>

//               {/* Show Selected Image */}
//               <View className="flex justify-center items-center">
//                 {image && (
//                   <Image
//                     source={{ uri: image }}
//                     style={styles.pickImage}
//                     resizeMode="contain"
//                   />
//                 )}
//               </View>

//               <TouchableOpacity
//                 className="bg-orange-300 my-5 w-2/3 mx-auto rounded-xl"
//                 onPress={pickImage}
//               >
//                 <Text className="font-bold text-xl text-center py-2">
//                   CHOOSE PHOTO
//                 </Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 className="bg-green-300 w-2/3 mx-auto rounded-xl"
//                 onPress={uploadImage}
//               >
//                 <Text className="font-bold text-xl text-center py-2">
//                   UPLOAD PHOTO
//                 </Text>
//               </TouchableOpacity>

//               {/* Show Loader During Upload */}
//               {uploading && <ActivityIndicator size="large" color="#0000ff" />}
//             </View>
//           </View>
//         </Modal>
//       )}

//       <Spacer height={60} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: "#fff",
//   },
//   tableHeader: {
//     fontSize: 24,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 10,
//   },
//   headerRow: {
//     flexDirection: "row",
//     backgroundColor: "#f0f0f0",
//     paddingVertical: 10,
//   },
//   headerCell: {
//     flex: 1.3,
//     textAlign: "center",
//   },
//   headerText: {
//     fontWeight: "bold",
//     fontSize: 16,
//   },
//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 1,
//     borderBottomWidth: 1,
//     borderColor: "#ccc",
//   },
//   image: {
//     width: 80, // Increased width
//     height: 80, // Increased height
//     borderRadius: 10,
//   },
//   viewImage: {
//     width: 300,
//     borderRadius: 10,
//     alignItems: "center",
//   },
//   pickImage: {
//     width: 300, // Increased width
//     height: 300, // Increased height
//     borderRadius: 10,
//     alignItems: "center",
//   },
//   photoCell: {
//     flex: 1.7,
//     textAlign: "center",
//   },
//   nameCell: {
//     flex: 2,
//     textAlign: "center",
//   },
//   text: {
//     textAlign: "center",
//     fontSize: 16,
//   },
//   manageButton: {
//     backgroundColor: "#007BFF",
//     paddingVertical: 10,
//     marginStart: 20,
//     borderRadius: 5,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 14,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//   },
//   clickMeButton: {
//     flex: 2,
//   },
//   modalContent: {
//     backgroundColor: "#fff",
//     padding: 16,
//     borderRadius: 10,
//     width: "92%",
//   },
//   modalHeader: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 10,
//     textAlign: "center",
//   },
//   inputRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   clickMeRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 20,
//   },
//   inputLabel: {
//     flex: 1,
//     fontWeight: "bold",
//     textAlign: "right",
//     marginRight: 10,
//   },
//   input: {
//     flex: 2,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//     padding: 5,
//     marginVertical: 3,
//   },
//   addButton: {
//     position: "absolute",
//     top: 10,
//     right: 16,
//     backgroundColor: "#ff6347",
//     width: 36,
//     height: 36,
//     borderRadius: 28,
//     elevation: 5,
//   },
//   addButtonText: {
//     color: "white",
//     fontSize: 24,
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   clickText: {
//     color: "blue",
//     textAlign: "center",
//     fontSize: 12,
//     fontWeight: "bold",
//     paddingHorizontal: 10,
//     // paddingVertical: 3,
//   },
//   closeButton: {
//     backgroundColor: "#666666",
//     width: 30,
//     height: 30,
//     borderRadius: 28,
//     justifyContent: "center",
//     position: "absolute",
//     top: 13,
//     right: 13,
//   },
//   closeButtonText: {
//     color: "white",
//     fontSize: 12,
//     fontWeight: "bold",
//     textAlign: "center",
//   },
// });

// export default ProductTable;
