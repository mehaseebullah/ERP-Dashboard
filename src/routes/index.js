import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../views/Home";

export function RenderRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}
