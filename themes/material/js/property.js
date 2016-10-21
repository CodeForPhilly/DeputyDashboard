"use strict";
angular

.module('materialApp')
.controller('PropertyListCtrl', function(fbStorage,$rootScope,$state,$scope,$mdBottomSheet,$mdDialog,$mdToast,$http,$filter,$mdMedia,$timeout,$firebaseArray,$firebaseObject,$sce,$cordovaCamera) {
  $rootScope.parcel_id = $state.params.id;
  $rootScope.searching = false;
  $scope.salesData = false;
  if($rootScope.currentCity === undefined){
    $state.go('home');
  }
  })
.controller('PropertyCtrl', function(fbStorage,$rootScope,$state,$scope,$mdBottomSheet,$mdDialog,$mdToast,$http,$filter,$mdMedia,$timeout,$firebaseArray,$firebaseObject,$sce,$cordovaCamera) {
	$rootScope.currentCity = $state.params.city;
	$rootScope.parcel_id = $state.params.id;
  $rootScope.subTitle = "";
  $rootScope.searching = false;
  $scope.salesData = false;
  var vm = this;
  this.items = [];
  console.log('log it');

  for (var i = 0; i < 1000; i++) {
    this.items.push(i);
  }

  $rootScope.note_categories = $firebaseArray(firebase.database().ref().child('note_categories'))
    $rootScope.note_categories.$loaded(function(){
      $rootScope.note_categories = $rootScope.note_categories.map( function (category) {
        category.value = category.name.toLowerCase();
        return category;
      });
    });

  //Category compleete
    $rootScope.selectedNoteItemChange = selectedItemChange;
    $rootScope.noteCategorySearch = noteCategorySearch;
    $rootScope.searchNoteChange   = catSearchTextChange;
    $rootScope.addNoteCategory = function($event,text){
      var pd = {name:text};
      var pk = firebase.database().ref().child('note_categories').push().key;

      var updates = {};
      updates['/note_categories/' + pk] = pd;
      firebase.database().ref().update(updates).then(
        function(){
          $mdToast.show(
            $mdToast.simple()
            .content("Category Saved!")
            .position('top right')
            .hideDelay(3000)
          );
        },
        function(error) {
        if(error){
          $mdDialog.show(
            $mdDialog.alert()
              .parent(angular.element(document.querySelector('#popupContainer')))
              .clickOutsideToClose(true)
              .title('Error')
              .textContent('There was an error saving this Note. Please try again.')
              .ariaLabel('Alert Dialog')
              .ok('Ok!')
          );
        }
      });
    }
    // ******************************
    // Internal methods
    // ******************************
    /**
     * Search for Notes... use $timeout to simulate
     * remote dataservice call.
     */
    function noteCategorySearch (query) {
      var results = query ? $rootScope.note_categories.filter( createFilterFor(query) ) : $rootScope.note_categories;
      return results;
    }
    function catSearchTextChange(text) {
      console.log('Text changed to ' + text);
    }
    function selectedItemChange(item) {
      console.log('Item changed to ' + JSON.stringify(item));
    }
    /**
     * Build `components` list of key/value pairs
     */
    function loadAll() {
      var Notes = [
        {
          'name'      : 'Jane Doe',
          'mrn'       : '123456',
        }
      ];
      
      
    }
    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(item) {
        return (item.value.indexOf(lowercaseQuery) === 0);
      };
    }

   

/******/

/******/


  //Load Camera
  document.addEventListener("deviceready", function () {

    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 100,
      targetHeight: 100,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
    correctOrientation:true
    };

    $scope.takePicture = function(){
      console.log('camera')
      $cordovaCamera.getPicture(options).then(function(imageData) {
        
        if($rootScope.currentParcel.images == undefined){
          $rootScope.currentParcel.images = [];
        }
        var image = new Image();
        image.src = "data:image/jpeg;base64," + imageData;
        $rootScope.currentParcel.images.push(image);
        console.log($rootScope.currentParcel.images);
        $mdToast.show(
            $mdToast.simple()
            .content("Image successfully loaded!")
            .position('top right')
            .hideDelay(3000)
          );
      }, function(err) {
        // error
      });
    }

  }, false);

	switch ($rootScope.currentCity) {
    case "philly":
        $rootScope.cityState = "Philadelphia, PA";
        break;
    case "dc":
        $rootScope.cityState = "Washington, DC";
        break;
    case "nyc":
        $rootScope.cityState = "New York, New York";
        break;
}

