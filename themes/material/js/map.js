
"use strict";
angular
  .module('materialApp')
  .controller('MapController', [
  '$rootScope', '$http','$location','$mdSidenav','$mdBottomSheet','$mdDialog','$mdToast',
  MapController
])

function MapController($rootScope,$scope,$location,$route,$mdSidenav, $mdBottomSheet,$mdDialog,$mdToast, $log,$state,$stateParams, $q,$filter,$http,$mdMedia,$firebaseArray,$firebaseObject){
  var vm = this;
  $rootScope.overlayTitle = "Loading Neighborhoods"

  vm.mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      { "invert_lightness": true }
    ]
  },{
    "featureType": "landscape",
    "stylers": [
      { "visibility": "simplified" },
      { "invert_lightness": true }
    ]
  },{
    "featureType": "landscape",
    "elementType": "geometry.fill",
    "stylers": [
      { "visibility": "on" },
      { "lightness": 100 },
      { "color": "#f9fff9" }
    ]
  },{
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      { "lightness": 77 }
    ]
  },{
    "featureType": "road",
    "elementType": "labels.text",
    "stylers": [
      { "visibility": "simplified" }
    ]
  },{
  },{
    "featureType": "transit",
    "elementType": "geometry.fill",
    "stylers": [
      { "color": "#f14728" },
      { "weight": 1 }
    ]
  },{
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      { "lightness": 69 }
    ]
  },{
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": [
      { "visibility": "simplified" }
    ]
  },{
    "featureType": "administrative.neighborhood",
    "elementType": "labels",
    "stylers": [
      { "visibility": "simplified" },
      { "saturation": -30 },
      { "color": "#252651" },
      { "invert_lightness": true },
      { "lightness": -41 }
    ]
  },{
    "featureType": "poi",
    "elementType": "geometry.fill",
    "stylers": [
      { "lightness": 52 }
    ]
  },{
    "featureType": "poi",
    "elementType": "labels.text",
    "stylers": [
      { "visibility": "simplified" }
    ]
  },{
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [
      { "lightness": 87 }
    ]
  },{
    "featureType": "poi.school",
    "elementType": "geometry",
    "stylers": [
      { "lightness": 12 }
    ]
  },{
    "featureType": "poi.medical",
    "elementType": "geometry.fill",
    "stylers": [
      { "invert_lightness": true },
      { "visibility": "on" },
      { "lightness": 44 }
    ]
  },{
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      { "visibility": "simplified" }
    ]
  },{
  }
  ];

  vm.showNeighborhoods = function(){
    angular.forEach($rootScope.neighborhoods, function(v, k) {
      var hexAry = v.the_geom.match(/.{2}/g);
      var intAry = [];
      for (var i in hexAry) {
        intAry.push(parseInt(hexAry[i], 16));
      }
      console.log(intAry);
      // Generate the buffer
      var wkx = require('wkx');
      var buf = new buffer.Buffer(intAry);
    });
    
  }

  vm.radii = [
    {size:50,  name:"50m"},
    {size:1000,name:"1000m"},
    {size:1500,name:"1500m"}
  ];

  vm.styledMap = new google.maps.StyledMapType(vm.mapStyle,
    {name: "Map"});
  vm.radius = 50;
  vm.locations = {
    "PDHQ": [39.954188,-75.1506003]
  };

    

  $rootScope.districtsLayer = new google.maps.FusionTablesLayer({
    query: {
    select: 'geometry',
    from: '1YQieDtKgggPk_dXclvAj73rEl-GULkZdHzESaJ5S'
    },
    styles: [{
    polygonOptions: {
      strokeColor: "#5d3829",
      fillColor: "#92a381",
      strokeOpacity: "0.7",
      strokeWeight: "int",
      fillOpacity:"0.1"
    }}]
  });

  vm.mapCenter = new google.maps.LatLng(39.954188,-75.1506003);
  var mapOptions = {
    zoom: 12,
    center: vm.mapCenter,
    mapTypeControlOptions:{
      mapTypeIds: [google.maps.MapTypeId.SATELLITE,'map_style']
    }
  };

  if($rootScope.map === undefined){
    $rootScope.map = new google.maps.Map(document.getElementById("map-canvas"),
      mapOptions);
    $rootScope.map.mapTypes.set('map_style', vm.styledMap);
    $rootScope.map.setMapTypeId('map_style');
    $rootScope.districtsLayer.setMap($rootScope.map);
    
  }
  
  if(!$rootScope.neighborhoods){
    firebase.database().ref().child('neighborhoods').child('philly').once('value').then(function(snapshot) {
      $rootScope.neighborhoods = snapshot.val();
      $rootScope.storage.setItem("deputy_neighborhoods",JSON.stringify($rootScope.neighborhoods));
      $rootScope.overlayTitle = "Neighborhood or Ward";
      
      console.log($rootScope.neighborhoods)
      // ...
      // vm.showNeighborhoods();
      
    });
  }else{
    $rootScope.overlayTitle = "Neighborhood or Ward";
  }
      
    /* Adds new vehicle markers to the map when they enter the query */
vm.showDetails = function(){
  $mdToast.show(
    $mdToast.simple()
    .content("This action is under construction.")
    .position('top right')
    .hideDelay(4000)
  );
}
}
