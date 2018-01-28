var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');
var url = 'mongodb://Raghu548:Nandu049099@ds259325.mlab.com:59325/tedtalks';
var ObjectID = require('mongodb').ObjectID;

//

/* GET home page. */

router.get('/',function(req, res, next) {

    mongo.connect(url, function (err, db) {
        return new Promise(function (resolve, reject) {
            if (err) reject(err);

            var array = db.collection('Ted').find({},{images:1, _id:1}).sort({views: -1}).limit(18).toArray();
            //console.log(array);
            db.close();
            resolve(array);
            //--------------------------------------
        }).then(function (arr) {
            //--------------------------------------
            console.log(arr);
            res.render('index', {item: arr});
        });

    });
});
/*

router.get('/', function(req, res, next) {
    var array = db.collection('Ted').find().sort({views: -1}).limit(18);

    res.render('index', {array:array});


});
*/
// the connectons and query

router.get('/test/submit', function (req, res, next) {


    //Get the request
    var text = req.query.id;
    var page = req.query.page;
    var str = "\\b" + text + ".*" ;
    var str1 = "\\b" + text + "\\b.*";
    var skip = 0;
    var max = 10;
    var previous;
    if (!page) {
        page = 2;
    } else {
        skip = (page-1) * max;
        page = (parseInt(page) + 1);
    }

    //Connecting using MongoClient
    mongo.connect(url, function (err, db) {
        return new Promise(function (resolve, reject) {
            if (err) reject(err);
            //--------------------------------------

            var array = db.collection('Ted').find({$or: [{title: {$regex: new RegExp(str, "i")}}, {main_speaker: {$regex: new RegExp(str1, "i")}}]}).limit(max).skip(skip).toArray();


            db.close();
            resolve(array);
            //--------------------------------------
        }).then(function (arr) {
           // console.log(arr);
            //--------------------------------------

          // for no more result
            if (page>2 && arr.length == 0){

                res.render('theResult', { item2: true ,Text: text, pre:true, page:page} );

            }

            // when there is no result
            else if(page==2 && arr.length == 0) {

                res.render('theResult', { item1: arr.length == 0 ,Text: text} );
            }
            // in there is result
            else {
                if (page ==2 && arr.length != 0)
                res.render('theResult', { item: arr ,Text: text, page: page} );

                else
                    res.render('theResult', { item: arr ,Text: text, page: page, previous:true });
            }
            //--------------------------------------
        });
    });

});

router.get('/Document/:id/:text/:page', function(req, res, next)
    {
        var id2 = req.params.id;
        var searchKey = req.params.text;
        var page = req.params.page;
        console.log(page);
        mongo.connect(url, function (err, db) {
            return new Promise(function (resolve, reject) {
                if (err) reject(err);
                //--------------------------------------
                var array = db.collection('Ted').find({_id: new ObjectID( id2)}).limit(10).toArray();
                console.log(array);

                db.close();
                resolve(array);
                //--------------------------------------
            }).then(function (arr) {
                //--------------------------------------
                 page = (parseInt(page) - 1);
                res.render('Document', { item: arr , Text: id2, searchKey:searchKey, page:page} );
                //--------------------------------------
            });
        });
    });




router.get('/Document/:id', function(req, res, next)
{
    var id2 = req.params.id;
    mongo.connect(url, function (err, db) {
        return new Promise(function (resolve, reject) {
            if (err) reject(err);
            //--------------------------------------
            var array = db.collection('Ted').find({_id: new ObjectID( id2)}).limit(10).toArray();
            console.log(array);

            db.close();
            resolve(array);
            //--------------------------------------
        }).then(function (arr) {
            //--------------------------------------
            res.render('Document', { item: arr } );
            //--------------------------------------
        });
    });
});

router.get('/return', function(req, res, next)
    {
        mongo.connect(url, function (err, db) {
            return new Promise(function (resolve, reject) {
                if (err) reject(err);

                var array = db.collection('Ted').find({},{images:1, _id:1}).sort({views: -1}).limit(18).toArray();
                //console.log(array);
                db.close();
                resolve(array);
                //--------------------------------------
            }).then(function (arr) {
                //--------------------------------------
                console.log(arr);
                res.render('index', {item: arr});
            });

        });

    }

);

// Here I have made a router that takes the comment from the user and it will update the field depend on the _id
//attribute that has been inetialize by the mongoDB.
router.post('/add/comment',function(req, res, next) {

    var id2 = req.body.id; // this id has been taken from a hidden input in the Document page.
    var usercomment2 = req.body.usercomment;// this is the comment that the user inialize.


    mongo.connect(url, function (err, db) {
        return new Promise(function (resolve, reject) {
            if (err) reject(err);
            //--------------------------------------
            // this update is using ($addToSet) to make attribute comment an array.
            var array = db.collection('Ted').updateOne({_id: new ObjectID(id2)}, {$addToSet: {comment2: usercomment2}});
            //console.log(array);
            db.close();
            resolve(array);
            //--------------------------------------
        }).then(function (arr) {
            //--------------------------------------
            res.redirect('/Document/'+id2); // after updating the comment attribute, this line will redirect the user
            // to the router that requery.
            //--------------------------------------
        });

    });


});




module.exports = router;


// mohammed
