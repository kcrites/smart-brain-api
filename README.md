This is the backend of the Face Recognition app on my Github account.

The backend was developed as an Express server that interacts with a postgreSQL database. It encrypts the passwords of the users and stores as a hash field. RESTful API calls are made from the React front end to perform tasks such as signing in, registering and submitting a picture to the Clarify API for face recognition.

Several modules are used including:
- bcrypt-nodejs
- cors
- knex.js

Thanks for having a look!

- Ken