$scope.getPermits = function(url){
var req = {
        method: 'GET',
        url: url
      };
      $http(req)
      .success(function(data,status,headers,config){
        console.log(data);
        $rootScope.currentParcel.l_i.permits = data.d.results;
      })
      .error(function(data, status, headers, config){
        console.log("No Datas :(", data);
        $mdToast.show(
          $mdToast.simple()
          .content("An error Occured.")
          .position('top right')
          .hideDelay(3000)
        );
      });
}

$scope.getViolations = function(url){
var req = {
        method: 'GET',
        url: url
      };
      $http(req)
      .success(function(data,status,headers,config){
        console.log(data);
        $rootScope.currentParcel.l_i.violations = data.d.results;
      })
      .error(function(data, status, headers, config){
        console.log("No Datas :(", data);
        $mdToast.show(
          $mdToast.simple()
          .content("An error Occured.")
          .position('top right')
          .hideDelay(3000)
        );
      });
}

$scope.getLI = function(){
  // var req = {
  //       method: 'GET',
  //       url: "https://services.phila.gov/PhillyApi/Data/v0.7/Service.svc/locations?$filter=substringof('"+$rootScope.currentParcel.characteristics.house_number+"',street_number) eq true and (street_name eq '"+$rootScope.currentParcel.characteristics.street_name+"') and (street_suffix eq '"+$rootScope.currentParcel.characteristics.street_designation+"')&$format=json"
  //     };
  //     $http(req)
  //     .success(function(data,status,headers,config){
  //       console.log(data.d.results.length);
  //       if(data.d.results.length > 0){
  //         //Push to list
  //         $rootScope.currentParcel.l_i = data.d.results;
  //         angular.forEach($rootScope.currentParcel.l_i,function(value, key){
  //             // $scope.results.push(value.raw);
  //             $scope.getPermits(value.permits.__deferred.uri);
  //             // $scope.getLicenses(value.licenses.__deferred.uri);
  //             $scope.getViolations(value.violationdetails.__deferred.uri)
  //         });
  //         //Get Permits
          
  //       }
        
  //     })
  //     .error(function(data, status, headers, config){
  //       console.log("No Datas :(", data);
  //       $mdToast.show(
  //         $mdToast.simple()
  //         .content("An error Occured.")
  //         .position('top right')
  //         .hideDelay(3000)
  //       );
  //     });
}

$scope.getDCSale = function(address){
  var whereClause = "PROPERTY_ADDRESS='"+address+"'";
  var req = {
      method: 'GET',
      url: 'https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Property_and_Land_WebMercator/MapServer/57/query',
      params: {where:whereClause,f:'pjson',returnDistinctValues:true,returnM:false,returnZ:false,returnCountOnly:false,returnIdsOnly:false,returnTrueCurves:false,returnGeometry:false,outFields:"*",spatialRel:"esriSpatialRelIntersects",geometryType:"esriGeometryEnvelope"}
    };
    $http(req)
    .success(function(data,status,headers,config){
      if($rootScope.currentParcel,data.features != false){
        $rootScope.currentParcel = _.merge($rootScope.currentParcel,data.features[0].attributes);
        $scope.salesData = true;
      }
      console.log("Datas!", $rootScope.currentParcel);
    })
    .error(function(data, status, headers, config){
      console.log("No Datas :(", data);
      $mdToast.show(
        $mdToast.simple()
        .content("No Sale Info for this property.")
        .position('top right')
        .hideDelay(3000)
      );
    });
}

