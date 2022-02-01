import { MongoClient } from "mongodb";
import nextConnect from "next-connect";

const client = new MongoClient(
  "mongodb+srv://apps:Guro6297@cluster0.6m26g.mongodb.net/test?authSource=admin&replicaSet=atlas-halo6h-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

async function database(req, res, next) {
  await client.connect();
  req.dbClient = client;
  req.db = client.db("cut");
  return next();
}

const middleware = nextConnect();

middleware.use(database);

export default middleware;
