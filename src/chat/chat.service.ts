import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import {
  connectToChat,
  addChatConnectionToDB,
  addUserToGroup,
  removeUserFromGroup,
} from '../db/mock/messageMock';

@Injectable()
export class ChatService {
  connectToChat(req: Request, res: Response): void {
    const { type, chatName, recipientNames, username } = req.body;
    const chatConn = connectToChat({
      type,
      chatName,
      recipientNames,
      username,
    });
    if (chatConn) {
      console.log(`Connected to chat ${chatConn.chatId}!`);
      res.json(chatConn);
      return;
    }

    console.log('Failed to connect to chat!');
    res.status(400).json({ status: 'failed' });
  }

  createGroupChat(req: Request, res: Response): void {
    const { type, chatName, recipientNames, username } = req.body;
    const chatConn = addChatConnectionToDB({
      type,
      chatName,
      recipientNames,
      username,
    });
    if (chatConn.status === 'success') {
      console.log(`Created a group chat ${chatName}!`);
      res.json(chatConn);
      return;
    }

    console.log('Failed to create group chat!');
    res.status(400).json({ status: 'failed' });
  }

  addUserToGroup(req: Request, res: Response): void {
    const { chatId, username } = req.body;
    const added = addUserToGroup({
      chatId,
      username,
    });
    if (added.status === 'success') {
      console.log(`Added user ${username} to group chat!`);
      res.json(added);
      return;
    }

    console.log('Failed to add user to group chat!');
    res.status(400).json({ status: 'failed' });
  }

  removeUserFromGroup(req: Request, res: Response): void {
    const { chatId, username } = req.body;
    const removed = removeUserFromGroup({
      chatId,
      username,
    });
    if (removed.status === 'success') {
      console.log(`Removed user ${username} from group chat!`);
      res.json(removed);
      return;
    }

    console.log('Failed to remove user from group chat!');
    res.status(400).json({ status: 'failed' });
  }
}
