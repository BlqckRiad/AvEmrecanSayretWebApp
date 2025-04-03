import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    const { error } = await supabase
      .from('iletisim')
      .insert([
        {
          name,
          email,
          phone,
          subject,
          message,
          is_checked: false
        }
      ]);

    if (error) throw error;

    return NextResponse.json({ message: 'Mesaj başarıyla kaydedildi.' }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.' },
      { status: 500 }
    );
  }
} 