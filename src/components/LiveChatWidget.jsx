import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, Trash2, X, MessageSquareQuote } from "lucide-react";

const WHATSAPP_PHONE = "5492923410901";
const STORAGE_KEY = "matera_livechat_messages";

const INITIAL_MESSAGES = [
  {
    id: "welcome-1",
    sender: "agent",
    text: "¡Hola! 👋 Te damos la bienvenida a La Matera del Gringo. ¿En qué podemos ayudarte hoy?",
    time: "Ahora",
  },
];

const SUGGESTIONS = [
  "🧉 Consultar por mates personalizados",
  "🚚 Envíos y tiempos de entrega",
  "💳 Medios de pago y cuotas",
  "⭐ Recomendación de termo o combo",
];

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Error cargando historial de chat:", e);
    }
    return INITIAL_MESSAGES;
  });
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.warn("Error guardando historial de chat:", e);
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  // Manejo de tecla Escape para accesibilidad
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSendMessage = (textToSend = inputText) => {
    const cleanText = textToSend.trim();
    if (!cleanText) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      text: cleanText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const sysMsg = {
      id: (Date.now() + 1).toString(),
      sender: "system",
      text: "Conectando con un asesor por WhatsApp...",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg, sysMsg]);
    setInputText("");

    // Redirección directa a WhatsApp
    const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(cleanText)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  const handleClearChat = () => {
    if (window.confirm("¿Deseas vaciar los mensajes del chat?")) {
      setMessages(INITIAL_MESSAGES);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <>
      {/* Botón flotante para abrir chat */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 z-40 flex items-center gap-3 animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Abrir chat de consultas en vivo"
            className="group flex items-center gap-2.5 bg-[#0066FF] hover:bg-[#0052cc] text-white pl-4 pr-5 py-3.5 rounded-full shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300"
          >
            <div className="relative">
              <MessageCircle className="w-6 h-6 transition-transform group-hover:rotate-6" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-[#0066FF] rounded-full animate-pulse" />
            </div>
            <div className="text-left leading-tight hidden sm:block">
              <div className="text-xs font-semibold uppercase tracking-wider text-blue-100">
                Consulta en Vivo
              </div>
              <div className="text-sm font-bold">¡Escribinos!</div>
            </div>
          </button>
        </div>
      )}

      {/* Ventana Flotante de Chat */}
      {isOpen && (
        <aside
          role="dialog"
          aria-labelledby="chat-heading"
          aria-modal="false"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] h-[540px] max-h-[85vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-blue-200/50 dark:border-zinc-800 bg-white dark:bg-[#1E1612] transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
        >
          {/* Encabezado Azul (#0066FF) */}
          <header className="bg-[#0066FF] text-white px-4 py-3.5 flex items-center justify-between shadow-md relative">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-white shadow-inner">
                  🧉
                </div>
                <span
                  className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#0066FF] rounded-full animate-pulse"
                  title="En línea"
                />
              </div>
              <div>
                <h2 id="chat-heading" className="text-base font-bold leading-tight flex items-center gap-1.5">
                  Consulta en Vivo
                </h2>
                <p className="text-xs text-blue-100 flex items-center gap-1 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                  En línea
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Botón Vaciar con papelera */}
              <button
                type="button"
                onClick={handleClearChat}
                aria-label="Vaciar chat de consultas"
                title="Vaciar chat"
                className="flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="font-medium text-xs hidden xs:inline">Vaciar</span>
              </button>

              {/* Botón Cerrar X */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar chat de consultas"
                title="Cerrar ventana de chat"
                className="p-1.5 rounded-lg text-white/90 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Subtítulo / Notificación inicial redondeada en gris */}
          <div className="bg-slate-100 dark:bg-zinc-900/80 px-4 py-2 border-b border-slate-200 dark:border-zinc-800 text-center">
            <div className="inline-block bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 text-xs px-3 py-1 rounded-full font-medium">
              Visitante se ha conectado al chat de consultas.
            </div>
          </div>

          {/* Área de Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FBF9F6] dark:bg-[#150F0C] text-sm">
            {messages.map((msg) => {
              if (msg.sender === "user") {
                return (
                  <div key={msg.id} className="flex justify-end">
                    <div className="max-w-[82%] bg-[#0066FF] text-white rounded-2xl rounded-tr-xs px-3.5 py-2.5 shadow-sm">
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <div className="text-[10px] text-blue-200 text-right mt-1 font-mono">
                        {msg.time}
                      </div>
                    </div>
                  </div>
                );
              }

              if (msg.sender === "system") {
                return (
                  <div key={msg.id} className="text-center my-1">
                    <span className="text-[11px] bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full inline-block italic">
                      {msg.text}
                    </span>
                  </div>
                );
              }

              // Mensaje del asesor / agente
              return (
                <div key={msg.id} className="flex gap-2 items-start">
                  <div className="w-7 h-7 rounded-full bg-leather-warm-textured flex items-center justify-center text-xs shrink-0 text-white font-bold mt-0.5">
                    MG
                  </div>
                  <div className="max-w-[82%] bg-white dark:bg-[#251B16] text-gray-800 dark:text-[#EAE0D5] border border-gray-200 dark:border-zinc-800 rounded-2xl rounded-tl-xs px-3.5 py-2.5 shadow-sm">
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <div className="text-[10px] text-gray-400 dark:text-zinc-500 text-left mt-1 font-mono">
                      {msg.time}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Sugerencias Rápidas */}
            <div className="pt-2">
              <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-zinc-400 font-semibold mb-2 flex items-center gap-1">
                <MessageSquareQuote className="w-3.5 h-3.5 text-[#0066FF]" />
                Preguntas frecuentes:
              </p>
              <div className="flex flex-col gap-1.5">
                {SUGGESTIONS.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(sug)}
                    className="text-left text-xs bg-white dark:bg-[#251B16] hover:bg-blue-50 dark:hover:bg-[#32231C] text-gray-700 dark:text-[#D7C9BA] hover:text-[#0066FF] dark:hover:text-blue-400 border border-gray-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-600 rounded-xl px-3 py-2 transition-all cursor-pointer"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            <div ref={messagesEndRef} />
          </div>

          {/* Pie de Chat con Caja de Texto y Botón Azul de Envío */}
          <form
            onSubmit={handleFormSubmit}
            className="p-3 bg-white dark:bg-[#1E1612] border-t border-gray-200 dark:border-zinc-800 flex flex-col gap-1.5"
          >
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Escribe tu consulta..."
                aria-label="Escribe tu consulta para el chat en vivo"
                className="flex-1 bg-gray-100 dark:bg-[#2C201A] text-gray-900 dark:text-[#F3EAD8] text-sm rounded-full px-4 py-2.5 border border-transparent focus:border-[#0066FF] dark:focus:border-[#0066FF] focus:bg-white dark:focus:bg-[#251B16] focus:outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                aria-label="Enviar consulta por WhatsApp"
                title="Enviar consulta"
                className="w-10 h-10 rounded-full bg-[#0066FF] hover:bg-[#0052cc] disabled:bg-gray-300 dark:disabled:bg-zinc-700 disabled:cursor-not-allowed text-white flex items-center justify-center shrink-0 shadow-md hover:shadow-blue-500/30 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                <Send className="w-4 h-4 translate-x-0.5" />
              </button>
            </div>
            <p className="text-[10px] text-center text-gray-400 dark:text-zinc-500">
              Te respondemos en minutos por WhatsApp (+54 9 2923 41-0901)
            </p>
          </form>
        </aside>
      )}
    </>
  );
}
