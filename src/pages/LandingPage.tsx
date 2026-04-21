const events = [
    {
        id: "hackathon",
        icon: "⚡",
        name: "Хакатон",
        desc: "Разработка инновационных IT-решений в команде за два насыщенных дня.",
    },
    {
        id: "speakers",
        icon: "🎤",
        name: "Выступления спикеров",
        desc: "Практические советы по идеям, разработке и подготовке сильного питча.",
    },
    {
        id: "pitch",
        icon: "🚀",
        name: "Финальные питчи",
        desc: "Команды представят свои проекты жюри и покажут, чего добились за хакатон.",
    },
]

const programDays = [
    {
        id: "day-1",
        label: "День 1",
        title: "Открытие, вдохновение и старт",
        items: [
            { time: "10:00 - 10:30", title: "Регистрация участников, welcome coffee" },
            {
                time: "10:30 - 11:00",
                title: "Торжественное открытие",
                details: [
                    "приветствие организаторов",
                    "правила и критерии оценки",
                    "презентация треков",
                ],
            },
            {
                time: "11:00 - 11:30",
                title: "🎤 Малабакиев Рамзан",
                subtitle: "Как генерировать идеи?",
            },
            {
                time: "11:30 - 12:00",
                title: "🎤 Асанов Курманбек",
                subtitle: "Как быстро вести разработку?",
            },
            {
                time: "12:00 - 12:30",
                title: "🎤 Сартов Ахмед",
                subtitle: "10 советов по Pitch Deck",
            },
            { time: "12:30 - 12:50", title: "Q&A и ответы на вопросы" },
            { time: "12:50 - 13:50", title: "Обед" },
            {
                time: "13:50 - 20:00",
                title: "💻 Работа над проектами",
                subtitle: "Первый sprint",
            },
        ],
    },
    {
        id: "day-2",
        label: "День 2",
        title: "Финал и закрытие",
        items: [
            { time: "10:00 - 10:30", title: "Последние доработки" },
            {
                time: "10:30 - 13:30",
                title: "🎤 Финальные питчи команд",
                subtitle: "3 часа презентаций",
            },
            { time: "13:30 - 14:00", title: "Совещание жюри" },
            { time: "14:00 - 14:30", title: "🏆 Награждение победителей" },
            { time: "14:30 - 15:00", title: "Закрытие, фото, networking" },
        ],
    },
]

export default function LandingPage() {
    return (
        <>
            <header className="header">
                <div className="header-inner">
                    <a href="#hero" className="header-logo">
                        <span className="logo-dot" />
                        TECHNOFEST
                    </a>
                    <nav className="header-nav">
                        <a href="#events">Формат</a>
                        <a href="#program">Программа</a>
                    </nav>
                </div>
            </header>

            <section className="hero" id="hero">
                <div className="hero-bg">
                    <div className="hero-glow-1" />
                    <div className="hero-glow-2" />
                </div>
                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="dot" />
                        Двухдневная программа TECHNOFEST
                    </div>
                    <h1 className="hero-title">
                        <span className="accent">TECHNO</span> FEST
                    </h1>
                    <div className="hero-year">2 0 2 6</div>
                    <p className="hero-description">
                        Открытие, сильные спикеры, работа над проектами и финальные питчи в
                        одном большом IT-хакатоне.
                    </p>
                    <div className="hero-meta">
                        <div className="hero-meta-item">
                            <span className="hero-meta-value">2</span>
                            <span className="hero-meta-label">Дня</span>
                        </div>
                        <div className="hero-meta-item">
                            <span className="hero-meta-value">3</span>
                            <span className="hero-meta-label">Спикера</span>
                        </div>
                        <div className="hero-meta-item">
                            <span className="hero-meta-value">10:00</span>
                            <span className="hero-meta-label">Старт</span>
                        </div>
                    </div>
                    <div className="hero-cta">
                        <a href="#program" className="btn-primary">
                            Смотреть программу
                            <span>→</span>
                        </a>
                    </div>
                </div>
            </section>

            <section className="events-section" id="events">
                <div className="section-header">
                    <span className="section-tag">Формат</span>
                    <h2 className="section-title">Что ждёт участников</h2>
                </div>
                <div className="events-grid">
                    {events.map((event) => (
                        <div key={event.id} className="event-card" data-event={event.id}>
                            <div className="event-icon-wrap">{event.icon}</div>
                            <h3 className="event-name">{event.name}</h3>
                            <p className="event-desc">{event.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="program-section" id="program">
                <div className="section-header">
                    <span className="section-tag">Таймлайн</span>
                    <h2 className="section-title">Программа хакатона</h2>
                </div>

                <div className="timeline-days">
                    {programDays.map((day) => (
                        <article key={day.id} className="timeline-day">
                            <div className="timeline-day-header">
                                <span className="timeline-day-label">{day.label}</span>
                                <h3 className="timeline-day-title">{day.title}</h3>
                            </div>

                            <div className="timeline-list">
                                {day.items.map((item) => (
                                    <div
                                        key={`${day.id}-${item.time}-${item.title}`}
                                        className="timeline-item"
                                    >
                                        <div className="timeline-time">{item.time}</div>
                                        <div className="timeline-dot" />
                                        <div className="timeline-content">
                                            <h4 className="timeline-title">{item.title}</h4>
                                            {item.subtitle && (
                                                <p className="timeline-subtitle">{item.subtitle}</p>
                                            )}
                                            {item.details && (
                                                <ul className="timeline-details">
                                                    {item.details.map((detail) => (
                                                        <li key={detail}>{detail}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <footer className="footer">
                <div className="footer-inner">
                    <span className="footer-logo">TECHNOFEST</span>
                    <span className="footer-text">IT-хакатон с программой на 2 дня</span>
                    <div className="footer-links">
                        <a href="#hero">Главная</a>
                        <a href="#events">Формат</a>
                        <a href="#program">Программа</a>
                    </div>
                </div>
            </footer>
        </>
    )
}
