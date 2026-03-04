"use client";
import { useState, useEffect } from "react";
import axios from "axios";

const GAME_CATEGORIES = [
  "Sports",
  "Education",
  "Adventure",
  "Puzzle",
  "Trivia",
  "Strategy",
  "Other",
];
const GAME_TYPES = ["quiz", "puzzle", "trivia", "challenge", "other"];

const categoryColors = {
  Sports: "from-green-500 to-emerald-600",
  Education: "from-blue-500 to-cyan-600",
  Adventure: "from-orange-500 to-red-600",
  Puzzle: "from-purple-500 to-violet-600",
  Trivia: "from-yellow-500 to-amber-600",
  Strategy: "from-indigo-500 to-blue-600",
  Other: "from-gray-500 to-slate-600",
};

const gameTypeIcons = {
  quiz: "❓",
  puzzle: "🧩",
  trivia: "🧠",
  challenge: "⚡",
  other: "🎮",
};

export default function Event() {
  const [games, setGames] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Other",
    gameType: "other",
    imageUrl: "",
    assignedUserIds: [],
  });

  useEffect(() => {
    fetchGames();
    fetchUsers();
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchGames = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/games/all");
      setGames(res.data);
    } catch (err) {
      console.error("Error fetching games:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.category) {
      showToast("Title, Description aur Category required hai!", "error");
      return;
    }
    setLoading(true);
    try {
      if (editMode && selectedGame) {
        await axios.put(
          `http://localhost:5000/api/games/update/${selectedGame._id}`,
          form,
        );
        showToast("Game update ho gayi! ✅");
      } else {
        await axios.post("http://localhost:5000/api/games/create", form);
        showToast("Game create ho gayi! Emails bhej diye gaye 📧");
      }
      fetchGames();
      resetForm();
    } catch (err) {
      showToast(err.response?.data?.message || "Error aaya!", "error");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Yeh game delete karna chahte ho?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/games/delete/${id}`);
      showToast("Game delete ho gayi! 🗑️");
      fetchGames();
      if (selectedGame?._id === id) setSelectedGame(null);
    } catch {
      showToast("Delete failed!", "error");
    }
  };

  const handleEdit = (game) => {
    setForm({
      title: game.title,
      description: game.description,
      category: game.category,
      gameType: game.gameType,
      imageUrl: game.imageUrl || "",
      assignedUserIds:
        game.assignedUsers?.map((u) => u.userId?.toString() || "") || [],
    });
    setSelectedGame(game);
    setEditMode(true);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      category: "Other",
      gameType: "other",
      imageUrl: "",
      assignedUserIds: [],
    });
    setShowForm(false);
    setEditMode(false);
    setSelectedGame(null);
  };

  const toggleUser = (userId) => {
    setForm((prev) => ({
      ...prev,
      assignedUserIds: prev.assignedUserIds.includes(userId)
        ? prev.assignedUserIds.filter((id) => id !== userId)
        : [...prev.assignedUserIds, userId],
    }));
  };

  return (
    <div className="min-h-screen bg-[#080814] text-white font-sans">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-xl shadow-2xl text-sm font-semibold transition-all duration-300 ${
            toast.type === "error"
              ? "bg-red-600 text-white"
              : "bg-gradient-to-r from-violet-600 to-cyan-500 text-white"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="border-b border-white/10 bg-[#0d0d1f]/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-xl">
              🎮
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Game Portal</h1>
              <p className="text-xs text-white/40">Admin Dashboard</p>
            </div>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-violet-500/20"
          >
            <span className="text-lg">+</span> New Game
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Create/Edit Form */}
        {showForm && (
          <div className="mb-10 bg-[#0d0d1f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-violet-600/20 to-cyan-500/10 px-8 py-5 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-lg font-bold">
                {editMode ? "✏️ Game Edit Karo" : "🎯 Nayi Game Banao"}
              </h2>
              <button
                onClick={resetForm}
                className="text-white/40 hover:text-white text-xl transition"
              >
                ✕
              </button>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="col-span-2 md:col-span-1">
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">
                  Game Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Cricket Quiz Challenge"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500 focus:bg-white/8 transition placeholder-white/20"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">
                  Image URL (Optional)
                </label>
                <input
                  type="text"
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm({ ...form, imageUrl: e.target.value })
                  }
                  placeholder="https://..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500 transition placeholder-white/20"
                />
              </div>

              {/* Description */}
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">
                  Description *
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                  placeholder="Game ke baare mein batao..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500 transition placeholder-white/20 resize-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">
                  Category *
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full bg-[#0d0d1f] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500 transition"
                >
                  {GAME_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Game Type */}
              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">
                  Game Type
                </label>
                <select
                  value={form.gameType}
                  onChange={(e) =>
                    setForm({ ...form, gameType: e.target.value })
                  }
                  className="w-full bg-[#0d0d1f] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500 transition"
                >
                  {GAME_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {gameTypeIcons[t]}{" "}
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assign Users */}
              {!editMode && (
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">
                    Users Assign Karo{" "}
                    <span className="text-violet-400">
                      ({form.assignedUserIds.length} selected)
                    </span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-52 overflow-y-auto pr-1">
                    {users.length === 0 && (
                      <p className="text-white/30 text-sm col-span-4">
                        Users load nahi hue...
                      </p>
                    )}
                    {users.map((user) => {
                      const selected = form.assignedUserIds.includes(user._id);
                      return (
                        <button
                          key={user._id}
                          type="button"
                          onClick={() => toggleUser(user._id)}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all duration-150 ${
                            selected
                              ? "border-violet-500 bg-violet-500/20 text-violet-300"
                              : "border-white/10 bg-white/5 text-white/60 hover:border-white/30"
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${selected ? "bg-violet-500" : "bg-white/10"}`}
                          >
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate">
                              {user.name}
                            </p>
                            <p className="text-[10px] text-white/40 truncate">
                              {user.email}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {form.assignedUserIds.length > 0 && (
                    <p className="text-xs text-cyan-400 mt-2">
                      📧 In sabko email milega unique password ke saath
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="px-8 pb-8 flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 disabled:opacity-50 py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 shadow-lg"
              >
                {loading
                  ? "⏳ Please wait..."
                  : editMode
                    ? "✅ Update Game"
                    : "🚀 Create Game & Send Emails"}
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-3 rounded-xl border border-white/10 text-sm text-white/60 hover:text-white hover:border-white/30 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            {
              label: "Total Games",
              value: games.length,
              icon: "🎮",
              color: "from-violet-600/20 to-violet-600/5",
            },
            {
              label: "Total Users",
              value: users.length,
              icon: "👥",
              color: "from-cyan-600/20 to-cyan-600/5",
            },
            {
              label: "Active Games",
              value: games.filter((g) => g.isActive).length,
              icon: "✅",
              color: "from-green-600/20 to-green-600/5",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`bg-gradient-to-br ${stat.color} border border-white/10 rounded-2xl p-5`}
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-white/40 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Games Grid */}
        <div>
          <h2 className="text-lg font-bold mb-5 text-white/80">All Games</h2>
          {games.length === 0 ? (
            <div className="text-center py-24 text-white/20">
              <div className="text-6xl mb-4">🎮</div>
              <p className="text-lg">Koi game nahi hai abhi</p>
              <p className="text-sm mt-1">New Game button se banao</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {games.map((game) => (
                <div
                  key={game._id}
                  className="group bg-[#0d0d1f] border border-white/10 rounded-2xl overflow-hidden hover:border-violet-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10 cursor-pointer"
                  onClick={() =>
                    setSelectedGame(
                      selectedGame?._id === game._id ? null : game,
                    )
                  }
                >
                  {/* Game Card Image/Banner */}
                  <div
                    className={`h-32 bg-gradient-to-br ${categoryColors[game.category] || categoryColors.Other} relative overflow-hidden`}
                  >
                    {game.imageUrl ? (
                      <img
                        src={game.imageUrl}
                        alt={game.title}
                        className="w-full h-full object-cover opacity-80"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl opacity-60">
                        {gameTypeIcons[game.gameType] || "🎮"}
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-black/40 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                      {game.category}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-sm mb-1 truncate">
                      {game.title}
                    </h3>
                    <p className="text-white/40 text-xs line-clamp-2 mb-3">
                      {game.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-white/30">
                      <span>
                        {gameTypeIcons[game.gameType]} {game.gameType}
                      </span>
                      <span>👥 {game.assignedUsers?.length || 0} users</span>
                    </div>

                    {/* Expand: Assigned Users */}
                    {selectedGame?._id === game._id && (
                      <div
                        className="mt-4 pt-4 border-t border-white/10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <p className="text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-2">
                          Assigned Users
                        </p>
                        {game.assignedUsers?.length === 0 ? (
                          <p className="text-white/30 text-xs">
                            Koi user assign nahi
                          </p>
                        ) : (
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {game.assignedUsers.map((u, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2 text-xs"
                              >
                                <div className="w-6 h-6 rounded-full bg-violet-500/30 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                                  {u.name?.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-medium">{u.name}</p>
                                  <p className="text-white/30">{u.email}</p>
                                </div>
                                <span
                                  className={`ml-auto text-[10px] px-2 py-0.5 rounded-full ${u.hasAccessed ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}
                                >
                                  {u.hasAccessed ? "✓" : "Pending"}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <div
                      className="flex gap-2 mt-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => handleEdit(game)}
                        className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-violet-500/20 hover:text-violet-300 text-xs font-semibold transition border border-white/10 hover:border-violet-500/40"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(game._id)}
                        className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-xs font-semibold transition border border-white/10 hover:border-red-500/40"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
