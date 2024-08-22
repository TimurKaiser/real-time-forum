import { CSSHandler } from "./setCSS.js";
import { LoadUserTemplate } from "./user.js";
import { LogoutUSer } from "./blog.js";
import { LoadBlogTemplate } from "./blog.js";

const chatTemplate = `<!DOCTYPE html>
<html lang="en">
  <body>
    <nav class="navbar">
      <a href="#">
        <h1 class="logo_title">Z01 FORUM</h1>
      </a>
      <ul>
        <li>
          <div class="back_to_blog">
            <button
              id="user_button_to_blog"
              class="button_to_blog"
              type="submit">
              RETOUR AU BLOG
              </button>
          </div>
        </li>
        <li>
          <button
            id="button_username"
            class="button_user_navbar"
            type="submit"
          ></button>
        </li>
        <li>
          <button id="button_exit" type="submit" name="username">
            <img src="/styles/img/exit.png" id="exit" alt="Exit" />
          </button>
        </li>
      </ul>
    </nav>

    <div class="container">
      <div class="box1">
        1
        <div class="membersList"></div>
      </div>
      <div class="box2">
        2
        <div id="chatHeader">Public Chat</div>
        <div class="chatAreaContainer">
          <button id="loadMoreBtn">Load More</button>
          <div class="chatArea">This is the chat area</div>
         </div>
      </div>
      <div class="box3">
        3
        <div class="writeArea">
          <!-- This is where I we write messages -->
          <textarea
            name="message"
            id="messageToSend"
            class="inputChat"
            cols="10"
            rows="1"
            placeholder="Send a message here...."
          ></textarea>
          <button id="sendMsgButton" class="sendMsg">Send</button>
        </div>
      </div>
    </div>
  </body>
</html>
`;

let ws;
let cookie = "";
let userName = "";
let currentRecipient = null;
let currentChatRecipient = null;
let offset = 0;
let limit = 10;
let isLoading = false;

function listCookies() {
  var theCookies = document.cookie.split(";");
  for (var i = 0; i < theCookies.length; i++) {
    cookie = theCookies[i].split("=")[0].trim(); // Get the cookie name and trim any extra spaces
    userName = cookie;
  }
  console.log(cookie);
}

function sendMessage() {
  const messageInput = document.getElementById("messageToSend");
  const message = messageInput.value;

  if (message && ws) {
    if (currentRecipient) {
      sendPrivateMessage(currentRecipient, message);
      console.log("C'est toi qui écrit en 2 ?");
    } else {
      console.log("TEST IN ELSE ");
      // const date = new Date().toISOString();
      // const messageData = {
      //   username: userName,
      //   text: message,
      //   date: date,
      //   type: "message",
      // };

      // ws.send(JSON.stringify(messageData));
      // console.log("Message Data sent :", messageData);

      // // Display the public message in the chat area immediately
      // updateChatArea(userName, message, date, null);
    }
    messageInput.value = ""; // Clear the input after sending
  }
}

function setupWebSocket() {
  ws = new WebSocket("ws://localhost:8003/ws");

  ws.onopen = () => {
    console.log("Connected to WebSocket server");
    ws.send(JSON.stringify({ username: userName, type: "users" }));
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("Data received :", data);
    // console.log(data.text);
    // console.log(data.date);

    if (data.type === "users") {
      // console.log("Calling updateUserList with:", data.users);
      updateUserList(data.users, data.connected);
    } else if (data.type == "message" && data.username && data.text) {
      if (
        data.recipient &&
        (data.recipient === userName || data.username === userName)
      ) {
        console.log(data.date);
        updateChatArea(data.username, data.text, data.date, data.recipient);
      } else {
        updateChatHeader();
        console.log("Message not for you");
      }
    } else {
      console.warn("Unknown message type received:", data.type);
    }
  };

  ws.onclose = () => {
    console.log("WebSocket connection closed");
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
  };
}

