export default function GenreList({ genres }) {
  if (!genres || genres.length === 0) {
    return <p className="text-center text-tokyo-fg">No genre data available</p>;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 text-tokyo-green">Top 100 Genres</h3>
      <div className="overflow-hidden rounded-lg shadow border border-tokyo-green border-opacity-20">
        <table className="min-w-full divide-y divide-tokyo-green divide-opacity-20">
          <thead className="bg-black border-b border-tokyo-green border-opacity-20">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-tokyo-fg-highlight uppercase tracking-wider">
                Rank
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-tokyo-fg-highlight uppercase tracking-wider">
                Genre
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-tokyo-fg-highlight uppercase tracking-wider">
                Count
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-tokyo-green divide-opacity-20">
            {genres.map((genre, index) => (
              <tr key={genre.genre || index} className={index % 2 === 0 ? 'bg-black' : 'bg-black border-opacity-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-tokyo-fg-highlight">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-tokyo-fg">
                  {genre.genre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-tokyo-green font-medium">
                  {genre.count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 