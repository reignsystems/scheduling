var app = angular.module('app', ['ngRoute']);
app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "app/partials/main.html"
        })
        .otherwise({redirectTo:"/index.html"})
});