"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { adminChatApi, type AdminChatSession, type AdminChatMessage } from "@/app/lib/adminApi";
import { useAdminAuth } from "@/app/context/AdminAuthContext";

export default function AdminChatPage() {
  const { user } = useAdminAuth();
  const [chats, setChats] = useState<AdminChatSession[]>([]);
  const [selectedChat, setSelectedChat] = useState<AdminChatSession | null>(null);
  const [messages, setMessages] = useState<AdminChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const prevMsgCountRef = useRef(0);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load danh sách chat
  const loadChats = useCallback(async () => {
    try {
      const data = await adminChatApi.getAll();
      setChats(data);
    } catch {
      // silent
    } finally {
      setLoadingChats(false);
    }
  }, []);

  useEffect(() => {
    loadChats();
    const interval = setInterval(loadChats, 8000);
    return () => clearInterval(interval);
  }, [loadChats]);

  // Load messages của chat được chọn
  const loadMessages = useCallback(async (chatId: string, silent = false) => {
    if (!silent) setLoadingMessages(true);
    try {
      const data = await adminChatApi.getDetail(chatId);
      setMessages(data.messages);
      prevMsgCountRef.current = data.messages.length;
      // Chỉ cập nhật selectedChat khi load lần đầu (không phải poll)
      if (!silent) {
        setSelectedChat(data.chat);
      } else {
        // Khi poll, chỉ cập nhật status nếu thay đổi (tránh flicker)
        setSelectedChat((prev) =>
          prev && prev._id === data.chat._id && prev.status !== data.chat.status
            ? { ...prev, status: data.chat.status }
            : prev
        );
      }
    } catch {
      if (!silent) setError("Không tải được tin nhắn");
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  }, []);

  const handleSelectChat = (chat: AdminChatSession) => {
    setSelectedChat(chat);
    setMessages([]);
    setError("");
    loadMessages(chat._id);
  };

  // Polling tin nhắn khi có chat được chọn
  useEffect(() => {
    if (!selectedChat) return;
    pollingRef.current = setInterval(() => {
      loadMessages(selectedChat._id, true);
    }, 4000);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [selectedChat, loadMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !selectedChat || sending) return;
    const text = input.trim();
    setInput("");
    setSending(true);
    try {
      const newMsg = await adminChatApi.sendMessage(selectedChat._id, text);
      // Cập nhật ngay mà không cần chờ polling
      setMessages((prev) => [...prev, newMsg]);
      prevMsgCountRef.current += 1;
      // Cập nhật sidebar (silent)
      loadChats();
    } catch {
      setError("Gửi thất bại");
      setInput(text);
    } finally {
      setSending(false);
    }
  };

  const handleClose = async () => {
    if (!selectedChat) return;
    if (!confirm("Đóng cuộc hội thoại này?")) return;
    try {
      await adminChatApi.closeChat(selectedChat._id);
      setSelectedChat((c) => c ? { ...c, status: "closed" } : c);
      await loadChats();
    } catch {
      setError("Không thể đóng chat");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diffDays === 0) return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    if (diffDays === 1) return "Hôm qua";
    return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
  };

  const formatFullTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

  const getCustomerName = (chat: AdminChatSession) =>
    typeof chat.customer === "object" ? chat.customer.displayName : "Khách hàng";

  const getCustomerEmail = (chat: AdminChatSession) =>
    typeof chat.customer === "object" ? chat.customer.email : "";

  const isAdminMsg = (msg: AdminChatMessage) => {
    if (!user) return false;
    const senderId = typeof msg.sender === "object" ? msg.sender._id : msg.sender;
    return senderId === (user as { id?: string; _id?: string }).id || senderId === (user as { _id?: string })._id;
  };

  const filteredChats = chats.filter((c) => {
    if (!search.trim()) return true;
    const name = getCustomerName(c).toLowerCase();
    const email = getCustomerEmail(c).toLowerCase();
    return name.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
  });

  const openChats = filteredChats.filter((c) => c.status !== "closed");
  const closedChats = filteredChats.filter((c) => c.status === "closed");

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* ── SIDEBAR ── */}
      <div className="w-80 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
        {/* Header sidebar */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#e879a0,#f472b6)" }}>
              <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h1 className="font-bold text-gray-800">Tin nhắn</h1>
            {openChats.length > 0 && (
              <span className="ml-auto text-xs font-semibold text-white px-2 py-0.5 rounded-full" style={{ background: "#e879a0" }}>
                {openChats.length}
              </span>
            )}
          </div>
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm khách hàng..."
              className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-pink-400 bg-gray-50"
            />
          </div>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto">
          {loadingChats ? (
            <div className="flex items-center justify-center h-32">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <svg className="mx-auto mb-3 opacity-40" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <p className="text-sm">Chưa có tin nhắn nào</p>
            </div>
          ) : (
            <>
              {openChats.length > 0 && (
                <>
                  <p className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Đang mở</p>
                  {openChats.map((chat) => (
                    <ChatListItem
                      key={chat._id}
                      chat={chat}
                      selected={selectedChat?._id === chat._id}
                      onClick={() => handleSelectChat(chat)}
                      getCustomerName={getCustomerName}
                      getCustomerEmail={getCustomerEmail}
                      formatTime={formatTime}
                    />
                  ))}
                </>
              )}
              {closedChats.length > 0 && (
                <>
                  <p className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Đã đóng</p>
                  {closedChats.map((chat) => (
                    <ChatListItem
                      key={chat._id}
                      chat={chat}
                      selected={selectedChat?._id === chat._id}
                      onClick={() => handleSelectChat(chat)}
                      getCustomerName={getCustomerName}
                      getCustomerEmail={getCustomerEmail}
                      formatTime={formatTime}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── MAIN CHAT AREA ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {!selectedChat ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 opacity-20" style={{ background: "linear-gradient(135deg,#e879a0,#f472b6)" }}>
              <svg width="40" height="40" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="text-lg font-medium">Chọn một cuộc hội thoại</p>
            <p className="text-sm mt-1">để bắt đầu trả lời khách hàng</p>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#e879a0,#f472b6)" }}>
                {getCustomerName(selectedChat).charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">{getCustomerName(selectedChat)}</p>
                <p className="text-xs text-gray-400 truncate">{getCustomerEmail(selectedChat)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  selectedChat.status === "closed"
                    ? "bg-gray-100 text-gray-500"
                    : "bg-green-100 text-green-700"
                }`}>
                  {selectedChat.status === "closed" ? "Đã đóng" : "Đang mở"}
                </span>
                {selectedChat.status !== "closed" && (
                  <button
                    onClick={handleClose}
                    className="text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Đóng chat
                  </button>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4" style={{ background: "#fdf2f8" }}>
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="w-2.5 h-2.5 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-sm">Chưa có tin nhắn trong cuộc hội thoại này</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const mine = isAdminMsg(msg);
                  const senderName = typeof msg.sender === "object" ? msg.sender.displayName : "Unknown";
                  return (
                    <div key={msg._id} className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
                      {!mine && (
                        <p className="text-xs text-gray-400 mb-1 px-1">{senderName}</p>
                      )}
                      <div
                        className={`max-w-lg px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          mine ? "text-white rounded-br-sm" : "text-gray-800 rounded-bl-sm bg-white"
                        }`}
                        style={mine
                          ? { background: "linear-gradient(135deg,#e879a0,#f472b6)" }
                          : { border: "1px solid #fce7f3" }
                        }
                      >
                        {msg.message}
                      </div>
                      <p className="text-xs text-gray-400 mt-1 px-1">{formatFullTime(msg.createdAt)}</p>
                    </div>
                  );
                })
              )}
              {error && (
                <p className="text-xs text-center text-red-500 bg-red-50 rounded-lg px-4 py-2">{error}</p>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-6 py-4 bg-white border-t border-gray-200">
              {selectedChat.status === "closed" ? (
                <div className="text-center text-sm text-gray-400 py-2">
                  Cuộc hội thoại đã đóng · Không thể gửi thêm tin nhắn
                </div>
              ) : (
                <div className="flex gap-3 items-end">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Nhập tin nhắn trả lời... (Enter để gửi)"
                    rows={2}
                    className="flex-1 resize-none text-sm px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-200 bg-gray-50"
                    style={{ maxHeight: "120px" }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || sending}
                    className="h-12 px-5 rounded-xl text-white text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 flex items-center gap-2"
                    style={{ background: "linear-gradient(135deg,#e879a0,#f472b6)" }}
                  >
                    <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    {sending ? "Gửi..." : "Gửi"}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Sub-component: Chat list item ─────────────────────────────────────────────
function ChatListItem({
  chat, selected, onClick, getCustomerName, getCustomerEmail, formatTime,
}: {
  chat: AdminChatSession;
  selected: boolean;
  onClick: () => void;
  getCustomerName: (c: AdminChatSession) => string;
  getCustomerEmail: (c: AdminChatSession) => string;
  formatTime: (iso: string) => string;
}) {
  const name = getCustomerName(chat);
  const email = getCustomerEmail(chat);
  const lastMsg = chat.lastMessage;
  const preview = lastMsg
    ? lastMsg.message.length > 40
      ? lastMsg.message.slice(0, 40) + "..."
      : lastMsg.message
    : email;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors hover:bg-pink-50 ${
        selected ? "bg-pink-50 border-r-2 border-pink-400" : ""
      } ${chat.status === "closed" ? "opacity-60" : ""}`}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
        style={{ background: selected ? "linear-gradient(135deg,#e879a0,#f472b6)" : "#f9a8d4" }}
      >
        {name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline gap-2">
          <p className={`text-sm truncate ${selected ? "font-semibold text-pink-700" : "font-medium text-gray-800"}`}>
            {name}
          </p>
          <span className="text-xs text-gray-400 flex-shrink-0">{formatTime(chat.updatedAt)}</span>
        </div>
        <p className="text-xs text-gray-400 truncate mt-0.5">{preview}</p>
      </div>
    </button>
  );
}
