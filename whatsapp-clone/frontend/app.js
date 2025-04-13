// Connect to Socket.io server
const socket = io('http://localhost:8000');

// DOM Elements
const messageInput = document.querySelector('input[type="text"]');
const messageContainer = document.querySelector('.overflow-y-auto');
const chatContainer = document.querySelector('.flex-1');

// Message template
function createMessageElement(message, isSender) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `flex ${isSender ? 'justify-end' : 'justify-start'} mb-4`;
  
  const contentDiv = document.createElement('div');
  contentDiv.className = `max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
    isSender ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'
  }`;
  contentDiv.textContent = message.content;
  
  messageDiv.appendChild(contentDiv);
  return messageDiv;
}

// Handle sending messages
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && messageInput.value.trim() !== '') {
    const message = {
      sender: 'currentUser', // Replace with actual user ID
      receiver: 'contactId', // Replace with actual contact ID
      content: messageInput.value
    };
    
    socket.emit('sendMessage', message);
    messageContainer.appendChild(createMessageElement(message, true));
    messageInput.value = '';
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
});

// Listen for new messages
socket.on('newMessage', (message) => {
  const isSender = message.sender === 'currentUser'; // Replace with actual check
  messageContainer.appendChild(createMessageElement(message, isSender));
  chatContainer.scrollTop = chatContainer.scrollHeight;
});

// Initial load of messages
async function loadMessages() {
  try {
    const response = await fetch('http://localhost:8000/api/messages');
    const messages = await response.json();
    messages.forEach(message => {
      const isSender = message.sender === 'currentUser'; // Replace with actual check
      messageContainer.appendChild(createMessageElement(message, isSender));
    });
    chatContainer.scrollTop = chatContainer.scrollHeight;
  } catch (error) {
    console.error('Error loading messages:', error);
  }
}

// Load messages when page loads
document.addEventListener('DOMContentLoaded', loadMessages);
