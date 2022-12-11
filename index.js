require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xjldfqc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

const run = async () => {
    try {
        const db = client.db("collegeHacks");
        const blogsCollection = db.collection("blogs");

        app.get("/blogs", async (req, res) => {
            const cursor = blogsCollection.find({});
            const blogs = await cursor.toArray();

            res.send({ status: true, data: blogs });
        });

        app.post("/add-blog", async (req, res) => {
            const blog = req.body;

            const result = await blogsCollection.insertOne(blog);

            res.send(result);
        });

        app.delete("/blog/:id", async (req, res) => {
            const id = req.params.id;

            const result = await blogsCollection.deleteOne({
                _id: ObjectId(id),
            });
            res.send(result);
        });
    } finally {
    }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
    res.send("College Hacks server is up and running!");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
