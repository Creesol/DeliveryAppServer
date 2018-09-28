const express= require('express');
const app= express();
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const url = require('url');
const querystring = require('querystring'); 
const mysql = require('mysql');
const admin = require('firebase-admin');

const http = require('http');
var server = http.createServer(app);

var FCM = require('fcm-push');
var request = require('request');

var serverKey = 'AAAA-0_CP4s:APA91bFSok6aBGChWRY_0MnHUGDt3gAfcK1np6FQnzADcXPX7lGm-mKZyfyaoJHwlzDnzBR7cxE_xYnAD6DGijiV-3cCZrKy3m7b63KzY97uL699WnFuGtuI17pFk6OKWVd-Ox0b8I52';
var fcm = new FCM(serverKey);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var fs = require('fs');

/*
app.listen(PORT, function (err) {
    if (err) {
        console.log("error" + err);
    }
    else {
        console.log("listening");
    }
})*/


var con = mysql.createPool({
    connectionLimit : 10,
    host: 'knockdatabase.cz7pwzetgifa.ap-south-1.rds.amazonaws.com',
    user: 'creesol',
    password: 'creesol.com',
    database: 'mydb', 
    port: 3306,
    debug: true,
    connectTimeout: 30000,
    acquireTimeout: 30000
});
console.log('1');
//server.listen(PORT,'172.31.24.36');
//console.log('Server is running');

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    con.connect(function(err){
    
        if(!err) {
            callback(null, "abc");
            console.log("Database is connected ... nn");    
        } else {
            callback(err);
            console.log("Error connecting database ... nn"); 
            console.log(err);
        }
            con.end();
        });
};
console.log('2');
/*
app.get('/category', function (req, res) {
    
    exports.handler =  (event, context, callback) => {
  //prevent timeout from waiting event loop
  context.callbackWaitsForEmptyEventLoop = false;
  pool.getConnection(function(err, connection) {
    // Use the connection
      var items = "select * from category_detail" ;
    connection.query(items, function (error, results, fields) {
      // And done with the connection.
      connection.release();
      // Handle error after the release.
      if (error) callback(error);
      else callback(null,res.send(results));
    });
  });
};
    
});
*/

console.log('3');
function handle_database(query,req,res) {
    
    con.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }   

        console.log('connected as id ' + connection.threadId);
        
        connection.query(query,function(err,rows){
            connection.release();
            if(!err) {
                res.json(rows);
            }           
        });

        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     
        });
  });
}


app.get('/handle', function(req,res){
    var query = "select * from category_detail";
    handle_database(query, req, res);
});
app.get('/getDeliveryDairy',function(req,res){
    var query="SELECT earliest_delivery FROM mydb.category where cat_name='Dairy'";
    handle_database(query,req,res);
});
app.get('/getDeliveryVegetable',function(req,res){
    var query="SELECT earliest_delivery FROM mydb.category where cat_name='Vegetable'";
    handle_database(query,req,res);
});
app.get('/getDeliveryMeat',function(req,res){
    var query="SELECT earliest_delivery FROM mydb.category where cat_name='Meat'";
    handle_database(query,req,res);
});
app.get('/getDeliveryLaundry',function(req,res){
    var query="SELECT earliest_delivery FROM mydb.category where cat_name='Laundry'";
    handle_database(query,req,res);
});

app.get('/getDairy', function(req,res){
    var query = "select * from category_detail where sub_category_name = 'Dairy'";
    handle_database(query, req, res);
});

app.get('/getBeef', function(req,res){
    var query = "select * from category_detail where sub_category_name = 'Beef' LIMIT 7";
    handle_database(query, req, res);
});

app.get('/getAllBeef', function(req,res){
    var query = "select * from category_detail where sub_category_name = 'Beef' LIMIT 10  OFFSET 7";
    handle_database(query, req, res);
});

app.get('/getMutton', function(req,res){
    var query = "select * from category_detail where sub_category_name = 'Mutton' LIMIT 7";
    handle_database(query, req, res);
});

