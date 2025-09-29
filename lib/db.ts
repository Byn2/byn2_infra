import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
    );
}

// Enhanced connection pooling configuration
const connectionOptions = {
    maxPoolSize: 20, // Increased from 10 to handle more concurrent connections
    serverSelectionTimeoutMS: 15000, // Increased from 5000ms to 15000ms for webhook reliability
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    bufferMaxEntries: 0, // Disable buffering to fail fast instead of queuing
    family: 4, // Use IPv4, skip trying IPv6
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

// Function to ensure connection before operations with retry logic
export async function ensureConnection(retries = 3): Promise<void> {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            if (!isConnected()) {
                await connectDB();
            }
            return; // Success
        } catch (error) {
            console.error(`Connection attempt ${attempt} failed:`, error);
            
            if (attempt === retries) {
                throw new Error(`Failed to establish database connection after ${retries} attempts`);
            }
            
            // Exponential backoff: 1s, 2s, 4s
            const delay = Math.pow(2, attempt - 1) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}