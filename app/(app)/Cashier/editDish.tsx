import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
} from "react-native";
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

  // Mapear tus categorías a textos más descriptivos (opcional)
  // Ajusta según tu preferencia o tu BD
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

  // Función para seleccionar imagen y subirla a Firebase Storage
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
      router.back();
    } catch (error) {
      console.error("Error al guardar el plato:", error);
      Alert.alert("Error", "No se pudo guardar el plato.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Título principal y subtítulo */}
      <Text style={styles.title}>Add Dish</Text>
      <Text style={styles.subtitle}>to your menu</Text>

      {/* Nombre del plato */}
      <Text style={styles.label}>Name of your dish</Text>
      <TextInput
        placeholder="Name of your dish"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      {/* Precio */}
      <Text style={styles.label}>Price</Text>
      {/* Contenedor para el símbolo $ + input */}
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

      {/* Descripción */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />

      {/* Categoría (Role) */}
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

      {/* Segunda fila para la cámara y el botón + */}
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

      {/* Vista previa de la imagen si se selecciona */}
      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          style={styles.previewImage}
          resizeMode="cover"
        />
      )}

      {/* Botón para guardar/agregar plato */}
      <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
        <Text style={styles.addButtonText}>Add dish</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditDish;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 40, // Ajusta según tu preferencia
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 0,
    color: "#000",
  },
  subtitle: {
    fontSize: 16,
    color: "#000",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 14,
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
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
