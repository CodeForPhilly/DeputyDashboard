
"use strict";
angular
  .module('materialApp')

.controller('DashboardController', function($rootScope,$state,$scope,$mdBottomSheet,$mdDialog,$mdToast,$http,$filter,$mdMedia,$timeout,$firebaseArray,$sce,fbStorage) {
    $rootScope.gAddress = null;
    $rootScope.showSort = false;
  	$rootScope.parcelId = null;
    $rootScope.currentNavItem = '3';
    var vm = this;
    $rootScope.levels=[
    {name:"Top",value:3},
    {name:"Secondary",value:2},
    {name:"Vacant",value:1},
    ]

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
    

    

  // $scope.showList();


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
