import { useState } from "react";
import api from "../services/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  console.log("Form enviado:", { name, email, password });

  try {
    const res = await api.post("/register", { name, email, password });
    console.log("Resposta do backend:", res.data); // 👈 mostra o JSON completo

    if (res.data?.token) {
      localStorage.setItem("token", res.data.token);
      console.log("✅ Token salvo no localStorage:", res.data.token);
      setMessage("✅ Usuário criado com sucesso!");
    } else {
      console.warn("⚠️ Nenhum token recebido do backend");
      setMessage("⚠️ Usuário criado, mas sem token JWT.");
    }

    console.log("localStorage atual:", localStorage.getItem("token"));
  } catch (err: any) {
    console.error("❌ Erro ao registrar:", err);
    setMessage("❌ Erro ao registrar usuário.");
  }
};

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Registrar</h1>
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-80">
  <input
    className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700"
    type="text"
    placeholder="Nome"
    value={name}
    onChange={(e) => setName(e.target.value)}
  />
  <input
    className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700"
    type="email"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
  <input
    className="shadow appearance-none border rounded w-full py-2 px-3 mb-6 text-gray-700"
    type="password"
    placeholder="Senha"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
  <button
    type="button"
    onClick={handleSubmit}
    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
  >
    Criar conta
        </button>
    </div>

      
      {message && (
        <p
          className={`mt-2 text-sm ${
            message.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      <a href="/" className="text-blue-600 hover:underline mt-4">
        Já tem conta? Faça login
      </a>
    </div>
  );
}
