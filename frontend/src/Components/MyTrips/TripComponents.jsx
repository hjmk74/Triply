import { useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import { Clock3, Edit3, MapPin, Trash2, X } from "lucide-react";

const tripMarkerIcon = L.divIcon({
  className: "triply-map-marker",
  html: `
    <div style="
      width: 38px;
      height: 38px;
      border-radius: 9999px 9999px 9999px 4px;
      background: #4f46e5;
      border: 3px solid white;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.25);
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 10px;
        height: 10px;
        border-radius: 9999px;
        background: white;
      "></div>
    </div>
  `,
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

function TripMap({ trip, destinations }) {
  const tripPlaces = useMemo(() => {
    if (!trip || !Array.isArray(trip.days)) return [];

    const places = [];

    trip.days.forEach((day, dayIndex) => {
      const activities = Array.isArray(day.activities) ? day.activities : [];

      activities.forEach((activity) => {
        const destinationId = Number(activity.destinationId);

        const destination = destinations.find(
          (item) => Number(item.id) === destinationId,
        );

        if (!destination) return;

        const latitude = Number(destination.latitude);
        const longitude = Number(destination.longitude);

        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;

        const existing = places.find(
          (item) => item.destinationId === destinationId,
        );

        if (!existing) {
          places.push({
            destinationId,
            name: destination.name,
            country: destination.country,
            latitude,
            longitude,
            days: [dayIndex + 1],
          });
        } else if (!existing.days.includes(dayIndex + 1)) {
          existing.days.push(dayIndex + 1);
        }
      });
    });

    return places;
  }, [trip, destinations]);

  if (tripPlaces.length === 0) {
    return (
      <div className="flex min-h-105 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
          <MapPin size={28} />
        </div>

        <h3 className="mt-4 text-lg font-bold text-slate-900">
          No destinations on the map yet
        </h3>

        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
          Add destinations to your itinerary first. Once they have coordinates,
          they will appear here automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <MapContainer
        center={[tripPlaces[0].latitude, tripPlaces[0].longitude]}
        zoom={5}
        scrollWheelZoom={true}
        className="h-105 w-full sm:h-125"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {tripPlaces.map((place) => (
          <Marker
            key={place.destinationId}
            position={[place.latitude, place.longitude]}
            icon={tripMarkerIcon}
          >
            <Popup>
              <div className="min-w-45">
                <h3 className="font-bold text-slate-900">{place.name}</h3>

                {place.country && (
                  <p className="mt-1 text-sm text-slate-500">{place.country}</p>
                )}

                <p className="mt-2 text-xs font-medium text-indigo-600">
                  Day {place.days.join(", Day ")}
                </p>

                <a
                  href={`https://www.openstreetmap.org/?mlat=${place.latitude}&mlon=${place.longitude}#map=13/${place.latitude}/${place.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Open in OpenStreetMap →
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

function SidebarButton({ active, icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-left text-sm font-medium transition ${
        active
          ? "bg-indigo-50 text-indigo-600"
          : "text-slate-600 hover:bg-slate-50"
      }`}
    >
      {icon}

      <span>{label}</span>
    </button>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
        {icon}
      </div>

      <p className="mt-4 text-xs font-medium text-slate-400">{label}</p>

      <p className="mt-1 font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function ActivityItem({ activity, onEdit, onDelete }) {
  return (
    <div className="relative flex gap-4">
      {}

      <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-[3px] border-indigo-500 bg-white">
        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
      </div>

      {}

      <div className="min-w-0 flex-1 pb-1">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm font-medium text-indigo-500">
              <Clock3 size={15} />

              <span>{activity.time || "Morning"}</span>
            </div>

            <h3 className="mt-2 text-xl font-bold text-slate-900">
              {activity.title}
            </h3>

            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
              {activity.description}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-400">
              <span className="inline-flex items-center gap-1">
                <MapPin size={14} />

                {activity.country}
              </span>

              {activity.type && (
                <>
                  <span>•</span>

                  <span>{activity.type}</span>
                </>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={onEdit}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                <Edit3 size={14} />
                Edit
              </button>

              <button
                type="button"
                onClick={onDelete}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>

          {activity.image && (
            <img
              src={activity.image}
              alt={activity.title}
              className="h-24 w-full rounded-xl object-cover sm:h-20 sm:w-28"
            />
          )}
        </div>
      </div>
    </div>
  );
}

function TripModal({ form, setForm, onClose, onSubmit, isEditing }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {isEditing ? "Edit Trip" : "Create New Trip"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add the basic information for your journey.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-5">
          {}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Trip Name
            </label>

            <input
              type="text"
              value={form.name}
              onChange={(event) =>
                setForm({
                  ...form,

                  name: event.target.value,
                })
              }
              placeholder="e.g. Greece Adventure"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              required
            />
          </div>

          {}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Start Date
              </label>

              <input
                type="date"
                value={form.startDate}
                onChange={(event) =>
                  setForm({
                    ...form,

                    startDate: event.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                End Date
              </label>

              <input
                type="date"
                value={form.endDate}
                min={form.startDate}
                onChange={(event) =>
                  setForm({
                    ...form,

                    endDate: event.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                required
              />
            </div>
          </div>

          {}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Cover Image URL
              <span className="ml-1 font-normal text-slate-400">optional</span>
            </label>

            <input
              type="url"
              value={form.coverImage}
              onChange={(event) =>
                setForm({
                  ...form,

                  coverImage: event.target.value,
                })
              }
              placeholder="https://..."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              {isEditing ? "Save Changes" : "Create Trip"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ActivityModal({
  form,

  setForm,

  destinations,

  loading,

  editingActivity,

  onClose,

  onSubmit,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {editingActivity ? "Edit Activity" : "Add Activity"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Choose a destination and add it to your day.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-5">
          {}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Destination
            </label>

            <select
              value={form.destinationId}
              onChange={(event) =>
                setForm({
                  ...form,

                  destinationId: event.target.value,
                })
              }
              disabled={loading}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              required
            >
              <option value="">
                {loading ? "Loading destinations..." : "Select a destination"}
              </option>

              {destinations.map((destination) => (
                <option key={destination.id} value={destination.id}>
                  {destination.name} — {destination.country}
                </option>
              ))}
            </select>
          </div>

          {}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Time
            </label>

            <select
              value={form.time}
              onChange={(event) =>
                setForm({
                  ...form,

                  time: event.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="Morning">Morning</option>

              <option value="Afternoon">Afternoon</option>

              <option value="Evening">Evening</option>
            </select>
          </div>

          {}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Description
              <span className="ml-1 font-normal text-slate-400">optional</span>
            </label>

            <textarea
              value={form.description}
              onChange={(event) =>
                setForm({
                  ...form,

                  description: event.target.value,
                })
              }
              placeholder="What do you want to do there?"
              className="min-h-28 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              {editingActivity ? "Save Changes" : "Add Activity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { TripMap, SidebarButton, InfoCard, ActivityItem, TripModal, ActivityModal };
