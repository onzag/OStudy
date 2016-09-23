/**
 * Provides a student by name
 * @param {String} name the name of the student
 * @param {Function} callback the generic callback
 */
function getStudent(name,callback){
	//First we fetch the student by name from the API
	fetch(ENDPOINT + '/api/v1/student/by-name/' + encodeURIComponent(name)).then(function(data){
		//convert it to json
		return data.json();
	}).then(function(rs){
		//if we have a valid result
		if (rs.status === 'OK'){
			if (rs.data === null){
				//create a new student if it doesnt exist
				createStudent(name,callback)
			} else {
				callback(null,rs.data,false);
			}
		} else {
			callback(rs);
		}
	}).catch(callback);
}

/**
 * Creates a student given a name
 * @param {String} name the name of the student
 * @param {Function} callback the standard callback
 */
function createStudent(name,callback){
	fetch(ENDPOINT + '/api/v1/student',{
		method: 'PUT', 
		headers: new Headers({
			'Content-Type': 'application/json'
		}),
		body: JSON.stringify({'name':name})
	}).then(function(data){
		return data.json();
	}).then(function(rs){
		if (rs.status === 'OK'){
			callback(null,rs.data,true);
		} else {
			callback(rs);
		}
	}).catch(callback);
}

/**
 * Gets all the teachers with all their data
 * @param {String} name the name of the student
 * @param {Function} callback the standard callback
 */
function getTeachers(callback){
	//We get all the teachers from the API
	fetch(ENDPOINT + '/api/v1/teacher/all').then(function(data){
		return data.json();
	}).then(function(rs){
		if (rs.status === 'OK'){
			callback(null,rs.data);
		} else {
			callback(rs);
		}
	}).catch(callback);
}

/**
 * Generates the data from the teachers
 * @param {Array<Object>} teachers all the teachers list
 * @param {Function} callback the standard callback
 */
function generateDataFrom(teachers,student){

	window.AVAILABILITY = {};

	//Start generating the structure
	result = '';

	//Add the title and data for every teacher
	teachers.forEach(function(teacher){
		result += '<h2>' + teacher.name +'</h2>';
		result += generateDataForTeacher(teacher,student);
	});

	//If you have no teachers show a message
	if (!teachers){
		result += '<h2>We have no teachers :(</h2>';
	}

	//Set it in the DOM
	document.querySelector('#content').innerHTML = result;

	//Per every slot per teacher
	Array.prototype.slice.call(document.querySelectorAll('[data-day]')).forEach(function(element){

		//Add an event listener
		element.addEventListener('click',function(e){

			//If the slot is taken or closed, we pass
			if (element.classList.contains('taken') || element.classList.contains('closed')){
				return;
			}

			//Otherwise we clone the availability data for a new one
			var clone = Object.assign({},window.AVAILABILITY[element.dataset.teacherId]);

			//get the day and the slot id
			var day = element.dataset.day;
			var slot = element.dataset.slot;
			var cls;
			var name;

			//if it's open we take it
			if (element.classList.contains('open')){
				clone[day][slot] = {'open':true,'taken':true,'takenBy':student.name,'takenById':student.id};
				cls = "taken-by-me";
				name = "GOT CLASSES";

			//if it's closed we open it
			} else {
				clone[day][slot] = {'open':true};
				cls = "open";
				name = "OPEN";
			}

			//send it to update
			updateAvaliability(element.dataset.teacherId,clone,element,cls,name);
		});
	});

	return;
}

/**
 * Generates the week structure for the teacher
 * @param {Object} teacher
 * @param {Object} student
 * @return {String} the structure of the week
 */
