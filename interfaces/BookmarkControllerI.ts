import {Request, Response} from "express";

export default interface BookmarkControllerI {
    findAllUsersThatBookmarkedMessage (req: Request, res: Response): void;
    findAllMessagesBookmarkedByUser (req: Request, res: Response): void;
    userTogglesMessageBookmarks (req: Request, res: Response): void;
};