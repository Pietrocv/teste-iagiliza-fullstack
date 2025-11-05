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
    <div className="min-h-screen flex items-center justify-center bg-black text-white font-[Inter]">
      <div className="bg-zinc-900 border border-zinc-800 shadow-2xl rounded-2xl p-10 w-full max-w-md text-center">
        <div className="flex flex-col items-center space-y-3 mb-8">
          <img
            src="https://iagiliza.com.br/imges/icon_IAgiliza.png"
            alt="IAgiliza Logo"
            className="w-16 h-16 drop-shadow-md"
          />
          <h1 className="text-3xl font-semibold text-white">
            Bem-vindo ao IAgiliza 🚀
          </h1>
          {user && (
            <p className="text-gray-400 text-sm">
              Olá <span className="font-medium text-white">{user.name}</span>
            </p>
          )}
        </div>

        <div className="flex flex-col space-y-4">
          <button
            onClick={() => navigate("/chat")}
            className="bg-white text-black font-medium py-2 rounded-md hover:bg-gray-200 transition-all"
          >
            Entrar no Chat 💬
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-500 transition-all"
          >
            Meu Perfil 👤
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white font-medium py-2 rounded-md hover:bg-red-500 transition-all mt-4"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}
