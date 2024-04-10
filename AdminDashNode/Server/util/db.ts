import mongoose from "mongoose"

export default async function connectDB() {
  try {
    //@ts-ignore
    await mongoose.connect(`${process.env.URI}/ecommerce`)

    console.log("Connected to the Db")
  } catch (error) {
    console.log("failed to connect to the database")

    process.exit(0)
  }
}
