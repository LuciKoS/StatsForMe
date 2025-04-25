import { supabase } from '@/lib/supabaseClient'

async function fetchAllTracks() {
    const batchSize = 1000;
    let offset = 0;
    let allTracks = [];
    
    while (true) {
        const { data: batch, error } = await supabase
            .from('spotistats')
            .select('*')
            .range(offset, offset + batchSize - 1);
            
        if (error) throw error;
        if (!batch || batch.length === 0) break;
        
        allTracks = allTracks.concat(batch);
        offset += batchSize;
        
        console.log(`Fetched batch of ${batch.length} tracks. Total so far: ${allTracks.length}`);
    }
    
    return allTracks;
}

export async function GET(request) {
    const url = new URL(request.url);
    const timeFrame = url.searchParams.get('timeFrame') || 'all';
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    try {
        // Fetch all tracks in batches
        const allTracks = await fetchAllTracks();
        console.log(`Total tracks fetched: ${allTracks.length}`);
        
        // Filter tracks by time period
        let filteredTracks = [...allTracks]; // Make a copy
        
        if (timeFrame !== 'all') {
            const now = new Date();
            let cutoffDate;
            
            switch (timeFrame) {
                case 'today':
                    cutoffDate = new Date(now);
                    cutoffDate.setHours(0, 0, 0, 0);
                    break;
                case 'week':
                    cutoffDate = new Date(now);
                    cutoffDate.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    cutoffDate = new Date(now);
                    cutoffDate.setDate(now.getDate() - 28);
                    break;
                case 'year':
                    cutoffDate = new Date(now.getFullYear(), 0, 1); // Jan 1st of current year
                    break;
                case 'custom':
                    if (startDate && endDate) {
                        cutoffDate = new Date(startDate);
                        const endDateTime = new Date(endDate);
                        endDateTime.setHours(23, 59, 59, 999);
                        
                        filteredTracks = allTracks.filter(track => {
                            if (!track.time) return false;
                            const trackTime = new Date(track.time).getTime();
                            return trackTime >= cutoffDate.getTime() && trackTime <= endDateTime.getTime();
                        });
                        
                        console.log(`Filtered to ${filteredTracks.length} tracks between ${startDate} and ${endDate}`);
                    }
                    break;
                default:
                    cutoffDate = null;
            }
            
            if (cutoffDate && timeFrame !== 'custom') {
                const cutoffTime = cutoffDate.getTime();
                
                filteredTracks = allTracks.filter(track => {
                    if (!track.time) return false;
                    const trackTime = new Date(track.time).getTime();
                    return trackTime >= cutoffTime;
                });
                
                console.log(`Filtered to ${filteredTracks.length} tracks after ${timeFrame} filter (cutoff: ${cutoffDate.toISOString()})`);
            }
        }
        
        // Group by artist and count
        const artistMap = {};
        
        filteredTracks.forEach(track => {
            if (!track.artist) return;
            
            if (!artistMap[track.artist]) {
                artistMap[track.artist] = {
                    artist: track.artist,
                    count: 0
                };
            }
            
            artistMap[track.artist].count += 1;
        });
        
        // Convert to array, sort by play count, and apply limit
        const topArtists = Object.values(artistMap)
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
        
        console.log(`Top artist: ${topArtists[0]?.artist} with ${topArtists[0]?.count} plays`);
        
        return new Response(JSON.stringify(topArtists), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        });
    } catch (error) {
        console.error('Error in topArtists endpoint:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500
        });
    }
} 