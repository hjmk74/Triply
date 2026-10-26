import { Link } from "react-router-dom";

function DestinationCard({ destination }) {
  return (
    <Link
      to={`/destination/${destination.id}`}
      className="block rounded-xl border p-6 transition hover:shadow-md"
    >
      {destination.image && (
        <img
          src={destination.image}
          alt={destination.name}
          className="h-48 w-full rounded-lg object-cover"
        />
      )}

      <h2 className="mt-4 text-2xl font-bold">{destination.name}</h2>

      <p className="mt-2 text-gray-600">{destination.country}</p>

      <p className="mt-4">{destination.description}</p>

      <div className="mt-4 flex gap-4">
        <span>⭐ {destination.rating}</span>
        <span>{destination.type}</span>
      </div>
    </Link>
  );
}

export default DestinationCard;
