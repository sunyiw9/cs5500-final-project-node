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
 *     <li>GET /api/users/:uid/bookmarks to retrieve all the messages bookmarked by a user
 *     </li>
 *     <li>GET /api/message/:mid/bookmarks to retrieve all users that bookmarked a message
 *     </li>
 *     <li>GET /api/bookmarks/users/:uid/messages/:mid to find messages that user has bookmarked
 *     </li>
 *     <li>PUT /api/users/:uid/bookmarks/:mid to bookmark a message or unbookmark a message
 *     </li>
 *     <li>POST /api/users/:uid/bookmarks/:mid to record that a user bookmarks a message
 *     </li>
 *     <li>DELETE /api/users/:uid/bookmarks/:mid to record that a user unbookmarks a message
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
            app.get("/api/bookmarks/users/:uid/messages/:mid", BookmarkController.bookmarkController.findBookmarkByUserAndMessage);
            app.put("/api/users/:uid/bookmarks/:mid", BookmarkController.bookmarkController.userTogglesMessageBookmarks);
            app.post("/api/users/:uid/bookmarks/:mid", BookmarkController.bookmarkController.userBookmarksMessage);
            app.delete("/api/users/:uid/bookmarks/:mid", BookmarkController.bookmarkController.userUnbookmarksMessage);
        }
        return BookmarkController.bookmarkController;
    }

    private constructor() {}

    /**
     * Retrieves all users that bookmarked a message from the database
     * @param {Request} req Represents request from client, including the path
     * parameter mid representing the bookmarked message
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    findAllUsersThatBookmarkedMessage = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.findAllUsersThatBookmarkedMessage(req.params.mid)
            .then(bookmarks => res.json(bookmarks));

    /**
     * Retrieves all messages bookmarked by a user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user bookmarked the messages
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the message objects that were bookmarked
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
     * Retrieves one message bookmarked by a user and return the message
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user bookmarked the messages
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the message objects that were bookmarked
     */
    findBookmarkByUserAndMessage = (req: Request, res: Response) => {
        const { mid, uid } = req.params;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === 'me' && profile ?
            profile._id : uid;

        BookmarkController.bookmarkDao.findIfUserBookmarkedMessage(mid, uid)
            .then(bookmark => {
                res.json(bookmark);
            });
    }


    /**
     * User bookmarks a message, or unbookmarks the same message depending on
     * if user has already bookmarked that message
     * @param {Request} req Represents request from client, including the
     * path parameters uid and mid representing the user that is liking the messages
     * and the messages being bookmarked
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
            let message = await messageDao.findMessageById(mid);
            // if user already bookmarks message, the button is disbookmark button
            // otherwise the button is bookmark button
            if (userAlreadyBookmarkedMessage) {
                await BookmarkController.bookmarkDao.userUnbookmarksMessage(userId, mid);
                res.sendStatus(200);
            } else {
                await BookmarkController.bookmarkDao.userBookmarksMessage(userId, mid);
                res.sendStatus(201);
            };
            console.log(message);
            // update bookmarks count

        } catch (e) {
            res.sendStatus(404);
        }
    }

    // These two are for postman test
    /**
     * User bookmarks a message
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user bookmarked the messages
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the message objects that were bookmarked
     */
    userBookmarksMessage = (req: Request, res: Response) => {
        BookmarkController.bookmarkDao.userBookmarksMessage(req.params.uid, req.params.mid)
            .then(bookmarks => res.json(bookmarks))
    }
    /**
     * User unbookmarks a message
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user bookmarked the messages
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the message objects that were bookmarked
     */
    userUnbookmarksMessage = (req: Request, res: Response) => {
        BookmarkController.bookmarkDao.userUnbookmarksMessage(req.params.uid, req.params.mid)
            .then((status) => res.send(status))
    }
};
