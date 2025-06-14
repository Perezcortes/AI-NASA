interface LoaderProps {
  message?: string;
}

export function Loader({ message = "Cargando..." }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-400">{message}</p>
    </div>
  );
}