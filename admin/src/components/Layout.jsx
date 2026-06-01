import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../store.js";

const links = [
  { to: "/", label: "Dashboard", icon: "📊", end: true },
  { to: "/products", label: "Products", icon: "📦" },
  { to: "/categories", label: "Categories", icon: "🏷️" },
  { to: "/banners", label: "Hero Banners", icon: "🖼️" },
  { to: "/orders", label: "Orders", icon: "🧾" },
  { to: "/settings", label: "Site Settings", icon: "⚙️" },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 flex-col bg-slate-900 text-slate-200 md:flex">
        <div className="px-6 py-5 text-xl font-extrabold">
          <span className="text-brand-500">Shop</span>Verse
          <span className="ml-1 text-xs font-normal text-slate-400">admin</span>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive ? "bg-brand-600 text-white" : "hover:bg-slate-800"
                }`
              }
            >
              <span>{l.icon}</span> {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-800 p-4 text-sm">
          <p className="font-medium">{user?.name}</p>
          <button
            onClick={() => { logout(); navigate("/login"); }}
            className="mt-2 text-slate-400 hover:text-red-400"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between bg-white px-6 py-3 shadow-sm md:hidden">
          <span className="font-extrabold"><span className="text-brand-600">Shop</span>Verse</span>
          <button onClick={() => { logout(); navigate("/login"); }} className="text-sm text-red-500">Logout</button>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
