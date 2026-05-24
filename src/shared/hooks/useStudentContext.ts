import { getStudentContext, type StudentContextResponse } from '@/shared/api/student';
import { useEffect, useState } from 'react';

export function useStudentContext(enabled: boolean) {
  const [context, setContext] = useState<StudentContextResponse | null>(null);

  useEffect(() => {
    if (!enabled) return;
    void getStudentContext()
      .then(setContext)
      .catch(() => setContext(null));
  }, [enabled]);

  return context;
}
