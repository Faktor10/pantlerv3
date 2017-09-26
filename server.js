//https://www.sitepoint.com/deploy-rest-api-in-30-mins-mlab-heroku/ 

const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongodb = require('mongodb')

const ObjectID = mongodb.ObjectID

const INGREDIENTS_COLLECTION = 'ingredients'

const app = express()
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())

let db

mongodb.MongoClient.connect(process.env.MONGODB_URI, (err, database) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    
    db = database
    console.log('database ready')
    const server = app.listen(process.env.PORT || 8080, () => {
        const port = server.address().port
        console.log(`Server is runnning on port ${port}`)
    })
})


const handleError = (res,reason, message, code) => {
    console.error(`ERROR ${reason}`)
    res.status(code || 500).json({'error': message})
}



app.get('/ingredients', (req,res) => {
  db.collection(INGREDIENTS_COLLECTION).find({}).toArray((err, docs) => {
      if (err) {
          handleError(res, err.message, 'Failed to get ingredients')
      }
      res.status(200).json(docs)
  })  
})

app.post('/ingredients', (req,res) => {
    const newIngredient = req.body
    if (!(req.body.name || req.body.quantity)) {
        handleError(res,'Invalid user input', "must provide a name and quantity",400)
    }
    db.collection(INGREDIENTS_COLLECTION).insertOne(newIngredient, (err, doc) => {
        if (err) {
            handleError(res, err.message, 'Failed to add to DB')
        }
        res.status(201).json(doc.ops[0])
    })
})

app.get('/ingredients/:id', (req,res) => {
    db.collection(INGREDIENTS_COLLECTION).findOne({_id: new ObjectID(req.params.id)}, (err, doc)=> {
        if (err) {
            handleError(res, err.message, 'Failed to get ingredient')
        }
        res.code(200).json(doc)
    })
})

app.put('/ingredients/:id', (req,res) => {
    
})

app.delete('/ingredients/:id', (req,res) => {
    
})