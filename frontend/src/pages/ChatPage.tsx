import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, LogOut, Send, MessageSquare } from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  createdAt: string;
}

interface Chat {
  id: string;
  createdAt: string;
  messages: Message[];
}

export default function ChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!token || !user) navigate("/login");
  }, [token, user, navigate]);

  useEffect(() => {
    const loadChats = async () => {
      try {
        const res = await api.get("/chats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const chatList = res.data || [];
        setChats(chatList);

        const storedChatId = localStorage.getItem("chatId");
        const existingChat = chatList.find((c: Chat) => c.id === storedChatId);

        if (existingChat) {
          setChatId(existingChat.id);
          setMessages(existingChat.messages || []);
        } else if (chatList.length > 0) {
          setChatId(chatList[0].id);
          localStorage.setItem("chatId", chatList[0].id);
          setMessages(chatList[0].messages || []);
        } else {
          const newChat = await api.post(
            "/chats",
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setChatId(newChat.data.id);
          localStorage.setItem("chatId", newChat.data.id);
          setMessages([]);
        }
      } catch (err) {
        console.error("Erro ao carregar chats:", err);
      }
    };
    loadChats();
  }, [token]);

  const handleSelectChat = async (id: string) => {
    try {
      setChatId(id);
      localStorage.setItem("chatId", id);
      const res = await api.get(`/messages?chatId=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data || []);
    } catch (err) {
      console.error("Erro ao carregar mensagens:", err);
    }
  };

  const handleNewChat = async () => {
    try {
      const res = await api.post(
        "/chats",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newChat = res.data;
      setChats((prev) => [newChat, ...prev]);
      setChatId(newChat.id);
      localStorage.setItem("chatId", newChat.id);
      setMessages([]);
    } catch (err) {
      console.error("Erro ao criar novo chat:", err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId) return;
    try {
      const res = await api.post(
        "/messages",
        { content: newMessage, chatId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { userMsg, aiMsg } = res.data || {};
      const safeMsgs = [userMsg, aiMsg].filter(Boolean);
      if (safeMsgs.length > 0) {
        setMessages((prev) => [...prev, ...safeMsgs]);
      }
      setNewMessage("");
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
    }
  };

  const handleExitChat = () => navigate("/landing");

  const currentChat = chats.find((c) => c.id === chatId);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Chat principal à esquerda */}
      <div className="flex flex-col w-1/2 border-r">
        <header className="bg-white border-b p-4 flex justify-between items-center shadow-sm">
          <div>
            <h1 className="text-lg font-bold text-blue-700">IAgiliza Chat</h1>
            {currentChat && (
              <p className="text-sm text-gray-500">
                Chat atual:{" "}
                <span className="font-mono text-gray-700">
                  {currentChat.id.slice(-6)}
                </span>
              </p>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-100 space-y-3">
          {Array.isArray(messages) && messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <Card
                  className={`p-3 rounded-2xl max-w-[70%] ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <span className="block text-xs mt-1 opacity-70">
                    {msg.role === "user" ? user?.name : "IAgiliza"}
                  </span>
                </Card>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 mt-10">
              Nenhuma mensagem neste chat.
            </p>
          )}
        </div>

        <form
          onSubmit={handleSendMessage}
          className="p-4 bg-white border-t flex items-center gap-2 shadow-md"
        >
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1"
          />
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Send className="w-4 h-4" /> Enviar
          </Button>
        </form>
      </div>

      {/* Sidebar agora à direita */}
      <aside className="w-1/2 bg-gradient-to-b from-blue-700 to-blue-900 text-white flex flex-col shadow-lg">
        <div className="p-4 border-b border-blue-600 flex justify-between items-center">
          <h2 className="font-semibold text-base flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> Conversas
          </h2>
          <Button
            variant="secondary"
            size="icon"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
            onClick={handleNewChat}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {chats.length === 0 ? (
            <p className="text-center mt-6 text-gray-300 text-sm">
              Nenhum chat
            </p>
          ) : (
            chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => handleSelectChat(chat.id)}
                className={`w-full text-left px-4 py-2 rounded-lg mb-2 transition-all ${
                  chat.id === chatId
                    ? "bg-blue-600 font-semibold"
                    : "hover:bg-blue-800/70"
                }`}
              >
                Chat {chat.id.slice(-4)}
              </button>
            ))
          )}
        </div>

        <Button
          onClick={handleExitChat}
          className="bg-red-600 hover:bg-red-700 text-white rounded-none flex items-center justify-center gap-2 py-3"
        >
          <LogOut className="w-4 h-4" /> Sair
        </Button>
      </aside>
    </div>
  );
}
