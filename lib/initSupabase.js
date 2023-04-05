import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseUrl = 'https://tjbnctcjsthtujlgnixu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqYm5jdGNqc3RodHVqbGduaXh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjU3MjYyODksImV4cCI6MTk4MTMwMjI4OX0.hTYZJqmYiZ_vsOzpCbKjM74q5wHnO9Qtnf62L7gXe7Q';
export const supabase = createClient(supabaseUrl, supabaseKey);
