import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { fetchMessagesMock, updateMessagesMock } from '../db/mock/messageMock';

@Injectable()
export class MessageService {
  sendMessage(req: Request, res: Response): void {
    const { author, message, timestamp, chatId } = req.body;
    if (author && message && timestamp && chatId) {
      if (
        updateMessagesMock({ chatId, author, message, timestamp }).status ===
        'success'
      ) {
        console.log('Message added successfully!');
        res.json({ status: 'success' });
        return;
      }
    }

    console.log('Message adding failed!');
    res.status(400).send({
      status: 'failed',
    });
    return;
  }

  fetchMessages(req: Request, res: Response): void {
    const { chatId } = req.body;
    if (chatId) {
      const messageObj = fetchMessagesMock(chatId);
      console.log('Message fetched successfully!');
      res.json({ messages: messageObj.messages });
      return;
    }

    console.log('Message fetch failed!');
    res.status(400).send({ status: 'failed' });
    return;
  }
}
