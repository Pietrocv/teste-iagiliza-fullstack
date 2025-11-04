import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, Mail, Edit3, Save } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-200 p-4">
      <Card className="w-full max-w-md relative bg-white shadow-lg border border-gray-100 rounded-2xl p-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/landing")}
          className="absolute top-4 left-4 flex items-center gap-1 text-gray-500 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>

        <div className="flex flex-col items-center -mt-4">
          <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-4xl font-bold shadow-md">
            {name ? name.charAt(0).toUpperCase() : "?"}
          </div>

          <h1 className="mt-4 text-xl font-semibold text-gray-800">{name || "Usuário"}</h1>
          <p className="text-gray-500 text-sm">{email || "email@exemplo.com"}</p>
        </div>

        <CardContent className="mt-6 space-y-5">
          <div>
            <Label htmlFor="name" className="text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" /> Nome
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!editing}
              className={`mt-1 ${!editing ? "opacity-70 cursor-not-allowed" : ""}`}
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-gray-700 flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" /> Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!editing}
              className={`mt-1 ${!editing ? "opacity-70 cursor-not-allowed" : ""}`}
            />
          </div>

          {editing ? (
            <Button
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold shadow-md transition-all"
            >
              <Save className="w-4 h-4" /> Salvar alterações
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => setEditing(true)}
              className="w-full flex items-center justify-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-semibold transition-all"
            >
              <Edit3 className="w-4 h-4" /> Editar perfil
            </Button>
          )}

          {message && (
            <p
              className={`text-center text-sm font-medium ${
                message.startsWith("✅") ? "text-green-600" : "text-red-600"
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