function updateChatArea(username, message, date, recipient) {
  console.log(date);
  const chatArea = document.querySelector(".chatArea");

  const localeDateString = new Date(date);
  const formatedDate = localeDateString.toLocaleString();
  // console.log(formatedDate);

  // Split the date and time parts
  const [localeDate, timePart] = formatedDate.split(" ");
  // Split the date part into day, month, and year
  const [day, month, year] = localeDate.split("/");
  // Construct the new date string in the desired format
  const formattedDate = `${year}-${month}-${day} ${timePart}`;
  console.log(formattedDate); // Output: 2024-08-20 11:14:08

  const isPrivate = recipient && recipient !== "";
  const isMessageForCurrentUser =
    (isPrivate && (recipient === userName || username === userName)) ||
    !isPrivate;

  if (!isMessageForCurrentUser) return;

  const messageDiv = document.createElement("div");

  if (isPrivate) {
    messageDiv.innerHTML += `<div><em>Private</em> ${formattedDate} - <strong>${username} to ${recipient}:</strong> ${message}</div>`;
  } else {
    chatArea.innerHTML += `<div>${formattedDate} - <strong>${username}:</strong> ${message}</div>`;
  }

  if (recipient) {
    messageDiv.innerHTML = `<div><em>Private</em> ${formattedDate} - <strong>${username} to ${recipient}:</strong> ${message}</div>`;
  } else {
    messageDiv.innerHTML = `<div>${formattedDate} - <strong>${username}:</strong> ${message}</div>`;
  }

  chatArea.appendChild(messageDiv);
  chatArea.scrollTop = chatArea.scrollHeight;
}

function updateUserList(users, connectedUsers) {
  const membersList = document.querySelector(".membersList");

  console.log("User list:", users);
  membersList.innerHTML = "";

  fetch(
    `http://localhost:8003/get_user_list_with_last_message?loggedInUsername=${userName}`
  )
    .then((response) => response.json())
    .then((users) => {
      console.log(users); // An array of user objects with last message timestamp

      // Sort users first by last message timestamp (most recent first), then alphabetically
      let sortedUsers = users.sort((a, b) => {
        if (a.lastMessageTimestamp && b.lastMessageTimestamp) {
          // Compare by timestamp if both have messages
          return (
            new Date(b.lastMessageTimestamp) - new Date(a.lastMessageTimestamp)
          );
        } else if (a.lastMessageTimestamp) {
          // a has a message, b does not
          return -1;
        } else if (b.lastMessageTimestamp) {
          // b has a message, a does not
          return 1;
        } else {
          // If neither have a message, sort alphabetically
          // return a.username.localeCompare(b.username);
          return a.username
            .toLowerCase()
            .localeCompare(b.username.toLowerCase());
        }
      });
      console.log("Sorted Users:", sortedUsers);

      // Clear the memberlist
      clearMemberlist();
      sortedUsers.forEach((user) => {
        // console.log(user.username);
        // console.log(userName);

        if (user.username === userName) {
          // Delete the username of the user who has logged into the blog
          return;
        }

        const userDiv = document.createElement("div");
        userDiv.innerText = user.username;
        if (connectedUsers.includes(user.username)) {
          userDiv.style.color = "green";
        } else {
          userDiv.style.color = "black";
        }

        userDiv.style.padding = "10px";

        userDiv.addEventListener("click", () => {
          currentRecipient = user.username;
          console.log("Selected recipient:", currentRecipient);
          console.log("User sending message:", userName);
          updateChatHeader();
          clearChatArea();
          LoadChatHistory(userName, currentRecipient);
        });
        membersList.appendChild(userDiv);
      });
    });
}

function sendPrivateMessage(recipient, messageText) {
  const messageInput = document.getElementById("messageToSend");
  const message = messageInput.value.trim();

  if (!message || !ws) return;

  const date = new Date().toISOString();

  const messagePayLoad = {
    username: userName,
    text: messageText,
    date: date,
    recipient: recipient,
    type: "message",
  };

  // if (currentChatRecipient) {
  //   messagePayLoad.recipient = currentChatRecipient;
  // }

  ws.send(JSON.stringify(messagePayLoad));
  console.log("Message Payload: ", messagePayLoad);
  messagePayLoad.value = "";
  updateChatArea(userName, messageText, date, recipient);
}

// function initiatePrivateChat(user) {
//   currentRecipient = user;
//   document.querySelector(".chatArea").innerHTML = "";
//   console.log("Initiated private chat with: ", user);
// }

function updateChatHeader() {
  const chatHeader = document.getElementById("chatHeader");
  if (currentRecipient) {
    chatHeader.innerText = `Private chat with ${currentRecipient}`;
  } else {
    chatHeader.innerText = "Public chat";
  }
}

function clearChatArea() {
  const chatArea = document.querySelector(".chatArea");
  chatArea.innerHTML = "";
}

