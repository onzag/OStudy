module.exports = function(app,models,sequelize){

	//ADD A NEW TEACHER
	app.put('/api/v1/teacher',(req,res)=>{
		let name = req.body.name
		models.teacher.create({name}).then((rs)=>{
			res.json({'status':'OK','data':rs});
		}).catch((e)=>{
			res.json({'status':'ERROR','message':e.message});
		});
	});

	//GET ALL TEACHERS
	app.get('/api/v1/teacher/all',(req,res)=>{
		models.teacher.findAll().then((rs)=>{
			res.json({'status':'OK','data':rs});
		}).catch((e)=>{
			res.json({'status':'ERROR','message':e.message});
		});
	});

	//GET A TEACHER BY NAME
	app.get('/api/v1/teacher/by-name/:name',(req,res)=>{
		let name = req.params.name;
		models.teacher.findOne({
			'where':{name}
		}).then((rs)=>{
			res.json({'status':'OK','data':rs});
		}).catch((e)=>{
			res.json({'status':'ERROR','message':e.message});
		});
	});

	//GET A TEACHER BY AN ID
	app.get('/api/v1/teacher/by-id/:id',(req,res)=>{
		let id = req.params.id;
		models.teacher.findOne({
			'where':{id}
		}).then((rs)=>{
			res.json({'status':'OK','data':rs});
		}).catch((e)=>{
			res.json({'status':'ERROR','message':e.message});
		});
	});

	//CHANGE THE TEACHER AVALIABILITY (includes student slots taken) - shortcut.
	app.post('/api/v1/teacher/by-id/:id/avaliability',(req,res)=>{
		let avaliability = JSON.stringify(req.body.avaliability);
		models.teacher.update({avaliability},{
			'where':{
				'id':req.params.id
			}
		}).then((rs)=>{
			res.json({'status':'OK','data':rs});
		}).catch((e)=>{
			res.json({'status':'ERROR','message':e.message});
		});
	});
};
