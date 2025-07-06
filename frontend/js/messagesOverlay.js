// messagesOverlay.js
import { createModal } from './modal.js';

export function showMessagesOverlay() {
  createModal({
    id: "",
    title: "messages",
    bodyHTML: `
            <div class="messages-container">
                <div class="conversations">
                    <div class="conversation-header">
                        <h3>Conversations</h3>
                    </div>
                    <ul class="conversation-list">
                        <li class="conversation-item active">
                            <div class="conversation-avatar">
                                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Sarah Johnson">
                            </div>
                            <div class="conversation-info">
                                <div class="conversation-name">Sarah Johnson</div>
                                <div class="conversation-preview">Thanks for the session today! Let me know if you have any questions about the homework.</div>
                            </div>
                        </li>
                        <li class="conversation-item">
                            <div class="conversation-avatar">
                                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="David Chen">
                            </div>
                            <div class="conversation-info">
                                <div class="conversation-name">David Chen</div>
                                <div class="conversation-preview">I've scheduled our next session for Tuesday at 4pm. Does that work for you?</div>
                            </div>
                        </li>
                        <li class="conversation-item">
                            <div class="conversation-avatar">
                                <img src="https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Maria Rodriguez">
                            </div>
                            <div class="conversation-info">
                                <div class="conversation-name">Maria Rodriguez</div>
                                <div class="conversation-preview">Here's the reading material for our next lesson...</div>
                            </div>
                        </li>
                    </ul>
                </div>
                
                <div class="chat-area">
                    <div class="chat-header">
                        <div class="conversation-avatar">
                            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Sarah Johnson">
                        </div>
                        <div>
                            <div class="conversation-name">Sarah Johnson</div>
                            <div>Mathematics Tutor</div>
                        </div>
                    </div>
                    
                    <div class="chat-messages">
                        <div class="message received">
                            Hi Alex! How are you doing with the calculus problems we discussed?
                            <div class="message-time">10:15 AM</div>
                        </div>
                        
                        <div class="message sent">
                            Hi Sarah! I was able to solve the first few, but I'm stuck on problem 4. Could we go over it in our next session?
                            <div class="message-time">10:18 AM</div>
                        </div>
                        
                        <div class="message received">
                            Absolutely! I'd be happy to help. How about tomorrow at 3pm?
                            <div class="message-time">10:20 AM</div>
                        </div>
                        
                        <div class="message sent">
                            That works perfectly for me. Thanks!
                            <div class="message-time">10:22 AM</div>
                        </div>
                    </div>
                    
                    <div class="chat-input">
                        <input type="text" placeholder="Type your message...">
                        <button class="btn btn-primary">Send</button>
                    </div>
                </div>
            </div>
        </div>
`,
  });
}
