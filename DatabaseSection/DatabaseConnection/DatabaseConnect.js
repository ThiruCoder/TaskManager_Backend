import mongoose from "mongoose";

const DatabaseConnection = () => {
    try {
        const uri = process.env.DATABASE_URI
        if (uri) {
            mongoose.connect(uri)
                .then(() => {
                    console.log(`Successfully connected to the database`)
                }).catch((err) => {
                    console.error(`Connection error: ${err}`)
                })
        } else {
            console.error(`URI is not found try again...`)
        }
    } catch (error) {
        new Error(error)
        process.exit(1)
    }
}

export { DatabaseConnection }