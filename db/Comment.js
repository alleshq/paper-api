const {DataTypes} = require("sequelize");

module.exports = db => {
    db.Comment = db.define("comment", {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            allowNull: false
        },
        authorId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    });

    //Post Association
    db.Post.hasMany(db.Comment);
    db.Comment.belongsTo(db.Post);
};