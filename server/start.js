//GET DEPENDENCIES
let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let Sequelize = require('sequelize');

//INIT DATABASE
let sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: './data.db'
});
//POPULATE MODELS
let teacher = require('./models/teacher')(sequelize);
let student = require('./models/student')(sequelize);

//ENABLE CORS
app.use((req, res, next)=>{
	res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
	res.header('Access-Control-Allow-Credentials', 'true');
	res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
	res.header('Access-Control-Expose-Headers', 'Content-Length');
	res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
	if (req.method === 'OPTIONS') {
		return res.send(200);
	} else {
		return next();
	}
});

//PARSE JSON BODY
app.use(bodyParser.json());

//INITIALIZE ENDPOINTS
require('./endpoints/teacher')(app,{teacher,student},sequelize);
require('./endpoints/student')(app,{teacher,student},sequelize);

//SYNC DATABASE AND START APP
sequelize.sync().then(()=>{
	app.listen(8080,()=>{
		console.log('listening at 8080');
	});
});
