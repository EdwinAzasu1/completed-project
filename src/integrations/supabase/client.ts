// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://yaowqttoqaebcxnosuxq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlhb3dxdHRvcWFlYmN4bm9zdXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MjI0MzIsImV4cCI6MjA1MTM5ODQzMn0.M_KbBkWwDiHs21_oLZSqfX_sl9kkR1QM4Qc-GCYsE6Q";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);