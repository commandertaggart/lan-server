
import * as net from 'net';
import { EventEmitter } from 'events';

import { Message } from './messages/Message';

export class LANConnection extends EventEmitter
{
	_socket:net.Socket;

	constructor(socket:net.Socket)
	{
		super();
		this._socket = socket;

		socket.on('data', this.handleSocketData.bind(this));
	}

	private handleSocketData(data:Buffer)
	{
		let message:Message = Message.fromBuffer(data);
		if (message.validate())
		{
			this.emit('message', message);
		}
	}

	public send(message:Message)
	{
		if (message.validate())
		{
			this._socket.write(message.toBuffer());
		}
	}

	public close()
	{
		this._socket.end();
		this._socket = null;
	}
}
