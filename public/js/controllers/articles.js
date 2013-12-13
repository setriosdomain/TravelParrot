angular.module('mean.articles').controller('ArticlesController', ['$scope', '$upload', '$routeParams', '$location' ,'Global','Articles', function ($scope, $upload, $routeParams, $location, Global, Articles) {
    $scope.global = Global;

    $scope.create = function() {
        if(typeof $scope.file_url == 'undefined'){ $scope.file_url = '';}
        var article = new Articles({
            title: this.title,
            file_url:  $scope.file_url,
            content: this.content

        });
        article.$save(function(response) {
            $location.path("articles/" + response._id);
        });

        this.title = "";
        this.content = "";
    };

    $scope.articlesHome = function () {
        $location.url('/articles/');
    };
    $scope.remove = function() {
        var article = $scope.article;

        //http://docs.angularjs.org/api/ngResource.$resource
        //        A resource "class" object with methods for the default set of resource actions optionally extended with custom actions. The default set contains these actions:
        //
        //        { 'get':    {method:'GET'},
        //            'save':   {method:'POST'},
        //            'query':  {method:'GET', isArray:true},
        //            'remove': {method:'DELETE'},
        //            'delete': {method:'DELETE'} };
        //calling remove will make a DEL request which will intercepted
        //by app.del('/articles/:articleId', auth.requiresLogin, auth.article.hasAuthorization, articles.destroy);
        //in the routes configuration of the server. This will call the destroy function in the controller if authorized
        //and the destroy function will invoke remove method on moongoose model, which will elete the object from the database
        //and if successfull call of callback, which will rediret to articles (which will be intercepter by the server routing again yielding all articles), and intercepter on the client side by angular which will render the right view which will display all articles.
        article.$remove(function(){

            for (var i in $scope.articles) {
                if ($scope.articles[i] == article) {
                    $scope.articles.splice(i, 1);
                }
            }

            $location.path("articles/");
        });



    };

    $scope.update = function() {
        if(typeof $scope.file_url == 'undefined'){ $scope.file_url = '';}
        var article = $scope.article;
        if (!article.updated) {
            article.updated = [];
        }
        article.updated.push(new Date().getTime());
        article.file_url = $scope.file_url;

        article.$update(function() {
            $location.path('articles/' + article._id);
        });
    };


    $scope.find = function() {
        if(!$routeParams.name){
            Articles.query(function(articles) {
                $scope.articles = articles;
                //pager
                $scope.confPagination.totalItems = $scope.articles.length;
                //pager
            });
        }else{
            $.ajax({
                type: 'POST',
                url: '/queryArticles',
                data: {
                    name: $routeParams.name
                },
                dataType: 'json',
                success: function(articles) {
                    $scope.$apply(function(){
                        $scope.articles = articles;
                        //pager
                        $scope.confPagination.totalItems = $scope.articles.length;
                        //pager
                    });
                }
            });
        }
    };

    $scope.findOne = function() {
        Articles.get({
            articleId: $routeParams.articleId
        }, function(article) {
            $scope.article = article;
            $scope.file_url = article.file_url;
        });
    };


    //start => pagination
    $scope.confPagination = {};
    $scope.confPagination.maxSize = 5;
    $scope.confPagination.pageSize = 10;

    $scope.confPagination.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.confPagination.currentPage = 1;
    $scope.confPagination.boundaryLinks = true;
    //end => pagination

    //start file upload
    $scope.onFileSelect = function($files) {
        //$files: an array of files selected, each file has name, size, and type.
        for (var i = 0; i < $files.length; i++) {
            var $file = $files[i];
            $upload.upload({
                url: 'upload',
                file: $file,
                progress: function(e){}
            }).then(function(data, status, headers, config) {
                    // file is uploaded successfully
                    if(!data.data){return;}
                    //console.log('file uploaded: ' + data.data);
                    $scope.file_url = data.data;
                });
        }
    };
    //end file upload
    $scope.clearImage = function(){
        $scope.file_url = '';
    };

    $scope.showImage = function(article){
        if(!article){return false;}
        return article.file_url != '';
    }
}]);