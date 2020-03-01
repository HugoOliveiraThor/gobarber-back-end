module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'avatar_id', {
      type: Sequelize.INTEGER,
      references: { model: 'files', key: 'id' }, // This means all avatar_id is reference in users from table files and key id
      onUpdate: 'CASCADE', // Some options when changes happens
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumns('users', 'avatar_id');
  },
};
