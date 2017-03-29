
"use strict";
angular
  .module('materialApp')
  .controller('StreetviewCtrl', function($rootScope,$state,$scope,$mdBottomSheet,$mdDialog,$mdToast,$http,$filter,$mdMedia,$timeout,$firebaseArray,$sce) {
  	var vm = this;
    $rootScope.lat = parseFloat($state.params.lat);
    $rootScope.lng = parseFloat($state.params.lng);
    vm.map;
    vm.pano;
    vm.processSVData = processSVData;


    angular.element(document).ready(function () {
      var sv = new google.maps.StreetViewService();
      vm.location = new google.maps.LatLng({lat: $rootScope.lat, lng: $rootScope.lng});
      vm.pano = new google.maps.StreetViewPanorama(document.getElementById('pano'));
      sv.getPanorama({location: vm.location, radius: 50}, processSVData);
    });

    function processSVData(data, status) {
      console.log(data);
        if (status === 'OK') {
          // Calculate Heading
          var pegmanLocation = data.location.latLng;
          var heading = google.maps.geometry.spherical.computeHeading(pegmanLocation, vm.location);
          console.log(heading);


          vm.pano.setPano(data.location.pano);
          vm.pano.setPov({
            heading: heading,
            pitch: 0
          });
          vm.pano.setVisible(true);

          // marker.addListener('click', function() {
          //   var markerPanoID = data.location.pano;
          //   // Set the Pano to use the passed panoID.
          //   pano.setPano(markerPanoID);
          //   pano.setPov({
          //     heading: 270,
          //     pitch: 0
          //   });
          //   pano.setVisible(true);
          // });
        } else {
          console.error('Street View data not found for this location.');
        }
      }


  });

