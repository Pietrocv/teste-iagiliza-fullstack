import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:3333/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/chat");
    } catch (err) {
      setError("Credenciais inválidas. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black font-[Inter]">
      <Card className="w-full max-w-sm bg-zinc-900 border border-zinc-800 shadow-2xl rounded-2xl p-6 text-white">
        <CardHeader className="text-center mb-4 flex flex-col items-center space-y-3">
          <img
            src="https://iagiliza.com.br/imges/icon_IAgiliza.png"
            alt="IAgiliza Logo"
            className="w-14 h-14 drop-shadow-md"
          />
          <CardTitle className="text-2xl font-semibold text-white">
            Bem-vindo ao IAgiliza
          </CardTitle>
          <p className="text-gray-300 text-sm">Faça login para continuar</p>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center space-y-4 text-white"
          >
            <div className="w-72">
              <Label htmlFor="email" className="text-gray-200 text-sm">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@email.com"
                className="mt-1 bg-zinc-800 border-zinc-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="w-72">
              <Label htmlFor="password" className="text-gray-200 text-sm">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 bg-zinc-800 border-zinc-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center w-72">{error}</p>
            )}

            <Button
              type="submit"
              className="w-72 mt-2 bg-white hover:bg-gray-200 text-black font-medium rounded-md transition-all"
            >
              Entrar
            </Button>

            <div className="flex flex-col items-center mt-10 space-y-3">
              <p className="text-gray-300 text-sm tracking-wide">
                Não tem uma conta ainda?
              </p>
              <Button
                onClick={() => navigate("/register")}
                className="w-40 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-md transition-all"
              >
                Cadastre-se
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
