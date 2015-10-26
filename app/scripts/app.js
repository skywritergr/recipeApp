'use strict';

/**
 * @ngdoc overview
 * @name recipeAppApp
 * @description
 * # recipeAppApp
 *
 * Main module of the application.
 */
angular
  .module('recipeAppApp', [
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize'
  ])
  .config(function ($routeProvider) {
    //Basic route configuration. The main page serves as our search page and then the
    ///recipe/:id pages are fetching the desirable recipe.
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/recipe/:id', {
        templateUrl: 'views/recipe.html',
        controller: 'RecipeCtrl',
        controllerAs: 'recipe',
        //before going to the next page we need to fetch the data for the recipe and pass them to the contronller.
        resolve: {
          data: function ($q, $http, $route) {
            var deferred = $q.defer();
            $http({method: 'GET', url: '/recipes/' + $route.current.params.id}).then(function(data) {
              //After successfully getting the recipe, send the response to the user.
              deferred.resolve(data);
            }, function(reason){
              //If the recipe is not found let the user know.
              deferred.resolve({'data' : {'error' : true, 'errorMsg' : 'Sorry, this recipe doesn\'t exist or may have been removed'}});
            });
            return deferred.promise;
          }
        }
      })
      .otherwise({
        redirectTo: '/'
      });
  })
//create a custom filter to use to the results grid. We are doing that because the normal filter
//throws an error if there are no data on the grid. Also that filter can be further customized to give
//a useful message to the user that the recipe she/he is looking isn't found. (as per the story)
  .filter('arrayFilter', function() {
    return function(input, search) {
      if (!input) return input;
      if (!search) return input;
      var expected = ('' + search).toLowerCase();
      var result = {};
      angular.forEach(input, function(value, key) {
        // We are looking across the entire object. With some more time we can 
        // choose here which specific parts of the object we want to search/filter
        var actual = JSON.stringify(value).toLowerCase(); 
        if (actual.indexOf(expected) !== -1) {
          result[key] = value;
        }
      });
      return result;
    }
  });
