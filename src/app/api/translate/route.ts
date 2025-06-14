import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { title, explanation, to } = await req.json();

    // Validación básica
    if (!title || !explanation || !to) {
      return NextResponse.json(
        { error: 'Se requieren título, explicación y lenguaje destino' }, 
        { status: 400 }
      );
    }

    // Limitar longitud para evitar costos altos
    const MAX_LENGTH = 5000;
    const truncatedExplanation = explanation.length > MAX_LENGTH 
      ? explanation.substring(0, MAX_LENGTH) + "... [texto truncado]"
      : explanation;

    // Prompt optimizado para contenido astronómico
    const prompt = `Como experto traductor científico de la NASA, traduce al ${to} manteniendo el significado preciso y terminología técnica:
    
    Título: "${title}"
    Descripción: "${truncatedExplanation}"

    Instrucciones:
    1. Conserva nombres propios y términos técnicos en inglés
    2. Mantén el tono científico pero accesible
    3. No añadas comentarios ni texto adicional

    Devuelve SOLO un JSON válido:
    {
      "title": "[traducción del título]",
      "explanation": "[traducción de la descripción]"
    }`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('API key no configurada');
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error de Gemini:', errorData);
      throw new Error(`API Gemini respondió con ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!responseText) {
      throw new Error('Respuesta vacía de Gemini');
    }

    // Extracción robusta del JSON
    try {
      const jsonStart = responseText.indexOf('{');
      const jsonEnd = responseText.lastIndexOf('}') + 1;
      const jsonString = responseText.slice(jsonStart, jsonEnd);
      const result = JSON.parse(jsonString);

      if (!result.title || !result.explanation) {
        throw new Error('Formato de traducción inválido');
      }

      return NextResponse.json({ translations: result }, { status: 200 });
    } catch (parseError) {
      console.error('Error parseando respuesta:', parseError, 'Respuesta:', responseText);
      throw new Error('Error procesando la traducción');
    }
  } catch (err) {
    console.error('Error en /api/translate:', err);
    return NextResponse.json(
      { 
        error: err instanceof Error ? err.message : 'Error interno en el servidor',
        translations: null 
      },
      { status: 500 }
    );
  }
}