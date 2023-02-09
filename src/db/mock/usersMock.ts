let usersList = [
  {
    username: 'boltkk',
    password: 'bolt',
  },
  {
    username: 'sentienta',
    password: 'asd',
  },
  {
    username: 'sasebot',
    password: 'donajmal',
  },
];

interface UserObject {
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
      username: userObj.username,
      password: userObj.password,
    },
  ];
  return true;
};

export { usersList, getUser, addUser };
