import { Message } from './Message';
export declare class SearchResponseMessage extends Message {
    constructor();
    nonce: string;
    name: string;
    serverType: string;
    version: string;
    address: string;
    port: number;
    validate(): boolean;
    static type: string;
}
