const app = angular.module('Vote', []);
app.controller('VotingController', function($scope, $http) {
    var candidatesList = [];
    $scope.voteForAll = function() {
        var req = {
            method: 'get',
            url: '/candidates',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        $http(req).then(function(response) {
            $scope.candidates = parseResponseData(response.data.candidates);
            console.log($scope.candidates);
        }, function(error) {
            console.log('Error: ', error);
        })
    };
    $scope.vote = function(candidate) {
        candidate = parseCandidateName(candidate);
        if (candidatesList.indexOf(candidate) >= 0) {
            var req = {
                method: 'POST',
                url: '/vote',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { candidateName: candidate }
            };
            $http(req).then(function(response) {
                const data = response.data;
                $scope.candidates[data.candidate] = data.votes;
                console.log(data);
            }, function(error) {
                console.log('error: ', error);
            });
        }
        else {
            alert('It is not a Valid candidate.');
        }
    };
    function parseResponseData(data) {
        var obj = {};
        var i;
        for (i = 0; i < data.length; i++) {
            obj[data[i].candidate] = data[i].votes;
            candidatesList.push(data[i].candidate);
        }
        return obj;
    }
    function parseCandidateName(candidate) {
        candidate = candidate.toLowerCase();
        candidate = candidate[0].toUpperCase() + candidate.substring(1,candidate.length);
        return candidate;
    }
    $scope.voteForAll();
});