function clearMemberlist() {
  const memberListClear = document.querySelector(".membersList");
  memberListClear.innerHTML = "";
}

// function LoadChatHistory(isInitialLoad = true) {
//   let userId;
//   let recipientId;

//   if (isInitialLoad) {
//     offset = 0; // Reset offset on initial load
//   }

//   // Fetch user ID from the server
//   fetch(`http://localhost:8003/get_user_id?username=${userName}`)
//     .then((response) => response.json())
//     .then((data) => {
//       userId = data.user_id;
//       console.log("User ID:", userId);

//       // Fetch recipient ID from the server
//       return fetch(
//         `http://localhost:8003/get_user_id?username=${currentRecipient}`
//       );
//     })
//     .then((response) => response.json())
//     .then((data) => {
//       recipientId = data.user_id;
//       console.log("Recipient ID:", recipientId);

//       // Ensure both IDs are valid integers
//       if (!userId || !recipientId || isNaN(userId) || isNaN(recipientId)) {
//         console.error("Invalid user ID or recipient ID");
//         return;
//       }

//       // Load chat history with pagination
//       return fetch(
//         `http://localhost:8003/chat_history?user_id=${userId}&recipient_id=${recipientId}&offset=${offset}&limit=${limit}`
//       );
//     })
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error("Error fetching chat history");
//       }
//       return response.json();
//     })
//     .then((messages) => {
//       const chatArea = document.querySelector(".chatArea");
//       let previousScrollHeight = chatArea.scrollHeight; // Track the scroll height before adding new messages

//       if (isInitialLoad) {
//         chatArea.innerHTML = ""; // Clear chat area on initial load
//       }

//       if (messages.length > 0) {
//         // Reverse messages to display from oldest to newest
//         messages.reverse().forEach((message) => {
//           const messageDiv = document.createElement("div");
//           if (message.recipient) {
//             messageDiv.className = "privateMessage";
//             messageDiv.innerHTML = `<div><em>Private</em> ${message.date} - <strong>${message.username} to ${message.recipient}:</strong> ${message.text}</div>`;
//           } else {
//             messageDiv.innerHTML = `<div>${message.date} - <strong>${message.username}:</strong> ${message.text}</div>`;
//           }
//           chatArea.prepend(messageDiv); // Add at the beginning for older messages
//         });

//         if (!isInitialLoad) {
//           chatArea.scrollTop = chatArea.scrollHeight - previousScrollHeight; // Adjust the scroll position
//         }

//         offset += messages.length; // Increment offset for the next batch
//       }

//       isLoading = false; // Finished loading
//     })
//     .catch((error) => {
//       console.error("Error loading chat history:", error);
//       isLoading = false;
//     });
// }

// function setupScrollListener() {
//   console.log("Inside setUPScrollListenr");
//   const chatArea = document.querySelector(".chatArea");

//   if (!chatArea) {
//     console.error("Chat area not found!");
//     return;
//   }

//   console.log("Scroll Height:", chatArea.scrollHeight);
//   console.log("Client Height:", chatArea.clientHeight);

//   document.querySelector(".chatArea").scrollTop = 100;

//   chatArea.addEventListener("scroll", () => {
//     console.log("Get Scrolled", chatArea.scrollTop);
//     // if (chatArea.scrollTop === 0 && !isLoading) {
//     //   // Scrolled to the top
//     //   isLoading = true;
//     //   LoadChatHistory(false); // Load more messages
//     // }
//   });
// }

