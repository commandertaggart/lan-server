/// <reference types="node" />
export declare class Message {
    private static _messageTypes;
    static registerMessageType(ctor: new () => Message): void;
    constructor();
    protected properties: Object;
    static type: string;
    readonly type: string;
    setProperty(name: string, value: string): void;
    getProperty(name: string, defaultValue?: string): string;
    static fromBuffer(data: Buffer): Message;
    toBuffer(): Buffer;
    validate(): boolean;
}
