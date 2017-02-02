
import { Message } from './Message';

export class SearchMessage extends Message
{
	constructor()
	{
		super();
	}

	get nonce():string { return this.getProperty('nonce'); }
	set nonce(v:string) { this.setProperty('nonce', v); }

	get serverTypes():string[] { return this.getProperty('serverTypes').split(','); }
	set serverTypes(v:string[]) { this.setProperty('serverTypes', v.join(',')); }

	validate():boolean
	{
		return ('nonce' in this.properties) &&
			   ('serverTypes' in this.properties)
	}
}
