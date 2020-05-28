// CRUD : Create Read Update Read

// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectID

const {MongoClient, ObjectID} = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, { useNewUrlParser:true, useUnifiedTopology: true }, (error, client) => {
    if(error) {
        return console.log("Unable to connect to database!")
    }
    const db = client.db(databaseName)

    // db.collection('users').findOne({name: 'Rutvik'} ,(error, user) => {
    //     if(error){
    //         return console.log('Unable to find user!')
    //     }
    //     console.log(user)
    // })

    // db.collection('users').find({age:22}).toArray((error, users) => {
    //     console.log(users)
    // })

    // db.collection('users').find({age:22}).count((error, count) => {
    //     console.log(count)
    // })

    db.collection('users').updateOne({
        _id: new ObjectID("5ecba87c8b58c438d856d616")
    }, {
        $set: {
            name: 'Harsh Tamakuwala'
        }
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })

})