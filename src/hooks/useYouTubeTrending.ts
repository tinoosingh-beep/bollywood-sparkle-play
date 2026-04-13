import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { YouTubeTrendingVideo } from '@/components/video/YouTubeTrendingCard';

async function fetchTrending(): Promise<YouTubeTrendingVideo[]> {
  const { data, error } = await supabase.functions.invoke('youtube-trending');

  if (error) throw new Error(error.message || 'Failed to fetch trending videos');
  return data?.videos || [];
}

export function useYouTubeTrending() {
  return useQuery({
    queryKey: ['youtube-trending'],
    queryFn: fetchTrending,
    staleTime: 10 * 60 * 1000,
    refetchInterval: 15 * 60 * 1000,
  });
}
