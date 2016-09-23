module.exports = function(app,models,sequelize){

	//CREATE A NEW STUDENT GIVEN A NAME
	app.put('/api/v1/student',(req,res)=>{
		let name = req.body.name
		models.student.create({name}).then((rs)=>{
			res.json({'status':'OK','data':rs});
		}).catch((e)=>{
			res.json({'status':'ERROR','message':e.message});
		});
	});

	//GET ALL STUDENTS
	app.get('/api/v1/student/all',(req,res)=>{
		models.student.findAll().then((rs)=>{
			res.json({'status':'OK','data':rs});
		}).catch((e)=>{
			res.json({'status':'ERROR','message':e.message});
		});
	});

	//GET A STUDENT BY NAME
	app.get('/api/v1/student/by-name/:name',(req,res)=>{
		let name = req.params.name;
		models.student.findOne({
			'where':{name}
		}).then((rs)=>{
			res.json({'status':'OK','data':rs});
		}).catch((e)=>{
			res.json({'status':'ERROR','message':e.message});
		});
	});

	//GET A STUDENT BY ID
	app.get('/api/v1/student/by-id/:id',(req,res)=>{
		let id = req.params.id;
		models.student.findOne({
			'where':{id}
		}).then((rs)=>{
			res.json({'status':'OK','data':rs});
		}).catch((e)=>{
			res.json({'status':'ERROR','message':e.message});
		});
	});
};
