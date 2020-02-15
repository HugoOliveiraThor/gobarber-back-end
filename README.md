## Back-End GoBarber


## Install Docker in Ubuntu
- https://www.digitalocean.com/community/tutorials/como-instalar-e-usar-o-docker-no-ubuntu-18-04-pt

## Install Postgress image
- docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -p 4434:4434 -d postgres

### Verify containers workings
docker ps

### Installl the PostBird to visual

### Commands container docker
- stop de container -> docker stop nameOfContainer
- list containers -> docker ps -a
- start of a container -> docker start nameOfContainer
- logs of a container -> docker logs

### Sequelize
#### ORM
- Abstract of a database
- Tables transform into models
- Examples : Table user became User.js
##### How to manipulate the data
- No SQL (in most times)
- Just javascript code
- Examples:
SQL
```
INSERT INTO users(name,email) VALUES ('Hugo Oliveira', 'hugo@mail.com')
```
SEQUELIZE
```
User.create({
  name:'Hugo Oliveira'
  email: 'hugo@mail.com'
})
```
SQL
```
SELECT * FROM users WHERE email = 'hugo@mail.com' LIMIT 1
```
SEQUELIZE
```
User.findOne({
  where: {
    email:'hugo@mail.com'
  }
})
```
_Thats interesting because we can change the databases and the code continues working._

### Migrations
- Its a control of a version of a database.
- Each file has instructions about create , alter and remove of tables and columns.
- Keep the database update between all the developers of time and the production enviroment.
- Each file is a migration and your order occurs by date.

#### Example:

```
module.export = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users')
  }
}
```
- Its possible to undo a migration if we wrong something while we are doing a feature
- After the migration send to another devs of production enviroment she could be never alter , a new need to be created.
- Each migration must make alters in one table , you could have many migrations to larger updatings.
#### SEEDS
- Using to populate the database in development
- Larger using to populate date in test
- Execute only by code
- Never will be used in production
- If you need data to go to production , the migration can manipulate this data in tables
#### MVC Arquitecture
- Model : Its the abastration of the database , used to manipulate the data inside de database. They dont have any responsability about the business rule of our application.
- Controller : Its the input of our requisitions, a route normally is associate to a specify method in a controller. We can include a big parts of the business rules of our application in controllers.
- View : A view is the return of the client, in applications who dont use the API REST model this could be an HTML, but in our case the view is just our JSON.
#### THE FACE OF A CONTROLLER
- Class
- Always return an JSON
- Dont call another method
- When create a new controller
 - Just five methods
 - I'm talking about the same entity
##### Examples:
```
class UserController: {
  index() {} // List users
  show() {} // Show just one user
  store() // Register an user
  update() {} // Alter an user
  delete() {} // Remove an user
}
```
### Configure Eslint - Prettier - EditorConfig
- yarn add eslint
- yarn eslint --init
- Select -> To check syntax , find problems , and enforce code style
- Javascript modules
- React or Vue - None
- Styleguide popular - Airbnb
- Format of file config - Javascript
1. Some rules
..."class-methods-use-this":"off" -> here we going to use class but not using this
..."no-params-reassign":"off" -> this will allow reassign params - The sequelize need this rules of because he used it
..."camelcase":"off"
..."no-unused-vars":["error", {"argsIgnorePattern": "next"}]
..."semi": 0
### Configure Prettier
- yarn add prettier eslint-config-prettier eslint-plugin-prettier -D
- Inside my eslintrc i will add an array :extends:['airbnb-base','prettier'],
- In rules in eslintrc put :
- "prettier/prettier":"error",
### Fix all files in one time
- yarn eslint --fix src --ext .js

## SEQUELIZE
- yarn add sequelize
- yarn add sequelize-cli - D
- create a file .sequelizerc - this will receive ours configs
```
const { resolve } = require('path')
module.exports = {
  config: resolve(__dirname, 'src', 'config', 'database.js'),
  'models-path': resolve(__dirname,'src', 'app', 'models'),
  'migrations-path': resolve(__dirname, 'src', 'database', migrations),
  'seeders-path': resolve(__dirname,'src','database','seeds')
}
```
### Database.js
- we have to set the dialect of the sequelize
- yarn add pg pg-hstore

### Create migrations
- yarn sequelize migration:create --name="create-users"
- example of migrations create-users
```
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      provider: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  },
};

```
- Test migrate yarn sequelize db:migrate
### Models
- Create user model
```
import Sequelize, { Model } from 'sequelize';

class User extends Model {
  static init(sequelize) {
    super.init({
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      password_hash: Sequelize.STRING,
      provider: Sequelize.BOOLEAN,
    });
  }
}

export default User;

```
### Database Connections
- create file in database called index.js
```
import Sequelize from 'sequelize';
import User from '../app/models/User';
import databaseConfig from '../config/database';

const models = [User]; // we will put all of our models

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map(model => model.init(this.connection));
  }
}

export default new Database();

```
### CONTROLLERS
#### User Controller
- Create a file in controllers -> UserController.js
```
import User from '../models/User';

class UserController {
  async store(req, res) {
    const userExists = await User.findOne({ where: { email: req.body.email } });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const user = await User.create(req.body);
    return res.json(user);
  }
}

export default new UserController();

```
### Bcryptjs
- yarn add bcrypt
- Inside Model User update the code
```
import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcrypt';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // This will never be inject in database
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash('user.password', 8); // The eight is the strength of the hash
      }
    }); // There a functions execute depending of some actions in sequelize
    return this;
  }
}

export default User;

```
### JWT
- First string before comma is the Headers
- Second string is the Payload - aditional informations
- Third is the signature of the token
- Add yarn add jsonwebtoken
#### Example:
```
import jwt from 'jsonwebtoken';
import User from '../models/User';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, '5a404a6fbc7adc031af006841e44b4b6', {
        expiresIn: '7d',
      }),
    });
  }
}

export default new SessionController();
```
- First parameter of token is informations we want to pass to our token an example ID
- Second parameter is a string secret ,
- Third parameter we have some options to increment our token


