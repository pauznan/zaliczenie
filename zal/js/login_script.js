//deklaracja apki angularowej
var app = angular.module("timeTableApp", ['ngCookies']);

//obsługa CORS (nie mam zielonego pojęcia, czy to faktycznie działa z poziomu kodu angulara)
app.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);

app.controller('timeTableLoginController', ['$scope','$http','$cookies', function($scope,$http,$cookies) {
	//logowanie
	$scope.login.login = function(){
		if($scope.login.username!=null&&$scope.login.username!=""&&$scope.login.password!=null&&$scope.login.password!=""){
			var login_request = {
			method: 'POST',
			url: 'https://wsg-mis.herokuapp.com/api/authenticate',
			headers: {
				'Host': 'wsg-mis.herokuapp.com',
				'Cache-Control': 'no-cache',
				'Postman-Token': 'e03e7957-6526-1d9e-cf55-790e5568f93e',
				'Content-Type': 'application/x-www-form-urlencoded',	
			},
			data:'username='+$scope.login.username+'&password='+$scope.login.password
		}
		$http(login_request).success(function(data,status){
			//jeśli logowanie się udało, wystrzel ciastka
			$cookies.put('user',$scope.login.username,{'expires': new Date(data.expires).toUTCString()});
			$cookies.put('token', data.token, {'expires': new Date(data.expires).toUTCString()});
			window.location.reload();	//wymuś odświeżenie
		});
		$http(login_request).error(function(data,status){
			//jeśli coś poszło nie tak (np. złe loginy)
			alert("Zły login lub hasło");
		});
		}else{
			//jeśli nie wszystkie pola są uzupełnione
			alert("Musisz wypełnić wszystkie pola");
		}
	};
	//sprawdzenie, czy user jest zalogowany
	$scope.login.isAuthed = function(){
		if($cookies.get('token'))
			return true;
		else
			return false;
	};
	//wylogowanie
	$scope.login.logout = function(){
		//wyloguj i zjedz ciastka, żeby ich nie było
		$cookies.remove('token');
		$cookies.remove('user');
		$scope.username = null;
	};
}]);