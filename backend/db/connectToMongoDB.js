import mongoose from "mongoose";

const connectToDB = async () =>{
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Database connected to host `, connection.connection.host)
  } catch (error) {
    console.log("An error occured", error.message)
    process.exit(1)
  }
}

export default connectToDB