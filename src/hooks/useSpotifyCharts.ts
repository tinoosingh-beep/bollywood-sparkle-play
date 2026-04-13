import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SpotifyChartTrack {
  rank: number;
  title: string;
  artist: string;
  albumArt: string;
  trackUrl: string;
  artistUrl: string;
}

// Well-known Spotify editorial playlist IDs for India
export const SPOTIFY_INDIA_PLAYLISTS = {
  top50: '37i9dQZEVXbLZ52XmnySJg',
  viral50: '37i9dQZEVXbMWDif5SCBJq',
  bollywoodHits: '37i9dQZF1DX0XUfTFmNBRM',
  bollywoodButter: '37i9dQZF1DWVlYsZJXqdMm',
} as const;

export function useSpotifyCharts() {
  return useQuery({
    queryKey: ['spotify-charts'],
    queryFn: async (): Promise<{ tracks: SpotifyChartTrack[]; chartTitle: string }> => {
      const { data, error } = await supabase.functions.invoke('spotify-charts');
      if (error) throw new Error(error.message);
      return data;
    },
    staleTime: 30 * 60 * 1000,
    refetchInterval: 60 * 60 * 1000,
  });
}
