var app = angular.module('Registration', ['ui.bootstrap']).directive('uiValidateEquals', function () {

    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {

            function validateEqual(myValue, otherValue) {
                if (myValue === otherValue) {
                    ctrl.$setValidity('equal', true);
                    return myValue;
                } else {
                    ctrl.$setValidity('equal', false);
                    return undefined;
                }
            }

            scope.$watch(attrs.uiValidateEquals, function (otherModelValue) {
                validateEqual(ctrl.$viewValue, otherModelValue);
            });

            ctrl.$parsers.unshift(function (viewValue) {
                return validateEqual(viewValue, scope.$eval(attrs.uiValidateEquals));
            });

            ctrl.$formatters.unshift(function (modelValue) {
                return validateEqual(modelValue, scope.$eval(attrs.uiValidateEquals));
            });
        }
    };
});
app.controller('stageController', function ($scope, $http, $modal, $location) {
    //alert(JSON.stringify($location.port()));
    $scope.StateDisable = '0';
    $scope.chatList = '../Example/Chatdiv.html';
    $http.get('http://192.168.10.145:2525/api/RegisterDropDown')
       .success(function (data) {
           $scope.Countries = data[0];
           $scope.States = data[1];
       })
       .error(function (data) {
           alert('error');
       });
    $scope.countryChanged = function (CID) {
        $scope.StateDisable = CID;
    };
    $scope.Reset = function () {
        $scope.Register = null;
        $scope.StateDisable = '0';
        $scope.myForm.RegConfirmPwd.$error.equal = false;
    }
    $scope.submitForm = function () {
        alert(JSON.stringify($scope.Register));
        $http.post('http://192.168.10.145:2525/api/Register', $scope.Register)
           .success(function (data) {
               var Result = data;
               alert(Result);
               if (Result == "1") {
                   alert('You have Registered Successfully ');
                   $scope.open();
               }
               else if (Result == "2") {
                   alert('This Mobile no is already in use please click forgot password link');
                   $scope.Reset();
               }
               else {
                   alert('Error Registration');
               }
           })
           .error(function (data) {
               alert('error');
           });
    }
    $scope.open = function () {
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            resolve: {
                items: function () {
                    return $scope.Register;
                }
            }
        });
    };
});

app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, $http, items) {
    var MobileNO = items.MobileNumber;
    $scope.ok = function (code) {
        alert(code);
        $scope.Verify = { "MobileNumber": MobileNO, "MobileVerficationCode": code };
        $http.post('http://192.168.10.145:2525/api/MobileVerification', $scope.Verify)
           .success(function (data) {
               var Result = data;
               if (Result == "1") {
                   alert('Your Mobile Number is verfied and enjoy our services');
                   $modalInstance.close();
               }
               else if (Result == "2") {
                   alert('verfication code incorrect');
               }
               else {
                   alert('Error Registration');
                   $modalInstance.close();
               }
           })
           .error(function (data) {
               alert('error');
           });


    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});