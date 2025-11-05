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
    <div className="flex h-screen bg-black text-white">
      <div className="w-3/4 flex flex-col">
        <header className="bg-zinc-900 border-b border-zinc-800 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img
              src="https://iagiliza.com.br/imges/icon_IAgiliza.png"
              alt="IAgiliza Logo"
              className="w-7 h-7"
            />
            <h1 className="text-lg font-semibold">IAgiliza Chat</h1>
          </div>
          {currentChat && (
            <p className="text-xs text-gray-400">
              Chat <span className="font-mono">{currentChat.id.slice(-6)}</span>
            </p>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-zinc-950">
          {messages.length > 0 ? (
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
                      : "bg-zinc-800 text-gray-200"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <span className="block text-xs mt-1 opacity-60">
                    {msg.role === "user" ? user?.name : "IAgiliza"}
                  </span>
                </Card>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-10">
              Nenhuma mensagem neste chat.
            </p>
          )}
        </div>

        <form
          onSubmit={handleSendMessage}
          className="p-4 bg-zinc-900 border-t border-zinc-800 flex items-center gap-2"
        >
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-zinc-800 text-white border-zinc-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-600"
          />
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Send className="w-4 h-4" /> Enviar
          </Button>
        </form>
      </div>

      <aside className="w-1/4 bg-zinc-900 border-l border-zinc-800 flex flex-col">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
          <h2 className="font-medium text-sm flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> Conversas
          </h2>
          <Button
            size="icon"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
            onClick={handleNewChat}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {chats.length === 0 ? (
            <p className="text-center mt-6 text-gray-500 text-sm">
              Nenhum chat
            </p>
          ) : (
            chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => handleSelectChat(chat.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all ${
                  chat.id === chatId
                    ? "bg-blue-600 text-white font-semibold"
                    : "bg-zinc-800 hover:bg-zinc-700 text-gray-300"
                }`}
              >
                Chat {chat.id.slice(-4)}
              </button>
            ))
          )}
        </div>

        <Button
          onClick={handleExitChat}
          className="bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 py-3 rounded-none"
        >
          <LogOut className="w-4 h-4" /> Sair
        </Button>
      </aside>
    </div>
  );
}
