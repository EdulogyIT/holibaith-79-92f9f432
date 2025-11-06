import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2 } from 'lucide-react';

interface LoadingTimeoutProps {
  onBypass: () => void;
  elapsedSeconds: number;
}

export const LoadingTimeout = ({ onBypass, elapsedSeconds }: LoadingTimeoutProps) => {
  const [message, setMessage] = useState('Calculating your total price...');

  useEffect(() => {
    if (elapsedSeconds > 20) {
      setMessage('Taking longer than expected...');
    } else if (elapsedSeconds > 10) {
      setMessage('Still calculating fees and discounts...');
    }
  }, [elapsedSeconds]);

  if (elapsedSeconds < 10) {
    return (
      <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
          <p className="text-xs text-muted-foreground">{elapsedSeconds}s</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-orange-600" />
        <div className="flex-1">
          <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
            {message}
          </p>
          <p className="text-xs text-orange-700 dark:text-orange-300">
            {elapsedSeconds}s elapsed
          </p>
        </div>
      </div>
      
      {elapsedSeconds > 20 && (
        <Button
          onClick={onBypass}
          variant="outline"
          size="sm"
          className="w-full border-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/40"
        >
          Use Estimated Pricing & Continue
        </Button>
      )}
    </div>
  );
};
