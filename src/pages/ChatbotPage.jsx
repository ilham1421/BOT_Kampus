// src/pages/ChatbotPage.jsx

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Send,
  User,
  MessageCircle,
  HelpCircle,
  Info,
  Sparkles,
  ChevronsDown,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    {
      id: "initial-bot-1",
      type: "bot",
      content:
        "Assalamu alaikum! 👋 Selamat datang di Asisten AI. Saya siap membantu Anda dengan informasi pendaftaran.",
      timestamp: new Date(),
    },
    {
      id: "initial-bot-2",
      type: "bot",
      content:
        "Silakan ajukan pertanyaan tentang jalur pendaftaran, program studi, biaya, atau jadwal. Anda juga bisa memilih topik di bawah ini.",
      timestamp: new Date(),
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const { toast } = useToast();

  const aiIconUrl =
    "https://i.pinimg.com/originals/0c/67/5a/0c675a8e1061478d2b7b21b330093444.gif";

  const quickTopics = [
    {
      name: "Jalur Daftar",
      icon: <MessageCircle size={16} className="mr-1.5 text-primary" />,
    },
    {
      name: "Biaya Studi",
      icon: <HelpCircle size={16} className="mr-1.5 text-primary" />,
    },
    {
      name: "Prodi S1",
      icon: <Info size={16} className="mr-1.5 text-primary" />,
    },
    {
      name: "KIP Kuliah",
      icon: <Sparkles size={16} className="mr-1.5 text-primary" />,
    },
    {
      name: "Akreditasi",
      icon: <ShieldCheck size={16} className="mr-1.5 text-primary" />,
    },
  ];

  const handleScroll = () => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainer;
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 300);
    }
  };

  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior, block: "end" });
  };

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    chatContainer?.addEventListener("scroll", handleScroll);
    return () => chatContainer?.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      const isScrolledToBottom =
        chatContainer.scrollHeight - chatContainer.clientHeight <=
        chatContainer.scrollTop + 1;
      if (isScrolledToBottom || messages.length <= 3) {
        scrollToBottom("smooth");
      }
    }
  }, [messages, isTyping]);

  const handleSendMessage = (content) => {
    const messageText = content || inputMessage;
    if (!messageText.trim()) return;

    const newMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      content: messageText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    if (!content) setInputMessage("");
    setIsTyping(true);
    scrollToBottom("smooth");

    setTimeout(() => {
      setIsTyping(false);
      const botResponse = {
        id: `bot-${Date.now()}`,
        type: "bot",
        content: `Terima kasih atas pertanyaan Anda tentang "${
          messageText.length > 30
            ? messageText.substring(0, 27) + "..."
            : messageText
        }". Saya sedang memprosesnya... ⏳`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);

      setTimeout(() => {
        const detailedResponse = {
          id: `bot-detail-${Date.now()}`,
          type: "bot",
          content: `Info lebih lanjut terkait "${
            messageText.length > 30
              ? messageText.substring(0, 27) + "..."
              : messageText
          }" dapat Anda temukan di <a href="https://pmb.unismuh.ac.id" target="_blank" rel="noopener noreferrer" class="font-semibold underline text-primary hover:opacity-80">website PMB Unismuh</a> atau hubungi panitia. Detail spesifik belum tersedia di sini. 🙏`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, detailedResponse]);
      }, 2200);
    }, 1200);
  };

  const handleTopicClick = (topicName) => {
    handleSendMessage(`Info dong tentang ${topicName}.`);
    toast({
      title: "Topik Terpilih! 🎯",
      description: `"${topicName}" sedang dicari informasinya.`,
      duration: 2500,
      className:
        "bg-accent/10 border-accent text-accent-foreground dark:bg-accent/20 dark:border-accent/50",
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 1, 0.5, 1],
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };
  const inputAreaVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut", delay: 0.1 },
    },
  };
  const messageVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      x: -10,
      scale: 0.98,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  return (
    <div className="flex flex-col h-screen w-full items-center justify-center p-0 sm:py-4 md:py-6 bg-background">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col h-full w-full max-w-2xl bg-card/80 dark:bg-card/70 backdrop-blur-2xl shadow-2xl rounded-none sm:rounded-xl md:rounded-2xl overflow-hidden border border-border/70"
      >
        <motion.div
          variants={headerVariants}
          className="bg-card/90 dark:bg-card/80 backdrop-blur-sm shadow-md p-4 border-b border-border/60"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-secondary rounded-lg flex items-center justify-center shadow-lg ring-2 ring-primary/30 overflow-hidden">
              <img
                src={aiIconUrl}
                alt="Asisten AI"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                Asisten AI PMB
              </h1>
              <p className="text-xs text-muted-foreground flex items-center">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 ring-1 ring-green-300 animate-pulse"></span>
                Online & Responsif
              </p>
            </div>
          </div>
        </motion.div>

        <div
          ref={chatContainerRef}
          className="flex-1 flex flex-col gap-3 p-3 sm:p-4 overflow-y-auto custom-scrollbar min-h-0 relative"
        >
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-end gap-2 max-w-[80%] md:max-w-[70%] ${
                    message.type === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden ${
                      message.type === "bot" ? "bg-secondary" : "bg-primary"
                    }`}
                  >
                    {message.type === "bot" ? (
                      <img
                        src={aiIconUrl}
                        alt="Bot"
                        className="w-full h-full object-cover p-0.5"
                      />
                    ) : (
                      <User className="w-4 h-4 text-primary-foreground" />
                    )}
                  </div>

                  <div
                    className={`rounded-lg md:rounded-xl px-3.5 py-2.5 shadow-lg text-sm ${
                      message.type === "bot"
                        ? "bg-secondary text-secondary-foreground border border-border/50"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    <p
                      className="leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: message.content.replace(
                          /\[(.*?)\]\((.*?)\)/g,
                          '<a href="$2" target="_blank" rel="noopener noreferrer" class="font-semibold underline hover:opacity-80">$1</a>'
                        ),
                      }}
                    ></p>
                    <p
                      className={`text-xs mt-1 ${
                        message.type === "bot"
                          ? "text-muted-foreground/80"
                          : "text-primary-foreground/70"
                      } text-opacity-80 text-right`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              layout
              className="flex justify-start"
            >
              <div className="flex items-end gap-2">
                <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden">
                  <img
                    src={aiIconUrl}
                    alt="Bot Typing"
                    className="w-full h-full object-cover p-0.5"
                  />
                </div>
                <div className="bg-secondary border border-border/50 rounded-lg md:rounded-xl px-3.5 py-3 shadow-lg">
                  <div className="flex gap-1 items-center">
                    <div className="w-1.5 h-1.5 bg-muted-foreground/70 rounded-full animate-bounce"></div>
                    <div
                      className="w-1.5 h-1.5 bg-muted-foreground/70 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-1.5 h-1.5 bg-muted-foreground/70 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} className="h-0.5" />

          <AnimatePresence>
            {showScrollButton && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-4 right-4 z-10"
              >
                <Button
                  onClick={() => scrollToBottom("smooth")}
                  size="icon"
                  variant="secondary"
                  className="rounded-full h-10 w-10 shadow-lg"
                >
                  <ChevronsDown size={20} />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          variants={inputAreaVariants}
          className="bg-card/90 dark:bg-card/80 backdrop-blur-sm shadow-[-4px_0px_10px_rgba(0,0,0,0.05)] dark:shadow-[-4px_0px_15px_rgba(0,0,0,0.2)] p-3 sm:p-4 border-t border-border/60"
        >
          <div className="mb-2.5 flex flex-wrap gap-1.5 justify-center sm:justify-start">
            {quickTopics.map((topic) => (
              <motion.button
                key={topic.name}
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleTopicClick(topic.name)}
                className="topic-chip flex items-center bg-secondary/70 hover:bg-secondary dark:bg-secondary/60 dark:hover:bg-secondary text-foreground/80 dark:text-foreground/70 px-2.5 py-1 rounded-md text-xs font-medium border border-border/50 dark:border-border/40 transition-colors"
              >
                {topic.icon}
                {topic.name}
              </motion.button>
            ))}
          </div>
          <div className="flex gap-2 sm:gap-3 items-center">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tulis pesan Anda..."
              className="message-input flex-1 bg-input/80 dark:bg-input/70 border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40 h-10 sm:h-11 text-sm rounded-lg"
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() && !isTyping}
              variant="default"
              className="send-button h-10 w-10 sm:h-11 sm:w-11 p-0 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </motion.div>
      </motion.div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 7px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: hsl(var(--border));
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: hsl(var(--accent));
        }
      `}</style>
    </div>
  );
};

export default ChatbotPage;
