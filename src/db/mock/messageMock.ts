const messagesMock = [
  {
    chatId: 'main_group_chat',
    messages: [
      {
        author: 'sentienta',
        message: 'poda myre',
        timestamp: Date.now(),
      },
    ],
  },
];

interface MessageObject {
  chatId: string;
  messages: {
    author: string;
    message: string;
    timestamp: number;
  }[];
}

interface MessageProps {
  chatId: string;
  author: string;
  message: string;
  timestamp: number;
}

const updateMessagesMock = (props: MessageProps): { status: string } => {
  const { chatId, ...otherProps } = props;
  const updated = messagesMock.find((chatObj) => {
    if (chatObj.chatId === chatId) {
      chatObj.messages = [...chatObj.messages, otherProps];
      return true;
    }
  });
  return {
    status: updated ? 'success' : 'failed',
  };
};

const fetchMessagesMock = (chatId: string): MessageObject => {
  return messagesMock.find((obj) => obj.chatId === chatId);
};

export { messagesMock, updateMessagesMock, fetchMessagesMock };
