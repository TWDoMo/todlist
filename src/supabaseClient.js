// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://spabadsobzyzsqcfqmdi.supabase.co'; // 換成你自己的 Supabase 專案網址
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwYWJhZHNvYnp5enNxY2ZxbWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MDExNjgsImV4cCI6MjA1ODQ3NzE2OH0.C00eHFBQzJ7oGgS228zcGWs3BIUViPknoVpKCNupjIA';        // 換成你自己的匿名金鑰

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
