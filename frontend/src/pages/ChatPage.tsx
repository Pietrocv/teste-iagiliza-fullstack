import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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

  const handleExitChat = () => {
    navigate("/landing");
  };

  const currentChat = chats.find((c) => c.id === chatId);

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="font-bold text-lg">Suas Conversas</h2>
          <button
            onClick={handleNewChat}
            className="bg-blue-500 px-2 py-1 rounded hover:bg-blue-600"
          >
            +
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chats.length === 0 ? (
            <p className="text-center mt-4 text-gray-400">Nenhum chat ainda</p>
          ) : (
            chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => handleSelectChat(chat.id)}
                className={`block w-full text-left px-4 py-2 border-b border-gray-700 transition-colors ${
                  chat.id === chatId
                    ? "bg-blue-600 font-semibold"
                    : "hover:bg-gray-700"
                }`}
              >
                Chat {chat.id.slice(-4)}
              </button>
            ))
          )}
        </div>

        <button
          onClick={handleExitChat}
          className="bg-red-600 hover:bg-red-700 text-white p-3 text-center"
        >
          Sair
        </button>
      </aside>

      <div className="flex flex-col flex-1">
        <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-semibold">Chat - IAgiliza</h1>
            {currentChat && (
              <p className="text-sm opacity-80">
                Chat atual: <span className="font-mono">{currentChat.id.slice(-6)}</span>
              </p>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {Array.isArray(messages) && messages.length > 0 ? (
            messages
              .filter((msg): msg is Message => !!msg && !!msg.role)
              .map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-xs ${
                      msg.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <span className="block text-xs mt-1 opacity-70">
                      {msg.role === "user" ? user?.name : "IAgiliza"}
                    </span>
                  </div>
                </div>
              ))
          ) : (
            <p className="text-center text-gray-400">
              Nenhuma mensagem neste chat
            </p>
          )}
        </div>

        <form
          onSubmit={handleSendMessage}
          className="p-4 bg-white border-t flex gap-2"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 border rounded px-3 py-2"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
