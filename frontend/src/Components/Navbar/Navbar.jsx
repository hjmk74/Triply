import { useState } from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `relative py-3 text-lg font-medium transition ${
      isActive
        ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-blue-600"
        : "text-gray-700 hover:text-blue-600"
    }`;

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white">
      <div className="mx-auto flex min-h-22 items-center justify-between px-5 sm:px-8 lg:grid lg:grid-cols-3 lg:px-10">
        {}
        <div className="flex items-center">
          <NavLink
            to="/"
            className="flex items-center gap-2 sm:gap-3"
            onClick={closeMenu}
          >
            <img
              src="/images/logo/triply-logo.png"
              alt="Triply"
              className="h-10 w-10 object-contain sm:h-12 sm:w-12"
            />

            <span className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Triply
            </span>
          </NavLink>
        </div>

        {}
        <div className="hidden items-center justify-center gap-6 lg:flex xl:gap-8">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/explore" className={navLinkClass}>
            Explore
          </NavLink>

          <NavLink to="/my-trips" className={navLinkClass}>
            My Trips
          </NavLink>

          <NavLink to="/favorites" className={navLinkClass}>
            Favorites
          </NavLink>
        </div>

        {}
        <div className="hidden items-center justify-end lg:flex">
          <NavLink
            to="/profile"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-lg font-medium text-gray-700 transition hover:bg-gray-200"
            aria-label="Profile"
          >
            H
          </NavLink>
        </div>

        {}
        <div className="flex items-center gap-3 lg:hidden">
          <NavLink
            to="/profile"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-base font-medium text-gray-700 transition hover:bg-gray-200"
            aria-label="Profile"
          >
            H
          </NavLink>

          {}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {}
      {isMenuOpen && (
        <div className="border-t border-gray-100 bg-white px-5 py-4 shadow-sm lg:hidden">
          <div className="flex flex-col">
            <NavLink
              to="/"
              end
              onClick={closeMenu}
              className={({ isActive }) =>
                `rounded-lg px-4 py-3 text-base font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/explore"
              onClick={closeMenu}
              className={({ isActive }) =>
                `rounded-lg px-4 py-3 text-base font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                }`
              }
            >
              Explore
            </NavLink>

            <NavLink
              to="/my-trips"
              onClick={closeMenu}
              className={({ isActive }) =>
                `rounded-lg px-4 py-3 text-base font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                }`
              }
            >
              My Trips
            </NavLink>

            <NavLink
              to="/favorites"
              onClick={closeMenu}
              className={({ isActive }) =>
                `rounded-lg px-4 py-3 text-base font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                }`
              }
            >
              Favorites
            </NavLink>

            <NavLink
              to="/profile"
              onClick={closeMenu}
              className={({ isActive }) =>
                `rounded-lg px-4 py-3 text-base font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                }`
              }
            >
              Profile
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
