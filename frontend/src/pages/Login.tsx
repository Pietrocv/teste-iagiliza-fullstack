import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LogIn, Mail, Lock, UserPlus } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:3333/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/landing");
    } catch (err) {
      console.error(err);
      setError("Credenciais inválidas. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-200 p-4">
      <Card className="w-full max-w-md shadow-xl border border-gray-100 rounded-2xl bg-white py-8 px-6 text-center">
        {/* Avatar decorativo */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-md">
            <LogIn className="w-10 h-10" />
          </div>
        </div>

        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-600">
            Bem-vindo de volta
          </CardTitle>
          <p className="text-gray-500 text-sm mt-1">
            Faça login para continuar
          </p>
        </CardHeader>

        <CardContent className="mt-6">
          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            <div>
              <Label
                htmlFor="email"
                className="flex items-center gap-2 text-gray-700 mb-1"
              >
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
              <Label
                htmlFor="password"
                className="flex items-center gap-2 text-gray-700 mb-1"
              >
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

            {error && (
              <p className="text-red-500 text-sm font-medium text-center">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-2 mt-4 rounded-lg shadow-md transition-all"
            >
              <LogIn className="w-4 h-4" /> Entrar
            </Button>

            <div className="text-center text-sm mt-4">
              <span className="text-gray-600">Não tem conta?</span>{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-blue-600 hover:underline flex items-center justify-center gap-1 font-medium mx-auto mt-1"
              >
                <UserPlus className="w-4 h-4" /> Criar conta
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
