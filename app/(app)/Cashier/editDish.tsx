import React, { useContext, useState, useEffect } from "react";
import { View, Text, TextInput, Button, TouchableOpacity, Image, Alert } from "react-native";
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

    const existingDish = dishes?.find(d => d.id === params.id) || null;
    const categories: ("entrada" | "fuerte" | "postre" | "bebida")[] = ["entrada", "fuerte", "postre", "bebida"];

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState<"entrada" | "fuerte" | "postre" | "bebida">("entrada");
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        if (existingDish) {
            setName(existingDish.name || "");
            setPrice(existingDish.price?.toString() || "");
            setDescription(existingDish.description || "");
            setCategory(existingDish.category as "entrada" | "fuerte" | "postre" | "bebida" || "entrada");
            setImageUrl(existingDish.imageUrl || null);
        }
    }, [existingDish]);

    // Seleccionar imagen usando `selectImage` del DataContext
    const pickImage = async () => {
        const newImageUrl = await selectImage();
        if (newImageUrl) {
            setImageUrl(newImageUrl);
        }
    };

    const handleSubmit = async () => {
        if (!name || !price || !description) {
            Alert.alert("Error", "Todos los campos son obligatorios.");
            return;
        }

        try {
            if (params.id) {
                await updateDish(params.id as string, {
                    name,
                    price: Number(price),
                    description,
                    category,
                    imageUrl: imageUrl || undefined, // Guardar la URL de la imagen
                });
            } else {
                await addDish({
                    name,
                    price: Number(price),
                    description,
                    category,
                    imageUrl: imageUrl || undefined, // Guardar la URL de la imagen
                });
            }
            router.back();
        } catch (error) {
            console.error("Error al guardar el plato:", error);
            Alert.alert("Error", "No se pudo guardar el plato.");
        }
    };

    return (
        <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>{params.id ? "Edit Dish" : "Add Dish"}</Text>

            {/* Imagen Seleccionada */}
            {imageUrl && <Image source={{ uri: imageUrl }} style={{ width: 100, height: 100, marginBottom: 10, borderRadius: 8 }} />}

            {/* Botón de Cámara */}
            <TouchableOpacity onPress={pickImage} style={{ backgroundColor: "#ddd", padding: 10, borderRadius: 8, alignSelf: "flex-start", marginBottom: 10 }}>
                <Text>📷 Pick an Image</Text>
            </TouchableOpacity>

            <TextInput placeholder="Name of your dish" value={name} onChangeText={setName} style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 8 }} />
            <TextInput placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 8 }} />
            <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 8 }} />

            <Text style={{ fontSize: 18, marginVertical: 10 }}>Category</Text>
            {categories.map(cat => (
                <TouchableOpacity 
                    key={cat} 
                    onPress={() => setCategory(cat)} 
                    style={{ 
                        padding: 10, 
                        marginBottom: 5, 
                        backgroundColor: category === cat ? "black" : "#ccc", 
                        borderRadius: 8 
                    }}
                >
                    <Text style={{ color: category === cat ? "white" : "black", textAlign: "center" }}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</Text>
                </TouchableOpacity>
            ))}
            
            <Button title="Save Dish" onPress={handleSubmit} />
        </View>
    );
};

export default EditDish;
