import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectTheme, toggleTheme as toggleThemeAction } from "@/store/slices/uiSlice";

/**
 * Sync the Redux theme value to the <html> class and expose a toggle.
 * @returns {{theme: string, isDark: boolean, toggle: () => void}}
 */
export function useTheme() {
  const theme = useSelector(selectTheme);
  const dispatch = useDispatch();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  return {
    theme,
    isDark: theme === "dark",
    toggle: () => dispatch(toggleThemeAction()),
  };
}

export default useTheme;
