
"use strict";
angular
  .module('materialApp')
  .controller('MapCtrl', function($rootScope,$state,$scope,$mdBottomSheet,$mdDialog,$mdToast,$http,$filter,$mdMedia,$timeout,$firebaseArray,$sce,$cordovaCamera) {
	$rootScope.gAddress = null;
  $rootScope.parcelId = null;
  $rootScope.position = {};
  $rootScope.map = null;
  $rootScope.fabOpen = false;
  $rootScope.distanceUnit = 'mi';
  $rootScope.speedUnit = "mph";
  $rootScope.PlayPauseText = "start";
  $rootScope.showSort = true;
  $rootScope.parcelIcon = "./themes/material/img/dot.png";
  document.addEventListener("deviceready", function () {
      var networkState = navigator.connection.type;

      var states = {};
      $rootScope.initialLimit = 40;
      states[Connection.UNKNOWN]  = 'Unknown connection';
      states[Connection.ETHERNET] = 'Ethernet connection';
      states[Connection.WIFI]     = 'WiFi connection';
      states[Connection.CELL_2G]  = 'Cell 2G connection';
      states[Connection.CELL_3G]  = 'Cell 3G connection';
      states[Connection.CELL_4G]  = 'Cell 4G connection';
      states[Connection.CELL]     = 'Cell generic connection';
      states[Connection.NONE]     = 'No network connection';

      if(networkState == Connection.CELL_3G || networkState == Connection.CELL_3G){
        $rootScope.initialLimit = 5;
      }

    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    function onMapInit(map) {
      $rootScope.map.setClickable(true);
      // $rootScope.map.setMapTypeId(plugin.google.maps.MapTypeId.ROAD);
      $rootScope.map.setBackgroundColor('rgba(0,0,0,0)');
      var evtName = plugin.google.maps.event.MAP_LONG_CLICK;
      // $rootScope.map.on(evtName, function(latLng) {
      //     alert("Map was long clicked.\n" +
      //         latLng.toUrlValue());
      // });

      if($rootScope.currentParcel !== undefined && $rootScope.currentParcel != null){
        //add location marker

        $rootScope.map.addMarker({
          'position': new plugin.google.maps.LatLng($rootScope.currentParcel.geometry.y,$rootScope.currentParcel.geometry.x),
          'title': $rootScope.currentParcel.full_address,
          'animation': plugin.google.maps.Animation.DROP,
          'icon': $rootScope.parcelIcon
        }, function(marker) {

          marker.showInfoWindow();
          marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, function() {
            $state.go('p',{id:$rootScope.currentParcel.account_number,city:$rootScope.currentCity})
          });

        });


        //get neighborhood
        // Split WKB into array of integers (necessary to turn it into buffer)
        var hexAry = $rootScope.currentParcel.neighborhood.the_geom.match(/.{2}/g);
        var intAry = [];
        for (var i in hexAry) {
          intAry.push(parseInt(hexAry[i], 16));
        }
        // console.log(intAry);
        // Generate the buffer
        var wkx = require('wkx');
        var buf = new buffer.Buffer(intAry);

        // Parse buffer into geometric object
        var geom = wkx.Geometry.parse(buf);
        var points = geom.toGeoJSON().coordinates[0][0];
        $rootScope.currentParcel.neighborhood.geoJson = [];
        angular.forEach(points,function(value, key){
            // $scope.results.push(value.raw);
            $rootScope.currentParcel.neighborhood.geoJson.push(new plugin.google.maps.LatLng(value[1],value[0]));
          
        });
        // console.log($rootScope.currentParcel.neighborhood.geoJson);
        $rootScope.map.addPolygon({
          'points': $rootScope.currentParcel.neighborhood.geoJson,
          'strokeColor' : '#0d47a1',
          'strokeWidth': 5,
          'fillColor' : '#0d48a01f'
        }, function(polygon) {
          polygon.on(plugin.google.maps.event.OVERLAY_CLICK, function(overlay, latLng) {
            $mdToast.show(
              $mdToast.simple()
              .content("Neighborhood: "+$rootScope.currentParcel.neighborhood.listname)
              .position('top right')
              .hideDelay(3000)
            );
          });
          // $rootScope.map.animateCamera({
          //   'target': polygon.getPoints()
          // });
        });
      }else{
        //Get Nearby Parcels
        $rootScope.showNearby = true;
          //Query nearby parcels
          $mdToast.show(
            $mdToast.simple()
            .content("Loading nearby deals")
            .position('top right')
            .hideDelay(3000)
          );
          //Get List to pass to dialog
          $rootScope.currentCity = "philly";
          var url = "https://api.phila.gov/opa/v1.1/nearby/"+$rootScope.position.coords.longitude+"/"+$rootScope.position.coords.latitude+"/700?format=json";
          
          $http.get(url)
          .success(function(response){
            $scope.searching = false;
            var r = response;
            angular.forEach(r.data.properties,function(value, key){
                // $scope.results.push(value.raw);
                
                $scope.addMarker(value);
                // $rootScope.map.addMarker({
                //   'position': new plugin.google.maps.LatLng(value.geometry.y,value.geometry.x),
                //   'title': value.full_address,
                //   'icon': $rootScope.parcelIcon
                // }, function(marker) {

                //   marker.showInfoWindow();
                //   marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, function() {
                //     $state.go('p',{id:value.account_number,city:$rootScope.currentCity})
                //   });

                // });
            });
          })
          .error(function(data, status, headers, config){
            $scope.searching = false;
            $mdToast.show(
              $mdToast.simple()
              .content("An error Occured.")
              .position('top right')
              .hideDelay(3000)
            );
            console.log(data);
          });
        }



      // $rootScope.map.addKmlOverlay({
      //   'url':'https://developers.google.com/kml/documentation/kmlfiles/animatedupdate_example.kml'
      // }, function(kmlOverlay) {
      //   // kmlOverlay.on(plugin.google.maps.event.OVERLAY_CLICK, function(overlay, latLng) {
      //   //   if (overlay.type == "Polygon") {
      //   //     overlay.setFillColor("red");
      //   //   }
      //   //   if (overlay.type == "Polyline") {
      //   //     overlay.setColor("blue");
      //   //   }
      //   //   if (overlay.type == "Marker") {
      //   //     overlay.showInfoWindow();
      //   //   }
      //   // });
      // })
      
    }


    var onSuccess = function(position) {
      $rootScope.position = position;
        // alert('Latitude: '          + position.coords.latitude          + '\n' +
        //       'Longitude: '         + position.coords.longitude         + '\n' +
        //       'Altitude: '          + position.coords.altitude          + '\n' +
        //       'Accuracy: '          + position.coords.accuracy          + '\n' +
        //       'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
        //       'Heading: '           + position.coords.heading           + '\n' +
        //       'Speed: '             + position.coords.speed             + '\n' +
        //       'Timestamp: '         + position.timestamp                + '\n');
      var div = document.getElementById("map_canvas");

      if($rootScope.currentParcel !== undefined && $rootScope.currentParcel != null){
        $rootScope.startPosition = new plugin.google.maps.LatLng($rootScope.currentParcel.geometry.y,$rootScope.currentParcel.geometry.x);
        
      }else{
        $rootScope.startPosition = new plugin.google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      
      }

      $scope.addMarker = function(value){
        console.log(value);
        // $rootScope.map.addMarker({
        //   'position': new plugin.google.maps.LatLng(value.geometry.y,value.geometry.x),
        //   'title': value.full_address,
        //   'icon': $rootScope.parcelIcon
        // }, function(marker) {

        //   marker.showInfoWindow();
        //   marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, function() {
        //     $state.go('p',{id:value.account_number,city:$rootScope.currentCity})
        //   });

        // });
      }
        
      $rootScope.map = plugin.google.maps.Map.getMap(div,{
      'controls': {
        'compass': true,
        'myLocationButton': true,
        'indoorPicker': false,
        'zoom': true
      },
      'gestures': {
        'scroll': true,
        'tilt': true,
        'rotate': true,
        'zoom': true
      },
      'camera': {
        'latLng': $rootScope.startPosition,
        'tilt': 30,
        'zoom': 15
      }
      });

      

      angular.element(document).ready(function () {
        $rootScope.map.on(plugin.google.maps.event.MAP_READY, onMapInit);
      });


    }

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        console.log('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);

});
  
});

