"use strict";

  angular
  .module('materialApp')
  .controller('LandingCtrl', function ($rootScope,$scope, $timeout, $mdSidenav,$mdMedia, $mdDialog, $log) {
	  var self = this;
	  $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
	  $scope.land = land;
	function land(ev){
		//Show Sign In dialog
		var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) ;
		var parentEl = angular.element(document.body);

		$mdDialog.show({
		parent: parentEl,
		templateUrl:
		'./themes/material/components/landingDialog.html',
		controller: LandingDialogController,
		clickOutsideToClose: true,
		targetEvent:ev,
		escapeToClose: true,
		fullscreen: useFullScreen
	});

	$scope.$watch(function() {
	  	return $mdMedia('xs') || $mdMedia('sm');
	}, function(wantsFullScreen) {
	  	$scope.customFullscreen = (wantsFullScreen === true);
	});

	}

	function LandingDialogController(scope, $mdDialog) {

		scope.closeDialog = function() {
			$mdDialog.hide();
		}


	}

  })