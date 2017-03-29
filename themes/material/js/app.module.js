"use strict";
angular
  .module('materialApp', ['ngMaterial','md.data.table','ui.router','ngRoute','firebase','ngSanitize'])
.config(function($locationProvider,$mdThemingProvider,$sceDelegateProvider, $mdIconProvider,$httpProvider,$stateProvider,$urlRouterProvider){

      $locationProvider.html5Mode(false);
      $urlRouterProvider.otherwise("/");
      //
      // Now set up the states
      $stateProvider
        .state('home', {
          url: "/",
          templateUrl: "./themes/material/components/deputy.html",
          controller: function($stateParams){
          }
        }).state('phl', {
          url: "/phl/:place",
          templateUrl: "./themes/material/components/dd.html",
          controller: function($stateParams){
            $stateParams.place;
          }
        })
        .state('permitview', {
          url: "/permits/:type/:num",
          templateUrl: "./themes/material/components/permitview.html",
          controller: function($stateParams){
            $stateParams.type;
            $stateParams.num;
          }
        })
        .state('permits', {
          url: "/permits",
          templateUrl: "./themes/material/components/qrgen.html",
          controller: function($stateParams){
          }
        })
        .state('scan', {
          url: "/scan",
          templateUrl: "./themes/material/components/scan.html",
          controller: function($stateParams){
          }
        })
        .state('property', {
          url: "/property/:city/:id",
          templateUrl: "./themes/material/components/dc-property-detail.html",
          controller: function($stateParams){
            $stateParams.id;  //*** Exists! ***//
            $stateParams.city;
          }
        })
        .state('sv', {
          url: "/sv/:lat/:lng",
          templateUrl: "./themes/material/components/streetview.html",
          controller: function($stateParams){
            $stateParams.lat;  //*** Exists! ***//
            $stateParams.lng;
          }
        })
        
      $mdThemingProvider.theme('default')
       .primaryPalette('blue',{
        'default': '400', // by default use shade 400 from the pink palette for primary intentions
        'hue-1': '200', // use shade 100 for the <code>md-hue-1</code> class
        'hue-2': '900', // use shade 600 for the <code>md-hue-2</code> class
        'hue-3': 'A400' // use shade A100 for the <code>md-hue-3</code> class
      })
      .accentPalette('grey',{
                          'default': '900', // by default use shade 400 from the pink palette for primary intentions
                          'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
                          'hue-2': '200', // use shade 600 for the <code>md-hue-2</code> class
                          'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
                        });
      $mdThemingProvider.theme('green')
      .primaryPalette('green')
      .accentPalette('blue-grey');

      $mdThemingProvider.theme('dark-grey').backgroundPalette('grey',{
      'default': '900', // by default use shade 400 from the pink palette for primary intentions
        'hue-1': '500', // use shade 100 for the <code>md-hue-1</code> class
        'hue-2': '900', // use shade 600 for the <code>md-hue-2</code> class
        'hue-3': 'A400' // use shade A100 for the <code>md-hue-3</code> class}).dark();
      }).dark();
      $mdThemingProvider.theme('dark-orange').backgroundPalette('orange',{
      'default': '900', // by default use shade 400 from the pink palette for primary intentions
        'hue-1': '300', // use shade 100 for the <code>md-hue-1</code> class
        'hue-2': '900', // use shade 600 for the <code>md-hue-2</code> class
        'hue-3': 'A400' // use shade A100 for the <code>md-hue-3</code> class}).dark();
      }).dark();
      $mdThemingProvider.theme('dark-purple').backgroundPalette('deep-purple').dark();
      $mdThemingProvider.theme('dark-blue').backgroundPalette('blue',{
      'default': '900', // by default use shade 400 from the pink palette for primary intentions
        'hue-1': '300', // use shade 100 for the <code>md-hue-1</code> class
        'hue-2': '900', // use shade 600 for the <code>md-hue-2</code> class
        'hue-3': 'A400' // use shade A100 for the <code>md-hue-3</code> class}).dark();
      }).dark();
      $mdThemingProvider.theme('dark-red').backgroundPalette('red',{
      'default': '200', // by default use shade 400 from the pink palette for primary intentions
        'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
        'hue-2': '900', // use shade 600 for the <code>md-hue-2</code> class
        'hue-3': 'A400' // use shade A100 for the <code>md-hue-3</code> class}).dark();
      }).dark();
    })  
