"use strict";

  angular
  .module('materialApp')
  .controller('LandingCtrl', function ($rootScope,$scope, $timeout, $mdSidenav,$mdMedia, $mdDialog,$mdToast, $log,$firebaseArray,fbStorage) {
	var self = this;
	$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
	$scope.land = land;
	$rootScope.currentNavItem = $rootScope.currentView = 2;
	$rootScope.hotListQuery = {
		order: 'timestamp',
		limit: 5,
		page: 1
	};
	$rootScope.mapLayers=[
		{name:'crime',value:true},
		{name:'police',value:false},
		{name:'zoning',value:false}
	];
	$scope.goto = gotoView;

	function gotoView(i){
		$rootScope.currentView = Number(i);
    	$rootScope.searchFilters = _.filter($rootScope.allFilters,{level:$rootScope.currentView});
    	$rootScope.activeFilter = _.findIndex($rootScope.searchFilters,{isActive:true});
	}

	$rootScope.levels=[
		{fullName:"Top Property",name:"Top",value:2},
		{fullName:"Secondary Property",name:"Secondary",value:1},
		{fullName:"Vacant Land and Property",name:"Vacant",value:0},
	]
	// $rootScope.hotList = $firebaseArray(firebase.database().ref('sherifflist').limitToFirst(100).orderByChild('timestamp'));
	// $rootScope.hotList.$loaded().then(function(){
	//   console.log($rootScope.hotList);
	// });
	$rootScope.$on('$routeChangeSuccess', function(event, current) {
	$rootScope.currentLink = getCurrentLinkFromRoute(current);
	});
	$rootScope.toggleList = buildToggler('right');

	$scope.isOpenRight = function(){
	return $mdSidenav('right').isOpen();
	};

	function buildToggler(navID) {
	return function() {
	  // Component lookup should always be available since we are not using `ng-if`
	  
	  $mdSidenav(navID)
	    .toggle()
	    .then(function () {
	      console.log("toggle " + navID + " is done");
	    });
	}
	}


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

		scope.answer = function(a){
			 var newPostKey = firebase.database().ref("signup_list").push({name:scope.name,email:scope.email,region:scope.region}).then(function(){
			 	$mdDialog.hide();
			 	$mdToast.show(
	              $mdToast.simple()
	              .content("We'll be in touch shortly!")
	              .position('top right')
	              .hideDelay(3000)
	            );
			 })
		}


	}

  })