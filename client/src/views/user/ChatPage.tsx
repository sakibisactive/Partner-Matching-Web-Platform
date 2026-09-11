import React, { useState, useEffect, useRef } from 'react';
import { useGetChatsQuery, useGetMessagesQuery, useSendMessageMutation } from '../../redux/services/messageApi';
import { useSocket } from '../../contexts/SocketContext';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { MessageSquare, Send, User, Sparkles, CheckCheck } from 'lucide-react';
import { Avatar } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

export const ChatPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { socket, onlineUsers } = useSocket();

  const { data: chatsData } = useGetChatsQuery({});
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const { data: messagesData, refetch: refetchMessages } = useGetMessagesQuery(selectedChatId, {
    skip: !selectedChatId,
  });

  const [sendMessage] = useSendMessageMutation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto select first chat
  useEffect(() => {
    if (chatsData?.chats?.length > 0 && !selectedChatId) {
      setSelectedChatId(chatsData.chats[0]._id);
    }
  }, [chatsData]);

  // Join Socket chat room
  useEffect(() => {
    if (socket && selectedChatId) {
      socket.emit('join_chat', selectedChatId);

      socket.on('receive_message', (msg: any) => {
        if (msg.chatId === selectedChatId) {
          refetchMessages();
        }
      });

      socket.on('typing', () => setIsTyping(true));
      socket.on('stop_typing', () => setIsTyping(false));

      return () => {
        socket.off('receive_message');
        socket.off('typing');
        socket.off('stop_typing');
      };
    }
  }, [socket, selectedChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesData]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedChatId) return;

    const textToSend = messageText;
    setMessageText('');

    try {
      await sendMessage({ chatId: selectedChatId, messageText: textToSend }).unwrap();
      refetchMessages();
    } catch (e) {}
  };

  const getOtherParticipant = (chat: any) => {
    return chat.participants?.find((p: any) => p._id !== user?.id) || chat.participants?.[0];
  };

  const currentChat = chatsData?.chats?.find((c: any) => c._id === selectedChatId);
  const currentOther = currentChat ? getOtherParticipant(currentChat) : null;
  const isCurrentOtherOnline = currentOther ? onlineUsers.includes(currentOther._id) : false;

  return (
    <div className="h-[78vh] rounded-3xl glass-container border border-white/20 flex overflow-hidden shadow-2xl backdrop-blur-xl">
      {/* Sidebar: Chats List */}
      <div className="w-full sm:w-80 border-r border-white/10 bg-black/30 backdrop-blur-md flex flex-col">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white font-outfit">Messages</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-400/30 shadow-sm">
              {chatsData?.chats?.length || 0}
            </span>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto divide-y divide-white/[0.06]">
          {chatsData?.chats?.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-rose-400 opacity-60" />
              <p className="font-semibold text-slate-300">No conversations yet.</p>
              <p className="mt-1 text-slate-400">Connect with someone from Discover to start chatting!</p>
            </div>
          ) : (
            chatsData?.chats?.map((chat: any) => {
              const other = getOtherParticipant(chat);
              const isOnline = onlineUsers.includes(other?._id || other?.id);
              const isSelected = selectedChatId === (chat._id || chat.id);

              return (
                <button
                  key={chat._id || chat.id}
                  onClick={() => setSelectedChatId(chat._id || chat.id)}
                  className={`w-full p-4 text-left flex items-center gap-3 transition-all ${
                    isSelected
                      ? 'bg-white/10 border-l-4 border-rose-500 shadow-inner'
                      : 'hover:bg-white/[0.05]'
                  }`}
                >
                  <Avatar
                    fallback={other?.name || 'User'}
                    size="md"
                    isOnline={isOnline}
                    className="border border-white/20"
                  />

                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white truncate font-outfit">{other?.name || 'Partner'}</h4>
                    </div>
                    <p className="text-xs text-slate-300 truncate mt-0.5">
                      {chat.lastMessage?.text || 'Start conversation...'}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="hidden sm:flex flex-grow flex-col bg-black/20 backdrop-blur-md">
        {selectedChatId ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 bg-black/30 backdrop-blur-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar
                  fallback={currentOther?.name || 'User'}
                  size="sm"
                  isOnline={isCurrentOtherOnline}
                  className="border border-white/20"
                />
                <div>
                  <h3 className="text-sm font-bold text-white font-outfit">{currentOther?.name || 'Direct Chat'}</h3>
                  <div className="text-[11px] text-slate-300 flex items-center gap-1.5 font-medium">
                    {isCurrentOtherOnline ? (
                      <span className="text-emerald-400 font-semibold">Online</span>
                    ) : (
                      <span>Offline</span>
                    )}
                    {isTyping && <span className="text-rose-400 font-semibold animate-pulse">• Typing...</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {messagesData?.messages?.map((msg: any) => {
                const isMe = (msg.sender === user?.id) || (msg.senderId === user?.id);
                return (
                  <div key={msg._id || msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-md px-4 py-2.5 rounded-2xl text-sm ${
                        isMe
                          ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-br-sm shadow-lg shadow-rose-500/25 border border-rose-400/30'
                          : 'glass-container-card text-slate-100 rounded-bl-sm border border-white/20 shadow-md backdrop-blur-md'
                      }`}
                    >
                      <p className="leading-relaxed">{msg.message}</p>
                      <div className="flex items-center justify-end gap-1 mt-1 opacity-80 text-[10px]">
                        <span>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isMe && <CheckCheck className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-black/40 backdrop-blur-md flex items-center gap-2.5">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Write a message..."
                className="flex-grow px-4 py-2.5 rounded-xl border border-white/20 bg-black/40 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:border-rose-500/60 transition-all backdrop-blur-md shadow-inner"
              />
              <Button
                type="submit"
                variant="glow"
                size="default"
                disabled={!messageText.trim()}
                className="h-10 px-4 shadow-lg shadow-rose-500/25"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </>
        ) : (
          <div className="m-auto text-center max-w-sm p-8 space-y-5">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 group">
              <img
                src="/images/chat-hero.jpg"
                alt="Two people texting and laughing over coffee"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2 left-3 right-3 text-[11px] font-semibold text-rose-300 flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 fill-rose-400" />
                <span>Live Encrypted Messaging</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white font-outfit">Your Romantic Conversations</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Select a mutual match on the left to start chatting, or browse Discover to find new high-compatibility connections.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
