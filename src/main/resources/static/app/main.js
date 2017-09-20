app.controller('mainCtrl', function($scope, $rootScope, $http, $filter, globalService) {
    var vm = this,
        schedule = {};
    var geocoder;
    var newAddress;
    var path, count = 0;

    $scope.pickTeam = true;
    $scope.searchAddress = "Start Job";
    $scope.NextAddress = "Next Schedule";
    $scope.selectTeamBack = "Back";
    //$scope.showNext = true;
    $scope.showSearchAddress = false;
    $scope.showNext = false;
    $scope.teams = ["caleb" ,"Mo", "Srini" , "Sravan" ,"Vivek"];
    $scope.cancelReasonText = ["Machine Breakdown" ,"No access", "Door locked" , "Weather (Raining)" ,"Power Outage", "Other"];
    $scope.cancelReasonSelected = true;
    //$scope.getAddressValue = "1125 E Campbell Rd, Richardson";

    $scope.getIPLocation = function(){
        $scope.showStart = false;
        $scope.searchAddress = "Loading...";
        //$scope.showCancel = false;
        //$scope.cancelReason = false;
        //$scope.showDuriation = false;
        //$scope.showComplete = false;
        //$scope.showNext = false;
        //$scope.disableTeam =  true;
        getLocation();

    };

    $scope.selectedTeam = function (teamName) {
        vm.teamName = teamName;
        $scope.showNext = true;
    }

    $scope.backToTeam = function(){
    	resetAddress();
    }
    
    function resetAddress(){
    	$scope.NextAddress = "Next Schedule";
    	$scope.showSchedule = false;
    	$scope.showNext = true;
    	$scope.showBackToTeam = false;
    	$scope.showSearchAddress = false;
    	$scope.disableTeam =  false;
    	$scope.showNoAddress = false;
    	$scope.showStart = false;
    	$scope.showDuriation = false;
    }
    
    $scope.getNextSchedule = function() {
    	$scope.NextAddress = "Loading...";
        $scope.disableTeam =  true;
            $http({
                method: 'GET',
                url: '/Schedule/retrieveNextSchedule/' + vm.teamName
            }).then(function successCallback(data) {
                vm.schedule = data.data;
                
                $scope.showNext = false;
                if(vm.schedule != null && vm.schedule != undefined){ // && vm.schedule.address != null
                	$scope.showNoAddress = true;
                	$scope.noSchedule = "Please Start the Job after going to the above address";
                	$scope.getAddressValue = vm.schedule.address;
                	if(count == 0){
    	                $scope.showBackToTeam = true;
                	}else{
                		$scope.showDuriation = false;
                		$scope.cancelReasonSelected = true;
                	}
	            	$scope.showSchedule = true;
	            	$scope.showSearchAddress = true;
                }else{
                	$scope.showNoAddress = true;
                	$scope.noSchedule = "No Scheduled Job";
                	$scope.showBackToTeam = true;
                }

            },function (error){
    		    if(error != null && error.status == 404){
    		    	$scope.showNoAddress = true;
                	$scope.noSchedule = "System is down";
                	$scope.showBackToTeam = true;
                	$scope.showNext = false;
    		    }
    		});
    }
    function getLocation() {
       /* jQuery.post( "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyAiMd6pXsVC3VZ8heTdHshhpPqpabcoW5M", function(success) {
            geoLatitude = success.location.lat;
            geoLongitude = success.location.lng;
            showPosition(geoLatitude, geoLongitude);
            getAddress();
        })
            .fail(function(err) {
                alert("API Geolocation error! \n\n"+err);
            });*/
        if (navigator.geolocation) {
            //alert("navigator GoeCode");
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            //x.innerHTML = "Geolocation is not supported by this browser.";
        }
    }

    function showPosition(position) {
        geoCheck = true;
        /*setTimeout(function () {
            $scope.$apply(function () {
                $scope.myLatitude = position.coords.latitude.toFixed(2);
                $scope.myLongitude =  position.coords.longitude.toFixed(2);
                $scope.searchAddress = "Submit";
            });
        }, 2000);*/
        $scope.myLatitude = position.coords.latitude.toFixed(2);
        $scope.myLongitude =  position.coords.longitude.toFixed(2);
        getAddress();
        count = 1;
    }

    function getAddress(){
        geocoder = new google.maps.Geocoder();
        newAddress = "530 E Buckingham Rd, Richardson 75081"; //$scope.getAddressValue; 

        geocoder.geocode( { 'address': newAddress}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK)
            //alert(status);
                addressCheck = true;
            addressLatitude = results[0].geometry.location.lat().toFixed(2);
            addressLongitude = results[0].geometry.location.lng().toFixed(2);
            //getCurrentTime(buttonId);
            $scope.eLatitude = addressLatitude;
            $scope.eLongitude =  addressLongitude;

            setTimeout(function () {
                $scope.$apply(function () {
                	$scope.searchAddress = "Start Job";
                	$scope.showSearchAddress = false;
                    $scope.showBackToTeam = false;
                    //$scope.showStart = false;
                    
                    if(addressLatitude == $scope.myLatitude){
                    	//$scope.noSchedule = "Please Start the Job after going to the above address";
                    	startJobSchedule();
                    }else{
                    	$scope.noSchedule = "Your address doesn't match with the current position, Please take screen shot of location";
                    }
                });
            }, 2000);
            
        });
        /*
         if (addressCheck && geoCheck) {
         getCurrentTime(buttonId)
         } else {
         setTimeout(1500);
         }*/

        $scope.startJob = function(){
            /*$scope.showCancel = true;
            $scope.showComplete = true;
            $scope.showStart = false;
            $scope.showSearchAddress = false;
            $scope.showNext = false;
            $scope.currentDate = new Date();
            $scope.showNoAddress = false;
            $scope.showBackToTeam = false;*/
        }
        
        function startJobSchedule(){
        	$scope.showCancel = true;
            $scope.showComplete = true;
            $scope.showStart = false;
            $scope.showSearchAddress = false;
            $scope.showNext = false;
            $scope.currentDate = new Date();
            $scope.showNoAddress = false;
            $scope.showBackToTeam = false;

        }

        $scope.cancelJob = function(){
            $scope.cancelDate = new Date();
            $scope.showStart = false;
            $scope.showCancel = false;
            $scope.showComplete = false;
            $scope.cancelReason = true;
            $scope.showReasonForCancel = true;
            //$scope.pickTeam = false;
            //$scope.showSearchAddress = true;
            //$scope.showNext = true;
            vm.schedule.jobStatus = "Cancelled";
            vm.schedule.startTime =  $filter('date')($scope.currentDate, 'HH:mm:ss');
            vm.schedule.endTime = $filter('date')($scope.cancelDate, 'HH:mm:ss');
            vm.schedule.instruction = 
            updateSchedule();
        }

        $scope.StopJob = function(){
            $scope.cancelDate = new Date();
            $scope.totalDuriation = diff_minutes($scope.cancelDate, $scope.currentDate);
            $scope.showDuriation = true;
            vm.schedule.startTime =  $filter('date')($scope.currentDate, 'HH:mm:ss');
            vm.schedule.endTime = $filter('date')($scope.cancelDate, 'HH:mm:ss');
            vm.schedule.jobStatus = "Completed";
            $scope.showStart = false;
            $scope.showCancel = false;
            $scope.showComplete = false;
            //$scope.showNext = true;
            $scope.showNext = true;
            $scope.NextAddress = "Next Schedule";
            //updateSchedule();
            
            vm.schedule.totalDuriation = $scope.totalDuriation;
            data = vm.schedule;
            path = '/Schedule/updateSchedule';
            globalService.invokeAjax('POST', path, data).then(function(data) {
            	vm.updated = data.data;
			});
        }

        function updateSchedule() {

            $http({
                method: 'POST',
                url: '/Schedule/updateSchedule',
                data: vm.schedule
            }).then(function successCallback(data) {
                vm.updated = data.data;
            })
        }


        function diff_minutes(dt2, dt1)
        {
            var diff =(dt2.getTime() - dt1.getTime()) / 1000;
            diff /= 60;
            return Math.abs(Math.round(diff));
        }
        
        
        $scope.selectJobCancel = function(cancelreasonSelection){
        	$scope.cancelReasonSelected = false;
        }
        
        $scope.submitCancelJob = function(cancelreasonSelection){
        	$scope.cancelDate = new Date();
            $scope.totalDuriation = diff_minutes($scope.cancelDate, $scope.currentDate);
        	vm.schedule.totalDuriation = $scope.totalDuriation;
            data = vm.schedule;
            path = '/Schedule/updateSchedule';
            globalService.invokeAjax('POST', path, data).then(function(data) {
            	vm.updated = data.data;$scope.showReasonForCancel = false;
				$scope.showNext = true;
	            $scope.NextAddress = "Next Schedule";
	            $scope.pickTeam = true;
	            $scope.showSchedule = false;
	            $scope.cancelreasonSelection = '';
			});
            
        }
        
    }


});