import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await api.get("/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.data) {
          navigate("/login");
          return;
        }

        setName(res.data.name);
        setEmail(res.data.email);
      } catch (error: any) {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };

    loadProfile();
  }, [token, navigate]);

  const handleSave = async () => {
    try {
      await api.put(
        "/profile",
        { name, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ Perfil atualizado com sucesso!");
      setEditing(false);
    } catch {
      setMessage("❌ Erro ao atualizar perfil.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-96">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          Meu Perfil
        </h1>

        <label className="block text-gray-700 text-sm font-bold mb-2">
          {editing ? "Novo nome" : "Nome atual"}
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={!editing}
          className={`shadow border rounded w-full py-2 px-3 mb-4 text-gray-700 ${
            !editing ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
        />

        <label className="block text-gray-700 text-sm font-bold mb-2">
          {editing ? "Novo email" : "Email atual"}
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={!editing}
          className={`shadow border rounded w-full py-2 px-3 mb-4 text-gray-700 ${
            !editing ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
        />

        {editing ? (
          <button
            onClick={handleSave}
            className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700"
          >
            Salvar alterações
          </button>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
          >
            Editar
          </button>
        )}

        {message && (
          <p
            className={`mt-4 text-sm text-center ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>

      <button
        onClick={() => navigate("/landing")}
        className="mt-6 text-blue-600 hover:underline"
      >
        Voltar
      </button>
    </div>
  );
}
