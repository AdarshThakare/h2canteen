// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   Button,
//   Image,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";

// export default function PhotoUpload() {
//   const [image, setImage] = useState(null); // Store the selected image URI
//   const [uploading, setUploading] = useState(false); // Track upload status

//   // Function to pick an image
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
//     }
//   };

//   // Function to upload the image
//   const uploadImage = async () => {
//     if (!image) {
//       Alert.alert("No Image Selected", "Please select an image to upload.");
//       return;
//     }

//     setUploading(true);

//     const formData = new FormData();
//     formData.append("file", {
//       uri: image,
//       name: "photo.jpg", // File name
//       type: "image/jpeg", // MIME type
//     });

//     try {
//       const response = await fetch("https://your-backend-api.com/upload", {
//         method: "POST",
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//         body: formData,
//       });

//       const data = await response.json();

//       if (response.ok) {
//         Alert.alert("Upload Successful", "Your photo has been uploaded.");
//         console.log("Response from server:", data);
//       } else {
//         console.error("Upload failed:", data);
//         Alert.alert(
//           "Upload Failed",
//           "An error occurred while uploading the photo."
//         );
//       }
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       Alert.alert(
//         "Upload Failed",
//         "An error occurred while uploading the photo."
//       );
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Upload a Photo</Text>

//       {/* Show Selected Image */}
//       {image && <Image source={{ uri: image }} style={styles.image} />}

//       {/* Buttons for Picking and Uploading */}
//       <View style={styles.buttonContainer}>
//         <Button title="Pick an Image" onPress={pickImage} />
//         <Button title="Upload Image" onPress={uploadImage} />
//       </View>

//       {/* Show Loader During Upload */}
//       {uploading && <ActivityIndicator size="large" color="#0000ff" />}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 20,
//   },
//   title: {
//     fontSize: 20,
//     marginBottom: 20,
//   },
//   image: {
//     width: 200,
//     height: 200,
//     resizeMode: "cover",
//     marginVertical: 20,
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     width: "100%",
//   },
// });
