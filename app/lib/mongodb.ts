import { MongoClient } from "mongodb";

const uri: string = process.env.MONGODB_URI as string;
const options: object = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error("Veuillez définir MONGODB_URI dans .env.local");
}

// On utilise une variable globale pour éviter de recréer la connexion en mode développement
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