$scope.getDCUseCode = function(code){
  var whereClause = "CODE='"+code+"'";
  var req = {
      method: 'GET',
      url: 'https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Property_and_Land_WebMercator/MapServer/54/query',
      params: {where:whereClause,f:'pjson',returnDistinctValues:true,returnM:false,returnZ:false,returnCountOnly:false,returnIdsOnly:false,returnTrueCurves:false,returnGeometry:false,outFields:"*",spatialRel:"esriSpatialRelIntersects",geometryType:"esriGeometryEnvelope"}
    };
    $http(req)
    .success(function(data,status,headers,config){
      if($rootScope.currentParcel,data.features != false){
        $rootScope.currentParcel.land_use = data.features[0].attributes;

      }
      console.log("Datas!", $rootScope.currentParcel);
    })
    .error(function(data, status, headers, config){
      console.log("No Datas :(", data);
      $mdToast.show(
        $mdToast.simple()
        .content("An error Occured.")
        .position('top right')
        .hideDelay(3000)
      );
    });
}

$scope.getCharacteristics = function(id){
  var req = {
    method: 'GET',
    url: 'https://data.phila.gov/resource/tqtk-pmbv.json',
    headers: {'Content-Type': 'application/x-www-form-urlencoded','X-App-Token':'D3weSV9XH75ieSxloQwC1Tscl'},
    params: {parcel_number:id}
  };
  $http(req)
  .success(function(data,status,headers,config){
    $rootScope.currentParcel.characteristics = _.merge($rootScope.currentParcel.characteristics,data[0]);
    console.log("Characteristics!", $rootScope.currentParcel);
    $scope.getLI();
  })
  .error(function(data, status, headers, config){
    console.log("No Datas :(", data);
    $mdToast.show(
      $mdToast.simple()
      .content("An error Occured.")
      .position('top right')
      .hideDelay(3000)
    );
  });
}

$scope.getNeighborhood = function(x,y){
  var statement = "select * from azavea.philadelphia_neighborhoods where ST_Contains(the_geom, ST_GeomFromText('POINT("+x+" "+y+")',4326))";
  var req = {
    method: 'GET',
    url: 'https://azavea.carto.com/api/v2/sql',
    params: {q:statement}
  };
  $http(req)
  .success(function(data,status,headers,config){
    $rootScope.currentParcel.neighborhood = data.rows[0];

    // // Split WKB into array of integers (necessary to turn it into buffer)
    // var hexAry = $rootScope.currentParcel.neighborhood.the_geom.match(/.{2}/g);
    // var intAry = [];
    // for (var i in hexAry) {
    //   intAry.push(parseInt(hexAry[i], 16));
    // }
    // // console.log(intAry);
    // // Generate the buffer
    // var wkx = require('wkx');
    // var buf = new buffer.Buffer(intAry);

    // // Parse buffer into geometric object
    // var geom = wkx.Geometry.parse(buf);
    // var points = geom.toGeoJSON().coordinates[0][0];
    // $rootScope.currentParcel.neighborhood.geoJson = [];
    // angular.forEach(points,function(value, key){
    //     // $scope.results.push(value.raw);
    //     $rootScope.currentParcel.neighborhood.geoJson.push([value[0],value[1]]);
      
    // });
    // console.log($rootScope.currentParcel.neighborhood.geoJson);
    // console.log("Neighborhood!", $rootScope.currentParcel);
    
  })
  .error(function(data, status, headers, config){
    console.log("No Neighborhood :(", data);
    $mdToast.show(
      $mdToast.simple()
      .content("An error Occured.")
      .position('top right')
      .hideDelay(3000)
    );
  });
}

