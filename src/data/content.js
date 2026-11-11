export const LEARN=[
{t:"What is MongoDB?",d:"A free, open-source NoSQL database that stores data as flexible JSON-like documents.",ex:"One student document can hold a name, age and a list of courses.",c:'db.Students.insertOne({ name: "Ali", age: 20 })',p:"Document database · stores BSON · flexible schema · default port 27017"},
{t:"Database, Collection, Document",d:"A database holds collections; a collection holds documents.",ex:"Aptech (database) > Students (collection) > Ali's record (document).",c:'use Aptech\ndb.createCollection("Students")',p:"Collection = table · Document = row · every document has a unique _id"},
{t:"BSON and NoSQL",d:"NoSQL databases don't need fixed tables. BSON is MongoDB's binary form of JSON.",ex:"BSON supports Date, ObjectId and Decimal128 besides normal JSON types.",c:'db.logs.insertOne({ at: new Date(), level: "info" })',p:"BSON = Binary JSON · faster and richer than plain JSON"},
{t:"CRUD Operations",d:"Create, Read, Update and Delete are the four basic data operations.",ex:"Find students older than 18, then change one student's age.",c:'db.Students.find({ age: { $gt: 18 } })\ndb.Students.updateOne({ name: "Ali" }, { $set: { age: 21 } })',p:"insertOne/insertMany · find · updateOne/updateMany · deleteOne/deleteMany"},
{t:"Aggregation Pipeline",d:"A series of stages that transform documents into results.",ex:"Count students per course.",c:'db.Students.aggregate([\n  { $match: { age: { $gte: 18 } } },\n  { $group: { _id: "$course", total: { $sum: 1 } } }\n])',p:"Stages: $match, $group, $sort, $project, $limit"},
{t:"Indexes",d:"Special structures that make queries faster.",ex:"An index on name lets MongoDB find Ali without scanning everything.",c:"db.Students.createIndex({ name: 1 })",p:"_id is indexed by default · too many indexes slow writes"},
{t:"Replication and Sharding",d:"Replication copies data for safety; sharding splits data for scale.",ex:"Three replica-set members keep the same data; shards each keep part of it.",c:"rs.status()\nsh.status()",p:"Primary handles writes · shard key distributes data"},
{t:"MongoDB with Node.js",d:"The official driver or Mongoose connects Node.js/Express apps to MongoDB.",ex:"An Express route reads students from MongoDB.",c:'const { MongoClient } = require("mongodb")\nconst client = new MongoClient("mongodb://localhost:27017")',p:"npm install mongodb · Mongoose adds schemas"}
];
export const SHELL=[
["show dbs","Lists all databases."],["use Aptech","Switches to (or creates) the Aptech database."],["show collections","Lists collections in the current database."],
['db.createCollection("Students")',"Creates a collection."],['db.Students.insertOne({ name: "Ali", age: 20, course: "Web Development" })',"Inserts one document."],
["db.Students.find()","Returns all documents."],["db.Students.findOne()","Returns the first document."],
['db.Students.updateOne({ name: "Ali" }, { $set: { age: 21 } })',"Updates one document using $set."],['db.Students.deleteOne({ name: "Ali" })',"Deletes one matching document."],
["db.Students.find().sort({ age: 1 })","Sorts ascending by age."],["db.Students.find().limit(5)","Returns at most 5 documents."]
];
