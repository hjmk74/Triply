import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const loadFavorites = () => {
      try {
        const savedFavorites = JSON.parse(
          localStorage.getItem("triplyFavorites") || "[]",
        );

        setFavorites(Array.isArray(savedFavorites) ? savedFavorites : []);
      } catch {
        setFavorites([]);
      }
    };

    loadFavorites();
    window.addEventListener("storage", loadFavorites);

    return () => window.removeEventListener("storage", loadFavorites);
  }, []);

  const removeFavorite = (id) => {
    const updatedFavorites = favorites.filter(
      (destination) => destination.id !== id,
    );

    setFavorites(updatedFavorites);
    localStorage.setItem("triplyFavorites", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Favorites</h1>
          <p className="mt-1 text-sm text-gray-500">
            Your saved destinations, all in one place.
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="rounded-xl border border-gray-100 bg-white py-16 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-3xl text-red-400">
              ♡
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              No favorites yet
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Start exploring and save the destinations you love.
            </p>
            <Link
              to="/explore"
              className="mt-5 inline-flex rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Explore Destinations
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {favorites.map((destination) => (
              <div
                key={destination.id}
                className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative h-52 overflow-hidden">
                  <Link to={`/destination/${destination.id}`}>
                    {destination.image ? (
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="h-full w-full object-cover transition duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-100" />
                    )}
                  </Link>

                  <button
                    type="button"
                    onClick={() => removeFavorite(destination.id)}
                    className="group/favorite absolute right-3 top-3 flex items-center overflow-hidden rounded-full bg-white text-gray-800 shadow-md transition-all duration-300 hover:shadow-lg"
                    title="Remove from favorites"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center text-lg text-red-500 transition-transform duration-300 group-hover/favorite:scale-105">
                      ♥
                    </span>
                    <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-semibold text-gray-700 opacity-0 transition-all duration-300 group-hover/favorite:max-w-40 group-hover/favorite:pr-4 group-hover/favorite:opacity-100">
                      Remove from favorites
                    </span>
                  </button>
                </div>

                <div className="p-4">
                  <Link to={`/destination/${destination.id}`}>
                    <h2 className="text-base font-bold text-gray-900 transition hover:text-gray-700">
                      {destination.name}
                    </h2>
                  </Link>
                  <p className="mt-1 text-xs text-gray-500">
                    {destination.country}
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-sm">
                    <span>⭐</span>
                    <span className="font-semibold text-gray-700">
                      {destination.rating || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;
