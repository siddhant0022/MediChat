"use client";
import React from "react";
import { useEffect, useRef, useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import {
    CircleUserRound,
    SendIcon,
    LoaderIcon,
    Stethoscope,
    Heart,
    Pill,
    Activity,
} from "lucide-react";
import { motion } from "framer-motion";


interface UseAutoResizeTextareaProps {
    minHeight: number;
    maxHeight?: number;
}

function useAutoResizeTextarea({
    minHeight,
    maxHeight,
}: UseAutoResizeTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = useCallback(
        (reset?: boolean) => {
            const textarea = textareaRef.current;
            if (!textarea) return;

            if (reset) {
                textarea.style.height = `${minHeight}px`;
                return;
            }

            textarea.style.height = `${minHeight}px`;
            const newHeight = Math.max(
                minHeight,
                Math.min(
                    textarea.scrollHeight,
                    maxHeight ?? Number.POSITIVE_INFINITY
                )
            );

            textarea.style.height = `${newHeight}px`;
        },
        [minHeight, maxHeight]
    );

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = `${minHeight}px`;
        }
    }, [minHeight]);

    useEffect(() => {
        const handleResize = () => adjustHeight();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [adjustHeight]);

    return { textareaRef, adjustHeight };
}

interface CommandSuggestion {
    icon: React.ReactNode;
    label: string;
    description: string;
    prefix: string;
}

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  containerClassName?: string;
  showRing?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, containerClassName, showRing = true, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    
    return (
      <div className={cn(
        "relative",
        containerClassName
      )}>
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
            "transition-all duration-200 ease-in-out",
            "placeholder:text-muted-foreground",
            "disabled:cursor-not-allowed disabled:opacity-50",
            showRing ? "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" : "",
            className
          )}
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {showRing && isFocused && (
          <motion.span 
            className="absolute inset-0 rounded-md pointer-events-none ring-2 ring-offset-0 ring-violet-500/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}

        {props.onChange && (
          <div 
            className="absolute bottom-2 right-2 opacity-0 w-2 h-2 bg-violet-500 rounded-full"
            style={{
              animation: 'none',
            }}
            id="textarea-ripple"
          />
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export function AnimatedAIChat() {
    const [value, setValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [activeSuggestion, setActiveSuggestion] = useState<number>(-1);
    const [showCommandPalette, setShowCommandPalette] = useState(false);
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 60,
        maxHeight: 200,
    });
    const commandPaletteRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const commandSuggestions: CommandSuggestion[] = [
        { 
            icon: <Stethoscope className="w-4 h-4" />, 
            label: "Diagnose Symptoms", 
            description: "Get medical diagnosis for symptoms", 
            prefix: "/diagnose" 
        },
        { 
            icon: <Pill className="w-4 h-4" />, 
            label: "Medication Info", 
            description: "Get information about medications", 
            prefix: "/medication" 
        },
        { 
            icon: <Heart className="w-4 h-4" />, 
            label: "Health Check", 
            description: "General health assessment", 
            prefix: "/health" 
        },
        { 
            icon: <Activity className="w-4 h-4" />, 
            label: "Treatment Guide", 
            description: "Get treatment recommendations", 
            prefix: "/treatment" 
        },
    ];

    // Auto-scroll to bottom when new messages are added
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (value.startsWith('/') && !value.includes(' ')) {
            setShowCommandPalette(true);
            
            const matchingSuggestionIndex = commandSuggestions.findIndex(
                (cmd) => cmd.prefix.startsWith(value)
            );
            
            if (matchingSuggestionIndex >= 0) {
                setActiveSuggestion(matchingSuggestionIndex);
            } else {
                setActiveSuggestion(-1);
            }
        } else {
            setShowCommandPalette(false);
        }
    }, [value]);

    useEffect(() => {
        const handleMouseMove = () => {
            // Mouse position tracking removed
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const commandButton = document.querySelector('[data-command-button]');
            
            if (commandPaletteRef.current && 
                !commandPaletteRef.current.contains(target) && 
                !commandButton?.contains(target)) {
                setShowCommandPalette(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (showCommandPalette) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveSuggestion(prev => 
                    prev < commandSuggestions.length - 1 ? prev + 1 : 0
                );
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveSuggestion(prev => 
                    prev > 0 ? prev - 1 : commandSuggestions.length - 1
                );
            } else if (e.key === 'Tab' || e.key === 'Enter') {
                e.preventDefault();
                if (activeSuggestion >= 0) {
                    const selectedCommand = commandSuggestions[activeSuggestion];
                    setValue(selectedCommand.prefix + ' ');
                    setShowCommandPalette(false);
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                setShowCommandPalette(false);
            }
        } else if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (value.trim()) {
                handleSendMessage();
            }
        }
    };

    const handleSendMessage = async () => {
        if (value.trim()) {
            setMessages((msgs) => [...msgs, { role: "user", text: value }]);
            setIsTyping(true);
            setValue("");
            adjustHeight(true);

            try {
                const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
                const res = await fetch(`${API_URL}/api/chat`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ question: value }),
                });
                
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                
                const data = await res.json();
                setMessages((msgs) => [...msgs, { role: "ai", text: data.answer }]);
            } catch (err) {
                console.error("API Error:", err);
                setMessages((msgs) => [...msgs, { role: "ai", text: "Sorry, something went wrong. Please check your environment variables and API keys." }]);
            }
            setIsTyping(false);
        }
    };

    const selectCommandSuggestion = (index: number) => {
        const selectedCommand = commandSuggestions[index];
        setValue(selectedCommand.prefix + ' ');
        setShowCommandPalette(false);
    };

    return (
        <div className="min-h-screen flex flex-col w-full items-center justify-center bg-black p-6 relative overflow-hidden">
            {/* Subtle background elements matching the site theme */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full mix-blend-normal filter blur-[128px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full mix-blend-normal filter blur-[128px] animate-pulse delay-700" />
                <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-white/5 rounded-full mix-blend-normal filter blur-[96px] animate-pulse delay-1000" />
            </div>
            
            <div className="w-full max-w-4xl mx-auto relative">
                <motion.div 
                    className="relative z-10 space-y-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <div className="text-center space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="inline-block"
                        >
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10">
                                    <Stethoscope className="w-7 h-7 text-white" />
                                </div>
                                <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                                    MediChat
                                </h1>
                            </div>
                            <h2 className="text-2xl font-medium text-white/80 mb-2">
                                Your AI Medical Assistant
                            </h2>
                            <motion.div 
                                className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: "100%", opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                            />
                        </motion.div>
                        <motion.p 
                            className="text-white/60 text-xl"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            Ask me about symptoms, diseases, treatments, or medications
                        </motion.p>
                    </div>

                    <motion.div 
                        className="relative backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 shadow-2xl h-[600px] flex flex-col"
                        initial={{ scale: 0.98 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        {/* Chat messages area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {messages.length === 0 && (
                                <div className="text-center text-white/60 mt-8">
                                    <Stethoscope className="w-16 h-16 mx-auto mb-4 text-white/80" />
                                    <p className="text-xl font-medium text-white/90">Welcome to MediChat!</p>
                                    <p className="text-lg text-white/60">I'm here to help with your health questions.</p>
                                </div>
                            )}
                            
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={cn(
                                        "flex gap-4",
                                        msg.role === "user" ? "justify-end" : "justify-start"
                                    )}
                                >
                                    {msg.role === "ai" && (
                                        <div className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center flex-shrink-0 border border-white/10">
                                            <Stethoscope className="w-5 h-5 text-white" />
                                        </div>
                                    )}
                                    
                                    <div className={cn(
                                        "max-w-[80%] rounded-2xl px-6 py-4",
                                        msg.role === "user" 
                                            ? "bg-white/10 backdrop-blur-xl text-white border border-white/10" 
                                            : "bg-white/5 backdrop-blur-xl text-white/90 border border-white/5"
                                    )}>
                                        <p className="text-base leading-relaxed font-medium">{msg.text}</p>
                                    </div>
                                    
                                    {msg.role === "user" && (
                                        <div className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center flex-shrink-0 border border-white/10">
                                            <CircleUserRound className="w-5 h-5 text-white" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                            
                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-4 justify-start"
                                >
                                    <div className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center flex-shrink-0 border border-white/10">
                                        <Stethoscope className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <span className="text-base text-white/80 font-medium">MediChat is typing</span>
                                            <TypingDots />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input area */}
                        <div className="p-6 border-t border-white/10 bg-white/5 rounded-b-3xl">
                            <div className="flex items-end gap-4">
                                <div className="flex-1">
                                    <Textarea
                                        ref={textareaRef}
                                        value={value}
                                        onChange={(e) => {
                                            setValue(e.target.value);
                                            adjustHeight();
                                        }}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Describe your symptoms or ask a medical question..."
                                        containerClassName="w-full"
                                        className={cn(
                                            "w-full px-6 py-4",
                                            "resize-none",
                                            "bg-white/5 backdrop-blur-xl",
                                            "border border-white/10 rounded-2xl",
                                            "text-white text-base font-medium",
                                            "focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20",
                                            "placeholder:text-white/40",
                                            "min-h-[70px]"
                                        )}
                                        style={{
                                            overflow: "hidden",
                                        }}
                                        showRing={false}
                                    />
                                </div>
                                
                                <motion.button
                                    type="button"
                                    onClick={handleSendMessage}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    disabled={isTyping || !value.trim()}
                                    className={cn(
                                        "px-8 py-4 rounded-2xl text-base font-semibold transition-all",
                                        "flex items-center gap-3",
                                        value.trim()
                                            ? "bg-white/10 backdrop-blur-xl text-white border border-white/10 hover:bg-white/15"
                                            : "bg-white/5 text-white/40 cursor-not-allowed border border-white/5"
                                    )}
                                >
                                    {isTyping ? (
                                        <LoaderIcon className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <SendIcon className="w-5 h-5" />
                                    )}
                                    <span>Send</span>
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Medical action buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        {commandSuggestions.map((suggestion, index) => (
                            <motion.button
                                key={suggestion.prefix}
                                onClick={() => selectCommandSuggestion(index)}
                                className="flex items-center gap-3 px-6 py-4 bg-white/5 backdrop-blur-xl hover:bg-white/10 rounded-2xl text-base text-white/90 hover:text-white transition-all border border-white/10"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {suggestion.icon}
                                <span className="font-semibold">{suggestion.label}</span>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function TypingDots() {
    return (
        <div className="flex items-center ml-1">
            {[1, 2, 3].map((dot) => (
                <motion.div
                    key={dot}
                    className="w-1.5 h-1.5 bg-white/90 rounded-full mx-0.5"
                    initial={{ opacity: 0.3 }}
                    animate={{ 
                        opacity: [0.3, 0.9, 0.3],
                        scale: [0.85, 1.1, 0.85]
                    }}
                    transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: dot * 0.15,
                        ease: "easeInOut",
                    }}
                    style={{
                        boxShadow: "0 0 4px rgba(255, 255, 255, 0.3)"
                    }}
                />
            ))}
        </div>
    );
}

const rippleKeyframes = `
@keyframes ripple {
  0% { transform: scale(0.5); opacity: 0.6; }
  100% { transform: scale(2); opacity: 0; }
}
`;

if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.innerHTML = rippleKeyframes;
    document.head.appendChild(style);
}


