const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('comment', {
    comment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nickname: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    comment_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    photo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'photo',
        key: 'photo_id'
      }
    }
  }, {
    sequelize,
    tableName: 'comment',
    timestamps: false,
    indexes: [
      {
        name: "photo_id",
        using: "BTREE",
        fields: [
          { name: "photo_id" },
        ]
      },
    ]
  });
};
