import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserPlus, Mail, Lock, User, LogIn } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/register", { name, email, password });

      if (res.status === 201 || res.data?.message === "User created successfully") {
        setMessage("Usuário criado com sucesso!");
        alert("Cadastro realizado com sucesso! Faça login para continuar.");
        navigate("/login");
      } else {
        setMessage("Falha ao criar usuário. Tente novamente.");
      }
    } catch (err) {
      console.error("Erro ao registrar:", err);
      setMessage("Erro ao registrar usuário.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black font-[Inter] text-white">
      <Card className="w-full max-w-sm bg-zinc-900 border border-zinc-800 shadow-2xl rounded-2xl p-6 text-white">
        <CardHeader className="text-center mb-4 flex flex-col items-center space-y-3">
          <img
            src="https://iagiliza.com.br/imges/icon_IAgiliza.png"
            alt="IAgiliza Logo"
            className="w-14 h-14 drop-shadow-md"
          />
          <CardTitle className="text-2xl font-semibold text-white">
            Criar Conta
          </CardTitle>
          <p className="text-gray-300 text-sm">
            Preencha os campos para se cadastrar
          </p>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center space-y-4 text-white"
          >
            <div className="w-72">
              <Label htmlFor="name" className="text-gray-200 text-sm flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" /> Nome
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 bg-zinc-800 border-zinc-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="w-72">
              <Label htmlFor="email" className="text-gray-200 text-sm flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" /> Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 bg-zinc-800 border-zinc-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="w-72">
              <Label htmlFor="password" className="text-gray-200 text-sm flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-400" /> Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 bg-zinc-800 border-zinc-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {message && (
              <p
                className={`text-center text-sm font-medium ${
                  message.includes("sucesso")
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {message}
              </p>
            )}

            <Button
              type="submit"
              className="w-72 mt-2 bg-white hover:bg-gray-200 text-black font-medium rounded-md transition-all flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" /> Criar Conta
            </Button>

            <div className="flex flex-col items-center mt-10 space-y-3">
              <p className="text-gray-300 text-sm tracking-wide">
                Já tem uma conta?
              </p>
              <Button
                type="button"
                onClick={() => navigate("/login")}
                className="w-40 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-md transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" /> Fazer Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
