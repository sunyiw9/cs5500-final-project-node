/**
 * @file Implements the bookmark model to represent bookmarks in the database
 */
import mongoose, {Schema} from "mongoose";
import Bookmark from "../../models/bookmarks/Bookmark";

/**
 * @typedef BookmarkSchema represents bookmarks in the database
 * @property {ObjectId} message message JSON model file
 * @property {ObjectId} bookmarkedBy user who bookmarked the message, also a JSON
 */
const BookmarkSchema = new mongoose.Schema<Bookmark>({
    message: {type: Schema.Types.ObjectId, ref: "MessageModel"},
    bookmarkedBy: {type: Schema.Types.ObjectId, ref: "UserModel"},
}, {collection: "bookmarks"});
export default BookmarkSchema;