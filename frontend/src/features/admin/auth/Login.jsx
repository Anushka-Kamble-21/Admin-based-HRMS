import { useState } from "react";
import axios from "../../../services/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    const res = await axios.post("/auth/login", { email, password });

    login(res.data.token); //updates context + localStorage
    navigate("/admin/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow w-96 space-y-4">
        <h2 className="text-xl font-semibold text-center">Admin Login</h2>

        <input
          className="border p-2 rounded w-full"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 rounded w-full"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="bg-black text-white w-full py-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
