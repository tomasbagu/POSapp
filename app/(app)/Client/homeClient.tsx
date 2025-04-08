import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useOrder } from "@/context/OrderContext"; // Ajusta la ruta si es necesario

// Ajusta las categorías según tu mapeo
const CATEGORIES = ["Main Course", "Dessert", "Drink"];

// Función opcional para mapear los textos a tus categorías reales
const mapCategoryToFirestore = (label: string) => {
  switch (label) {
    case "Main Course":
      return "fuerte";
    case "Dessert":
      return "postre";
    case "Drink":
      return "bebida";
    default:
      return "";
  }
};

const ClientHome = () => {
  const router = useRouter();
  // Obtenemos 'dishes' y 'addToCart' del OrderContext
  const { dishes, addToCart } = useOrder();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filtrar platos según la categoría seleccionada
  const firestoreCategory = selectedCategory
    ? mapCategoryToFirestore(selectedCategory)
    : null;

  const filteredDishes = firestoreCategory
    ? dishes.filter((dish) => dish.category === firestoreCategory)
    : dishes;

  const renderDish = ({ item }: { item: any }) => {
    return (
      <View style={styles.card}>
        <View style={styles.leftSection}>
          <Text style={styles.dishName}>{item.name}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{item.category}</Text>
          </View>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.price}>${item.price?.toFixed(2)}</Text>
        </View>

        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.dishImage} />
        ) : (
          <View style={styles.dishImagePlaceholder} />
        )}

        {/* Botón "+" para añadir al carrito */}
        <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Botón de carrito arriba a la derecha */}
      <TouchableOpacity style={styles.cartIconContainer} onPress={() => router.push("/(app)/Client/cart")}>
        <Text style={styles.cartIcon}>🛒</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>We have a great variety of dishes for you!</Text>

      {/* Filtros */}
      <View style={styles.categoryRow}>
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                isSelected && styles.categoryButtonSelected,
              ]}
              onPress={() => setSelectedCategory(isSelected ? null : cat)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  isSelected && styles.categoryButtonTextSelected,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Lista de platos */}
      <FlatList
        data={filteredDishes}
        keyExtractor={(item) => item.id}
        renderItem={renderDish}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default ClientHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  cartIconContainer: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
  },
  cartIcon: {
    fontSize: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 6,
    marginTop: 10, // Mover un poco hacia abajo para no chocar con el ícono
  },
  subtitle: {
    fontSize: 16,
    color: "#000",
    marginBottom: 20,
  },
  categoryRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryButtonSelected: {
    backgroundColor: "#000",
  },
  categoryButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
  },
  categoryButtonTextSelected: {
    color: "#fff",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  leftSection: {
    flex: 1,
    marginRight: 10,
  },
  dishName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 6,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#000",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 6,
  },
  categoryBadgeText: {
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
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  dishImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  dishImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ccc",
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#000",
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
