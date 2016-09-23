let Sequelize = require('sequelize');

module.exports = function(sequelize){
	return sequelize.define('student',{

		//The name of the student
		name: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: true
		}
	});
}
