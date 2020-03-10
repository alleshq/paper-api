const {DataTypes} = require("sequelize");

module.exports = db => {
    db.Post = db.define("post", {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            allowNull: false
        },
        author: {
            type: DataTypes.UUID,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
};