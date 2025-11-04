import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  name: string;
  email: string;
}

export default function Landing() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      navigate("/login");
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("chatId");
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-4xl font-bold mb-4">Bem-vindo ao IAgiliza 🚀</h1>

      {user && (
        <p className="text-lg mb-6">
          Logado como <span className="font-semibold">{user.name}</span>
        </p>
      )}

      <button
        onClick={() => navigate("/chat")}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition mb-4"
      >
        Entrar no Chat 💬
      </button>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
      >
        Sair
      </button>
    </div>
  );
}
