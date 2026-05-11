export function HomePage() {
  return (
    <div className="app-page">
      <header className="app-page__header">
        <h1>Добро пожаловать</h1>
        <p>Выбери раздел в боковой панели — так удобнее держать финансы под контролем.</p>
      </header>
      <div className="home-hero">
        <p className="home-hero__lead">
          Secret Utka помогает замечать импульсивные траты и видеть картину целиком: пользователи, счета, кошельки и движения.
        </p>
        <ul className="home-hero__list">
          <li>Быстрый обзор пользователей и их статусов</li>
          <li>Дальше — счета, кошельки и история транзакций</li>
        </ul>
      </div>
    </div>
  );
}
