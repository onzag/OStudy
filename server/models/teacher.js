let Sequelize = require('sequelize');

module.exports = function(sequelize){
	return sequelize.define('teacher',{

		//The name of the teacher
		name: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: true
		},

		//Shortcut storing data as JSON
		avaliability:{
			type: Sequelize.TEXT,
			allowNull:false,
			defaultValue:'{}'
		}
	});
}
