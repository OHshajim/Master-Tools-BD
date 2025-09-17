
import * as React from "react";
import type { ToastT } from "sonner";

// Basic toast props
export type ToasterToastProps = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
};

// Combine Sonner's toast type with our additional properties
export type ToasterToast = ToastT & ToasterToastProps;

// Define our custom toast type
export type CustomToast = Omit<ToasterToastProps, "id">;

// Helper for ID generation
let count = 0;

export function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}
