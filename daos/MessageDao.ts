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

    /**
     * Find all messages between two given users from the database
     * @param {string} uid User's primary key
     * @param {string} uid2 User's primary key
     * @returns Promise To be notified when messages are retrieved from the database
     */
    findAllMessagesBetweenUsers = async (uid: string, uid2: string): Promise<Message[]> =>
        MessageModel.find({ $or: [{from: uid, to : uid2}, {to: uid, from : uid2}] })
            .populate('from')
            .populate('to')
            .exec()


    // Add one: findMessagesById
    findMessageById = async (mid: string): Promise<any> =>
        MessageModel.findById(mid)


    /**
     * Updates message with new values in database
     * @param {string} mid Primary key of message to be modified
     * @param {Message} message Message object containing properties and their new values
     * @returns Promise To be notified when message is updated in the database
     */
    updateMessage = async (mid: string, message: Message): Promise<any> =>
        MessageModel.updateOne(
            {_id: mid},
            {$set: message});
}
