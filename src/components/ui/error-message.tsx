interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-center">
      <p className="text-red-300 mb-3">{message}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded-md text-sm"
      >
        Reintentar
      </button>
    </div>
  );
}