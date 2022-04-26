/**
 * @file Implements the data model to represent messages in the database
 */
import mongoose, {Schema} from "mongoose";
import Message from "../../models/messages/Message";

/**
 * @typedef MessageSchema Data model to represent messages in the database
 * @property {string} message Content of the message
 * @property {ObjectId} to User who received the message
 * @property {ObjectId} from User who sends the message
 * @property {Date} sentOn message sent time
 */
const MessageSchema = new mongoose.Schema<Message>({
    message: {type: String,required: true},
    to:{type: Schema.Types.ObjectId, ref: "UserModel"},
    from:{type: Schema.Types.ObjectId, ref: "UserModel"},
    sentOn:{type: Date, default: Date.now},
    stats: {
        bookmarks: {type: Number, default: 0}
    }
}, {collection: "messages"});
export default MessageSchema;