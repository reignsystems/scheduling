app.factory("globalService", ["$http", "$q", function($http, $q){
     
 	var serviceData;
	var service = {
		invokeAjax: invokeAjax,
		getSessionData: getSessionData,
		setSessionData: setSessionData
	}

	function setSessionData(item){
		serviceData = item;
	}

	function getSessionData(){
		return serviceData;
	}

    function invokeAjax(httpMethod, path, requestParam) {
	 	var deferred = $q.defer();
        $http({
			method: httpMethod,
			url: path,
			dataType: 'json',
			data: requestParam
		})
		.then(function (success){
			deferred.resolve(response);
		},function (error){
		    console.log(error, 'can not get data.');
		});
		return deferred.promise;
	}
      
      return service;
    
  }])