import React, { createContext, useState, useEffect, useContext } from "react";
import { db } from "../utils/Firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  onSnapshot,
  getDocs,
} from "firebase/firestore";

interface Dish {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl?: string;
}

interface CartItem extends Dish {
  quantity: number;
}

interface Order {
  id?: string;
  items: CartItem[];
  status: OrderStatus;
  createdAt: number;
}

type OrderStatus = "Ordered" | "Cooking" | "Ready for Pickup" | "Delivered" | "Ready for Payment";

interface OrderContextInterface {
  dishes: Dish[];
  cart: CartItem[];
  order: Order | null;
  addToCart: (dish: Dish) => void;
  removeFromCart: (dishId: string) => void;
  updateQuantity: (dishId: string, quantity: number) => void;
  clearCart: () => void;
  sendOrder: () => Promise<string | null>;
  getOrderStatus: (orderId: string) => void;
}

export const OrderContext = createContext<OrderContextInterface | null>(null);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchDishes = async () => {
      const snapshot = await getDocs(collection(db, "dishes"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Dish[];
      setDishes(data);
    };
    fetchDishes();
  }, []);

  const addToCart = (dish: Dish) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { ...dish, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (dishId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== dishId));
  };

  const updateQuantity = (dishId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(dishId);
    } else {
      setCart((prev) =>
        prev.map((item) => (item.id === dishId ? { ...item, quantity } : item))
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const sendOrder = async (): Promise<string | null> => {
    if (cart.length === 0) return null;
    const newOrder: Order = {
      items: cart,
      status: "Ordered",
      createdAt: Date.now(),
    };

    const docRef = await addDoc(collection(db, "orders"), newOrder);
    setOrder({ ...newOrder, id: docRef.id });
    clearCart();
    return docRef.id;
  };

  const getOrderStatus = (orderId: string) => {
    const orderRef = doc(db, "orders", orderId);
    return onSnapshot(orderRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as Order;
        setOrder({ ...data, id: snapshot.id });
      }
    });
  };

  return (
    <OrderContext.Provider
      value={{
        dishes,
        cart,
        order,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        sendOrder,
        getOrderStatus,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrder must be used within an OrderProvider");
  return context;
};
