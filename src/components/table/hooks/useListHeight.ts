import { useState, useEffect, useCallback } from "react";

export const useListHeight = () => {
  const [listHeight, setListHeight] = useState(0);

  const debouncedUpdateHeight = useCallback(() => {
    let timeoutId: NodeJS.Timeout;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setListHeight(window.innerHeight - 174);
      }, 100); // 100ms debounce
    };
  }, []);

  useEffect(() => {
    const updateHeight = () => {
      setListHeight(window.innerHeight - 174);
    };

    const debouncedUpdate = debouncedUpdateHeight();

    updateHeight();
    window.addEventListener("resize", debouncedUpdate);

    return () => window.removeEventListener("resize", debouncedUpdate);
  }, [debouncedUpdateHeight]);

  return listHeight;
};
