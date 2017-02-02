
import { Message } from './Message';

export class SearchResponseMessage extends Message
{
	constructor()
	{
		super();
	}

	get nonce():string { return this.getProperty('nonce'); }
	set nonce(v:string) { this.setProperty('nonce', v); }

	get name():string { return this.getProperty('name'); }
	set name(v:string) { this.setProperty('name', v); }

	get serverType():string { return this.getProperty('serverType'); }
	set serverType(v:string) { this.setProperty('serverType', v); }

	get version():string { return this.getProperty('version'); }
	set version(v:string) { this.setProperty('version', v); }

	get address():string { return this.getProperty('address'); }
	set address(v:string) { this.setProperty('address', v); }

	get port():number { return parseInt(this.getProperty('port')); }
	set port(v:number) { this.setProperty('port', v.toString()); }

	validate():boolean
	{
		return ('nonce' in this.properties) &&
			   ('name' in this.properties) &&
			   ('serverType' in this.properties) &&
			   ('version' in this.properties) &&
			   ('address' in this.properties) &&
			   ('port' in this.properties) && (!isNaN(this.port));
	}

	static type:string = "lan-server.SearchResponseMessage";
}
