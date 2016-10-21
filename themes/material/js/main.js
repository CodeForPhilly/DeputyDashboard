
"use strict";

  angular
  .module('materialApp')
  

.controller('GridBottomSheetCtrl', function($scope, $mdBottomSheet) {
  $scope.items = [
    { name: 'Save', icon: 'icon-save' },
    { name: 'Send', icon: 'icon-share' }
  ];
  $scope.listItemClick = function($index) {
    var clickedItem = $scope.items[$index];
    $mdBottomSheet.hide(clickedItem);
  };
})
.controller('RightCtrl', function ($rootScope,$scope, $timeout, $mdSidenav, $log) {
  $scope.isOpenRight = function(){
    return $mdSidenav('right').isOpen();
  };
  $scope.close = function () {
    // Component lookup should always be available since we are not using `ng-if`
    $mdSidenav('right').close()
      .then(function () {
        $log.debug("close RIGHT is done");
        if($rootScope.map != null){
          if($scope.isOpenRight()){
            $rootScope.map.setClickable(false);
          }else{
            $rootScope.map.setClickable(true);
          }
        }
      });
  };
  $mdSidenav('right').onClose(function () {
    $log.debug('closing');
    if($rootScope.map != null){
          if($scope.isOpenRight()){
            $rootScope.map.setClickable(true);
          }else{
            $rootScope.map.setClickable(false);
          }
        }
  });
})
.controller('DashCtrl', function($rootScope,$state,$scope,$mdSidenav,$mdBottomSheet,$mdDialog,$mdToast,$http,$filter,$mdMedia,$timeout,$firebaseArray,$cordovaGeolocation,fbStorage) {
//document.addEventListener("deviceready", function () {
  var self = this;
  self.isLoading=true;
  $rootScope.subTitle = "";
  $scope.searching = false;
  $rootScope.currentParcel = null;
  $rootScope.zip = null;
  $rootScope.map = null;
  $rootScope.latitude = null;
  $rootScope.longitude = null;
  $rootScope.activeSearch = {};
  $rootScope.toggleRight = buildToggler('right');
  // self.fireInOut = signInOut;
  // self.registerUser = register;
  /* firebase config */
  // var config = {
  //   apiKey: "AIzaSyCmzpXA9l45E9DthYOVtdIFEYrgGD5fS",
  //   databaseURL: "https://project-5024312928467115441.firebaseio.com",
  //   storageBucket: "project-5024312928467115441.appspot.com",
  // };
  // // firebase.initializeApp(config);
  // self.signIn = signIn;
  // self.signIn();
  fbStorage.onAuthChange();

  $scope.filterSelected = filterSelected;

  function filterSelected(ev){
    var filter = $rootScope.activeSearch.filters;
    $rootScope.activeSearch.filters = null;
    $timeout(function(){
      $rootScope.activeSearch.filters = filter;
    },10)
    return true;
  }
  
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
          if($rootScope.map != null){
        if($scope.isOpenRight()){
          $rootScope.map.setClickable(false);
        }else{
          $rootScope.map.setClickable(true);
        }
      }
        });
    }
  }


  self.openMenu = function($mdOpenMenu, ev) {
    originatorEv = ev;
    $mdOpenMenu(ev);
    $rootScope.map.setClickable(false);
  };


  $rootScope.conditions = [
    {"ext_cond":0,"value": "Not Applicable"},
    {"ext_cond":1,"value": "Other"},
    {"ext_cond":2,"value": "New / Rehabbed"},
    {"ext_cond":3,"value": "Above Average"},
    {"ext_cond":4,"value": "Average"},
    {"ext_cond":5,"value": "Below Average"},
    {"ext_cond":6,"value": "Vacant"},
    {"ext_cond":7,"value": "Sealed / Structurally Compliant"}
  ];

  self.searchByLatLng = function(lat,lng,radius){
    var rad = radius ? radius : 300;
    //Get List to pass to dialog
    $rootScope.currentCity = "philly";
    var url = "https://api.phila.gov/opa/v1.1/nearby/"+lng+"/"+lat+"/"+rad+"?format=json";
    
    $http.get(url)
    .success(function(response){
      $scope.searching = false;
      var r = response;

      //Populate list dialog
      $scope.showList(r.data.properties);
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
  self.searchNearby = function(ev){
    /* Get users current location */
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    if($rootScope.searching == true){
      return true;
    }
    $mdToast.show(
      $mdToast.simple()
      .textContent("Searching nearby locations")
      .position('bottom left')
      .hideDelay(3000)
    );
    $rootScope.searching = true;
    $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      if(position.coords.accuracy > 200){
        var confirm = $mdDialog.confirm()
          .title('Poor Position Accuracy')
          .textContent('Your position accuracy is currently '+position.coords.accuracy+". Would you like to continue?")
          .ariaLabel('Poor Accuracy')
          .targetEvent(ev)
          .ok('Yes')
          .cancel('Cancel');
        
        $mdDialog.show(confirm).then(function() {
          var lat  = position.coords.latitude
          var lng = position.coords.longitude
          $rootScope.myPosition = position;
          self.searchNearby(lat,lng);
        }, function() {
          $rootScope.searching = false;
          $mdToast.show(
            $mdToast.simple()
            .textContent("Search Canceled")
            .position('bottom left')
            .hideDelay(3000)
          );
        });
      }else{
        $rootScope.searching = true;
        var lat  = position.coords.latitude
        var lng = position.coords.longitude
        $rootScope.myPosition = position;
        self.searchNearby(lat,lng);
      }
      })
  }



  function pad(num, size) {
      var s = num+"";
      while (s.length < size) s = "0" + s;
      return s;
  }

  function processGoogleResults(response,blocklist){
    var r = response;
    if(r.results.length < 1){
      $rootScope.searching = false;
      $mdToast.show(
        $mdToast.simple()
        .textContent("No address found.")
        .position('bottom left')
        .hideDelay(3000)
      );
      return true;
    }

    console.log(r);
    var gResult = r.results[0];
    //Check city
    var city = null;
    var zip = _.filter(gResult.address_components,function(o) { return o.types[0]=="postal_code"});
    $rootScope.zip = zip[0].short_name;
    $rootScope.currentCity = null;

    var cityObj = _.filter(gResult.address_components,function(o) { return o.types[0]=="locality"});
    if(cityObj != false){
      if(v == cityObj[0].short_name){
        city = cityObj[0].short_name;
        $rootScope.currentCity = k;
      }
    }

    if(city == null){
      $rootScope.gAddress = null;
    }else{
      var houseNumber = null;
      var hN = _.filter(gResult.address_components,function(o) { return o.types[0]=="street_number"});
      var route = _.filter(gResult.address_components,function(o) { return o.types[0]=="route"});
      if(hN == false){
        $rootScope.gAddress = route[0].short_name;
        
      }else{
        if($rootScope.currentCity != 'philly')
          houseNumber = pad(hN[0].short_name,4);
        else
          houseNumber = hN[0].short_name;
        $rootScope.gAddress = houseNumber+" "+route[0].short_name
      }
    }

    console.log($rootScope.gAddress);
    var parcelid = null;
    if($rootScope.gAddress != null){
      $rootScope.latitude = gResult.geometry.location.lat;
      $rootScope.longitude = gResult.geometry.location.lng;
      parcelid = $rootScope.getParcel($rootScope.gAddress,$rootScope.currentCity);
    }else{
      // Out of available regions
      $mdToast.show(
        $mdToast.simple()
        .textContent("Address Unavailable on this dashboard.")
        .position('bottom left')
        .hideDelay(3000)
      );
      return true;
    }  
    
  }

  $scope.checkInput = function($event){
    if($event.keyCode == 13){
      // Enter key pressed!

      $rootScope.searching = true;
      $mdToast.show(
            $mdToast.simple()
            .textContent("Searching")
            .position('bottom left')
            .hideDelay(3000)
          );
      // console.log("Search: "+$rootScope.searchText);
      if($rootScope.searchText.length < 5){
        $rootScope.searching = false;
        return true;
      }
      if(!isNaN($rootScope.searchText) && angular.isNumber(+$rootScope.searchText) && $rootScope.searchText.length == 5){
        //Zip Code
        $rootScope.zipSearch = true;
      }else{
        var url = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyBfdI61qNxrgQ2qqXXyIKjMbRdi19HkjtY&address="+$rootScope.searchText+"&format=json";
    
        $http.get(url)
        .success(function(response){
          $scope.searching = false;
          processGoogleResults(response,false);
        })
        .error(function(data, status, headers, config){
          $scope.searching = false;
          $mdToast.show(
            $mdToast.simple()
            .textContent("An error Occured.")
            .position('top right')
            .hideDelay(3000)
          );
          console.log(data);
        });
      }
    }
  }

  $scope.showList = function(items) {
    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
    $mdDialog.show({
      controller: ListDialogController,
      templateUrl: './themes/material/components/listDialog.html',
      parent: angular.element(document.body),
      clickOutsideToClose:true,
      locals: {
           items: items

         },
       fullscreen: useFullScreen
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



  function ListDialogController($scope, $mdDialog, items) {
    $scope.listItems = items;
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
    $mdDialog.hide();
      $rootScope.parcelId = $scope.listItems[num].account_number;
      $state.go('p',{id:$rootScope.parcelId,city:$rootScope.currentCity});
  }

  
  $rootScope.searchByBlock = function(address){
    //Get List to pass to dialog

    var url = "https://api.phila.gov/opa/v1.1/block/"+address+"/?format=json";
    
    $http.get(url)
    .success(function(response){
      $scope.searching = false;
      var r = response;
      $scope.showList(r.data.properties);
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

    //Open Dialog
    var items = [];
    
  }
  $rootScope.getParcel = function(address,city,blocklist){
    var req = {
      method: 'GET',
      url: 'https://x.emelle.me/jsonservice/Parcel/getParcel',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      params: {q:address,city:city,lat:$rootScope.latitude,lng:$rootScope.longitude,zip:$rootScope.zip,block:blocklist}
    };
    $http(req)
    .success(function(data,status,headers,config){
      // console.log("Parcel id found!", data.response[0].ID);
      if(data.response["block"] != undefined){
        //Search by block 
        $rootScope.searchByBlock(data.response["block"]);
      }else{
        if($rootScope.currentCity == 'philly'){
          $rootScope.parcelId = data.response[0].AccountNumber;
          $state.go('p',{id:$rootScope.parcelId,city:$rootScope.currentCity});
        }else if($rootScope.currentCity == 'dc'){
          $rootScope.parcelId = data.response[0].ID;
          if(data.response.length > 1){
            //show list
            $scope.showList(data.response);
          }else{
            $rootScope.currentParcel = data.response[0];
            $state.go('property',{id:$rootScope.parcelId,city:$rootScope.currentCity});
          }
        }
      }
    })
    .error(function(data, status, headers, config){
      // console.log("Parcel id failed:", status);
      $mdToast.show(
        $mdToast.simple()
        .content(data.message)
        .position('top right')
        .hideDelay(3000)
      );
    });
  }
  

  $rootScope.openPage=function(page){
    if($rootScope.map != null && page == 'map'){
      $rootScope.map.setClickable(true);
    }
    $rootScope.subTitle = "";
    $state.go(page);
    
  }

  $scope.loadParcelTypes = function() {
    // Use timeout to simulate a 650ms request.
    $scope.parcel_types = [
      {value:0,selected:false,name: "Vacant/Not Applicable"},
      {value:1,selected:false,name: "Other"},
      {value:2,selected:false,name: "New / Rehabbed"},
      {value:3,selected:false,name: "Above Average"},
      {value:4,selected:false,name: "Average"},
      {value:5,selected:false,name: "Below Average"},
      {value:6,selected:false,name: "Vacant"},
      {value:7,selected:false,name: "Sealed / Structurally Compliant"}
    ];
  }

  $rootScope.simulateQuery = false;
  $rootScope.isDisabled    = false;
  $rootScope.searchAddresses = $firebaseArray(firebase.database().ref().child('philly'))
  $rootScope.searchAddresses.$loaded(function(){
    $rootScope.searchAddresses = $rootScope.searchAddresses.map( function (parcel) {
      parcel.value = parcel.name.toLowerCase();
      return parcel;
    });
  });
    

  $rootScope.querySearch   = querySearch;
  $rootScope.selectedItemChange = selectedItemChange;
  $rootScope.searchTextChange   = searchTextChange;
  var parentEl = angular.element(document.body);
  $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
    
  // ******************************
  // Internal methods
  // ******************************
  /**
   * Search for patients... use $timeout to simulate
   * remote dataservice call.
   */
  function querySearch (query) {
    var results = query ? $rootScope.searchAddresses.filter( createFilterFor(query) ) : $rootScope.searchAddresses;
    return results;
  }
    
})

