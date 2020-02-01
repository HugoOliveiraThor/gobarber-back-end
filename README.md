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
