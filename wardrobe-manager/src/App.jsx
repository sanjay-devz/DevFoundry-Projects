import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  Shirt,
  CalendarDays,
  Footprints,
  WashingMachine,
  Plus,
  Search,
  Bell,
  ChevronDown,
  ArrowUpRight,
  Trash2,
  X,
  Check,
  Menu,
  Sparkles,
  Package,
  Layers3,
} from "lucide-react";
import "./App.css";

const INITIAL_CLOTHES = [
  {
    id: 1,
    name: "Classic White Shirt",
    category: "Shirts",
    color: "White",
    hex: "#F2F0E9",
    season: "All season",
    image:
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Relaxed Black Tee",
    category: "T-Shirts",
    color: "Black",
    hex: "#343434",
    season: "All season",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Everyday Denim",
    category: "Pants",
    color: "Blue",
    hex: "#536C8A",
    season: "All season",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Minimal Sneakers",
    category: "Shoes",
    color: "White",
    hex: "#F2F0E9",
    season: "All season",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Everyday Watch",
    category: "Accessories",
    color: "Black",
    hex: "#343434",
    season: "All season",
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "Neutral Overshirt",
    category: "Jackets",
    color: "Beige",
    hex: "#C7B69A",
    season: "Winter",
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop",
  },
];

const CATEGORIES = [
  "All",
  "Shirts",
  "T-Shirts",
  "Pants",
  "Jackets",
  "Shoes",
  "Accessories",
];

