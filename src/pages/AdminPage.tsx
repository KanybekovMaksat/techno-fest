import { useState, useEffect } from "react"
import { supabase, type Registration, type TeamMember } from "@/lib/supabase"

const EVENT_NAMES: Record<string, string> = {
    hackathon: "Хакатон",
    eco: "Эко-Баттл",
    cyber: "Киберспорт (CS2)",
    robot: "Робототехника",
    cosplay: "Косплей",
}

const ADMIN_LOGIN = "admin"
const ADMIN_PASSWORD = "comtehnobest"

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")
    const [loginError, setLoginError] = useState("")

    const [registrations, setRegistrations] = useState<Registration[]>([])
    const [loading, setLoading] = useState(false)
    const [filterEvent, setFilterEvent] = useState("all")
    const [expandedId, setExpandedId] = useState<number | null>(null)

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        if (login === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
            setIsAuthenticated(true)
            setLoginError("")
        } else {
            setLoginError("Неверный логин или пароль")
        }
    }

    const fetchRegistrations = async () => {
        setLoading(true)
        try {
            const { data: regs, error: regError } = await supabase
                .from("registrations")
                .select("*")
                .order("created_at", { ascending: false })

            if (regError) throw regError

            // Fetch all team members
            const { data: members, error: memError } = await supabase
                .from("team_members")
                .select("*")

            if (memError) throw memError

            // Merge members into registrations
            const merged = (regs || []).map((reg: Registration) => ({
                ...reg,
                team_members: (members || []).filter(
                    (m: TeamMember) => m.registration_id === reg.id
                ),
            }))

            setRegistrations(merged)
        } catch (err) {
            console.error("Fetch error:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            fetchRegistrations()
        }
    }, [isAuthenticated])

    const filtered =
        filterEvent === "all"
            ? registrations
            : registrations.filter((r) => r.event === filterEvent)

    const totalCount = registrations.length
    const eventCounts = registrations.reduce(
        (acc, r) => {
            acc[r.event] = (acc[r.event] || 0) + 1
            return acc
        },
        {} as Record<string, number>
    )

    // ===== LOGIN SCREEN =====
    if (!isAuthenticated) {
        return (
            <div className="admin-login-wrapper">
                <form className="admin-login-form" onSubmit={handleLogin}>
                    <div className="admin-login-header">
                        <span className="admin-login-icon">🔒</span>
                        <h1 className="admin-login-title">Админ-панель</h1>
                        <p className="admin-login-sub">TECHNOFEST 2026</p>
                    </div>

                    {loginError && <div className="admin-login-error">{loginError}</div>}

                    <div className="form-group">
                        <label className="form-label">Логин</label>
                        <input
                            className="form-input"
                            type="text"
                            placeholder="Введите логин"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Пароль</label>
                        <input
                            className="form-input"
                            type="password"
                            placeholder="Введите пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn-submit">
                        Войти
                    </button>
                </form>
            </div>
        )
    }

    // ===== ADMIN DASHBOARD =====
    return (
        <div className="admin-wrapper">
            {/* Admin Header */}
            <header className="admin-header">
                <div className="header-inner">
                    <a href="/" className="header-logo">
                        <span className="logo-dot" />
                        TECHNOFEST
                        <span className="admin-badge-label">ADMIN</span>
                    </a>
                    <button
                        className="admin-logout"
                        onClick={() => {
                            setIsAuthenticated(false)
                            setLogin("")
                            setPassword("")
                        }}
                    >
                        Выйти
                    </button>
                </div>
            </header>

            <main className="admin-main">
                {/* Stats */}
                <div className="admin-stats">
                    <div className="admin-stat-card">
                        <span className="admin-stat-value">{totalCount}</span>
                        <span className="admin-stat-label">Всего заявок</span>
                    </div>
                    {Object.entries(EVENT_NAMES).map(([key, name]) => (
                        <div className="admin-stat-card" key={key}>
                            <span className="admin-stat-value">{eventCounts[key] || 0}</span>
                            <span className="admin-stat-label">{name}</span>
                        </div>
                    ))}
                </div>

                {/* Filter + Refresh */}
                <div className="admin-toolbar">
                    <select
                        className="form-select admin-filter"
                        value={filterEvent}
                        onChange={(e) => setFilterEvent(e.target.value)}
                    >
                        <option value="all">Все мероприятия</option>
                        {Object.entries(EVENT_NAMES).map(([key, name]) => (
                            <option key={key} value={key}>
                                {name}
                            </option>
                        ))}
                    </select>
                    <button
                        className="btn-submit admin-refresh"
                        onClick={fetchRegistrations}
                        disabled={loading}
                    >
                        {loading ? "Загрузка..." : "Обновить"}
                    </button>
                </div>

                {/* Table */}
                {loading && registrations.length === 0 ? (
                    <div className="admin-empty">Загрузка данных...</div>
                ) : filtered.length === 0 ? (
                    <div className="admin-empty">Заявок пока нет</div>
                ) : (
                    <div className="admin-table-wrap">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Учреждение</th>
                                    <th>Руководитель</th>
                                    <th>Телефон</th>
                                    <th>Мероприятие</th>
                                    <th>Команда</th>
                                    <th>Дата</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((reg, i) => (
                                    <>
                                        <tr
                                            key={reg.id}
                                            className={`admin-row ${expandedId === reg.id ? "expanded" : ""}`}
                                            onClick={() =>
                                                setExpandedId(expandedId === reg.id ? null : (reg.id ?? null))
                                            }
                                        >
                                            <td>{i + 1}</td>
                                            <td>{reg.institution}</td>
                                            <td>{reg.leader_name}</td>
                                            <td>{reg.leader_phone}</td>
                                            <td>
                                                <span className="admin-event-badge">
                                                    {EVENT_NAMES[reg.event] || reg.event}
                                                </span>
                                            </td>
                                            <td>{reg.team_name || "—"}</td>
                                            <td>
                                                {reg.created_at
                                                    ? new Date(reg.created_at).toLocaleDateString("ru-RU", {
                                                        day: "2-digit",
                                                        month: "2-digit",
                                                        year: "2-digit",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })
                                                    : "—"}
                                            </td>
                                        </tr>
                                        {expandedId === reg.id &&
                                            reg.team_members &&
                                            reg.team_members.length > 0 && (
                                                <tr key={`${reg.id}-members`} className="admin-members-row">
                                                    <td colSpan={7}>
                                                        <div className="admin-members-list">
                                                            <strong>Участники:</strong>
                                                            {reg.team_members.map((m, j) => (
                                                                <span key={m.id || j} className="admin-member-chip">
                                                                    {m.name}, {m.age} лет
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    )
}
