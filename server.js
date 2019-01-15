const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'kencrites',
    password : '',
    database : 'smart-brain'
  }
});

db.select('*').from('users').then(data => {
	console.log(data);
});

const app = express();
app.use(bodyParser.json());
app.use(cors());



app.get('/', (req, res) => {
	res.send(database.users);
})

app.post('/signin', (req, res) => {
	db.select('email', 'hash').from('login')
	.where('email', '=', req.body.email)
	.then(data => {
		const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
		if(isValid) {
			return db.select('*').from('users')
				.where('email', '=', req.body.email)
				.then(user => {
					res.json(user[0])
				})
				.catch(err => res.status(400).json('Unable to get user'))
		} else {
			res.status(400).json('Wrong credentials');
			}
	})
	.catch(err => res.status(400).json('Wrong credentials'));

})

app.post('/register', (req, res) => {
	const { email, name, password} = req.body;
	const hash = bcrypt.hashSync(password);
		db.transaction(trx => {
			trx.insert({
				hash: hash,
				email: email
			})
			.into('login')
			.returning('email')
			.then(loginEmail => {
					return trx('users')
					.returning('*')
					.insert({
						email: loginEmail[0],
						name: name,
						joined: new Date()
					}).then(user => {
						res.json(user[0]);
					})
			})
			.then(trx.commit)
			.catch(trx.rollback)
		})	
		.catch(err => res.status(400).json('Unable to register'));	
})

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;

db.select('*').from('users').where({id})
	.then(user => {
		if (user.length) {
	res.json(user[0]);
} else {
	res.status(400).json('Not Found')
}
}).catch(err => res.status(400).json('Error getting user'))


})

app.put('/image', (req, res) => {
	const { id } = req.body;
	db('users')
	.where('id', '=', req.body.id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries =>{
		res.json(entries);
	})
	.catch(err => res.status(400).json('Unable to get entries'))

 	
})

app.listen(3001, () => {
	console.log('app is running on port 3001');

})
// Using port 3001 because the front end React server is using port 3000.
  
