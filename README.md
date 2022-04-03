
# chat

for chatting


## ideas

- chat is p2p
- service worker stores outgoing message queue when offline
- join chat by scanning qr code


## to run

```bash
git clone micburks/chat micburks-chat
cd micburks-chat
yarn
yarn start
```

# TODO

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

### chats can have multiple users
- This is possible but requires keeping track of all peers, connecting to each,
  and sending messages to all
