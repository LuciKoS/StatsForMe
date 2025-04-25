export default function RecentSongsList({ songs }) {
  if (!songs || songs.length === 0) {
    return <p className="text-center text-tokyo-fg">No recent songs available</p>;
  }

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div>
      <p className="text-sm text-tokyo-fg mb-4">
        Showing all {songs.length} tracks listened to in the selected time period, 
        ordered by most recent first.
      </p>
      <div className="overflow-hidden rounded-lg shadow border border-tokyo-purple border-opacity-20">
        <table className="min-w-full divide-y divide-tokyo-purple divide-opacity-20">
          <thead className="bg-black border-b border-tokyo-purple border-opacity-20">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-tokyo-fg-highlight uppercase tracking-wider">
                #
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-tokyo-fg-highlight uppercase tracking-wider">
                Song
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-tokyo-fg-highlight uppercase tracking-wider">
                Artist
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-tokyo-fg-highlight uppercase tracking-wider">
                Album
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-tokyo-fg-highlight uppercase tracking-wider">
                Time Played
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-tokyo-purple divide-opacity-20">
            {songs.map((song, index) => (
              <tr key={song.id || index} className={index % 2 === 0 ? 'bg-black' : 'bg-black border-opacity-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-tokyo-fg-highlight">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-tokyo-fg">
                  {song.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-tokyo-fg-highlight">
                  {song.artist}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-tokyo-fg">
                  {song.album}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-tokyo-cyan">
                  {formatDate(song.time)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 