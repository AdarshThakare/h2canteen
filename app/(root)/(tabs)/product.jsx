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
} from "react-native";

import icons from "../../../constants/icons";

const url = "https://primebay-backend.onrender.com/api/v1/product/latest";
const Spacer = ({ height = 10 }) => <View style={{ height }} />;

const addurl = "https://primebay-backend.onrender.com/api/v1/product/app/new";
const ProductTable = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProductIndex, setSelectedProductIndex] = useState(null);

  const [products, setProducts] = useState([]);
  const [photos, setPhotos] = useState("");
  const [editedProduct, setEditedProduct] = useState({});
  const [addModalVisible, setAddModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setProducts(data.products);
        const photoUrls = products.map((products) => products.photos[0]?.url);
        setPhotos(photoUrls);
      } catch (error) {
        console.log("Error fetching data", error);
      }
    };
    fetchData();
  }, [photos]);
  // const [products, setProducts] = useState([
  //   {
  //     id: "1",
  //     name: "Chicken Shawarma",
  //     description: "Delicious chicken shawarma",
  //     price: 55,
  //     stock: 998,
  //     category: "Shawarma",
  //     photo: "https://example.com/chicken.jpg",
  //   },
  //   {
  //     id: "2",
  //     name: "Paneer Shawarma",
  //     description: "Tasty paneer shawarma",
  //     price: 55,
  //     stock: 998,
  //     category: "Shawarma",
  //     photo: "https://example.com/paneer.jpg",
  //   },
  //   {
  //     id: "3",
  //     name: "Kurkure Chat",
  //     description: "Spicy Kurkure Chat",
  //     price: 35,
  //     stock: 999,
  //     category: "Chat",
  //     photo: "https://example.com/kurkure.jpg",
  //   },
  //   {
  //     id: "4",
  //     name: "Lays Chat",
  //     description: "Crispy Lays Chat",
  //     price: 35,
  //     stock: 999,
  //     category: "Chat",
  //     photo: "https://example.com/lays.jpg",
  //   },
  // ]);

  const openModal = (product, index) => {
    setSelectedProductIndex(index);
    setEditedProduct({ ...product });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedProductIndex(null);
    setEditedProduct({});
  };

  const saveChanges = () => {
    const updatedProducts = [...products];
    updatedProducts[selectedProductIndex] = editedProduct;
    setProducts(updatedProducts);
    closeModal();
  };

  const handleInputChange = (field, value) => {
    setEditedProduct((prev) => ({ ...prev, [field]: value }));
  };

  const renderProductItem = ({ item, index }) => (
    <View style={styles.row}>
      <View style={styles.cell}>
        <Image
          source={{ uri: photos[index] }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <Text style={[styles.cell, styles.text]}>{item.name}</Text>
      <TouchableOpacity
        className="ms-3 mr-1 my-8"
        style={[styles.cell, styles.manageButton]}
        onPress={() => openModal(item, index)}
      >
        <Text style={styles.buttonText}>Manage</Text>
      </TouchableOpacity>
    </View>
  );

  const setAddProducts = async () => {
    try {
      const response = await fetch(addurl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "New Product",
          description: "New Product Description",
          price: 0,
          stock: 0,
          category: "New Category",
          photo: "https://example.com/new-product.jpg",
        }),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log("Error fetching data", error);
    }
  };

  const addNewProduct = () => {
    if (
      !editedProduct.name ||
      !editedProduct.price ||
      !editedProduct.category
    ) {
      alert("Please fill out all required fields!");
      return;
    }

    // Perform the API request to add the product
    console.log("New Product:", editedProduct);
    // Clear the fields after successful addition
    setEditedProduct({});
    closeModal();
  };

  const renderHeader = () => (
    <View style={styles.headerRow}>
      <Text style={[styles.headerCell, styles.headerText]}>Photo</Text>
      <Text style={[styles.headerCell, styles.headerText]}>Name </Text>
      <Text style={[styles.headerCell, styles.headerText]}>Action</Text>
    </View>
  );
  return (
    <View style={styles.container}>
      <Text style={styles.tableHeader}>P R O D U C T S</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setModalVisible(true);
          setAddProducts();
        }}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={renderProductItem}
        ListHeaderComponent={renderHeader}
        // pagingEnabled={true}
        // initialNumToRender={5}
      />

      {selectedProductIndex !== null && (
        // MANAGE MODEL SECTION
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity>
                <Image source={icons.deleteIcon} className="size-8 absolute" />
              </TouchableOpacity>
              <Text style={styles.modalHeader}>Manage Product</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
              {Object.keys(editedProduct).map((key) => {
                if (
                  key === "name" ||
                  key === "description" ||
                  key === "price" ||
                  key === "stock" ||
                  key === "category" ||
                  key === "photos.url"
                ) {
                  return (
                    <View key={key} style={styles.inputRow}>
                      <Text style={styles.inputLabel}>{key}</Text>
                      <TextInput
                        style={styles.input}
                        value={String(editedProduct[key])}
                        onChangeText={(value) => handleInputChange(key, value)}
                      />
                    </View>
                  );
                }
              })}
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Photo URL:</Text>
                <TextInput
                  style={styles.input}
                  value={editedProduct.photo}
                  onChangeText={(value) => handleInputChange("photo", value)}
                />
              </View>
              <Button title="Save" onPress={saveChanges} />
            </View>
          </View>
        </Modal>
      )}

      {modalVisible && (
        // ADD PRODUCT MODAL SECTION
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Modal Header */}
              <Text style={styles.modalHeader}>Add Product</Text>

              {/* Close Button */}
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>

              {/* Input Fields for New Product */}
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Name:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter product name"
                  value={editedProduct.name || ""}
                  onChangeText={(value) => handleInputChange("name", value)}
                />
              </View>

              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Description:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter product description"
                  value={editedProduct.description || ""}
                  onChangeText={(value) =>
                    handleInputChange("description", value)
                  }
                />
              </View>

              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Price:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter product price"
                  keyboardType="numeric"
                  value={String(editedProduct.price || "")}
                  onChangeText={(value) => handleInputChange("price", value)}
                />
              </View>

              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Stock:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter stock quantity"
                  keyboardType="numeric"
                  value={String(editedProduct.stock || "")}
                  onChangeText={(value) => handleInputChange("stock", value)}
                />
              </View>

              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Category:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter product category"
                  value={editedProduct.category || ""}
                  onChangeText={(value) => handleInputChange("category", value)}
                />
              </View>

              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Photo URL:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter product photo URL"
                  value={editedProduct.photo || ""}
                  onChangeText={(value) => handleInputChange("photo", value)}
                />
              </View>

              {/* Save Button */}
              <Button title="Add Product" onPress={addNewProduct} />
            </View>
          </View>
        </Modal>
      )}

      <Spacer height={60} />
    </View>
  );
};

const styles = StyleSheet.create({
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
  cell: {
    flex: 1,
    textAlign: "center",
    alignItems: "center",
  },
  image: {
    width: 80, // Increased width
    height: 80, // Increased height
    borderRadius: 10,
  },
  text: {
    textAlign: "center",
    fontSize: 16,
  },
  manageButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
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
  addButtonText: {
    color: "white",
    fontSize: 24,
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
  closeButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ProductTable;