app.get('/getAllMutton', function(req,res){
    var query = "select * from category_detail where sub_category_name = 'Mutton' LIMIT 10  OFFSET 7";
    handle_database(query, req, res);
});

app.get('/getFrozenMeat', function(req,res){
    var query = "select * from category_detail where sub_category_name = 'FrozenMeat' LIMIT 7";
    handle_database(query, req, res);
});

app.get('/getAllFrozenMeat', function(req,res){
    var query = "select * from category_detail where sub_category_name = 'FrozenMeat' LIMIT 10  OFFSET 7";
    handle_database(query, req, res);
});

app.get('/getFruit', function(req,res){
    var query = "select * from category_detail where sub_category_name = 'Fruit' LIMIT 7";
    handle_database(query, req, res);
});

app.get('/getAllFruit', function(req,res){
    var query = "select * from category_detail where sub_category_name = 'Fruit' LIMIT 10  OFFSET 7";
    handle_database(query, req, res);
});

app.get('/getVegetable', function(req,res){
    var query = "select * from category_detail where sub_category_name = 'Vegetable' LIMIT 7";
    handle_database(query, req, res);
});

app.get('/getAllVegetable', function(req,res){
    var query = "select * from category_detail where sub_category_name = 'Vegetable' LIMIT 10  OFFSET 7";
    handle_database(query, req, res);
});

app.get('/getBasket', function(req,res){
    var query = "select * from category_detail where sub_category_name = 'basket' LIMIT 7";
    handle_database(query, req, res);
});

app.get('/getFrozenVeg', function(req,res){
    var query = "select * from category_detail where sub_category_name = 'FrozenVeg' LIMIT 7";
    handle_database(query, req, res);
});

app.get('/getAllFrozenVeg', function (req, res) {
    var query = "select * from category_detail where sub_category_name = 'FrozenVeg' LIMIT 10  OFFSET 7";
    handle_database(query, req, res);
});

    app.get('/getChicken', function (req, res) {
        var query = "select * from category_detail where sub_category_name = 'Chicken' LIMIT 7";
        handle_database(query, req, res);
    });

    app.get('/getAllChicken', function (req, res) {
        var query = "select * from category_detail where sub_category_name = 'Chicken' LIMIT 10  OFFSET 7";
        handle_database(query, req, res);
    });

    app.get('/getDryClean', function (req, res) {
        var query = "select * from category_detail where sub_category_name = 'Dry Clean' LIMIT 7";
        handle_database(query, req, res);
    });

    app.get('/getAllDryClean', function (req, res) {
        var query = "select * from category_detail where sub_category_name = 'Dry Clean' LIMIT 10  OFFSET 7";
        handle_database(query, req, res);
    });

    app.get('/getDairySlider', function (req, res) {
        var query = "select * from Sliders where slider_category = 'Dairy'";
        handle_database(query, req, res);
    });

    app.get('/getMeatSlider', function (req, res) {
        var query = "select * from Sliders where slider_category = 'Meat'"
        handle_database(query, req, res);
    });

    app.get('/getVegSlider', function (req, res) {
        var query = "select * from Sliders where slider_category = 'Veg'";
        handle_database(query, req, res);
    });


    app.get('/getLaundrySlider', function (req, res) {
        var query = "select * from Sliders where slider_category = 'Laundry'";
        handle_database(query, req, res);
    });

   app.get('/getFrozenFries', function(req,res){
    var query = "select * from category_detail where sub_category_name = 'FrozenFries' LIMIT 7";
    handle_database(query, req, res);
});

app.get('/getAllFrozenFries', function (req, res) {
    var query = "select * from category_detail where sub_category_name = 'FrozenFries' LIMIT 10  OFFSET 7";
    handle_database(query, req, res);
});

app.get('/getFrozenKN', function(req,res){
    var query = "select * from category_detail where sub_category_name = 'FrozenMeatKN' LIMIT 7";
    handle_database(query, req, res);
});

