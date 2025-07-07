// messagesOverlay.js
import { createModal } from './modal.js';
import { showNotification } from '../notification.js';

export function showMessagesOverlay(preselectUserId = null) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) {
    showNotification('Please login to view your messages.', 'warning');
    return;
  }

  createModal({
    id: 'messagesModal',
    title: 'Messages',
    bodyHTML: `
      <div class="messages-container" style="max-height: 70vh; min-height: 40vh; overflow: auto;">
                <div class="conversations">
                    <div class="conversation-header">
                        <h3>Conversations</h3>
                    </div>
          <ul class="conversation-list" id="conversationList">
            <li class="loading">Loading...</li>
                    </ul>
                </div>
                <div class="chat-area">
          <div class="chat-header" id="chatHeader"></div>
          <div class="chat-messages" id="chatMessages">
            <div class="loading">Select a conversation</div>
                        </div>
          <form id="chatForm" class="chat-input" autocomplete="off">
            <input type="text" id="chatInput" placeholder="Type your message..." disabled>
            <button type="submit" class="btn btn-primary" id="sendMsgBtn" disabled>Send</button>
          </form>
                        </div>
                    </div>
    `,
  });

  fetchConversations(user.user_id, preselectUserId);

  // Send message handler (single form submit)
  setTimeout(() => {
    const chatForm = document.getElementById('chatForm');
    if (chatForm) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        sendMessage(user.user_id);
      });
    }
  }, 200);
}

let currentChatUser = null;
let conversationUsers = [];

async function fetchConversations(user_id, preselectUserId = null) {
  const list = document.getElementById('conversationList');
  if (!list) return;
  list.innerHTML = '<li class="loading">Loading...</li>';
  try {
    const res = await fetch(`http://localhost/tutors-connection-platform/backend/fetchMessages.php?user_id=${user_id}`);
    const data = await res.json();
    // Build unique conversation partners
    const usersMap = {};
    if (data.success && data.messages.length) {
      data.messages.forEach(msg => {
        const partnerId = msg.sender_id === user_id ? msg.receiver_id : msg.sender_id;
        if (!usersMap[partnerId]) {
          usersMap[partnerId] = {
            user_id: partnerId,
            last_message: msg.message_content,
            last_time: msg.created_at,
          };
        }
      });
    }
    conversationUsers = Object.values(usersMap);
    // Fetch user names/avatars for each partner
    await Promise.all(conversationUsers.map(async (u, i) => {
      const res = await fetch(`http://localhost/tutors-connection-platform/backend/getTutorProfile.php?tutor_id=${u.user_id}`);
      const data = await res.json();
      conversationUsers[i].name = data.user ? `${data.user.first_name} ${data.user.last_name}` : 'User ' + u.user_id;
      conversationUsers[i].avatar = data.user && data.user.profile_picture_url ? data.user.profile_picture_url : '/frontend/images/users/1.jpg';
    }));
    // Render list
    if (conversationUsers.length) {
      list.innerHTML = conversationUsers.map(u => `
        <li class="conversation-item" data-userid="${u.user_id}">
          <div class="conversation-avatar"><img src="${u.avatar}" alt="${u.name}"></div>
          <div class="conversation-info">
            <div class="conversation-name">${u.name}</div>
            <div class="conversation-preview">${u.last_message}</div>
                        </div>
        </li>
      `).join('');
      // Add click listeners
      list.querySelectorAll('.conversation-item').forEach(item => {
        item.addEventListener('click', () => {
          const partnerId = item.getAttribute('data-userid');
          currentChatUser = conversationUsers.find(u => u.user_id == partnerId);
          loadConversation(user_id, partnerId);
        });
      });
    } else {
      list.innerHTML = '<li class="no-conv">No conversations yet.</li>';
    }
    // If preselectUserId is provided, select or create chat
    if (preselectUserId) {
      let found = conversationUsers.find(u => u.user_id == preselectUserId);
      if (found) {
        // Simulate click to load conversation
        setTimeout(() => {
          const item = list.querySelector(`.conversation-item[data-userid="${preselectUserId}"]`);
          if (item) item.click();
        }, 100);
      } else {
        // No conversation yet: fetch user info and show empty chat area
        const chatHeader = document.getElementById('chatHeader');
        const chatMessages = document.getElementById('chatMessages');
        const input = document.getElementById('chatInput');
        const sendBtn = document.getElementById('sendMsgBtn');
        // Fetch user info
        const res = await fetch(`http://localhost/tutors-connection-platform/backend/getTutorProfile.php?tutor_id=${preselectUserId}`);
        const data = await res.json();
        const name = data.user ? `${data.user.first_name} ${data.user.last_name}` : 'User ' + preselectUserId;
        const avatar = data.user && data.user.profile_picture_url ? data.user.profile_picture_url : '/frontend/images/users/1.jpg';
        currentChatUser = { user_id: preselectUserId, name, avatar };
        if (chatHeader) {
          chatHeader.innerHTML = `
            <div class="conversation-avatar"><img src="${avatar}" alt="${name}"></div>
            <div><div class="conversation-name">${name}</div></div>
          `;
        }
        if (chatMessages) {
          chatMessages.innerHTML = '<div class="no-messages">No messages yet. Say hello!</div>';
        }
        if (input && sendBtn) {
          input.disabled = false;
          sendBtn.disabled = false;
        }
      }
    }
  } catch (err) {
    list.innerHTML = '<li class="error">Failed to load conversations.</li>';
  }
}

