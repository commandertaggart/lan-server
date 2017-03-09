
import * as net from 'net';
import { EventEmitter } from 'events';
import { Message } from './messages/Message';

enum ConnState
{
	WAITING_HEADER,
	WAITING_PAYLOAD
}

export class LANConnection extends EventEmitter
{
	private _socket:net.Socket;
	private _currentData:Buffer;

	constructor(socket:net.Socket)
	{
		super();
		this._socket = socket;

		socket.on('data', this.handleSocketData.bind(this));
	}

	private handleSocketData(data:Buffer)
	{
		if (this._currentData)
		{ data = Buffer.concat([this._currentData, data]); }

		if (data.length >= (Message.headerSize+4))
		{
			if (data.toString('utf8', 0, Message.headerSize) === Message.headerString)
			{
				let payloadSz:number = data.readInt32BE(Message.headerSize);
				let total:number = Message.headerSize+4+payloadSz;

				if (data.length >= total)
				{
					var packet:Buffer;
					if (data.length == total)
					{
						packet = data.slice(Message.headerSize+4);
						data = null;
					}
					else
					{
						packet = data.slice(Message.headerSize+4, total);
						data = data.slice(total);
					}

					let message:Message = Message.fromBuffer(packet);
					this.emit('message', message);

				}
				this._currentData = data;
			}
			else
			{
				this._currentData = null;
				throw new Error("Bad data!!!");
			}
		}
	}

	public send(message:Message)
	{
		var payload:Buffer = message.toBuffer();
		var headerSz:number = Message.headerSize;
		var header:Buffer = Buffer.allocUnsafe(headerSz + 4);
		header.write(Message.headerString, 0, headerSz, 'utf8');
		header.writeInt32BE(payload.length, headerSz);

		this._socket.write(Buffer.concat([header, payload]));
	}

	public close()
	{
		this._socket.end();
		this._socket = null;
	}
}
