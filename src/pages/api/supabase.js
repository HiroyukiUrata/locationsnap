import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const table = "view_sample";//イメージをBase64変換したカラムを持つビュー


// eslint-disable-next-line import/no-anonymous-default-export
export default async function handler(req, res){
  try {
    const supabase = createClient('https://db.vxejzlohkjrnheqjbuyn.supabase.co/','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4ZWp6bG9oa2pybmhlcWpidXluIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA4MzI4MTgsImV4cCI6MTk5NjQwODgxOH0.uPf7jJgrbmhzR0Bkr58-OnKzMZz8NPqLvwdZMCwijvw')
    const { data, error } = await supabase.from(table).select("*");
       console.log('///////////////////////////////////')
        console.log(data)
        console.log('///////////////////////////////////')    
    if (error) {
      throw error
    }

    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}