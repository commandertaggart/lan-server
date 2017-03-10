/// <reference types="node" />
export declare class Message {
    payload: Object;
    type: string;
    constructor(payload: Object, type?: string);
    static headerString: string;
    static readonly headerSize: number;
    static fromBuffer(message: Buffer): Message;
    toBuffer(): Buffer;
}
