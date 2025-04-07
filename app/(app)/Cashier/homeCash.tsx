import React, { useContext } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { DataContext } from "../../../context/DataContext";

const HomeCash = () => {
  const { dishes, deleteDish } = useContext(DataContext);
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Título y subtítulo */}
      <Text style={styles.title}>Your Menu</Text>
      <Text style={styles.subtitle}>Modify, add or delete items from your menu</Text>

      {/* Lista de platos */}
      <FlatList
        data={dishes}
        keyExtractor={(item) => item.id || ""}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Info principal del plato */}
            <View style={styles.leftSection}>
              <Text style={styles.dishName}>{item.name}</Text>

              {/* Categoría como 'Main Course', 'Dessert', etc. 
                  Si quisieras traducir la categoría interna a un texto más amigable, podrías usar un objeto mapping */}
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>

              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.price}>${item.price}</Text>

              {/* Botones de editar y eliminar */}
              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => router.push(`/Cashier/editDish?id=${item.id}`)}
                >
                  <Text style={styles.actionButtonText}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => item.id && deleteDish(item.id)}
                >
                  <Text style={styles.actionButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Imagen del plato */}
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.dishImage} />
            ) : (
              <View style={styles.placeholderImage} />
            )}
          </View>
        )}
      />

      {/* Botones inferiores */}
      <View style={styles.footerButtons}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/Cashier/editDish")}
        >
          <Text style={styles.buttonText}>+ Add new dish</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.readyButton}>
          <Text style={styles.buttonText}>My menu is ready!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeCash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5", // Fondo gris claro para resaltar las tarjetas
    paddingHorizontal: 20,
    paddingTop: 40, // Ajusta según prefieras
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#777",
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,

    // Sombra (iOS)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    // Sombra (Android)
    elevation: 3,
  },
  leftSection: {
    flex: 1,
    paddingRight: 10, // algo de espacio entre texto e imagen
  },
  dishName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#000",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  categoryText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  description: {
    color: "#777",
    fontSize: 14,
    marginBottom: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 12,
  },
  dishImage: {
    width: 80,
    height: 80,
    borderRadius: 40, // Para que sea circular (o semiredondo)
    alignSelf: "center",
  },
  // Por si no hay imagen, un placeholder con fondo gris
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ccc",
    alignSelf: "center",
  },
  actions: {
    flexDirection: "row",
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  editButton: {
    backgroundColor: "#f0ad4e", // un naranja/amarillo suave, ajústalo si gustas
  },
  deleteButton: {
    backgroundColor: "#d9534f", // un rojo suave, ajústalo si gustas
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  addButton: {
    flex: 1,
    backgroundColor: "#000",
    paddingVertical: 15,
    borderRadius: 8,
    marginRight: 10,
    alignItems: "center",
  },
  readyButton: {
    flex: 1,
    backgroundColor: "#000",
    paddingVertical: 15,
    borderRadius: 8,
    marginLeft: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
