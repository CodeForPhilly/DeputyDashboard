"use strict";
angular
  .module('materialApp', ['ngMaterial','md.data.table','ui.router','ngRoute','firebase','ngSanitize'])
.config(function($locationProvider,$mdThemingProvider,$sceDelegateProvider, $mdIconProvider,$httpProvider,$stateProvider,$urlRouterProvider){

      $locationProvider.html5Mode(false);
      $urlRouterProvider.otherwise("/home");
      //
      // Now set up the states
      $stateProvider
        .state('home', {
          url: "/home",
          templateUrl: "./themes/material/components/deputy.html",
          controller: function($stateParams){
          }
        }).state('dd', {
          url: "/dd/:place",
          templateUrl: "./themes/material/components/dd.html",
          controller: function($stateParams){
            $stateParams.place;
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
        
      $mdThemingProvider.theme('default')
       .primaryPalette('blue',{
        'default': '900', // by default use shade 400 from the pink palette for primary intentions
        'hue-1': '700', // use shade 100 for the <code>md-hue-1</code> class
        'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
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

      $mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
      $mdThemingProvider.theme('dark-orange').backgroundPalette('orange').dark();
      $mdThemingProvider.theme('dark-purple').backgroundPalette('deep-purple').dark();
      $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();

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
.filter('showTitle', function() {
  return function(input) {
    if(input !== undefined){
      if (input == 3) {
        return "Hot Parcels"
      }else if(input == 2){
        return "Heating Up"
      }else if(input == 1){
        return "Dormant Parcels"
      }
    }
  }
})
.filter('showDescription', function() {
  return function(input) {
    if(input !== undefined){
      if (input == 3) {
        return "Upcoming Sales"
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
.filter('formatDate',function(){
  return function(input){
    var d = moment(input);
    return d.format('ddd, MMM Do');
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
.run(function($rootScope,$mdToast){
    //Runtime code
});