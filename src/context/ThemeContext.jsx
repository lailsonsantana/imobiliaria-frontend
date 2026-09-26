import { createContext, useContext, useState, useEffect } from "react";

const COLOR_SCHEMES = [
  { id: "gold", name: "Gold", label: "Dourado", color: "#d97706" },
  { id: "purple", name: "Purple", label: "Roxo", color: "#aa3bff" },
  { id: "blue", name: "Blues", label: "Azul", color: "#0284c7" },
];

const MODES = ["light", "dark"];

const ThemeContext = createContext({
  colorScheme: "gold",
  setColorScheme: () => {},
  colorSchemes: COLOR_SCHEMES,
  mode: "light",
  setMode: () => {},
  toggleMode: () => {},
});

const STORAGE_COLOR_KEY = "prosperiam_color_scheme";
const STORAGE_MODE_KEY = "prosperiam_mode";

export function ThemeProvider({ children }) {
  const [colorScheme, setColorSchemeState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_COLOR_KEY);
      if (saved && COLOR_SCHEMES.some((c) => c.id === saved)) {
        return saved;
      }
    } catch {
      // Ignora erro de acesso ao localStorage
    }
    return "gold"; // Padrão Gold
  });

  const [mode, setModeState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_MODE_KEY);
      if (saved && MODES.includes(saved)) {
        return saved;
      }
    } catch {
      // Ignora erro de acesso ao localStorage
    }
    return "light"; // Padrão White/Light Mode
  });

  const setColorScheme = (newScheme) => {
    if (COLOR_SCHEMES.some((c) => c.id === newScheme)) {
      setColorSchemeState(newScheme);
      try {
        localStorage.setItem(STORAGE_COLOR_KEY, newScheme);
      } catch {
        // Ignora erro
      }
    }
  };

  const setMode = (newMode) => {
    if (MODES.includes(newMode)) {
      setModeState(newMode);
      try {
        localStorage.setItem(STORAGE_MODE_KEY, newMode);
      } catch {
        // Ignora erro
      }
    }
  };

  const toggleMode = () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", colorScheme);
    document.documentElement.setAttribute("data-mode", mode);
    document.body.setAttribute("data-theme", colorScheme);
    document.body.setAttribute("data-mode", mode);
  }, [colorScheme, mode]);

  return (
    <ThemeContext.Provider
      value={{
        colorScheme,
        setColorScheme,
        colorSchemes: COLOR_SCHEMES,
        mode,
        setMode,
        toggleMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme deve ser utilizado dentro de um ThemeProvider");
  }
  return context;
}

export default ThemeContext;
