
import * as net from 'net';
import * as dgram from 'dgram';
import { EventEmitter } from 'events';

import { log, error } from '../util/log';

import { LANConnection } from './LANConnection';
import { Message } from './messages/Message';
import { SearchData } from './messages/SearchData';
import { SearchResponseData } from './messages/SearchResponseData';

export class LANServerInfo
{
	constructor(public type:string = "server",
				public name:string,
				public address:string,
				public port:number)
	{ log(`LANServerInfo(${type}, ${name}, ${address}, ${port})`); }

	connect(callback:(connection:LANConnection)=>void)
	{
		var socket = net.createConnection(this.port, this.address, () => {
			callback(new LANConnection(socket));
		})
	}
}

export class LANServer extends EventEmitter
{
	_:{
		type:string,
		name:string,
		advertise:boolean,
		port:number,
		autostart:boolean,
		address:{ port: number; family: string; address: string; }
	};
	_server:net.Server;

	constructor(type:string, options:Object = {})
	{
		super();
		log("constructing server");
		this.setMaxListeners(Infinity);

		this._ = {
			type: type,
			name: options["name"] 				|| "LAN Server",
			advertise: options["advertise"] 	|| true,
			port: options["port"] 				|| 0,
			autostart: options["autostart"] 	|| false,
			address: null
		};

		log(`LANServer(${type}, {
	name: ${this._.name},
	advertise: ${this._.advertise},
	port: ${this._.port},
	autostart: ${this._.autostart}
})`);

		this._server = null;

		if (this._.autostart)
		{ setImmediate(this.start.bind(this)); }
	}

	start()
	{
		if (this._server)
		{ error("Server already started."); }

		log("Starting server...");

		this._server = net.createServer();

		this._server.on('error', this.handleServerError.bind(this))
			   		.on('connection', this.handleServerConnection.bind(this));

		this._server.listen(this._.port, () => {
			log("Server started.");

			this._.address = this._server.address();

			if (this._.advertise)
			{
				this.once('advertising', (port) => { this.emit('started', this); });
				setImmediate(this.startAdvertising.bind(this));
			}
			else
			{ this.emit('started', this); }
		});
	}

	stop()
	{
		log("Shutting down server.");
		this.stopAdvertising();
		if (this._server)
		{
			this._server.close();
			this._server = null;
			this._.address = null;
		}
	}

	private _advertisingSocket:dgram.Socket = null;
	startAdvertising()
	{
		if (this._advertisingSocket == null)
		{
			log("Advertising server...");

			this._advertisingSocket = dgram.createSocket('udp4');

			this._advertisingSocket.bind({ port: LANServer.advertisingPort }, () => {
				log("... listening on port " + this._advertisingSocket.address().port);
				this._advertisingSocket.setBroadcast(true);
				this._advertisingSocket.on('message', this.handleSearchPacket.bind(this));

				this.emit('advertising', LANServer.advertisingPort);
			});
		}
	}

	stopAdvertising()
	{
		if (this._advertisingSocket)
		{
			log("Server no longer advertising.");
			this._advertisingSocket.close();
			this._advertisingSocket = null;
		}
	}

	private handleSearchPacket(data:Buffer, remote:dgram.RemoteInfo)
	{
		log("Advertiser received packet ...", data.toString('utf8'));
		let message:Message = Message.fromBuffer(data);
		if (message && message.type == SearchData['serializedType'])
		{
			let search:SearchData = <SearchData>message.payload;
			log(" ... packet is search message, looking for types: ", search.serverTypes);
			if (search.serverTypes.indexOf(this._.type) >= 0 ||
				search.serverTypes.indexOf("*") >= 0)
			{
				log(" ... searching for this type of server, responding ...");
				let response:SearchResponseData = new SearchResponseData();
				response.nonce = search.nonce;
				response.name = this._.name;
				response.serverType = this._.type;
				response.version = '0';
				response.address = this._.address.address;
				response.port = this._.address.port;

				this._advertisingSocket.send((new Message(response)).toBuffer(), LANServer.advertisingPort+1, remote.address);
				log(" ... response sent.");
			}
		}
	}

	handleServerError(err:Error)
	{
		error("Error on server: ", err);
		this.stopAdvertising();
		this._server = null;
		this.emit('error', err);
	}

	handleServerConnection(socket:net.Socket)
	{
		log("Server receiving connection.");
		var connection = new LANConnection(socket);
		this.emit('connection', connection);
	}

