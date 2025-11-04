import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form enviado:", { name, email, password });

    try {
      const res = await api.post("/register", { name, email, password });
      console.log("Resposta do backend:", res.data);

      if (res.status === 201 || res.data?.message === "User created successfully") {
        setMessage("✅ Usuário criado com sucesso!");
        alert("Cadastro realizado com sucesso! Faça login para continuar.");

        navigate("/login");
      } else {
        setMessage("⚠️ Falha ao criar usuário. Tente novamente.");
      }
    } catch (err: any) {
      console.error("❌ Erro ao registrar:", err);
      setMessage("❌ Erro ao registrar usuário.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Registrar</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-80"
      >
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700"
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 mb-6 text-gray-700"
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Criar conta
        </button>
      </form>

      {message && (
        <p
          className={`mt-2 text-sm ${
            message.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      <a href="/login" className="text-blue-600 hover:underline mt-4">
        Já tem conta? Faça login
      </a>
    </div>
  );
}
