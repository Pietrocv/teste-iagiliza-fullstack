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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await api.post("/register", { name, email, password });

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-200 p-4">
      <Card className="w-full max-w-md shadow-xl border border-gray-100 rounded-2xl bg-white py-8 px-6 text-center">
        {/* Avatar decorativo */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white shadow-md">
            <UserPlus className="w-10 h-10" />
          </div>
        </div>

        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-600">
            Criar conta
          </CardTitle>
          <p className="text-gray-500 text-sm mt-1">
            Preencha os campos para se cadastrar
          </p>
        </CardHeader>

        <CardContent className="mt-6">
          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            <div>
              <Label htmlFor="name" className="flex items-center gap-2 text-gray-700 mb-1">
                <User className="w-4 h-4 text-gray-500" /> Nome
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="flex items-center gap-2 text-gray-700 mb-1">
                <Mail className="w-4 h-4 text-gray-500" /> Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="flex items-center gap-2 text-gray-700 mb-1">
                <Lock className="w-4 h-4 text-gray-500" /> Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {message && (
              <p
                className={`text-center text-sm font-medium ${
                  message.startsWith("✅") ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}

            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold py-2 mt-4 rounded-lg shadow-md transition-all"
            >
              <UserPlus className="w-4 h-4" /> Criar conta
            </Button>

            <div className="text-center text-sm mt-4">
              <span className="text-gray-600">Já tem conta?</span>{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-green-600 hover:underline flex items-center justify-center gap-1 font-medium mx-auto mt-1"
              >
                <LogIn className="w-4 h-4" /> Fazer login
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
