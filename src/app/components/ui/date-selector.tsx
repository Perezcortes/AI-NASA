'use client';

import { format, subDays, addDays } from 'date-fns';
import { Button } from './button';

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const currentDate = new Date(selectedDate);
  
  const handlePreviousDay = () => {
    const prevDate = subDays(currentDate, 1);
    onDateChange(format(prevDate, 'yyyy-MM-dd'));
  };
  
  const handleNextDay = () => {
    // No permitir seleccionar fechas futuras
    if (format(currentDate, 'yyyy-MM-dd') >= format(new Date(), 'yyyy-MM-dd')) {
      return;
    }
    const nextDate = addDays(currentDate, 1);
    onDateChange(format(nextDate, 'yyyy-MM-dd'));
  };
  
  return (
    <div className="flex items-center justify-center space-x-4 mb-6">
      <Button 
        onClick={handlePreviousDay}
        variant="outline"
        aria-label="Día anterior"
      >
        &larr;
      </Button>
      
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
        max={format(new Date(), 'yyyy-MM-dd')}
        className="bg-gray-800 text-gray-200 rounded-md px-3 py-1 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />
      
      <Button 
        onClick={handleNextDay}
        variant="outline"
        disabled={format(currentDate, 'yyyy-MM-dd') >= format(new Date(), 'yyyy-MM-dd')}
        aria-label="Día siguiente"
      >
        &rarr;
      </Button>
    </div>
  );
}