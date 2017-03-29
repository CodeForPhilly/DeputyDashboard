'use strict';

    angular
        .module('materialApp')
        .factory('fbStorage', storage);

    function storage($firebaseAuth,$mdDialog,$rootScope,$mdMedia,$mdToast) {
    	var config = {
		    apiKey: "AIzaSyDasyvVqSGPEM9VQZmC34j1mnu4FSoF1ZQ",
		    authDomain: "deputydashboard.firebaseapp.com",
		    databaseURL: "https://deputydashboard.firebaseio.com",
		    storageBucket: "deputydashboard.appspot.com",
		    messagingSenderId: "39752519200"
		  };
		firebase.initializeApp(config);

		var auth = $firebaseAuth();
		var service = {};

		service.onAuthChange = authChange;
		service.emailAuth = emailAuth;
		service.anonAuth = anonAuth;
		service.signOut = signOut;
		service.register = register;
		service.setParcelNote = setParcelNote;
		service.updateHistory = updateHistory;
		service.pushLocation = pushLocation;

		function pushLocation(location){
			if($rootScope.fireUser == null){
				return true;
			}
			var ld = {};
			ld.accuracy = location.coordinates.accuracy;
			ld.lat = location.coordinates.latitude;
			ld.lng = location.coordinates.longitude; 
			ld.timestamp = firebase.database.ServerValue.TIMESTAMP;
			ld.location  = location;
			var newLocation = firebase.database().ref("users/"+$rootScope.fireUser.uid+"/locations").push();
			newLocation.set(ld);
			return newLocation.key;
		}

		function authChange(){
			
			auth.$onAuthStateChanged(function(firebaseUser) {
				console.log(firebaseUser);
				if(firebaseUser == null){
					$rootScope.fireUser = null;
				}
				$rootScope.fireUser = firebaseUser;
			})
		}

		function updateHistory(parcelid,city){
			return firebase.database().ref(city+'/'+parcelid).update($rootScope.currentParcel);
		}

		function emailAuth(email,password){
			auth.$signInWithEmailAndPassword(email,password).then(function(firebaseUser){
	          console.log(firebaseUser) 
	        }).catch(function(error){
	          console.log(error);
	        })
		}

		function anonAuth(){
			auth.$signInAnonymously().then(function(firebaseUser){
	          $rootScope.user = firebaseUser;
	        }).catch(function(error){
	          console.log(error);
	        })
		}

		function signOut(){
			auth.$signOut();
		}

		function register(firstName,email,pass){
			auth.$createUserWithEmailAndPassword(email,pass).then(function(firebaseUser){
				console.log(firebaseUser);
				$mdToast.show(
		          $mdToast.simple()
		          .content("Success!")
		          .position('top left')
		          .hideDelay(1000)
		        );
		        //write user first name and email to user space
		        firebase.database().ref("users/"+firebaseUser.uid).update({
		        	firstName:firstName,
		        	email:email
		        });
				service.emailAuth(email,pass);
			}).catch(function(error){
				console.log(error);
				$mdToast.show(
		        $mdToast.simple()
		        .content("Error: ")
		        .position('bottom left')
		        .hideDelay(3000)
		      );
			})
		}

		function setParcelNote(parcelid,city){
			firebase.database().ref(city+'/'+parcelid+'/notes').once('value', function(snapshot) {
		        $rootScope.activeSurvey = snapshot.val();
		        $mdToast.show(
		          $mdToast.simple()
		          .content("Survey loaded")
		          .position('top left')
		          .hideDelay(1000)
		        );
		        $state.go('survey');
		      });
		}


		return service;
    }

    