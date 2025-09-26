import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { isMobile } from "./utils/isMobile";
import { NotesProvider } from "./context/NotesContext.jsx";
import App from "./App.jsx";
import LandingPage from "./LandingPage/LandingPage.jsx";

const isReallyMobile = isMobile() && window.innerWidth < 768;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {isReallyMobile ? (
      <LandingPage />
    ) : (
      <NotesProvider>
        <App />
      </NotesProvider>
    )}
  </StrictMode>
);
