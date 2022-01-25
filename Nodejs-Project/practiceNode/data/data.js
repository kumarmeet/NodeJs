const arr = [];

const usersSet = (user) => arr.push(user);

const usersGet = () => arr;

module.exports = {
  usersSet: usersSet,
  usersGet: usersGet,
};