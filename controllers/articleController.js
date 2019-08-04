const express = require("express");
const bodyParser = require('body-parser');
const sanitize = require('mongo-sanitize');
const fileUpload = require('express-fileupload');
const request = require('request');
const readExcel = require('read-excel-file/node');

const globalData = require('./GlobalData');
const Article = require('../models/Article.model');
const UserChat = require('../models/UserChat.model');

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.use(fileUpload({
    limits: { fileSize: 1048576 },
}));

router.get('/view/:articleFor/:articleLang/:page?', globalData.ensureAuthenticated, (req, res) => {
    let articleFor  = sanitize(req.params.articleFor);
    let articleLang  = sanitize(req.params.articleLang);
    if (articleFor == "pre-pregnancy" || articleFor == "pregnancy"|| articleFor == "motherhood"){
        if(articleFor == "pregnancy" && articleLang == "monthly"){
            //redirect to pregnancy(monthly)
        }
        else{
            let page = sanitize(req.params.page) || 1;
            if (isNaN(page) || page<1){
                page = 1;
            }
            Article.paginate(
                { 'article_for': articleFor, 'article_status': 1,'article_lang':articleLang },
                { page: page, limit: 200, sort: { article_order:1,createdDate:1} }, (err, result) => {
                    result.articleFor = articleFor;
                    result.articleLang = articleLang;
                    res.render('article_view',result);
                }
            );
        }
        /* else{
            
            res.redirect('/user/');
        } */
    }
    else{
        res.redirect('/user/');
    }
});

router.get('/add/:articleFor/:articleLang/', globalData.ensureAuthenticated, (req, res) => {
    let articleFor  = sanitize(req.params.articleFor);
    let articleLang  = sanitize(req.params.articleLang);
    if (articleFor == "pre-pregnancy" || articleFor == "pregnancy"|| articleFor == "motherhood"){
        if(articleLang == "En" || articleLang == "Ar"){
            let data = {
                articleFor,
                articleLang,
                flashType: "",
                flashMsg: "",
                title: "",
                order: null,
                url: ""
            };
            res.render('article_add', data);
        }
        else{
            res.redirect('/user/');
        }
    }
    else{
        res.redirect('/user/');
    }
});

router.post('/add/:articleFor/:articleLang/', globalData.ensureAuthenticated, (req, res) => {
    let articleFor = sanitize(req.params.articleFor);
    let articleLang = sanitize(req.params.articleLang);
    if (articleFor == "pre-pregnancy" || articleFor == "pregnancy" || articleFor == "motherhood") {
        if (articleLang == "En" || articleLang == "Ar") {
            let data = {
                articleFor,
                articleLang,
                flashType: "",
                flashMsg: "",
                title: "",
                order: null,
                url: ""
            };
            if (req.body.title != undefined && req.body.url != undefined){
                var title = req.body.title.trim();
                data.title = sanitize(title);
                var url = req.body.url.trim();
                data.url = sanitize(url);
                var order = req.body.order.trim();
                data.order = sanitize(order);

                if (data.title == ""){
                    data.flashType = "warning";
                    data.flashMsg = "Please enter article's title.";
                    res.render('article_add', data);
                }
                else if (data.url == ""){
                    data.flashType = "warning";
                    data.flashMsg = "Please enter a valid URL.";
                    res.render('article_add', data);
                }else if (Object.keys(req.files).length == 0) {
                    data.flashType = "warning";
                    data.flashMsg = "Thumbnail not found.";
                    res.render('article_add', data);
                }
                else{
                    let thumbnailImg = req.files.thumbnail;
                    //console.log(thumbnailImg);
                    const validImageTypes = ['image/jpeg','image/jpg', 'image/png'];
                    if (!validImageTypes.includes(thumbnailImg['mimetype'])) {
                        data.flashType = "warning";
                        data.flashMsg = "Thumbnail not found.";
                        res.render('article_add', data);
                        return;
                    }
                    
                    let pic_url = 'thumbnail/' + Date.now() + '_' + thumbnailImg.name.replace(/\s/g,'');
                    thumbnailImg.mv('public/' + pic_url, function(err) {
                        if (!err){
                            console.log('https://danone-apta-advice.herokuapp.com/' + pic_url);
                            var options = {
                                url: 'https://www.alivenow.in/chatbots/aptaAdvice/pullImage.php',
                                form: {
                                    path:'https://danone-apta-advice.herokuapp.com/' + pic_url,
                                }
                            }
                            request.post(options, function(error, response, body) {
                                if(!error){
                                    console.log(body);
                                    var b = JSON.parse(body);
                                    if(b.url != ''){
                                        newArticle = Article();
                                        newArticle.article_for = articleFor;
                                        newArticle.article_lang = articleLang;
                                        newArticle.article_title = data.title;
                                        newArticle.article_type = "carousel";
                                        newArticle.img_url = b.url;
                                        newArticle.article_order = data.order;
                                        newArticle.article_url = data.url;
                                        newArticle.user_id = req.user._id;
                                        newArticle.save((err, user) => {
                                            if (!err) {
                                                data.flashType = "success";
                                                data.flashMsg = "Article added.";
                                                data.title = "";
                                                data.url = "";
                                            }
                                            else{
                                                console.log(err);
                                                data.flashType = "warning";
                                                data.flashMsg = "Please Try again. (1)";
                                            }
                                            res.render('article_add', data);
                                        });
                                    }
                                    else{
                                        data.flashType = "warning";
                                        data.flashMsg = "Please Try again. (2)";
                                        res.render('article_add', data);
                                    }
                                }
                                else{
                                    //console.log(error);
                                    data.flashType = "warning";
                                    data.flashMsg = "Thumbnail not uploaded.";
                                    res.render('article_add', data);
                                }
                            });
                        }
                        else{
                            console.log(err);
                            data.flashType = "warning";
                            data.flashMsg = "Thumbnail not uploaded..";
                            res.render('article_add', data);
                        }                 
                      });
                }
            }
            else{
                res.render('article_add', data);
            }
        } else {
            res.redirect('/user/');
        }
    } else {
        res.redirect('/user/');
    }
});

