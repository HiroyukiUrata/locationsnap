import { createClient } from '@supabase/supabase-js'


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const table = "view_sample";//イメージをBase64変換したカラムを持つビュー

const supabase = createClient(supabaseUrl, supabaseKey);

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  try {
    //supabaseに非同期アクセス
    const { data, error } = await supabase.from(table).select("*");

    if (error) {
      throw error
    }

    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
