import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const isDark = (): boolean => typeof document !== "undefined" && document.documentElement.classList.contains("dark");

// ThemeToggle switches the "dark" class on <html> and remembers the choice in
// localStorage.theme; resources/views/app.html applies it before the first paint.
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [dark, setDark] = useState(false);

  useEffect(() => setDark(isDark()), []);

  const toggle = () => {
    const next = !isDark();
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // Storage can be blocked (private mode): the choice lasts for this page only.
    }
    setDark(next);
  };

  const label = dark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`inline-flex size-9 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 ${className}`}
    >
      {dark ? <Sun aria-hidden="true" className="size-4" /> : <Moon aria-hidden="true" className="size-4" />}
    </button>
  );
}
