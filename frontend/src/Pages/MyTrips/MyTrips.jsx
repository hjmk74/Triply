import { useEffect, useMemo, useState } from "react";
import "leaflet/dist/leaflet.css";
import API_BASE_URL from "../../config/api";
import {
  TripMap,
  SidebarButton,
  InfoCard,
  ActivityItem,
  TripModal,
  ActivityModal,
} from "../../Components/MyTrips/TripComponents";

import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Clock3,
  Edit3,
  Map,
  MapPin,
  MessageSquare,
  Plus,
  Save,
  Share2,
  Trash2,
} from "lucide-react";

function MyTrips() {

  const [trip, setTrip] = useState(null);

  const [activeSection, setActiveSection] = useState("itinerary");

  const [expandedDays, setExpandedDays] = useState({});

  const [showTripModal, setShowTripModal] = useState(false);

  const [showActivityModal, setShowActivityModal] = useState(false);

  const [editingActivity, setEditingActivity] = useState(null);

  const [selectedDayId, setSelectedDayId] = useState(null);

  const [destinations, setDestinations] = useState([]);

  const [loadingDestinations, setLoadingDestinations] = useState(false);

  const [tripForm, setTripForm] = useState({
    name: "",

    startDate: "",

    endDate: "",

    coverImage: "",
  });

  const [activityForm, setActivityForm] = useState({
    destinationId: "",

    time: "Morning",

    description: "",
  });

  const [notes, setNotes] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastTitle, setToastTitle] = useState("Notes saved");
  const [toastMessage, setToastMessage] = useState(
    "Your notes were saved successfully.",
  );

  const showToastMessage = (title, message) => {
    setToastTitle(title);
    setToastMessage(message);
    setShowToast(true);

    window.setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const normalizeTrip = (savedTrip) => {
    if (!savedTrip || typeof savedTrip !== "object") {
      return null;
    }

    const safeDays = Array.isArray(savedTrip.days)
      ? savedTrip.days.map((day, index) => ({
          id: day.id || Date.now() + index,

          date: day.date || new Date().toISOString().split("T")[0],

          activities: Array.isArray(day.activities) ? day.activities : [],
        }))
      : [];

    return {
      ...savedTrip,

      name: savedTrip.name || "My Trip",

      startDate: savedTrip.startDate || "",

      endDate: savedTrip.endDate || "",

      coverImage: savedTrip.coverImage || "",

      notes: savedTrip.notes || "",

      days: safeDays,
    };
  };

  useEffect(() => {
    try {
      const savedTrip = localStorage.getItem("triplyTrip");

      if (savedTrip) {
        const parsedTrip = JSON.parse(savedTrip);

        const safeTrip = normalizeTrip(parsedTrip);

        if (safeTrip) {
          setTrip(safeTrip);

          setNotes(safeTrip.notes || "");

          const expanded = {};

          safeTrip.days.forEach((day, index) => {
            expanded[day.id] = index === 0;
          });

          setExpandedDays(expanded);

          localStorage.setItem("triplyTrip", JSON.stringify(safeTrip));
        }
      }
    } catch (error) {
      console.error("Error loading trip:", error);

      localStorage.removeItem("triplyTrip");
    }

    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      setLoadingDestinations(true);

      const response = await fetch(`${API_BASE_URL}/destinations`);

      if (!response.ok) {
        throw new Error("Failed to fetch destinations");
      }

      const data = await response.json();

      setDestinations(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Error fetching destinations:", error);

      setDestinations([]);
    } finally {
      setLoadingDestinations(false);
    }
  };

  const saveTrip = (updatedTrip) => {
    const safeTrip = normalizeTrip(updatedTrip);

    setTrip(safeTrip);

    localStorage.setItem("triplyTrip", JSON.stringify(safeTrip));
  };

  const generateDays = (startDate, endDate) => {
    const days = [];

    const start = new Date(`${startDate}T00:00:00`);

    const end = new Date(`${endDate}T00:00:00`);

    let current = new Date(start);

    while (current <= end) {
      days.push({
        id: Date.now() + days.length,

        date: current.toISOString().split("T")[0],

        activities: [],
      });

      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const createDefaultTrip = () => {
    const today = new Date();

    const tomorrow = new Date(today);

    tomorrow.setDate(today.getDate() + 1);

    const startDate = today.toISOString().split("T")[0];

    const endDate = tomorrow.toISOString().split("T")[0];

    const newTrip = {
      id: Date.now(),

      name: "My New Trip",

      startDate,

      endDate,

      coverImage: "",

      notes: "",

      days: generateDays(startDate, endDate),
    };

    saveTrip(newTrip);

    const expanded = {};

    newTrip.days.forEach((day, index) => {
      expanded[day.id] = index === 0;
    });

    setExpandedDays(expanded);

    return newTrip;
  };

  const handleCreateTrip = (event) => {
    event.preventDefault();

    const startDate =
      tripForm.startDate || new Date().toISOString().split("T")[0];

    const endDate = tripForm.endDate || startDate;

    const newTrip = {
      id: Date.now(),

      name: tripForm.name.trim() || "My Trip",

      startDate,

      endDate,

      coverImage: tripForm.coverImage.trim(),

      notes: "",

      days: generateDays(startDate, endDate),
    };

    saveTrip(newTrip);

    const expanded = {};

    newTrip.days.forEach((day, index) => {
      expanded[day.id] = index === 0;
    });

    setExpandedDays(expanded);

    setShowTripModal(false);

    setTripForm({
      name: "",

      startDate: "",

      endDate: "",

      coverImage: "",
    });

    setActiveSection("itinerary");
  };

  const openEditTrip = () => {
    if (!trip) return;

    setTripForm({
      name: trip.name || "",

      startDate: trip.startDate || "",

      endDate: trip.endDate || "",

      coverImage: trip.coverImage || "",
    });

    setShowTripModal(true);
  };

  const handleUpdateTrip = (event) => {
    event.preventDefault();

    if (!trip) return;

    const updatedTrip = {
      ...trip,

      name: tripForm.name.trim() || "My Trip",

      startDate: tripForm.startDate,

      endDate: tripForm.endDate,

      coverImage: tripForm.coverImage.trim(),
    };

    saveTrip(updatedTrip);

    setShowTripModal(false);
  };

  const toggleDay = (dayId) => {
    setExpandedDays((current) => ({
      ...current,

      [dayId]: !current[dayId],
    }));
  };

  const handleAddDay = () => {
    if (!trip) {
      const newTrip = createDefaultTrip();

      setSelectedDayId(newTrip.days[0]?.id || null);

      return;
    }

    const safeDays = Array.isArray(trip.days) ? trip.days : [];

    const lastDay = safeDays[safeDays.length - 1];

    let newDate;

    if (lastDay?.date) {
      const date = new Date(`${lastDay.date}T00:00:00`);

      date.setDate(date.getDate() + 1);

      newDate = date.toISOString().split("T")[0];
    } else {
      newDate = new Date().toISOString().split("T")[0];
    }

    const newDay = {
      id: Date.now(),

      date: newDate,

      activities: [],
    };

    const updatedTrip = {
      ...trip,

      days: [...safeDays, newDay],
    };

    saveTrip(updatedTrip);

    setExpandedDays((current) => ({
      ...current,

      [newDay.id]: true,
    }));
  };

  const deleteDay = (dayId) => {
    if (!trip) return;

    const safeDays = Array.isArray(trip.days) ? trip.days : [];

    if (safeDays.length === 1) {
      showToastMessage("Cannot delete day", "Your trip must have at least one day.");

      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this day?",
    );

    if (!confirmed) return;

    const updatedTrip = {
      ...trip,

      days: safeDays.filter((day) => day.id !== dayId),
    };

    saveTrip(updatedTrip);

    setExpandedDays((current) => {
      const updated = { ...current };

      delete updated[dayId];

      return updated;
    });
  };

  const openAddActivity = (dayId) => {
    setSelectedDayId(dayId);

    setEditingActivity(null);

    setActivityForm({
      destinationId: "",

      time: "Morning",

      description: "",
    });

    setShowActivityModal(true);
  };

  const openEditActivity = (dayId, activity) => {
    setSelectedDayId(dayId);

    setEditingActivity(activity);

    setActivityForm({
      destinationId: String(activity.destinationId || ""),

      time: activity.time || "Morning",

      description: activity.description || "",
    });

    setShowActivityModal(true);
  };

  const handleSaveActivity = (event) => {
    event.preventDefault();

    if (!trip) return;

    if (!activityForm.destinationId) {
      showToastMessage("Choose a destination", "Please select a destination first.");

      return;
    }

    const selectedDestination = destinations.find(
      (destination) => destination.id === Number(activityForm.destinationId),
    );

    if (!selectedDestination) {
      showToastMessage("Destination not found", "Please choose another destination.");

      return;
    }

    const activity = {
      id: editingActivity?.id || Date.now(),

      destinationId: selectedDestination.id,

      title: selectedDestination.name,

      country: selectedDestination.country,

      image: selectedDestination.image,

      rating: selectedDestination.rating,

      type: selectedDestination.type,

      description:
        activityForm.description.trim() ||
        selectedDestination.description ||
        "Explore this destination.",

      time: activityForm.time,
    };

    const safeDays = Array.isArray(trip.days) ? trip.days : [];

    const updatedDays = safeDays.map((day) => {
      if (day.id !== selectedDayId) {
        return {
          ...day,

          activities: Array.isArray(day.activities) ? day.activities : [],
        };
      }

      const currentActivities = Array.isArray(day.activities)
        ? day.activities
        : [];

      if (editingActivity) {
        return {
          ...day,

          activities: currentActivities.map((item) =>
            item.id === editingActivity.id ? activity : item,
          ),
        };
      }

      return {
        ...day,

        activities: [...currentActivities, activity],
      };
    });

    saveTrip({
      ...trip,

      days: updatedDays,
    });

    setShowActivityModal(false);

    setEditingActivity(null);

    setActivityForm({
      destinationId: "",

      time: "Morning",

      description: "",
    });
  };

  const deleteActivity = (dayId, activityId) => {
    if (!trip) return;

    const updatedTrip = {
      ...trip,

      days: trip.days.map((day) => {
        if (day.id !== dayId) {
          return day;
        }

        const activities = Array.isArray(day.activities) ? day.activities : [];

        return {
          ...day,

          activities: activities.filter(
            (activity) => activity.id !== activityId,
          ),
        };
      }),
    };

    saveTrip(updatedTrip);

    showToastMessage("Activity deleted", "The activity was removed from your trip.");
  };

  const saveNotes = () => {
    if (!trip) return;

    saveTrip({
      ...trip,

      notes,
    });

    showToastMessage("Notes saved", "Your notes were saved successfully.");
  };

  const handleShare = async () => {
    if (!trip) return;

    const text = `My Trip: ${trip.name}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: trip.name,

          text,
        });

        return;
      }

      await navigator.clipboard.writeText(window.location.href);

      showToastMessage("Link copied", "Your trip link was copied to the clipboard.");
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  const deleteTrip = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this trip?",
    );

    if (!confirmed) return;

    localStorage.removeItem("triplyTrip");

    setTrip(null);

    setNotes("");

    setExpandedDays({});

    setActiveSection("itinerary");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(`${dateString}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("en-US", {
      month: "short",

      day: "numeric",

      year: "numeric",
    });
  };

  const totalActivities = useMemo(() => {
    if (!trip) return 0;

    const safeDays = Array.isArray(trip.days) ? trip.days : [];

    return safeDays.reduce(
      (total, day) =>
        total + (Array.isArray(day.activities) ? day.activities.length : 0),

      0,
    );
  }, [trip]);

  if (!trip) {
    return (
      <div className="min-h-screen bg-slate-50">
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <MapPin size={30} />
            </div>

            <h1 className="mt-6 text-3xl font-bold text-slate-900">
              Plan your next adventure
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-slate-500">
              Create a trip, add destinations to your itinerary, organize your
              days, and keep all your travel plans in one place.
            </p>

            <button
              type="button"
              onClick={() => {
                setTripForm({
                  name: "",

                  startDate: "",

                  endDate: "",

                  coverImage: "",
                });

                setShowTripModal(true);
              }}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-indigo-700"
            >
              <Plus size={19} />
              Create Your First Trip
            </button>
          </div>
        </section>

        {showTripModal && (
          <TripModal
            form={tripForm}
            setForm={setTripForm}
            onClose={() => setShowTripModal(false)}
            onSubmit={handleCreateTrip}
            isEditing={false}
          />
        )}
      </div>
    );
  }

  const safeDays = Array.isArray(trip.days) ? trip.days : [];

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {showToast && (
        <div className="fixed right-6 top-6 z-100 flex items-center gap-3 rounded-2xl border border-green-100 bg-white px-5 py-4 shadow-xl">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">
            <CheckCircle size={21} className="text-green-600" />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">{toastTitle}</p>
            <p className="mt-0.5 text-xs text-slate-500">{toastMessage}</p>
          </div>
        </div>
      )}

      {}

      <section className="mx-auto max-w-7xl px-6 pt-8 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="mt-1 text-4xl font-bold tracking-tight text-slate-900">
              My Trip
            </h1>
            <p className="text-sm font-medium text-indigo-600">
              Your travel planner
            </p>
            <p className="mt-2 text-slate-500">
              Plan, organize and enjoy your perfect journey.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={openEditTrip}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600"
            >
              <Edit3 size={17} />
              Edit Trip
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600"
            >
              <Share2 size={17} />
              Share
            </button>
          </div>
        </div>
      </section>

      {}

      <section className="mx-auto mt-8 max-w-7xl px-6 lg:px-8">
        <div className="grid gap-7 lg:grid-cols-[295px_1fr]">
          {}

          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6">
            {}

            <div className="overflow-hidden rounded-2xl">
              {trip.coverImage ? (
                <img
                  src={trip.coverImage}
                  alt={trip.name}
                  className="h-40 w-full object-cover"
                />
              ) : (
                <div className="flex h-40 items-center justify-center bg-linear-to-br from-indigo-100 via-blue-50 to-slate-100 text-indigo-400">
                  <Map size={42} />
                </div>
              )}
            </div>

            {}

            <div className="mt-5">
              <h2 className="text-xl font-bold text-slate-900">{trip.name}</h2>

              <p className="mt-2 text-sm text-slate-500">
                {formatDate(trip.startDate)}

                {" - "}

                {formatDate(trip.endDate)}
              </p>

              <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                <CalendarDays size={16} />

                <span>
                  {safeDays.length} {safeDays.length === 1 ? "day" : "days"}
                </span>

                <span>•</span>

                <span>
                  {totalActivities} {totalActivities === 1 ? "place" : "places"}
                </span>
              </div>
            </div>

            {}

            <button
              type="button"
              onClick={openEditTrip}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600"
            >
              <Edit3 size={17} />
              Edit Trip
            </button>

            {}

            <div className="mt-5 space-y-1">
              <SidebarButton
                active={activeSection === "overview"}
                icon={<MapPin size={20} />}
                label="Trip Overview"
                onClick={() => setActiveSection("overview")}
              />

              <SidebarButton
                active={activeSection === "itinerary"}
                icon={<CalendarDays size={20} />}
                label="Itinerary"
                onClick={() => setActiveSection("itinerary")}
              />

              <SidebarButton
                active={activeSection === "map"}
                icon={<Map size={20} />}
                label="Map"
                onClick={() => setActiveSection("map")}
              />

              <SidebarButton
                active={activeSection === "notes"}
                icon={<MessageSquare size={20} />}
                label="Notes"
                onClick={() => setActiveSection("notes")}
              />

              <SidebarButton
                active={false}
                icon={<Share2 size={20} />}
                label="Share"
                onClick={handleShare}
              />
            </div>

            {}

            <button
              type="button"
              onClick={handleAddDay}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 font-semibold text-white shadow-md transition hover:bg-indigo-700"
            >
              <Plus size={20} />
              Add New Day
            </button>

            {}

            <button
              type="button"
              onClick={deleteTrip}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50"
            >
              <Trash2 size={16} />
              Delete Trip
            </button>
          </aside>

          {}

          <main>
            {}

            {activeSection === "overview" && (
              <section className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                  <p className="text-sm font-medium text-indigo-600">
                    Trip Overview
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-slate-900">
                    {trip.name}
                  </h2>

                  <div className="mt-7 grid gap-4 sm:grid-cols-3">
                    <InfoCard
                      icon={<CalendarDays size={20} />}
                      label="Duration"
                      value={`${safeDays.length} days`}
                    />

                    <InfoCard
                      icon={<MapPin size={20} />}
                      label="Places"
                      value={`${totalActivities} places`}
                    />

                    <InfoCard
                      icon={<Clock3 size={20} />}
                      label="Start date"
                      value={formatDate(trip.startDate)}
                    />
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                  <h2 className="text-xl font-bold text-slate-900">
                    Trip Summary
                  </h2>

                  <p className="mt-3 leading-7 text-slate-500">
                    Your trip currently contains{" "}
                    <strong>{safeDays.length} days</strong> and{" "}
                    <strong>{totalActivities} planned places</strong>.
                  </p>

                  <button
                    type="button"
                    onClick={() => setActiveSection("itinerary")}
                    className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    View Itinerary
                  </button>
                </div>
              </section>
            )}

            {}

            {activeSection === "itinerary" && (
              <section>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Itinerary
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Organize your activities day by day.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddDay}
                    className="hidden items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:flex"
                  >
                    <Plus size={17} />
                    Add Day
                  </button>
                </div>

                <div className="space-y-4">
                  {safeDays.map((day, dayIndex) => {
                    const activities = Array.isArray(day.activities)
                      ? day.activities
                      : [];

                    return (
                      <div
                        key={day.id}
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                      >
                        {}

                        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                          <button
                            type="button"
                            onClick={() => toggleDay(day.id)}
                            className="flex items-center gap-3 text-left"
                          >
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                              <CalendarDays size={18} />
                            </div>

                            <div>
                              <p className="font-semibold text-slate-900">
                                Day {dayIndex + 1}
                              </p>

                              <p className="text-xs text-slate-500">
                                {formatDate(day.date)}
                              </p>
                            </div>
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openAddActivity(day.id)}
                              className="hidden items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50 sm:flex"
                            >
                              <Plus size={16} />
                              Add Activity
                            </button>

                            <button
                              type="button"
                              onClick={() => deleteDay(day.id)}
                              className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                              title="Delete day"
                            >
                              <Trash2 size={17} />
                            </button>

                            <button
                              type="button"
                              onClick={() => toggleDay(day.id)}
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
                            >
                              {expandedDays[day.id] ? (
                                <ChevronUp size={18} />
                              ) : (
                                <ChevronDown size={18} />
                              )}
                            </button>
                          </div>
                        </div>

                        {}

                        {expandedDays[day.id] && (
                          <div className="p-5">
                            {activities.length === 0 ? (
                              <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                  <MapPin size={22} />
                                </div>

                                <h3 className="mt-4 font-semibold text-slate-800">
                                  No activities yet
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                  Add a destination to this day.
                                </p>

                                <button
                                  type="button"
                                  onClick={() => openAddActivity(day.id)}
                                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                >
                                  <Plus size={16} />
                                  Add Activity
                                </button>
                              </div>
                            ) : (
                              <>
                                <div className="relative">
                                  <div className="absolute bottom-5 left-3 top-5 w-px bg-indigo-100" />

                                  <div className="space-y-7">
                                    {activities.map((activity) => (
                                      <ActivityItem
                                        key={activity.id}
                                        activity={activity}
                                        onEdit={() =>
                                          openEditActivity(day.id, activity)
                                        }
                                        onDelete={() =>
                                          deleteActivity(day.id, activity.id)
                                        }
                                      />
                                    ))}
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => openAddActivity(day.id)}
                                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-500 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
                                >
                                  <Plus size={17} />
                                  Add Activity
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {}

            {activeSection === "map" && (
              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-indigo-600">
                      Trip Map
                    </p>
                    <h2 className="mt-1 text-2xl font-bold text-slate-900">
                      Your destinations
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      See all destinations added to your itinerary on the map.
                    </p>
                  </div>

                  <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 sm:flex">
                    <Map size={22} />
                  </div>
                </div>

                <TripMap trip={trip} destinations={destinations} />
              </section>
            )}

            {}

            {activeSection === "notes" && (
              <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Trip Notes
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Save anything important about your trip.
                    </p>
                  </div>

                  <MessageSquare className="text-indigo-500" size={25} />
                </div>

                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Write your notes here..."
                  className="mt-7 min-h-87.5 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />

                <button
                  type="button"
                  onClick={saveNotes}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  <Save size={17} />
                  Save Notes
                </button>
              </section>
            )}
          </main>
        </div>
      </section>

      {}

      {showTripModal && (
        <TripModal
          form={tripForm}
          setForm={setTripForm}
          onClose={() => setShowTripModal(false)}
          onSubmit={trip ? handleUpdateTrip : handleCreateTrip}
          isEditing={Boolean(trip)}
        />
      )}

      {}

      {showActivityModal && (
        <ActivityModal
          form={activityForm}
          setForm={setActivityForm}
          destinations={destinations}
          loading={loadingDestinations}
          editingActivity={editingActivity}
          onClose={() => {
            setShowActivityModal(false);

            setEditingActivity(null);
          }}
          onSubmit={handleSaveActivity}
        />
      )}
    </div>
  );
}

export default MyTrips;
