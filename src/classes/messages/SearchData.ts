
import { serializable, serialized } from 'serialize-ts';

@serializable('lan-server.search')
export class SearchData
{
	@serialized() nonce:string;
	@serialized('string[]') serverTypes:string[];
}
