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
		// handle message
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

```typescript
import { Message } from 'lan-server';

class MyMessage extends Message
{
	constructor() { super(); }

	get messageProperty():string { return this.getProperty('messageProperty'); }
	set messageProperty(mp:string) { this.setProperty('messageProperty', mp); }

	get numberProperty():number { return parseFloat(this.getProperty('numberProperty'); }
	set numberProperty(np:number) { this.setProperty('numberProperty', np.toString(10)); }

	get optionalProperty():string { return this.getProperty('optionalProperty', "default"); }
	set optionalProperty(mp:string) { this.setProperty('optionalProperty', mp); }

	validate():boolean
	{
		return  ('messageProperty' in this.properties) &&
				('numberProperty' in this.properties);
				// but optionalProperty doesn't matter
	}

	static type:string = "application.MyMessage";
}

Message.registerMessageType(MyMessage);

function handleMessages(message:Message)
{
	if (message.type == MyMessage.type)
	{
		let myMessage:MyMessage = <MyMessage>message;

		if (myMessage.optionalProperty != "default")
		{
			doMeaningfulStuffWith(myMessage.messageProperty, myMessage.numberProperty);
		}
	}
}
```
