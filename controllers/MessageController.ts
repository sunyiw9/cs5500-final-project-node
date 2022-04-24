/**
 * @file Controller RESTful Web service API for messages resource
 */
import {Express, Request, Response} from "express";
import MessageControllerI from "../interfaces/MessageControllerI";
import MessageDao from "../daos/MessageDao";
import Message from "../models/messages/Message";

/**
 * @class LikeController Implements RESTful Web service API for likes resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li> POST /api/users/:uid/messages/:uid2 to record that user sends a message
 *     </li>
 *     <li> DELETE /api/messages/:mid to record that user deletes a message
 *     </li>
 *     <li> GET /api/users/:uid/messages/sent to retrieve all messages send by a user
 *     </li>
 *     <li> GET /api/users/:uid/messages/received to retrieve all messages received by a user
 *     </li>
 * </ul>
 * @property {MessageDao} messageDao Singleton DAO implementing messages CRUD operations
 * @property {MessageController} MessageController Singleton controller implementing
 * RESTful Web service API
 */
export default class MessageController implements MessageControllerI {
    private static messageDao: MessageDao = MessageDao.getInstance();
    private static messageController: MessageController | null = null;

    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return MessageController
     */
    public static getInstance = (app: Express): MessageController => {
        if (MessageController.messageController === null) {
            MessageController.messageController = new MessageController();
            app.post('/api/users/:uid/messages/:uid2', MessageController.messageController.userSendsMessage);
            app.delete('/api/messages/:mid', MessageController.messageController.userDeletesMessage);
            app.get('/api/users/:uid/messages/sent', MessageController.messageController.findAllSentMessage);
            app.get('/api/users/:uid/messages/received', MessageController.messageController.findAllReceivedMessage);
            app.get('/api/messages', MessageController.messageController.findAllMessages);

            app.get('/api/users/:uid/messages/:uid2', MessageController.messageController.findAllMessagesBetweenUsers);
            app.put('/api/messages/:mid', MessageController.messageController.updateMessage);
        }
        return MessageController.messageController;
    }

    private constructor() {}

    /**
     * Inserts messages instance to record that a user sends a message
     * @param {Request} req Represents request from client, including the
     * path parameters uid and uid2 representing the user sends the message and
     * the user receives the message and the message content.
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new messages that was inserted in the
     * database
     */
    userSendsMessage = (req: Request, res: Response) =>
        MessageController.messageDao.userSendsMessage(req.body, req.params.uid, req.params.uid2)
            .then((message: Message) => res.json(message));

    /**
     * Removes message instance from the records that a user deletes a message
     * @param {Request} req Represents request from client, including the
     * path parameters mid representing the messages is being deleted
     * @param {Response} res Represents response to client, including status
     * on whether deleting the message was successful or not
     */
    userDeletesMessage = (req: Request, res: Response) =>
        MessageController.messageDao.userDeletesMessage(req.params.mid)
            .then(status => res.send(status));

    /**
     * Retrieves all sent message from a user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user who sends the message
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the message objects
     */
    findAllSentMessage = (req: Request, res: Response) =>
        MessageController.messageDao.findAllSentMessage(req.params.uid)
            .then((messages: Message[]) => res.json(messages));

    /**
     * Retrieves all received message from a user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user who receives the message
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the message objects
     */
    findAllReceivedMessage = (req: Request, res: Response) =>
        MessageController.messageDao.findAllReceivedMessage(req.params.uid)
            .then((messages: Message[]) => res.json(messages));

    /**
     * Retrieves all messages from the database
     * @param req Represents request from client
     * @param res Represents response to client, including the
     * body formatted as JSON arrays containing the message objects
     */
    findAllMessages = (req: Request, res: Response) =>
        MessageController.messageDao.findAllMessages()
            .then((messages:Message[]) => res.json(messages));

    /**
     * Retrieves all messages between users from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user who sends the message
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the message objects
     */
    findAllMessagesBetweenUsers = (req: Request, res: Response) =>
        MessageController.messageDao.findAllMessagesBetweenUsers(req.params.uid, req.params.uid2)
            .then((messages: Message[]) => res.json(messages));

    /**
     * @param {Request} req Represents request from client, including path
     * parameter mid identifying the primary key of the message to be modified
     * @param {Response} res Represents response to client, including status
     * on whether updating a message was successful or not
     */
    updateMessage = (req: Request, res: Response) =>
        MessageController.messageDao.updateMessage(req.params.mid, req.body)
            .then((status) => res.send(status));
}