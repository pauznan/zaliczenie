app.controller('timeTableEditorController', ['$scope','$http','$cookies', function($scope,$http,$cookies) {

	var token = $cookies.get('token');	//zapisuje token z ciacha do zmiennej
	$scope.teacherSelected = null;	
	$scope.subjectSelected = null;
	//$scope.subjectEntrySelected = null;
	
	$scope.username = $cookies.get('user');	//to ciastko ma tylko nazwe usera do wyświetlenia, kto się zalogował
		if($cookies.get('token')){
		getAllSubjectEntrys ($http, token, function(data){
			$scope.subjectEntrys= data;	//uzupełnienie listy przydziałów
		});
		getAllSubjects ($http, token, function(data){
			$scope.subjects= data;	//uzupełnienie listy przedmiotów
		});
		getAllTeachers ($http, token, function(data){
			$scope.teachers= data;	//uzupełnienie listy wykładowców
		});
		getAllStudentGroups ($http, token, function(data){
			$scope.studentGroups= data;	//uzupełnienie listy grup
		});
		}
	//Usuwanie przedmiotu
	$scope.editor.subjectDelete = function(id){
		var conf = confirm("Czy na pewno chcesz usunąć ten przedmiot?");
		if(conf){
			deleteSubject($http,token,id,function(data){
				location.reload(); 
			});
		}
	};
	//Usuwanie przydziału
	$scope.editor.subjectEntryDelete = function(id){
		var conf = confirm("Czy na pewno chcesz usunąć ten przedmiot?");
		if(conf){
			deleteSubjectEntry($http,token,id,function(data){
				location.reload(); 
			});
		}
	};
	//przechowanie zaznaczenia przedmiotu
	$scope.editor.subjectSelect = function(id){
		getSubject($http,token,id,function(data){
			$scope.subjectSelected = data;
		});
	};
	//przechowanie zaznaczenia wykładowcy
	$scope.editor.teacherSelect = function(id){
		getTeacher($http,token,id,function(data){
			$scope.teacherSelected = data;
		});
	};
	/*//przechowanie zaznaczenia przydziału
	$scope.editor.subjectEntrySelect = function(id){
		getSubjectEntry($http,token,id,function(data){
			$scope.subjectEntrySelected = data;
		});
	};*/
	
	//dodawanie przydziału
	$scope.editor.subjectEntryAdd = function(){
		if($scope.teacherSelected!=null&&$scope.subjectSelected!=null&&$scope.studentGroup!=null)
		{
			getStudentGroup($http,token,$scope.studentGroup,function(data){
				var send = {
					"studentGroup": data,
					"subject": $scope.subjectSelected,
					"teacher": $scope.teacherSelected
				};
				addSubjectEntry($http,token,send,function(data){
					location.reload(); 
				});
			});
		}else{
			alert("Musisz wybrać prowadzącego, przedmiot z list powyżej i wybrać grupę");
		}
	};
	
	//dodawanie przedmiotu
	$scope.editor.subjectAdd = function(){
		if($scope.subjectType!=null&&$scope.subjectName!=null&&$scope.subjectName!="")
		{
			var send = {
				"name": $scope.subjectName,
				"type": $scope.subjectType
			};
			addSubject($http,token,send,function(data){
				location.reload(); 
			});
		}else{
			alert("Musisz podać nazwę przedmiotu i wybrać jego typ");
		}
	};
	
	//zmiana formatu wyświetlenia typu przedmiotu
	$scope.editor.changeSubjectType = function(type){
	switch(type){
		case 'LECTURE': return '(W)';
		case 'LAB': return '(L)';
		case 'PRACTICE': return '(C)';
	}};
	
	//predefiniuj filtry
	$scope.teacherFilter = {"user":{"firstName":""}};
	$scope.subjectFilter = {"name":""};
	$scope.subjectEntryFilter = {"teacher":{"user":{"firstName":""}}};
	
	//filtr wykładowców
	$scope.addTeacherFilter = function(keyw){
		switch(keyw){
			case "firstName": $scope.teacherFilter = {"user":{"firstName":$scope.filter.teacherInput}}; break;
			case "lastName": $scope.teacherFilter = {"user":{"lastName":$scope.filter.teacherInput}}; break;
		}
	}
	//filtr przedmiotów
	$scope.addSubjectFilter = function(keyw){
		switch(keyw){
			case "name": $scope.subjectFilter = {"name":$scope.filter.subjectInput}; break;
			case "type": $scope.subjectFilter = {"type":$scope.filter.subjectInput}; break;
		}
	}
	//filtr przydziałów
	$scope.addSubjectEntryFilter = function(keyw){
		switch(keyw){
			case "name": $scope.subjectEntryFilter = {"subject":{"name":$scope.filter.subjectEntryInput}}; break;
			case "type": $scope.subjectEntryFilter = {"subject":{"type":$scope.filter.subjectEntryInput}}; break;
			case "firstName": $scope.subjectEntryFilter = {"teacher":{"user":{"firstName":$scope.filter.subjectEntryInput}}}; break;
			case "lastName": $scope.subjectEntryFilter = {"teacher":{"user":{"lastName":$scope.filter.subjectEntryInput}}}; break;
		}
	}
	
}]);
 