$scope.getTaxes=function(id){
  var req = {
      method: 'GET',
      url: 'https://data.phila.gov/resource/y5ti-svsu.json',
      headers: {'Content-Type': 'application/x-www-form-urlencoded','X-App-Token':'D3weSV9XH75ieSxloQwC1Tscl'},
      params: {parcel_number:id}
    };
    $http(req)
    .success(function(data,status,headers,config){
      $rootScope.currentParcel.totalTaxes = 0;
      $rootScope.currentParcel.taxes = data;
      console.log("Tax Datas!", data);
      angular.forEach(data,function(value, key){
          // $scope.results.push(value.raw);
        $rootScope.currentParcel.totalTaxes = $rootScope.currentParcel.totalTaxes + parseInt(value.total); 
      });
      firebase.database().ref().child($rootScope.currentCity).child(id).child('taxes').set(data).then(function(){

        firebase.database().ref().child($rootScope.currentCity).child(id).child('taxUpdated').set(firebase.database.ServerValue.TIMESTAMP);
        firebase.database().ref().child($rootScope.currentCity).child(id).child('totalTaxes').set($rootScope.currentParcel.totalTaxes);
        
      });
      
    })
    .error(function(data, status, headers, config){
      console.log("No Datas :(", data);
      $mdToast.show(
        $mdToast.simple()
        .content("An error Occured.")
        .position('top right')
        .hideDelay(3000)
      );
    });
}

$scope.addNotes = function(ev) {
    $mdDialog.show({
      controller: NoteDialogController,
      templateUrl: './themes/material/components/addNote.html',
      targetEvent: ev,
      locals: {
         item: null
      },
    })
    .then(function(answer) {
      $scope.alert = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.alert = 'You cancelled the dialog.';
    });
  }

$scope.taxQuery = {
    order: 'tax_period',
    limit: 15,
    page: 1
  };

