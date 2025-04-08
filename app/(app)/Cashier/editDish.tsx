import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import Modal from "react-native-modal";
import { useRouter, useLocalSearchParams } from "expo-router";
import { DataContext } from "../../../context/DataContext";

const EditDish = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("DataContext is undefined. Ensure the provider is correctly set up.");
  }

  const { addDish, updateDish, dishes, selectImage } = context;
  const router = useRouter();
  const params = useLocalSearchParams();

  const existingDish = dishes?.find((d) => d.id === params.id) || null;

  const categories: ("entrada" | "fuerte" | "postre" | "bebida")[] = [
    "entrada",
    "fuerte",
    "postre",
    "bebida",
  ];
  const categoryLabels: Record<string, string> = {
    entrada: "Starter Dish",
    fuerte: "Main Course",
    postre: "Dessert",
    bebida: "Drink",
  };

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] =
    useState<"entrada" | "fuerte" | "postre" | "bebida">("entrada");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false); // ← NUEVO

  useEffect(() => {
    if (existingDish) {
      setName(existingDish.name || "");
      setPrice(existingDish.price?.toString() || "");
      setDescription(existingDish.description || "");
      setCategory(existingDish.category || "entrada");
      setImageUrl(existingDish.imageUrl || null);
      setImagePath(existingDish.imagePath || null);
    }
  }, [existingDish]);

  const pickImage = async () => {
    const newImage = await selectImage();
    if (newImage) {
      setImageUrl(newImage.imageUrl);
      setImagePath(newImage.imagePath);
    }
  };

  const handleSubmit = async () => {
    if (!name || !price || !description) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    try {
      const dishData = {
        name,
        price: Number(price),
        description,
        category,
        imageUrl: imageUrl || undefined,
        imagePath: imagePath || undefined,
      };

      if (params.id) {
        await updateDish(params.id as string, dishData);
      } else {
        await addDish(dishData);
      }

      // ← MOSTRAR MODAL
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.back();
      }, 2000);

    } catch (error) {
      console.error("Error al guardar el plato:", error);
      Alert.alert("Error", "No se pudo guardar el plato.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Dish</Text>
      <Text style={styles.subtitle}>to your menu</Text>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.form}>
        <Text style={styles.label}>Name of your dish</Text>
        <TextInput
          placeholder="Name of your dish"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <Text style={styles.label}>Price</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.priceSymbol}>$</Text>
          <TextInput
            placeholder="0"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            style={[styles.input, styles.priceInput]}
          />
        </View>

        <Text style={styles.label}>Description</Text>
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
        />

        <Text style={styles.label}>Role</Text>
        {categories.map((cat) => {
          const isSelected = category === cat;
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => setCategory(cat)}
              style={[
                styles.roleOption,
                isSelected && styles.roleOptionSelected,
              ]}
            >
              <Text
                style={[
                  styles.roleOptionText,
                  isSelected && styles.roleOptionTextSelected,
                ]}
              >
                {categoryLabels[cat]}
              </Text>
            </TouchableOpacity>
          );
        })}

        <Text style={styles.label}>Role</Text>
        <View style={styles.iconRow}>
          <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
            <Text style={styles.iconText}>📷</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Alert.alert("Add something else here!")}
            style={styles.iconButton}
          >
            <Text style={styles.iconText}>+</Text>
          </TouchableOpacity>
        </View>

        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={styles.previewImage}
            resizeMode="cover"
          />
        )}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
        <Text style={styles.addButtonText}>Add dish</Text>
      </TouchableOpacity>

      {/* MODAL DE ÉXITO */}
      <Modal isVisible={showSuccess} animationIn="bounceIn" animationOut="bounceOut" backdropOpacity={0.5}>
        <View style={styles.modalContent}>
          <Text style={styles.successIcon}>✅</Text>
          <Text style={styles.successText}>Dish created!</Text>
        </View>
      </Modal>
    </View>
  );
};

export default EditDish;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  scroll: {
    flex: 1,
  },
  form: {
    paddingBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#000",
    fontFamily: "Inter-Regular",
  },
  subtitle: {
    fontSize: 26,
    color: "#000",
    marginBottom: 30,
    fontFamily: "Inter-Regular",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
    fontFamily: "Inter-Regular",
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 14,
    fontFamily: "Inter-Regular",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  priceSymbol: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 8,
    color: "#000",
    fontFamily: "Inter-Regular",
  },
  priceInput: {
    flex: 1,
    marginBottom: 0,
  },
  roleOption: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  roleOptionSelected: {
    backgroundColor: "#000",
  },
  roleOptionText: {
    textAlign: "center",
    color: "#000",
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Inter-Regular",
  },
  roleOptionTextSelected: {
    color: "#fff",
  },
  iconRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  iconButton: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    width: 50,
    height: 50,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 20,
    fontFamily: "Inter-Regular",
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#000",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Inter-Regular",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  successIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  successText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    fontFamily: "Inter-Regular",
  },
});
