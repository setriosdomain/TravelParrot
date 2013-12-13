angular.module('mean.events').controller('EventsController', ['$scope', '$upload', '$routeParams', '$location' ,'Global','Events', '$timeout', function ($scope, $upload, $routeParams, $location, Global, Events, $timeout) {
    $scope.global = Global;

    $scope.create = function() {
        if(typeof $scope.file_url == 'undefined'){ $scope.file_url = '';}
        var event = new Events({
            title: this.title,
            file_url:  $scope.file_url,
            destinations: $scope.GoogleMaps.getFormaterMarkers(),
            periodFrom: $scope.DatePicker.dateFrom,
            periodTo: $scope.DatePicker.dateTo,
            content: this.content

        });
        event.$save(function(response) {
            $location.path("events/" + response._id);
        });

        this.title = "";
        this.content = "";
    };

    $scope.eventsHome = function () {
        $location.url('/events/');
    };
    $scope.remove = function() {
        var event = $scope.event;

        event.$remove(function(){

            for (var i in $scope.events) {
                if ($scope.events[i] == article) {
                    $scope.events.splice(i, 1);
                }
            }

            $location.path("events/");
        });
    };

    $scope.update = function() {
        if(typeof $scope.file_url == 'undefined'){ $scope.file_url = '';}
        var event = $scope.event;
        if (!event.updated) {
            event.updated = [];
        }
        event.updated.push(new Date().getTime());
        event.file_url = $scope.file_url;
        event.periodFrom = $scope.DatePicker.dateFrom;
        event.periodTo = $scope.DatePicker.dateTo;
        event.destinations = $scope.GoogleMaps.getFormaterMarkers();

        event.$update(function() {
            $location.path('events/' + event._id);
        });
    };


    $scope.find = function() {
        if(!$routeParams.name){
            Events.query(function(events) {
                $scope.events = events;
                //pager
                $scope.confPagination.totalItems = $scope.events.length;
                //pager
            });
        }else{
            $.ajax({
                type: 'POST',
                url: '/queryEvents',
                data: {
                    name: $routeParams.name
                },
                dataType: 'json',
                success: function(events) {
                    $scope.$apply(function(){
                        $scope.events = events;
                        //pager
                        $scope.confPagination.totalItems = $scope.events.length;
                        //pager
                    });
                }
            });
        }
    };

    $scope.findOne = function() {
        Events.get({
            eventId: $routeParams.eventId
        }, function(event) {
            $scope.event = event;
            $scope.InitializeEventData();
        });

    };


    //start => pagination
    $scope.confPagination = {};
    $scope.confPagination.maxSize = 5;
    $scope.confPagination.pageSize = 10;

    $scope.confPagination.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.confPagination.currentPage = 1;
    $scope.confPagination.boundaryLinks = true;
    //end => pagination

    //start file upload
    $scope.onFileSelect = function($files) {
        //$files: an array of files selected, each file has name, size, and type.
        for (var i = 0; i < $files.length; i++) {
            var $file = $files[i];
            $upload.upload({
                url: 'upload',
                file: $file,
                progress: function(e){}
            }).then(function(data, status, headers, config) {
                    // file is uploaded successfully
                    if(!data.data){return;}
                    //console.log('file uploaded: ' + data.data);
                    $scope.file_url = data.data;
                });
        }
    };
    //end file upload
    $scope.clearImage = function(){
        $scope.file_url = '';
    };

    $scope.showImage = function(event){
        if(!event){return false;}
        return event.file_url != '';
    }

    //start google maps
    $scope.GoogleMaps = {};
    $scope.GoogleMaps.map = null;
    $scope.GoogleMaps.geocoder = null;
    $scope.GoogleMaps.markerIndex = 0;
    $scope.GoogleMaps.markers = [];
    $scope.GoogleMaps.directionService = new google.maps.DirectionsService();
    $scope.GoogleMaps.directionsDisplay;

    $scope.GoogleMaps.getMapContainer = function(){
        var mapDiv = document.getElementById("map_canvas_view");
        if(mapDiv){return mapDiv;}
        mapDiv = document.getElementById("map_canvas_edit");
        if(mapDiv){return mapDiv;}
        mapDiv = document.getElementById("map_canvas_insert");
        if(mapDiv){return mapDiv;}
        return null;
    }


    $scope.GoogleMaps.createMap = function(options) {
        //alert($scope.$id);
        //if($scope.GoogleMaps.map != null){return;}
        var divMapDom = $scope.GoogleMaps.getMapContainer();
        if(!divMapDom){
            return;
        }

        $scope.GoogleMaps.geocoder = new google.maps.Geocoder();

        if(!options){
            // provide some default initialization options
            options =
            {
                zoom: 8,
                center: new google.maps.LatLng(-34.397, 150.644),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
        }

        // map_canvas is the id of the HTML element we are using as the map canvas (see HTML snippet at the bottom)
        //$scope.GoogleMaps.map = new google.maps.Map(document.getElementById("map_canvas"), options);
        $scope.GoogleMaps.map = new google.maps.Map(divMapDom, options);
        //google.maps.event.addListener($scope.GoogleMaps.map, "click", $scope.GoogleMaps.createMarker);
        $scope.GoogleMaps.directionsDisplay = new google.maps.DirectionsRenderer();
        $scope.GoogleMaps.directionsDisplay.setMap($scope.GoogleMaps.map);

        var maxWidth = Number($(divMapDom).css("width").replace(/[^\d\.]/g, ''));
        var maxHeight = Number($(divMapDom).css("height").replace(/[^\d\.]/g, ''));



        //resizes map with a maxWidthand MaxHeight and keeping the center of tha map.
        google.maps.event.addDomListener(window, "resize", function() {
            var center = $scope.GoogleMaps.map.getCenter();
            google.maps.event.trigger($scope.GoogleMaps.map, 'resize');
            var marginLeft = 40;
            var newWidth = $(window).width() - marginLeft;
            var newHeight = $(window).height()- marginLeft;
            if(newWidth <= maxWidth){
                $(divMapDom).css("width",newWidth);}
            else{
                $(divMapDom).css("width",maxWidth);
            }
            if(newHeight <= maxHeight){
                $(divMapDom).css("height",newHeight);
            }
            else{
                $(divMapDom).css("height",maxHeight);
            }
            $scope.GoogleMaps.map.setCenter(center);

        });
        //$scope.GoogleMaps.map.setZoom(15);

    }

    $scope.GoogleMaps.search = function(){
        var place = $('#searchMap').val();
        if(!place){return;}

        var geocoderRequest = {
            address: place
        };

        $scope.GoogleMaps.geocoder.geocode(geocoderRequest, function(results, status){
            if (status == google.maps.GeocoderStatus.OK) {
                var latLong = results[0].geometry.location;
                var coord ={};
                coord.latLng = latLong;
                $scope.GoogleMaps.createMarker(coord, place);
                // results is an array of GeocoderResult objects. Using only results[0] is sufficient
                // check the documentation to see what a GeocoderResult object looks like:
                // https://developers.google.com/maps/documentation/javascript/reference#GeocoderResult
                $scope.GoogleMaps.map.setCenter(latLong);
                $scope.GoogleMaps.map.setZoom(15);
            }
        });
    }
    $scope.GoogleMaps.createMarker = function (event, place){
        if(!place){place = '';}
        var marker = new google.maps.Marker(
            {
                map: $scope.GoogleMaps.map,
                position: event.latLng,
                title: place
            });
        google.maps.event.addListener(marker, "click", function(event) {
            $scope.GoogleMaps.openMarkerPopup(marker);
        });
        $scope.GoogleMaps.markers.push(marker);
    }
    $scope.GoogleMaps.openMarkerPopup = function (marker) {
        var markerIndex = $scope.GoogleMaps.markerIndex;
        var pos = marker.position;
        var lat = pos.lat();
        var lng = pos.lng();
        var newMarkerIndex = (++markerIndex);
        var el_id = "weather_" + newMarkerIndex;


        $scope.Weather.getWeather(lat, lng, el_id, marker);
    }
    // Sets the map on all markers in the array.
    $scope.GoogleMaps.setAllMarkersMap = function (map) {
        for (var i = 0; i < $scope.GoogleMaps.markers.length; i++) {
            $scope.GoogleMaps.markers[i].setMap(map);
        }
    }
    // Removes the markers from the map, but keeps them in the array.
    $scope.GoogleMaps.clearMarkers = function () {
        $scope.GoogleMaps.setAllMarkersMap(null);
    }

    // Deletes all markers in the array by removing references to them.
    $scope.GoogleMaps.deleteMarkers = function () {
        $scope.GoogleMaps.clearMarkers();
        $scope.GoogleMaps.markers = [];
    }
    $scope.GoogleMaps.getCurrentLocation = function () {
        var onError = function(error) {
            alert("Could not get the current location.");
        };

        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {

                    // once we get here, we receive the position in the variable "position"
                    // we use it to create a LatLng object (see documentation) for later usage
                    var currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude, false);

                    // now that we have the current location, we need use the Map API to move the map to this location
                    // you may also want to adjust the zoom level

                    // remember that the map object was already initialised for you in createMap()
                    // you can use it like this: map.whateverFunction()

                    // see the API reference for the relevant functions (you need to set the location, and set the zoom level):
                    // https://developers.google.com/maps/documentation/javascript/reference#Map
                    var coords ={latLng : currentLocation};
                    $scope.GoogleMaps.createMarker(coords);
                    $scope.GoogleMaps.map.setCenter(currentLocation);
                    $scope.GoogleMaps.map.setZoom(15);


                    //map.panTo(new google.maps.LatLng(position.coords.latitude, position.coords.longitude, false));


                    // also fix this string so that it display the coordinates of the current location
                    //var output = "Your current position is: ("+ position.coords.latitude + "," +
                    //    position.coords.longitude+")";
                    //document.getElementById("currentPosition").innerHTML = output;

                },
                onError
            );
        }else{
            onError();
        }
    }
    $scope.GoogleMaps.getFormaterMarkers = function(){

        var data = $scope.GoogleMaps.markers;
        //data is an array of many markers objects
        newData = [];

        for(var i = 0; i < data.length; i++) {
            var obj = new Object();;
            obj.lat = data[i].position.lat();
            obj.lng = data[i].position.lng();
            obj.title = data[i].title;
            newData.push(obj);
        }

        return newData;
    }
    $scope.GoogleMaps.createMarkersFromDestinations = function(){

        var event = $scope.event;
        if(!event){return;}

        var data = event.destinations;
        if(!data || data.length == 0){return;}
        newData = [];


        $scope.GoogleMaps.map.setCenter(new google.maps.LatLng(data[0].lat, data[0].lng, false));

        if(data.length == 1){
            $scope.GoogleMaps.createMarker({
                latLng : new google.maps.LatLng(data[0].lat, data[0].lng, false)}, data[0].title);
            $scope.GoogleMaps.map.setZoom(15);
        }else
        {
            var markerBounds = new google.maps.LatLngBounds();
            for(var i = 0; i < data.length; i++) {
                var coord = {
                    latLng : new google.maps.LatLng(data[i].lat, data[i].lng, false)
                };
                $scope.GoogleMaps.createMarker(coord, data[i].title);
                markerBounds.extend(coord.latLng);
            }
            $scope.GoogleMaps.map.fitBounds(markerBounds);
        }

        return newData;
    }


    //end google maps
    //start weather REST
    $scope.Weather = {};
    $scope.Weather.getWeather = function (lat, lng, el_id, marker){
        var key = "5d0f70a7a98843a8";
        var target = "http://api.wunderground.com/api/" + key + "/forecast/q/" + lat + "," + lng + ".json?callback=?";
        $.getJSON(target, function(data){

            var forecast = "";
            if(data.response.error){
                forecast = data.response.error.description;
            }else{
                // find out how to access the data you want
                // you can check out the returned javascript object by manually visiting the above URL in your browser
                // or see the example at http://www.wunderground.com/weather/api/d/docs?d=data/forecast
                var day = data.forecast.simpleforecast.forecastday[0];

                //forecast = "Hi: " + day.high.celsius + " Low: " + day.low.celsius;
                forecast = data.forecast.txt_forecast.forecastday[0].fcttext_metric;
            }


            var contentString = "<div class='weatherbox' style='width: 150px;' id='" + (el_id) + "'>" +
                forecast + "</div>";

            var newPopup = new google.maps.InfoWindow({
                content: contentString
            });

            newPopup.open($scope.GoogleMaps.map, marker);


        });

    }
    //end weather REST
    //date pickers
    $scope.DatePicker = {};
    $scope.DatePicker.today = function() {
        $scope.DatePicker.dateFrom = new Date();
        $scope.DatePicker.dateTo = new Date();
    };


    $scope.DatePicker.dateFromOpen = function() {
        $timeout(function() {
            $scope.DatePicker.dateFromOpened = true;
        });
    };
    $scope.DatePicker.dateToOpen = function() {
        $timeout(function() {
            $scope.DatePicker.dateToOpened = true;
        });
    };

    $scope.DatePicker.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 1
    };

    $scope.DatePicker.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
    $scope.DatePicker.format = $scope.DatePicker.formats[0];

    $scope.DatePicker.initializeDatesFromEvent = function(){
      if(!$scope.event){
          $scope.DatePicker.today();
          return;
      }
      $scope.DatePicker.dateFrom = $scope.event.periodFrom;
      $scope.DatePicker.dateTo = $scope.event.periodTo;

    };
    $scope.$watch('DatePicker.dateFrom', function(newval, oldval){
        if($scope.DatePicker.dateTo < $scope.DatePicker.dateFrom){
            $scope.DatePicker.dateTo = null;
        }
    });
    $scope.$watch('DatePicker.dateTo', function(newval, oldval){
        if($scope.DatePicker.dateTo < $scope.DatePicker.dateFrom){
            $scope.DatePicker.dateTo = null;
        }
    });
