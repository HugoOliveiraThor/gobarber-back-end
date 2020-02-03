module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'gobarber',
  define: {
    timestamp: true, // Indicate that will be created a createAt and UpdateAt columns
    underscored: true, // This will apply the underscore code UserGroup -> user_group
    underscoredAll: true,
  },
};
