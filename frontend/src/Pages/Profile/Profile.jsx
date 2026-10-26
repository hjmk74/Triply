import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../../config/api";

function Profile() {
  const [profile, setProfile] = useState({
    fullName: "Huda Jasim",
    email: "huda@example.com",
    location: "Baghdad, Iraq",
  });

  const [favorites, setFavorites] = useState([]);
  const [trip, setTrip] = useState(null);
  const [destinations, setDestinations] = useState([]);

  const [isEditing, setIsEditing] = useState(false);

  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    location: "",
  });

  

  useEffect(() => {
    const savedProfile = localStorage.getItem("triplyProfile");

    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);

      setProfile(parsedProfile);
      setEditForm(parsedProfile);
    } else {
      setEditForm(profile);
    }
  }, []);

  

  useEffect(() => {
    const loadFavorites = () => {
      const savedFavorites =
        JSON.parse(localStorage.getItem("triplyFavorites")) || [];

      setFavorites(savedFavorites);
    };

    loadFavorites();

    window.addEventListener("storage", loadFavorites);

    return () => {
      window.removeEventListener("storage", loadFavorites);
    };
  }, []);

  

  useEffect(() => {
    const loadTrip = () => {
      const savedTrip = localStorage.getItem("triplyTrip");

      if (savedTrip) {
        setTrip(JSON.parse(savedTrip));
      } else {
        setTrip(null);
      }
    };

    loadTrip();

    window.addEventListener("storage", loadTrip);

    return () => {
      window.removeEventListener("storage", loadTrip);
    };
  }, []);

  

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/destinations`);
        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
          setDestinations(data.data);
        } else if (Array.isArray(data)) {
          setDestinations(data);
        }
      } catch (error) {
        console.error("Failed to load destinations:", error);
      }
    };

    fetchDestinations();
  }, []);

  

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = () => {
    const updatedProfile = {
      fullName: editForm.fullName.trim() || "Huda Jasim",
      email: editForm.email.trim() || "huda@example.com",
      location: editForm.location.trim() || "Baghdad, Iraq",
    };

    localStorage.setItem("triplyProfile", JSON.stringify(updatedProfile));

    setProfile(updatedProfile);
    setEditForm(updatedProfile);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  

  const tripCount = trip ? 1 : 0;

  const visitedDestinationIds = new Set();

  if (trip?.days) {
    trip.days.forEach((day) => {
      day.activities?.forEach((activity) => {
        if (activity.destinationId) {
          visitedDestinationIds.add(activity.destinationId);
        }
      });
    });
  }

  const destinationsVisited = visitedDestinationIds.size;

  

  const recentActivities = [];

  if (trip?.days) {
    trip.days.forEach((day) => {
      day.activities?.forEach((activity) => {
        recentActivities.push({
          ...activity,
          date: day.date,
        });
      });
    });
  }

  const recentTrips = recentActivities
    .map((activity) => {
      const destination = destinations.find(
        (item) => Number(item.id) === Number(activity.destinationId),
      );

      return {
        ...activity,
        destination,
      };
    })
    .filter((item) => item.destination)
    .slice(0, 3);

  

  const formatDate = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fbff]">
      <div className="mx-auto flex max-w-7xl">
        {}

        <aside className="hidden min-h-screen w-57.5 shrink-0 border-r border-gray-100 bg-white px-5 py-8 lg:block">
          {}
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-md">
              <div className="flex h-full w-full items-center justify-center bg-[#eef4ff] text-xl font-bold text-[#4f7cff]">
                {profile.fullName.charAt(0).toUpperCase()}
              </div>
            </div>

            <h2 className="mt-3 text-sm font-bold text-gray-800">
              {profile.fullName}
            </h2>

            <p className="mt-1 text-[11px] text-gray-400">{profile.email}</p>
          </div>

          {}
          <nav className="space-y-2">
            <Link
              to="/profile"
              className="flex items-center gap-3 rounded-xl bg-[#eaf1ff] px-4 py-3 text-sm font-semibold text-[#4778ee]"
            >
              <span>♙</span>
              <span>Profile</span>
            </Link>

            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-500 transition hover:bg-red-50 hover:text-red-500"
            >
              <span>↪</span>
              <span>Log Out</span>
            </button>
          </nav>
        </aside>

        {}

        <main className="w-full px-4 py-6 sm:px-6 lg:px-8">
          {}
          <div className="mb-5 lg:hidden">
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          </div>

          {}

          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <h1 className="text-lg font-bold text-gray-900">
                Personal Information
              </h1>

              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="rounded-lg bg-[#eef4ff] px-4 py-2 text-xs font-semibold text-[#4778ee] transition hover:bg-[#dfe9ff]"
                >
                  Edit
                </button>
              )}
            </div>

            {!isEditing ? (
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="mb-1 text-[11px] font-medium text-gray-400">
                    Full Name
                  </p>

                  <p className="text-sm font-semibold text-gray-700">
                    {profile.fullName}
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-[11px] font-medium text-gray-400">
                    Email
                  </p>

                  <p className="text-sm font-semibold text-gray-700">
                    {profile.email}
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-[11px] font-medium text-gray-400">
                    Location
                  </p>

                  <p className="text-sm font-semibold text-gray-700">
                    {profile.location}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-500">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    value={editForm.fullName}
                    onChange={handleEditChange}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#6b8cff] focus:ring-2 focus:ring-[#6b8cff]/10"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-500">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#6b8cff] focus:ring-2 focus:ring-[#6b8cff]/10"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-500">
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={editForm.location}
                    onChange={handleEditChange}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#6b8cff] focus:ring-2 focus:ring-[#6b8cff]/10"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    className="rounded-xl bg-[#4778ee] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3869df]"
                  >
                    Save Changes
                  </button>

                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </section>

          {}

          <section className="mt-7">
            <h2 className="mb-3 text-lg font-bold text-gray-900">My Stats</h2>

            <div className="grid gap-4 sm:grid-cols-3">
              {}
              <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef4ff] text-[#4778ee]">
                  <span className="text-lg">▣</span>
                </div>

                <div>
                  <p className="text-lg font-bold text-gray-800">{tripCount}</p>

                  <p className="text-xs text-gray-400">Trip Planned</p>
                </div>
              </div>

              {}
              <Link
                to="/favorites"
                className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff0f2] text-[#ff7180]">
                  <span className="text-xl">♡</span>
                </div>

                <div>
                  <p className="text-lg font-bold text-gray-800">
                    {favorites.length}
                  </p>

                  <p className="text-xs text-gray-400">Favorites</p>
                </div>
              </Link>

              {}
              <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edfbf5] text-[#3fc28a]">
                  <span className="text-lg">◎</span>
                </div>

                <div>
                  <p className="text-lg font-bold text-gray-800">
                    {destinationsVisited}
                  </p>

                  <p className="text-xs text-gray-400">Destinations Visited</p>
                </div>
              </div>
            </div>
          </section>

          {}

          <section className="mt-7">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Recent Trips</h2>

              <Link
                to="/my-trips"
                className="text-xs font-semibold text-[#4778ee] hover:underline"
              >
                View all →
              </Link>
            </div>

            {recentTrips.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {recentTrips.map((item, index) => (
                  <Link
                    key={`${item.destination.id}-${index}`}
                    to={`/destination/${item.destination.id}`}
                    className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative h-36 overflow-hidden">
                      <img
                        src={
                          item.destination.image ||
                          item.image ||
                          "/images/placeholder.jpg"
                        }
                        alt={item.destination.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      <div className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold text-gray-600 shadow-sm">
                        ★ {item.destination.rating || "4.8"}
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="truncate text-sm font-bold text-gray-800">
                        {item.destination.name}
                      </h3>

                      <p className="mt-1 text-[11px] text-gray-400">
                        {item.destination.country}
                      </p>

                      <p className="mt-2 text-[10px] text-gray-400">
                        {formatDate(item.date)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eef4ff] text-2xl text-[#4778ee]">
                  ✈
                </div>

                <h3 className="mt-4 text-sm font-bold text-gray-800">
                  No trips yet
                </h3>

                <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-gray-400">
                  Start exploring destinations and add places to your trip.
                </p>

                <Link
                  to="/explore"
                  className="mt-5 inline-flex rounded-xl bg-[#4778ee] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#3869df]"
                >
                  Explore Destinations
                </Link>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default Profile;
