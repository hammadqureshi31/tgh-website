import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

// Use Service Role to bypass RLS for this fix
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('Fixing published blog posts with null published_at date...');
  
  const { data, error } = await supabase
    .from('blog_posts')
    .update({ published_at: new Date().toISOString() })
    .eq('status', 'published')
    .is('published_at', null)
    .select();
  
  if (error) {
    console.error('Error updating blog posts:', error);
  } else {
    console.log(`Successfully updated ${data.length} post(s).`);
    console.log('Your blog posts should now appear on the /blog page!');
  }
}

main();