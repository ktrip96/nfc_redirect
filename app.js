const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')
require('dotenv').config()

const app = express()
const port = 3001

// Create a MongoDB connection pool
const client = new MongoClient(process.env.MONGOURL)

// Function to connect to the MongoDB database using the connection pool
async function connectToDatabase() {
	try {
		await client.connect()
	} catch (err) {
		console.error('Error connecting to MongoDB:', err)
	}
}

// Middleware to connect to the database before handling requests
app.use(async (req, res, next) => {
	await connectToDatabase()

	req.dbClient = client
	req.db = client.db('nfc-database')
	next()
})

// Your route to handle GET requests
app.get('/redirect', async (req, res) => {
	const id = new ObjectId(req.query.id)

	console.log('Id is :, ', id)

	const collection = req.db.collection('clients')

	console.log('Collection is : ', collection)

	// Perform your MongoDB query to check if the ID matches a user
	const user = await collection.findOne({ _id: id })

	console.log('user is : ', user)

	if (user) {
		// Redirect to another domain
		res.redirect(user.url) // Replace with the desired domain
	} else {
		// Send a "Something went wrong" message
		res.send('<h1>Something went wrong</h1>')
	}
})

app.get('/', async (req, res) => {
	res.send('Hello!!!')
})

// Start the server
app.listen(port, () => {
	console.log(`Server is running on port ${port}`)
})
