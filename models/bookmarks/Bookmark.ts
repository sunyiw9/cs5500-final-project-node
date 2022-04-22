/**
 * @file Declares Bookmark data type representing relationship between
 * bookmarks and messages, as in user bookmarks messages
 */
import Message from "../messages/Message";
import User from "../users/User";

/**
 * @typedef Bookmarks Represents bookmarks relationship between a user and a message,
 * as in a user bookmarks a message
 * @property {Message} message Message being bookmarked
 * @property {User} bookmarkedBy User Bookmarking the message
 */

export default interface Bookmark {
    message: Message,
    bookmarkedBy: User
};