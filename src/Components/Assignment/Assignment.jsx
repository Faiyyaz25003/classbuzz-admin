import { useState, useEffect } from "react";

const GRADIENTS = [
  "from-indigo-400 to-violet-500",
  "from-sky-400 to-indigo-500",
  "from-emerald-400 to-teal-500",
  "from-amber-400 to-red-400",
  "from-pink-400 to-violet-500",
];
const EMOJIS = ["📘", "📗", "📙", "📕", "📒"];

const STORAGE_KEY = "__vaultCards_v1";

function getSharedCards() {
  try {
    const raw = window[STORAGE_KEY];
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function setSharedCards(cards) {
  window[STORAGE_KEY] = cards;
}

function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold border
        ${
          type === "success"
            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
            : "bg-red-50 border-red-200 text-red-600"
        }`}
    >
      {type === "success" ? "✅" : "❌"} {msg}
    </div>
  );
}

export default function AdminAssignment() {
  const [cards, setCards] = useState(() => getSharedCards());
  const [teacher, setTeacher] = useState("");
  const [department, setDepartment] = useState("");
  const [className, setClassName] = useState("");
  const [docName, setDocName] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [openCard, setOpenCard] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type) => setToast({ msg, type });

  useEffect(() => {
    setSharedCards(cards);
    if (openCard) {
      const updated = cards.find((c) => c.id === openCard.id);
      if (updated) setOpenCard(updated);
    }
  }, [cards]);

  useEffect(() => {
    const interval = setInterval(() => {
      const shared = getSharedCards();
      if (
        JSON.stringify(shared) !== JSON.stringify(cards) &&
        shared.length > 0
      ) {
        setCards(shared);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [cards]);

  const createCard = () => {
    if (!className || !docName || !adminPassword) {
      showToast("Class Name, Document Name aur Password zaroori hai!", "error");
      return;
    }
    const idx = cards.length % 5;
    const newCard = {
      id: Date.now(),
      teacher,
      department,
      className,
      docName,
      password: adminPassword,
      files: [],
      colorIdx: idx,
    };
    setCards((prev) => [...prev, newCard]);
    setTeacher("");
    setDepartment("");
    setClassName("");
    setDocName("");
    setAdminPassword("");
    showToast("Folder successfully ban gaya!", "success");
  };

  const deleteFolder = (id, e) => {
    e.stopPropagation();
    setCards((prev) => prev.filter((c) => c.id !== id));
    if (openCard?.id === id) setOpenCard(null);
    showToast("Folder delete ho gaya!", "success");
  };

  const deleteFile = (cardId, fileIdx) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === cardId
          ? { ...c, files: c.files.filter((_, i) => i !== fileIdx) }
          : c,
      ),
    );
    showToast("File delete ho gayi!", "success");
  };

  const totalFiles = cards.reduce((sum, c) => sum + c.files.length, 0);

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 focus:bg-white transition-all";

  return (
    <div className="min-h-screen mt-[10px]  bg-slate-50 font-sans">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-lg shadow-inner">
              📂
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-800 leading-none">
                Document Vault
              </h1>
              <p className="text-xs text-slate-400 mt-0.5 tracking-wide uppercase">
                Academic Management
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 text-xs font-semibold tracking-wide uppercase">
            🛡️ Admin Panel
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            {
              num: cards.length,
              label: "Total Folders",
              icon: "🗂️",
              color: "indigo",
            },
            {
              num: totalFiles,
              label: "Total Files",
              icon: "📎",
              color: "violet",
            },
            {
              num: new Set(cards.map((c) => c.department).filter(Boolean)).size,
              label: "Departments",
              icon: "🏛️",
              color: "sky",
            },
          ].map(({ num, label, icon, color }) => (
            <div
              key={label}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4"
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl
                ${color === "indigo" ? "bg-indigo-50" : color === "violet" ? "bg-violet-50" : "bg-sky-50"}`}
              >
                {icon}
              </div>
              <div>
                <div
                  className={`text-2xl font-bold
                  ${color === "indigo" ? "text-indigo-600" : color === "violet" ? "text-violet-600" : "text-sky-600"}`}
                >
                  {num}
                </div>
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wide mt-0.5">
                  {label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {!openCard && (
          <>
            {/* Create Folder Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-6 rounded-full bg-indigo-500" />
                <h2 className="text-base font-bold text-slate-700">
                  Naya Folder Banao
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <input
                  className={inputClass}
                  placeholder="👩‍🏫 Teacher Ka Naam"
                  value={teacher}
                  onChange={(e) => setTeacher(e.target.value)}
                />
                <input
                  className={inputClass}
                  placeholder="🏛️ Department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
                <input
                  className={inputClass}
                  placeholder="📚 Class Ka Naam *"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                />
                <input
                  className={inputClass}
                  placeholder="📄 Document Ka Naam *"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                />
                <input
                  className={inputClass}
                  type="password"
                  placeholder="🔑 Folder Password *"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                />
              </div>

              <button
                onClick={createCard}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-200 hover:shadow-indigo-300 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                ＋ Folder Banao
              </button>
            </div>

            {/* All Folders */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 rounded-full bg-violet-500" />
                  <h2 className="text-base font-bold text-slate-700">
                    Sare Folders
                  </h2>
                </div>
                {cards.length > 0 && (
                  <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                    {cards.length} folder{cards.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {cards.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-5xl mb-3 opacity-30">📁</div>
                  <p className="text-slate-400 text-sm">
                    Abhi koi folder nahi hai. Upar se banao!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {cards.map((card) => (
                    <div
                      key={card.id}
                      onClick={() => setOpenCard(card)}
                      className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm cursor-pointer hover:-translate-y-1 hover:shadow-md hover:border-indigo-200 transition-all duration-200 group bg-white"
                    >
                      <div
                        className={`bg-gradient-to-br ${GRADIENTS[card.colorIdx]} h-20 flex items-center justify-center relative`}
                      >
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
                          {EMOJIS[card.colorIdx]}
                        </span>
                      </div>
                      <div className="p-3 border-t border-slate-100">
                        <h3 className="text-xs font-semibold text-slate-700 truncate">
                          {card.className}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5 truncate">
                          {card.teacher || "Teacher"}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5 font-medium">
                            📎 {card.files.length}
                          </span>
                          <button
                            onClick={(e) => deleteFolder(card.id, e)}
                            className="text-xs text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg px-2 py-0.5 font-medium transition-colors"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Folder Detail */}
        {openCard && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <button
              onClick={() => setOpenCard(null)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium mb-5 transition-colors"
            >
              ← Wapas Jao
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 rounded-full bg-indigo-500" />
              <h2 className="text-base font-bold text-slate-700">
                📂 {openCard.className}
              </h2>
            </div>

            {/* Meta chips */}
            <div className="flex flex-wrap gap-2 mb-5">
              {openCard.teacher && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-500 text-xs font-medium">
                  👩‍🏫 {openCard.teacher}
                </span>
              )}
              {openCard.department && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-500 text-xs font-medium">
                  🏛️ {openCard.department}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-medium">
                📎 {openCard.files.length} Documents
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-xs font-medium">
                🔑 {openCard.password}
              </span>
            </div>

            <div className="h-px bg-slate-100 mb-5" />

            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
              Uploaded Files
            </p>

            {openCard.files.length === 0 ? (
              <div className="text-center py-14">
                <div className="text-5xl mb-3 opacity-20">📭</div>
                <p className="text-slate-400 text-sm">
                  Is folder mein abhi koi file nahi hai.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {openCard.files.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-100 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 border border-indigo-200 flex items-center justify-center text-sm">
                        📄
                      </div>
                      <span className="text-sm text-slate-700 font-medium">
                        {f.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {f.url && (
                        <a
                          href={f.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg px-3 py-1.5 transition-colors"
                        >
                          Kholo ↗
                        </a>
                      )}
                      <button
                        onClick={() => deleteFile(openCard.id, i)}
                        className="text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg px-3 py-1.5 transition-colors"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <p className="text-center text-slate-300 text-xs mt-10 tracking-widest uppercase">
          Document Vault • Admin System
        </p>
      </div>

      {toast && (
        <Toast
          msg={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