.filter('cleandate', function() {
  return function(input) {
    if(input !== undefined){
      var d =new Date(parseInt(input.substr(6)));
      var dd = moment(d);
      return dd.format('ddd, MMM Do YYYY');
    }
  }
})
.filter('showTitle', function($rootScope) {
  return function(input) {
    if(input !== undefined){
      var a = _.find($rootScope.levels,{value:input});
      return a.fullName;
    }
  }
})
.filter('showTheme', function($rootScope) {
  return function(input) {
    if(input !== undefined){
      var a = _.find($rootScope.levels,{value:input});
      if (a.value == 2) {
        return "dark-red"
      }else if(input == 1){
        return "dark-orange"
      }else if(input == 0){
        return "dark-grey"
      }
    }
  }
})
.filter('showDescription', function() {
  return function(input) {
    if(input !== undefined){
      if (input == 3) {
        return "Properties with multiple un-resolved violations and other negative marks"
      }else if(input == 2){
        return "L & I violations and taxes"
      }else if(input == 1){
        return "Vacant land and property"
      }
    }
  }
})
.filter('exteriorCondition', function(){
  return function(input){
    if(input === undefined){
      return;
    }
    var extcon = [{"ext_cond":0,"value": "Not Applicable"},
    {"ext_cond":1,"value": "Other"},
    {"ext_cond":2,"value": "New / Rehabbed"},
    {"ext_cond":3,"value": "Above Average"},
    {"ext_cond":4,"value": "Average"},
    {"ext_cond":5,"value": "Below Average"},
    {"ext_cond":6,"value": "Vacant"},
    {"ext_cond":7,"value": "Sealed / Structurally Compliant"}
  ];
    var val = _.filter(extcon,{"ext_cond":Number(input)});
    return val[0].value;
  }
})
.filter('cleanArcDate', function() {
  return function(input) {
    if(input !== undefined){
      var d =new Date(parseInt(input));
      var dd = moment(d);
      return dd.format('ddd, MMM Do YYYY');
    }
  }
})
.filter('formatMoney', function() {
  return function(input) {
    if(input !== undefined){
      var t = parseFloat(input)
      var d ='$'+t.toFixed(2);
      return d.toString();
    }
  }
})
.filter('debtType', function() {
  return function(input) {
    if(input !== undefined){
      var t = input.replace("_"," ");
      return t;
    }
  }
})
.filter('formatPHPTime',function(){
  return function(input){
    var d = moment(input*1000);
    return d.fromNow();
  }
})
.filter('formatDate',function(){
  return function(input){
    var d = moment(input);
    return d.format('ddd, MMM Do');
  }
})
.filter('togo',function(){
  return function(input){
    var d = moment(input);
    console.log(moment().millisecond() - input);
    return d.fromNow();
  }
})
.filter('formatStreetPermitURL',function(){
  return function(input){
    var d = input.slice(0,4) + "-" + input.slice(4,input.length);
    return 'https://stsweb.phila.gov/StreetClosureAPI/api/Permits/GetPermitPdf.pdf?permitId='+d;
  }
})
.filter('formatTime',function(){
  return function(input){
    var d = moment(input);
    return d.format('h:mm a');
  }
})
.filter('formatTimeRelative',function(){
  return function(input){
    var d = moment(input);
    return d.format('MMM Do, h:mm a');
  }
})
.run(function($rootScope,$mdToast,$firebaseArray){
    //Runtime code
    $rootScope.storage = window.localStorage;
    $rootScope.allFilters = JSON.parse($rootScope.storage.getItem('deputy_allFilters'));
    if(!$rootScope.allFilters){
      $rootScope.allFilters=[
      {
        isActive:true,
        canDelete:false,
        level:2,
        name:"Top Property Filter",
        description:"Hot Property in Philadelphia",
        sheriff:{past_days:365,future_days:30},
        li:{
          clean_seal:{past_days:365},
          permits:{past_days:0},
          violations:{past_days:0}
        }
      },
      {
        isActive:true,
        canDelete:false,
        level:1,
        name:"Secondary Property Filter",
        description:"Interesting Property in Philadelphia",
        sheriff:{past_days:0,future_days:365},
        li:{
          clean_seal:{past_days:30},
          permits:{past_days:60},
          violations:{past_days:60}
        }
      },
      {
        isActive:true,
        canDelete:false,
        level:0,
        name:"Vacant Filter",
        description:"Interesting Property in Philadelphia",
        sheriff:{past_days:0,future_days:0},
        li:{
          vacant_land:true,
          vacant_property:true
        }
      }];
      
      $rootScope.storage.setItem("deputy_allFilters",JSON.stringify($rootScope.allFilters));
      
    }
    $rootScope.topFilters = _.filter($rootScope.allFilters,{level:2});
    $rootScope.secondaryFilters = _.filter($rootScope.allFilters,{level:1});
    $rootScope.vacantFilters = _.filter($rootScope.allFilters,{level:0});
    $rootScope.searchFilters = $rootScope.topFilters;
    $rootScope.activeFilter = _.findIndex($rootScope.searchFilters,{isActive:true});
    $rootScope.neighborhoods = JSON.parse($rootScope.storage.getItem('deputy_neighborhoods'));
    $rootScope.topProperty = JSON.parse($rootScope.storage.getItem('deputy_topProperty'));
    $rootScope.secondaryProperty = JSON.parse($rootScope.storage.getItem('deputy_secondaryProperty'));
    $rootScope.vacantProperty = JSON.parse($rootScope.storage.getItem('deputy_vacantProperty'));

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
        });
    };
    $mdSidenav('right').onClose(function () {
      $log.debug('closing');
    });
  })
.controller('LeftCtrl', function ($rootScope,$scope, $timeout, $mdSidenav, $log) {
  $scope.isOpenRight = function(){
    return $mdSidenav('left').isOpen();
  };
    $scope.close = function () {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('left').close()
        .then(function () {
          $log.debug("close LEFT is done");
          
        });
    };
    $mdSidenav('left').onClose(function () {
      $log.debug('closing');
      
    });
  })
;