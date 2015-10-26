'use strict';

/**
 * @ngdoc function
 * @name recipeAppApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the recipeAppApp
 */
angular.module('recipeAppApp')
  .controller('RecipeCtrl', function ($scope, $http, data) {
    $scope.pageData = data.data; //the data are being served to us via the router in app.js
    //The following two variables are serving as toggles to show an error message or the results DOM to the user.
    $scope.showPage = true; //Boolean variable to show the results or not
    $scope.errorMsg = false; //Boolean variable to show the error message or not

    if ($scope.pageData.error){
    	$scope.showPage = false;
    	$scope.errorMsg = true;
    }

//This function constructs the ingredients string in the required way to be presented.
    $scope.getIngredientString = function(array){
    	var result = '';

    	if (array === undefined) {
    		return '';
    	}

      	for (var i = 0; i < array.length; i++) {
      		result += array[i].quantity + ' ' + array[i].ingredient;
      		if(array.length - 1 !== i ){
      			result += ', '
      		}
      	}

      	return result;
    };
  });