const NAV_ITEMS = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "My Wardrobe", icon: Shirt },
  { label: "Outfit Planner", icon: CalendarDays },
  { label: "Accessories", icon: Footprints },
  { label: "Maintenance", icon: WashingMachine },
];

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function App() {
  const [clothes, setClothes] = useState(() =>
    readStorage("wardrobe-clothes", INITIAL_CLOTHES)
  );

  const [outfits, setOutfits] = useState(() =>
    readStorage("wardrobe-outfits", {})
  );

  const [maintenance, setMaintenance] = useState(() =>
    readStorage("wardrobe-maintenance", [])
  );

  const [activePage, setActivePage] = useState("Overview");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [notice, setNotice] = useState("");

  const [form, setForm] = useState({
    name: "",
    category: "Shirts",
    color: "White",
    hex: "#F2F0E9",
    season: "All season",
    image: "",
  });

  const [outfitDay, setOutfitDay] = useState("Monday");
  const [outfitItem, setOutfitItem] = useState("");

  useEffect(() => {
    localStorage.setItem("wardrobe-clothes", JSON.stringify(clothes));
  }, [clothes]);

  useEffect(() => {
    localStorage.setItem("wardrobe-outfits", JSON.stringify(outfits));
  }, [outfits]);

  useEffect(() => {
    localStorage.setItem(
      "wardrobe-maintenance",
      JSON.stringify(maintenance)
    );
  }, [maintenance]);

  const filteredClothes = useMemo(() => {
    return clothes.filter((item) => {
      const matchesCategory =
        category === "All" || item.category === category;

      const query = search.trim().toLowerCase();

      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.color.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [clothes, category, search]);

  const categoryCounts = useMemo(() => {
    return CATEGORIES.slice(1).map((name) => ({
      name,
      count: clothes.filter((item) => item.category === name).length,
    }));
  }, [clothes]);

  const stats = [
    {
      label: "Total Items",
      value: clothes.length,
      icon: Package,
      note: "Items in your wardrobe",
    },
    {
      label: "Categories",
      value: new Set(clothes.map((item) => item.category)).size,
      icon: Layers3,
      note: "Types of clothing",
    },
    {
      label: "Planned Outfits",
      value: Object.keys(outfits).filter((day) => outfits[day]).length,
      icon: CalendarDays,
      note: "Days with an outfit",
    },
    {
      label: "Maintenance Tasks",
      value: maintenance.filter((task) => !task.done).length,
      icon: WashingMachine,
      note: "Tasks still pending",
    },
  ];

  function notify(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2500);
  }

  function openAddForm(defaultCategory = "Shirts") {
    setForm({
      name: "",
      category: defaultCategory,
      color: "White",
      hex: "#F2F0E9",
      season: "All season",
      image: "",
    });

    setShowForm(true);
  }

  function addClothing(event) {
    event.preventDefault();

    const name = form.name.trim();

    if (!name) {
      notify("Please enter a clothing name.");
      return;
    }

    const newItem = {
      ...form,
      name,
      image: form.image.trim(),
      id: crypto.randomUUID(),
    };

    setClothes((previous) => [newItem, ...previous]);
    setShowForm(false);
    setCategory("All");
    setSearch("");
    setActivePage(
      newItem.category === "Accessories"
        ? "Accessories"
        : "My Wardrobe"
    );

    notify("Item added to your wardrobe!");
  }

  function deleteClothing(id) {
    const item = clothes.find((clothing) => clothing.id === id);

    if (!window.confirm(`Delete "${item?.name ?? "this item"}"?`)) {
      return;
    }

    setClothes((previous) =>
      previous.filter((item) => item.id !== id)
    );

    setOutfits((previous) => {
      const updated = { ...previous };

      Object.keys(updated).forEach((day) => {
        if (updated[day] === id) {
          delete updated[day];
        }
      });

      return updated;
    });

    notify("Item deleted.");
  }

  function assignOutfit(event) {
    event.preventDefault();

    if (!outfitItem) {
      notify("Select an item first.");
      return;
    }

    setOutfits((previous) => ({
      ...previous,
      [outfitDay]: outfitItem,
    }));

    notify(`Outfit planned for ${outfitDay}.`);
  }

  function addMaintenance(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "").trim();

    if (!title) {
      notify("Enter a maintenance task.");
      return;
    }

    setMaintenance((previous) => [
      {
        id: crypto.randomUUID(),
        title,
        due: String(formData.get("due") ?? ""),
        done: false,
      },
      ...previous,
    ]);

    event.currentTarget.reset();
    notify("Maintenance task added.");
  }

  function toggleMaintenance(id) {
    setMaintenance((previous) =>
      previous.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  }

  function navigate(label) {
    setActivePage(label);
    setMobileMenu(false);

    if (label === "Accessories") {
      setCategory("Accessories");
      setSearch("");
    } else {
      setCategory("All");
      setSearch("");
    }
  }

  const pageTitles = {
    Overview: {
      title: "Your wardrobe, simplified.",
      subtitle: "A little organization goes a long way.",
    },
    "My Wardrobe": {
      title: "My Wardrobe",
      subtitle: "Every piece, thoughtfully organized.",
    },
    "Outfit Planner": {
      title: "Outfit Planner",
      subtitle: "Make getting dressed the easiest part of your day.",
    },
    Accessories: {
      title: "Accessories",
      subtitle: "The finishing touches to your everyday style.",
    },
    Maintenance: {
      title: "Wardrobe Care",
      subtitle: "Take care of your clothes and make them last.",
    },
  };

  const page = pageTitles[activePage];

  return (
    <div className="app-shell">
      {mobileMenu && (
        <button
          className="mobile-backdrop"
          aria-label="Close navigation"
          onClick={() => setMobileMenu(false)}
        />
      )}

      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <Shirt size={23} strokeWidth={1.7} />
          </div>

          <div>
            <h2>wardrobe<span>.</span></h2>
            <p>YOUR PERSONAL SPACE</p>
          </div>

          <button
            className="icon-button sidebar-close"
            aria-label="Close menu"
            onClick={() => setMobileMenu(false)}
          >
            <X size={19} />
          </button>
        </div>

        <div className="nav-label">WORKSPACE</div>

        <nav className="navigation">
          {NAV_ITEMS.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${
                activePage === label ? "nav-active" : ""
              }`}
              onClick={() => navigate(label)}
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{label}</span>
              {activePage === label && (
                <span className="nav-indicator" />
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <div className="tip-icon">
              <Sparkles size={19} />
            </div>
            <p className="tip-title">Wear what you love.</p>
            <p className="tip-copy">
              A thoughtful wardrobe starts with knowing what you own.
            </p>
          </div>

          <div className="profile">
            <div className="avatar">S</div>
            <div className="profile-info">
              <strong>My Wardrobe</strong>
              <span>Personal collection</span>
            </div>
            <ChevronDown size={16} />
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button
            className="icon-button mobile-menu-button"
            aria-label="Open navigation"
            onClick={() => setMobileMenu(true)}
          >
            <Menu size={22} />
          </button>

          <div className="breadcrumb">
            Workspace <span>/</span> <strong>{activePage}</strong>
          </div>

          <div className="topbar-right">
            <span className="date-label">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
            </span>

            <button
              className="icon-button notification-button"
              title="Notifications"
              aria-label="Notifications"
              onClick={() =>
                notify(
                  `${maintenance.filter((task) => !task.done).length} maintenance tasks pending.`
                )
              }
            >
              <Bell size={19} />
              {maintenance.some((task) => !task.done) && (
                <span className="notification-dot" />
              )}
            </button>

            <div className="topbar-avatar">S</div>
          </div>
        </header>

        <div className="page-content">
          <section className="page-heading">
            <div>
              <p className="eyebrow">
                {activePage === "Overview"
                  ? "YOUR PERSONAL STYLE"
                  : "YOUR COLLECTION"}
              </p>

              <h1>{page.title}</h1>
              <p className="page-subtitle">{page.subtitle}</p>
            </div>

            <button
              className="primary-button"
              onClick={() =>
                openAddForm(
                  activePage === "Accessories"
                    ? "Accessories"
                    : "Shirts"
                )
              }
            >
              <Plus size={18} />
              Add new item
            </button>
          </section>

          {activePage === "Overview" && (
            <>
              <section className="hero-banner">
                <div className="hero-copy">
                  <span className="hero-tag">
                    <Sparkles size={13} /> YOUR STYLE, YOUR RULES
                  </span>

                  <h2>
                    Less clutter.
                    <br />
                    <em>More outfits.</em>
                  </h2>

                  <p>
                    Make the most of what you own. Your entire wardrobe,
                    one beautifully organized space.
                  </p>

                  <button
                    className="hero-button"
                    onClick={() => navigate("My Wardrobe")}
                  >
                    Explore my wardrobe
                    <ArrowUpRight size={17} />
                  </button>
                </div>

                <div className="hero-visual" aria-hidden="true">
                  <div className="hero-orbit" />
                  <div className="hero-photo hero-photo-one" />
                  <div className="hero-photo hero-photo-two" />
                  <div className="hero-photo hero-photo-three" />
                  <div className="hero-stamp">
                    <Sparkles size={19} />
                    <span>CURATED</span>
                    <strong>BY YOU</strong>
                  </div>
                </div>
              </section>

              <section className="stats-grid">
                {stats.map(({ label, value, icon: Icon, note }) => (
                  <article className="stat-card" key={label}>
                    <div className="stat-top">
                      <span>{label}</span>
                      <div className="stat-icon">
                        <Icon size={19} />
                      </div>
                    </div>

                    <div className="stat-value">{value}</div>
                    <p>{note}</p>
                  </article>
                ))}
              </section>

              <section className="section-block">
                <div className="section-heading">
                  <div>
                    <h2>Browse by category</h2>
                    <p>Find exactly what you need.</p>
                  </div>

                  <button
                    className="text-button"
                    onClick={() => navigate("My Wardrobe")}
                  >
                    View all <ArrowUpRight size={16} />
                  </button>
                </div>

                <div className="category-grid">
                  {categoryCounts.map(({ name, count }, index) => (
                    <button
                      className="category-card"
                      key={name}
                      onClick={() => {
                        setCategory(name);
                        setSearch("");
                        setActivePage(
                          name === "Accessories"
                            ? "Accessories"
                            : "My Wardrobe"
                        );
                      }}
                    >
                      <div
                        className={`category-visual category-visual-${index}`}
                      >
                        <Shirt
                          size={34}
                          strokeWidth={1.2}
                          className="category-visual-icon"
                        />
                      </div>

                      <div className="category-card-bottom">
                        <div>
                          <strong>{name}</strong>
                          <span>
                            {count} {count === 1 ? "item" : "items"}
                          </span>
                        </div>
                        <ArrowUpRight size={17} />
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <section className="section-block">
                <div className="section-heading">
                  <div>
                    <h2>Recently added</h2>
                    <p>Your latest wardrobe additions.</p>
                  </div>

                  <button
                    className="text-button"
                    onClick={() => navigate("My Wardrobe")}
                  >
                    See collection <ArrowUpRight size={16} />
                  </button>
                </div>

                <ClothingGrid
                  items={clothes.slice(0, 4)}
                  onDelete={deleteClothing}
                  onAdd={() => openAddForm()}
                />
              </section>
            </>
          )}

          {(activePage === "My Wardrobe" ||
            activePage === "Accessories") && (
            <section className="section-block collection-section">
              <div className="collection-toolbar">
                <div>
                  <h2>
                    {activePage === "Accessories"
                      ? "Your accessories"
                      : "All your pieces"}
                  </h2>
                  <p>
                    {filteredClothes.length} items in this view
                  </p>
                </div>

                <div className="search-box">
                  <Search size={18} />
                  <input
                    type="search"
                    placeholder="Search your wardrobe..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />

                  {search && (
                    <button
                      className="search-clear"
                      aria-label="Clear search"
                      onClick={() => setSearch("")}
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
              </div>

              <div className="filter-row">
                {CATEGORIES.map((name) => (
                  <button
                    key={name}
                    className={`filter-chip ${
                      category === name ? "filter-active" : ""
                    }`}
                    onClick={() => {
                      setCategory(name);
                      if (name === "Accessories") {
                        setActivePage("Accessories");
                      } else if (activePage === "Accessories") {
                        setActivePage("My Wardrobe");
                      }
                    }}
                  >
                    {name}
                    {name === "All" && ` (${clothes.length})`}
                  </button>
                ))}
              </div>

              {filteredClothes.length > 0 ? (
                <ClothingGrid
                  items={filteredClothes}
                  onDelete={deleteClothing}
                  onAdd={() => openAddForm()}
                />
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">
                    <Shirt size={28} />
                  </div>
                  <h3>No items found</h3>
                  <p>
                    Try a different search or add something to your wardrobe.
                  </p>
                  <button
                    className="primary-button"
                    onClick={() => openAddForm()}
                  >
                    <Plus size={17} /> Add an item
                  </button>
                </div>
              )}
            </section>
          )}

          {activePage === "Outfit Planner" && (
            <section className="section-block planner-layout">
              <div className="panel planner-form-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Plan an outfit</h2>
                    <p>Choose an item for each day.</p>
                  </div>
                  <CalendarDays size={22} />
                </div>

                <form className="stack-form" onSubmit={assignOutfit}>
                  <label>
                    Day of the week
                    <select
                      value={outfitDay}
                      onChange={(event) => setOutfitDay(event.target.value)}
                    >
                      {WEEKDAYS.map((day) => (
                        <option key={day}>{day}</option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Clothing item
                    <select
                      value={outfitItem}
                      onChange={(event) =>
                        setOutfitItem(event.target.value)
                      }
                      required
                    >
                      <option value="">Choose an item</option>
                      {clothes.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} — {item.category}
                        </option>
                      ))}
                    </select>
                  </label>

                  <button
                    className="primary-button full-button"
                    type="submit"
                    disabled={clothes.length === 0}
                  >
                    Save outfit <Check size={17} />
                  </button>
                </form>

                {clothes.length === 0 && (
                  <p className="helper-text">
                    Add some clothing items before planning an outfit.
                  </p>
                )}
              </div>

              <div className="panel weekly-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Your week</h2>
                    <p>Your outfit plan at a glance.</p>
                  </div>
                  <span className="week-badge">7 DAYS</span>
                </div>

                <div className="week-list">
                  {WEEKDAYS.map((day) => {
                    const item = clothes.find(
                      (clothing) => clothing.id === outfits[day]
                    );

                    return (
                      <div className="week-row" key={day}>
                        <div className="week-day">
                          <span className="week-day-dot" />
                          <strong>{day}</strong>
                        </div>

                        {item ? (
                          <div className="planned-outfit">
                            {item.image ? (
                              <img src={item.image} alt="" />
                            ) : (
                              <div
                                className="planned-color"
                                style={{ background: item.hex }}
                              />
                            )}
                            <div>
                              <strong>{item.name}</strong>
                              <span>{item.category}</span>
                            </div>
                            <button
                              className="icon-button small-delete"
                              title="Remove planned outfit"
                              aria-label={`Remove outfit for ${day}`}
                              onClick={() =>
                                setOutfits((previous) => {
                                  const updated = { ...previous };
                                  delete updated[day];
                                  return updated;
                                })
                              }
                            >
                              <X size={15} />
                            </button>
                          </div>
                        ) : (
                          <button
                            className="plan-day-button"
                            onClick={() => setOutfitDay(day)}
                          >
                            <Plus size={15} /> Plan day
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {activePage === "Maintenance" && (
            <section className="section-block maintenance-layout">
              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <h2>Add a care task</h2>
                    <p>Keep your clothes in great condition.</p>
                  </div>
                  <WashingMachine size={22} />
                </div>

                <form className="stack-form" onSubmit={addMaintenance}>
                  <label>
                    Task description
                    <input
                      name="title"
                      placeholder="e.g. Wash white shirts"
                      required
                    />
                  </label>

                  <label>
                    Due date
                    <input name="due" type="date" min={getToday()} />
                  </label>

                  <button className="primary-button full-button" type="submit">
                    <Plus size={17} /> Add task
                  </button>
                </form>
              </div>

              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <h2>Care checklist</h2>
                    <p>
                      {maintenance.filter((task) => !task.done).length} tasks
                      remaining
                    </p>
                  </div>
                  <WashingMachine size={22} />
                </div>

                {maintenance.length === 0 ? (
                  <div className="empty-state compact-empty">
                    <p>No maintenance tasks yet.</p>
                  </div>
                ) : (
                  <div className="maintenance-list">
                    {maintenance.map((task) => (
                      <div
                        className={`maintenance-row ${
                          task.done ? "maintenance-done" : ""
                        }`}
                        key={task.id}
                      >
                        <button
                          className={`task-check ${
                            task.done ? "task-checked" : ""
                          }`}
                          aria-label={
                            task.done
                              ? "Mark task incomplete"
                              : "Mark task complete"
                          }
                          onClick={() => toggleMaintenance(task.id)}
                        >
                          {task.done && <Check size={15} />}
                        </button>

                        <div className="task-details">
                          <strong>{task.title}</strong>
                          <span>
                            {task.due
                              ? `Due ${task.due}`
                              : "No due date"}
                          </span>
                        </div>

                        <button
                          className="icon-button small-delete"
                          aria-label="Delete task"
                          onClick={() =>
                            setMaintenance((previous) =>
                              previous.filter((entry) => entry.id !== task.id)
                            )
                          }
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          <footer className="page-footer">
            <span>WARDROBE. © {new Date().getFullYear()}</span>
            <span>Thoughtfully organized, effortlessly styled.</span>
          </footer>
        </div>
      </main>

      {showForm && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowForm(false);
            }
          }}
        >
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-item-title"
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow">YOUR COLLECTION</p>
                <h2 id="add-item-title">Add a new item</h2>
              </div>

              <button
                className="icon-button"
                aria-label="Close form"
                onClick={() => setShowForm(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form className="stack-form" onSubmit={addClothing}>
              <label>
                Item name
                <input
                  autoFocus
                  placeholder="e.g. Beige linen shirt"
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  required
                  maxLength={100}
                />
              </label>

              <div className="form-grid">
                <label>
                  Category
                  <select
                    value={form.category}
                    onChange={(event) =>
                      setForm({ ...form, category: event.target.value })
                    }
                  >
                    {CATEGORIES.slice(1).map((name) => (
                      <option key={name}>{name}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Color
                  <select
                    value={form.color}
                    onChange={(event) => {
                      const colors = {
                        White: "#F2F0E9",
                        Black: "#343434",
                        Beige: "#C7B69A",
                        Blue: "#536C8A",
                        Brown: "#795548",
                        Green: "#667C63",
                        Grey: "#969696",
                        Red: "#A64B43",
                        Other: "#B9A6C9",
                      };

                      setForm({
                        ...form,
                        color: event.target.value,
                        hex: colors[event.target.value],
                      });
                    }}
                  >
                    {[
                      "White",
                      "Black",
                      "Beige",
                      "Blue",
                      "Brown",
                      "Green",
                      "Grey",
                      "Red",
                      "Other",
                    ].map((color) => (
                      <option key={color}>{color}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label>
                Season
                <select
                  value={form.season}
                  onChange={(event) =>
                    setForm({ ...form, season: event.target.value })
                  }
                >
                  <option>All season</option>
                  <option>Summer</option>
                  <option>Winter</option>
                  <option>Rainy season</option>
                </select>
              </label>

              <label>
                Image URL <span className="optional-label">OPTIONAL</span>
                <input
                  type="url"
                  placeholder="https://example.com/my-shirt.jpg"
                  value={form.image}
                  onChange={(event) =>
                    setForm({ ...form, image: event.target.value })
                  }
                />
              </label>

              {form.image && (
                <div className="image-preview">
                  <img
                    src={form.image}
                    alt="Clothing preview"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                    onLoad={(event) => {
                      event.currentTarget.style.display = "block";
                    }}
                  />
                </div>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="primary-button">
                  <Plus size={17} /> Add to wardrobe
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {notice && (
        <div className="toast" role="status">
          <Check size={18} /> {notice}
        </div>
      )}
    </div>
  );
}

function ClothingGrid({ items, onDelete, onAdd }) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <Shirt size={28} />
        </div>
        <h3>Your wardrobe is waiting</h3>
        <p>Add your first item to start building your collection.</p>
        <button className="primary-button" onClick={onAdd}>
          <Plus size={17} /> Add an item
        </button>
      </div>
    );
  }

  return (
    <div className="clothing-grid">
      {items.map((item) => (
        <article className="clothing-card" key={item.id}>
          <div className="clothing-image">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                  event.currentTarget.nextElementSibling.style.display =
                    "grid";
                }}
              />
            ) : null}

            <div
              className="image-placeholder"
              style={{ display: item.image ? "none" : "grid" }}
            >
              <Shirt size={36} strokeWidth={1.3} />
            </div>

            <span className="item-category">{item.category}</span>

            <button
              className="delete-item-button"
              title="Delete item"
              aria-label={`Delete ${item.name}`}
              onClick={() => onDelete(item.id)}
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div className="clothing-info">
            <h3>{item.name}</h3>

            <div className="clothing-meta">
              <span className="color-label">
                <span
                  className="color-swatch"
                  style={{ backgroundColor: item.hex }}
                />
                {item.color}
              </span>

              <span>{item.season}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export default App;