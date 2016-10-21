
"use strict";
angular
  .module('materialApp')
  .controller('MapController', [
  '$rootScope', '$http','$location','$mdToast',
  MapController
])
.controller('DashboardController', function($rootScope,$state,$scope,$mdBottomSheet,$mdDialog,$mdToast,$http,$filter,$mdMedia,$timeout,$firebaseArray,$sce) {
    $rootScope.gAddress = null;
    $rootScope.showSort = false;
  	$rootScope.parcelId = null;
    $scope.currentNavItem = '3';

    // $scope.showCountdown = 
    $scope.showList = function() {
    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
    $mdDialog.show({
      controller: DialogController,
      templateUrl: './themes/material/components/countdown.html',
      parent: angular.element(document.body),
      clickOutsideToClose:true,
       fullscreen: true
      })
    .then(function(answer) {
      $scope.status = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.status = 'You cancelled the dialog.';
    });

    $scope.$watch(function() {
      return $mdMedia('xs') || $mdMedia('sm');
    }, function(wantsFullScreen) {
      $scope.customFullscreen = (wantsFullScreen === true);
    });
  };

  $scope.showList();


  function DialogController($scope, $mdDialog) {
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
  $scope.open = function(num){
    
  }
}
    $rootScope.parcel_types = [
      {value:0,selected:false,name: "Vacant/Not Applicable"},
      {value:1,selected:false,name: "Other"},
      {value:2,selected:false,name: "New / Rehabbed"},
      {value:3,selected:false,name: "Above Average"},
      {value:4,selected:false,name: "Average"},
      {value:5,selected:false,name: "Below Average"},
      {value:6,selected:false,name: "Vacant"},
      {value:7,selected:false,name: "Sealed / Structurally Compliant"}
    ];
    var self = this;
    self.dates = [
    "02/22/2017 - Tax Delinquent",
"02/07/2017 - Mortgage Forclosure",
"01/18/2017 - Tax Delinquent",
"01/17/2017 - Linebarger"

    ];
    
    var config = {
        apiKey: "AIzaSyCmzpXA9l45E9DthYOVtdIFEYrgGD5fS",
        databaseURL: "https://project-5024312928467115441.firebaseio.com",
        storageBucket: "project-5024312928467115441.appspot.com",
      };
      firebase.initializeApp(config);

    firebase.database().ref().child('neighborhoods').child('philly').once('value').then(function(snapshot) {
        $rootScope.neighborhoods = snapshot.val();
        // ...
      });


  	$mdToast.show(
        $mdToast.simple()
        .content("Welcome to D-squared")
        .position('bottom right')
        .hideDelay(1000)
      );


    $scope.loadNeighborhoods = function(){
      
      //Pre load neighborhoods
        
    // var statement = "select * from azavea.philadelphia_neighborhoods";
    //   var req = {
    //     method: 'GET',
    //     url: 'https://azavea.carto.com/api/v2/sql',
    //     params: {q:statement}
    //   };
    //   $http(req)
    //   .success(function(data,status,headers,config){
    //     // $rootScope.currentParcel.neighborhood = data.rows[0];
    //     console.log("Neighborhood!", $rootScope.currentParcel);
        
        
    //   })
    //   .error(function(data, status, headers, config){
    //     console.log("No Neighborhood :(", data);
    //     $mdToast.show(
    //       $mdToast.simple()
    //       .content("An error Occured.")
    //       .position('top right')
    //       .hideDelay(3000)
    //     );
    //   });
    
  }
});

function MapController($rootScope,$scope,$location,$route,$mdSidenav, $mdBottomSheet,$mdDialog,$mdToast, $log,$state,$stateParams, $q,$filter,$http,$mdMedia,$firebaseArray,$firebaseObject){
  var vm = this;
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
      from: '19UdxVSBptGvN-hb4QW80X9h7fxjyxD7BF_y7MrS8'
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
      zoom: 9,
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
