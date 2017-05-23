//gestion de la DB
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var multer  = require('multer');

mongoose.connect('mongodb://localhost/Meetings2');

var MeetingSchema = new mongoose.Schema({
  name: String,
  description: String,
  date: String,
  logo: String
});

var Meeting=mongoose.model('Meeting',MeetingSchema);

//gestion du serveur HTTP
var express = require('express');
var app = express();

app.use('/JavaScript', express.static(__dirname + '/app/javascript'));
app.use('/css', express.static(__dirname + '/app/css'));
app.use('/storage', express.static(__dirname + '/app/storage'));
app.use('/lib', express.static(__dirname + '/app/lib'));


// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json 
app.use(bodyParser.json());

app.get('/', function (req, res) 
{
	res.sendFile(__dirname + '/app/app.html');
});

//multer paramètres du dossier de stockage des logos
 var storage = multer.diskStorage({ 
        destination: function (req, file, cb) {
            cb(null, './app/storage/');
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.originalname);
        }
    });

    var upload = multer({ 
                    storage: storage
                }).single('file');

    app.post('/upload', function(req, res) {
        upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
             res.json({error_code:0,err_desc:null});
        });
    });

// routes
// affichage des données
app.get('/api/display', function(req, res) 
{
	Meeting.find(null)
	.exec(function(err,result)
	{
		if (err==true)
		{
			res.send('err');
		}
		else
		{
			res.json(result);
		}
	})
});


// ajout des données
app.post('/api/form', function(req,res) 
{

//création d'un nouveau document destiné à la base
	var newMeeting=new Meeting({
		name:req.body.name,
		description:req.body.description,
		date:req.body.date,
		logo:req.body.logo
	});

	//enregistrement dans la base
	newMeeting.save(function(err)
	{
		if (err)
		{
			res.send('err');
		}
		else
		{
			res.send();
		}
	})

	
});


// suppression de données
app.delete('/api/delete/:id', function(req, res) 
{
	Meeting.remove({_id:req.params.id})
	.exec(function(err)
	{
		if (err==true)
		{
			res.send('err');
		}
		else
		{
			res.send('');
		}
	})
});

//edition de données
app.put('/api/edit/:id',function(req,res)
{
	Meeting.update({_id:req.params.id},
	{name:req.body.name,description:req.body.description,date:req.body.date, logo:req.body.logo})
	.exec(function(err)
	{
		if (err==true){
			res.send('err');
		}
		else{
			res.send();
		}
	})
});

app.listen(8080, function(){ console.log("Merci d'ouvrir http://localhost:8080")});