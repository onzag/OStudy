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
		availability:{
			type: Sequelize.TEXT,
			allowNull:false,
			defaultValue:'{}',
			get: function()  {
				let val = this.getDataValue('availability');
				return JSON.parse(val);
			},
			set: function(val)  {
				this.setDataValue('availability',JSON.stringify(val));
			}
		}
	});
}
