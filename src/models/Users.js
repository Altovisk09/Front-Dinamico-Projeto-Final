const bcrypt = require('bcrypt');

class Users {
  constructor() {
    this.dbName = 'dataBase';
  }

  getData() {
    const usersJSON = localStorage.getItem(this.dbName);
    if (usersJSON) {
      return JSON.parse(usersJSON);
    } else {
      const initialData = [];
      localStorage.setItem(this.dbName, JSON.stringify(initialData));
      return initialData;
    }
  }

  saveData(data) {
    localStorage.setItem(this.dbName, JSON.stringify(data));
  }

  generateId() {
    const users = this.getData();
    if (users.length > 0) {
      const lastUser = users[users.length - 1];
      return lastUser.id + 1;
    } else {
      return 1;
    }
  }

  create(user) {
    const users = this.getData();
    const newUser = {
      id: this.generateId(),
      ...user,
    };
    users.push(newUser);
    this.saveData(users);
    return newUser;
  }
}

module.exports = Users;