function generateDataForTeacher(teacher,student){

	//We store the main availability
	window.AVAILABILITY[teacher.id] = teacher.availability;

	/**
	 * Converts milliseconds to human readable time
	 * @param {Integer} duration
	 * @return {String} the human readable time
	 */
	function msToTime(duration) {
		var minutes = parseInt((duration/(1000*60))%60)
		, hours = parseInt((duration/(1000*60*60))%24);

		hours = (hours < 10) ? "0" + hours : hours;
		minutes = (minutes < 10) ? "0" + minutes : minutes;

		return hours + ":" + minutes
	}

	//start generating the structure first we make the header of the table
	var result = '<table><thead><tr>';
	['time','Monday','Tuesday','Wednesday','Thrusday','Friday','Saturday','Sunday'].forEach(function(day){
		result += '<th>' + day + '</th>';
	});
	result += '</tr></thead><tbody>';

	//Per slot
	for (var slot = 0; slot < 48; slot++){

		//Open a row
		result += '<tr>';

		//Half an hour
		var mstime = 1800000 * slot;
		var strtime = msToTime(mstime);
		
		//Add the time
		result += '<td>' + strtime + '</td>';
		
		//Per day
		['Mo','Tu','We','Th','Fr','Sa','Su'].forEach(function(day){

			//Get the slot data if exists
			let slotData = teacher.availability[day] && teacher.availability[day][slot];

			//If theres nothing
			if (!slotData){
				//It is closed
				result += '<td class="closed" data-day="' + day + '" data-slot="' + slot + '">CLOSED</td>';
			} else {

				//Otherwise it can be open
				if (slotData.open){
					//It can be taken, can be taken by the current student
					if (slotData.taken && slotData.takenById === student.id){
						result += '<td class="taken-by-me" data-day="' + day + '" data-slot="' + 
							slot + '" data-teacher-id="' + teacher.id + '">GOT CLASSES</td>';

					//Someone else
					} else if (slotData.taken){
						result += '<td class="taken" data-day="' + day + '" data-slot="' + 
							slot + '" data-teacher-id="' + teacher.id + '">' + slotData.takenBy + '</td>';

					//Of it's just open
					} else {
						result += '<td class="open" data-day="' + day + '" data-slot="' + slot + 
							'" data-teacher-id="' + teacher.id + '">OPEN</td>';
					}
				} else {
					//Or closed as well if there's no details
					result += '<td class="closed" data-day="' + day + 
						'" data-slot="' + slot + '" data-teacher-id="' + teacher.id + '">CLOSED</td>';
				}
			}
		});

		result += '</tr>';
	}
	result += '</tbody></table>';

	return result;
}

/**
 * Updates the avaliability of a specific teacher
 * @param {String} teacherid the id of the teacher
 * @param {Object} data the new availability
 * @param {HTMLElement} element an element that represents the updated slot
 * @param {String} cls a class to add to that element
 * @param {String} name a new textContent for that element
 */
function updateAvaliability(teacherid,data,element,cls,name){

	//Firstly we change the availability
	fetch(ENDPOINT + '/api/v1/teacher/by-id/' + teacherid + '/availability',{
		method: 'POST', 
		headers: new Headers({
			'Content-Type': 'application/json'
		}),
		body: JSON.stringify({'availability':data})
	}).then(function(data){
		return data.json();
	}).then(function(rs){
		//if we succeed we change the state of the element
		if (rs.status === 'OK'){
			window.AVAILABILITY[teacherid] = data;
			element.className = cls;
			element.textContent = name;
		} else {
			alert(rs.message);
		}
	}).catch(function(err){
		alert(err.message);
	});
}

//firstly we get the content container and add an input and a button
var content = document.querySelector('#content');
content.innerHTML = '<input type="text" placeholder="please insert your name"></input><button>OK</button>';

//take the button and on click
var button = document.querySelector('button');
button.addEventListener('click',function(){

	//we get the name
	var input = document.querySelector('input');
	var name = input.value;

	//if it's not valid we alert
	if (!name){
		alert('Please provide a valid name');
	} else {
		//Otherwise we disable the button and the input
		button.disabled = true;
		input.disabled = true;

		//we get the student for that name
		getStudent(name,function(err,student,created){

			//in case of error we alert and enable the input again
			if (err){
				alert(err.message);
				button.disabled = false;
				input.disabled = false;
				return;
			}

			//if it's a new user
			if (created){
				//show new message
				document.querySelector('#action').textContent = 'Welcome to OStudy, ' + student.name;
			} else {
				//show standard message
				document.querySelector('#action').textContent = 'Welcome back, ' + student.name;
			}

			//Get all the teachers and create the table data
			getTeachers(function(err,teachers){
				if (err){
					alert(err.message);
				} else {
					generateDataFrom(teachers,student);
				}
			});
		});
	}
});
