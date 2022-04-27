/**
 * @file Implements DAO managing data storage of bookmarks. Uses mongoose BookmarkModel
 * to integrate with MongoDB
 */
import BookmarkDaoI from "../interfaces/BookmarkDaoI";
import BookmarkModel from "../mongoose/bookmarks/BookmarkModel";
import Bookmark from "../models/bookmarks/Bookmark";

/**
 * @class BookmarkDao Implements Data Access Object managing data storage of bookmarks
 * @property {BookmarkDao} bookmarkDao Private single instance of BookmarkDao
 */
export default class BookmarkDao implements BookmarkDaoI {
    private static bookmarkDao: BookmarkDao | null = null;

    /**
     * Creates singleton DAO instance
     * @returns bookmarkDao
     */
    public static getInstance = (): BookmarkDao => {
        if(BookmarkDao.bookmarkDao === null) {
            BookmarkDao.bookmarkDao = new BookmarkDao();
        }
        return BookmarkDao.bookmarkDao;
    }
    private constructor() {}

    /**
     * find if user has already bookmarked the message
     * @param {string} mid message's primary key
     * @param {string} uid user's primary key
     * @returns Promise to return the message JSON when message is found bookmarked already
     */
    findIfUserBookmarkedMessage = async (mid: string, uid: string): Promise<any> =>
        BookmarkModel.findOne({message: mid, bookmarkedBy: uid})

    /**
     * User bookmarks message
     * @param {string} mid message's primary key
     * @param {string} uid user's primary key
     * @returns Promise to return the message JSON when message is bookmarked
     */
    userBookmarksMessage = async (uid: string, mid: string): Promise<any> =>
        BookmarkModel.create({message: mid, bookmarkedBy: uid});

    /**
     * User unbookmarks message
     * @param {string} mid message's primary key
     * @param {string} uid user's primary key
     * @returns Promise to return the message JSON when message is unbookmarked
     */
    userUnbookmarksMessage = async (uid: string, mid: string): Promise<any> =>
        BookmarkModel.deleteOne({message: mid, bookmarkedBy: uid});

    /**
     * Find all users who bookmarked message
     * @param {string} mid message's primary key
     * @returns Promise to return the user JSON for users bookmarked message
     */
    findAllUsersThatBookmarkedMessage = async (mid: string): Promise<Bookmark[]> =>
        BookmarkModel
            .find({message: mid})
            .populate("bookmarkedBy")
            .exec();

     /**
     * Find all messages bookmarked by user
      * @param {string} uid user's primary key
     * @returns Promise to return the message JSON when messages between users are found
     */
    findAllMessagesBookmarkedByUser = async (uid: string): Promise<Bookmark[]> =>
        BookmarkModel
            .find({bookmarkedBy: uid})
            .populate({
                path: "message",
                populate: {
                    path:"from",
                }
            })
            .populate({
                path: "message",
                populate: {
                    path:"to",
                }
            })
            .exec();





}