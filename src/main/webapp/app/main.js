app.controller('mainCtrl', function($scope, $rootScope, $http) {
    var geocoder;
    var newAddress;
    $scope.searchAddress = "Submit";
    $scope.getAddressValue = "1125 E Campbell Rd, Richardson";

    $scope.getIPLocation = function(){
        $scope.showStart = false;
        $scope.searchAddress = "Loading...";
        $scope.showCancel = false;
        $scope.cancelReason = false;
        $scope.showDuriation = false;
        $scope.showComplete = false;

        getLocation();

    };

    function getLocation() {
        jQuery.post( "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyAiMd6pXsVC3VZ8heTdHshhpPqpabcoW5M", function(success) {
            geoLatitude = success.location.lat;
            geoLongitude = success.location.lng;
            showPosition(geoLatitude, geoLongitude);
            getAddress();
        })
            .fail(function(err) {
                alert("API Geolocation error! \n\n"+err);
            });
    }

    function showPosition(geoLatitude, geoLongitude) {
        geoCheck = true;
        setTimeout(function () {
            $scope.$apply(function () {
                $scope.myLatitude = geoLatitude.toFixed(2);
                $scope.myLongitude =  geoLongitude.toFixed(2);
                $scope.searchAddress = "Submit";
            });
        }, 2000);
    }

    function getAddress(){
        geocoder = new google.maps.Geocoder();
        newAddress = $scope.getAddressValue;

        geocoder.geocode( { 'address': newAddress}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK)
            //alert(status);
                addressCheck = true;
            addressLatitude = results[0].geometry.location.lat().toFixed(2);
            addressLongitude = results[0].geometry.location.lng().toFixed(2);
            //getCurrentTime(buttonId);
            $scope.eLatitude = addressLatitude;
            $scope.eLongitude =  addressLongitude;

            if(addressLatitude == 32.98){
                $scope.showStart = true;
            }else{
                $scope.showStart = false;
            }
        });
        /*
         if (addressCheck && geoCheck) {
         getCurrentTime(buttonId)
         } else {
         setTimeout(1500);
         }*/

        $scope.startJob = function(){
            $scope.showCancel = true;
            $scope.showComplete = true;
            $scope.showStart = false;
            $scope.currentDate = new Date();
        }

        $scope.cancelJob = function(){
            $scope.showStart = false;
            $scope.showCancel = true;
            $scope.showComplete = false;
            $scope.cancelReason = true;
        }

        $scope.StopJob = function(){
            $scope.cancelDate = new Date();
            $scope.totalDuriation = diff_minutes($scope.cancelDate, $scope.currentDate);
            $scope.showDuriation = true;
            $scope.showStart = false;
            $scope.showCancel = false;
            $scope.showComplete = false;
        }

        function diff_minutes(dt2, dt1)
        {
            var diff =(dt2.getTime() - dt1.getTime()) / 1000;
            diff /= 60;
            return Math.abs(Math.round(diff));
        }


    }


});