import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeLeaflet } from './utilis/leafletConfig.ts';

createRoot(document.getElementById("root")!).render(<App />);
initializeLeaflet();