app.get('/getAllFrozenKN', function (req, res) {
    var query = "select * from category_detail where sub_category_name = 'FrozenMeatKN' LIMIT 10  OFFSET 7";
    handle_database(query, req, res);
});

app.get('/getFrozenMenu', function(req,res){
    var query = "select * from category_detail where sub_category_name = 'FrozenMeatmenu' LIMIT 7";
    handle_database(query, req, res);
});

app.get('/getAllFrozenMenu', function (req, res) {
    var query = "select * from category_detail where sub_category_name = 'FrozenMeatmenu' LIMIT 10  OFFSET 7";
    handle_database(query, req, res);
});

app.get('/getFrozenMon', function(req,res){
    var query = "select * from category_detail where sub_category_name = 'FrozenMeatmon' LIMIT 7";
    handle_database(query, req, res);
});

app.get('/getAllFrozenMon', function (req, res) {
    var query = "select * from category_detail where sub_category_name = 'FrozenMeatmon' LIMIT 10  OFFSET 7";
    handle_database(query, req, res);
});

app.get('/getFrozenDawn', function(req,res){
    var query = "select * from category_detail where sub_category_name = 'FrozenMeatda' LIMIT 5";
    handle_database(query, req, res);
});

app.get('/getAllFrozenDawn', function (req, res) {
    var query = "select * from category_detail where sub_category_name = 'FrozenMeatda' LIMIT 10  OFFSET 5";
    handle_database(query, req, res);
});

app.get('/getWash', function(req,res){
    var query = "select * from category_detail where sub_category_name = 'Wash' LIMIT 7";
    handle_database(query, req, res);
});

app.get('/getAllWash', function (req, res) {
    var query = "select * from category_detail where sub_category_name = 'Wash' LIMIT 10  OFFSET 7";
    handle_database(query, req, res);
});

app.get('/getIron', function(req,res){
    var query = "select * from category_detail where sub_category_name = 'Iron' LIMIT 7";
    handle_database(query, req, res);
});

app.get('/getAllIron', function (req, res) {
    var query = "select * from category_detail where sub_category_name = 'Iron' LIMIT 10  OFFSET 7";
    handle_database(query, req, res);
});

