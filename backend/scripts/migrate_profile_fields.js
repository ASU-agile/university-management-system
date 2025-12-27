
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from backend root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { Client } = pg;

async function migrate() {
    if (!process.env.DATABASE_URL) {
        console.error("Error: DATABASE_URL not found in .env");
        console.error("Please ensure you have a standard PostgreSQL connection string in your .env file.");
        process.exit(1);
    }

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();
        console.log("Connected to database.");

        console.log("Adding 'bio' column...");
        await client.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;");

        console.log("Adding 'profile_picture_url' column...");
        await client.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture_url TEXT;");

        console.log("Adding 'certificates' column...");
        await client.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS certificates JSONB DEFAULT '[]'::jsonb;");

        console.log("Migration completed successfully.");
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        await client.end();
    }
}

migrate();
