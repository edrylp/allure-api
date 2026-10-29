const serverlessExpress = require("@codegenie/serverless-express");
const mongoose = require("mongoose");
const { app } = require("./index");

let cachedServer;
let isConnected = false;

async function connectToDatabase() {
  if (isConnected) {
    return;
  }

  const db = await mongoose.connect(process.env.MONGODB_STRING, {
    serverSelectionTimeoutMS: 5000
  });

  isConnected = db.connections[0].readyState === 1;

  console.log("MongoDB Connected (Lambda)");
}

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  await connectToDatabase();

  if (!cachedServer) {
    cachedServer = serverlessExpress({ app });
  }

  return cachedServer(event, context);
};
