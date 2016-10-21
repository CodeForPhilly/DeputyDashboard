
"use strict";
angular
  .module('materialApp')
  .controller('HomeCtrl', function($rootScope,$state,$scope,$mdBottomSheet,$mdDialog,$mdToast,$http,$filter,$mdMedia,$timeout,$firebaseArray,$sce,$cordovaCamera) {
	$rootScope.gAddress = null;
	$rootScope.showSort = false;
  	$rootScope.parcelId = null;

  	$mdToast.show(
        $mdToast.simple()
        .content("Home")
        .position('bottom right')
        .hideDelay(1000)
      );
});

