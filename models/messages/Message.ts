/**
 * @file Declares message data type representing relationship between
 * users, as in user sends message to another user
 */
import User from "../users/User"
/**
 * @typedef Message Represents messages relationship between two users
 * as in a user sends a message to another user
 * @property {String} message message being sent
 * @property {User} to User sends message to another user
 * @property {User} from User receives message from another user
 * @property {Date} sentOn time the message being sent
 */
export default interface Message {
    message: string,
    to: User,
    from: User,
    sentOn:Date

}