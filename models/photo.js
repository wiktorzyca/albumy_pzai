const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('photo', {
    photo_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    photo_title: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    photo_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    location_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'location',
        key: 'location_id'
      }
    },
    photopath: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    album_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'photo',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "photo_id" },
        ]
      },
      {
        name: "location_id",
        using: "BTREE",
        fields: [
          { name: "location_id" },
        ]
      },
    ]
  });
};
