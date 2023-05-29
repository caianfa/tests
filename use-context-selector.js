import { createContext as createContextOrig, useLayoutEffect, useRef, useReducer } from "react";

const createProvider = (ProviderOrig) => {
  const ContextProvider = ({ value, children }) => {
    const contextValue = useRef();

    if (!contextValue.current) {
      const listeners = new Set();
      contextValue.current = {
        value,
        listeners,
      }
    }

    useLayoutEffect(() => {
      contextValue.current.value = value;
      contextValue.current.listeners.forEach((listener) => {
        listener({ v: value })
      })
    }, [value])

    return <ProviderOrig value={contextValue.current}>{children}</ProviderOrig>;
  }

  return ContextProvider
}

function createContext(defaultValue) {
  const context = createContextOrig({ value: defaultValue, listeners: new Set() })

  context.Provider = createContext(context.Provider)
  delete context.Consumer;
  return context
}

function useContextSelector(context, selector) {
  const contextValue = useContextOrig(context);
  const { value, listeners } = contextValue;
}
