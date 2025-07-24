import { useState, useEffect } from "react";

export const useListHeight = () => {
  const [listHeight, setListHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      setListHeight(window.innerHeight - 180);
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return listHeight;
};
