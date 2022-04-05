import Message from "../models/messages/Message";
/**
 * @file Declares API for Messages related data access object methods
 */
export default interface MessageDaoI {
    userSendsMessage(message: Message, from: string, to: string): Promise<Message>;
    findAllSentMessage(uid: string): Promise<Message[]>;
    findAllReceivedMessage(uid: string): Promise<Message[]>;
    userDeletesMessage(mid: string): Promise<any>;

};