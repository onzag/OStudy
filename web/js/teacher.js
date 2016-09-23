function getTeacher(name,callback){
	fetch(ENDPOINT + '/api/v1/teacher/by-name/' + encodeURIComponent(name)).then(function(data){
		return data.json();
	}).then(function(rs){
		if (rs.status === 'OK'){
			if (rs.data === null){
				createTeacher(name,callback)
			} else {
				callback(null,rs.data,false);
			}
		} else {
			callback(rs);
		}
	}).catch(callback);
}

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

function generateDataFrom(teacher){

	window.TEACHER_ID = teacher.id;
	window.AVAILABILITY = teacher.availability;

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
					if (slotData.taken){
						result += '<td class="taken" data-day="' + day + '" data-slot="' + slot + '">' + slotData.takenBy + '</td>';
					} else {
						result += '<td class="open" data-day="' + day + '" data-slot="' + slot + '">OPEN</td>';
					}
				} else {
					result += '<td class="closed" data-day="' + day + '" data-slot="' + slot + '">CLOSED</td>';
				}
			}
		});

		result += '</tr>';
	}
	result += '</tbody></table>';

	document.querySelector('#content').innerHTML = result;

	Array.prototype.slice.call(document.querySelectorAll('[data-day]')).forEach(function(element){
		element.addEventListener('click',function(e){
			if (element.classList.contains('taken')){
				return;
			}
			var clone = Object.assign({},window.AVAILABILITY);
			var day = element.dataset.day;
			var slot = element.dataset.slot;
			var cls;
			var name;
			if (element.classList.contains('closed')){
				if (!clone[day]){
					clone[day] = {};
				}
				clone[day][slot] = {'open':true};
				cls = "open";
				name = "OPEN";
			} else {
				delete clone[day][slot];
				cls = "closed";
				name = "CLOSED";
			}
			updateAvaliability(clone,element,cls,name);
		});
	});
}

function updateAvaliability(data,element,cls,name){
	fetch(ENDPOINT + '/api/v1/teacher/by-id/' + TEACHER_ID + '/availability',{
		method: 'POST', 
		headers: new Headers({
			'Content-Type': 'application/json'
		}),
		body: JSON.stringify({'availability':data})
	}).then(function(data){
		return data.json();
	}).then(function(rs){
		if (rs.status === 'OK'){
			window.AVAILABILITY = data;
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
		getTeacher(name,function(err,teacher,created){
			if (err){
				alert(err.message);
				button.disabled = false;
				input.disabled = false;
				return;
			}
			if (created){
				document.querySelector('#action').textContent = 'Welcome to OStudy, ' + teacher.name;
			} else {
				document.querySelector('#action').textContent = 'Welcome back, ' + teacher.name;
			}
			generateDataFrom(teacher);
		});
	}
});
