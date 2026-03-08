import { useState } from "react"
import { supabase } from "@/lib/supabase"

const EVENTS = [
    {
        id: "hackathon",
        icon: "⚡",
        name: "Хакатон",
        desc: "Разработка инновационных IT-решений за 48 часов в команде",
    },
    {
        id: "eco",
        icon: "🌿",
        name: "Эко-Баттл",
        desc: "Экологические проекты с применением технологий",
    },
    {
        id: "cyber",
        icon: "🎮",
        name: "Киберспорт (CS2)",
        desc: "Турнир по Counter-Strike 2 среди школьных команд",
    },
    {
        id: "robot",
        icon: "🤖",
        name: "Робототехника",
        desc: "Конструирование и программирование роботов",
    },
    {
        id: "cosplay",
        icon: "🎭",
        name: "Косплей",
        desc: "Конкурс образов из мира технологий и гейминга",
    },
]

interface FormMember {
    id: number
    name: string
    age: string
}

export default function LandingPage() {
    const [institution, setInstitution] = useState("")
    const [leaderName, setLeaderName] = useState("")
    const [leaderPhone, setLeaderPhone] = useState("")
    const [selectedEvent, setSelectedEvent] = useState("")
    const [teamName, setTeamName] = useState("")
    const [members, setMembers] = useState<FormMember[]>([])
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const addMember = () => {
        setMembers((prev) => [
            ...prev,
            { id: Date.now(), name: "", age: "" },
        ])
    }

    const removeMember = (id: number) => {
        setMembers((prev) => prev.filter((m) => m.id !== id))
    }

    const updateMember = (id: number, field: "name" | "age", value: string) => {
        setMembers((prev) =>
            prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            // Insert registration
            const { data: reg, error: regError } = await supabase
                .from("registrations")
                .insert({
                    institution,
                    leader_name: leaderName,
                    leader_phone: leaderPhone,
                    event: selectedEvent,
                    team_name: teamName || null,
                })
                .select("id")
                .single()

            if (regError) throw regError

            // Insert team members if any
            if (members.length > 0 && reg) {
                const membersData = members
                    .filter((m) => m.name.trim())
                    .map((m) => ({
                        registration_id: reg.id,
                        name: m.name,
                        age: parseInt(m.age) || 0,
                    }))

                if (membersData.length > 0) {
                    const { error: memError } = await supabase
                        .from("team_members")
                        .insert(membersData)

                    if (memError) throw memError
                }
            }

            setSubmitted(true)
            // Reset form
            setInstitution("")
            setLeaderName("")
            setLeaderPhone("")
            setSelectedEvent("")
            setTeamName("")
            setMembers([])
        } catch (err) {
            console.error("Submit error:", err)
            alert("Ошибка при отправке. Попробуйте ещё раз.")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <>
            {/* HEADER */}
            <header className="header">
                <div className="header-inner">
                    <a href="#" className="header-logo">
                        <span className="logo-dot" />
                        TECHNOFEST
                    </a>
                    <nav className="header-nav">
                        <a href="#events">Мероприятия</a>
                        <a href="#register">Регистрация</a>
                    </nav>
                </div>
            </header>

            {/* HERO */}
            <section className="hero" id="hero">
                <div className="hero-bg">
                    <div className="hero-glow-1" />
                    <div className="hero-glow-2" />
                </div>
                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="dot" />
                        Регистрация открыта
                    </div>
                    <h1 className="hero-title">
                        <span className="accent">TECHNO</span> FEST
                    </h1>
                    <div className="hero-year">2 0 2 6</div>
                    <p className="hero-description">
                        Крупнейший IT-фестиваль для школьников 9 и 11 классов.
                        Пять направлений — одна цель: раскрыть твой потенциал
                        в мире технологий.
                    </p>
                    <div className="hero-meta">
                        <div className="hero-meta-item">
                            <span className="hero-meta-value">9–11</span>
                            <span className="hero-meta-label">Апрель</span>
                        </div>
                        <div className="hero-meta-item">
                            <span className="hero-meta-value">5</span>
                            <span className="hero-meta-label">Мероприятий</span>
                        </div>
                        <div className="hero-meta-item">
                            <span className="hero-meta-value">9 и 11</span>
                            <span className="hero-meta-label">Классы</span>
                        </div>
                    </div>
                    <div className="hero-cta">
                        <a href="#register" className="btn-primary">
                            Зарегистрироваться
                            <span>→</span>
                        </a>
                    </div>
                </div>
            </section>

            {/* EVENTS */}
            <section className="events-section" id="events">
                <div className="section-header">
                    <span className="section-tag">Программа</span>
                    <h2 className="section-title">Мероприятия фестиваля</h2>
                </div>
                <div className="events-grid">
                    {EVENTS.map((event) => (
                        <div key={event.id} className="event-card" data-event={event.id}>
                            <div className="event-icon-wrap">{event.icon}</div>
                            <h3 className="event-name">{event.name}</h3>
                            <p className="event-desc">{event.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* REGISTRATION */}
            <section className="registration-section" id="register">
                <div className="section-header">
                    <span className="section-tag">Заявка</span>
                    <h2 className="section-title">Регистрация</h2>
                </div>

                {submitted ? (
                    <div className="reg-form" style={{ textAlign: "center", padding: "60px 36px" }}>
                        <div style={{ fontSize: "3rem", marginBottom: "16px" }}>✅</div>
                        <h3 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
                            Заявка отправлена!
                        </h3>
                        <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
                            Мы свяжемся с вами в ближайшее время.
                        </p>
                        <button
                            className="btn-submit"
                            style={{ maxWidth: "300px", margin: "0 auto" }}
                            onClick={() => setSubmitted(false)}
                        >
                            Отправить ещё одну заявку
                        </button>
                    </div>
                ) : (
                    <form className="reg-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Название учреждения</label>
                            <input
                                className="form-input"
                                type="text"
                                placeholder="Например: Общеобразовательная школа №123 (г. Бишкек)"
                                value={institution}
                                onChange={(e) => setInstitution(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">ФИО руководителя</label>
                            <input
                                className="form-input"
                                type="text"
                                placeholder="Асанов Азамат Асанович"
                                value={leaderName}
                                onChange={(e) => setLeaderName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Телефон руководителя</label>
                            <input
                                className="form-input"
                                type="tel"
                                placeholder="+996 700 123 456"
                                value={leaderPhone}
                                onChange={(e) => setLeaderPhone(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Мероприятие</label>
                            <select
                                className="form-select"
                                value={selectedEvent}
                                onChange={(e) => setSelectedEvent(e.target.value)}
                                required
                            >
                                <option value="" disabled>
                                    Выберите мероприятие
                                </option>
                                {EVENTS.map((event) => (
                                    <option key={event.id} value={event.id}>
                                        {event.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-divider" />

                        <div className="form-group">
                            <label className="form-label">
                                Название команды <span className="optional">(опционально)</span>
                            </label>
                            <input
                                className="form-input"
                                type="text"
                                placeholder="Например: Team Alpha"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                            />
                        </div>

                        <div className="form-divider" />

                        <div className="form-group">
                            <div className="members-header">
                                <label className="form-label" style={{ margin: 0 }}>
                                    Участники команды
                                </label>
                                <button
                                    type="button"
                                    className="btn-icon"
                                    onClick={addMember}
                                    title="Добавить участника"
                                >
                                    +
                                </button>
                            </div>

                            {members.length === 0 && (
                                <p className="members-empty">
                                    Нажмите «+» чтобы добавить участников
                                </p>
                            )}

                            {members.map((member, index) => (
                                <div key={member.id} className="member-entry">
                                    <input
                                        className="form-input"
                                        type="text"
                                        placeholder={`ФИО участника ${index + 1}`}
                                        value={member.name}
                                        onChange={(e) =>
                                            updateMember(member.id, "name", e.target.value)
                                        }
                                    />
                                    <input
                                        className="form-input"
                                        type="number"
                                        placeholder="Возраст"
                                        min="14"
                                        max="18"
                                        value={member.age}
                                        onChange={(e) =>
                                            updateMember(member.id, "age", e.target.value)
                                        }
                                    />
                                    <button
                                        type="button"
                                        className="btn-icon remove"
                                        onClick={() => removeMember(member.id)}
                                        title="Удалить участника"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button type="submit" className="btn-submit" disabled={submitting}>
                            {submitting ? "Отправка..." : "Отправить заявку"}
                        </button>
                    </form>
                )}
            </section>

            {/* COMING SOON */}
            <section className="coming-soon-section">
                <div className="coming-soon-text">Скоро...</div>
                <p className="coming-soon-sub">
                    Подробная информация будет добавлена в ближайшее время
                </p>
            </section>

            {/* FOOTER */}
            <footer className="footer">
                <div className="footer-inner">
                    <span className="footer-logo">TECHNOFEST</span>
                    <span className="footer-text">
                        9 – 11 апрель 2026 · IT-фестиваль для школьников
                    </span>
                    <div className="footer-links">
                        <a href="#hero">Главная</a>
                        <a href="#events">Мероприятия</a>
                        <a href="#register">Регистрация</a>
                    </div>
                </div>
            </footer>
        </>
    )
}
