import BookmarkDaoI from "../interfaces/BookmarkDaoI";
import BookmarkModel from "../mongoose/bookmarks/BookmarkModel";
import Bookmark from "../models/bookmarks/Bookmark";


export default class BookmarkDao implements BookmarkDaoI {
    private static bookmarkDao: BookmarkDao | null = null;
    public static getInstance = (): BookmarkDao => {
        if(BookmarkDao.bookmarkDao === null) {
            BookmarkDao.bookmarkDao = new BookmarkDao();
        }
        return BookmarkDao.bookmarkDao;
    }
    private constructor() {}

    findIfUserBookmarkedMessage = async (mid: string, uid: string): Promise<any> =>
        BookmarkModel.findOne({message: mid, bookmarkedBy: uid})

    userBookmarksMessage = async (uid: string, mid: string): Promise<any> =>
        BookmarkModel.create({message: mid, bookmarkedBy: uid});

    userUnbookmarksMessage = async (uid: string, mid: string): Promise<any> =>
        BookmarkModel.deleteOne({message: mid, bookmarkedBy: uid});

    findAllUsersThatBookmarkedMessage = async (mid: string): Promise<Bookmark[]> =>
        BookmarkModel
            .find({message: mid})
            .populate("bookmarkedBy")
            .exec();

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