# ye-bail - WhatsApp Web API Library

A comprehensive WhatsApp Web automation library built on TypeScript, providing a complete API for interacting with WhatsApp Web through protocol bindings.

## Warning

This project is not affiliated, associated, authorized, endorsed by, or in any way officially connected with WhatsApp or any of its subsidiaries. The official WhatsApp website is at whatsapp.com.

The maintainers of ye-bail do not support the use of this application to violate WhatsApp's Terms of Service. We emphasize personal responsibility for users to use fairly and responsibly.

Use wisely. Avoid spam. Do not use excessive automation.

## Installation

### Stable Version

```bash
npm install github:yemobyte/ye-bail
```

### Edge Version (Latest Features)

```bash
npm install github:yemobyte/ye-bail
yarn add github:yemobyte/ye-bail
```

### Import in Code

```javascript
const { default: makeWASocket } = require("ye-bail")
import makeWASocket from "ye-bail"
```

## Quick Start

### Authentication & Connection

```javascript
const { default: makeWASocket, useMultiFileAuthState } = require('ye-bail')

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_ye_bail')
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
    })

    sock.ev.on('creds.update', saveCreds)
    
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            const shouldReconnect = 
                lastDisconnect?.error?.output?.statusCode !== 401
            if (shouldReconnect) {
                connectToWhatsApp()
            }
        } else if (connection === 'open') {
            console.log('Connected')
        }
    })

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0]
        console.log(msg)
    })
}

connectToWhatsApp()
```

## Message Types & Features

### Text Messages

```javascript
await sock.sendMessage(jid, { text: "Hello World" })
```

### Media Messages

#### Image
```javascript
await sock.sendMessage(jid, {
    image: { url: "https://example.com/image.jpg" },
    caption: "Image caption"
})
```

#### Video
```javascript
await sock.sendMessage(jid, {
    video: { url: "https://example.com/video.mp4" },
    caption: "Video caption"
})
```

#### Audio
```javascript
await sock.sendMessage(jid, {
    audio: { url: "https://example.com/audio.mp3" },
    mimetype: "audio/mpeg"
})
```

#### Document
```javascript
await sock.sendMessage(jid, {
    document: { url: "https://example.com/file.pdf" },
    filename: "document.pdf",
    mimetype: "application/pdf"
})
```

#### Sticker
```javascript
await sock.sendMessage(jid, {
    sticker: { url: "https://example.com/sticker.webp" }
})
```

### Interactive Messages

#### Buttons
```javascript
await sock.sendMessage(jid, {
    text: "Select an option",
    buttons: [
        { buttonId: "1", buttonText: { displayText: "Option 1" } },
        { buttonId: "2", buttonText: { displayText: "Option 2" } }
    ]
})
```

#### Interactive Buttons
```javascript
await sock.sendMessage(jid, {
    interactiveButtons: [
        {
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
                display_text: "Visit Website",
                url: "https://example.com"
            })
        }
    ]
})
```

#### Template Buttons
```javascript
await sock.sendMessage(jid, {
    text: "Message body",
    templateButtons: [
        {
            index: 1,
            urlButton: {
                displayText: "Visit",
                url: "https://example.com"
            }
        }
    ]
})
```

#### List Message
```javascript
await sock.sendMessage(jid, {
    text: "Select from list",
    sections: [
        {
            title: "Section 1",
            rows: [
                { rowId: "1", title: "Item 1", description: "Description 1" }
            ]
        }
    ],
    buttonText: "Select"
})
```

### Product & Shop Messages

#### Single Product
```javascript
await sock.sendMessage(jid, {
    product: {
        productId: "1234567890",
        name: "Product Name",
        description: "Product Description",
        retailerId: "123456",
        url: "https://example.com/product",
        productImage: { url: "https://example.com/image.jpg" },
        originalPrice: 10000,
        salePrice: 8000,
        currency: "IDR"
    }
})
```

#### Product List
```javascript
await sock.sendMessage(jid, {
    productList: [
        {
            title: "Section 1",
            products: [
                { productId: "1", name: "Product 1" }
            ]
        }
    ],
    title: "Catalog",
    text: "Check our products",
    businessOwnerJid: "60123456789@s.whatsapp.net"
})
```

