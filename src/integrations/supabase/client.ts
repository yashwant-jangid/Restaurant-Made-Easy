// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://fyjjprntuuopguzeifuu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5ampwcm50dXVvcGd1emVpZnV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNzc1NjgsImV4cCI6MjA1Njg1MzU2OH0.7SIq8jf3qhxDRMBjQn72MovWmfFtnwM5kUhad0c29LI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);