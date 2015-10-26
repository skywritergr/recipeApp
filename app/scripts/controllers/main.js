'use strict';

/**
 * @ngdoc function
 * @name recipeAppApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the recipeAppApp
 */
angular.module('recipeAppApp')
  .controller('MainCtrl', function ($scope, $http) {
      $scope.searchCriteria = ''; // this is the variable that holds the users search criteria
      $scope.showTable = false; // toggle to display, or not, the results table
      $scope.noresults = false; // toggle to display a "no results found" message
      $scope.searchResults = {}; // this is populated after a successful search. It's used to populate the table.

      $scope.search = function(){
            if ($scope.searchCriteria !== ''){
                  // find the recipe the user searched for
                  $http({method: 'GET', url: '/findByName/' + $scope.searchCriteria}).then($scope.successSearch, $scope.errorSearch);
            } else {
                  // If the user pressed the search button without typing anything, show all the available recipes.
                  $http({method: 'GET', url: '/recipes'}).then($scope.successSearch, $scope.errorSearch);
            }
      }

      $scope.successSearch = function(response){
      	$scope.searchResults = response.data;
            // The following variables are working as toggles in order to show to the user
            // either an error message that no recipes found or the desired results.
            // This isn't the most elegant way but time presure does that to you. :)
            if($scope.searchResults.length > 0){
                  $scope.showTable = true;
                  $scope.noresults = false;
            } else {
                  $scope.showTable = false;
                  $scope.noresults = true;
            }
      };

      //Hopefully an error during search will never happen, but in case it does show an alert
      // window to the user and print the response to the console for debugging/supprt reasons.
      $scope.errorSearch = function(response){
      	console.log(response);
      	alert('Sorry, something went wrong. Please try again.')
      };

      //This functions constructs a string with all the ingredients so it will be displayed in the results grid.
      $scope.getIngredientString = function(array){
      	var result = '';

      	for (var i = 0; i < array.length; i++) {
      		result += array[i].ingredient;
      		if(array.length - 1 !== i ){
      			result += ', '
      		}
      	}

      	return result;
      }
    });
