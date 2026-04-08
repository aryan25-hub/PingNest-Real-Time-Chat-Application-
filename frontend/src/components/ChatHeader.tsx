import { User } from "@/context/AppContext";
import { Menu, UserCircle } from "lucide-react";
import React from "react";

interface ChatHeaderProps {
  user: User | null;
  setSidebarOpen: (open: boolean) => void;
  isTyping: boolean;
  onlineUsers: string[];
}

const ChatHeader = ({
  user,
  setSidebarOpen,
  isTyping,
  onlineUsers,
}: ChatHeaderProps) => {
  const isOnlineUser = user && onlineUsers.includes(user._id);
  return (
    <>
      {/* mobile menu toggle */}
      <div className="sm:hidden fixed top-4 right-4 z-30">
        <button
          className="p-3 bg-black border border-[#2b2b2b] hover:border-[#93D420] rounded-lg transition-colors"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-5 h-5 text-gray-200" />
        </button>
      </div>

      {/* chat header */}
      <div className="mb-6 bg-black rounded-2xl border border-[#2b2b2b] p-6">
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="relative">
                <div
                  className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center
                "
                >
                  <UserCircle className="w-8 h-8 text-gray-300" />
                </div>
                {/* online user setup */}
                {isOnlineUser && (
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-gray-800">
                    <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></span>
                  </span>
                )}
              </div>

              {/* user info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-bold text-white truncate">
                    {user.name}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  {isTyping ? (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-[#93D420] rounded-full animate-bounce"></div>
                        <div
                          className="w-1.5 h-1.5 bg-[#93D420] rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-1.5 h-1.5 bg-[#93D420] rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-[#93D420] font-medium">
                        typing...
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isOnlineUser ? "bg-[#93D420]" : "bg-gray-600"
                        }`}
                      ></div>
                      <span
                        className={`text-sm font-medium ${
                          isOnlineUser ? "text-[#93D420]" : "text-gray-500"
                        }`}
                      >
                        {isOnlineUser ? "Online" : "Offline"}{" "}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#0d0d0d] border border-[#2b2b2b] flex items-center justify-center">
                <UserCircle className="w-8 h-8 text-gray-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-400">
                  Select a conversation
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Choose a chat from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatHeader;
