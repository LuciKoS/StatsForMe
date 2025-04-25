export default function SongList({ songs }) {
  if (!songs || songs.length === 0) {
    return <p className="text-center text-tokyo-fg">No song data available</p>;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 text-tokyo-purple">Top 100 Songs</h3>
      <div className="overflow-hidden rounded-lg shadow border border-tokyo-purple border-opacity-20">
        <table className="min-w-full divide-y divide-tokyo-purple divide-opacity-20">
          <thead className="bg-black border-b border-tokyo-purple border-opacity-20">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-tokyo-fg-highlight uppercase tracking-wider">
                Rank
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-tokyo-fg-highlight uppercase tracking-wider">
                Song
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-tokyo-fg-highlight uppercase tracking-wider">
                Artist
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-tokyo-fg-highlight uppercase tracking-wider">
                Plays
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-tokyo-purple divide-opacity-20">
            {songs.map((song, index) => (
              <tr key={song.trackId || index} className={index % 2 === 0 ? 'bg-black' : 'bg-black border-opacity-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-tokyo-fg-highlight">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-tokyo-fg">
                  {song.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-tokyo-fg-highlight">
                  {song.artist}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-tokyo-purple font-medium">
                  {song.count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 