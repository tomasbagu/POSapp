import React, { createContext, useState, useEffect } from "react";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db, storage } from "../utils/Firebase";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

// Actualiza la interfaz para incluir imagePath (opcional)
interface Dish {
    id?: string;
    name: string;
    price: number;
    description: string;
    category: "entrada" | "fuerte" | "postre" | "bebida";
    imageUrl?: string;
    imagePath?: string; // se usará para eliminar la imagen de Storage
}

interface DataContextInterface {
    dishes: Dish[];
    addDish: (dish: Dish) => Promise<boolean>;
    updateDish: (id: string, updatedDish: Partial<Dish>) => Promise<boolean>;
    deleteDish: (id: string) => Promise<boolean>;
    getDishes: () => Promise<void>;
    // Ahora selectImage devuelve un objeto con imageUrl e imagePath
    selectImage: () => Promise<{ imageUrl: string; imagePath: string } | null>;
}

export const DataContext = createContext<DataContextInterface>({
    dishes: [],
    addDish: async () => false,
    updateDish: async () => false,
    deleteDish: async () => false,
    getDishes: async () => {},
    selectImage: async () => null,
});

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [dishes, setDishes] = useState<Dish[]>([]);

    useEffect(() => {
        getDishes();
    }, []);

    // Obtener los platos
    const getDishes = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "dishes"));
            const dishesList: Dish[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Dish[];
            setDishes(dishesList);
        } catch (error) {
            console.error("Error al obtener platos:", error);
        }
    };

    // Agregar un nuevo plato
    const addDish = async (dish: Dish): Promise<boolean> => {
        try {
            const docRef = await addDoc(collection(db, "dishes"), dish);
            setDishes(prevDishes => [...prevDishes, { ...dish, id: docRef.id }]);
            return true;
        } catch (error) {
            console.error("Error al agregar plato:", error);
            return false;
        }
    };

    // Modificar un plato existente
    const updateDish = async (id: string, updatedDish: Partial<Dish>): Promise<boolean> => {
        try {
            const dishRef = doc(db, "dishes", id);
            await updateDoc(dishRef, updatedDish);
            setDishes(prevDishes => prevDishes.map(d => (d.id === id ? { ...d, ...updatedDish } : d)));
            return true;
        } catch (error) {
            console.error("Error al actualizar plato:", error);
            return false;
        }
    };

    // Eliminar un plato y su imagen (si existe)
    const deleteDish = async (id: string): Promise<boolean> => {
        try {
            // Buscar el plato para obtener el imagePath
            const dishToDelete = dishes.find(d => d.id === id);
            if (dishToDelete) {
                // Si existe imagePath, eliminar la imagen de Storage
                if (dishToDelete.imagePath) {
                    const imageRef = ref(storage, dishToDelete.imagePath);
                    await deleteObject(imageRef);
                }
            }
            await deleteDoc(doc(db, "dishes", id));
            setDishes(prevDishes => prevDishes.filter(d => d.id !== id));
            return true;
        } catch (error) {
            console.error("Error al eliminar plato:", error);
            return false;
        }
    };

    // Seleccionar imagen y subirla a Firebase Storage
    const selectImage = async (): Promise<{ imageUrl: string; imagePath: string } | null> => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (permissionResult.status !== "granted") {
                console.log("Permiso denegado para acceder a la galería.");
                return null;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (result.canceled) return null;

            const imageUri = result.assets[0].uri;
            // Generar un nombre único para la imagen
            const fileName = `dishes/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;

            // Convertir la URI en un Blob
            const response = await fetch(imageUri);
            const blob = await response.blob();

            // Subir la imagen a Firebase Storage
            const imageRef = ref(storage, fileName);
            await uploadBytes(imageRef, blob);
            const imageUrl = await getDownloadURL(imageRef);

            return { imageUrl, imagePath: fileName };
        } catch (error) {
            console.error("Error al seleccionar o subir imagen:", error);
            return null;
        }
    };

    return (
        <DataContext.Provider value={{ dishes, addDish, updateDish, deleteDish, getDishes, selectImage }}>
            {children}
        </DataContext.Provider>
    );
};

export default DataProvider;