#### Shop Storefront
```javascript
await sock.sendMessage(jid, {
    shop: "storefront_info",
    title: "My Shop",
    text: "Visit our shop"
})
```

#### Collection
```javascript
await sock.sendMessage(jid, {
    collection: {
        bizJid: "60123456789@s.whatsapp.net",
        id: "catalog-123",
        version: 1
    },
    title: "Collection Title"
})
```

### Carousel & Slides

#### Cards Carousel
```javascript
await sock.sendMessage(jid, {
    cards: [
        {
            title: "Card 1",
            body: "Card body text",
            footer: "Footer text",
            buttons: [
                { name: "cta_url", buttonParamsJson: JSON.stringify({ url: "https://example.com" }) }
            ],
            image: { url: "https://example.com/image.jpg" }
        }
    ]
})
```

### Poll & Results

#### Create Poll
```javascript
await sock.sendMessage(jid, {
    poll: {
        name: "What's your favorite color?",
        values: ["Red", "Blue", "Green"],
        selectableCount: 1
    }
})
```

#### Poll Result
```javascript
await sock.sendMessage(jid, {
    pollResult: {
        name: "Poll name",
        values: [
            ["Option A", 25],
            ["Option B", 18],
            ["Option C", 42]
        ]
    }
})
```

### Sticker Pack

```javascript
await sock.sendMessage(jid, {
    stickerPack: {
        name: "My Stickers",
        publisher: "Creator Name",
        description: "Amazing sticker pack",
        stickers: [
            {
                sticker: "./sticker1.webp",
                emojis: ["😂", "🎉"],
                isAnimated: false,
                isLottie: false
            }
        ],
        cover: "./cover.jpg"
    }
})
```

### Special Messages

#### Contacts
```javascript
await sock.sendMessage(jid, {
    contacts: {
        displayName: "Contact Group",
        contacts: [
            {
                vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:Name\nTEL:+60123456789\nEND:VCARD"
            }
        ]
    }
})
```

#### Location
```javascript
await sock.sendMessage(jid, {
    location: {
        degreesLatitude: 6.1256,
        degreesLongitude: 106.6858
    }
})
```

#### Disappearing Message
```javascript
await sock.sendMessage(jid, {
    text: "This message will disappear",
    disappearingMessagesInChat: 86400
})
```

#### Group Invite
```javascript
await sock.sendMessage(jid, {
    groupInvite: {
        groupJid: "120363xxxxxxxx@g.us",
        inviteCode: "xxxxx",
        groupName: "Group Name",
        caption: "Join our group!",
        jpegThumbnail: buffer
    }
})
```

#### Payment Request
```javascript
await sock.sendMessage(jid, {
    requestPayment: {
        currencyCodeIso4217: "USD",
        amount1000: 5000,
        requestFrom: "60123456789@s.whatsapp.net"
    }
})
```

### Message Actions

#### React to Message
```javascript
await sock.sendMessage(jid, {
    react: {
        text: "😂",
        key: messageKey
    }
})
```

#### Delete Message
```javascript
await sock.sendMessage(jid, {
    delete: messageKey
})
```

#### Forward Message
```javascript
await sock.sendMessage(jid, {
    forward: messageKey
})
```

#### Edit Message
```javascript
await sock.sendMessage(jid, {
    edit: messageKey,
    text: "Edited message"
})
```

#### Pin Message
```javascript
await sock.sendMessage(jid, {
    pin: {
        key: messageKey,
        type: "pin"
    }
})
```

### Group Operations

#### Create Group
```javascript
const groupMetadata = await sock.groupCreate(
    "Group Name",
    ["60123456789@s.whatsapp.net"]
)
```

#### Add Members
```javascript
await sock.groupParticipantsUpdate(
    "120363xxxxxxxx@g.us",
    ["60123456789@s.whatsapp.net"],
    "add"
)
```

#### Remove Members
```javascript
await sock.groupParticipantsUpdate(
    "120363xxxxxxxx@g.us",
    ["60123456789@s.whatsapp.net"],
    "remove"
)
```

#### Set Subject
```javascript
await sock.groupUpdateSubject("120363xxxxxxxx@g.us", "New Group Name")
```

