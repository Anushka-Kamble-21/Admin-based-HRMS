import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCompanies } from "../../services/api/employeeApi";

function Topbar() {
  const [companies, setCompanies] = useState([]);
  const [company, setCompany] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadCompanies = async () => {
      const data = await getCompanies();
      setCompanies(data);

      const stored = localStorage.getItem("company");

      if (stored && data.includes(stored)) {
        setCompany(stored);
      } else if (data.length > 0) {
        localStorage.setItem("company", data[0]);
        setCompany(data[0]);
      }
    };

    loadCompanies();
  }, []);

  const handleCompanyChange = (e) => {
    const selected = e.target.value;
    localStorage.setItem("company", selected);
    setCompany(selected);
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("company");
    navigate("/login", { replace: true });
  };

  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold">Admin Dashboard</h1>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Company:</span>

          <select
            value={company}
            onChange={handleCompanyChange}
            className="border rounded px-2 py-1 text-sm bg-white"
          >
            {companies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-500">Welcome, Admin</span>

          <button
            onClick={handleLogout}
            className="border px-3 py-1 rounded text-sm hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
