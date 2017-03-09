# lan-server
A basic socket server framework with LAN discovery features.

## Start a server

```typescript
import { LANServer, LANConnection, Message } from 'lan-server';

let server = new LANServer('application.server-type' /* or whatever */, {
	autostart: true,
	advertise: true
}).on('connection', (connection:LANConnection) => {
	connection.on('message', (message:Message) => {
		// dispatch message.payload object based on message.type
	});
});
```

## Find a server

```typescript
import { LANServer, LANServerInfo, LANConnection, Message } from 'lan-server';

LANServer.search('application.server-type' /* or "*" */, (foundServer:LANServerInfo) => {
	foundServer.connect((connection:LANConnection) => {
		connection.on('message', (message:Message) => {
			// handle message
		});
	});
});
```

## Your messages

There are two methods for creating custom messages.  The recommended method uses
TypeScript decorator functions defined in `github:glikker/serialize-ts`:

```typescript
import { serializable, serialized } from 'serialize-ts';

@serializable('my-app.my-message')
class MyMessage
{
	constructor() { }

	@serialized() messageProperty:string;
	@serialized('int') numberProperty:number;
}

function sendMessage(conn:LANConnection)
{
	let msg:MyMessage = new MyMessage();
	msg.messageProperty = "Hello";
	msg.numberProperty = 42;

	conn.send(new Message(msg));
}

function handleMessages(message:Message)
{
	if (message.type == MyMessage['serializedType'])
	{
		let myMessage:MyMessage = <MyMessage>message.payload;

		doMeaningfulStuffWith(myMessage);
	}
}
```

If you are not using TypeScript or don't want to use `serialize-ts` directly
(even though it is used under the hood for serializing packets), you can do it
this way:

```javascript
function sendMessage(conn:LANConnection)
{
	conn.send(new Message({
		messageProperty: "Hello",
		numberProperty: 42
	}, 'my-app.my-message'));
}

function handleMessages(message:Message)
{
	if (message.type == 'my-app.my-message')
	{
		doMeaningfulStuffWith(message.payload);
	}
}
```

These methods can be mixed and matched as well, so you can use formal classes
as well as anonymous objects for message payloads.  You can also include a
message type in the constructor to `Message` if you want to override the payload's
`serializedType` value.
