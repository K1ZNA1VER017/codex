<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CHRONICA 1C // Кодекс Разработчика — Трекер Подготовки к Трудоустройству</title>
  
  <!-- Favicon SVG в средневеково-монохромном стиле -->
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='46' fill='%2308090b' stroke='%23e2e8f0' stroke-width='4'/><path d='M50 18 L76 34 L76 66 L50 82 L24 66 L24 34 Z' fill='none' stroke='%23ffffff' stroke-width='3'/><text x='50' y='58' font-family='serif' font-size='24' font-weight='bold' fill='%23ffffff' text-anchor='middle'>1C</text></svg>">

  <!-- Стили приложения -->
  <link rel="stylesheet" href="style.css">
  
  <!-- Three.js для интерактивной 3D модели артефакта -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
</head>
<body>

  <!-- ============================================================
       ВЕРХНЯЯ СТЕКЛЯННАЯ ПАНЕЛЬ НАВИГАЦИИ (HEADER)
       ============================================================ -->
  <header class="site-header">
    <div class="container">
      <div class="header-inner">
        
        <a href="#" class="brand-wrapper">
          <div class="brand-crest">
            <svg viewBox="0 0 24 24">
              <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm0 4l6 3.33v4.67c0 3.7-2.56 7.16-6 8-3.44-.84-6-4.3-6-8V9.33L12 6z"/>
            </svg>
          </div>
          <div class="brand-text">
            <h1>CHRONICA 1C // КОДЕКС</h1>
            <p>ТРЕКЕР ПОДГОТОВКИ К IN-HOUSE &amp; ENTERPRISE</p>
          </div>
        </a>

        <!-- Статус подключения базы данных MySQL -->
        <div class="header-status-badge" id="db-status-badge" title="Статус взаимодействия с MySQL через PHP API">
          <span class="status-dot"></span>
          <span>Инициализация базы данных...</span>
        </div>

        <!-- Кнопки быстрых действий -->
        <div class="header-actions">
          <button class="btn btn-silver-outline" id="btn-open-guide">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span>OpenServer &amp; SQL</span>
          </button>
          
          <button class="btn btn-silver-solid" id="btn-open-add-modal">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Добавить квест</span>
          </button>
        </div>

      </div>
    </div>
  </header>

  <!-- ============================================================
       ГЕРОЙ / HERO СЕКЦИЯ С 3D АРТЕФАКТОМ THREE.JS
       ============================================================ -->
  <main>
    <section class="hero-section">
      <div class="container">
        <div class="hero-grid">
          
          <!-- Левая карточка: Траектория и контекст ситуации -->
          <div class="hero-content-card">
            <div>
              <div class="hero-ornament-top">
                <span class="ornament-symbol">❖</span>
                <span class="ornament-line"></span>
                <span>CHRONICA DEV // 8-MONTH CRUSADE</span>
                <span class="ornament-line"></span>
                <span class="ornament-symbol">❖</span>
              </div>

              <h2 class="hero-title">
                Траектория карьерного взлета: от франчайзи к <span class="highlight">1С:Элемент &amp; Enterprise</span>
              </h2>

              <p class="hero-motto">
                «Per aspera ad astra: от рутины фискальных накопителей — к архитектуре микросервисов и высокой капитализации»
              </p>

              <!-- Мета-информация -->
              <div class="hero-meta-strip">
                <div class="meta-item">
                  <span class="meta-label">Текущий опыт во франче</span>
                  <span class="meta-value">1 год 5 мес.</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">До выпуска из колледжа</span>
                  <span class="meta-value">8 месяцев</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Целевая зарплатная вилка</span>
                  <span class="meta-value">110 000 — 160 000 ₽</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Главный козырь</span>
                  <span class="meta-value">1С:Элемент + REST API</span>
                </div>
              </div>
            </div>

            <!-- Баннер об отмене диплома -->
            <div class="hero-diploma-alert">
              <span class="alert-icon">🛡️</span>
              <div>
                <strong>Дипломная работа отменена в колледже:</strong>
                Освобождено ~250 часов времени. Фокусируемся на чистой коммерческой практике, сдаче «1С:Профессионал» и боевых проектах. Экзамен «Специалист» исключен как избыточный для In-House.
              </div>
            </div>

          </div>

          <!-- Правая карточка: Интерактивный 3D холст Three.js -->
          <div class="hero-3d-card">
            
            <div class="canvas-container" id="three-canvas-wrap">
              <canvas id="three-artifact-canvas"></canvas>

              <div class="canvas-overlay-ui">
                <div class="artifact-legend">
                  <div class="title">Кованая Роза Кодекса</div>
                  <div class="sub">Средневековое Железо &amp; Алые Цветы</div>
                </div>

                <div class="canvas-controls">
                  <button class="ctrl-btn" id="btn-pulse-artifact" title="Импульс кинетической энергии">
                    ⚡ Импульс
                  </button>
                </div>
              </div>
            </div>

            <div class="canvas-footer-stat">
              <span style="color:var(--silver-medium);">ГОТОВНОСТЬ К РЫНКУ:</span>
              <span id="artifact-progress-display" style="font-size:1.1rem;font-weight:700;color:#ffffff;">0%</span>
            </div>

          </div>

        </div>
      </div>
    </section>

    <!-- ============================================================
         ВИДЖЕТЫ СТАТИСТИКИ (ПЛАТИНОВЫЙ МОНОХРОМ)
         ============================================================ -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          
          <!-- 1. Прогресс готовности -->
          <div class="stat-widget">
            <div class="stat-widget-header">
              <span class="stat-widget-title">Общий прогресс кодекса</span>
              <div class="stat-widget-icon">
                <svg viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
            </div>
            <div class="stat-widget-value">
              <span id="stat-progress-val">0%</span>
              <span class="unit">готовности</span>
            </div>
            <div class="progress-bar-wrap">
              <div class="progress-bar-fill" id="stat-progress-fill" style="width: 0%;"></div>
            </div>
          </div>

          <!-- 2. Рыцарский ранг -->
          <div class="stat-widget">
            <div class="stat-widget-header">
              <span class="stat-widget-title">Текущее звание в Кодексе</span>
              <div class="stat-widget-icon">
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
            </div>
            <div class="stat-widget-value" style="font-size: 1.4rem; padding-top: 4px;">
              <span id="stat-rank-title">Оруженосец Франчайзи</span>
            </div>
            <div class="stat-widget-subtitle" id="stat-rank-sub">
              Кассовая рутина и пробуждение к глубокому кодингу
            </div>
          </div>

          <!-- 3. Квесты (Задачи) -->
          <div class="stat-widget">
            <div class="stat-widget-header">
              <span class="stat-widget-title">Закрытые квесты</span>
              <div class="stat-widget-icon">
                <svg viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
              </div>
            </div>
            <div class="stat-widget-value">
              <span id="stat-tasks-done">0</span>
              <span class="unit">/ <span id="stat-tasks-total">16</span> задач</span>
            </div>
            <div class="stat-widget-subtitle">
              В активной разработке: <strong id="stat-tasks-inprog" style="color:#ffffff;">0</strong>
            </div>
          </div>

          <!-- 4. Часы практики -->
          <div class="stat-widget">
            <div class="stat-widget-header">
              <span class="stat-widget-title">Инвестиции времени</span>
              <div class="stat-widget-icon">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
            </div>
            <div class="stat-widget-value">
              <span id="stat-hours-done">0</span>
              <span class="unit">/ <span id="stat-hours-total">325</span> ч</span>
            </div>
            <div class="stat-widget-subtitle">
              Чистая разработка, курсы УЦ №1 и интеграции
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ============================================================
         ПАНЕЛЬ ФИЛЬТРОВ И ПОИСКА
         ============================================================ -->
    <section class="tracker-controls-section">
      <div class="container">
        <div class="controls-card">
          
          <!-- Фильтр по фазам / стадиям -->
          <div class="filter-group">
            <button class="filter-chip active" data-filter-stage="all">Все квесты (4 Фазы)</button>
            <button class="filter-chip" data-filter-stage="STAGE_1">I: Элемент &amp; API</button>
            <button class="filter-chip" data-filter-stage="STAGE_2">II: Профессионал &amp; БСП</button>
            <button class="filter-chip" data-filter-stage="STAGE_3">III: Резюме &amp; Скрининг</button>
            <button class="filter-chip" data-filter-stage="STAGE_4">IV: Офферы &amp; Финиш</button>
          </div>

          <!-- Фильтр по статусу -->
          <div class="filter-group">
            <button class="filter-chip active" data-filter-status="all">Все статусы</button>
            <button class="filter-chip" data-filter-status="in_progress">В процессе</button>
            <button class="filter-chip" data-filter-status="todo">К выполнению</button>
            <button class="filter-chip" data-filter-status="completed">Завершено</button>
          </div>

          <!-- Живой поиск -->
          <div class="search-box">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" id="search-input" placeholder="Поиск по задачам, навыкам, API..." autocomplete="off">
          </div>

        </div>
      </div>
    </section>

    <!-- ============================================================
         ОСНОВНОЙ СПИСОК СТАДИЙ И ДЕТАЛЬНЫХ ЗАДАЧ
         ============================================================ -->
    <section>
      <div class="container">
        <div class="stages-container" id="stages-container">
          <!-- Динамически заполняется JavaScript -->
        </div>
      </div>
    </section>
  </main>

  <!-- ============================================================
       ФУТЕР САЙТА
       ============================================================ -->
  <footer class="site-footer">
    <div class="container">
      <div class="footer-inner">
        <div class="footer-brand">
          CHRONICA 1C // КОДЕКС РАЗРАБОТЧИКА 1С
        </div>
        <div>
          Стек: HTML5 • CSS3 Glassmorphism • Three.js • PHP 8 • MySQL / PhpMyAdmin • OpenServer
        </div>
        <div class="footer-links">
          <a href="#" id="btn-reset-db">Сбросить к эталону</a>
          <a href="#three-canvas-wrap">К вершине</a>
        </div>
      </div>
    </div>
  </footer>

  <!-- ============================================================
       МОДАЛЬНОЕ ОКНО: ЗАМЕТКА К ЗАДАЧЕ
       ============================================================ -->
  <div class="modal-backdrop" id="modal-notes">
    <div class="modal-dialog">
      <div class="modal-header">
        <h3 id="note-modal-title">Личная заметка к задаче</h3>
        <button class="btn-close-modal">
          <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label" for="task-note-text">Текст заметки / мысли / ссылки на материалы / дата:</label>
          <textarea id="task-note-text" class="form-control" rows="5" placeholder="Например: Сдал тест на 13/14, сертификат №25-99812, куратор принял проект по Элементу..."></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-silver-outline btn-close-modal">Отмена</button>
        <button class="btn btn-silver-solid" id="btn-save-note">Сохранить в MySQL</button>
      </div>
    </div>
  </div>

  <!-- ============================================================
       МОДАЛЬНОЕ ОКНО: ДЕТАЛЬНЫЙ ПРОСМОТР КОДЕКСА ЗАДАЧИ
       ============================================================ -->
  <div class="modal-backdrop" id="modal-detail">
    <div class="modal-dialog">
      <div class="modal-header">
        <h3>Кодекс задачи // Детальный формуляр</h3>
        <button class="btn-close-modal">
          <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <div class="modal-body" id="modal-detail-content">
        <!-- Заполняется динамически -->
      </div>
    </div>
  </div>

  <!-- ============================================================
       МОДАЛЬНОЕ ОКНО: ДОБАВЛЕНИЕ НОВОЙ ЗАДАЧИ
       ============================================================ -->
  <div class="modal-backdrop" id="modal-add-task">
    <div class="modal-dialog">
      <div class="modal-header">
        <h3>Добавить новый квест в Кодекс</h3>
        <button class="btn-close-modal">
          <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <form id="form-add-task">
        <div class="modal-body">
          
          <div class="form-group">
            <label class="form-label">Фаза обучения (Квест):</label>
            <select id="add-stage-id" class="form-control">
              <option value="1">I: Мастеринг 1С:Элемент и Архитектура Интеграций (Месяцы 1–2)</option>
              <option value="2">II: Стандарты Enterprise и Сертификация Профессионала (Месяцы 3–4)</option>
              <option value="3">III: Упаковка Гримуара Проектов и Разведка на Рынке (Месяцы 5–6)</option>
              <option value="4">IV: Финал Колледжа, Переговоры и Принятие Оффера (Месяцы 7–8)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Название задачи:</label>
            <input type="text" id="add-task-title" class="form-control" placeholder="Например: Разработать вебхук уведомлений в Telegram" required>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">
            <div class="form-group">
              <label class="form-label">Категория:</label>
              <input type="text" id="add-task-category" class="form-control" placeholder="1С:Элемент / API">
            </div>
            <div class="form-group">
              <label class="form-label">Приоритет:</label>
              <select id="add-task-priority" class="form-control">
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH" selected>HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Часы:</label>
              <input type="number" id="add-task-hours" class="form-control" value="15" min="1" max="200">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Описание задачи:</label>
            <textarea id="add-task-desc" class="form-control" rows="2" placeholder="Что конкретно нужно сделать..."></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Что я должен уметь после выполнения:</label>
            <textarea id="add-task-skills" class="form-control" rows="3" placeholder="• Навык 1&#10;• Навык 2&#10;• Понимание механизма..."></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Артефакт на выходе (Deliverable):</label>
            <input type="text" id="add-task-deliverable" class="form-control" placeholder="Код в Git / Сертификат / Рабочий стенд">
          </div>

        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-silver-outline btn-close-modal">Отмена</button>
          <button type="submit" class="btn btn-silver-solid">Записать в Кодекс</button>
        </div>
      </form>
    </div>
  </div>

  <!-- ============================================================
       МОДАЛЬНОЕ ОКНО: РУКОВОДСТВО ПО УСТАНОВКЕ В OPENSERVER & MYSQL
       ============================================================ -->
  <div class="modal-backdrop" id="modal-openserver-guide">
    <div class="modal-dialog">
      <div class="modal-header">
        <h3>Развертывание на OpenServer &amp; phpMyAdmin</h3>
        <button class="btn-close-modal">
          <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <div class="modal-body" style="font-size:0.88rem;line-height:1.6;">
        <p style="margin-bottom:12px;">
          Этот портал полностью готов к локальному запуску на <strong>OpenServer</strong> без регистрации и смс. Все изменения автоматически сохраняются в MySQL базе данных через PHP API.
        </p>

        <h4 style="font-family:var(--font-serif);color:#ffffff;margin:16px 0 6px;">Шаг 1. Перенос файлов в OpenServer</h4>
        <p>Скопируйте все файлы проекта в папку вашего локального домена, например:</p>
        <div class="code-block">C:\OSPanel\domains\tracker-1c.local\</div>

        <h4 style="font-family:var(--font-serif);color:#ffffff;margin:16px 0 6px;">Шаг 2. Импорт базы данных в phpMyAdmin</h4>
        <ol style="padding-left:20px;margin-bottom:12px;">
          <li>Запустите OpenServer 6 с модулем <strong>MySQL-8.4</strong> и <strong>PHP-8.3/8.4</strong>.</li>
          <li>Откройте меню OpenServer → <strong>Инструменты → phpMyAdmin</strong> (или перейдите по адресу <code>http://127.0.0.1/openserver/phpmyadmin/</code>).</li>
          <li>Логин по умолчанию: <code>root</code>, пароль: <em>(пустой)</em>.</li>
          <li>В верхнем меню нажмите <strong>«Импорт» (Import)</strong>.</li>
          <li>Выберите файл <code>database.sql</code> из папки проекта и нажмите <strong>«Вперед» (Go)</strong>.</li>
        </ol>
        <div class="code-block">Файл базы данных: database.sql (создаст БД hightech и 16 подробных квестов)</div>

        <h4 style="font-family:var(--font-serif);color:#ffffff;margin:16px 0 6px;">Шаг 3. Запуск сайта</h4>
        <p>Откройте в браузере:</p>
        <div class="code-block">http://tracker-1c.local/</div>
        <p style="color:var(--silver-chrome);margin-top:8px;">
          В правом верхнем углу статус сменится на <strong style="color:#ffffff;">«БД: MySQL (OpenServer)»</strong>. При клике на кнопки статусов и сохранении заметок данные будут мгновенно обновляться в вашей базе MySQL.
        </p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-silver-solid btn-close-modal">Понятно</button>
      </div>
    </div>
  </div>

  <!-- Контейнер всплывающих уведомлений -->
  <div class="toast-container" id="toast-container"></div>

  <!-- Скрипты приложения -->
  <script src="three_artifact.js"></script>
  <script src="app.js"></script>

</body>
</html>
