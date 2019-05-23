//Increases entries count
const api = require('./config');

const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: api.clarifaiKey
});

const handleApiCall = (req, res) => {
	app.models
		.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
		.then(data => {
			res.json(data);
		})
		.catch(err => res.status(400).json('Unable to work with API'))
}

const handleImage = (req, res, db) => {
	const { id } = req.body;
	db('users')
	.where('id', '=', req.body.id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries =>{
		res.json(entries);
	})
	.catch(err => res.status(400).json('Unable to get entries'))	
}

module.exports = {
	handleImage: handleImage,
	handleApiCall: handleApiCall
};