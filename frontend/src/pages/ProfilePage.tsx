import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, Mail, Save, Edit3 } from "lucide-react";

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
        setName(res.data.name);
        setEmail(res.data.email);
      } catch (error) {
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
    <div className="min-h-screen flex items-center justify-center bg-black text-white font-[Inter] p-4">
      <Card className="w-full max-w-md relative bg-zinc-900 border border-zinc-800 shadow-2xl rounded-2xl p-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/landing")}
          className="absolute top-4 left-4 flex items-center gap-1 text-gray-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>

        <div className="flex flex-col items-center mb-6 mt-2">
          <img
            src="https://iagiliza.com.br/imges/icon_IAgiliza.png"
            alt="IAgiliza Logo"
            className="w-14 h-14 drop-shadow-md mb-2"
          />
          <h1 className="text-2xl font-semibold text-white">
            {name || "Usuário"}
          </h1>
          <p className="text-gray-400 text-sm">{email || "email@exemplo.com"}</p>
        </div>

        <CardContent className="space-y-5">
          <div>
            <Label
              htmlFor="name"
              className="text-gray-200 flex items-center gap-2"
            >
              <User className="w-4 h-4 text-gray-400" /> Nome
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!editing}
              className={`mt-1 bg-zinc-800 border-zinc-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 ${
                !editing ? "opacity-70 cursor-not-allowed" : ""
              }`}
            />
          </div>

          <div>
            <Label
              htmlFor="email"
              className="text-gray-200 flex items-center gap-2"
            >
              <Mail className="w-4 h-4 text-gray-400" /> Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!editing}
              className={`mt-1 bg-zinc-800 border-zinc-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 ${
                !editing ? "opacity-70 cursor-not-allowed" : ""
              }`}
            />
          </div>

          {editing ? (
            <Button
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-200 text-black font-semibold rounded-md transition-all mt-6"
            >
              <Save className="w-4 h-4" /> Salvar alterações
            </Button>
          ) : (
            <Button
              onClick={() => setEditing(true)}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-md transition-all mt-6"
            >
              <Edit3 className="w-4 h-4" /> Editar perfil
            </Button>
          )}

          {message && (
            <p
              className={`text-center text-sm font-medium mt-2 ${
                message.startsWith("✅") ? "text-green-400" : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
