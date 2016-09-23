/**
 * Provides a teacher by name
 * @param {String} name the name of the teacher
 * @param {Function} callback the generic callback
 */
function getTeacher(name,callback){
	//First we fetch the teacher by name from the API
	fetch(ENDPOINT + '/api/v1/teacher/by-name/' + encodeURIComponent(name)).then(function(data){
		return data.json();
	}).then(function(rs){
		//if we have a valid result
		if (rs.status === 'OK'){
			if (rs.data === null){
				//Create a new teacher if not found
				createTeacher(name,callback)
			} else {
				callback(null,rs.data,false);
			}
		} else {
			callback(rs);
		}
	}).catch(callback);
}

/**
 * Creates a teacher given a name
 * @param {String} name the name of the teacher
 * @param {Function} callback the generic callback
 */
function createTeacher(name,callback){
	fetch(ENDPOINT + '/api/v1/teacher',{
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
 * Generates the week structure for the teacher
 * @param {Object} teacher
 */
function generateDataFrom(teacher){

	//Firstly we store these variables
	window.TEACHER_ID = teacher.id;
	window.AVAILABILITY = teacher.availability;

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
					//Taken by an student
					if (slotData.taken){
						result += '<td class="taken" data-day="' + day + '" data-slot="' + slot + '">' + slotData.takenBy + '</td>';
					//Or just plain open
					} else {
						result += '<td class="open" data-day="' + day + '" data-slot="' + slot + '">OPEN</td>';
					}
				} else {
					//Or closed
					result += '<td class="closed" data-day="' + day + '" data-slot="' + slot + '">CLOSED</td>';
				}
			}
		});

		result += '</tr>';
	}
	result += '</tbody></table>';

	//Put that in the DOM
	document.querySelector('#content').innerHTML = result;

	//Per every slot
	Array.prototype.slice.call(document.querySelectorAll('[data-day]')).forEach(function(element){

		//Add an event listener
		element.addEventListener('click',function(e){

			//If the slot is taken we pass
			if (element.classList.contains('taken')){
				return;
			}

			//Otherwise we clone the availability data for a new one
			var clone = Object.assign({},window.AVAILABILITY);

			//get the day and the slot id
			var day = element.dataset.day;
			var slot = element.dataset.slot;
			var cls;
			var name;

			//if it's closed we open it
			if (element.classList.contains('closed')){
				if (!clone[day]){
					clone[day] = {};
				}
				clone[day][slot] = {'open':true};
				cls = "open";
				name = "OPEN";

			//if it's open we close it
			} else {
				delete clone[day][slot];
				cls = "closed";
				name = "CLOSED";
			}

			//and update
			updateAvaliability(clone,element,cls,name);
		});
	});
}

/**
 * Updates the avaliability of a specific teacher
 * @param {Object} data the new availability
 * @param {HTMLElement} element an element that represents the updated slot
 * @param {String} cls a class to add to that element
 * @param {String} name a new textContent for that element
 */
function updateAvaliability(data,element,cls,name){

	//Make the call to the API
	fetch(ENDPOINT + '/api/v1/teacher/by-id/' + TEACHER_ID + '/availability',{
		method: 'POST', 
		headers: new Headers({
			'Content-Type': 'application/json'
		}),
		body: JSON.stringify({'availability':data})
	}).then(function(data){
		return data.json();
	}).then(function(rs){
		//if it's ok
		if (rs.status === 'OK'){
			//update the avaliablity
			window.AVAILABILITY = data;
			element.className = cls;
			element.textContent = name;
		} else {
			//show a message
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

		//we get the teacher for that name
		getTeacher(name,function(err,teacher,created){

			//in case of error we alert and enable the input again
			if (err){
				alert(err.message);
				button.disabled = false;
				input.disabled = false;
				return;
			}

			//if it's a new teacher
			if (created){
				//show new message
				document.querySelector('#action').textContent = 'Welcome to OStudy, ' + teacher.name;
			} else {
				//show standard message
				document.querySelector('#action').textContent = 'Welcome back, ' + teacher.name;
			}

			//generate the teacher weekmap
			generateDataFrom(teacher);
		});
	}
});
