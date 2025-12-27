//..backend/db/supabase.js
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase environment variables');
}

export const supabasePriv = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
    }
});

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);