import { v4 as uuid } from 'uuid';
import { usersList } from './usersMock';

let messagesMock = [
  {
    chatId: 'main_group_chat',
    messages: [
      {
        author: 'sentienta',
        message: 'first message!',
        timestamp: Date.now(),
      },
    ],
  },
  {
    chatId: 'first0group0chat0uuid0000000001',
    messages: [
      {
        author: 'boltkk',
        message: 'first DM!',
        timestamp: Date.now(),
      },
      {
        author: 'sasebot',
        message: 'second DM!',
        timestamp: Date.now() + 2000,
      },
    ],
  },
];

let chatDBmappings = [
  {
    chatId: 'main_group_chat',
    chatName: 'Main group chat',
    type: 'group',
    participants: [
      {
        userId: 0,
      },
      {
        userId: 1,
      },
      {
        userId: 2,
      },
    ],
  },
  {
    chatId: 'first0group0chat0uuid0000000001',
    type: 'dm',
    participants: [
      {
        userId: 1,
      },
      {
        userId: 2,
      },
    ],
  },
];

interface ChatConnection {
  type: string;
  chatName?: string | undefined;
  recipientNames?: string[] | undefined;
  username?: string | undefined;
}

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

const connectToChat = (
  props: ChatConnection,
):
  | { chatId?: string | undefined; status: string; message: string }
  | undefined => {
  const { type, chatName, recipientNames, username } = props;
  if (type === 'group' && chatName) {
    const chatConn = chatDBmappings.find(
      (chatObj) => chatObj.chatName === chatName,
    );
    if (!chatConn) {
      return;
    }
    return {
      chatId: chatConn.chatId,
      status: 'success',
      message: `Connected to group chat ${chatName}!`,
    };
  } else if (type === 'dm' && recipientNames.length === 1 && username) {
    const participantsObj = usernamesToUsers([username, recipientNames[0]]);
    const chatConn = chatDBmappings.find(
      (chatObj) =>
        chatObj.participants.includes({ userId: participantsObj[0].userId }) &&
        chatObj.participants.includes({ userId: participantsObj[1].userId }),
    );
    if (!chatConn) {
      return addChatConnectionToDB({
        type,
        recipientNames,
        username,
      });
    }
    return {
      chatId: chatConn.chatId,
      status: 'success',
      message: `Connected to DM with ${recipientNames[0]}!`,
    };
  }
  return;
};

//TODO: move to a helper
const usernamesToUsers = (usernames: string[]): { userId: number }[] => {
  return usernames
    .map((username) =>
      usersList.find((userObj) => userObj.username === username),
    )
    .map((userObj) => ({
      userId: userObj.userId,
    }));
};

const addChatConnectionToDB = (
  props: ChatConnection,
): {
  chatId?: string | undefined;
  status: string;
  message: string;
} => {
  const { type, chatName, recipientNames, username } = props;
  const newChatId = uuid();
  if (type === 'group' && chatName && recipientNames.length > 1 && username) {
    if (chatDBmappings.find((chatObj) => chatObj.chatName === props.chatName)) {
      return {
        status: 'failed',
        message: 'Name already taken!',
      };
    }
    chatDBmappings = [
      ...chatDBmappings,
      {
        chatId: newChatId,
        chatName: chatName,
        type: 'group',
        participants: usernamesToUsers([username, ...recipientNames]),
      },
    ];
    messagesMock = [
      ...messagesMock,
      {
        chatId: newChatId,
        messages: [],
      },
    ];
    return {
      chatId: newChatId,
      status: 'success',
      message: 'Created new group!',
    };
  } else if (type === 'dm' && recipientNames.length === 1 && username) {
    chatDBmappings = [
      ...chatDBmappings,
      {
        chatId: newChatId,
        type: 'dm',
        participants: usernamesToUsers([username, recipientNames[0]]),
      },
    ];
    messagesMock = [
      ...messagesMock,
      {
        chatId: newChatId,
        messages: [],
      },
    ];
    return {
      chatId: newChatId,
      status: 'success',
      message: 'Created new DM!',
    };
  }
  return {
    status: 'failed',
    message: 'Failed to create group or DM!',
  };
};

const addUserToGroup = (props: {
  chatId: string;
  username: string;
}): { status: string } => {
  const { chatId, username } = props;
  const updated = chatDBmappings.find((chatObj) => {
    if (chatObj.chatId === chatId) {
      chatObj.participants = [
        ...chatObj.participants,
        { userId: usernamesToUsers([username])[0].userId },
      ];
      return true;
    }
  });
  return {
    status: updated ? 'success' : 'failed',
  };
};

const removeUserFromGroup = (props: {
  chatId: string;
  username: string;
}): { status: string } => {
  const { chatId, username } = props;
  const updated = chatDBmappings.find((chatObj) => {
    if (chatObj.chatId === chatId) {
      chatObj.participants = [
        ...chatObj.participants,
        { userId: usernamesToUsers([username])[0].userId },
      ];
      chatObj.participants = chatObj.participants.filter(
        (userObj) => userObj.userId !== usernamesToUsers([username])[0].userId,
      );
      return true;
    }
  });
  return {
    status: updated ? 'success' : 'failed',
  };
};

export {
  messagesMock,
  updateMessagesMock,
  fetchMessagesMock,
  connectToChat,
  addChatConnectionToDB,
  addUserToGroup,
  removeUserFromGroup,
};