	private static _searches:Object = {};
	private static _searchTimer:NodeJS.Timer = null;
	private static _searchSocket:dgram.Socket = null;
	private static _searchNonce:string = null;
	private static _searchResults = {};

 	static search(type:string, callback:(found:LANServerInfo)=>void)
	{
		log(`Searching for servers of type "${type}"`);
		LANServer._searches[type] = LANServer._searches[type] || [];
		LANServer._searches[type].push(callback);

		if (LANServer._searchTimer == null)
		{
			LANServer._searchTimer = setInterval(LANServer.searchInterval, 5000);
		}

		if (LANServer._searchSocket == null)
		{
			LANServer._searchNonce = require('uuid/v4')();
			LANServer._searchSocket = dgram.createSocket('udp4');
			LANServer._searchSocket.bind({ port: LANServer.advertisingPort+1 }, () => {
				LANServer._searchSocket.setBroadcast(true);
				LANServer._searchSocket.on('message', LANServer.handleSearchResult);
				LANServer.searchInterval();
			});
		}
	}

	static stopSearch(type?:string, callback?:(server:LANServerInfo, active:boolean)=>void)
	{
		if (!type && ("*" in LANServer._searches))
		{ type = "*"; }
		log(`Discontinuing search for servers of type "${type}"`);

		if (type in LANServer._searches)
		{
			if (callback)
			{
				let index:number = LANServer._searches[type].indexOf(callback);
				if (index >= 0)
				{ LANServer._searches[type].splice(index,1); }

				if (LANServer._searches[type].length == 0)
				{ delete LANServer._searches[type]; }
			}
			else if (type == "*")
			{ delete LANServer._searches[type]; }
		}
		else
		{ LANServer._searches = {}; }

		if (Object.keys(LANServer._searches).length == 0)
		{
			clearInterval(LANServer._searchTimer);
			LANServer._searchTimer = null;

			LANServer._searchSocket.close();
			LANServer._searchSocket = null;

			LANServer._searchNonce = null;

			LANServer._searchResults = {};
		}
	}

	private static searchInterval()
	{
		let data:SearchData = new SearchData();
		data.nonce = LANServer._searchNonce;
		data.serverTypes = Object.keys(LANServer._searches);
		log("Sending search packet (" + LANServer.advertisingPort + "):",
			JSON.stringify(data));

		for (var key in LANServer._searchResults)
		{
			var cache = LANServer._searchResults[key];
			++cache.age;
			if (cache.age > 3)
			{
				delete LANServer._searchResults[key];
				log(`Delisting stale server: ${cache.info.name}`);

				if (cache.info.type in LANServer._searches)
				{
					LANServer._searches[cache.info.type].forEach((callback) => {
						callback(cache.info, false);
					});
				}

				if ('*' in LANServer._searches)
				{
					LANServer._searches['*'].forEach((callback) => {
						callback(cache.info, false);
					});
				}
			}
		}

		LANServer._searchSocket.send((new Message(data)).toBuffer(),
			LANServer.advertisingPort, "255.255.255.255");
	}

	private static handleSearchResult(data:Buffer, remote:dgram.RemoteInfo)
	{
		log("Search received response packet ... ");
		var message:Message = Message.fromBuffer(data);
		if (message.type === SearchResponseData['serializedType'])
		{
			log(" ... of correct message type");
			var result:SearchResponseData = <SearchResponseData>message.payload;

			if (result.nonce === LANServer._searchNonce)
			{
				log(" ... in response to us");
				var server:LANServerInfo = new LANServerInfo(result.serverType,
					result.name, result.address, result.port);

				var key:string = result.address + ":" + result.port;

				var cache = LANServer._searchResults[key];
				if (cache)
				{
					cache.age = 0;
				}
				else
				{
					cache = LANServer._searchResults[key] = {};
					cache.info = server;
					cache.age = 0;

					if (server.type in LANServer._searches)
					{
						log(`Sought-for server of type "${server.type}" found: ${server.name}`);
						LANServer._searches[server.type].forEach((callback) => {
							callback(server, true);
						});
					}

					if ('*' in LANServer._searches)
					{
						log(`Server of type "${server.type}" found: ${server.name}`);
						LANServer._searches['*'].forEach((callback) => {
							callback(server, true);
						});
					}
				}
			}
		}
	}

	public static advertisingPort:number = 27614;
}