app.get('/getAllUsers', function (req, res) {
    var query = "select * from user_info";
    handle_database(query, req, res);
});
          

            app.post('/postUserData', function (req, res) {
                var query1 = "Insert into mydb.user_info(name,phone_no,token,email) values(" + mysql.escape(req.body.name) + "," + mysql.escape(req.body.phone) + "," + mysql.escape(req.body.token) + "," + mysql.escape(req.body.email) + ")";
                con.getConnection(function (err, connection) {
                    if (err) {
                        // console.log(err);
                        res.json({ "code": 100, "status": "Error in connection database" });
                        return;
                    }


                    console.log('connected as id ' + connection.threadId);

                    connection.query(query1, function (err, result) {
                        console.log(result);
                       // res.json({ "user_id": results.user_id });
                        var query2="select * from mydb.user_info where user_id="+mysql.escape(result.insertId);
                        connection.query(query2,function(err,result){
                            connection.release();
                            res.send(result[0]);
                        });
                                         

                        if (!err) {
                        }else
                            console.log(err)
                    });
                });

            });
            //});
            app.post('/postOrderData', function (req, res) {
                var query0 = "select token from user_info where user_id=" + mysql.escape(req.body.user_id);

                console.log(req.body);
                var name = req.body.name;

                var user_id = req.body.user_id;
                var orderStatus = 1;


                var Longitude = req.body.Longitude;
                var Latitude = req.body.Latitude;
                var total_price = req.body.total_price;
                var current_time = req.body.current_time;
                var address = req.body.Address;
                //var name = req.body.name;
                //var user_id = req.body.user_id;
                var item_detail = req.body.item_details;



                var query = "Insert into mydb.order(_user_id,longitude,latitude,total_price,orderdate,address,orderStatus) values (" + mysql.escape(user_id) + "," + Longitude + "," + Latitude + "," + mysql.escape(total_price) + "," + mysql.escape(current_time) + "," + mysql.escape(address) + "," + orderStatus + ")";
                // var data = [phone_number, Longitude, Latitude, total_price, current_time, address, orderStatus];
                //("phone_number", "Longitude", "Latitude", "total_price", "current_time", "address", "orderStatus")";*/
                //var query2 = "Insert into mydb.order(phoneno,orderStatus) values (" +phone_number + "," + orderStatus + ")";
                //+ mysql.escape(phone_number, name, orderStatus) + ")";
                // var data2 = [phone_number, orderStatus];

                con.getConnection(function (err, connection) {
                    if (err) {
                        // console.log(err);
                        res.json({ "code": 100, "status": "Error in connection database" });
                        return;
                    }

                    console.log('connected as id ' + connection.threadId);
                    

                    connection.query(query, function (err, results) {

                        if (!err) {
                            //res.json(rows);
                            //var query="insert into "
                            // var order_id = results.insertId;

                            var id = {
                                order_id: results.insertId
                            }
                            connection.query(query0, function (req, results) {
                                if (!err) {
                                    sendNotification(results[0].token);
                                }

                            })

                            // res.send(id);
                            for (var i = 0; i < item_detail.length; i++) {
                                var obj = item_detail[i];


                                var query3 = "Insert into mydb.order_detail(product_name,price,_order_id,quantity,Instructions) values(" + mysql.escape(obj.item_name) + "," + mysql.escape(obj.item_price) + "," + results.insertId + "," + obj.item_quantity + ","+mysql.escape(obj.instruct)+")";
                                connection.query(query3, function (err, results) {
                                   

                                    if (!err) {
                                      

                                        var query4="select from mydb.order"

                                        var detail_id = {
                                            detail_order: results.insertId
                                        }
                                        console.log(detail_id);
                                        
                                    }
                                    else {
                                        console.log(err);
                                    }


                                })
                            }
                             // connection.release();
                                        res.send("success");



                        }
                    })

                    connection.on('error', function (err) {
                        res.json({ "code": 100, "status": "Error in connection database2" });
                        return;
                    });

                });
            })
            
     

        
  


    /*name
    phone_number
    Longitude
    Latitude
    item_id
    total_price
    current_time
    Address

});
*/
    console.log('5');
