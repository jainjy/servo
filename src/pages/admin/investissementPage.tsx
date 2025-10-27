import Investissement from "@/components/Investissement/investissement";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/investissement" element={<Investissement />} />
      </Routes>
    </Router>
  );
}

export default App;
