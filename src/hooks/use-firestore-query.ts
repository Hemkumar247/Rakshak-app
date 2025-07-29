// src/hooks/use-firestore-query.ts
import { useState, useEffect } from 'react';
import { onSnapshot, Query } from 'firebase/firestore';

interface UseFirestoreQueryState<T> {
  status: 'loading' | 'success' | 'error';
  data: T[];
  error: Error | null;
}

export function useFirestoreQuery<T>(query: Query): UseFirestoreQueryState<T> {
  const [state, setState] = useState<UseFirestoreQueryState<T>>({
    status: 'loading',
    data: [],
    error: null,
  });

  useEffect(() => {
    setState({ status: 'loading', data: [], error: null });

    const unsubscribe = onSnapshot(
      query,
      (querySnapshot) => {
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setState({ status: 'success', data, error: null });
      },
      (error) => {
        console.error("Firestore query error:", error);
        setState({ status: 'error', data: [], error });
      }
    );

    // Unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, [JSON.stringify(query)]); // Re-run effect if query changes. NOTE: This is a simple serialization. For complex queries, you might need a more robust approach.

  return state;
}
