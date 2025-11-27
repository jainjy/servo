import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeLeaflet } from './utilis/leafletConfig.ts';
import AppPullToRefresh from './components/AppPullToRefresh';

createRoot(document.getElementById("root")!).render(
  <AppPullToRefresh>
    <App />
  </AppPullToRefresh>
);
initializeLeaflet();
