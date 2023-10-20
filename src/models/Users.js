const bcrypt = require('bcrypt')

const Users = {
    dbName: 'dataBase', // Nome da chave no localStorage

    getData: function () {
        const usersJSON = localStorage.getItem(this.dbName);
        if (usersJSON) {
            return JSON.parse(usersJSON);
        } else {
            // Se não houver dados, cria uma base de dados vazia e armazena no localStorage
            const initialData = [];
            localStorage.setItem(this.dbName, JSON.stringify(initialData));
            return initialData;
        }
    },

    saveData: function(data) {
        localStorage.setItem(this.dbName, JSON.stringify(data));
    },
    generateId: function() {
        const users = this.getData();
        if (users.length > 0) {
            const lastUser = users[users.length - 1];
            return lastUser.id + 1;
        } else {
            return 1; // Se não houver usuários na base de dados, inicie com ID 1.
        }
    },
        create: function(user) {
            const users = this.getData();
            const newUser = {
                id: this.generateId(),
                ...user
            };
            users.push(newUser);
            this.saveData(users);
            return newUser;
        },
}

module.exports = Users;