const {DataTypes} = require("sequelize");

module.exports = db => {
	db.Like = db.define("like", {
		userId: {
			type: DataTypes.UUID,
			allowNull: false
		}
	});

	//Post Association
	db.Post.hasMany(db.Like);
	db.Like.belongsTo(db.Post);
};
