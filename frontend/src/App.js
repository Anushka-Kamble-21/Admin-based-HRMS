//import { BrowserRouter } from "react-router-dom";
import AdminRoutes from "./routes/AdminRoutes";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <AdminRoutes />
    </AuthProvider>
  );
}

export default App;
