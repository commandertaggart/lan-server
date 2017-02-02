
import * as querystring from 'querystring';

import { log, error } from '../../util/log';

export class Message
{
	private static _messageTypes = {};
	static registerMessageType(ctor:new () => Message)
	{
		if (!('type' in ctor))
		{
			error('Message class does not define `static type:string;`');
			return;
		}

		if (ctor['type'] in Message._messageTypes)
		{ error(`Message type "${ctor['type']}" already registered.`); }

		Message._messageTypes[ctor['type']] = ctor;
	}

	constructor()
	{
		this.properties = {};
	}

	protected properties:Object;

	static type:string = "lan-server.Message";

	get type():string
	{ return this.constructor["type"]; }

	setProperty(name:string, value:string)
	{
		this.properties[name] = value;
	}

	getProperty(name:string, defaultValue?:string):string
	{
		if (name in this.properties)
			return this.properties[name];
		else
			return defaultValue;
	}

	static fromBuffer(data:Buffer):Message
	{
		let body:string = data.toString('utf8');
		let div:number = body.indexOf('?');
		let type:string = body.substr(0, div);
		let props:string = body.substr(div+1);

		log("deserializing message ... ");
		log(" ... type:", type);
		log(" ... props:", props);

		let constructor = Message._messageTypes[type];

		if (constructor)
		{
			let msg:Message = new constructor();
			msg.properties = querystring.parse(props);

			log(msg);

			if (msg.validate())
			{ return msg; }
		}
		else
		{ error(`Message type '${type}' not registered.`); }

		return null;
	}

	toBuffer():Buffer
	{
		return new Buffer(this.type + "?" +
			querystring.stringify(this.properties), 'utf8');
	}

	validate():boolean
	{ return true; }
}

Message.registerMessageType(Message);