function getAllSubjectEntrys($http, token, callback){
	var request = {
		method:'GET',
		url: 'https://wsg-mis.herokuapp.com/api/subjectEntrys',
		headers:{
			'Access-Control-Allow-Origin': '*',
			'Accept': 'application/json',
			'X-Auth-Token':token,
			
		}
	}
	$http(request).success(function(data,status) {if(callback) callback(data);});
}
function getAllSubjects($http, token, callback){
	var request = {
		method:'GET',
		url: 'https://wsg-mis.herokuapp.com/api/subjects',
		headers:{
			'Access-Control-Allow-Origin': '*',
			'Accept': 'application/json',
			'X-Auth-Token':token,
			
		}
	}
	$http(request).success(function(data,status) {if(callback) callback(data);});
}
function getAllTeachers($http, token, callback){
	var request = {
		method:'GET',
		url: 'https://wsg-mis.herokuapp.com/api/teachers',
		headers:{
			'Access-Control-Allow-Origin': '*',
			'Accept': 'application/json',
			'X-Auth-Token':token,
			
		}
	}
	$http(request).success(function(data,status) {if(callback) callback(data);});
}
function getTeacher($http,token,id,callback){
		var request = {
			method:'GET',
			url: 'https://wsg-mis.herokuapp.com/api/teachers/'+id,
			 headers: {
			   'Access-Control-Allow-Origin': '*',
			   'Accept': 'application/json',
			   'X-Auth-Token':token,
			}
		}
		$http(request).success(function(data, status) {if(callback) callback(data);});
}
function getSubject($http,token,id,callback){
		var request = {
			method:'GET',
			url: 'https://wsg-mis.herokuapp.com/api/subjects/'+id,
			 headers: {
			   'Access-Control-Allow-Origin': '*',
			   'Accept': 'application/json',
			   'X-Auth-Token':token,
			}
		}
		$http(request).success(function(data, status) {if(callback) callback(data);});
}
function getSubjectEntry($http,token,id,callback){
		var request = {
			method:'GET',
			url: 'https://wsg-mis.herokuapp.com/api/subjectEntrys/'+id,
			 headers: {
			   'Access-Control-Allow-Origin': '*',
			   'Accept': 'application/json',
			   'X-Auth-Token':token,
			}
		}
	$http(request).success(function(data, status) {if(callback) callback(data);});
}
function deleteSubject($http,token,id,callback){
		var request = {
			method:'DELETE',
			url: 'https://wsg-mis.herokuapp.com/api/subjects/'+id,
			 headers: {
			   'Access-Control-Allow-Origin': '*',
			   'Accept': 'application/json',
			   'X-Auth-Token':token,
			}
		}
		$http(request).success(function(data, status) {if(callback) callback(data);});
}
function deleteSubjectEntry($http,token,id,callback){
		var request = {
			method:'DELETE',
			url: 'https://wsg-mis.herokuapp.com/api/subjectEntrys/'+id,
			 headers: {
			   'Access-Control-Allow-Origin': '*',
			   'Accept': 'application/json',
			   'X-Auth-Token':token,
			}
		}
	$http(request).success(function(data, status) {if(callback) callback(data);});
}
function addSubject($http,token,send,callback){
		var request = {
			method:'POST',
			url: 'https://wsg-mis.herokuapp.com/api/subjects/',
			 headers: {
			   'Access-Control-Allow-Origin': '*',
			   'Accept': 'application/json',
			   'X-Auth-Token':token,
			},
			data: send
		}
		$http(request).success(function(data, status) {if(callback) callback(data);});
}
function addSubjectEntry($http,token,send,callback){
		var request = {
			method:'POST',
			url: 'https://wsg-mis.herokuapp.com/api/subjectEntrys/',
			 headers: {
			   'Access-Control-Allow-Origin': '*',
			   'Accept': 'application/json',
			   'X-Auth-Token':token,
			},
			data: send
		}
	$http(request).success(function(data, status) {if(callback) callback(data);});
}
function getAllStudentGroups($http,token,callback){
		var request = {
			method:'GET',
			url: 'https://wsg-mis.herokuapp.com/api/studentGroups',
			 headers: {
			   'Access-Control-Allow-Origin': '*',
			   'Accept': 'application/json',
			   'X-Auth-Token':token,
			}
		}
		$http(request).success(function(data, status) {if(callback) callback(data);});
		
}
function getStudentGroup($http,token,id,callback){
		var request = {
			method:'GET',
			url: 'https://wsg-mis.herokuapp.com/api/studentGroups/'+id,
			 headers: {
			   'Access-Control-Allow-Origin': '*',
			   'Accept': 'application/json',
			   'X-Auth-Token':token,
			}
		}
		$http(request).success(function(data, status) {if(callback) callback(data);});
}