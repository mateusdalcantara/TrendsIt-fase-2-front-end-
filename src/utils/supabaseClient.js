// In src/utils/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// Add error handling
if (!process.env.REACT_APP_SUPABASE_URL || !process.env.REACT_APP_SUPABASE_ANON_KEY) {
  throw Error('Missing Supabase credentials! Check .env file')
}

export const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
)