
"use strict";
angular
  .module('materialApp')
  .controller('PermitController', function($rootScope,$state,$scope,$mdBottomSheet,$mdDialog,$mdToast,$http,$filter,$mdMedia,$timeout,$firebaseArray,$firebaseObject,$sce,fbStorage) {
    var vm = this;
    vm.type = $state.params.type;
    vm.id = Number($state.params.num);
    $rootScope.lat = parseFloat($state.params.lat);
    $rootScope.lng = parseFloat($state.params.lng);
    vm.permitResults = $firebaseArray(firebase.database().ref().child('philadelphia').child('permits').child('lane_closures').orderByChild('OBJECTID').equalTo(vm.id));
    vm.permitResults.$loaded().then(function(){
      if(vm.permitResults.length == 0)
      {
        var req = {
          method: 'GET',
          url: "https://x.emelle.me/jsonservice/Parcl/streetpermits",
          params: {f:'OBJECTID',q:vm.id}
        };
        $http(req)
        .then(function(success){
          // var data = success.data;
          // console.log(vm.fieldName);
          vm.permitResults = $firebaseArray(firebase.database().ref().child('philadelphia').child('permits').child('lane_closures').orderByChild(vm.type).equalTo(vm.id));
        },function(){
          $mdToast.show(
            $mdToast.simple()
            .textContent("An error Occured.")
            .position('top right')
            .hideDelay(3000)
          );
        });
      }
    })
  })
  .controller('QRController', function($rootScope,$state,$scope,$mdBottomSheet,$mdDialog,$mdToast,$http,$filter,$mdMedia,$timeout,$firebaseArray,$firebaseObject,$sce,fbStorage) {
  	var vm = this;
    $rootScope.lat = parseFloat($state.params.lat);
    $rootScope.lng = parseFloat($state.params.lng);
    vm.map;
    vm.pano;
    vm.metadata=[];
    $rootScope.currentNavItem = 1;
    vm.createQR = createQR;
    vm.openPage = openPage;
    vm.scanCode = scanCode;

    $rootScope.currentSearch = JSON.parse($rootScope.storage.getItem('currentSearch'));
    $rootScope.searchHistory = (JSON.parse($rootScope.storage.getItem('searchHistory')) ? JSON.parse($rootScope.storage.getItem('searchHistory')) : []);
    if(vm.fieldName == "OBJECTID"){
      vm.query = Number(vm.query);
    }

    vm.metadata['lane_closures'] = $firebaseObject(firebase.database().ref().child('metadata').child('philly').child('lane_closures').child('meta'));
    vm.metadata['lane_closures'].$loaded().then(function(){
      console.log(vm.metadata);
    })
    vm.datasets = [
    {name:"Street Lane Closures",value:"lane_closures"}];
    fbStorage.anonAuth();

    angular.element(document).ready(function () {
      // var req = {
      //     method: 'GET',
      //     url: vm.streetsMeta,
      //     params: {f:'pjson'}
      //   };

      //   $http(req)
      //   .then(function(success){
      //     var data = success.data;
      //     console.log(data);
      //     vm.smeta = $firebaseObject(firebase.database().ref().child('metadata').child('philly').child('lane_closures').child('meta'));
      //     vm.smeta.$loaded().then(function() {
      //       vm.smeta.$value = data;
      //       vm.smeta.$save();
      //     });
      //   },function(){
      //     $mdToast.show(
      //       $mdToast.simple()
      //       .textContent("An error Occured.")
      //       .position('top right')
      //       .hideDelay(3000)
      //     );
      //   });
    });

    function openPage(id){

      $state.go("permitview",{type:vm.gState,num:id});
    }

    function scanCode(ev){
      $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title('Coming Soon!')
        .textContent('Code Scanning will be available soon!')
        .ariaLabel('Alert Dialog Demo')
        .ok('Got it!')
        .targetEvent(ev)
    );
    }

    function parseResults() {
        if(vm.fieldName == "OBJECTID"){
          vm.query = Number(vm.query);
        }
        if(vm.permitResults.length == 0)
        {
          var req = {
            method: 'GET',
            url: "https://x.emelle.me/jsonservice/Parcl/streetpermits",
            params: {f:vm.fieldName,q:vm.query}
          };

          $http(req)
          .then(function(success){
            // var data = success.data;
            // console.log(vm.fieldName);
            vm.permitResults = $firebaseArray(firebase.database().ref().child('philadelphia').child('permits').child('lane_closures').orderByChild(vm.fieldName).equalTo(vm.query));
          },function(){
            $mdToast.show(
              $mdToast.simple()
              .textContent("An error Occured.")
              .position('top right')
              .hideDelay(3000)
            );
          });
        }
      }

    function createQR(data, status) {
      var d = {gState:vm.gState,fieldName:vm.fieldName,query:vm.query};
      $rootScope.storage.setItem('currentSearch',JSON.stringify(d));
      $rootScope.searchHistory.push(d);
      $rootScope.storage.setItem('searchHistory',JSON.stringify($rootScope.searchHistory));
      if(vm.fieldName == "OBJECTID"){
          vm.query = Number(vm.query);
        }
      vm.permitResults = $firebaseArray(firebase.database().ref().child('philadelphia').child('permits').child('lane_closures').orderByChild(vm.fieldName).equalTo(vm.query));
      vm.permitResults.$loaded().then(function(){
        
        if(vm.permitResults.length == 0)
        {
          var req = {
            method: 'GET',
            url: "https://x.emelle.me/jsonservice/Parcl/streetpermits",
            params: {f:vm.fieldName,q:vm.query}
          };

          $http(req)
          .then(function(success){
            // var data = success.data;
            // console.log(vm.fieldName);
            vm.permitResults = $firebaseArray(firebase.database().ref().child('philadelphia').child('permits').child('lane_closures').orderByChild(vm.fieldName).equalTo(vm.query));
          },function(){
            $mdToast.show(
              $mdToast.simple()
              .textContent("An error Occured.")
              .position('top right')
              .hideDelay(3000)
            );
          });
        }
      });
      console.log(data);     
    }

    if($rootScope.currentSearch != null){
      vm.gState = $rootScope.currentSearch.gState;
      vm.fieldName = $rootScope.currentSearch.fieldName;
      vm.query = $rootScope.currentSearch.query;
      if(vm.fieldName == "OBJECTID"){
        vm.query = Number(vm.query);
      }
      vm.permitResults = $firebaseArray(firebase.database().ref().child('philadelphia').child('permits').child('lane_closures').orderByChild(vm.fieldName).equalTo(vm.query));
      vm.permitResults.$loaded().then(function(){
        
        if(vm.permitResults.length == 0)
        {
          var req = {
            method: 'GET',
            url: "https://x.emelle.me/jsonservice/Parcl/streetpermits",
            params: {f:vm.fieldName,q:vm.query}
          };

          $http(req)
          .then(function(success){
            // var data = success.data;
            // console.log(vm.fieldName);
            vm.permitResults = $firebaseArray(firebase.database().ref().child('philadelphia').child('permits').child('lane_closures').orderByChild(vm.fieldName).equalTo(vm.query));
          },function(){
            $mdToast.show(
              $mdToast.simple()
              .textContent("An error Occured.")
              .position('top right')
              .hideDelay(3000)
            );
          });
        }
      });
      
    }


  });

