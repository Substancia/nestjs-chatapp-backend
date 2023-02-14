let usersList = [
  {
    userId: 0,
    username: 'sentienta',
    password: 'asd',
  },
  {
    userId: 1,
    username: 'boltkk',
    password: 'bolt',
  },
  {
    userId: 2,
    username: 'sasebot',
    password: 'donajmal',
  },
];

interface UserObject {
  userId?: number | undefined;
  username: string;
  password: string;
}

const getUser = (userObj: UserObject): UserObject | undefined => {
  return usersList.find(
    (user) =>
      user.username === userObj.username && user.password === userObj.password,
  );
};

const addUser = (userObj: UserObject): boolean => {
  usersList = [
    ...usersList,
    {
      userId: usersList.length,
      username: userObj.username,
      password: userObj.password,
    },
  ];
  return true;
};

export { usersList, getUser, addUser };
