const {DataTypes} = require("sequelize");

module.exports = db => {
	db.PostLike = db.define("postLike", {
		userId: {
			type: DataTypes.UUID,
			allowNull: false
		}
	});

	//Post Association
	db.Post.hasMany(db.PostLike);
	db.PostLike.belongsTo(db.Post);
};
