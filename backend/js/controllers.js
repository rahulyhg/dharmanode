var adminURL = "http://wohlig.io:81/";
var mockURL = adminURL + "callApi/";
var search = '';

angular.module('phonecatControllers', ['templateservicemod', 'navigationservice', 'ngSanitize', 'ngMaterial', 'ngMdIcons', 'ui.sortable', 'angular-clipboard', 'imageupload', 'ui.bootstrap', 'ui.tinymce', 'textAngular'])

    .controller('LoginCtrl', function ($scope, TemplateService, NavigationService, $timeout, $state) {
        $scope.menutitle = NavigationService.makeactive("Login");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.successmsg = "";

        $scope.user = '';
        $scope.submitLogin = function (user) {
            NavigationService.submitLogin(user, function (data) {
                console.log(data);
                if (data.value === true) {
                    $state.go("page", {
                        jsonName: "viewMovie"
                    });
                    $.jStorage.set("user", data);
                } else if (data.value === false) {
                    $scope.successmsg = "Email or Password is wrong";
                }
            }, function () {
                console.log("Fail");
            });
        };
    })

    .controller('UsersCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("users");
        $scope.menutitle = NavigationService.makeactive("Users");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.field = {};
        $scope.onimageupload = function (data) {
            console.log(data);
        };
    })

    .controller('jsonViewCtrl', function ($scope, $location, TemplateService, NavigationService, $timeout, $stateParams, $http, $state, $filter, $mdDialog) {
        $scope.back = function () {
            window.history.back();
        };
        $scope.totalItems = 64;
        $scope.currentPage = 4;

        $scope.tinymceOptions = {
            plugins: 'link image code',
            toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
        };

        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.pageChanged = function () {
            $log.log('Page changed to: ' + $scope.currentPage);
        };

        $scope.maxSize = 5;
        $scope.bigTotalItems = 175;
        $scope.bigCurrentPage = 1;
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("users");
        $scope.menutitle = NavigationService.makeactive("Users");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        var jsonArr = $stateParams.jsonName.split("¢");
        var jsonName = jsonArr[0];
        var urlParams = {};
        $scope.dropdown = {};
        $scope.img = '';
        $scope.emptyimg = '';
        $scope.abc = {};
        $scope.abc.tag = [];
        $scope.dropdownvalues = [];
        $scope.sidemenuVal = $stateParams;
        var jsonParam1 = jsonArr[1];
        var jsonParam2 = jsonArr[2];
        var jsonParam3 = jsonArr[3];
        var jsonParam4 = jsonArr[4];
        var jsonParam5 = jsonArr[5];
        var jsonParam6 = jsonArr[6];
        var jsonParam7 = jsonArr[7];
        var jsonParam8 = jsonArr[8];
        var jsonParam9 = jsonArr[9];
        // console.log(jsonArr);

        var urlid1 = ($location.absUrl().split('%C2%A2')[1]);
        if (urlid1) {
            urlid1 = ($location.absUrl().split('%C2%A2')[1]).split("/")[0];
        }
        var urlid2 = $location.absUrl().split('%C2%A2')[2];
        if (urlid2) {
            urlid2 = ($location.absUrl().split('%C2%A2')[2]).split("/")[0];
        }

        $scope.removeImage = function (page, image, field) {
            console.log($scope.json.editData[image], image);
            $scope.json.editData[image] = "";
        };

        $scope.confirm = function (title, content, api, data) {
            var confirm = $mdDialog.confirm()
                .title(title)
                .textContent(content)
                .ok('Confirm')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {
                $http.post(api, data).success(function (data) {
                    $state.reload();
                    showToast("Deleted Successfully");
                }, function () {
                    showToast("Error Deleting");
                });
            }, function () {

            });
        };
        $scope.search = '';
        $scope.searchClick = function (search) {
            $scope.search = search;
            console.log($scope.search);
            search = $scope.search;
            $scope.getMoreResults(undefined, $scope.search);
        };
        $http.get("./pageJson/" + jsonName + ".json").success(function (data) {
            _.each(data.urlFields, function (n, key) {
                urlParams[n] = jsonArr[key + 1];
            });
            $scope.json = data;
            if ($scope.json.sidemenu && $scope.json.sidemenu.length > 0) {
                $scope.sidemenuThere = true;
            }
            var idForCreate = $location.absUrl().split('%C2%A2')[1];

            $scope.idForCreate = idForCreate;
            if (idForCreate) {
                $scope.goToCreatePage = function () {
                    $location.url("/page/" + $scope.json.createButtonUrl + idForCreate);
                };

            }
            if (data.pageType == "create") {
                $scope.goToCancelPageCreate = function () {
                    $location.url("/page/" + $scope.json.action[1].url + idForCreate);
                };
                _.each($scope.json.fields, function (n) {
                    if (n.type == "select") {
                        n.model = "";
                        if (n.name == "Status") {
                            n.model = true;
                        }
                    } else if (n.type == "selectFromTable") {
                        n.model = "";
                    }
                });
                // get select fields dropdown
                _.each($scope.json.fields, function (n) {
                    if (n.type == "selectFromTable") {
                        NavigationService.getDropDown(n.url, function (data) {
                            console.log(data);
                            n.dropdownvalues = [];
                            if (data) {
                                for (var i = 0; i < data.data.length; i++) {
                                    var dropdown = {};
                                    dropdown._id = data.data[i]._id;
                                    if (!n.dropDownName) {
                                        dropdown.name = data.data[i].name;
                                    } else {
                                        dropdown.name = data.data[i][n.dropDownName];
                                    }
                                    n.dropdownvalues.push(dropdown);
                                }
                            }
                        }, function () {
                            console.log("Fail");
                        });
                    }
                });
            } else if (data.pageType == "edit" || data.pageType == "tableview") {

                console.log(urlParams);
                NavigationService.findOneProject($scope.json.preApi.url, urlParams, function (data) {
                    console.log(data);
                    $scope.json.editData = data.data;
                    console.log($scope.json.editData);
                    _.each($scope.json.fields, function (n) {
                        if (n.type == "table") {
                            $scope.subTableData = $scope.json.editData[n.model];
                        }
                        if (n.type == "time" || n.type == "date") {
                            $scope.json.editData[n.model] = new Date($scope.json.editData[n.model]);
                        }

                    });
                }, function () {
                    console.log("Fail");
                });

                // get select fields dropdown
                _.each($scope.json.fields, function (n) {
                    if (n.type == "selectFromTable") {
                        NavigationService.getDropDown(n.url, function (data) {
                            console.log(data);
                            n.dropdownvalues = [];
                            if (data) {
                                for (var i = 0; i < data.data.length; i++) {
                                    var dropdown = {};
                                    dropdown._id = data.data[i]._id;
                                    if (!n.dropDownName) {
                                        dropdown.name = data.data[i].name;
                                    } else {
                                        dropdown.name = data.data[i][n.dropDownName];
                                    }
                                    n.dropdownvalues.push(dropdown);
                                }
                            }
                        }, function () {
                            console.log("Fail");
                        });
                    }
                });

            } else if (data.pageType == "view") {


                // call api for view data
                $scope.apiName = $scope.json.apiCall.url;

                var pageno = 1;
                console.log($stateParams.no);
                if ($stateParams.no) {
                    pageno = parseInt($stateParams.no);
                }
                if ($stateParams.search) {
                    $scope.search = $stateParams.search;
                    console.log($scope.search);
                }
                $scope.pagination = {
                    "search": $scope.search,
                    "pagenumber": pageno,
                    "pagesize": 10
                };
                console.log($scope.pagination);
                // SIDE MENU DATA

                $scope.pagination1 = {};
                if (urlid1) {
                    console.log('urlid1', urlid1);
                    if ($scope.json.sendIdWithCreate) {
                        $scope.json.createButtonState = $scope.json.createButtonState.split("'" + "})").join("¢" + urlid1 + "'" + "})");
                        // $scope.json.createButtonState = $scope.json.createButtonState.split("%25C2%").join("%C2%");
                        // $scope.json.createButtonState = $scope.json.createButtonState.split("%25A2").join("%A2");
                    }
                    console.log($scope.json.createButtonState);
                    $scope.api1 = $scope.json.sidemenu[1].callFindOne;
                    if ($scope.json.sidemenu[1].sendParam && $scope.json.sidemenu[1].sendParam !== '') {
                        $scope.pagination1._id = urlid1;
                    } else {
                        console.log("ELSE");
                        $scope.pagination._id = urlid1;
                    }
                }
                // call api for view data
                $scope.apiName = $scope.json.apiCall.url;
                $scope.pageInfo = {
                    totalitems: 5000
                };
                $scope.getMoreResults = function (value, search) {
                    $scope.search = search;
                    $scope.value = value;
                    if (value) {
                        console.log($scope.search);
                        if ($scope.search === undefined) {
                            $scope.search = $stateParams.search;
                            console.log($scope.search);
                        }
                        $state.go("pageno", {
                            no: $scope.pagination.pagenumber,
                            jsonName: $stateParams.jsonName,
                            search: $scope.search
                        });
                    } else {
                        if ($scope.search) {
                            $scope.pagination.search = $scope.search;
                        } else if ($scope.pagination.search) {
                            $scope.pagination.search = $scope.pagination.search;
                        } else {
                            $scope.pagination.search = '';
                        }
                        console.log($scope.pagination);
                        NavigationService.findProjects($scope.apiName, $scope.pagination, function (findData) {
                            console.log(findData);
                            if (findData.value !== false) {
                                if (findData.data && findData.data.data && findData.data.data.length > 0) {
                                    $scope.pageInfo.lastpage = findData.data.totalpages;
                                    $scope.pageInfo.pagenumber = findData.data.pagenumber;
                                    $scope.pageInfo.totalitems = $scope.pagination.pagesize * findData.data.totalpages;
                                    $scope.json.tableData = findData.data.data;
                                } else {
                                    $scope.json.tableData = [];
                                    $scope.pageInfo.totalitems = 0;
                                }
                            } else {
                                $scope.json.tableData = [];
                                $scope.pageInfo.totalitems = 0;
                            }
                            console.log($scope.pagination);
                        }, function () {
                            console.log("Fail");
                        });
                    }

                };
                $scope.getMoreResults();

                //SEARCH DROP dropDownName

                // get select fields dropdown
                if ($scope.json.apiCallForSearch) {
                    NavigationService.getDropDown($scope.json.apiCallForSearch.url, function (data) {

                        dropdownvalues = [];
                        if (data) {
                            for (var i = 0; i < data.data.length; i++) {
                                var dropdown = {};
                                dropdown._id = data.data[i]._id;
                                dropdown.name = data.data[i].name;
                                dropdownvalues.push(dropdown);
                            }
                        }
                        $scope.dropdownvalues = dropdownvalues;
                        console.log(dropdownvalues);
                    }, function () {
                        console.log("Fail");
                    });
                }


                $scope.exportSubscribe = function (data) {
                    window.open("http://dharma-production.com" + '/api/Subscribe/generateExcel', '_newtab');
                    window.close();
                };

                $scope.exportForm = function (data) {
                    // window.open("http://localhost:1337" + '/api/Form/generateExcel', '_newtab');
                    window.open("http://dharma-production.com" + '/api/Form/generateExcel', '_newtab');
                    window.close();
                };


                $scope.getAwardByMovie = function (movieid) {
                    //
                    $scope.pagination._id = movieid;
                    $scope.apiName = $scope.json.apiCall.url;
                    $scope.pageInfo = {
                        totalitems: 5000
                    };
                    NavigationService.findProjects($scope.apiName, $scope.pagination, function (findData) {
                        console.log(findData);
                        if (findData.value !== false) {
                            if (findData.data && findData.data.data && findData.data.data.length > 0) {
                                $scope.pageInfo.lastpage = findData.data.totalpages;
                                $scope.pageInfo.pagenumber = findData.data.pagenumber;
                                $scope.pageInfo.totalitems = $scope.pagination.pagesize * findData.data.totalpages;
                                $scope.json.tableData = findData.data.data;
                            } else {
                                $scope.json.tableData = [];
                                $scope.pageInfo.totalitems = 0;
                            }
                        } else {
                            $scope.json.tableData = [];
                            $scope.pageInfo.totalitems = 0;
                        }
                        console.log($scope.pagination);
                    }, function () {
                        console.log("Fail");
                    });

                };
            }
            $scope.template = TemplateService.jsonType(data.pageType);
        });

        // ACTION
        $scope.performAction = function (action, result) {
            console.log(action, result);
            console.log("in pa");
            var pageURL = "";
            if (action.type == "onlyView") {
                console.log("onlyView");
                if (action.fieldsToSend) {
                    _.each(action.fieldsToSend, function (n) {
                        pageURL += $filter("getValue")(result, n);
                    });
                }
                console.log(pageURL);
                $state.go("onlyview", {
                    id: pageURL
                });
            }
            // FOR EDIT
            if (action.action == 'redirect') {
                console.log("redirect");
                pageURL = action.jsonPage;
                if (action.fieldsToSend) {
                    _.each(action.fieldsToSend, function (n) {
                        pageURL += "¢" + $filter("getValue")(result, n);
                    });
                }
                $state.go("page", {
                    jsonName: pageURL
                });
            } else if (action.action == 'apiCallConfirm') {
                pageURL = adminurl + action.api;
                var data = {};
                if (action.fieldsToSend) {
                    _.each(action.fieldsToSend, function (n) {
                        data[n.name] = $filter("getValue")(result, n.value);
                    });
                }
                $scope.confirm(action.title, action.content, pageURL, data);
            } else if (action.action == 'sidemenuRedirect') {
                pageURL = action.jsonPage;
                if (action.fieldsToSend) {
                    _.each(action.fieldsToSend, function (n) {
                        pageURL += "¢" + jsonArr[n];
                    });
                }
                $state.go("page", {
                    jsonName: pageURL
                });
            } else if (action.action === 'changeActive') {
                $scope.defaultActive = action.active;
            }
        };

        $scope.makeReadyForApi = function () {
            console.log($scope.formData);

            var data = {};
            if ($scope.json.pageType !== 'edit' && $scope.json.pageType !== 'tableview') {
                // CONVERT MODEL NAMES SAME AS FIELD NAMES
                _.each($scope.json.fields, function (n) {
                    console.log(n);
                    data[n.tableRef] = n.model;
                });
                $scope.formData = data;
                if (jsonArr[1]) {
                    console.log(jsonArr[1]);
                    console.log($scope.json.urlFields[0]);
                    $scope.formData[$scope.json.urlFields[0]] = jsonArr[1];
                }
            } else {
                $scope.formData = $scope.json.editData;
                console.log($scope.formData);
            }

            $scope.apiName = $scope.json.apiCall.url;

            console.log($scope.formData);

            // CALL GENERAL API
            NavigationService.saveApi($scope.formData, $scope.apiName, function (data) {
                window.history.back();
            }, function () {
                // showToast("Error saving the Project");
                console.log("Fail");
            });


        };

        $scope.saveWithTag = function (tags) {
            console.log($scope.formData);
            console.log(tags);
        };

        $scope.changeit = function (image) {
            console.log(image);
        };
    })

    .controller('ProjectsCtrl', function ($scope, $mdDialog, $mdToast, TemplateService, NavigationService, $timeout, clipboard) {

        $scope.isSearch = true;
        $scope.searchForm = {
            name: ""
        };
        $scope.mockURL = mockURL;

        $scope.makeSearch = function (val) {
            $scope.searchForm.name = val;
        };

        function showToast(text) {
            $mdToast.show(
                $mdToast.simple()
                .textContent(text)
                .position("bottom left")
                .hideDelay(3000)
            );
        }

        //Used to name the .html file
        $scope.template = TemplateService.changecontent("projects");
        $scope.menutitle = NavigationService.makeactive("Projects");


        $scope.copyMockUrl = function (project) {
            clipboard.copyText(mockURL + project.alias);
        };
        $scope.copyLiveUrl = function (project) {
            clipboard.copyText(project.url);
        };

        function successCallback(data, status) {
            if (status == 200) {
                $scope.projects = data.data;
                if (_.isEmpty(data.data)) {
                    $scope.createProject();
                }
            } else {
                errorCallback(status);
            }
        }

        $scope.saveProject = function (project) {
            NavigationService.saveProject(project, function (data) {
                project._id = data.data._id;
                showToast("Project Saved Successfully");
            }, function () {
                showToast("Error saving the Project");
            });
        };
        $scope.deleteProject = function (project) {
            var confirm = $mdDialog.confirm()
                .title('Would you like to delete your Project?')
                .textContent('The data for the Project will also be deleted')
                .ok('Confirm')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {
                NavigationService.deleteProject(project, function (data) {
                    _.remove($scope.projects, function (n) {
                        return n._id == project._id;
                    });
                    showToast("Project Deleted Successfully");
                }, function () {
                    showToast("Error Deleting Project");
                });

            }, function () {

            });

        };

        $scope.expandProject = function (project) {
            if (!project.expand) {
                _.each($scope.projects, function (n) {
                    n.expand = false;
                });
            }
            project.expand = !project.expand;
        };

        function errorCallback(err) {}

        $scope.createProject = function () {
            $scope.projects.push({
                expand: true,
                name: "",
                alias: "",
                url: ""
            });
        };
        $scope.hide = 'hideme';
        NavigationService.findProjects({}, successCallback, errorCallback);
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
    })

    .controller('APICtrl', function ($scope, $mdDialog, $mdToast, TemplateService, NavigationService, $timeout, $stateParams) {

        var isSortable = false;
        $scope.hideme = 'hide';
        $scope.isSearch = true;
        $scope.searchForm = {
            name: ""
        };

        $scope.makeSearch = function (val) {
            $scope.searchForm.name = val;
        };

        function showToast(text) {
            $mdToast.show(
                $mdToast.simple()
                .textContent(text)
                .position("bottom left")
                .hideDelay(3000)
            );
        }

        $scope.sortableOptions = {
            update: function (e, ui) {

                setTimeout(function () {
                    var newOrder = _.cloneDeep($scope.apis);
                    newOrder = _.pluck($scope.apis, "_id");
                    var newProject = _.cloneDeep($scope.project);
                    newProject.Api = newOrder;
                    NavigationService.saveProject(newProject, function () {
                        showToast("API Ordered");
                    }, function () {
                        showToast("Error Ordering API");
                    });
                }, 100);

            },
            axis: 'y',
            disabled: isSortable
        };

        var data = {
            "_id": $stateParams.id
        };

        function successCallback(data, status) {
            if (status == 200) {
                $scope.menutitle = data.data.name + " - API";
                TemplateService.title = $scope.menutitle;
                $scope.project = data.data;

                $scope.apis = data.data.Api;
                _.each($scope.apis, function (n) {
                    n.project = $scope.project._id;
                });
                if (_.isEmpty(data.data.Api)) {
                    $scope.createApi();
                }

            } else {
                errorCallback(status);
            }
        }

        function errorCallback(err) {}

        NavigationService.findOneProject(data, successCallback, errorCallback);

        $scope.expandApi = function (api) {
            if (!api.expand) {
                $scope.sortableOptions.disabled = true;
                _.each($scope.apis, function (n) {
                    n.expand = false;
                });

            } else {
                $scope.sortableOptions.disabled = false;
            }
            api.expand = !api.expand;
        };

        $scope.createApi = function () {
            _.each($scope.apis, function (n) {
                n.expand = false;
            });
            $scope.apis.push({
                name: "",
                Response: {
                    request: "",
                    response: ""
                },
                project: $scope.project._id,
                expand: true
            });
        };
        $scope.copyApi = function (api, index) {
            var newApi = _.cloneDeep(api);
            delete newApi._id;
            delete newApi.$$hashKey;
            $scope.apis.splice(index + 1, 0, newApi);
            $scope.expandApi(newApi);
        };
        $scope.saveApi = function (api) {
            NavigationService.saveApi(api, function (data) {
                api._id = data.data._id;
                showToast("API saved Successfully");
            }, function (err) {
                showToast("Error saving API");
            });
        };
        $scope.deleteApi = function (api) {

            var confirm = $mdDialog.confirm()
                .title('Would you like to delete the API?')
                .textContent('The data for the API will also be deleted')
                .ok('Confirm')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {

                NavigationService.deleteApi(api, function (data) {
                    _.remove($scope.apis, function (n) {
                        return api._id == n._id;
                    });
                    showToast("API Deleted Successfully");
                }, function (err) {
                    showToast("Error Deleting API");
                });

            }, function () {

            });



        };

        //Used to name the .html file
        $scope.template = TemplateService.changecontent("api");
        $scope.menutitle = NavigationService.makeactive("API");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
    })

    .controller('onlyViewPageCtrl', function ($scope, TemplateService, NavigationService, $stateParams, $http) {
        $scope.template = TemplateService.changecontent("onlyView");
        $scope.menutitle = NavigationService.makeactive("Users");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        console.log($stateParams.id);
        $http.get("./pageJson/onlyView.json").success(function (data) {
            console.log(data);
            $scope.json = data;
            urlParams = {
                "_id": $stateParams.id
            };
            NavigationService.findOneProject($scope.json.preApi.url, urlParams, function (data) {

                $scope.json.editData = data.data;
                console.log($scope.json.editData);
                $scope.armyName = $scope.json.editData.user.armyName;
                console.log($scope.armyName);
            }, function () {
                console.log("Fail");
            });
        });
        // $scope.viewEditPage = function(pageName) {
        //     console.log("jhi");
        // };
    })

    .controller('HeaderCtrl', function ($scope, TemplateService, NavigationService, $state) {
        $scope.logOut = function () {
            NavigationService.logout(function (data) {
                console.log(data);
                if (data.value === true) {
                    $.jStorage.flush();
                    $state.go("login");

                } else if (data.value === false) {
                    $window.location.reload();
                }
            }, function () {
                console.log("Fail");
            });
        };
        $scope.template = TemplateService;
        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $(window).scrollTop(0);
        });
        if ($.jStorage.get("user") === null) {
            $state.go("login");
        }

    });
