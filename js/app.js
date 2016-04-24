let mainApp = angular.module('MarvelApp', ['ngRoute']);
let requestURL = 'http://gateway.marvel.com:80/v1/public/characters?apikey=ea904943b774d2e0bf732697141a07da&limit=50';


mainApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/list', {
            controller: 'ListController',
            templateUrl: 'partials/listview.html',
        }).
        when('/detailed', {
            controller: 'DetailedListController',
            templateUrl: 'partials/detailedview.html',
        }).
        when('/eventDetail', {
            controller: 'DetailedListController',
            templateUrl: 'partials/eventdetailedview.html',
        }).
        otherwise({
            redirectTo: '/list',
        });
}]);

mainApp.controller('ListController', ['$scope', '$http', 'SharedStuff', function ($scope, $http, SharedStuff) {
    $scope.heroes = SharedStuff.allHeroes();
    console.log($scope.heroes);
    
    $scope.getDetails = function (input) {
        SharedStuff.getDetails(input);
    };

}]);

mainApp.controller('DetailedListController', ['$scope', 'SharedStuff', function ($scope, SharedStuff) {
    console.log('work');
    
    $scope.events = SharedStuff.getEvents();
    $scope.currentHero = SharedStuff.getCurrentHero();
//    $scope.eventDetail = SharedStuff.allEvents();
    $scope.getEventDetail = function () {
        SharedStuff.getEventDetail();
    };
}]);

mainApp.factory('SharedStuff', function($http) {
    let heroes = [];
    let events = [];
    let currentHero = {};
    let eventDetail = [];
    
    $http({
        method: 'GET',
        url: requestURL,
    }).then(function (response) {
        heroes = response.data.data.results;
    });

    
    return {
        allHeroes: function() {
            return heroes;
        },
        getDetails: function(input) {
            currentHero = input;
            
            $http({
        method: 'GET',
        url: 'http://gateway.marvel.com:80/v1/public/characters/' + input.id + '/events?limit=50&apikey=06ea344c402ac50cd0af89518b4a9284',
        }).then(function(response) {
            console.log(response);
            events = response.data.data.results;
        }).then(function() {
            window.location.href = '#/detailed';
            });
        },
        getEvents: function() {
            return events;
        },
        getCurrentHero: function() {
            return currentHero;
        },
        getEventDetail: function() {
            window.location.href = '#/eventDetail';
        },
//        allEvents: function() {
//            return eventDetail;
//        },
    };
});