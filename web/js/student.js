function getStudent(name,callback){
	fetch(ENDPOINT + '/api/v1/student/by-name/' + encodeURIComponent(name)).then(function(data){
		return data.json();
	}).then(function(rs){
		if (rs.status === 'OK'){
			if (rs.data === null){
				createStudent(name,callback)
			} else {
				callback(null,rs.data,false);
			}
		} else {
			callback(rs);
		}
	}).catch(callback);
}

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

function getTeachers(callback){
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

function generateDataFrom(teachers,student){

	window.AVAILABILITY = {};

	result = '';
	teachers.forEach(function(teacher){
		result += '<h2>' + teacher.name +'</h2>';
		result += generateDataForTeacher(teacher,student);
	});

	if (!teachers){
		result += '<h2>We have no teachers :(</h2>';
	}

	document.querySelector('#content').innerHTML = result;

	Array.prototype.slice.call(document.querySelectorAll('[data-day]')).forEach(function(element){
		element.addEventListener('click',function(e){
			if (element.classList.contains('taken') || element.classList.contains('closed')){
				return;
			}
			var clone = Object.assign({},window.AVAILABILITY[element.dataset.teacherId]);
			var day = element.dataset.day;
			var slot = element.dataset.slot;
			var cls;
			var name;
			if (element.classList.contains('open')){
				clone[day][slot] = {'open':true,'taken':true,'takenBy':student.name,'takenById':student.id};
				cls = "taken-by-me";
				name = "GOT CLASSES";
			} else {
				clone[day][slot] = {'open':true};
				cls = "open";
				name = "OPEN";
			}
			updateAvaliability(element.dataset.teacherId,clone,element,cls,name);
		});
	});

	return;
}

function generateDataForTeacher(teacher,student){

	window.AVAILABILITY[teacher.id] = teacher.availability;

	function msToTime(duration) {
		var minutes = parseInt((duration/(1000*60))%60)
		, hours = parseInt((duration/(1000*60*60))%24);

		hours = (hours < 10) ? "0" + hours : hours;
		minutes = (minutes < 10) ? "0" + minutes : minutes;

		return hours + ":" + minutes
	}

	var result = '<table><thead><tr>';
	['time','Monday','Tuesday','Wednesday','Thrusday','Friday','Saturday','Sunday'].forEach(function(day){
		result += '<th>' + day + '</th>';
	});
	result += '</tr></thead><tbody>';
	for (var slot = 0; slot < 48; slot++){

		result += '<tr>';

		var mstime = 1800000 * slot;
		var strtime = msToTime(mstime);
		
		result += '<td>' + strtime + '</td>';
		
		['Mo','Tu','We','Th','Fr','Sa','Su'].forEach(function(day){
			let slotData = teacher.availability[day] && teacher.availability[day][slot];
			if (!slotData){
				result += '<td class="closed" data-day="' + day + '" data-slot="' + slot + '">CLOSED</td>';
			} else {
				if (slotData.open){
					if (slotData.taken && slotData.takenById === student.id){
						result += '<td class="taken-by-me" data-day="' + day + '" data-slot="' + 
							slot + '" data-teacher-id="' + teacher.id + '">GOT CLASSES</td>';
					} else if (slotData.taken){
						result += '<td class="taken" data-day="' + day + '" data-slot="' + 
							slot + '" data-teacher-id="' + teacher.id + '">' + slotData.takenBy + '</td>';
					} else {
						result += '<td class="open" data-day="' + day + '" data-slot="' + slot + 
							'" data-teacher-id="' + teacher.id + '">OPEN</td>';
					}
				} else {
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

function updateAvaliability(teacherid,data,element,cls,name){
	fetch(ENDPOINT + '/api/v1/teacher/by-id/' + teacherid + '/availability',{
		method: 'POST', 
		headers: new Headers({
			'Content-Type': 'application/json'
		}),
		body: JSON.stringify({'availability':data})
	}).then(function(data){
		return data.json();
	}).then(function(rs){
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

var content = document.querySelector('#content');
content.innerHTML = '<input type="text" placeholder="please insert your name"></input><button>OK</button>';

var button = document.querySelector('button');
button.addEventListener('click',function(){
	var input = document.querySelector('input');
	var name = input.value;
	if (!name){
		alert('Please provide a valid name');
	} else {
		button.disabled = true;
		input.disabled = true;
		getStudent(name,function(err,student,created){
			if (err){
				alert(err.message);
				button.disabled = false;
				input.disabled = false;
				return;
			}
			if (created){
				document.querySelector('#action').textContent = 'Welcome to OStudy, ' + student.name;
			} else {
				document.querySelector('#action').textContent = 'Welcome back, ' + student.name;
			}
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
