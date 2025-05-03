// In your context.ts
import { createContext, Dispatch, SetStateAction } from "react";

export const CartContext = createContext<[number, Dispatch<SetStateAction<number>>]>([
  0,
  () => {}, // Default setter function
] as const);