#### Set Description
```javascript
await sock.groupUpdateDescription("120363xxxxxxxx@g.us", "New description")
```

### Chat Operations

#### Mark as Read
```javascript
await sock.readMessages([messageKey])
```

#### Mark as Unread
```javascript
await sock.chatModify({
    archive: false,
    pin: false,
    mute: 0,
    markUnread: true
}, jid)
```

#### Mute Chat
```javascript
await sock.chatModify({
    mute: 86400000
}, jid)
```

#### Archive Chat
```javascript
await sock.chatModify({
    archive: true
}, jid)
```

### Presence & Status

#### Send Presence
```javascript
await sock.sendPresenceUpdate("available", jid)
await sock.sendPresenceUpdate("unavailable", jid)
await sock.sendPresenceUpdate("composing", jid)
await sock.sendPresenceUpdate("recording", jid)
```

#### Get Contact Avatar
```javascript
const avatar = await sock.profilePictureUrl(jid)
```

#### Get User Status
```javascript
const status = await sock.fetchStatus(jid)
```

## API Reference

### Socket Methods

#### Connection
- `connect()` - Establish connection
- `logout()` - Logout and disconnect
- `end()` - Force disconnect

#### Messages
- `sendMessage(jid, content, options)` - Send message
- `downloadAndSaveMediaMessage(message, filename)` - Download media
- `sendReadReceipt(jid, participant, messageIds, type)` - Send receipt

#### Contacts
- `getContactsList()` - Get all contacts
- `onWhatsApp(...jids)` - Check contact status

#### Chats
- `getChatsList()` - Get all chats
- `deleteChat(jid)` - Delete chat
- `chatModify(modification, jid)` - Modify chat settings

#### Groups
- `groupCreate(subject, participants)` - Create group
- `groupParticipantsUpdate(jid, participants, action)` - Manage members
- `groupMetadata(jid)` - Get group info
- `groupUpdateSubject(jid, subject)` - Update group name
- `groupUpdateDescription(jid, description)` - Update description
- `groupToggleEphemeral(jid, duration)` - Set disappearing messages
- `groupLeave(jid)` - Leave group

### Event Listeners

```javascript
sock.ev.on('connection.update', callback)
sock.ev.on('creds.update', callback)
sock.ev.on('messages.upsert', callback)
sock.ev.on('message.edit', callback)
sock.ev.on('message.delete', callback)
sock.ev.on('message.reaction', callback)
sock.ev.on('chats.upsert', callback)
sock.ev.on('chats.update', callback)
sock.ev.on('chats.delete', callback)
sock.ev.on('contacts.upsert', callback)
sock.ev.on('contacts.update', callback)
sock.ev.on('presence.update', callback)
sock.ev.on('groups.upsert', callback)
sock.ev.on('group-participants.update', callback)
sock.ev.on('call', callback)
```

## Configuration Options

```javascript
const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    browser: Browsers.windows('Desktop'),
    syncFullHistory: false,
    maxMsgRetryCount: 15,
    retryRequestDelayMs: 100,
    msgRetryCounterCache: new NodeCache({ stdTTL: 10, checkperiod: 60 }),
    defaultQueryTimeoutMs: 0,
    logger: makeInMemoryStore(logger)
})
```

## Error Handling

```javascript
sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update
    
    if (connection === 'close') {
        const shouldReconnect = 
            lastDisconnect?.error?.output?.statusCode !== 401
        if (shouldReconnect) {
            connectToWhatsApp()
        } else {
            console.log('Connection closed')
        }
    }
})
```

## Performance Tips

1. Use `syncFullHistory: false` for faster startup
2. Cache group metadata when possible
3. Batch message sends when appropriate
4. Use message retry manager for reliability
5. Handle rate limiting properly

## Requirements

- Node.js 20+
- TypeScript 5.0+ (for development)
- Active WhatsApp account

## License

GNU General Public License v3.0

See LICENSE file for details

## Support & Community

For issues, feature requests, and discussions:
- GitHub Issues: https://github.com/yemobyte/ye-bail/issues
- Pull Requests: https://github.com/yemobyte/ye-bail/pulls

## Disclaimer

This project is provided as-is. Users are responsible for ensuring their use complies with WhatsApp's Terms of Service and applicable laws.
