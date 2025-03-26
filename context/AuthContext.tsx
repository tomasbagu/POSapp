import { createContext, useEffect, useState } from "react";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    updateProfile, 
    onAuthStateChanged, 
    User as FirebaseUser 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../utils/Firebase";  // Ajusta la ruta según tu estructura

interface AuthContextInterface {
    currentUser: FirebaseUser | null;
    login: (email: string, password: string) => Promise<boolean>;
    register: (user: { name: string; email: string; password: string; role?: string }) => Promise<boolean>;
    logout: () => Promise<void>;
    updateUser: (user: { name?: string }) => Promise<void>;
    updateRole: (role: "client" | "chef" | "cashier") => Promise<void>;
}

export const AuthContext = createContext<AuthContextInterface>({} as AuthContextInterface);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    setCurrentUser(user);
                } else {
                    setCurrentUser(null);
                }
            } else {
                setCurrentUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            return response.user ? true : false;
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            return false;
        }
    };

    const register = async (user: { name: string; email: string; password: string; role?: string }): Promise<boolean> => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
            const firebaseUser = userCredential.user;
            await updateProfile(firebaseUser, { displayName: user.name });

            await setDoc(doc(db, "users", firebaseUser.uid), {
                name: user.name,
                email: user.email,
                role: user.role || "client",
                createdAt: new Date(),
            });

            setCurrentUser(firebaseUser);
            return true;
        } catch (error) {
            console.error("Error al registrar usuario:", error);
            return false;
        }
    };

    const updateUser = async (user: { name?: string }) => {
        if (auth.currentUser) {
            await updateProfile(auth.currentUser, { displayName: user.name || auth.currentUser.displayName });
            await setDoc(doc(db, "users", auth.currentUser.uid), { name: user.name }, { merge: true });
        }
    };

    const updateRole = async (role: "client" | "chef" | "cashier") => {
        if (auth.currentUser) {
            await setDoc(doc(db, "users", auth.currentUser.uid), { role }, { merge: true });
        }
    };

    const logout = async () => {
        await signOut(auth);
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                login,
                register,
                updateUser,
                updateRole,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
