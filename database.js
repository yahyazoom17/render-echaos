import mongoose from "mongoose";

export function connectToDB() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB: Database Connected Successfully!"))
    .catch((err) => {
      console.log(err.message);
      console.log("MongoDB: Database Connection Error!");
      process.exit(1);
    });
}
