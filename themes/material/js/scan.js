"use strict";
angular
  .module('materialApp')
  .controller('ScanController', function($rootScope,$state,$scope,$mdBottomSheet,$mdDialog,$mdToast,$http,$filter,$mdMedia,$timeout,$firebaseArray,$firebaseObject,$sce,fbStorage) {
    var vm = this;
    angular.element(document).ready(function(){
    // window.addEventListener("DOMContentLoaded", function() {
	  // Grab elements, create settings, etc.
	  var canvas = document.getElementById("canvas");
	    $rootScope.context = canvas.getContext("2d");
	    var video = document.getElementById("video");
	  var videoObj = { "video": true };
	    var errBack = function(error) {
	      console.log("Video capture error: ", error.code); 
	    };

	  if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		    // Not adding `{ audio: true }` since we only want video now
		    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
		        video.src = window.URL.createObjectURL(stream);
		        video.play();
		    });
		}
	// }, false);

	  	document.getElementById("snap").addEventListener("click", function() {
		  $rootScope.context.drawImage(video, 0, 0, 320, 240);
		});
	});

});