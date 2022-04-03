
# chat

for chatting

https://user-images.githubusercontent.com/6025752/161440220-5e4a8b4a-3d82-40e2-9531-363a5993cc01.mov


Peer to peer chat app

Node server does the following:
- Serves a few static assets
- Server-renders a single root path
- Upgrades to a websocket server
- Serves as a signaling server for initiating p2p connections

Browser:
- Manages a websocket connection to the signaling server 
- Creates or joins an existing chat session via websocket
- Connects to peer to send text messages


## to run

```bash
git clone micburks/chat micburks-chat
cd micburks-chat
yarn
yarn start
# cross fingers you don't hit a race condition
```


# what is next

### TURN/STUN server
- obviously this only works on a local network, would need NAT traversal for public use


### tests
- the signaling server is a critical user flow, needs integration tests


### data
- Use a proper database - lots of race conditions with current approach
- Ideally `chats` and `users` would have a one-to-many in the data model
- Destroy chats when all users disconnect
- It doesn't make much sense to create new instances of Database class
- Better tracking of connected users


### errors
- More robust error handling for sockets/p2p


### user flow
- Design a UI that isn't hideous
- Ask creator when another user tries to enter the chat, only share chatId when approved
- There are race conditions in the UI where you can send a message before p2p is established


### chats can have multiple users
- This is possible but requires keeping track of all peers, connecting to each,
  and sending messages to all


### offline usage
- messages should be batched in case websocket/p2p is temporarily lost
- service worker may also be able to store outgoing messages queue when offline
