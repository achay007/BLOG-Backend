import express from 'express'
import {MongoClient} from 'mongodb'
import {db,connectToDb} from './db.js'

let articlesInfo= [{
    name:'learn-react',
    upvotes:0,
    comments: [],
},
{
    name:'learn-node',
    upvotes:0,
    comments:[],
}

]
const app = express()
app.use(express.json())

app.get('/api/articles/:name' , async (req,res)=>{
    const {name} = req.params
   
    const article = await db.collection('articles').findOne({ name })
    if(article){
        res.json(article)
    }else{
        res.sendStatus(404)
    }
})

app.put('/api/articles/:name/upvote',async (req,res)=>{

    const {name} = req.params;
   
    await db.collection('articles').updateOne({name},{
        $inc:{upvotes:1}
    })
    const article = await db.collection('articles').findOne({name})

    if(article){
        //article.upvotes += 1
        // res.send(`The ${name} article has now ${article.upvotes} upvotes`)
        res.json(article)
    }else{
        res.send('The article doesnt doesnt exist')
    }
})
app.post('/api/articles/:name/comments',async (req,res)=>{

    const {name} = req.params
    const {postedBy,text} = req.body

   
    await db.collection('articles').updateOne({name},{
        $push: {comments:{postedBy,text}},
    })
    const article = await db.collection('articles').findOne({name})
    //const article = await db.collection.findOne({name})
    if(article){
        res.json(article)
    }else{
        res.send('The article doesnt exist')
    }

})

connectToDb(()=>{
    console.log("Successfully connected to database")
    app.listen(8000 ,() =>{
        console.log("Server listening on port 8000")
    })

})