router.get('/edit/:articleFor/:articleLang/:id', globalData.ensureAuthenticated, (req, res) => {
    let articleFor  = sanitize(req.params.articleFor);
    let articleLang  = sanitize(req.params.articleLang);
    let id  = sanitize(req.params.id);
    if (articleFor == "pre-pregnancy" || articleFor == "pregnancy"|| articleFor == "motherhood"){
        if(articleLang == "En" || articleLang == "Ar"){
            Article.findOne({ _id: id }).exec((err, article) => {
                if(!err){
                    if(article == null){
                        res.redirect('/article/view/'+articleFor+'/'+articleLang);
                    }
                    else{
                        let data = {
                            articleFor,
                            articleLang,
                            flashType: "",
                            flashMsg: "",
                            article
                        };
                        res.render('article_edit', data);
                    }

                }else{
                    res.redirect('/article/view/'+articleFor+'/'+articleLang);
                }
            });
        }
        else{
            res.redirect('/user/');
        }
    }
    else{
        res.redirect('/user/');
    }
    
});

router.post('/edit/:articleFor/:articleLang/:id', globalData.ensureAuthenticated, (req, res) => { 
    let articleFor  = sanitize(req.params.articleFor);
    let articleLang  = sanitize(req.params.articleLang);
    let id  = sanitize(req.params.id);
    if (articleFor == "pre-pregnancy" || articleFor == "pregnancy"|| articleFor == "motherhood"){
        if(articleLang == "En" || articleLang == "Ar"){
            Article.findOne({ _id: id }).exec((err, article) => {
                if(!err){
                    if(article == null){
                        res.redirect('/article/view/'+articleFor+'/'+articleLang);
                    }
                    else{
                        let data = {
                            articleFor,
                            articleLang,
                            flashType: "warning",
                            flashMsg: "Please Try again.",
                            article
                        };

                        if (req.body.title != undefined && req.body.order != undefined && req.body.url != undefined){
                            var title = req.body.title.trim();
                            data.title = sanitize(title);

                            var order = req.body.order.trim();
                            data.order = sanitize(order);

                            var url = req.body.url.trim();
                            data.url = sanitize(url);

                            if (data.title == ""){
                                data.flashType = "warning";
                                data.flashMsg = "Please enter article's title.";
                                res.render('article_edit', data);
                            }
                            if (!isNaN(data.title)){
                                data.flashType = "warning";
                                data.flashMsg = "Please enter a valid Order.";
                                res.render('article_edit', data);
                            }
                            else if (data.url == ""){
                                data.flashType = "warning";
                                data.flashMsg = "Please enter a valid URL.";
                                res.render('article_edit', data);
                            }
                            else if (Object.keys(req.files).length == 0) {
                                Article.findOneAndUpdate(
                                    {_id:id},
                                    {$set: {"article_title":data.title,"article_url":data.url,"article_order":data.order}},
                                    {upsert:false},
                                    function(err,art){
                                        article.article_title = data.title;
                                        article.article_url = data.url;
                                        article.article_order = data.order;

                                        if(!err){
                                            data.flashType = "success";
                                            data.flashMsg = "Article updated.";
                                            res.render('article_edit', data);
                                        }
                                        else{
                                            res.render('article_edit', data);
                                        }
                                });
                            }
                            else{
                                let thumbnailImg = req.files.thumbnail;
                                //console.log(thumbnailImg);
                                const validImageTypes = ['image/jpeg','image/jpg', 'image/png'];
                                if (!validImageTypes.includes(thumbnailImg['mimetype'])) {
                                    data.flashType = "warning";
                                    data.flashMsg = "Thumbnail not found.";
                                    res.render('article_edit', data);
                                    return;
                                }

                                let pic_url = 'thumbnail/' + Date.now() + '_' + thumbnailImg.name.replace(/\s/g,'');
                                thumbnailImg.mv('public/' + pic_url, function(err) {
                                    if (!err){
                                        console.log('https://danone-apta-advice.herokuapp.com/' + pic_url);
                                        var options = {
                                            url: 'https://www.alivenow.in/chatbots/aptaAdvice/pullImage.php',
                                            form: {
                                                path:'https://danone-apta-advice.herokuapp.com/' + pic_url,
                                            }
                                        }
                                        request.post(options, function(error, response, body) {
                                            if(!error){
                                                console.log(body);
                                                var b = JSON.parse(body);
                                                if(b.url != ''){
                                                    Article.findOneAndUpdate(
                                                        {_id:id},
                                                        {$set: {"article_title":data.title,"article_url":data.url,"article_order":data.order,"img_url":b.url}},
                                                        {upsert:false},
                                                        function(err,art){
                                                            article.article_title = data.title;
                                                            article.article_url = data.url;
                                                            article.article_order = data.order;

                                                            if(!err){
                                                                data.flashType = "success";
                                                                data.flashMsg = "Article updated.";
                                                                res.render('article_edit', data);
                                                            }
                                                            else{
                                                                data.flashType = "warning";
                                                                data.flashMsg = "Please Try again. (1)";
                                                                res.render('article_edit', data);
                                                            }
                                                    });
                                                }
                                                else{
                                                    data.flashType = "warning";
                                                    data.flashMsg = "Please Try again. (2)";
                                                    res.render('article_edit', data);
                                                }
                                            }
                                            else{
                                                data.flashType = "warning";
                                                data.flashMsg = "Thumbnail not uploaded.";
                                                res.render('article_edit', data);
                                            }
                                        });
                                    }
                                    else{
                                        console.log(err);
                                        data.flashType = "warning";
                                        data.flashMsg = "Thumbnail not uploaded..";
                                        res.render('article_edit', data);
                                    }                 
                                  });
                            }
                        }
                    }

                }else{
                    res.redirect('/article/view/'+articleFor+'/'+articleLang);
                }
            });
        }
        else{
            res.redirect('/user/');
        }
    }
    else{
        res.redirect('/user/');
    }
    
});

