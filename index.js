const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//mysql configuration
const connection = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'password',
	database:'DatabaseName'
});
//check error
connection.on('error',function(err){
	console.log('Error',err.code);
})
//check connection
connection.connect(function(err){
	if(err) console.log('Error Connect :', err);
	else console.log('Database connected');
})
//mysql configuration end
//mysql table creation uncomment to create table
/*
connection.query('CREATE TABLE IF NOT EXISTS todo(id int PRIMARY KEY NOT NULL AUTO_INCREMENT,name varchar(255))',function(err, results){
	if(err){console.log('Error : ',err);}
	else{ console.log('table created');}
})
*/

//get
app.get('/',function(req,res){
	connection.query('SELECT * FROM todo order by id desc',function(err, results){
		if(err){console.log(err); res.send(err)}
		else{ console.log(results);
			res.render('index',{todo_list:results,edit_todo_data:''});
		}
	});
});
//post
app.post('/',function(req,res){
	var name = req.body.name;
	console.log(name);
	if(name){
		connection.query('INSERT INTO todo SET name = ?',[name],function(err, results){
			if(err){console.log('Error : ',err); res.send(err);}
			else{ res.redirect('/'); }
		});
	}else{ res.redirect('/'); }
});
//edit
app.get('/edit/:row_id',function(req,res){
	connection.query('SELECT * FROM todo WHERE id = ?',[req.params.row_id],function(err, edit_todo_data){
		if(err){console.log(err); res.send(err)}
		else{
			connection.query('SELECT * FROM todo order by id desc',function(err, results){
				if(err){console.log(err); res.send(err)}
				else{ console.log(results);
					res.render('index',{todo_list:results,edit_todo_data:edit_todo_data[0]});
				}
			});
		}
	});
});
//put
app.post('/update',function(req,res){
	var name = req.body.name;
	var row_id = req.body.row_id; 
	console.log(row_id); console.log(name);
	if(name){
		connection.query('UPDATE todo SET name = ? WHERE id = ?',[name,row_id],function(err, results){
			if(err){console.log('Error : ',err); res.send(err);}
			else{ res.redirect('/'); }
		});
	}else{ res.redirect('/'); }
});
//delete
app.get('/delete/:row_id',function(req,res){
	var row_id = req.params.row_id; console.log(row_id);
	connection.query('DELETE FROM todo WHERE id = ?',[row_id],function(err, results){
		if(err){console.log('Error : ',err); res.send(err);}
		else{ res.redirect('/'); }
	});
})






app.listen(3000,function(){
	console.log('server listening on 3000 port');
});