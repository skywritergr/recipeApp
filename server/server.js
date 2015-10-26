/*
* This is the basic server of the project. It serves both static file for the AngularJS folder (app)
* and also works as our API server.
*/

var express = require('express'),
	bodyParser = require('body-parser'),
	recipes = require('./routes/recipes'),
	http = require('http'),
	path = require('path'),
	favicon = require('serve-favicon'),
	morgan = require('morgan'),
	errorhandler = require('errorhandler');

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
 
// express/connect middleware
app.use(favicon(__dirname + '/../app/favicon.ico'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
 
// serve up static assets
app.use(express.static(path.join(__dirname, '/../app/')));
app.use('/bower_components',  express.static(__dirname + '/../bower_components'));

// API
app.route('/recipes')
	.get(recipes.findAll) //Get all the recipes available
	.post(recipes.addRecipe); //Add a new recipe to the server. Unfortunately no front-end was developer for adding recipes.

app.route('/recipes/:id')
	.get(recipes.findById) //Get recipe by ID
	.put(recipes.updateRecipe) //Update a given recipe
	.delete(recipes.deleterecipe); //Delete a recipe from the system.

app.route('/findByName/:name')
	.get(recipes.findByName); //Search recipes by name.

app.listen(3000);
console.log('Listening on port 3000...');