//    $scope.DatePicker.validateDates = function(){
//        if(!$scope.DatePicker.dateTo){return;}
//        if(!$scope.DatePicker.dateFrom){return;}
//        if($scope.DatePicker.dateTo < $scope.DatePicker.dateFrom){
//            $scope.DatePicker.dateTo = null;
//        }
//    }
    $scope.GoogleMaps.setupCreateMarkersEvent = function(){
        google.maps.event.addListener($scope.GoogleMaps.map, "click", $scope.GoogleMaps.createMarker);
    }

    $scope.GoogleMaps.createMapForView = function(){
        if(!$('#map_canvas_view')[0]/*dom elem*/){return;}
        if($scope.GoogleMaps.hasNoDestinations()){
            $scope.GoogleMaps.removeMapIfNoMarkers();
            return ;
        }
        $scope.GoogleMaps.createMap();
        $scope.GoogleMaps.createMarkersFromDestinations();
        $scope.GoogleMaps.removeMapIfNoMarkers();
    }
    $scope.GoogleMaps.createMapForEdit = function(){
        if(!$('#map_canvas_edit')[0]/*dom elem*/){return;}
        $scope.GoogleMaps.createMap();
        $scope.GoogleMaps.createMarkersFromDestinations();
        $scope.GoogleMaps.setupCreateMarkersEvent();
    }
    $scope.GoogleMaps.createMapForInsert = function(){
        if(!$('#map_canvas_insert')[0]/*dom elem*/){return;}
        $scope.GoogleMaps.createMap();
        $scope.GoogleMaps.setupCreateMarkersEvent();
    }
    $scope.GoogleMaps.hasNoDestinations = function(){
        return (!$scope.event.destinations || $scope.event.destinations.length == 0);
    }
    $scope.GoogleMaps.removeMapIfNoMarkers = function(){
        if($scope.GoogleMaps.hasNoDestinations()){
            $($scope.GoogleMaps.getMapContainer()).css({width: "px",height: "0px"});
        }
    }
    $(function() {
        if(document.getElementById("map_canvas_insert")){
            //creating a new event must init map
            $scope.GoogleMaps.createMapForInsert();
        }
    });
    //date pickers
    $scope.InitializeEventData = function(){
        if(!$scope.event){return;}
        $scope.GoogleMaps.createMapForView();
        $scope.GoogleMaps.createMapForEdit();
        $scope.DatePicker.initializeDatesFromEvent();
        $scope.file_url = $scope.event.file_url;
    }
}]);