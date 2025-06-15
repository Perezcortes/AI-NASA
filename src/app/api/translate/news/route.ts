import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { title, explanation, to } = await req.json();

    if (!title || !explanation || !to) {
      return NextResponse.json(
        { error: 'Faltan campos: title, explanation o to' },
        { status: 400 }
      );
    }

    const prompt = `Como experto traductor científico de la NASA, traduce al ${to}:

Título: "${title}"
Descripción: "${explanation}"

Devuelve SOLO un JSON válido:
{
  "title": "[traducción del título]",
  "explanation": "[traducción de la descripción]"
}`;

    const apiKey = process.env.GEMINI_API_KEY;
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error('Sin contenido');

    const start = text.indexOf('{');
    const end = text.lastIndexOf('}') + 1;
    const parsed = JSON.parse(text.slice(start, end));

    return NextResponse.json({ translations: parsed }, { status: 200 });
  } catch (err) {
    console.error('Error en traducción de noticias:', err);
    return NextResponse.json({ error: 'Error en traducción', translations: null }, { status: 500 });
  }
}
