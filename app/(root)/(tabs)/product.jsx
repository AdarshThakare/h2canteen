import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Button,
  ActivityIndicator,
  Dimensions,
  Alert,
  ToastAndroid,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import icons from "../../../constants/icons";
import FastImage from "react-native-fast-image";

const Spacer = ({ height = 10 }) => <View style={{ height }} />;

const geturl =
  "https://primebay-backend.onrender.com/api/v1/product/app/admin-products";
const addurl = "https://primebay-backend.onrender.com/api/v1/product/app/new";

const ProductTable = () => {
  //GENERAL STATES
  const [photos, setPhotos] = useState([]); // Array to store selected photos for viewing in view modal
  const [products, setProducts] = useState([]); //for setting value of each product from api
  const [addModalVisible, setAddModalVisible] = useState(false); //for setting modal visibility for add products
  const [imagePickerVisible, setImagePickerVisible] = useState(false); //for setting visibility of the image-picker and uploader modal
  const [manageModalVisible, setManageModalVisible] = useState(false); //for setting visibility of the manage product modal
  const [preManageModalVisible, setPreManageModalVisible] = useState(false);
  const [viewImageVisible, setViewImageVisible] = useState(false);
  const [zoomdImageUri, setZoomedImageUri] = useState("");
  //ADD PRODUCT MODAL STATES
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    category: "",
    photos: [],
  });
  const [savePhotos, setSavePhotos] = useState([]); //Array to store the selected photos outside view modal for sending post request
  const [updateFormData, setUpdateFormData] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    category: "",
    photos: [],
  });
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [updateId, setUpdateId] = useState("");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [image, setImage] = useState([]);

  //GET REQUEST
  useEffect(() => {
    const fetchData = async () => {
      try {
        // console.log("I am running");
        const response = await fetch(geturl);
        const data = await response.json();
        setProducts(data.products);
        const photoUrls = products.map((products) => products.photos[0]?.url);
        setImage(photoUrls);

        // console.log(data.products);
      } catch (error) {
        console.log("Error fetching the data", error);
      }
    };
    fetchData();
  }, [products, image]);

  const onRefreshHandler = () => {
    const fetchData = async () => {
      try {
        console.log("I am running");
        const response = await fetch(geturl);
        const data = await response.json();
        setProducts(data.products);
        // console.log(data.products);
      } catch (error) {
        console.log("Error fetching the data", error);
      }
    };
    fetchData();
  };

  // + Modal Section
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
  //sending the post request with the right data
  const addProductHandler = async () => {
    if (
      !formData.name ||
      !formData.stock ||
      !formData.price ||
      !formData.description ||
      !formData.photos ||
      !formData.category
    ) {
      Alert.alert("Invalid Input", "All fields are required.");
      return;
    }
    setFormData((prev) => ({
      ...prev, // Spread the existing fields
      photos: savePhotos, // Append the new photo
    }));

    console.log(savePhotos);

    const newFormData = new FormData();
    newFormData.append("name", formData.name);
    newFormData.append("price", formData.price);
    newFormData.append("description", formData.description);
    newFormData.append("stock", formData.stock);
    newFormData.append("category", formData.category);
    savePhotos.forEach((photo) => {
      newFormData.append("photos", {
        uri: photo.uri,
        name: photo.name,
        type: photo.type,
      });
    });

    console.log(newFormData);

    try {
      const response = await fetch(addurl, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: newFormData,
      });
      const data = await response.json();

      if (response.ok) {
        Alert.alert("Upload Successful", `Response: Item added successfully.`);
      } else {
        Alert.alert("Upload Failed", "Something went wrong.");
        console.error("Server error:", data);
      }
    } catch (error) {
      console.error("Error uploading data:", error);
      Alert.alert("Error", "Failed to upload data.");
    }
  };

  const inputChangeHandler = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const inputUpdateChangeHandler = (key, value) => {
    setUpdateFormData((prev) => ({ ...prev, [key]: value }));
  };
  //IMAGE PICKER SECTION
  const openImageModal = () => {
    setImagePickerVisible(true);
  };

  const closeImageModal = () => {
    setImagePickerVisible(false);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "You need to grant permissions to upload images."
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], // Images only
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 1, // High-quality image
    });
    console.log(result);
    if (!result.canceled) {
      const selectedPhotos = result.assets.map((asset) => ({
        uri: asset.uri,
        name: asset.fileName || "photo.jpg",
        type: "image/jpeg",
      }));
      if (selectedPhotos.length > 5) {
        Alert.alert("Limit Exceeded", "You can select up to 5 images only.");
      } else {
        setPhotos(selectedPhotos);
        setSavePhotos(selectedPhotos);
      }
    }
  };

  const deleteProductHandler = async (id) => {
    try {
      const delUrl =
        "https://primebay-backend.onrender.com/api/v1/product/app/" + id;
      const response = await fetch(delUrl, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        ToastAndroid.show("Product deleted successfully!", ToastAndroid.SHORT);
      } else {
        ToastAndroid.show("Failed to delete product.", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const renderImage = ({ item }) => (
    <Image source={{ uri: item.uri }} style={styles.corouselImage} />
  );

  const uploadImage = async () => {
    if (photos.length === 0) {
      Alert.alert("No Images Selected", "Please select images to upload.");
      return;
    }

    console.log(savePhotos);
    setPhotos([]);
    setImagePickerVisible(false);
    // setMultimagesResult((prev) => [...prev, result]);
  };

  //View Item Logo Modal
  const openViewImageModal = () => {
    setViewImageVisible(true);
  };

  const closeViewImageModal = () => {
    setViewImageVisible(false);
  };

  //MANAGE PRODUCT MODAL SECTION
  const openManageModal = (item) => {
    setManageModalVisible(true);
    setSelectedProduct(item);
  };

  const closeManageModal = () => {
    setManageModalVisible(false);
  };

  const closePreManageModal = () => {
    setPreManageModalVisible(false);
  };

  const openPreManageModal = () => {
    setPreManageModalVisible(true);
  };

  const handleSelect = (item) => {
    setSelectedProduct(item);
    setUpdateFormData({
      name: item.name,
      price: item.price,
      stock: item.stock,
      description: item.description,
      category: item.category,
      photos: item.photos,
    });
    console.log("Selected Product : ", selectedProduct);
    console.log("Updated Product : ", updateFormData);
  };

  const onSaveHandler = async () => {
    console.log("Selected Product : ", selectedProduct);
    if (
      !updateFormData.name ||
      !updateFormData.stock ||
      !updateFormData.price ||
      !updateFormData.description ||
      !updateFormData.photos ||
      !updateFormData.category
    ) {
      Alert.alert("Invalid Input", "All fields are required.");
      return;
    }
    setUpdateFormData((prev) => ({
      ...prev, // Spread the existing fields
      photos: savePhotos, // Append the new photo
    }));

    const newFormData = new FormData();
    newFormData.append("name", updateFormData.name);
    newFormData.append("price", updateFormData.price);
    newFormData.append("description", updateFormData.description);
    newFormData.append("stock", updateFormData.stock);
    newFormData.append("category", updateFormData.category);
    savePhotos.forEach((photo) => {
      newFormData.append("photos", {
        uri: photo.uri,
        name: photo.name,
        type: photo.type,
      });
    });

    console.log(newFormData);
    // const updateUrl =
    //   "https://primebay-backend.onrender.com/api/v1/product/app/" + "";
    // try {
    //   const response = await fetch(addurl, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //     body: newFormData,
    //   });
    //   const data = await response.json();

    //   if (response.ok) {
    //     Alert.alert("Upload Successful", `Response: Item Updated Successfully`);
    //   } else {
    //     Alert.alert("Upload Failed", "Something went wrong.");
    //     console.error("Server error:", data);
    //   }
    // } catch (error) {
    //   console.error("Error uploading data:", error);
    //   Alert.alert("Error", "Failed to upload data.");
    // }
  };

  //Item Rendering section
  const renderHeader = () => (
    <View style={styles.headerRow}>
      <Text style={[styles.photoCell, styles.headerText]}>Photo</Text>
      <Text style={[styles.nameCell, styles.headerText]}>Name </Text>
      <Text style={[styles.headerCell, styles.headerText]}>Price</Text>
      <Text style={[styles.headerCell, styles.headerText]}>Bin</Text>
    </View>
  );
  const renderProductItem = ({ item, index }) => (
    <View style={styles.row}>
      <TouchableOpacity
        style={styles.photoCell}
        onPress={() => {
          openViewImageModal();
          setZoomedImageUri(image[index]);
        }}
      >
        <Image
          source={{
            // uri: item.photos[0].url,
            uri: image[index],
          }}
          style={styles.image}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <Text style={[styles.nameCell, styles.text]}>{item.name}</Text>
      {/* <TouchableOpacity
        className="ms-3 mr-1 my-8"
        style={[styles.headerCell, styles.manageButton]}
        onPress={() => {
          handleSelect(item);
          openPreManageModal();
        }}
      >
        <Text style={styles.buttonText}>Manage</Text>
      </TouchableOpacity> */}
      <Text style={[styles.nameCell, styles.text]}>Rs. {item.price}</Text>
      <TouchableOpacity
        onPress={() => {
          handleSelect(item);
          openDeleteModal();
        }}
      >
        <Image source={icons.deleteIcon} className="size-8" />
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={preManageModalVisible}
        closeRequest={closePreManageModal}
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
                Contents of the product you selected will be overwritten. Please
                press 'Proceed' to update the values for this product!
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
                  openManageModal(item);
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
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.refresh} onPress={onRefreshHandler}>
        <Image
          source={icons.refreshIcon}
          className="size-9 absolute left-3 top-2"
        />
      </TouchableOpacity>
      <Text style={styles.tableHeader}>P R O D U C T S</Text>
      <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={renderProductItem}
        ListHeaderComponent={renderHeader}
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        windowSize={4}
        onEndReached={() => {
          <ActivityIndicator size="large" color="#0000ff" />;
        }}
        onEndReachedThreshold={0.5}
      />

      {
        <Modal
          animationType="fade"
          transparent={true}
          visible={viewImageVisible}
          onRequestClose={closeViewImageModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>View Your Photo</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeViewImageModal}
              >
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
              {/* Show Selected Image */}
              <View className="flex justify-center items-center">
                {
                  <Image
                    source={{
                      uri: zoomdImageUri,
                    }}
                    style={styles.viewImage}
                    resizeMode="contain"
                  />
                }
              </View>
            </View>
          </View>
        </Modal>
      }

      {
        // Discount Modal
        selectedProduct && (
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
                      handleSelect(selectedProduct);
                      deleteProductHandler(selectedProduct._id);
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

      {
        // MANAGE MODEL SECTION
        <Modal
          animationType="slide"
          transparent={true}
          visible={manageModalVisible}
          onRequestClose={closeManageModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity>
                <Image source={icons.deleteIcon} className="size-8 absolute" />
              </TouchableOpacity>
              <Text style={styles.modalHeader}>Manage Product</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeManageModal}
              >
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter product name"
                  value={updateFormData.name}
                  onChangeText={(text) => {
                    inputUpdateChangeHandler("name", text);
                  }}
                />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter product description"
                  value={updateFormData.description}
                  onChangeText={(text) => {
                    inputUpdateChangeHandler("description", text);
                  }}
                />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Price</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter product price"
                  keyboardType="numeric"
                  value={updateFormData.price.toString()}
                  onChangeText={(text) => {
                    inputUpdateChangeHandler("price", text);
                  }}
                />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Stock</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter stock quantity"
                  keyboardType="numeric"
                  value={updateFormData.stock.toString()}
                  onChangeText={(text) => {
                    inputUpdateChangeHandler("stock", text);
                  }}
                />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Category</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter product category"
                  value={updateFormData.category}
                  onChangeText={(text) => {
                    inputUpdateChangeHandler("category", text);
                  }}
                />
              </View>
              <View style={styles.inputRow}>
                <Text className="font-bold align-self-center">
                  Select Photo
                </Text>
                <TouchableOpacity
                  className="mx-4 border-2 ms-10 border-blue-700 rounded-3xl"
                  onPress={openImageModal}
                >
                  <Text style={styles.clickText}>CLICK HERE</Text>
                </TouchableOpacity>
              </View>
              <Button title="Save" onPress={onSaveHandler} />
            </View>
          </View>
        </Modal>
      }

      {
        // ADD PRODUCT MODAL SECTION
        <Modal
          animationType="fade"
          transparent={true}
          visible={addModalVisible}
          onRequestClose={closeAddModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Modal Header */}
              <Text style={styles.modalHeader}>Add Product</Text>
              {/* Close Button */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeAddModal}
              >
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
              {/* Input Fields for New Product */}
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter product name"
                  value={formData.name}
                  onChangeText={(text) => {
                    inputChangeHandler("name", text);
                  }}
                />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter product description"
                  value={formData.description}
                  onChangeText={(text) => {
                    inputChangeHandler("description", text);
                  }}
                />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Price</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter product price"
                  keyboardType="numeric"
                  value={formData.price}
                  onChangeText={(text) => {
                    inputChangeHandler("price", text);
                  }}
                />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Stock</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter stock quantity"
                  keyboardType="numeric"
                  value={formData.stock}
                  onChangeText={(text) => {
                    inputChangeHandler("stock", text);
                  }}
                />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Category</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter product category"
                  value={formData.category}
                  onChangeText={(text) => {
                    inputChangeHandler("category", text);
                  }}
                />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Select Photo</Text>
                {/* Add Image Button */}
                <View style={styles.clickMeButton}>
                  <TouchableOpacity
                    className="border-2 py-1 border-blue-700 rounded-3xl"
                    onPress={openImageModal}
                  >
                    <Text style={styles.clickText}>CLICK HERE</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* Save Button */}
              <Button title="Add Product" onPress={addProductHandler} />
            </View>
          </View>
        </Modal>
      }

      {
        <Modal
          animationType="slide"
          transparent={true}
          visible={imagePickerVisible}
          onRequestClose={closeImageModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>View Your Photo</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeImageModal}
              >
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
              {/* Show Selected Image */}
              {/* <View className="flex justify-center items-center">
                {<Image style={styles.pickImage} resizeMode="contain" />}
              </View> */}

              <View className="flex justify-center items-center">
                {photos.length > 0 ? (
                  <FlatList
                    data={photos}
                    renderItem={renderImage}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                  />
                ) : (
                  <Text style={styles.text}>No images selected</Text>
                )}
              </View>
              <TouchableOpacity
                className="bg-orange-300 my-5 w-2/3 mx-auto rounded-xl"
                onPress={pickImage}
              >
                <Text className="font-bold text-xl text-center py-2">
                  CHOOSE PHOTO
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-green-300 w-2/3 mx-auto rounded-xl"
                onPress={uploadImage}
              >
                <Text className="font-bold text-xl text-center py-2">
                  UPLOAD PHOTO
                </Text>
              </TouchableOpacity>
              {/* Show Loader During Upload */}
            </View>
          </View>
        </Modal>
      }

      <Spacer height={60} />
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainerA: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  tableHeader: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
  },
  headerCell: {
    flex: 1,
    textAlign: "center",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  image: {
    width: 80, // Increased width
    height: 80, // Increased height
    borderRadius: 10,
  },
  viewImage: {
    width: 300,
    borderRadius: 10,
    alignItems: "center",
    height: 500,
  },
  pickImage: {
    width: 300, // Increased width
    height: 300, // Increased height
    borderRadius: 10,
    alignItems: "center",
  },
  photoCell: {
    flex: 1.7,
    textAlign: "center",
  },
  nameCell: {
    flex: 2,
    textAlign: "center",
  },
  text: {
    textAlign: "center",
    fontSize: 16,
  },
  manageButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    marginStart: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  clickMeButton: {
    flex: 2,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    width: "92%",
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  clickMeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  inputLabel: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "right",
    marginRight: 10,
  },
  input: {
    flex: 2,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 5,
    marginVertical: 3,
  },
  addButton: {
    position: "absolute",
    top: 10,
    right: 16,
    backgroundColor: "#ff6347",
    width: 36,
    height: 36,
    borderRadius: 28,
    elevation: 5,
  },
  refresh: {
    position: "absolute",
    top: 3,
    left: 16,
    width: 50,
    height: 50,
  },
  addButtonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  clickText: {
    color: "blue",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
    paddingHorizontal: 10,
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
  closeButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  corouselImage: {
    width: Dimensions.get("window").width * 0.8, // Dynamic width based on screen width
    height: Dimensions.get("window").width * 0.6,
    borderRadius: 10,
    marginHorizontal: 10,
    resizeMode: "contain",
  },
});

export default ProductTable;
