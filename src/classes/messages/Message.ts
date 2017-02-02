
import * as querystring from 'querystring';

import { log, error } from '../../util/log';

export class Message
{
	constructor()
	{
		this.properties = {};
	}

	protected properties:Object;

	get type():string
	{ return this.constructor.name; }

	setProperty(name:string, value:string)
	{
		this.properties[name] = value;
	}

	getProperty(name:string):string
	{
		return this.properties[name];
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

		try
		{
			let constructor = require('./' + type)[type];

			let msg:Message = new constructor();
			msg.properties = querystring.parse(props);

			log(msg);

			if (msg.validate())
			{ return msg; }
		}
		catch (err)
		{ error(err); }

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