function LoadChatHistory(isInitialLoad = true) {
  // clearChatArea();
  let userId;
  let recipientId;

  if (isInitialLoad) {
    offset = 0; // Reset offset on initial load
  }

  // Fetch user ID from the server
  fetch(`http://localhost:8003/get_user_id?username=${userName}`)
    .then((response) => response.json())
    .then((data) => {
      userId = data.user_id;

      // Fetch recipient ID from the server
      return fetch(
        `http://localhost:8003/get_user_id?username=${currentRecipient}`
      );
    })
    .then((response) => response.json())
    .then((data) => {
      recipientId = data.user_id;

      // Ensure both IDs are valid integers
      if (!userId || !recipientId || isNaN(userId) || isNaN(recipientId)) {
        console.error("Invalid user ID or recipient ID");
        return;
      }

      // Load chat history with pagination
      return fetch(
        `http://localhost:8003/chat_history?user_id=${userId}&recipient_id=${recipientId}&offset=${offset}&limit=${limit}`
      );
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error fetching chat history");
      }
      return response.json();
    })
    .then((messages) => {
      if (messages) {
        const chatArea = document.querySelector(".chatArea");

        if (isInitialLoad) {
          chatArea.innerHTML = ""; // Clear chat area on initial load
        }

        if (messages.length > 0) {
          const scrollPosition = chatArea.scrollHeight; // Track the current scroll position

          if (!isInitialLoad) {
            messages.reverse(); // Reverse the order of messages for older messages
          }

          messages.forEach((message) => {
            const messageDiv = document.createElement("div");
            if (message.recipient) {
              messageDiv.className = "privateMessage";
              messageDiv.innerHTML = `<div><em>Private</em> ${message.date} - <strong>${message.username} to ${message.recipient}:</strong> ${message.text}</div>`;
            } else {
              messageDiv.innerHTML = `<div>${message.date} - <strong>${message.username}:</strong> ${message.text}</div>`;
            }

            if (isInitialLoad) {
              chatArea.appendChild(messageDiv); // Append at the bottom for initial load
            } else {
              chatArea.insertBefore(messageDiv, chatArea.firstChild); // Insert older messages at the top
            }
          });

          if (isInitialLoad) {
            chatArea.scrollTop = chatArea.scrollHeight; // Scroll to the bottom on initial load
          } else {
            chatArea.scrollTop = chatArea.scrollHeight - scrollPosition; // Maintain scroll position when loading more
          }

          offset += messages.length; // Increment offset for the next batch
        } else {
          // No more messages to load
          const loadMoreBtn = document.getElementById("loadMoreBtn");
          loadMoreBtn.disabled = true; // Disable the button if no more messages
        }

        isLoading = false; // Finished loading
      }
    })
    .catch((error) => {
      console.error("Error loading chat history:", error);
      isLoading = false;
    });
}

function setupLoadMoreButton() {
  const loadMoreBtn = document.getElementById("loadMoreBtn");

  loadMoreBtn.addEventListener("click", () => {
    if (!isLoading) {
      isLoading = true;
      LoadChatHistory(false); // Load more messages
    }
  });
}

//--------------------------------------------------------Sorted by last conversation !!--------------------------------------

// function FetchUserList() {
//   fetch(`http://localhost:8003/get_user_list_with_last_message`)
//     .then((response) => response.json())
//     .then((users) => {
//       console.log(users); // An array of user objects with last message timestamp
//     })
//     .catch((error) => {
//       console.error("Error fetching user list:", error);
//     });
// }

//--------------------------------------------------------End of part sorting by last conversation !!--------------------------------------

export function LoadChatTemplate() {
  CSSHandler(["../styles/css/chat.css"]);
  listCookies();
  const getIndexPage = document.getElementById("page");
  getIndexPage.innerHTML = chatTemplate;

  const button_to_blog_user = document.getElementById("user_button_to_blog");
  const buttonUsername = document.getElementById("button_username");
  const exitButton = document.getElementById("button_exit");
  const sendMsgButton = document.getElementById("sendMsgButton");

  buttonUsername.addEventListener("click", LoadUserTemplate);
  button_to_blog_user.addEventListener("click", LoadBlogTemplate);
  buttonUsername.innerText = userName;
  exitButton.addEventListener("click", listCookies);
  exitButton.addEventListener("click", LogoutUSer);
  sendMsgButton.addEventListener("click", sendMessage); // Add event listener for sending messages

  setupWebSocket(); // Initialize WebSocket connection
  // setupScrollListener();
  setupLoadMoreButton();
  // FetchUserList();
}

// function getUserID(username) {
//   // This should be an async function ideally,
//   // but for simplicity, we assume synchronous call
//   let userID = 0;
//   const url = `http://localhost:8003/get_user_id?username=${username}`;

//   fetch(url)
//     .then((response) => response.json())
//     .then((data) => {
//       console.log("Data received from fetch get user id :", data);
//       userID = data.user_id;
//     })
//     .catch((error) => {
//       console.error("Error fetching user ID:", error);
//     });

//   return userID;
// }

// function setupUserClickHandlers() {
//   document.querySelectorAll(".memberList div").forEach((userDiv) => {
//     userDiv.addEventListener("click", () => {
//       const recipient = userDiv.innerText;
//       currentRecipient = recipient;
//       updateChatHeader();
//       LoadChatHistory(userName, recipient);
//     });
//   });
// }
