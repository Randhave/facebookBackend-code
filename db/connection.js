import mongoose from 'mongoose'

const Connection = async () => {
    try {
        await mongoose.connect(process.env.url, {

        })
        console.log("database connected");

    } catch (error) {
        console.log("database not connected connection1", error.message);
    }
}

export default Connection;