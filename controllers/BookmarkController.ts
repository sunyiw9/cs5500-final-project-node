/**
 * @file Controller RESTful Web service API for bookmarks resource
 */
import {Express, Request, Response} from "express";
import BookmarkDao from "../daos/BookmarkDao";
import BookmarkControllerI from "../interfaces/BookmarkControllerI";
import MessageDao from "../daos/MessageDao";

/**
 * @class BookmarkController Implements RESTful Web service API for bookmarks resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /api/users/:uid/bookmarks to retrieve all the tuits bookmarkd by a user
 *     </li>
 *     <li>GET /api/tuits/:tid/bookmarks to retrieve all users that bookmarkd a tuit
 *     </li>
 *     <li>POST /api/users/:uid/bookmarks/:tid to record that a user bookmarks a tuit
 *     </li>
 *     <li>DELETE /api/users/:uid/unbookmarks/:tid to record that a user
 *     no londer bookmarks a tuit</li>
 * </ul>
 * @property {bookmarkDao} bookmarkDao Singleton DAO implementing bookmarks CRUD operations
 * @property {bookmarkController} bookmarkController Singleton controller implementing
 * RESTful Web service API
 */

export default class BookmarkController implements BookmarkControllerI {
    private static bookmarkDao: BookmarkDao = BookmarkDao.getInstance();
    private static messageDao: MessageDao = MessageDao.getInstance();
    private static bookmarkController: BookmarkController | null = null;
    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return BookmarkController
     */
    public static getInstance = (app: Express): BookmarkController => {
        if(BookmarkController.bookmarkController === null) {
            BookmarkController.bookmarkController = new BookmarkController();

            app.get("/api/users/:uid/bookmarks", BookmarkController.bookmarkController.findAllMessagesBookmarkedByUser);
            app.get("/api/messages/:mid/bookmarks", BookmarkController.bookmarkController.findAllUsersThatBookmarkedMessage);
            app.put("/api/users/:uid/bookmarks/:mid", BookmarkController.bookmarkController.userTogglesMessageBookmarks);
            app.post("/api/users/:uid/bookmarks/:mid", BookmarkController.bookmarkController.userBookmarksMessage);
            app.delete("/api/users/:uid/bookmarks/:mid", BookmarkController.bookmarkController.userUnbookmarksMessage);
        }
        return BookmarkController.bookmarkController;
    }

    private constructor() {}

    /**
     * Retrieves all users that bookmarkd a tuit from the database
     * @param {Request} req Represents request from client, including the path
     * parameter tid representing the bookmarkd tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    findAllUsersThatBookmarkedMessage = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.findAllUsersThatBookmarkedMessage(req.params.mid)
            .then(bookmarks => res.json(bookmarks));

    /**
     * Retrieves all tuits bookmarkd by a user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user bookmarkd the tuits
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects that were bookmarkd
     */
    findAllMessagesBookmarkedByUser = (req: Request, res: Response) => {
        const uid = req.params.uid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === 'me' && profile ?
            profile._id : uid;

        BookmarkController.bookmarkDao.findAllMessagesBookmarkedByUser(userId)
            .then(bookmarks => {
                const bookmarksNonNullMessages = bookmarks.filter(bookmark => bookmark.message);
                const messagesFromBookmarks = bookmarksNonNullMessages.map(bookmark => bookmark.message);
                res.json(messagesFromBookmarks);
            });
    }


    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is liking the tuit
     * and the tuit being bookmarkd
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new bookmarks that was inserted in the
     * database
     */
    userTogglesMessageBookmarks = async (req: Request, res: Response) => {
        const bookmarkDao = BookmarkController.bookmarkDao;
        const messageDao = BookmarkController.messageDao;
        const uid = req.params.uid;
        const mid = req.params.mid;
        // @ts-ignore
        const profile = req.session['profile']; // retrieve user, get its id
        const userId = uid === "me" && profile ?
            profile._id : uid;

        try {
            const userAlreadyBookmarkedMessage = await bookmarkDao.findIfUserBookmarkedMessage(mid, uid);
            const howManyBookmarkedMessage = await bookmarkDao.countHowManyBookmarkedMessage(mid); // count how many like this tuit

            let message = await messageDao.findMessageById(mid);
            // if user already bookmarks tuit, the button is disbookmark button
            // otherwise the button is bookmark button
            if (userAlreadyBookmarkedMessage) {
                await BookmarkController.bookmarkDao.userUnbookmarksMessage(userId, mid);
                message.stats.bookmarks = howManyBookmarkedMessage - 1;

            } else {
                await BookmarkController.bookmarkDao.userBookmarksMessage(userId, mid);
                message.stats.bookmarks = howManyBookmarkedMessage + 1;

            };
            console.log(message);
            // update bookmarks count
            res.sendStatus(200);
        } catch (e) {
            res.sendStatus(404);
        }
    }

    // These two are for postman test
    userBookmarksMessage = (req: Request, res: Response) => {
        BookmarkController.bookmarkDao.userBookmarksMessage(req.params.uid, req.params.mid)
            .then(bookmarks => res.json(bookmarks))
    }

    userUnbookmarksMessage = (req: Request, res: Response) => {
        BookmarkController.bookmarkDao.userUnbookmarksMessage(req.params.uid, req.params.mid)
            .then((status) => res.send(status))
    }
};