app.get('/getUserData', function (req, res) {
    //var sql = "select user_id from user_info where phoneno=" + mysql.escape(req.query.phone);
    
    var sql1 = "select * from user_info where phone_no=" + mysql.escape(req.query.phoneNo);
    var update = "UPDATE user_info set token="+mysql.escape(req.query.token)+" where phone_no="+mysql.escape(req.query.phoneNo);
    con.getConnection(function (err, connection) {
        if (err) {
            res.json({ "code": 100, "status": "Error in connection database" });
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query(update, function (err, result) {	       
            //connection.release();	            //connection.release();
            if (!err) {
            
            
               // var data = result[0];
                //var user_id = data.user_id;
                
                connection.query(sql1, function (err, result) {
                    if (!err) {
                        //sendNotification(req.query.token);
                        connection.release();
                        res.json(result[0]);
                    }
                    else {
                        res.json({ "code": 100, "status": "Error in connection database" });

                    }
                });
               // res.json();
             }	            
            else {	        
                res.json({ "code": 100, "status": "Error in connection database" });	
                	
             }	
        });	

        

        connection.on('error', function (err) {
            res.json({ "code": 100, "status": "Error in connection database" });
            return;
        });
    });

});

app.get('/getOrderData', function (req, res) {
    var query1 = "select order_id from mydb.order  where (_user_id=" + mysql.escape(req.query.user_id) + "And  orderStatus=" + mysql.escape(req.query.orderStatus)+")";
    con.getConnection(function (err, connection) {
        if (err) {
            res.json({ "code": 100, "status": "Error in connection database" });
            return;
        }

        console.log('connected as id ' + connection.threadId);
        console.log(query1);

        connection.query(query1, function (err, result) {
            if (err) {
                console.log(err);
            }
            console.log(result.length);

            
            if (result.length > 0) {
                var data = [];
                var data2 = result.length;
                for (var i = 0; i < result.length; i++) {
                    console.log(result[i].order_id);
                    var query2 = "select order_id,total_price,DATE_FORMAT(orderdate, '%Y-%m-%d') AS dated,DATE_FORMAT(orderdate,'%H:%i:%s') AS timed,COUNT(product_name) As total_items,orderStatus FROM mydb.order INNER JOIN order_detail on mydb.order.order_id=mydb.order_detail._order_id where order_id=(" + result[i].order_id + ")";
                    connection.query(query2, function (err, result) {
                        console.log(result[0]);

                        data.push(result[0]);
                        
                        if (data.length == data2) {
                            
                            res.send(data);
                        }
                        console.log("data-----------------------------------------------------------------------------------------------------------------------" + data);

                    });


                }
                //console.log("data222222222222222222222222222222222222222222222222222222222222222" + data[0].total_price);

                //res.send(JSON.stringify(data));
            }
            else {
               
                res.send("You havent Ordered anything");
                
        
            }
            connection.release();
        })
        });

    //var phone = req.body[0].user_id;
    var query = "select order_id,total_price,DATE_FORMAT(orderdate, '%Y-%m-%d') AS dated,DATE_FORMAT(orderdate,'%H:%i:%s') AS timed,COUNT(product_name) As total_items FROM mydb.order INNER JOIN order_detail on mydb.order.order_id=mydb.order_detail._order_id where order_id=33";

});


app.get('/CheckNumber', function (req, res) {
    var check = "select * from user_info where phone_no=" + mysql.escape(req.query.phone);
    console.log(mysql.escape(req.query.phone));
    con.getConnection(function (err, connection) {
        if (err) {
             console.log(err);
            connection.release();
            res.json({ "code": 100, "status": "Error in connection database" });
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query(check, function (err, result) {
            connection.release();
            if (!err) {
                var status2 = {
                    code: "2"
                };
                var status = {
                    code: "1"
                };
                
                if (result.length > 0) {
                    console.log(result.length+"result lengtthh ");


                    res.json(status);
                } else {
                    res.json(status2);

                }
                

               

            }
        })

        connection.on('error', function (err) {
            res.json({ "code": 100, "status": "Error in connection database2" });
            return;
        });
    });
});
    console.log('6');
/*
app.post('/postOrderData2', function (req, res) {
    res.send("yes");
});
*/
app.get('/', function (req, res) {
    res.send(PORT);
});
/*

<<<<<<< HEAD
=======

*/

server.listen(PORT);
console.log('Server is running');


/*
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.listen(PORT, function (err) {
    if (err) {
        console.log("error" + err);
    }
    else {
        console.log("listening");
    }
})*/

function sendNotification(token) {


   
        var message = {
            "to": token,
            "notification": {
                "body": "Thanks for ordering with Knock.",
                "title": "Knock ! ",
                "content_available": true,
                "priority": "high",
            }
        }

        //callback style

        fcm.send(message, function (err, response) {
            if (err) {
                console.log("Something has gone wrong!" + err);
            } else {
                console.log("Successfully sent with response: ", response);
            }
        });
    
}

    //promise style
    /*fcm.send(message)
        .then(function (response) {
            console.log("Successfully sent with response: ", response);
        })
        .catch(function (err) {
            console.log("Something has gone wrong!");
            console.error(err);
    })
/*


//Admin Part Start
app.post('/AdminLogin', function (req, res) {
    var id = 243;
    var pass = 34567;
    var exec = 'select AdminPassword from Admin where Admin_Name="req.body.name" ';
    if (exec == pass) {
        res.send(0);
    } else {
        res.send(1);
    }
    var query = con.query(exec, function (err, result) {
        if (err) {
            console.log(err);
        } else {

        }

    });
    if (req.body.logInId & req.body.logInPassword) {
        if (pass = req.body.logInpassword) {
            res.send("valid");
        } else {
            res.send('Not Valid');
        }
        


    }
})
//To get data like categories and subCategories from database
app.get('/dataSpinner', function (req, res) {
    var one = "select  subCategory_name from subCategory where category=req.body.cat";
    res.send(one);

})
//previous menu get
app.get('/PreviousMenuPrice', function (req, res) {
    var ret = "select subCategory_name,subCategory_id,subCategory_price from SubCategory where Category_name=req.body.cat";
    req.send(ret);

})
//new update Menu posted
app.post('/UpdateMenu', function (req, res) {
    for (var i= 0; i < req.body.arr.length();i++){


    var update = "Update SubCategories set SubCategory_price=req.body.arr[i].price  where (subCategor_namey=req.body.arr[i].subCat)";
}
    
});
//Menu ITEM DELETED
app.post('/deleteItem', function (req, res) {
    var del = " DELETE FROM SubCategories WHERE subCategory_name=req.body.subCat";
})






*/


//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());
//user side start
//checking number in database  First Step


    app.get('/checkPhone', function (req, res) {
       
    });
    

   /* var check = "select * from userinfo where phoneno=" + mysql.escape(req.query.phone) ;
    con.query(check, req.body.phone, function (err, result) {
        //console.log(con.query);
        if (err) throw err;
        if (result.length > 0) {
            console.log(result.length);
            res.send("1");
        }
        
        res.send("2");
    })*/
    
    



//send user_data to app step 2
/*
app.get('/SendUserData', function (req, res) {
    console.log("yes");
    var sendData = "select  name,phoneno,location from userinfo where phoneno=?" + req.body.phone;
    con.query(sendData, function (err, result) {
        if (err)  res.send(err);
        res.send(result);
    })
})*/

//send menu items to user step 3
app.get('/Items', function (req, res) {
    
    //res.send([{ "name": 1, "image": "R.drawable.milk__", "quantity": "1", "description": "any thing", "price": "120", "measuring_unit": "litre" }, { "name": 1, "image": "R.drawable.milk__", "quantity": "1", "description": "any thing", "price": "120", "measuring_unit": "litre" }, { "name": 1, "image": "R.drawable.milk__", "quantity": "1", "description": "any thing", "price": "120", "measuring_unit": "litre" }, { "name": 1, "image": "R.drawable.milk__", "quantity": "1", "description": "any thing", "price": "120", "measuring_unit": "litre" }, { "name": 1, "image": "R.drawable.milk__", "quantity": "1", "description": "any thing", "price": "120", "measuring_unit": "litre" }]);
   var items = "select * from category_detail" ;
    con.query(items, function (err, result) {
        
        if (err) 
            console.log("error" + err);;
        //res.send(err);
        //console.log(result);
        console.log(result[0].name);
        
        res.send([{ "name": result[0].name, "image": result[0].image, "quantity": "1", "description": result[0].description, "price": result[0].updated_price, "measuring_unit": result[0].measuring_unit }]);
        //res.send(result);
        
    })
})
console.log('8');
//send menu items to user step 3
app.get('/Item', function (req, res) {
    console.log("runnning");
    var items = "select * from category_detail" ;

    con.query(items, function (err, result) {
        console.log("runnning");
        if (err) {
            console.log(err);
            res.end();
        }
        //console.log(result);
        console.log(result[0].item_id);
        
        //res.send([{ "name": result[0].item_name, "image": result[0].itemname, "quantity": "1", "description": result[0].description, "price": result[0].updated_price, "measuring_unit": result[0].measuringunit }, { "name": 1, "image": "R.drawable.milk__", "quantity": "1", "description": "any thing", "price": "120", "measuring_unit": "litre" }, { "name": 1, "image": "R.drawable.milk__", "quantity": "1", "description": "any thing", "price": "120", "measuring_unit": "litre" }, { "name": 1, "image": "R.drawable.milk__", "quantity": "1", "description": "any thing", "price": "120", "measuring_unit": "litre" }, { "name": 1, "image": "R.drawable.milk__", "quantity": "1", "description": "any thing", "price": "120", "measuring_unit": "litre" }]);
        res.send(result);
        
    })
    
    
   /* */
})

//check out step 4
app.post('/checkOut', function (req, res) {
    var order_Insert = "Insert into order set values ?";
})
//  Get Status Code for order
app.get('/OrderStatus', function (req, res) {
    res.send("2");
})
//user side end

//Admin side
app.get('/getAdminLoginData',function(req,res){
    var query="SELECT name FROM mydb.admin";
     con.getConnection(function (err, connection) {
        if (err) {
             console.log(err);
            res.json({ "code": 100, "status": "Error in connection database" });
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query(query, function (err, result) {
             connection.release();
            res.send(result);
        })
     })
})
app.get('/AdminLoginTruthOrFalse',function(req,res){
    var query="SELECT count(admin_id) FROM mydb.admin where (name="+mysql.escape(req.query.name)+" And password="+mysql.escape(req.query.pass)+")";
     con.getConnection(function (err, connection) {
        if (err) {
             console.log(err);
            res.json({ "code": 100, "status": "Error in connection database" });
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query(query, function (err, result) {
             connection.release();
            res.send(result);
        })
     })
})

//Delivery side
app.get('/OrderLocation', function (req, res) {
    var query="SELECT order_id,latitude,longitude FROM mydb.`order` where orderStatus=1";
     con.getConnection(function (err, connection) {
        if (err) {
             console.log(err);
            res.json({ "code": 100, "status": "Error in connection database" });
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query(query, function (err, result) {
             connection.release();
            res.send(result);
        })
     })
   
});

app.get('/OrderDetailData', function (req, res) {
    var query="SELECT product_name,price,_order_id,quantity   from order_detail where _order_id="+mysql.escape(req.query.order_id);
     con.getConnection(function (err, connection) {
        if (err) {
             console.log(err);
            res.json({ "code": 100, "status": "Error in connection database" });
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query(query, function (err, result) {
            console.log(result);
            connection.release();
            res.send(result);
            
        })
     })
   
});



app.get('/OrderPaymentData', function (req, res) {
    var query="SELECT total_price FROM mydb.`order` where order_id="+mysql.escape(req.query.order_id);
     con.getConnection(function (err, connection) {
        if (err) {
             console.log(err);
            res.json({ "code": 100, "status": "Error in connection database" });
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query(query, function (err, result) {
            //console.log(result);
             connection.release();
            res.send(result[0].total_price);
        })
     })
   
});


app.get('/StartDelivery', function (req, res) {
    var query="UPDATE `mydb`.`order` SET orderStatus=2 WHERE `order_id`="+mysql.escape(req.query.order_id);
     con.getConnection(function (err, connection) {
        if (err) {
             console.log(err);
            res.json({ "code": 100, "status": "Error in connection database" });
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query(query, function (err, result) {
             connection.release();
            res.json(result);
        })
     })
   
});

app.get('/confirmPayment', function (req, res) {
    var query="UPDATE `mydb`.`order` SET orderStatus=3 WHERE `order_id`="+mysql.escape(req.query.order_id);
     con.getConnection(function (err, connection) {
        if (err) {
             console.log(err);
            res.json({ "code": 100, "status": "Error in connection database" });
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query(query, function (err, result) {
             connection.release();
            res.json(result);
        })
     })
   
});



/*

app.post('/notified', function (req, res) {
    if (req.body.signUpId) {



        var id = req.body.signUpId;
        console.log(id);
        res.send("yes");
    }
    else {
        res.send("no");
    }

   
String uriPostUserData = "http://ec2-13-232-147-28.ap-south-1.compute.amazonaws.com:5000/postUserData"; public static String uriCheckNumber = "http://ec2-13-232-147-28.ap-south-1.compute.amazonaws.com:5000/getCheckNumber"; public static String uriGetUserData = "http://ec2-13-232-147-28.ap-south-1.compute.amazonaws.com:5000/getUserData"; public static String uriPostOrderData = "http://ec2-13-232-147-28.ap-south-1.compute.amazonaws.com:5000/postOrderData"; public static String uriGetOrderData = "http://ec2-13-232-147-28.ap-south-1.compute.amazonaws.com:5000/getOrderData"; c
       
    

    
    
    

})

const con = mysql.createConnection({
    host: '127.0.0.1',
    user: 'kashif',
    password: 'tgbyhnujm',
    database: 'mydb'
});

var obj = {
    name: "kashif",
    id: 123
};
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/abd', function (req, res) {
    res.send("yes");
})
app.post('/insertCategory', function (req, res) {
    var value = {


        catid :req.body.cat_id,
        catName : req.body.cat_name,
        _adminid : req.body.admin,
        earliestdelivery : req.body.deliver
    };
    console.log(value.catName);

   // var query1 = con.query('Insert into admin()')
    
    var query = con.query('INSERT INTO category SET ?', value, function (err, result) {
        if (err) console.log(err);
        else {
            console.log(result);
        }
        // Neat!
    });
})
app.listen(PORT, function (err) {
    if (err) {
        console.log("error" + err);
    };
})

app.get('/driverDelivery', function (req, res) {
   
})
app.get('/order'), function (req, res) {
    var city = "";
    
    var exec = "";
    con.query(exec, (err, result){
        if (err) console.log(err);
        else {
            id = result.order_id;
            res.send(id);
            

        }
    
    })
})

app.get('/menuUpdate', function (req, res) {
    var check = Checked();

    
    if (check == 0) {
        res.send(0);

    }
    else {
        res.send(1);
    }
    
    
    console.log("Received");
    
   
})
function Checked() {



    con.connect((err) => {
        if (err) {
            console.log('Error connecting to Db');
            return 0;
        }
        console.log('Connection established');
        return 1;

    });


}
app.get('/menuUpdate/check'), function (req, res) {
    var App_length = 9;
    var db_length = 10;
    Updated(App_length);


});



app.get('/insertItems', function (req, res) {
    
    var Category_id = req.query.Cat_id;
    var SubCategory_name = req.query.Sub_name;
    var SubCategory_id = req.query.Sub_id;
    var SubCategory_image=req.query.image;
    var SubCategory_size=req.query.size;
    var SubCategory_price=req.query.price;
    var SubCategory_descroption = req.query.description;



    var exec = "insert into user(Name, userName, id) values('data.message', 'data.user2', 23)";
    con.query(sql, (err, result){
        if (err) {
            res.send(0);
        }
        
    });



})
app.get('/getMenu', function (req, res) {
    var category = req.query.cat;
    
    var exec = "Select SubCategory_name,SubCategory_price,SubCategory_id from SubCategory where Category_id='category'";

})
app.get('/updateMenu', function (req, res) {
    var subCat_id = req.query.sub;
    var subCat_price = req.query.price;
    var exec = "Insert into SubCategory(subCategory_price) values('subCat_price') where subCategory_id='subCat_id'";

})
app.get('/insertNew', function (req, res) {
    var subCat_id = req.query.sub;
    var subCat_price = req.query.price;
    var subCat_name = req.query.name;
    var subCat_image = req.query.image;
    var subCat_size = req.query.size;
    var subCat_desc = req.query.desc;
    var Category_id = req.query.cat;
    var exec="Insert into SubCategory(subCategory_id,subCategory_name,subCategory_image,subCategory_size,subCategory_price,subCategory_description) values("
})
app.get('/notification', function (req, res) {


    
    console.log("Received2");
    res.send("ok");
})



function Updated(App_length) {
    var applength = App_length;
    var dbLength = "Select Count(id) from user;";
    con.query(sql, (err, result) => {
        if (err) throw err;

        console.log('Data sent');

    });
    if (dblength > appLength) {
        res.send(0);

         }
    else {
        res.send(1);

    }
}
app.get(function (req, res) {


});
function sendOrderDetails(detail) {
   
    

}*/
    
