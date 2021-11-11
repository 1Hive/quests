import { useToast } from '@1hive/1hive-ui';
import { writeText as copy } from 'clipboard-polyfill';
import { useCallback } from 'react';

export function useCopyToClipboard() {
  const toast = useToast();
  return useCallback(
    (text, confirmationMessage = 'Copied') => {
      copy(text);
      if (confirmationMessage) {
        toast(confirmationMessage);
      }
    },
    [toast],
  );
}
