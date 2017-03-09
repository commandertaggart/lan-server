
import * as querystring from 'querystring';
import { log, error } from '../../util/log';
import { Serializer } from 'serialize-ts';

export class Message
{
	public payload:Object;
	public type:string;

	constructor(payload:Object, type?:string)
	{
		if (!payload || (typeof(payload) !== 'object'))
		{ throw new Error("Invalid payload"); }

		this.payload = payload;
		this.type = type || payload.constructor["serializedType"];

		if (!this.type)
		{ throw new Error("Message payload must be @serializable, or you must provide the message type."); }
		if (Buffer.byteLength(this.type) > 0xFF)
		{ throw new Error("Message ID too long: " + this.type); }
	}

	public static headerString:string = "MSG:";
	public static get headerSize():number
	{ return Buffer.byteLength(Message.headerString, 'utf8'); }

	public static fromBuffer(message:Buffer):Message
	{
		var idSize:number = message.readUInt16BE(0);
		var id:string = message.toString('utf8', 2, idSize + 2);

		var payload:Object = Serializer.fromBuffer(message.slice(idSize+2));
		//console.log(payload);
		return new Message(payload, id);
	}

	public toBuffer():Buffer
	{
		var idSize:number = Buffer.byteLength(this.type);
		var payloadBuffer:Buffer = Serializer.toBuffer(this.payload);
		var packet:Buffer = Buffer.allocUnsafe(payloadBuffer.length + idSize + 2);

		packet.writeUInt16BE(idSize, 0);
		packet.write(this.type, 2, idSize, 'utf8');
		payloadBuffer.copy(packet, idSize + 2);

		return packet;
	}
}
