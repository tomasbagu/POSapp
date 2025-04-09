import React, { useContext, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { DataContext } from "../../../context/DataContext";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Modal from "react-native-modal";

const HomeCash = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("DataContext está indefinido. Verifica el proveedor.");
  }

  const { dishes, deleteDish } = context;
  const router = useRouter();

  const [showSuccess, setShowSuccess] = useState(false); // ← Nuevo estado

  const categoryLabels: Record<string, string> = {
    entrada: "Starter Dish",
    fuerte: "Main Course",
    postre: "Dessert",
    bebida: "Drink",
  };

  const handleDelete = (id: string) => {
    deleteDish(id);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.title}>Your Menu</Text>
        <Text style={styles.subtitle}>
          Modify, add or delete items from your menu
        </Text>
      </View>

      <View style={styles.listContainer}>
        <FlatList
          data={dishes}
          keyExtractor={(item) => item.id || ""}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.leftSection}>
                <Text style={styles.dishName}>{item.name}</Text>

                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>
                    {categoryLabels[item.category] || item.category}
                  </Text>
                </View>

                <Text style={styles.description}>
                  {(item.description?.length || 0) > 63
                    ? item.description?.slice(0, 63) + "…"
                    : item.description || "Descripción no disponible"}
                </Text>

                <Text style={styles.price}>
                  {item.price?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </Text>
              </View>

              <View style={styles.imageContainer}>
                {item.imageUrl ? (
                  <Image source={{ uri: item.imageUrl }} style={styles.dishImage} />
                ) : (
                  <View style={styles.placeholderImage} />
                )}

                <TouchableOpacity
                  style={[styles.overlayButton, { left: -10 }]}
                  onPress={() => item.id && handleDelete(item.id)}
                >
                  <Text style={styles.overlayButtonText}>−</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.overlayButton, { right: -10 }]}
                  onPress={() => router.push(`../Cashier/editDish?id=${item.id}`)}
                >
                  <FontAwesome name="wrench" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>

      <View style={styles.footerButtons}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("../Cashier/editDish")}
        >
          <Text style={styles.buttonText}>+ Add new dish</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.readyButton} onPress={() => router.replace("../Cashier/cashierMenu")}>
          <Text style={styles.buttonText}>My Menu is Ready!</Text>
        </TouchableOpacity>
      </View>

      {/* Modal visual cuando se elimina un plato */}
      <Modal isVisible={showSuccess} animationIn="zoomIn" animationOut="zoomOut" backdropOpacity={0.3}>
        <View style={styles.modalContent}>
          <Text style={styles.successIcon}>🗑️</Text>
          <Text style={styles.successText}>Dish deleted!</Text>
        </View>
      </Modal>
    </View>
  );
};

export default HomeCash;

const styles = StyleSheet.create({
  top: {
    marginTop: 60,
    marginBottom: 15,
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  listContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#000",
    marginBottom: 6,
    fontFamily: "Inter-Regular",
  },
  subtitle: {
    fontSize: 16,
    color: "#777",
    marginBottom: 20,
    fontFamily: "Inter-Regular",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: "center",
  },
  leftSection: {
    flex: 1,
    paddingRight: 10,
  },
  dishName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
    fontFamily: "Inter-Regular",
  },
  categoryBadge: {
    backgroundColor: "#000",
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  categoryText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "400",
    fontFamily: "Inter-Regular",
  },
  description: {
    fontSize: 14,
    color: "#777",
    marginBottom: 10,
    fontFamily: "Inter-Regular",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 12,
    fontFamily: "Inter-Regular",
  },
  imageContainer: {
    position: "relative",
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  dishImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ccc",
  },
  overlayButton: {
    position: "absolute",
    bottom: -10,
    backgroundColor: "#000",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  overlayButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Inter-Regular",
  },
  footerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 20,
    gap: 10,
  },
  addButton: {
    flex: 1,
    backgroundColor: "#000",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  readyButton: {
    flex: 1,
    backgroundColor: "#000",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
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
    fontSize: 44,
    marginBottom: 10,
  },
  successText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    fontFamily: "Inter-Regular",
  },
});
