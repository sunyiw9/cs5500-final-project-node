import Bookmark from "../models/bookmarks/Bookmark";

/**
 * @file Declares API for Bookmarks related data access object methods
 */
export default interface BookmarkDaoI {
    findAllUsersThatBookmarkedMessage (mid: string): Promise<Bookmark[]>;
    findAllMessagesBookmarkedByUser (uid: string): Promise<Bookmark[]>;
    userUnbookmarksMessage (mid: string, uid: string): Promise<any>;
    userBookmarksMessage (mid: string, uid: string): Promise<Bookmark>;
    findIfUserBookmarkedMessage (mid: string, uid: string): Promise<any>;
};