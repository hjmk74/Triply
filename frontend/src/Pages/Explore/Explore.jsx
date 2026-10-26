import { useEffect, useMemo, useState } from "react";

import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Star,
  Heart,
} from "lucide-react";

import { Link, useSearchParams } from "react-router-dom";
import API_BASE_URL from "../../config/api";

function Explore() {
  const [destinations, setDestinations] = useState([]);
  const [countries, setCountries] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );

  const [selectedCountry, setSelectedCountry] = useState(
    searchParams.get("country") || "All",
  );

  const [selectedTypes, setSelectedTypes] = useState(() => {
    const typeFromUrl = searchParams.get("type");

    return typeFromUrl ? [typeFromUrl] : [];
  });

  const [selectedRatings, setSelectedRatings] = useState([]);

  const [sortBy, setSortBy] = useState("default");

  const [error, setError] = useState("");

  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem("triplyFavorites")) || [];
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/destinations`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch destinations");
        }

        return response.json();
      })
      .then((data) => {
        setDestinations(data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching destinations:", error);
        setError("Failed to load destinations.");
      });
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/countries`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch countries");
        }

        return response.json();
      })
      .then((data) => {
        setCountries(data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
        setError("Failed to load countries.");
      });
  }, []);

  useEffect(() => {
    const searchFromUrl = searchParams.get("search") || "";
    const countryFromUrl = searchParams.get("country") || "All";
    const typeFromUrl = searchParams.get("type");

    setSearchTerm(searchFromUrl);
    setSelectedCountry(countryFromUrl);

    if (typeFromUrl) {
      setSelectedTypes([typeFromUrl]);
    } else {
      setSelectedTypes([]);
    }
  }, [searchParams]);

  const toggleFavorite = (destination) => {
    const favoriteExists = favorites.some(
      (favorite) => favorite.id === destination.id,
    );

    let updatedFavorites;

    if (favoriteExists) {
      updatedFavorites = favorites.filter(
        (favorite) => favorite.id !== destination.id,
      );
    } else {
      updatedFavorites = [...favorites, destination];
    }

    setFavorites(updatedFavorites);

    localStorage.setItem("triplyFavorites", JSON.stringify(updatedFavorites));
  };

  const isFavorite = (id) => {
    return favorites.some((favorite) => favorite.id === id);
  };

  const destinationTypes = useMemo(() => {
    const types = destinations
      .map((destination) => destination.type)
      .filter(Boolean);

    return [...new Set(types)].sort((a, b) => a.localeCompare(b));
  }, [destinations]);

  const toggleType = (type) => {
    setSelectedTypes((currentTypes) => {
      const newTypes = currentTypes.includes(type)
        ? currentTypes.filter((item) => item !== type)
        : [...currentTypes, type];

      return newTypes;
    });
  };

  const toggleRating = (rating) => {
    setSelectedRatings((currentRatings) =>
      currentRatings.includes(rating)
        ? currentRatings.filter((item) => item !== rating)
        : [...currentRatings, rating],
    );
  };

  useEffect(() => {
    const params = {};

    if (searchTerm.trim()) {
      params.search = searchTerm.trim();
    }

    if (selectedCountry !== "All") {
      params.country = selectedCountry;
    }

    if (selectedTypes.length === 1) {
      params.type = selectedTypes[0];
    }

    setSearchParams(params, { replace: true });
  }, [searchTerm, selectedCountry, selectedTypes, setSearchParams]);

  const filteredDestinations = destinations
    .filter((destination) => {
      const search = searchTerm.trim().toLowerCase();

      const matchesSearch =
        !search ||
        destination.name?.toLowerCase().includes(search) ||
        destination.country?.toLowerCase().includes(search) ||
        destination.type?.toLowerCase().includes(search);

      const matchesCountry =
        selectedCountry === "All" ||
        destination.country?.toLowerCase() === selectedCountry.toLowerCase();

      const matchesType =
        selectedTypes.length === 0 ||
        selectedTypes.some(
          (type) => destination.type?.toLowerCase() === type.toLowerCase(),
        );

      const matchesRating =
        selectedRatings.length === 0 ||
        selectedRatings.some(
          (rating) => Number(destination.rating) >= Number(rating),
        );

      return matchesSearch && matchesCountry && matchesType && matchesRating;
    })
    .sort((a, b) => {

      if (sortBy === "default") {
        const popularDifference = Number(b.is_popular) - Number(a.is_popular);

        if (popularDifference !== 0) {
          return popularDifference;
        }

        const ratingDifference = Number(b.rating) - Number(a.rating);

        if (ratingDifference !== 0) {
          return ratingDifference;
        }

        return Number(a.id) - Number(b.id);
      }

      if (sortBy === "rating-high") {
        return Number(b.rating) - Number(a.rating);
      }

      if (sortBy === "rating-low") {
        return Number(a.rating) - Number(b.rating);
      }

      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }

      return 0;
    });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCountry("All");
    setSelectedTypes([]);
    setSelectedRatings([]);
    setSortBy("default");

    setSearchParams({}, { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      
      <section className="relative overflow-visible">
        <div
          className="relative h-75 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/logo/explore-logo.png')",
          }}
        >
          <div className="absolute inset-0 bg-black/30" />

          <div className="relative mx-auto flex h-full max-w-7xl items-center px-6 lg:px-10">
            <div className="text-white">
              <h1 className="text-4xl font-bold md:text-5xl">
                Explore Destinations
              </h1>

              <p className="mt-2 text-lg text-white/90">
                Find your next adventure
              </p>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 mx-auto -mt-7 max-w-6xl px-6">
          <div className="flex h-16 items-center rounded-2xl bg-white px-5 shadow-lg ring-1 ring-slate-200">
            <Search size={21} className="shrink-0 text-slate-400" />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search destinations, countries, or cities..."
              className="ml-4 w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />

            <Search size={21} className="shrink-0 text-slate-500" />
          </div>
        </div>
      </section>
      
      <section className="mx-auto mt-7 max-w-6xl px-6">
        <div className="flex flex-wrap gap-4">
          
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center gap-2 rounded-xl bg-indigo-50 px-5 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-100"
          >
            <SlidersHorizontal size={17} />
            All Filters
          </button>
          
          <div className="relative">
            <select
              value={selectedCountry}
              onChange={(event) => setSelectedCountry(event.target.value)}
              className="appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-6 pr-11 text-sm font-medium text-slate-700 shadow-sm outline-none transition hover:border-indigo-200 focus:border-indigo-400"
            >
              <option value="All">Location</option>

              {countries.map((country) => (
                <option key={country.id} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>

            <ChevronDown
              size={17}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-600"
            />
          </div>
        </div>
      </section>
      
      <section className="mx-auto mt-8 max-w-6xl px-6">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <h2 className="font-semibold text-slate-800">Filters</h2>

              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
              >
                Clear all
              </button>
            </div>
            
            <div className="border-b border-slate-100 py-5">
              <h3 className="mb-4 text-sm font-semibold text-slate-800">
                Destination Type
              </h3>

              <div className="space-y-3">
                {destinationTypes.map((type) => (
                  <label
                    key={type}
                    className="flex cursor-pointer items-center gap-3 text-sm text-slate-600"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => toggleType(type)}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />

                    {type}
                  </label>
                ))}
              </div>
            </div>
            
            <div className="border-b border-slate-100 py-5">
              <h3 className="mb-4 text-sm font-semibold text-slate-800">
                Rating
              </h3>

              <div className="space-y-3">
                {[4, 3, 2].map((rating) => (
                  <label
                    key={rating}
                    className="flex cursor-pointer items-center gap-3 text-sm text-slate-600"
                  >
                    <input
                      type="checkbox"
                      checked={selectedRatings.includes(rating)}
                      onChange={() => toggleRating(rating)}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    {rating}+
                  </label>
                ))}
              </div>
            </div>
            
            <div className="pt-5">
              <h3 className="mb-3 text-sm font-semibold text-slate-800">
                Sort by
              </h3>

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-500"
              >
                <option value="default">Most Popular</option>

                <option value="rating-high">Highest Rated</option>

                <option value="rating-low">Lowest Rated</option>

                <option value="name">Name A-Z</option>
              </select>
            </div>
          </aside>
          
          <div>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">
                {filteredDestinations.length} destinations found
              </h2>
            </div>
            
            {error && (
              <div className="mb-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}
            {filteredDestinations.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2">
                {filteredDestinations.map((destination) => {
                  const favorite = isFavorite(destination.id);

                  return (
                    <Link
                      key={destination.id}
                      to={`/destination/${destination.id}`}
                      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                      
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={
                            destination.image ||
                            `/images/destinations/${destination.id}.avif`
                          }
                          alt={destination.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                        
                        <button
                          type="button"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();

                            toggleFavorite(destination);
                          }}
                          className={`
                            group/favorite
                            absolute right-3 top-3
                            flex items-center
                            overflow-hidden
                            rounded-full
                            bg-white
                            shadow-md
                            transition-all duration-300 ease-out
                            hover:shadow-lg
                            ${favorite ? "text-red-500" : "text-slate-700"}
                          `}
                          aria-label={
                            favorite
                              ? "Remove from favorites"
                              : "Add to favorites"
                          }
                        >
                          <span
                            className="
                              flex h-10 w-10
                              shrink-0
                              items-center justify-center
                              transition-transform duration-300
                              group-hover/favorite:scale-105
                            "
                          >
                            <Heart
                              size={18}
                              fill={favorite ? "currentColor" : "none"}
                              className={
                                favorite ? "text-red-500" : "text-slate-700"
                              }
                            />
                          </span>

                          <span
                            className="
                              max-w-0
                              overflow-hidden
                              whitespace-nowrap
                              text-xs font-semibold
                              text-slate-700
                              opacity-0
                              transition-all duration-300 ease-out
                              group-hover/favorite:max-w-40
                              group-hover/favorite:pr-4
                              group-hover/favorite:opacity-100
                            "
                          >
                            {favorite
                              ? "Remove from favorites"
                              : "Add to favorites"}
                          </span>
                        </button>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-slate-800">
                          {destination.name}
                        </h3>

                        <p className="mt-1 text-sm text-slate-400">
                          {destination.country}
                        </p>

                        <div className="mt-4 flex items-center gap-1">
                          <Star
                            size={16}
                            fill="currentColor"
                            className="text-amber-400"
                          />

                          <span className="text-sm font-semibold text-slate-700">
                            {destination.rating}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              

              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                <h2 className="text-xl font-semibold text-slate-800">
                  No destinations found
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Try changing your search or filters.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Explore;