async function loadConversation(user_id, partner_id) {
  const chatHeader = document.getElementById('chatHeader');
  const chatMessages = document.getElementById('chatMessages');
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendMsgBtn');
  if (!chatHeader || !chatMessages) return;
  // Show header
  chatHeader.innerHTML = `
    <div class="conversation-avatar"><img src="${currentChatUser.avatar}" alt="${currentChatUser.name}"></div>
    <div><div class="conversation-name">${currentChatUser.name}</div></div>
  `;
  // Enable input
  input.disabled = false;
  sendBtn.disabled = false;
  // Load messages
  chatMessages.innerHTML = '<div class="loading">Loading...</div>';
  try {
    const res = await fetch(`http://localhost/tutors-connection-platform/backend/fetchConversation.php?user1_id=${user_id}&user2_id=${partner_id}`);
    const data = await res.json();
    if (!data.success) {
      chatMessages.innerHTML = '<div class="error">Failed to load messages.</div>';
      return;
    }
    chatMessages.innerHTML = data.messages.map(msg => {
      // Prevent accidental rendering of event objects
      let safeContent = msg.message_content;
      if (typeof safeContent !== 'string') safeContent = '';
      return `
        <div class="message ${msg.sender_id == user_id ? 'sent' : 'received'}">
          ${safeContent}
          <div class="message-time">${formatTime(msg.created_at)}</div>
        </div>
      `;
    }).join('');
    chatMessages.scrollTop = chatMessages.scrollHeight;
  } catch (err) {
    chatMessages.innerHTML = '<div class="error">Failed to load messages.</div>';
  }
}

async function sendMessage(user_id) {
  const input = document.getElementById('chatInput');
  if (!input || !currentChatUser) return;
  const text = input.value.trim();
  if (!text) return;
  try {
    const res = await fetch('http://localhost/tutors-connection-platform/backend/sendMessage.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender_id: user_id, receiver_id: currentChatUser.user_id, message_content: text })
    });
    const data = await res.json();
    if (data.success) {
      input.value = '';
      loadConversation(user_id, currentChatUser.user_id);
      fetchConversations(user_id); // update preview
    } else {
      showNotification(data.message || 'Failed to send message.', 'error');
    }
  } catch (err) {
    showNotification('Failed to send message.', 'error');
  }
}

function formatTime(dateString) {
  const d = new Date(dateString);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
