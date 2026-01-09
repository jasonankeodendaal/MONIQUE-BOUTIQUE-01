
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export function useLiveTable<T>(tableName: string, initialData: T[] = []) {
  const [data, setData] = useState<T[]>(initialData);

  useEffect(() => {
    // 1. Initial Fetch if empty (optional, but good for sync)
    if (initialData.length === 0) {
      supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)
        .then(({ data: fetched }) => {
          if (fetched) setData(fetched as T[]);
        });
    } else {
        setData(initialData);
    }

    // 2. Realtime Subscription
    const channel: RealtimeChannel = supabase
      .channel(`public:${tableName}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: tableName },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setData((prev) => [payload.new as T, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setData((prev) => prev.map((item: any) => 
              item.id === payload.new.id ? payload.new : item
            ));
          } else if (payload.eventType === 'DELETE') {
            setData((prev) => prev.filter((item: any) => item.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableName]);

  return data;
}
