import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
    );
}

// Enhanced connection pooling configuration
const connectionOptions = {
    bufferCommands: false,
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    bufferMaxEntries: 0, // Disable mongoose buffering
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cached = (global as any).mongoose || {conn: null, promise: null}

// Singleton pattern for database connection
export async function connectDB(){
    // Return existing connection if available
    if (cached.conn && mongoose.connection.readyState === 1) {
        return cached.conn;
    }

    if (!cached.promise) {
        console.log('Establishing MongoDB connection...');
        cached.promise = mongoose.connect(MONGODB_URI as string, connectionOptions)
            .then((mongoose) => {
                console.log('MongoDB connected successfully');
                return mongoose;
            })
            .catch((error) => {
                console.error('MongoDB connection error:', error);
                cached.promise = null; // Reset promise on error
                throw error;
            });
    }

    try {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) {
        cached.promise = null; // Reset promise on error
        throw error;
    }
}

// Function to check if database is connected
export function isConnected(): boolean {
    return mongoose.connection.readyState === 1;
}

// Function to ensure connection before operations
export async function ensureConnection() {
    if (!isConnected()) {
        await connectDB();
    }
}