if($rootScope.currentCity == "philly"){
	if(!isNaN($rootScope.parcel_id) && angular.isNumber(+$rootScope.parcel_id)){
		var url = "https://api.phila.gov/opa/v1.1/account/"+$rootScope.parcel_id+"?format=json";
	}else{
		var url = "https://api.phila.gov/opa/v1.1/address/"+$rootScope.parcel_id+"/?format=json";
	}  
    
		
    $http.get(url)
    .success(function(response){
      $scope.searching = false;

      var r = response;
      if(!isNaN($rootScope.parcel_id) && angular.isNumber(+$rootScope.parcel_id)){
        $scope.results = [r.data.property];
        $rootScope.currentParcel = r.data.property;
      }else{
        $scope.results = r.data.properties;
        $rootScope.currentParcel = r.data.properties[0];
      }

      //Get Charcteristcs and merge
      $scope.getCharacteristics($rootScope.parcel_id);
      
      $scope.getNeighborhood($rootScope.currentParcel.geometry.x,$rootScope.currentParcel.geometry.y);
      $rootScope.subTitle = $sce.trustAsHtml("<b>"+$rootScope.currentParcel.full_address+"</b>");
      $rootScope.subTitleClass = "prop-detail";
      console.log($scope.results);
      $rootScope.currentParcel.staticImageUrl = "https://maps.googleapis.com/maps/api/staticmap?center="+$rootScope.currentParcel.geometry.y+","+$rootScope.currentParcel.geometry.x+"&markers=color:green%7C"+$rootScope.currentParcel.geometry.y+","+$rootScope.currentParcel.geometry.x+"&zoom=18&format=png&sensor=false&size=320x240&maptype=roadmap&style=feature:road%7Chue:0x006eff&style=feature:water%7Chue:0x004cff%7Clightness:-45";
      console.log(u);

      //Load Taxes
        if($rootScope.currentParcel.taxes === undefined || taxlastUpdated > 86400000){
          $scope.getTaxes($rootScope.parcel_id);
        }else{
          angular.forEach($rootScope.currentParcel.taxes,function(value, key){
            // $scope.results.push(value.raw);
            $rootScope.currentParcel.totalTaxes = $rootScope.currentParcel.totalTaxes + parseInt(value.total); 
          });
        }
      var u = fbStorage.updateHistory($rootScope.parcel_id,$rootScope.currentCity);
      
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
}else{
  if($rootScope.currentParcel == null){
    //Get Parcel http://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Property_and_Land_WebMercator/MapServer/54/query?where=CODE+%3D+126&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson
    var req = {
      method: 'GET',
      url: 'https://x.emelle.me/jsonservice/Parcel/getParcel',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      params: {q:$rootScope.parcel_id,city:$rootScope.currentCity}
    };
    $http(req)
    .success(function(data,status,headers,config){
      // console.log("Parcel id found!", data.response[0].ID);
      if(data.response["block"] != undefined){
        //Search by block 
        $rootScope.searchByBlock(data.response["block"]);
      }else{
        if($rootScope.currentCity == 'dc'){
          $rootScope.parcelId = data.response[0].ID;

          if(data.response.length > 1){
            //show list
            $scope.showList(data.response);
          }else{
            $rootScope.currentParcel = data.response[0];
          }
          $rootScope.subTitle = $sce.trustAsHtml("<b>"+$rootScope.currentParcel.PremiseAdd+"</b>");
      
          $rootScope.currentParcel.staticImageUrl = "https://maps.googleapis.com/maps/api/staticmap?center="+$rootScope.currentParcel.geometry.y+","+$rootScope.currentParcel.geometry.x+"&markers=color:green%7C"+$rootScope.currentParcel.Lat+","+$rootScope.currentParcel.Lng+"&zoom=15&format=png&sensor=false&size=320x240&maptype=roadmap&style=feature:landscape|color:0x080504&style=feature:poi|visibility:off&style=feature:landscape.man_made|visibility:off&style=feature:road|visibility:simplified";
          $scope.getDCUseCode($rootScope.currentParcel.UseCode);
          $scope.getDCSale($rootScope.currentParcel.PremiseAdd);
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
  }else{
    $rootScope.currentParcel.staticImageUrl = "https://maps.googleapis.com/maps/api/staticmap?center="+$rootScope.currentParcel.Lat+","+$rootScope.currentParcel.Lng+"&markers=color:green%7C"+$rootScope.currentParcel.Lat+","+$rootScope.currentParcel.Lng+"&zoom=15&format=png&sensor=false&size=320x240&maptype=roadmap&style=feature:landscape|color:0x080504&style=feature:poi|visibility:off&style=feature:landscape.man_made|visibility:off&style=feature:road|visibility:simplified";
    $scope.getDCUseCode($rootScope.currentParcel.UseCode);
    $scope.getDCSale($rootScope.currentParcel.PremiseAdd);
  }
}  

function NoteDialogController($rootScope,scope, $mdDialog,item) {
    var prop = $rootScope.currentParcel;
    var ref = firebase.database().ref().child($rootScope.currentCity).child($rootScope.parcel_id).child('status');
    scope.newStatus={};
    scope.status = $firebaseArray(ref);

      scope.status.$loaded().then(function() {
        console.log(scope.status);  // "Marie Curie"
        if(scope.status.length <1){
          console.log( 'no status field. creating one');
            console.log( 'saved');
        }
      });

    scope.hide = function() {
      $mdDialog.hide();
    };
    scope.cancel = function() {
      $mdDialog.cancel();
    };
    scope.answer = function(answer) {
      console.log(answer)
      if(answer == "save"){
        
        scope.newStatus.by = $rootScope.fireUser.uid;
        scope.newStatus.category = $rootScope.noteCategory;
        scope.newStatus.timestamp = firebase.database.ServerValue.TIMESTAMP;
        
        scope.status.$add(scope.newStatus).then(function(){
          $mdToast.show(
            $mdToast.simple()
            .content("Note Added!")
            .position('top right')
            .hideDelay(3000)
          );
        });
        
      }
      $mdDialog.hide(answer);
    };
    
  };


});
