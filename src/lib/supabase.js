import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kmfoxtbiiujcoiwvlsuj.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttZm94dGJpaXVqY29pd3Zsc3VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc0MzM4MTYsImV4cCI6MjA0MzAwOTgxNn0.WF-ESeqmV-J_8BLX4TlXNm1UYc4gr9YVgmtM399AWqQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
