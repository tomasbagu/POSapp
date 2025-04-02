import { createContext, useState, useEffect } from "react";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../utils/Firebase";
import * as ImagePicker from "expo-image-picker";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

// Inicializar Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface Dish {
    id?: string;
    name: string;
    price: number;
    description: string;
    category: "entrada" | "fuerte" | "postre" | "bebida";
    imageUrl?: string;
}

interface DataContextInterface {
    dishes: Dish[];
    addDish: (dish: Dish) => Promise<boolean>;
    updateDish: (id: string, updatedDish: Partial<Dish>) => Promise<boolean>;
    deleteDish: (id: string) => Promise<boolean>;
    getDishes: () => Promise<void>;
    selectImage: () => Promise<string | null>;
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

    // Eliminar un plato
    const deleteDish = async (id: string): Promise<boolean> => {
        try {
            await deleteDoc(doc(db, "dishes", id));
            setDishes(prevDishes => prevDishes.filter(d => d.id !== id));
            return true;
        } catch (error) {
            console.error("Error al eliminar plato:", error);
            return false;
        }
    };

    // Seleccionar imagen y subirla a Supabase
    const selectImage = async (): Promise<string | null> => {
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
            const fileName = `dishes/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;

            // Convertir la URI en un Blob antes de subirla a Supabase
            const response = await fetch(imageUri);
            const blob = await response.blob();

            // Subir imagen a Supabase
            const { data, error } = await supabase.storage.from("images").upload(fileName, blob, {
                contentType: "image/jpeg",
            });

            if (error) {
                console.error("Error al subir la imagen:", error);
                return null;
            }

            // Obtener la URL pública de la imagen
            const { data: publicUrlData } = supabase.storage.from("images").getPublicUrl(fileName);
            return publicUrlData.publicUrl;
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
