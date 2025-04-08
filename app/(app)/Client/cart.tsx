import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useOrder } from "@/context/OrderContext"; // Ajusta la ruta
import { useRouter } from "expo-router";

const Cart = () => {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart } = useOrder();

  // Calcular el total
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Renderizar cada item del carrito
  const renderCartItem = ({ item }: any) => {
    return (
      <View style={styles.card}>
        {/* Sección izquierda */}
        <View style={styles.leftSection}>
          <Text style={styles.dishName}>{item.name}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{item.category}</Text>
          </View>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.price}>
            ${item.price.toFixed(2)} x {item.quantity}
          </Text>
        </View>

        {/* Imagen */}
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.dishImage} />
        ) : (
          <View style={styles.dishImagePlaceholder} />
        )}

        {/* Botones (+/-) */}
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quantityButton, { marginTop: 8 }]}
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Si el carrito está vacío
  if (cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>My 🛒 Cart List</Text>
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <TouchableOpacity
          style={styles.goBackButton}
          onPress={() => router.back()}
        >
          <Text style={styles.goBackButtonText}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Título */}
      <Text style={styles.title}>My 🛒 Cart List</Text>

      {/* Lista de items */}
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        renderItem={renderCartItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Total y botón Order Now */}
      <View style={styles.bottomContainer}>
        <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
        <TouchableOpacity style={styles.orderButton}>
          <Text style={styles.orderButtonText}>Order Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: "#777",
    marginBottom: 20,
  },
  goBackButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  goBackButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",

    // Sombra
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
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  dishImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ccc",
  },
  quantityContainer: {
    position: "absolute",
    right: 20,
    bottom: 20,
    alignItems: "center",
  },
  quantityButton: {
    backgroundColor: "#000",
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
  },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  orderButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  orderButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
