/**
 * @file Implements DAO managing data storage of messages. Uses mongoose MessageModel
 * to integrate with MongoDB
 */
import MessageDaoI from "../interfaces/MessageDaoI";
import Message from "../models/messages/Message";
import MessageModel from "../mongoose/messages/MessageModel";

/**
 * @class MessageDao Implements Data Access Object managing data storage
 * of Messages
 * @property {MessageDao} MessageDao Private single instance of MessageDao
 */
export default class MessageDao implements MessageDaoI {
    private static messageDao: MessageDao | null = null;
    /**
     * Creates singleton DAO instance
     * @returns MessageDao
     */
    public static getInstance = (): MessageDao => {
        if (MessageDao.messageDao === null) {
            MessageDao.messageDao = new MessageDao();
        }
        return MessageDao.messageDao;
    }

    /**
     * Inserts message instance into the database
     * @param {Message} message the content of the message
     * @param {string} from the user who sends the message
     * @param {string} to the user who receives the message
     * @returns Promise To be notified when user is inserted into the database
     */
    userSendsMessage = async (message: Message, from: string, to: string): Promise<Message> =>
        MessageModel.create({...message, from, to})

    /**
     * Uses MessageModel to retrieve all sent messages from one user from messages collection
     * @param {string} uid User's primary key
     * @returns Promise To be notified when the users are retrieved from
     * database
     */
    findAllSentMessage = async (uid: string): Promise<Message[]> =>
        MessageModel.find({from: uid})
            .populate('to')
            .exec()

    /**
     * Uses MessageModel to retrieve all received messages of one user from messages collection
     * @param {string} uid User's primary key
     * @returns Promise To be notified when the users are retrieved from
     * database
     */
    findAllReceivedMessage = async (uid: string): Promise<Message[]> =>
        MessageModel.find({to: uid})
            .populate('from')
            .exec()


    /**
     * Removes message instance from the database
     * @param {string} mid Message's primary key
     * @returns Promise To be notified when user is inserted into the database
     */
    userDeletesMessage = async (mid: string): Promise<any> =>
        MessageModel.deleteOne({_id: mid});


    findAllMessages = async():Promise<Message[]> =>
        MessageModel.find().exec();

}