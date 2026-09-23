import {
    createContext,
    useContext,
    useEffect,
    useState
  } from "react";
  
  const ThemeContext = createContext();
  
  export const ThemeProvider = ({ children }) => {
  
    const [theme, setTheme] = useState(() => {
      return localStorage.getItem("theme") || "light";
    });
  
  
    // Apply theme to body
    useEffect(() => {
  
      document.body.classList.remove(
        "light-theme",
        "dark-theme"
      );
  
      document.body.classList.add(
        `${theme}-theme`
      );
  
      localStorage.setItem(
        "theme",
        theme
      );
  
    }, [theme]);
  
  
    // Change theme
    const toggleTheme = () => {
  
      setTheme((currentTheme) =>
        currentTheme === "light"
          ? "dark"
          : "light"
      );
  
    };
  
  
    return (
      <ThemeContext.Provider
        value={{
          theme,
          toggleTheme
        }}
      >
        {children}
      </ThemeContext.Provider>
    );
  };
  
  
  export const useTheme = () => {
    return useContext(ThemeContext);
  };