import { BrowserRouter as Router } from "react-router-dom";
import AdminRoutes from "./routes/AdminRoutes";

export default function App() {
  return (
    <Router>
      <AdminRoutes />
    </Router>
  );
}