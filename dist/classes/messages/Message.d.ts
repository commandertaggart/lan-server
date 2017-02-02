/// <reference types="node" />
export declare class Message {
    constructor();
    protected properties: Object;
    readonly type: string;
    setProperty(name: string, value: string): void;
    getProperty(name: string): string;
    static fromBuffer(data: Buffer): Message;
    toBuffer(): Buffer;
    validate(): boolean;
}
