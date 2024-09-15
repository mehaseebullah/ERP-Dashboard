import { io } from 'socket.io-client';
import { useChatStore } from '../stores/chat';

const SocketIOPlugin = {
  install(app, options) {
    const chatStore = useChatStore();
    const socket = io(options.url);
    socket.on('onConversationAdded', (data) => {
      chatStore.addConversation(data);
    });
    app.config.globalProperties.$socket = socket;
    app.provide('socket', socket);
  },
};

export default SocketIOPlugin;
