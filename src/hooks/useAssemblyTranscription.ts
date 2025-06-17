import { useState, useRef } from 'react';

const API_KEY = process.env.NEXT_PUBLIC_ASSEMBLY_API!;

export function useAssemblyTranscription() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState<'idle' | 'listening' | 'processing' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      setTranscript('');
      setError(null);
      setIsRecording(true);
      setStatus('listening');

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        setIsRecording(false);
        setStatus('processing');

        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const file = new File([audioBlob], 'recording.webm');
          const transcription = await transcribe(file);
          setTranscript(transcription);
          setStatus('done');
        } catch (err: any) {
          setError(err.message || 'Error al transcribir');
          setStatus('error');
        }
      };

      mediaRecorder.start();
    } catch (err: any) {
      setError('No se pudo acceder al micrófono');
      setStatus('error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const transcribe = async (audio: File) => {
    const uploadRes = await fetch('https://api.assemblyai.com/v2/upload', {
      method: 'POST',
      headers: { authorization: API_KEY },
      body: audio,
    });

    const { upload_url } = await uploadRes.json();

    const transcriptRes = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        authorization: API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        audio_url: upload_url,
        language_code: 'es',
      }),
    });

    const { id } = await transcriptRes.json();

    return await waitForTranscription(id);
  };

  const waitForTranscription = async (id: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        const res = await fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
          headers: { authorization: API_KEY },
        });
        const data = await res.json();

        if (data.status === 'completed') {
          clearInterval(interval);
          resolve(data.text);
        } else if (data.status === 'error') {
          clearInterval(interval);
          reject(data.error);
        }
      }, 2000);
    });
  };

  return {
    isRecording,
    transcript,
    error,
    status,
    startRecording,
    stopRecording,
  };
}
