"use client";

import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'chart.js/auto';
import SongList from "./components/SongList";
import ArtistList from "./components/ArtistList";
import GenreList from "./components/GenreList";
import RecentSongsList from "./components/RecentSongsList";

export default function HomePage() {
  const [timeFrame, setTimeFrame] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [chartType, setChartType] = useState("songs"); // songs, artists, genres, or recent
  const [topSongs, setTopSongs] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [topGenres, setTopGenres] = useState([]);
  const [recentSongs, setRecentSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartLimit = 20; // Display top 20 items in chart
  const listLimit = 100; // Display top 100 items in lists

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Construct the URL with timeFrame and date range if custom
      let timeParams = timeFrame;
      if (timeFrame === 'custom' && startDate && endDate) {
        timeParams = `timeFrame=${timeFrame}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
      } else if (timeFrame !== 'custom') {
        timeParams = `timeFrame=${timeFrame}`;
      }
      
      // Fetch top songs - get 100 for the list
      const songsRes = await fetch(`/api/stats/topSongs?${timeParams}&limit=${listLimit}`);
      if (!songsRes.ok) {
        throw new Error(`Songs API returned ${songsRes.status}: ${await songsRes.text()}`);
      }
      const songsData = await songsRes.json();
      setTopSongs(songsData);

      // Fetch top artists - get 100 for the list
      const artistsRes = await fetch(`/api/stats/topArtists?${timeParams}&limit=${listLimit}`);
      if (!artistsRes.ok) {
        throw new Error(`Artists API returned ${artistsRes.status}: ${await artistsRes.text()}`);
      }
      const artistsData = await artistsRes.json();
      setTopArtists(artistsData);

      // Fetch top genres - get 100 for the list
      const genresRes = await fetch(`/api/stats/topGenres?${timeParams}&limit=${listLimit}`);
      if (!genresRes.ok) {
        throw new Error(`Genres API returned ${genresRes.status}: ${await genresRes.text()}`);
      }
      const genresData = await genresRes.json();
      setTopGenres(genresData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentSongs = async () => {
    try {
      // Also add timeFrame to recent songs request if not "all"
      let timeParams = '';
      if (timeFrame === 'custom' && startDate && endDate) {
        timeParams = `timeFrame=${timeFrame}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
      } else if (timeFrame !== 'all') {
        timeParams = `timeFrame=${timeFrame}`;
      }
      
      // Remove the limit parameter to fetch all songs in the time period
      const recentRes = await fetch(`/api/stats/recentSongs?${timeParams}`);
      if (!recentRes.ok) {
        throw new Error(`Recent songs API returned ${recentRes.status}: ${await recentRes.text()}`);
      }
      const recentData = await recentRes.json();
      setRecentSongs(recentData);
    } catch (error) {
      console.error("Error fetching recent songs:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchData();
    // Fetch recent songs when chartType is 'recent'
    if (chartType === 'recent') {
      fetchRecentSongs();
    }
  }, [timeFrame, startDate, endDate, chartType]);

  // Tokyo Night Colors for charts
  const backgroundColors = [
    'rgba(122, 162, 247, 0.7)', // tokyo-blue
    'rgba(187, 154, 247, 0.7)', // tokyo-purple
    'rgba(125, 207, 255, 0.7)', // tokyo-cyan
    'rgba(255, 158, 100, 0.7)', // tokyo-orange
    'rgba(158, 206, 106, 0.7)', // tokyo-green
    'rgba(247, 118, 142, 0.7)', // tokyo-magenta
    'rgba(224, 175, 104, 0.7)', // tokyo-yellow
    'rgba(169, 177, 214, 0.7)', // tokyo-fg
    'rgba(192, 202, 245, 0.7)', // tokyo-fg-highlight
    'rgba(173, 142, 230, 0.7)', // custom purple
    'rgba(102, 187, 230, 0.7)', // custom blue
    'rgba(235, 134, 164, 0.7)', // custom pink
    'rgba(134, 220, 209, 0.7)', // custom teal
    'rgba(245, 169, 127, 0.7)', // custom orange
    'rgba(113, 190, 147, 0.7)', // custom green
    'rgba(210, 144, 249, 0.7)', // custom lavender
    'rgba(128, 203, 237, 0.7)', // custom sky blue
    'rgba(229, 192, 123, 0.7)', // custom sand
    'rgba(187, 225, 159, 0.7)', // custom lime
    'rgba(233, 151, 194, 0.7)', // custom rose
  ];

  // Chart configurations
  const songsChartData = {
    labels: topSongs.slice(0, chartLimit).map(song => song.name),
    datasets: [
      {
        label: 'Play Count',
        data: topSongs.slice(0, chartLimit).map(song => song.count),
        backgroundColor: backgroundColors.slice(0, chartLimit),
        borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
        borderWidth: 1,
      },
    ],
  };

  const artistsChartData = {
    labels: topArtists.slice(0, chartLimit).map(artist => artist.artist),
    datasets: [
      {
        label: 'Play Count',
        data: topArtists.slice(0, chartLimit).map(artist => artist.count),
        backgroundColor: backgroundColors.slice(0, chartLimit),
        borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
        borderWidth: 1,
      },
    ],
  };

  const genresChartData = {
    labels: topGenres.slice(0, chartLimit).map(genre => genre.genre),
    datasets: [
      {
        label: 'Play Count',
        data: topGenres.slice(0, chartLimit).map(genre => genre.count),
        backgroundColor: backgroundColors.slice(0, chartLimit),
        borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          color: '#a9b1d6' // tokyo-fg
        },
        grid: {
          color: 'rgba(169, 177, 214, 0.1)' // tokyo-fg with opacity
        },
        border: {
          color: 'rgba(169, 177, 214, 0.2)'
        }
      },
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
          color: '#c0caf5', // tokyo-fg-highlight
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(169, 177, 214, 0.05)' // tokyo-fg with opacity
        },
        border: {
          color: 'rgba(169, 177, 214, 0.2)'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(36, 40, 59, 0.9)', // tokyo-bg-highlight
        titleColor: '#c0caf5', // tokyo-fg-highlight
        bodyColor: '#a9b1d6', // tokyo-fg
        borderColor: 'rgba(187, 154, 247, 0.5)', // tokyo-purple
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        }
      }
    },
    barPercentage: 0.85,
    categoryPercentage: 0.95,
    backgroundColor: '#000000'
  };

  // Render the appropriate chart based on selected type
  const renderChart = () => {
    switch (chartType) {
      case "songs":
        return (
          <>
            <div style={{ height: "500px", width: "100%" }}>
              {topSongs.length > 0 ? (
                <Bar data={songsChartData} options={chartOptions} />
              ) : (
                <p className="text-center text-tokyo-fg">No song data available</p>
              )}
            </div>
            <div className="mt-8">
              <SongList songs={topSongs} />
            </div>
          </>
        );
      case "artists":
        return (
          <>
            <div style={{ height: "500px", width: "100%" }}>
              {topArtists.length > 0 ? (
                <Bar data={artistsChartData} options={chartOptions} />
              ) : (
                <p className="text-center text-tokyo-fg">No artist data available</p>
              )}
            </div>
            <div className="mt-8">
              <ArtistList artists={topArtists} />
            </div>
          </>
        );
      case "genres":
        return (
          <>
            <div style={{ height: "500px", width: "100%" }}>
              {topGenres.length > 0 ? (
                <Bar data={genresChartData} options={chartOptions} />
              ) : (
                <p className="text-center text-tokyo-fg">No genre data available</p>
              )}
            </div>
            <div className="mt-8">
              <GenreList genres={topGenres} />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-10 text-center text-tokyo-fg-highlight">
        <span className="text-tokyo-purple">Spotify</span> Listening Stats
      </h1>
      
      {/* Control panel with filters */}
      <div className="flex flex-wrap justify-center items-start gap-6 mb-8">
        {/* Chart type selector - LEFT */}
        <div className="tokyo-card p-4 rounded-lg shadow-md border border-opacity-20">
          <p className="text-xs text-tokyo-fg mb-3 text-center font-medium">View</p>
          <div className="inline-flex flex-col gap-2" role="group">
            <button
              onClick={() => setChartType("songs")}
              className={`tokyo-btn px-4 py-2 text-sm font-medium rounded-md ${
                chartType === "songs"
                  ? "tokyo-btn-active"
                  : "tokyo-btn-inactive"
              }`}
            >
              Songs
            </button>
            <button
              onClick={() => setChartType("artists")}
              className={`tokyo-btn px-4 py-2 text-sm font-medium rounded-md ${
                chartType === "artists"
                  ? "tokyo-btn-active"
                  : "tokyo-btn-inactive"
              }`}
            >
              Artists
            </button>
            <button
              onClick={() => setChartType("genres")}
              className={`tokyo-btn px-4 py-2 text-sm font-medium rounded-md ${
                chartType === "genres"
                  ? "tokyo-btn-active"
                  : "tokyo-btn-inactive"
              }`}
            >
              Genres
            </button>
            <button
              onClick={() => setChartType("recent")}
              className={`tokyo-btn px-4 py-2 text-sm font-medium rounded-md ${
                chartType === "recent"
                  ? "tokyo-blue-btn-active"
                  : "tokyo-btn-inactive"
              }`}
            >
              Recent Plays
            </button>
          </div>
        </div>
        
        {/* Time period selector - CENTER */}
        <div className="tokyo-card p-4 rounded-lg shadow-md border border-opacity-20">
          <p className="text-xs text-tokyo-fg mb-3 text-center font-medium">Time Period</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setTimeFrame("today");
                setStartDate(null);
                setEndDate(null);
              }}
              className={`tokyo-btn px-4 py-2 text-sm font-medium rounded-md ${
                timeFrame === "today"
                  ? "tokyo-btn-active"
                  : "tokyo-btn-inactive"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => {
                setTimeFrame("week");
                setStartDate(null);
                setEndDate(null);
              }}
              className={`tokyo-btn px-4 py-2 text-sm font-medium rounded-md ${
                timeFrame === "week"
                  ? "tokyo-btn-active"
                  : "tokyo-btn-inactive"
              }`}
            >
              Last Week
            </button>
            <button
              onClick={() => {
                setTimeFrame("month");
                setStartDate(null);
                setEndDate(null);
              }}
              className={`tokyo-btn px-4 py-2 text-sm font-medium rounded-md ${
                timeFrame === "month"
                  ? "tokyo-btn-active"
                  : "tokyo-btn-inactive"
              }`}
            >
              Last 4 Weeks
            </button>
            <button
              onClick={() => {
                setTimeFrame("year");
                setStartDate(null);
                setEndDate(null);
              }}
              className={`tokyo-btn px-4 py-2 text-sm font-medium rounded-md ${
                timeFrame === "year"
                  ? "tokyo-btn-active"
                  : "tokyo-btn-inactive"
              }`}
            >
              This Year
            </button>
            <button
              onClick={() => {
                setTimeFrame("all");
                setStartDate(null);
                setEndDate(null);
              }}
              className={`tokyo-btn px-4 py-2 text-sm font-medium rounded-md ${
                timeFrame === "all"
                  ? "tokyo-btn-active"
                  : "tokyo-btn-inactive"
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => {
                setTimeFrame("custom");
              }}
              className={`tokyo-btn px-4 py-2 text-sm font-medium rounded-md ${
                timeFrame === "custom"
                  ? "tokyo-btn-active"
                  : "tokyo-btn-inactive"
              }`}
            >
              Custom Range
            </button>
          </div>
          
          {/* Custom date range picker */}
          {timeFrame === "custom" && (
            <div className="mt-4 flex flex-col items-center gap-3">
              <div className="flex items-center gap-2">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  maxDate={endDate || new Date()}
                  placeholderText="Start Date"
                  className="p-2 border rounded-md text-center bg-tokyo-bg text-tokyo-fg border-tokyo-purple focus:outline-none focus:ring-2 focus:ring-tokyo-purple focus:border-transparent"
                  dateFormat="MMM d, yyyy"
                />
                <span className="text-sm text-tokyo-fg">to</span>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  maxDate={new Date()}
                  placeholderText="End Date"
                  className="p-2 border rounded-md text-center bg-tokyo-bg text-tokyo-fg border-tokyo-purple focus:outline-none focus:ring-2 focus:ring-tokyo-purple focus:border-transparent"
                  dateFormat="MMM d, yyyy"
                />
              </div>
              <p className="text-xs text-tokyo-fg opacity-80">
                {startDate && endDate ? 
                  `Showing stats from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}` : 
                  'Select a date range'}
              </p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-opacity-20 bg-red-900 border border-tokyo-magenta text-tokyo-magenta px-4 py-3 rounded-lg mb-6" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tokyo-purple"></div>
        </div>
      ) : (
        <div className="tokyo-card p-6 rounded-lg shadow-md w-full max-w-[1500px] mx-auto">
          {chartType === "recent" ? (
            <>
              <h2 className="text-2xl font-semibold mb-6 text-tokyo-purple">
                All Played Tracks
              </h2>
              <RecentSongsList songs={recentSongs} />
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-6 text-tokyo-purple">
                {chartType === "songs" ? "Top Songs" : chartType === "artists" ? "Top Artists" : "Top Genres"}
              </h2>
              {renderChart()}
            </>
          )}
        </div>
      )}
    </div>
  );
}
