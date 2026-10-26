import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import API_BASE_URL from "../../config/api";

function Destination() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [destination, setDestination] = useState(null);
  const [activities, setActivities] = useState([]);
  const [hotels, setHotels] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isFavorite, setIsFavorite] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2500);
  };

  useEffect(() => {
    const fetchDestinationData = async () => {
      try {
        setLoading(true);
        setError("");

        const [destinationResponse, activitiesResponse, hotelsResponse] =
          await Promise.all([
            fetch(`${API_BASE_URL}/destinations/${id}`),
            fetch(`${API_BASE_URL}/destinations/${id}/activities`),
            fetch(`${API_BASE_URL}/destinations/${id}/hotels`),
          ]);

        if (!destinationResponse.ok) {
          throw new Error("Failed to fetch destination");
        }

        if (!activitiesResponse.ok) {
          throw new Error("Failed to fetch activities");
        }

        if (!hotelsResponse.ok) {
          throw new Error("Failed to fetch hotels");
        }

        const destinationData = await destinationResponse.json();
        const activitiesData = await activitiesResponse.json();
        const hotelsData = await hotelsResponse.json();

        setDestination(destinationData.data);
        setActivities(activitiesData.data || []);
        setHotels(hotelsData.data || []);
      } catch (error) {
        console.error(error);
        setError("Unable to load destination.");
      } finally {
        setLoading(false);
      }
    };

    fetchDestinationData();
  }, [id]);

  useEffect(() => {
    const favorites = JSON.parse(
      localStorage.getItem("triplyFavorites") || "[]",
    );

    const favoriteExists = favorites.some(
      (favorite) => favorite.id === Number(id),
    );

    setIsFavorite(favoriteExists);
  }, [id]);

  const handleFavorite = () => {
    if (!destination) return;

    const favorites = JSON.parse(
      localStorage.getItem("triplyFavorites") || "[]",
    );

    if (isFavorite) {
      const updatedFavorites = favorites.filter(
        (favorite) => favorite.id !== destination.id,
      );

      localStorage.setItem("triplyFavorites", JSON.stringify(updatedFavorites));

      setIsFavorite(false);

      showToast("Removed from favorites");
    } else {
      const updatedFavorites = [...favorites, destination];

      localStorage.setItem("triplyFavorites", JSON.stringify(updatedFavorites));

      setIsFavorite(true);

      showToast("Added to favorites ❤️");
    }
  };

  const handleAddToTrip = () => {
    if (!destination) return;

    const savedTrip = localStorage.getItem("triplyTrip");

    let trip;

    if (savedTrip) {
      try {
        trip = JSON.parse(savedTrip);
      } catch {
        trip = null;
      }
    }

    if (!trip) {
      const today = new Date();
      const tomorrow = new Date(today);

      tomorrow.setDate(today.getDate() + 1);

      const formatDate = (date) => {
        return date.toISOString().split("T")[0];
      };

      trip = {
        id: Date.now(),
        name: "My Trip",
        startDate: formatDate(today),
        endDate: formatDate(tomorrow),
        coverImage: destination.image || "",
        notes: "",
        days: [
          {
            id: Date.now(),
            date: formatDate(today),
            activities: [],
          },
        ],
      };
    }

    if (!trip.days || trip.days.length === 0) {
      trip.days = [
        {
          id: Date.now(),
          date: trip.startDate || new Date().toISOString().split("T")[0],
          activities: [],
        },
      ];
    }

    if (!trip.days[0].activities) {
      trip.days[0].activities = [];
    }

    const firstDay = trip.days[0];

    const alreadyAdded = firstDay.activities.some(
      (activity) => activity.destinationId === destination.id,
    );

    if (alreadyAdded) {
      showToast("This destination is already in your trip.");
      return;
    }

    const newActivity = {
      id: Date.now(),
      destinationId: destination.id,
      title: destination.name,
      country: destination.country,
      image: destination.image,
      rating: destination.rating,
      type: destination.type,
      description: destination.description || "Explore this destination.",
      time: "Morning",
    };

    firstDay.activities.push(newActivity);

    localStorage.setItem("triplyTrip", JSON.stringify(trip));

    showToast(`${destination.name} was added to your trip!`);
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] w-full items-center justify-center">
        <p className="text-gray-500">Loading destination...</p>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="flex min-h-[70vh] w-full flex-col items-center justify-center">
        <p className="text-red-500">{error || "Destination not found."}</p>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-5 rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      {toast && (
        <div className="fixed right-6 top-6 z-9999 rounded-xl bg-black px-5 py-3 text-sm font-medium text-white shadow-xl">
          {toast}
        </div>
      )}

      <section className="relative w-full overflow-hidden">
        {destination.image ? (
          <img
            src={destination.image}
            alt={destination.name}
            className="h-95 w-full object-cover md:h-125 lg:h-140"
          />
        ) : (
          <div className="flex h-95 w-full items-center justify-center bg-gray-100 text-gray-400 md:h-125 lg:h-140">
            No image available
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="group absolute left-6 top-6 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-white text-gray-800 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl md:left-8 md:top-8"
          aria-label="Go back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-6 w-6 transition-transform duration-300 group-hover:-translate-x-0.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          type="button"
          onClick={handleFavorite}
          className="group/favorite absolute right-6 top-6 z-20 flex items-center overflow-hidden rounded-full bg-white text-gray-800 shadow-lg transition-all duration-300 ease-out hover:shadow-xl md:right-8 md:top-8"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center text-xl transition-transform duration-300 group-hover/favorite:scale-105">
            <span className={isFavorite ? "text-red-500" : "text-gray-700"}>
              {isFavorite ? "♥" : "♡"}
            </span>
          </span>

          <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-300 ease-out group-hover/favorite:max-w-40 group-hover/favorite:pr-5 group-hover/favorite:opacity-100">
            {isFavorite ? "Remove from favorites" : "Add to favorites"}
          </span>
        </button>
      </section>

      <main className="w-full px-6 py-10 md:px-10 lg:px-14">
        <section className="flex flex-col gap-7 border-b border-gray-200 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              {destination.country}
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
              {destination.name}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium">
                <span>⭐</span>
                <span>{destination.rating || "N/A"}</span>
              </div>

              <div className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
                {destination.type}
              </div>

              {destination.best_time && (
                <div className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
                  Best time: {destination.best_time}
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToTrip}
            className="rounded-xl bg-black px-7 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
          >
            + Add to Trip
          </button>
        </section>

        <section className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              About This Destination
            </h2>

            <p className="mt-4 max-w-4xl text-base leading-8 text-gray-600">
              {destination.description ||
                "Explore this beautiful destination and discover everything it has to offer."}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <h3 className="text-lg font-bold text-gray-900">
              Destination Info
            </h3>

            <div className="mt-5 space-y-5">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                  🌍
                </div>

                <div>
                  <p className="text-xs text-gray-500">Country</p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {destination.country}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                  📍
                </div>

                <div>
                  <p className="text-xs text-gray-500">Destination Type</p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {destination.type}
                  </p>
                </div>
              </div>

              {destination.currency && (
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                    💰
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Currency</p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {destination.currency}
                    </p>
                  </div>
                </div>
              )}

              {destination.best_time && (
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                    ☀️
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Best Time</p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {destination.best_time}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {Number.isFinite(Number(destination.latitude)) &&
          Number.isFinite(Number(destination.longitude)) && (
            <section className="mt-14">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Location</h2>
                <p className="mt-1 text-sm text-gray-500">
                  See where {destination.name} is located.
                </p>
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200">
                <MapContainer
                  center={[Number(destination.latitude), Number(destination.longitude)]}
                  zoom={11}
                  scrollWheelZoom={false}
                  className="h-80 w-full sm:h-105"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker
                    position={[Number(destination.latitude), Number(destination.longitude)]}
                  >
                    <Popup>
                      <strong>{destination.name}</strong>
                      <br />
                      {destination.country}
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </section>
          )}

        <section className="mt-14">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Top Activities
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Things to do in {destination.name}
              </p>
            </div>
          </div>

          {activities.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {activity.image ? (
                    <img
                      src={activity.image}
                      alt={activity.name}
                      className="h-48 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-48 w-full items-center justify-center bg-gray-100 text-sm text-gray-400">
                      No image
                    </div>
                  )}

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900">
                      {activity.name}
                    </h3>

                    {activity.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                        {activity.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
              No activities available for this destination.
            </div>
          )}
        </section>

        <section className="mt-14 pb-16">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Best Hotels & Places to Stay
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Recommended places to stay in {destination.name}
              </p>
            </div>

            {hotels.length > 4 && (
              <span className="hidden text-sm font-medium text-gray-500 sm:block">
                View all →
              </span>
            )}
          </div>

          {hotels.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {hotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {hotel.image ? (
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="h-48 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-48 w-full items-center justify-center bg-gray-100 text-sm text-gray-400">
                      No image
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-bold text-gray-900">
                        {hotel.name}
                      </h3>

                      <span className="shrink-0 text-sm">♡</span>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-sm">⭐</span>

                      <span className="text-sm font-medium text-gray-700">
                        {hotel.rating || "N/A"}
                      </span>
                    </div>

                    {hotel.location && (
                      <p className="mt-2 truncate text-sm text-gray-500">
                        📍 {hotel.location}
                      </p>
                    )}

                    <div className="mt-5 flex items-end justify-between border-t border-gray-100 pt-4">
                      <span className="text-xs text-gray-500">Per night</span>

                      <span className="text-lg font-bold text-gray-900">
                        ${Number(hotel.price_per_night || 0).toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
              No hotels available for this destination.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Destination;
