var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = require('bson').BSONPure;

// This is the IP of the mongoDB database. It can easily be changed to point to localhost.
// My server has already some sample files in there.
var server = new Server('46.101.29.114', 27017, {
    auto_reconnect: true
});
//Create a new database called recipeDB (or get the existing one).
db = new Db('recipeDB', server);

db.open(function(err, db) {
    if (!err) {
        console.log("Connected to 'recipeDB' database");
        db.collection('recipes', {
            strict: true
        }, function(err, collection) {
            if (err) {
                console.log("The 'recipes' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

//Find the recipe for a specific ID
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving recipe: ' + id);
    db.collection('recipes', function(err, collection) {
    	if(err) {
    		throw err; //If something goes wrong just throw an error
    	} else {
    		collection.findOne({
	            '_id': new BSON.ObjectID(id)
	        }, function(err, item) {
	        	if(err !== null){
	        		res.status(500).send(err); // If an error occured send a status 500 to the front-end
	        	}

	        	if(item === null){
	        		res.status(404).send('Not Found!'); //Let the user know when the recipe isn't found
	        	} else {
	        		res.send(item); //If everything went well then send back the response.
	        	}
	        });
    	}
    });
};

//Find the recipe by name. This is used by the search box in the front end to find recipes.
exports.findByName = function(req, res){
    var name = req.params.name;
    var regEx = new RegExp(name, "i"); //Create a regular expression in order to find any recipe that contains the given word.

    console.log('Retrieving recipe: ' + name);
    db.collection('recipes', function(err, collection) {
        if(err){
            throw err;
        } else {
            collection.find({ name : regEx }).toArray(function(err, items){
                res.send(items);
            });
        }
    });
};

// Get all available recipes in the database.
exports.findAll = function(req, res) {
    db.collection('recipes', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

// Add a new recipe in the database. There is no front-end currently using that.
// It can be used through curl or postman etc.
exports.addRecipe = function(req, res) {
    var recipe = req.body;
    console.log('Adding recipe: ' + JSON.stringify(recipe));
    db.collection('recipes', function(err, collection) {
        if(err) {
    		throw err;
    	} else {
		    collection.insert(recipe, {
		        safe: true
		    }, function(err, result) {
		        if (err) {
		            res.send({
		                'error': 'An error has occurred'
		            });
		        } else {
		            console.log('Success: ' + JSON.stringify(result[0]));
		            res.send(result[0]);
		        }
		    });
    	}
    });
}

// This is for updating existing recipes via PUT. No front-end for that either.
// It can be accessed via curl of postman etc.
exports.updateRecipe = function(req, res) {
    var id = req.params.id;
    var recipe = req.body;
    console.log('Updating recipe: ' + id);
    console.log(JSON.stringify(recipe));
    db.collection('recipes', function(err, collection) {
        collection.update({
            '_id': new BSON.ObjectID(id)
        }, recipe, {
            safe: true
        }, function(err, result) {
            if (err) {
                console.log('Error updating recipe: ' + err);
                res.send({
                    'error': 'An error has occurred'
                });
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(recipe);
            }
        });
    });
}

// Delete the recipe. Same storie as above. It can be accessed via curl etc.
exports.deleterecipe = function(req, res) {
    var id = req.params.id;
    console.log('Deleting recipe: ' + id);
    db.collection('recipes', function(err, collection) {
        collection.remove({
            '_id': new BSON.ObjectID(id)
        }, {
            safe: true
        }, function(err, result) {
            if (err) {
                res.send({
                    'error': 'An error has occurred - ' + err
                });
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(result);
            }
        });
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// This is here in case anyone decides to run this on their own MongoDB.
var populateDB = function() {

    var recipes = [{
        name: "Lemon Chicken",
        cookingTime: "30 minutes",
        ingredients: [{ 'ingredient':'Chicken', 'quantity': '2' }, {'ingredient':'Lemon', 'quantity' : '1'}, {'ingredient':'Thyme', 'quantity':'1 tbsp'}],
        picture: "lemonChicken.jpg"
    },{
        name: "Beef Stroganoff",
        cookingTime: "30 minutes",
        ingredients: [{ 'ingredient':'Beef', 'quantity': '0.5 kg' }, {'ingredient':'Mustard', 'quantity' : '2 tbsp'}, {'ingredient':'Mushrooms', 'quantity':'10'}],
        picture: "beefStroganoff.jpg"
    },{
        name: "Caesar Salad",
        cookingTime: "25 minutes",
        ingredients: [{ 'ingredient':'Crouton', 'quantity': 'Several' }, {'ingredient':'Lettuce', 'quantity' : '1'}, {'ingredient':'Parmesan', 'quantity':'100 gr'}],
        picture: "caesarSalad.jpg"
    }];

    db.collection('recipes', function(err, collection) {
        collection.insert(recipes, {
            safe: true
        }, function(err, result) {});
    });

};