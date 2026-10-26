import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../../config/api";

function Home() {
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState("");

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
      });
  }, []);

  const popularDestinations = destinations
    .filter((destination) => destination.is_popular)
    .slice(0, 4);

  const recommendedDestinations = destinations
    .filter((destination) => destination.is_recommended)
    .slice(0, 4);

  const getCategoryCount = (types) => {
    return destinations.filter((destination) =>
      types.some(
        (type) => destination.type?.toLowerCase() === type.toLowerCase(),
      ),
    ).length;
  };

  const categories = [
    {
      name: "Beaches",
      types: ["Coastal", "Beach"],
      image: "/images/category/beaches.png",
      imageClass: "h-15 w-15",
      cardClass: "px-4 py-5",
    },
    {
      name: "Cities",
      types: ["City", "Cities"],
      image: "/images/category/cities.png",
      imageClass: "h-20 w-20",
      cardClass: "px-4 py-3",
    },
    {
      name: "Mountains",
      types: ["Mountain", "Mountains"],
      image: "/images/category/mountain.png",
      imageClass: "h-20 w-20",
      cardClass: "px-4 py-3",
    },
    {
      name: "Culture",
      types: ["Culture", "Historical"],
      image: "/images/category/culture.png",
      imageClass: "h-20 w-24",
      cardClass: "px-4 py-3",
    },
    {
      name: "Adventure",
      types: ["Adventure", "Canyon", "Desert"],
      image: "/images/category/adventure.png",
      imageClass: "h-15 w-15",
      cardClass: "px-4 py-5",
    },
    {
      name: "Nature",
      types: ["Nature"],
      image: "/images/category/nature.png",
      imageClass: "h-15 w-15",
      cardClass: "px-4 py-5",
    },
  ];

  return (
    <div className="bg-white">
      <section className="relative overflow-visible">
        <img
          src="/images/logo/hero-logo.png"
          alt="Beautiful tropical beach destination"
          className="h-105 w-full object-cover sm:h-125"
        />

        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute inset-0">
          <div className="mx-auto flex h-full max-w-7xl items-center px-6 lg:px-10">
            <div className="max-w-xl text-white">
              <div className="mb-4 inline-flex rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                Your next adventure awaits
              </div>

              <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Explore the world,
                <br />
                one trip at a time
              </h1>

              <p className="mt-5 max-w-lg text-base leading-7 text-white/90 sm:text-lg">
                Discover amazing destinations, plan your perfect trip, and make
                unforgettable memories.
              </p>
            </div>
          </div>
        </div>

        <div className="absolute left-1/2 top-full z-20 w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2 -translate-y-1/2 sm:w-[calc(100%-3rem)]">
          <div className="rounded-2xl bg-white p-3 shadow-xl">
            <div className="grid gap-3 md:grid-cols-[1fr_150px]">
              <div className="rounded-xl border border-gray-200 px-4 py-3 transition focus-within:border-blue-400">
                <p className="text-xs font-semibold text-gray-500">Where to?</p>

                <div className="mt-1 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-4 w-4 shrink-0 text-gray-400"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-4-4" />
                  </svg>

                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search destinations..."
                    className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              <Link
                to={
                  search.trim()
                    ? `/explore?search=${encodeURIComponent(search.trim())}`
                    : "/explore"
                }
                className="flex h-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-4 w-4"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>

                <span>Search</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main className="w-full px-6 pb-16 pt-24">
        <section>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Popular Destinations
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Discover places travelers love.
              </p>
            </div>

            <Link
              to="/explore"
              className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              View all →
            </Link>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {popularDestinations.map((destination) => (
              <Link
                key={destination.id}
                to={`/destination/${destination.id}`}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="overflow-hidden">
                  {destination.image ? (
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="h-60 w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-60 w-full bg-gray-100" />
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-base font-bold text-gray-900">
                    {destination.name}
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    {destination.country}
                  </p>

                  <p className="mt-3 text-sm font-medium text-gray-700">
                    ⭐ {destination.rating}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Recommended Places
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Places worth adding to your next trip.
              </p>
            </div>

            <Link
              to="/explore"
              className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              View all →
            </Link>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {recommendedDestinations.map((destination) => (
              <Link
                key={destination.id}
                to={`/destination/${destination.id}`}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="overflow-hidden">
                  {destination.image ? (
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="h-60 w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-60 w-full bg-gray-100" />
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-base font-bold text-gray-900">
                    {destination.name}
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    {destination.country}
                  </p>

                  <p className="mt-3 text-sm font-medium text-gray-700">
                    ⭐ {destination.rating}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Categories
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Find destinations based on your travel style.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => {
              const count = getCategoryCount(category.types);

              return (
                <Link
                  key={category.name}
                  to={`/explore?type=${encodeURIComponent(category.types[0])}`}
                  className={`group rounded-xl border border-gray-100 bg-gray-50/70 text-center shadow-md transition duration-300 hover:-translate-y-1 hover:border-blue-100 hover:bg-white hover:shadow-lg ${category.cardClass}`}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className={`mx-auto object-contain transition duration-300 group-hover:scale-110 ${category.imageClass}`}
                  />

                  <h3 className="mt-3 text-sm font-semibold text-gray-900">
                    {category.name}
                  </h3>

                  <p className="mt-1 text-xs text-gray-400">
                    {count} {count === 1 ? "place" : "places"}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
