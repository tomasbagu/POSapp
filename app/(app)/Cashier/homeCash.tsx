import React, { useContext } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { DataContext } from "../../../context/DataContext";

const HomeCash = () => {
    const { dishes, deleteDish } = useContext(DataContext);
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Menu</Text>
            <Text style={styles.subtitle}>Modify, add or delete items from your menu</Text>
            <FlatList
                data={dishes}
                keyExtractor={(item) => item.id || ""}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.infoContainer}>
                            <Text style={styles.dishName}>{item.name}</Text>
                            <View style={styles.categoryBadge}>
                                <Text style={styles.categoryText}>{item.category}</Text>
                            </View>
                            <Text style={styles.description}>{item.description}</Text>
                            <Text style={styles.price}>${item.price}</Text>
                        </View>
                        <Image source={{ uri: item.imageUrl }} style={styles.dishImage} />
                        <View style={styles.actions}>
                            <TouchableOpacity 
                                style={styles.editButton} 
                                onPress={() => router.push(`/Cashier/editDish?id=${item.id}`)}
                            >
                                <Text style={styles.actionText}>-</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.deleteButton} 
                                onPress={() => item.id && deleteDish(item.id)}
                            >
                                <Text style={styles.actionText}>×</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
            <View style={styles.footerButtons}>
                <TouchableOpacity style={styles.addButton} onPress={() => router.push("/Cashier/editDish")}> 
                    <Text style={styles.buttonText}>+ Add new dish</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.readyButton}> 
                    <Text style={styles.buttonText}>My menu is ready!</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
    subtitle: {
        color: "gray",
        marginBottom: 20,
    },
    card: {
        backgroundColor: "#f9f9f9",
        borderRadius: 12,
        padding: 15,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
        elevation: 3,
    },
    infoContainer: {
        flex: 1,
    },
    dishName: {
        fontWeight: "bold",
        fontSize: 18,
    },
    categoryBadge: {
        backgroundColor: "black",
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 12,
        alignSelf: "flex-start",
        marginVertical: 5,
    },
    categoryText: {
        color: "white",
        fontSize: 12,
    },
    description: {
        color: "gray",
        fontSize: 14,
    },
    price: {
        fontSize: 16,
        fontWeight: "bold",
    },
    dishImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginLeft: 10,
    },
    actions: {
        flexDirection: "row",
        alignItems: "center",
    },
    editButton: {
        backgroundColor: "#ddd",
        padding: 8,
        borderRadius: 20,
        marginRight: 5,
    },
    deleteButton: {
        backgroundColor: "black",
        padding: 8,
        borderRadius: 20,
    },
    actionText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    footerButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    addButton: {
        backgroundColor: "black",
        padding: 12,
        borderRadius: 10,
        flex: 1,
        marginRight: 10,
    },
    readyButton: {
        backgroundColor: "black",
        padding: 12,
        borderRadius: 10,
        flex: 1,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
});

export default HomeCash;