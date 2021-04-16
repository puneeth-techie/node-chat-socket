const socket = io();

const totalClient = document.getElementById("client-total");
const nameInput = document.getElementById("name-input");
const messageContainer = document.getElementById("message-container");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

const messageTone = new Audio("../message-tone.mp3");

const sendMessage = () => {
  if (messageInput.value === "") return;
  //   console.log(messageInput.value);
  const data = {
    name: nameInput.value,
    message: messageInput.value,
    date: new Date(),
  };

  /** Emmitting message event to the server */
  socket.emit("message", data);
  addMessageToUI(true, data);
  messageInput.value = "";
};

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});

/** listening for totalClients event from server */
socket.on("totalClients", (data) => {
  totalClient.innerText = `Total clients: ${data}`;
});

/** listening for chat-message event from server */
socket.on("chat-message", (data) => {
  //   console.log(data);
  messageTone.play();
  addMessageToUI(false, data);
});

/** add message to UI */
const addMessageToUI = (isOwnMessage, data) => {
  clearFeedback();
  const element = `
    <li class=${isOwnMessage ? "message-right" : "message-left"}>
        <p class="message">
            ${data.message}
            <span>${data.name} ● ${moment(data.dateTime).fromNow()}</span>
        </p>
    </li>`;
  messageContainer.innerHTML += element;
  scrollToBottom();
};

/** scrolling messages automatically */
const scrollToBottom = () => {
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
};

/** feeback listener */
messageInput.addEventListener("focus", (e) => {
  socket.emit("feedback", {
    feedback: `✍️ ${nameInput.value} is typing a message...`,
  });
});

messageInput.addEventListener("keypress", (e) => {
  socket.emit("feedback", {
    feedback: `✍️ ${nameInput.value} is typing a message...`,
  });
});

messageInput.addEventListener("blur", (e) => {
  socket.emit("feedback", {
    feedback: ``,
  });
});

/** listening feedback event */
socket.on("feedback", (data) => {
  clearFeedback();
  const element = `
    <li class="message-feedback">
        <p class="feedback" id="feedback">${data.feedback}</p>
    </li>
    `;
  messageContainer.innerHTML += element;
});

/** clearing the feedback */
const clearFeedback = () => {
  document.querySelectorAll("li.message-feedback").forEach((element) => {
    element.parentNode.removeChild(element);
  });
};
