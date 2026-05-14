import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
}

export function formatVara(amount: number) {
  return new Intl.NumberFormat("en", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
}

