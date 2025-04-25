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
    
    // Genre mapping to consolidate similar genres
    const genre_mapping = {
        // Jazz mapping
        'jazz rap': 'Jazz Fusion',
        'french jazz': 'Jazz Fusion',
        'jazz fusion': 'Jazz Fusion',
        'jazz beats': 'Jazz Fusion',
        'nu jazz': 'Jazz Fusion',
        'jazz': 'Jazz',
        'contemporary jazz': 'Jazz',
        'bebop': 'Jazz',
        'smooth jazz': 'Jazz',

        // Classical mapping
        'classical': 'Classical',
        'classical piano': 'Classical',
        'modern classical': 'Classical',
        'classical performance': 'Classical',
        'chamber music': 'Classical',
        'orchestral': 'Classical',
        'opera': 'Classical',
        'baroque': 'Classical',
        'romantic': 'Classical',
        'piano': 'Classical',
        'symphony': 'Classical',
        'concerto': 'Classical',
        'neoclassical': 'Classical',

        // Asian genres kept individually
        'chinese hip hop': 'Chinese Hip Hop',
        'chinese r&b': 'Chinese Hip Hop',
        'chinese indie': 'Chinese Indie',
        'chinese rock': 'Chinese Rock',
        'shoegaze': 'Shoegaze',
        'dream pop': 'Dream Pop',
        'mandopop': 'Mandopop',
        'c-pop': 'C-Pop',
        'cantopop': 'Cantopop',
        'j-pop': 'J-Pop',
        'j-rock': 'J-Rock',
        'k-pop': 'K-Pop',
        'k-rap': 'K-Pop',
        'k-indie': 'K-Pop',
        
        // European genres kept individually
        'german pop': 'German Pop',
        'neue deutsche welle': 'Neue Deutsche Welle',
        'schlager': 'Schlager',
        'french pop': 'French Pop',
        'italian pop': 'Italian Pop',
        'swedish pop': 'Swedish Pop',
        'spanish pop': 'Spanish Pop',
        
        // Electronic subgenres
        'phonk': 'Phonk',
        'drift phonk': 'Phonk',
        'electro': 'Electronic',
        'electro swing': 'Electronic',
        'electronic': 'Electronic',
        'electroclash': 'Electronic',
        'french house': 'Electronic',
        'house': 'House',
        'deep house': 'House',
        'tech house': 'House',
        'progressive house': 'House',
        'ambient': 'Ambient',
        'ambient techno': 'Ambient',
        'chillout': 'Ambient',
        'downtempo': 'Ambient',
        'lofi': 'Lo-Fi',
        'lo-fi': 'Lo-Fi',
        'lo-fi beats': 'Lo-Fi',
        'instrumental lo-fi': 'Lo-Fi',
        'study beats': 'Lo-Fi',
        'frenchcore': 'Tekk',
        'tekno': 'Tekk',
        'hardtek': 'Tekk',
        'hardstyle': 'Hard Dance',
        'hardcore techno': 'Hard Dance',
        'gabber': 'Hard Dance',
        'witch house': 'Wave',
        'dark trap': 'Wave',
        'darkwave': 'Wave',
        'synthwave': 'Wave',
        'vaporwave': 'Wave',
        'chillwave': 'Wave',
        'future bass': 'Wave',
        'dubstep': 'Bass Music',
        'drum and bass': 'Bass Music',
        'jungle': 'Bass Music',
        'breakbeat': 'Bass Music',
        'breakcore': 'Bass Music',
        'garage': 'Bass Music',
        'uk garage': 'Bass Music',

        // Hip Hop categories
        'hip hop': 'Hip Hop',
        'east coast hip hop': 'Hip Hop',
        'hardcore hip hop': 'Hip Hop',
        'west coast hip hop': 'Hip Hop',
        'southern hip hop': 'Hip Hop',
        'alternative hip hop': 'Alternative Hip Hop',
        'underground hip hop': 'Alternative Hip Hop',
        'conscious hip hop': 'Alternative Hip Hop',
        'boom bap': 'Old School Hip Hop',
        'gangsta rap': 'Rap',
        'trap': 'Trap',
        'melodic trap': 'Trap',
        'drill': 'Trap',
        'mumble rap': 'Trap',
        'emo rap': 'Emo Rap',
        'soundcloud rap': 'Emo Rap',

        // Electronic dance
        'edm': 'EDM',
        'big room': 'EDM',
        'slap house': 'EDM',
        'festival': 'EDM',
        'dance pop': 'EDM',
        'electropop': 'EDM',
        'techno': 'Techno',
        'hard techno': 'Techno',
        'minimal techno': 'Techno',
        'detroit techno': 'Techno',
        'trance': 'Trance',
        'psytrance': 'Trance',
        'progressive trance': 'Trance',
        'uplifting trance': 'Trance',

        // Pop
        'pop': 'Pop',
        'indie pop': 'Indie Pop',
        'bedroom pop': 'Indie Pop',
        'art pop': 'Indie Pop',

        // Rock subgenres
        'alternative rock': 'Alt Rock',
        'art rock': 'Alt Rock',
        'indie rock': 'Alt Rock',
        'alternative metal': 'Alt Rock',
        'nu metal': 'Alt Rock',
        'rap metal': 'Alt Rock',
        'punk': 'Punk Rock',
        'pop punk': 'Punk Rock',
        'post-punk': 'Punk Rock',
        'metal': 'Metal',
        'heavy metal': 'Metal',
        'death metal': 'Metal',
        'black metal': 'Metal',
        'progressive metal': 'Metal',
        'grunge': 'Grunge',
        'post-grunge': 'Grunge',

        // Modern/experimental
        'hyperpop': 'Hyperpop',
        'cloud rap': 'Hyperpop',
        'experimental': 'Experimental',
        'avant-garde': 'Experimental',
        'noise': 'Experimental',
        'glitch': 'Experimental',

        // Latin Music
        'latin': 'Latin',
        'reggaeton': 'Latin',
        'latin pop': 'Latin',
        'latin trap': 'Latin',
        'salsa': 'Latin',
        'bachata': 'Latin',

        // Folk & Country
        'folk': 'Folk',
        'indie folk': 'Folk',
        'acoustic': 'Folk',
        'singer-songwriter': 'Folk',
        'country': 'Country',
        'alternative country': 'Country',
        'americana': 'Country',

        // R&B and Soul
        'r&b': 'R&B',
        'soul': 'R&B',
        'neo soul': 'R&B',
        'contemporary r&b': 'R&B',
        'funk': 'Funk & Soul',
        'disco': 'Funk & Soul',
        'motown': 'Funk & Soul',

        // Reggae and related
        'reggae': 'Reggae',
        'dub': 'Reggae',
        'ska': 'Reggae',
        'dancehall': 'Reggae',
    };
    
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
        
        // First get unique tracks by trackId (we don't want to count duplicates of the same track)
        const uniqueTracks = {};
        filteredTracks.forEach(track => {
            if (!track.trackId || !track.genres) return;
            // Keep the first occurrence of each track
            if (!uniqueTracks[track.trackId]) {
                uniqueTracks[track.trackId] = track;
            }
        });
        
        // Now count genres from unique tracks
        const genreMap = {};
        
        Object.values(uniqueTracks).forEach(track => {
            if (!track.genres) return;
            
            // Split genres string and process each genre
            const genreList = track.genres.split(', ');
            const processedGenres = new Set(); // To avoid double-counting genres for this track
            
            genreList.forEach(genre => {
                if (!genre) return;
                
                // Map the genre if needed
                const normalizedGenre = genre.toLowerCase();
                const mappedGenre = genre_mapping[normalizedGenre] || genre;
                
                // Only count each genre once per track
                if (!processedGenres.has(mappedGenre)) {
                    processedGenres.add(mappedGenre);
                    
                    // Count this genre
                    if (!genreMap[mappedGenre]) {
                        genreMap[mappedGenre] = { 
                            genre: mappedGenre, 
                            count: 0 
                        };
                    }
                    
                    genreMap[mappedGenre].count += 1;
                }
            });
        });
        
        // Convert to array, sort by count, and apply limit
        const topGenres = Object.values(genreMap)
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
        
        console.log(`Top genre: ${topGenres[0]?.genre} with ${topGenres[0]?.count} tracks`);
        
        return new Response(JSON.stringify(topGenres), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        });
    } catch (error) {
        console.error('Error in topGenres endpoint:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500
        });
    }
} 