router.get('/delete/:articleFor/:articleFrequency/:id', globalData.ensureAuthenticated, (req, res) => {

});

// File path
/*readExcel('mArticle.xlsx').then((rows) => {
    //console.log(rows[0][0]);
    Article.find({"article_for": "motherhood","article_lang": "En"}).sort({article_order: 1}). 
    exec(function(err, articles){
        console.log(rows[0][0]);
        console.log(articles[0].article_url);
        for(let i = 0;i<rows.length;i++){
            if(rows[i][0] !=articles[i].article_url){
                console.log("week"+(i+1));
           }
        }
        
    });
})*/

//var inc = Math.floor(article_order/13);

/*Article.find({"article_for": "motherhood","article_status":1}).sort({article_order: 1}). 
    exec(function(err, articles){
        //console.log(articles[1]);
        for(let i = 0;i<articles.length;i++){
            //console.log("\nOld order:"+articles[i].article_order);
            var order = Math.floor(articles[i].article_order/13);
            if(order>0){
               Article.findOneAndUpdate(
                    {_id:articles[i]._id},
                    {$set: {"article_order":articles[i].article_order+order}},
                    {upsert:false},
                    function(err,art){
                        console.log("article order updated:"+articles[i].article_order);
                });
               }
            if(articles[i].article_order==(i+1)){
               console.log("text match:"+articles[i].article_order,i);
               }
            else{
                console.log("not match:"+articles[i].article_order,i);
            }
        }
    console.log("done...");
        
});*/

/*Article.find({"article_for": "motherhood","article_status":1,"article_lang": "En"}).sort({article_order: 1}). 
    exec(function(err, articles){
    //var order=0;
    //console.log(articles.length);
    for(let i = 0;i<articles.length;i++){
        if(articles[i].article_order!=(i+1)){
           console.log(articles[i].article_order);
           }
    }
    console.log("done...");

});*/




 

module.exports = router;