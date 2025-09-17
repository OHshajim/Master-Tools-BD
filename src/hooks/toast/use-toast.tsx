
import * as React from "react";
import { toast as sonnerToast } from "sonner";
import { 
  CustomToast, 
  ToasterToast, 
  genId 
} from "./toast-types";
import { 
  dispatch, 
  listeners, 
  memoryState, 
  State 
} from "./toast-reducer";

// Main toast function
function toast(props: CustomToast) {
  const id = genId();
  
  // Use Sonner toast for actual toast UI
  sonnerToast(props.title, {
    description: props.description,
    action: props.action,
    ...props,
  });

  const update = (props: CustomToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  return {
    id: id,
    dismiss,
    update,
  };
}

// Add variant methods to toast
toast.dismiss = (toastId?: string) => {
  dispatch({ type: "DISMISS_TOAST", toastId });
};

toast.success = (message: string, options = {}) => {
  return sonnerToast.success(message, options);
};

toast.error = (message: string, options = {}) => {
  return sonnerToast.error(message, options);
};

toast.info = (message: string, options = {}) => {
  return sonnerToast.info(message, options);
};

toast.warning = (message: string, options = {}) => {
  return sonnerToast.warning(message, options);
};

// The hook
function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { useToast, toast };
