
import { serializable, serialized } from 'serialize-ts';

@serializable('lan-server.searchResponse')
export class SearchResponseData
{
	@serialized() nonce:string;
	@serialized() name:string;
	@serialized() serverType:string;
	@serialized() version:string;
	@serialized() address:string;
	@serialized('uint16') port:number;
}
