import { Loader2, Paperclip, Send, X } from "lucide-react";
import React, { useState } from "react";

interface MessageInputProps {
  selectedUser: string | null;
  message: string;
  setMessage: (message: string) => void;
  handleMessageSend: (e: any, imageFile?: File | null) => void;
}

const MessageInput = ({
  selectedUser,
  message,
  setMessage,
  handleMessageSend,
}: MessageInputProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!message.trim() && !imageFile) return;

    setIsUploading(true);
    await handleMessageSend(e, imageFile);
    setImageFile(null);
    setIsUploading(false);
  };

  if (!selectedUser) return null;
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 border-t border-[#2b2b2b] pt-2"
    >
      {imageFile && (
        <div className="relative w-fit">
          <img
            src={URL.createObjectURL(imageFile)}
            alt="preview"
            className="w-24 h-24 object-cover rounded-lg border border-[#2b2b2b]"
          />
          <button
            type="button"
            className="absolute -top-2 -right-2 bg-black rounded-full p-1"
            onClick={() => setImageFile(null)}
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <label className="cursor-pointer bg-black border border-[#2b2b2b] hover:border-[#93D420] rounded-lg px-3 py-2 transition-colors">
          <Paperclip size={18} className="text-gray-400" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && file.type.startsWith("image/")) {
                setImageFile(file);
              }
            }}
          />
        </label>

        <input
          type="text"
          className="flex-1 bg-black border border-[#2b2b2b] focus:border-[#93D420] rounded-lg px-4 py-2 text-white placeholder-gray-600 outline-none transition-colors"
          placeholder={imageFile ? "Add a caption..." : "Type a message..."}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          type="submit"
          disabled={(!imageFile && !message) || isUploading}
          className="bg-[#93D420] hover:opacity-90 px-4 py-2 rounded-lg transition-opacity flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed text-black"
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
