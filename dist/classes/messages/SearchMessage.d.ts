import { Message } from './Message';
export declare class SearchMessage extends Message {
    constructor();
    nonce: string;
    serverTypes: string[];
    validate(): boolean;
    static type: string;
}
