/**
 * CHRONICA 1C — ОСНОВНОЙ КЛИЕНТСКИЙ СКРИПТ ПОРТАЛА
 * Обеспечивает работу с PHP/MySQL через api.php,
 * с автоматическим плавным переходом на localStorage при автономном просмотре.
 */

(function () {
  'use strict';

  // Состояние приложения
  const state = {
    stages: [],
    tasks: [],
    profile: {},
    stats: {},
    currentStageFilter: 'all',
    currentStatusFilter: 'all',
    searchQuery: '',
    isDbConnected: false,
    activeTaskId: null
  };

  // Эталонные начальные данные (используются как фолбэк, если MySQL недоступен локально)
  const SEED_DATA = {
    profile: {
      user_title: 'Инженер-программист 1С // Траектория карьерного взлета',
      current_role: 'Инженер-программист (Франчайзи 1С, опыт 1 год 5 мес.)',
      target_role: 'Junior+ / Middle Разработчик 1С (In-House / Интегратор)',
      experience_years: 1.5,
      college_months_left: 8,
      target_salary_min: 110000,
      target_salary_max: 160000,
      motto: '«От рутины фискальных накопителей — к архитектуре микросервисов и 1С:Предприятие.Элемент»'
    },
    stages: [
      {
        id: 1,
        stage_num: 1,
        code: 'STAGE_1',
        roman: 'I',
        title: 'Мастеринг 1С:Элемент и Архитектура Интеграций',
        period: 'Месяцы 1–2 (Октябрь – Ноябрь)',
        quest_title: 'Квест I: Арканум Элемента и Врата API',
        description: 'Активация и освоение флагманской технологии «1С:Предприятие.Элемент», создание сквозных REST API сервисов на платформе 8.3 и рефакторинг текущей занятости с рутинных касс на реальный код.',
        icon: 'shield',
        sort_order: 1
      },
      {
        id: 2,
        stage_num: 2,
        code: 'STAGE_2',
        roman: 'II',
        title: 'Стандарты Enterprise и Сертификация Профессионала',
        period: 'Месяцы 3–4 (Декабрь – Январь)',
        quest_title: 'Квест II: Печать Мастера и Кодекс БСП',
        description: 'Отказ от избыточного экзамена «Специалист» в пользу быстрой и эффективной сдачи «1С:Профессионал» за счет франчайзи. Освоение библиотеки стандартных подсистем (БСП) и глубоких возможностей СКД.',
        icon: 'scroll',
        sort_order: 2
      },
      {
        id: 3,
        stage_num: 3,
        code: 'STAGE_3',
        roman: 'III',
        title: 'Упаковка Гримуара Проектов и Разведка на Рынке',
        period: 'Месяцы 5–6 (Февраль – Март)',
        quest_title: 'Квест III: Испытание Рынком и Тайные Собеседования',
        description: 'Трансформация резюме из «саппорт/эникей» в «инженер-программист». Упаковка кейсов по STAR, освоение Git/1C:EDT и прохождение 5-7 боевых собеседований на удаленку для калибровки ценности.',
        icon: 'compass',
        sort_order: 3
      },
      {
        id: 4,
        stage_num: 4,
        code: 'STAGE_4',
        roman: 'IV',
        title: 'Финал Колледжа, Переговоры и Принятие Оффера',
        period: 'Месяцы 7–8 (Апрель – Май)',
        quest_title: 'Квест IV: Посвящение в Рыцари и Триумфальный Оффер',
        description: 'Завершение колледжа без стресса диплома (диплом отменен!), проведение переговоров с текущим руководством и переход на высокую зарплату в штат или крупную проектную команду.',
        icon: 'crown',
        sort_order: 4
      }
    ],
    tasks: [
      {
        id: 1,
        stage_id: 1,
        task_code: 'TASK-1.1',
        title: 'Активация и прохождение профильного блока «1С:Предприятие.Элемент»',
        category: '1С:Элемент',
        priority: 'CRITICAL',
        status: 'in_progress',
        estimated_hours: 35,
        description: 'Активировать уже оплаченную заявку 25UC1001255 в УЦ 1С. Последовательно пройти уроки, выполнить все домашние практические задания. Разработать итоговое веб-приложение на технологии «Элемент» своими руками.',
        skills_after: '• Понимание парадигмы 1С:Элемент: модульная архитектура, декларативный интерфейс, компонентная модель\n• Разработка адаптивных веб-клиентов и личных кабинетов\n• Работа со встроенным строго типизированным языком нового поколения 1С\n• Настройка моделей данных и асинхронных серверных вызовов',
        deliverables: 'Рабочее веб-приложение на 1С:Элемент + официальный сертификат Учебного Центра №1 об окончании курса',
        checklist_items: [
          'Активировать доступ к курсу в личном кабинете УЦ 1С',
          'Пройти лекции и практические уроки блока 1-3',
          'Реализовать демонстрационный проект (веб-интерфейс)',
          'Сдать итоговую практическую работу куратору',
          'Получить и сохранить сертификат об окончании'
        ],
        notes: 'Заявка оплачена 17.04.2026. Сделать упор на декларативные формы и связь с базой данных.'
      },
      {
        id: 2,
        stage_id: 1,
        task_code: 'TASK-1.2',
        title: 'Проектирование и создание собственных HTTP-сервисов (REST API) на 1С 8.3',
        category: 'REST API / Интеграции',
        priority: 'CRITICAL',
        status: 'todo',
        estimated_hours: 25,
        description: 'Спроектировать полноценный HTTP-сервис в классической конфигурации 1С. Реализовать методы GET, POST, PATCH для обмена документами и справочниками. Настроить валидацию JSON, аутентификацию и безопасную обработку ошибок.',
        skills_after: '• Создание объектов метаданных «HTTP-сервисы» и «Шаблоны URL»\n• Сериализация и парсинг JSON с помощью объектов ЗаписьJSON, ЧтениеJSON\n• Корректное формирование HTTP-заголовков, кодов ответа (200, 201, 400, 401, 500)\n• Логирование запросов в Журнал Регистрации и защита от аварийных падений',
        deliverables: 'Рабочий модуль HTTP-сервиса в расширении 1С + коллекция запросов в Postman / Insomnia с автотестами',
        checklist_items: [
          'Создать расширение конфигурации с объектом HTTP-сервис',
          'Реализовать метод GET: получение списка остатков номенклатуры',
          'Реализовать метод POST: создание документа заказа с валидацией полей',
          'Настроить Basic / Bearer токен авторизацию',
          'Протестировать все краевые случаи через Postman'
        ],
        notes: 'В резюме уже есть API к 1С-Коннект. Нужно углубить именно входящие HTTP-сервисы.'
      },
      {
        id: 3,
        stage_id: 1,
        task_code: 'TASK-1.3',
        title: 'Сквозной гибридный мост: «1С:Предприятие 8.3 ⇄ 1С:Элемент»',
        category: 'Архитектура',
        priority: 'HIGH',
        status: 'todo',
        estimated_hours: 30,
        description: 'Объединить два мира: классическую учетную систему (например, УТ 11 или УНФ) и современный легкий веб-интерфейс на 1С:Элемент. Передавать справочники, принимать заказы покупателей и синхронизировать статусы.',
        skills_after: '• Проектирование архитектуры слабосвязанных систем (Decoupled Architecture)\n• Организация очередей обмена и повторной отправки при сбоях сети\n• Настройка вебхуков для мгновенного информирования клиентов\n• Оптимизация нагрузки на классический сервер 1С',
        deliverables: 'Живой демо-стенд: клиент делает заказ в браузере через 1С:Элемент -> заказ мгновенно появляется в базе 1С 8.3',
        checklist_items: [
          'Развернуть тестовую базу 1С 8.3 и инстанс 1С:Элемент',
          'Настроить отправку вебхука из 1С:Элемент в HTTP-сервис 1С 8.3',
          'Проверить корректность транзакций и создания объектов',
          'Описать архитектуру схемы на одном слайде для портфолио'
        ],
        notes: 'Это главный козырь для резюме: 95% кандидатов не умеют связывать 1С:Элемент с классической 1С.'
      },
      {
        id: 4,
        stage_id: 1,
        task_code: 'TASK-1.4',
        title: 'Делегирование выездной рутины (кассы, ФН, разъезды) и фокус на кодинг',
        category: 'Карьера / Тайм-менеджмент',
        priority: 'HIGH',
        status: 'in_progress',
        estimated_hours: 15,
        description: 'Мягко перестроить отношения с руководством и диспетчерами во франчайзи. Постепенно передавать заявки по выездам к кассам и замене фискальных накопителей младшим стажерам, забирая сложные доработки конфигураций.',
        skills_after: '• Проведение переговоров о распределении обязанностей без конфликтов\n• Освоение написания доработок строго через Механизм Расширений\n• Ускорение выполнения задач по коду в 2 раза за счет типизации решений',
        deliverables: 'Фиксация доли времени на чистую разработку не менее 65-70% от всего рабочего дня',
        checklist_items: [
          'Провести аудит своего рабочего времени за последние 2 недели',
          'Поговорить с тимлидом: предложить обучить нового стажера кассам ФНС',
          'Запросить в работу нетиповые доработки и интеграционные задачи',
          'Все новые доработки делать только расширениями без снятия с поддержки'
        ],
        notes: 'Освободить руки от физических выездов для подготовки к выходу на рынок.'
      },
      {
        id: 5,
        stage_id: 2,
        task_code: 'TASK-2.1',
        title: 'Сдача экзамена «1С:Профессионал: Платформа 8.3»',
        category: 'Сертификация',
        priority: 'CRITICAL',
        status: 'todo',
        estimated_hours: 25,
        description: 'Подготовиться по мобильному тренажеру 1С или базе тестов УЦ №1 (14 разделов, 14 вопросов). Закрыть тест на компьютере в офисе франчайзи (требуется 12 правильных из 14).',
        skills_after: '• Глубокое понимание механизмов платформы: транзакции, регистры, управляемые формы\n• Знание тонкостей объектной и табличной модели 1С\n• Снятие первичного фильтра эйчаров крупных компаний (сертификат проверяется по реестру 1С)',
        deliverables: 'Официальный номерной пластиковый сертификат «1С:Профессионал по платформе 1С:Предприятие 8.3»',
        checklist_items: [
          'Установить мобильный тренажер 1С:Профессионал Платформа',
          'Прорешать каждый из 14 разделов на 95%+',
          'Сдать 5 пробных тестов подряд без единой ошибки',
          'Подать заявку на сдачу за счет работодателя во франчайзи',
          'Успешно сдать экзамен и получить сертификат'
        ],
        notes: 'Не зубрить теорию целиком: тренажер решает задачу за 10-14 вечеров.'
      },
      {
        id: 6,
        stage_id: 2,
        task_code: 'TASK-2.2',
        title: 'Сдача «1С:Профессионал: Управление торговлей 11» (или ERP)',
        category: 'Сертификация',
        priority: 'MEDIUM',
        status: 'todo',
        estimated_hours: 20,
        description: 'Изучить ключевые прикладные регистры и структуру документов торгового контура. Сдать второй сертификат для закрепления статуса специалиста по оптовой и розничной торговле.',
        skills_after: '• Владение бизнес-логикой торгового предприятия: резервирование, заказы, отгрузка, взаиморасчеты\n• Понимание архитектуры регистров накопления: ТоварыНаСкладах, РасчетыСКлиентами\n• Уверенная аргументация перед бизнесом на собеседованиях',
        deliverables: 'Сертификат «1С:Профессионал: Управление торговлей 11» в реестре 1С',
        checklist_items: [
          'Пройти вопросы раздела «Складской учет и логистика»',
          'Пройти вопросы раздела «Оптовые и розничные продажи»',
          'Сдать сертификационный тест в Учебном центре',
          'Добавить номер сертификата в профиль на портале 1С'
        ],
        notes: 'Торговый контур — самый востребованный в In-House (ритейл, маркетплейсы, опт).'
      },
      {
        id: 7,
        stage_id: 2,
        task_code: 'TASK-2.3',
        title: 'Стандарты БСП (Библиотека Стандартных Подсистем)',
        category: 'Enterprise Код',
        priority: 'CRITICAL',
        status: 'todo',
        estimated_hours: 30,
        description: 'Изучить и применить на практике ключевые подсистемы БСП: «Дополнительные отчеты и обработки», «Версионирование объектов», «Длительные операции», «Присоединенные файлы».',
        skills_after: '• Разработка внешних отчетов и обработок, строго совместимых со стандартами БСП\n• Вынос тяжелых расчетов в фоновые длительные операции с индикатором прогресса\n• Использование готовых механизмов БСП вместо изобретения собственных «велосипедов»',
        deliverables: 'Шаблон эталонной внешней обработки на БСП + пример фонового процесса выполнения тяжелого отчета',
        checklist_items: [
          'Изучить документацию на ИТС по архитектуре БСП',
          'Реализовать внешнюю обработку с безопасным подключением к БСП',
          'Реализовать фоновое выполнение длительной задачи без блокировки UI',
          'Изучить функции подсистемы ОбщегоНазначенияКлиентСервер'
        ],
        notes: 'На технических собеседованиях знание БСП сразу отличает джуна от мидла.'
      },
      {
        id: 8,
        stage_id: 2,
        task_code: 'TASK-2.4',
        title: 'Продвинутая СКД (Система Компоновки Данных)',
        category: 'Аналитика / Отчеты',
        priority: 'HIGH',
        status: 'todo',
        estimated_hours: 25,
        description: 'Освоить сложные механизмы компоновщика: вычисляемые поля, пользовательские поля, составные схемы данных, макеты оформления, программное управление СКД через модуль объекта.',
        skills_after: '• Разработка аналитических панелей и сложных кросс-таблиц без ручной верстки ячеек\n• Программная модификация настроек СКД в коде перед компоновкой\n• Оптимизация тяжелых запросов в СКД (индексы, временные таблицы, срез последних)',
        deliverables: 'Сложный аналитический отчет с динамическими группировками и графиками в портфолио',
        checklist_items: [
          'Собрать отчет со сложной иерархией группировок (Номенклатура / Контрагент / Менеджер)',
          'Настроить пользовательские вычисляемые поля и функции языка СКД',
          'Создать собственный макет оформления ячеек и итогов',
          'Написать код программного вывода отчета в ТабличныйДокумент'
        ],
        notes: 'Бизнес платит за отчеты, которые быстро считаются и красиво выглядят.'
      },
      {
        id: 9,
        stage_id: 3,
        task_code: 'TASK-3.1',
        title: 'Гримуар Проектов: упаковка 4-х кейсов по методологии STAR',
        category: 'Портфолио',
        priority: 'CRITICAL',
        status: 'todo',
        estimated_hours: 20,
        description: 'Описать свой реальный опыт за 1.5 года в виде оцифрованных кейсов (Situation, Task, Action, Result). Превратить техническую рутину в бизнес-победы.',
        skills_after: '• Навык презентации своей работы на языке выгод для бизнеса (деньги, время, риски)\n• Подготовка оцифрованных результатов: сокращение времени обновлений, исключение штрафов ФНС\n• Готовые истории для ответа на поведенческих интервью',
        deliverables: 'Документ «Портфолио проектов 1С-разработчика» (PDF/Markdown) с 4 детальными кейсами',
        checklist_items: [
          'Кейс 1: Бесшовный перенос и обновление нетиповой конфигурации с доработками',
          'Кейс 2: Внедрение контура Честный ЗНАК и разрешительного режима ТС ПИоТ',
          'Кейс 3: Серверные скрипты и интеграция 1С-Коннект через API',
          'Кейс 4: Разработка модуля на 1С:Элемент и HTTP-сервисов'
        ],
        notes: 'Кейс по «Честному Знаку» и «ТС ПИоТ» сейчас на вес золота из-за ужесточения штрафов!'
      },
      {
        id: 10,
        stage_id: 3,
        task_code: 'TASK-3.2',
        title: 'Переупаковка резюме на HeadHunter и Хабр Карьера',
        category: 'Карьера',
        priority: 'CRITICAL',
        status: 'todo',
        estimated_hours: 15,
        description: 'Стереть формулировки «консультирую по телефону», «ремонтирую кассы». Заменить их на язык инженера enterprise-решений. Сформировать продающий заголовок и стек технологий.',
        skills_after: '• Прохождение алгоритмов скрининга резюме (ATS) и эйчаров ведущих компаний\n• Правильное позиционирование: «Инженер-разработчик 1С» с опытом 2 года\n• Прикрепление подтвержденных сертификатов и витрины кейсов',
        deliverables: 'Опубликованные и отполированные профили на HeadHunter и Хабр Карьера с открытым статусом поиска',
        checklist_items: [
          'Переписать блок «О себе» с упором на стек: 1С:Элемент, HTTP, БСП, СКД, SQL',
          'Переписать опыт работы по таблице трансформации формулировок',
          'Указать желаемую зарплатную вилку: от 120 000 руб. (удаленка/гибрид)',
          'Пройти ревью резюме у старшего коллеги или ментора'
        ],
        notes: 'Не публиковать резюме в открытый доступ до согласования даты тестовых интервью.'
      },
      {
        id: 11,
        stage_id: 3,
        task_code: 'TASK-3.3',
        title: 'Боевой скрининг: 5–7 тестовых собеседований на удаленку',
        category: 'Интервью',
        priority: 'HIGH',
        status: 'todo',
        estimated_hours: 30,
        description: 'Начать откликаться на вакансии в Москве, Санкт-Петербурге и федеральных ритейлерах (удаленно). Пройти 5 технических скринингов без цели принять первый попавшийся оффер.',
        skills_after: '• Полное устранение страха собеседований и технических вопросов у «доски»\n• Сбор реального пула вопросов с рынка: блокировки, индексы, транзакции, API\n• Определение точной суммы, которую рынок готов платить за твои навыки прямо сейчас',
        deliverables: 'Дневник собеседований с разбором допущенных ошибок и списком предложенных зарплат',
        checklist_items: [
          'Откликнуться на 20 вакансий с удаленным форматом работы',
          'Пройти 2 первичных звонка с рекрутерами',
          'Пройти минимум 3 технических интервью с тимлидами',
          'Записать все каверзные вопросы и детально разобрать ответы дома'
        ],
        notes: 'Отказы воспринимать как бесплатный аудит знаний. Записывать каждое интервью на диктофон.'
      },
      {
        id: 12,
        stage_id: 3,
        task_code: 'TASK-3.4',
        title: 'Git, выгрузка конфигураций в файлы и 1C:EDT',
        category: 'Инструменты',
        priority: 'MEDIUM',
        status: 'todo',
        estimated_hours: 15,
        description: 'Освоить командную разработку: выгрузку метаданных 1С в XML/файл, коммиты в Git, разрешение конфликтов слияния, базовое знакомство с 1C:Enterprise Development Tools (EDT).',
        skills_after: '• Работа с системами контроля версий (Git / GitLab / GitHub)\n• Умение работать в командных распределенных проектах\n• Владение средой разработки 1C:EDT на базе Eclipse',
        deliverables: 'Репозиторий на GitHub с исходниками учебного расширения и настроенным .gitignore под 1С',
        checklist_items: [
          'Установить Git и настроить глобальные конфиги пользователя',
          'Выгрузить конфигурацию в файлы через конфигуратор и через EDT',
          'Сделать 5 коммитов, создать ветку feature/rest-api и сделать merge',
          'Оформить красивый README.md в своем профиле GitHub'
        ],
        notes: 'Крупные интеграторы и In-House банки всегда спрашивают про Git.'
      },
      {
        id: 13,
        stage_id: 4,
        task_code: 'TASK-4.1',
        title: 'Закрытие сессии и госэкзаменов в колледже',
        category: 'Образование',
        priority: 'CRITICAL',
        status: 'todo',
        estimated_hours: 20,
        description: 'Сдать итоговые государственные экзамены в колледже. Так как диплом отменен, направить высвобожденную энергию на спокойное получение документа об образовании.',
        skills_after: '• Наличие официального диплома государственного образца о среднем проф. образовании\n• Отсутствие академических задолженностей и полная юридическая чистота',
        deliverables: 'Диплом государственного образца на руках, подтверждающий квалификацию',
        checklist_items: [
          'Уточнить в учебной части даты госэкзаменов и график сессии',
          'Подготовить ответы на билеты госэкзамена',
          'Сдать экзамены на положительные оценки',
          'Получить диплом и вкладыш с оценками'
        ],
        notes: 'Диплом официально закроет графу «Образование» в скоринге крупных работодателей.'
      },
      {
        id: 14,
        stage_id: 4,
        task_code: 'TASK-4.2',
        title: 'Переговорный раунд во франчайзи (Разговор с директором)',
        category: 'Переговоры',
        priority: 'HIGH',
        status: 'todo',
        estimated_hours: 10,
        description: 'Назначить встречу с руководством компании «Высокие технологии». Озвучить факт окончания колледжа, получение диплома, 2 года стажа и новые компетенции (Элемент, API).',
        skills_after: '• Навык ведения жестких переговоров о зарплате на основе фактов и рыночных предложений\n• Умение отстаивать свои границы и переход в статус полноценного разработчика',
        deliverables: 'Либо подписанное допсоглашение на высокую фикс-ставку без выездов, либо четкая дата увольнения',
        checklist_items: [
          'Подготовить список своих достижений за 1.5+ года работы во франче',
          'Озвучить рыночную вилку и офферы, полученные на этапе собеседований',
          'Предложить компании оставить вас исключительно на сложных проектных задачах',
          'При отказе — мирно написать заявление по собственному желанию за 2 недели'
        ],
        notes: 'Никаких обид и сжигания мостов: франчайзи был отличной школой, но ты перерос эту роль.'
      },
      {
        id: 15,
        stage_id: 4,
        task_code: 'TASK-4.3',
        title: 'Сравнительный скоринг офферов: In-House vs Крупный Интегратор',
        category: 'Карьера',
        priority: 'CRITICAL',
        status: 'todo',
        estimated_hours: 15,
        description: 'Собрать на столе 2-4 предложения о работе. Оценить их по взвешенной матрице: чистый оклад, стек технологий (1С:Элемент, масштабы), культура команды, ДМС, удаленка.',
        skills_after: '• Комплексная оценка оффера (Total Compensation) с учетом бонусов и нагрузки\n• Выбор стратегически верного вектора развития на ближайшие 2-3 года',
        deliverables: 'Выбранный и акцептованный официальный оффер (Job Offer) с датой первого рабочего дня',
        checklist_items: [
          'Составить сравнительную таблицу по критериям (ЗП, задачи, удаленка, стек)',
          'Проверить отзывы о работодателях на Habr и DreamJob',
          'Задать контрольные вопросы нанимающему менеджеру до подписания',
          'Принять лучший оффер и подтвердить дату старта'
        ],
        notes: 'Приоритет: In-House с белой зарплатой или интегратор с проектами на 1С:Элемент.'
      },
      {
        id: 16,
        stage_id: 4,
        task_code: 'TASK-4.4',
        title: 'Экологичное завершение дел и триумфальный старт',
        category: 'Финиш',
        priority: 'HIGH',
        status: 'todo',
        estimated_hours: 10,
        description: 'Сдать дела во франчайзи, передать пароли и инструкции преемникам. Оформить трудоустройство на новом месте в статусе Middle/Junior+ Разработчика 1С.',
        skills_after: '• Высокая деловая репутация в профессиональном 1С-сообществе\n• Уверенный старт испытательного срока на новой высокооплачиваемой работе',
        deliverables: 'Успешный первый месяц работы на новой позиции с высоким окладом',
        checklist_items: [
          'Составить документ передачи дел по текущим клиентам франчайзи',
          'Сдать корпоративное оборудование и сим-карты',
          'Получить расчет и трудовую книжку с почти 2 годами стажа',
          'Выйти на новое место работы и настроить рабочий контур'
        ],
        notes: 'Цель достигнута: из эникея франчайзи в востребованного инженера-разработчика 1С!'
      }
    ]
  };

  // ============================================================
  // ИНИЦИАЛИЗАЦИЯ И ЗАГРУЗКА ДАННЫХ
  // ============================================================

  async function initApp() {
    setupDomListeners();
    await loadData();
  }

  async function loadData() {
    try {
      // Пробуем запросить данные с PHP API
      const response = await fetch('api.php?action=get_data', {
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        const json = await response.json();
        if (json.status === 'success' && json.stages && json.tasks) {
          state.stages = json.stages;
          state.tasks = json.tasks;
          state.profile = json.profile || SEED_DATA.profile;
          state.stats = json.stats;
          state.isDbConnected = true;
          updateDbStatusBadge(true);
          renderAll();
          return;
        }
      }
      throw new Error('API недоступен или вернул ошибку');
    } catch (err) {
      console.warn('Работаем в локальном/демо режиме (localStorage):', err.message);
      state.isDbConnected = false;
      updateDbStatusBadge(false);
      loadFromLocalStorage();
      renderAll();
    }
  }

  function loadFromLocalStorage() {
    const localTasks = localStorage.getItem('chronica_1c_tasks');
    if (localTasks) {
      try {
        state.tasks = JSON.parse(localTasks);
      } catch (e) {
        state.tasks = SEED_DATA.tasks;
      }
    } else {
      state.tasks = SEED_DATA.tasks;
      saveToLocalStorage();
    }
    state.stages = SEED_DATA.stages;
    state.profile = SEED_DATA.profile;
    recalculateLocalStats();
  }

  function saveToLocalStorage() {
    localStorage.setItem('chronica_1c_tasks', JSON.stringify(state.tasks));
  }

  function recalculateLocalStats() {
    const totalTasks = state.tasks.length;
    let completed = 0;
    let inProgress = 0;
    let todo = 0;
    let totalHours = 0;
    let completedHours = 0;

    state.tasks.forEach(t => {
      totalHours += Number(t.estimated_hours || 0);
      if (t.status === 'completed') {
        completed++;
        completedHours += Number(t.estimated_hours || 0);
      } else if (t.status === 'in_progress') {
        inProgress++;
      } else {
        todo++;
      }
    });

    const percent = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;

    let rankTitle = 'Оруженосец Франчайзи';
    let rankSubtitle = 'Базовые регламенты, кассовая рутина и пробуждение к кодингу';
    let rankBadge = 'I';

    if (percent >= 25 && percent < 50) {
      rankTitle = 'Адепт Элемента и API';
      rankSubtitle = 'Полномочия веб-интеграций и владение 1С:Предприятие.Элемент';
      rankBadge = 'II';
    } else if (percent >= 50 && percent < 75) {
      rankTitle = 'Рыцарь Платформы и БСП';
      rankSubtitle = 'Официальный сертификат Профессионала и стандарты Enterprise';
      rankBadge = 'III';
    } else if (percent >= 75 && percent < 95) {
      rankTitle = 'Магистр Корпоративных Архитектур';
      rankSubtitle = 'Крепкое боевое портфолио, диплом закрыт, открыты двери лучших офферов';
      rankBadge = 'IV';
    } else if (percent >= 95) {
      rankTitle = 'Грандмастер 1С / Middle-Инженер';
      rankSubtitle = 'Триумфальный вход в штат с высоким окладом и новыми масштабами';
      rankBadge = 'V';
    }

    state.stats = {
      total_tasks: totalTasks,
      completed_tasks: completed,
      in_progress_tasks: inProgress,
      todo_tasks: todo,
      percentage: percent,
      total_hours: totalHours,
      completed_hours: completedHours,
      rank: {
        title: rankTitle,
        subtitle: rankSubtitle,
        badge: rankBadge
      }
    };
  }

  // ============================================================
  // ОБНОВЛЕНИЕ СТАТУСА И ЗАМЕТОК
  // ============================================================

  async function updateTaskStatus(taskId, nextStatus) {
    // Оптимистичное обновление в UI
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    task.status = nextStatus;
    if (nextStatus === 'completed') {
      task.completed_at = new Date().toISOString();
      triggerConfetti();
      showToast(`Квест «${task.title.substring(0, 36)}...» завершен!`);
    }

    recalculateLocalStats();
    renderStats();
    renderTasks();

    if (window.updateArtifactProgress) {
      window.updateArtifactProgress(state.stats.percentage);
    }

    if (state.isDbConnected) {
      try {
        const resp = await fetch('api.php?action=update_status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task_id: taskId, status: nextStatus })
        });
        const res = await resp.json();
        if (res.status !== 'success') {
          console.warn('Сервер не подтвердил смену статуса:', res);
        }
      } catch (e) {
        console.error('Ошибка записи статуса в MySQL:', e);
      }
    } else {
      saveToLocalStorage();
    }
  }

  async function saveTaskNotes(taskId, notesText) {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    task.notes = notesText;

    if (state.isDbConnected) {
      try {
        await fetch('api.php?action=update_notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task_id: taskId, notes: notesText })
        });
        showToast('Заметка успешно сохранена в базе данных!');
      } catch (e) {
        showToast('Ошибка сохранения в MySQL, сохранено локально.');
      }
    } else {
      saveToLocalStorage();
      showToast('Заметка сохранена локально.');
    }
    renderTasks();
  }

  // ============================================================
  // РЕНДЕРИНГ ИНТЕРФЕЙСА
  // ============================================================

  function renderAll() {
    renderStats();
    renderStages();
    renderTasks();

    if (window.updateArtifactProgress && state.stats) {
      window.updateArtifactProgress(state.stats.percentage || 0);
    }
  }

  function updateDbStatusBadge(isConnected) {
    const badge = document.getElementById('db-status-badge');
    if (!badge) return;
    if (isConnected) {
      badge.innerHTML = `<span class="status-dot"></span><span>БД: MySQL (OpenServer)</span>`;
      badge.style.borderColor = 'rgba(255, 255, 255, 0.4)';
    } else {
      badge.innerHTML = `<span class="status-dot" style="background:#94a3b8;box-shadow:none;"></span><span>Режим: Локальный (Браузер)</span>`;
      badge.style.borderColor = 'rgba(148, 163, 184, 0.2)';
    }
  }

  function renderStats() {
    const st = state.stats;
    if (!st) return;

    // 1. Прогресс-бар и процент
    const pFill = document.getElementById('stat-progress-fill');
    const pText = document.getElementById('stat-progress-val');
    if (pFill) pFill.style.width = `${st.percentage}%`;
    if (pText) pText.textContent = `${st.percentage}%`;

    // 2. Ранг
    const rTitle = document.getElementById('stat-rank-title');
    const rSub = document.getElementById('stat-rank-sub');
    if (rTitle && st.rank) rTitle.textContent = st.rank.title;
    if (rSub && st.rank) rSub.textContent = st.rank.subtitle;

    // 3. Задачи
    const tasksDone = document.getElementById('stat-tasks-done');
    const tasksTotal = document.getElementById('stat-tasks-total');
    if (tasksDone) tasksDone.textContent = st.completed_tasks;
    if (tasksTotal) tasksTotal.textContent = st.total_tasks;

    // 4. Часы
    const hoursDone = document.getElementById('stat-hours-done');
    const hoursTotal = document.getElementById('stat-hours-total');
    if (hoursDone) hoursDone.textContent = st.completed_hours;
    if (hoursTotal) hoursTotal.textContent = st.total_hours;

    // 5. В процессе
    const inProgEl = document.getElementById('stat-tasks-inprog');
    if (inProgEl) inProgEl.textContent = st.in_progress_tasks;
  }

  function renderStages() {
    const container = document.getElementById('stages-container');
    if (!container) return;

    container.innerHTML = '';

    // Фильтрация стадий
    let stagesToShow = state.stages;
    if (state.currentStageFilter !== 'all') {
      stagesToShow = state.stages.filter(s => s.code === state.currentStageFilter);
    }

    stagesToShow.forEach(stage => {
      const stageTasks = state.tasks.filter(t => t.stage_id === stage.id);
      const completedCount = stageTasks.filter(t => t.status === 'completed').length;
      const stagePercent = stageTasks.length > 0 ? Math.round((completedCount / stageTasks.length) * 100) : 0;

      const stageBlock = document.createElement('div');
      stageBlock.className = 'stage-block';
      stageBlock.id = `stage-block-${stage.id}`;

      stageBlock.innerHTML = `
        <div class="stage-header" data-stage-id="${stage.id}">
          <div class="stage-title-wrap">
            <div class="stage-roman-badge">${stage.roman}</div>
            <div class="stage-heading-text">
              <h2>${escapeHtml(stage.title)}</h2>
              <div class="stage-meta">
                <span class="stage-period">${escapeHtml(stage.period)}</span>
                <span>•</span>
                <span>${escapeHtml(stage.quest_title)}</span>
              </div>
            </div>
          </div>
          <div class="stage-stats-preview">
            <span class="stage-tasks-counter">${completedCount} из ${stageTasks.length} квестов (${stagePercent}%)</span>
            <div class="stage-toggle-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        </div>
        <div class="stage-description">
          ${escapeHtml(stage.description)}
        </div>
        <div class="stage-body">
          <div class="tasks-grid" id="tasks-container-stage-${stage.id}">
            <!-- Задачи рендерятся здесь -->
          </div>
        </div>
      `;

      // Сворачивание / разворачивание по клику на заголовок
      stageBlock.querySelector('.stage-header').addEventListener('click', (e) => {
        stageBlock.classList.toggle('collapsed');
      });

      container.appendChild(stageBlock);
    });
  }

  function renderTasks() {
    state.stages.forEach(stage => {
      const stageGrid = document.getElementById(`tasks-container-stage-${stage.id}`);
      if (!stageGrid) return;

      stageGrid.innerHTML = '';

      let tasks = state.tasks.filter(t => t.stage_id === stage.id);

      // Фильтр по статусу
      if (state.currentStatusFilter !== 'all') {
        tasks = tasks.filter(t => t.status === state.currentStatusFilter);
      }

      // Фильтр по поисковому запросу
      if (state.searchQuery.trim() !== '') {
        const query = state.searchQuery.toLowerCase();
        tasks = tasks.filter(t =>
          (t.title && t.title.toLowerCase().includes(query)) ||
          (t.category && t.category.toLowerCase().includes(query)) ||
          (t.skills_after && t.skills_after.toLowerCase().includes(query)) ||
          (t.description && t.description.toLowerCase().includes(query))
        );
      }

      if (tasks.length === 0) {
        stageGrid.innerHTML = `
          <div style="padding:24px;text-align:center;color:var(--silver-medium);font-family:var(--font-mono);font-size:0.85rem;background:rgba(255,255,255,0.02);border:1px dashed var(--silver-border);border-radius:8px;">
            Нет задач, удовлетворяющих заданным фильтрам в этой фазе.
          </div>
        `;
        return;
      }

      tasks.forEach(task => {
        const card = createTaskCardElement(task);
        stageGrid.appendChild(card);
      });
    });
  }

  function createTaskCardElement(task) {
    const card = document.createElement('div');
    card.className = `task-card status-${task.status}`;
    card.id = `task-card-${task.id}`;

    // Статус кнопка
    let statusLabel = 'К выполнению';
    let statusClass = 'todo';
    if (task.status === 'in_progress') {
      statusLabel = 'В процессе';
      statusClass = 'in_progress';
    } else if (task.status === 'completed') {
      statusLabel = '✓ Завершено';
      statusClass = 'completed';
    }

    // Чек-лист шагов
    let checklistHtml = '';
    const checklistItems = task.checklist_items || [];
    if (checklistItems.length > 0) {
      const itemsHtml = checklistItems.map((item, idx) => `
        <div class="checklist-item">
          <span class="check-bullet">◈</span>
          <span>${escapeHtml(item)}</span>
        </div>
      `).join('');
      checklistHtml = `
        <div class="checklist-wrapper">
          <div class="checklist-title">Контрольные вехи:</div>
          <div class="checklist-items">${itemsHtml}</div>
        </div>
      `;
    }

    // Личная заметка если есть
    let notesPreviewHtml = '';
    if (task.notes && task.notes.trim() !== '') {
      notesPreviewHtml = `
        <div style="margin-bottom:14px;padding:8px 12px;background:rgba(255,255,255,0.03);border:1px dashed var(--silver-border);border-radius:4px;font-size:0.8rem;color:#cbd5e1;font-family:var(--font-mono);">
          <span style="color:#ffffff;font-weight:600;">Заметка:</span> ${escapeHtml(task.notes)}
        </div>
      `;
    }

    card.innerHTML = `
      <div class="task-header">
        <div class="task-title-group">
          <div class="task-badges">
            <span class="badge-code">${escapeHtml(task.task_code)}</span>
            <span class="badge-category">${escapeHtml(task.category)}</span>
            <span class="badge-priority priority-${task.priority}">${task.priority}</span>
          </div>
          <h3 class="task-title">${escapeHtml(task.title)}</h3>
        </div>
        <button class="status-pill-btn ${statusClass}" data-task-id="${task.id}" title="Нажмите, чтобы переключить статус">
          ${statusLabel}
        </button>
      </div>

      <p class="task-description">${escapeHtml(task.description)}</p>

      <!-- Блок «Что я должен уметь после выполнения» -->
      <div class="skills-box">
        <div class="skills-box-title">
          <svg viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <span>Что я должен уметь после выполнения:</span>
        </div>
        <div class="skills-list">${escapeHtml(task.skills_after)}</div>
      </div>

      <!-- Артефакт / Deliverable -->
      <div class="deliverable-box">
        <span class="deliverable-label">Артефакт на выходе:</span>
        <span>${escapeHtml(task.deliverables)}</span>
      </div>

      ${checklistHtml}
      ${notesPreviewHtml}

      <div class="task-footer">
        <div class="task-hours-tag">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          <span>Трудоемкость: ~${task.estimated_hours} ч</span>
        </div>
        <div class="task-actions-group">
          <button class="btn-task-action btn-edit-note" data-task-id="${task.id}">Заметка</button>
          <button class="btn-task-action btn-view-detail" data-task-id="${task.id}">Кодекс задачи</button>
        </div>
      </div>
    `;

    // Слушатели событий на карточке
    const statusBtn = card.querySelector('.status-pill-btn');
    statusBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      let nextStatus = 'in_progress';
      if (task.status === 'todo') nextStatus = 'in_progress';
      else if (task.status === 'in_progress') nextStatus = 'completed';
      else if (task.status === 'completed') nextStatus = 'todo';
      updateTaskStatus(task.id, nextStatus);
    });

    card.querySelector('.btn-edit-note').addEventListener('click', (e) => {
      e.stopPropagation();
      openNoteModal(task);
    });

    card.querySelector('.btn-view-detail').addEventListener('click', (e) => {
      e.stopPropagation();
      openDetailModal(task);
    });

    return card;
  }

  // ============================================================
  // МОДАЛЬНЫЕ ОКНА
  // ============================================================

  function openNoteModal(task) {
    const modal = document.getElementById('modal-notes');
    const input = document.getElementById('task-note-text');
    const title = document.getElementById('note-modal-title');
    const saveBtn = document.getElementById('btn-save-note');

    if (!modal || !input) return;

    state.activeTaskId = task.id;
    if (title) title.textContent = `Заметка: ${task.title}`;
    input.value = task.notes || '';

    saveBtn.onclick = () => {
      saveTaskNotes(task.id, input.value.trim());
      closeModal(modal);
    };

    openModal(modal);
  }

  function openDetailModal(task) {
    const modal = document.getElementById('modal-detail');
    const content = document.getElementById('modal-detail-content');
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="margin-bottom:16px;">
        <div class="task-badges" style="margin-bottom:8px;">
          <span class="badge-code">${escapeHtml(task.task_code)}</span>
          <span class="badge-category">${escapeHtml(task.category)}</span>
          <span class="badge-priority priority-${task.priority}">${task.priority}</span>
        </div>
        <h2 style="font-family:var(--font-serif);font-size:1.4rem;color:#ffffff;line-height:1.3;margin-bottom:12px;">
          ${escapeHtml(task.title)}
        </h2>
        <p style="color:var(--silver-chrome);font-size:0.95rem;line-height:1.6;margin-bottom:20px;">
          ${escapeHtml(task.description)}
        </p>
      </div>

      <div class="skills-box" style="margin-bottom:20px;">
        <div class="skills-box-title">
          <span>Что ты обязан уметь после завершения:</span>
        </div>
        <div class="skills-list" style="font-size:0.9rem;">${escapeHtml(task.skills_after)}</div>
      </div>

      <div class="deliverable-box" style="margin-bottom:20px;">
        <span class="deliverable-label">Подтверждающий результат:</span>
        <span style="font-weight:600;color:#ffffff;">${escapeHtml(task.deliverables)}</span>
      </div>

      <div style="background:rgba(255,255,255,0.03);border:1px solid var(--silver-border);border-radius:8px;padding:16px;margin-bottom:20px;">
        <div style="font-family:var(--font-mono);font-size:0.8rem;text-transform:uppercase;color:var(--silver-medium);margin-bottom:10px;">
          Быстрая смена статуса:
        </div>
        <div style="display:flex;gap:10px;">
          <button class="btn btn-silver-outline ${task.status === 'todo' ? 'btn-silver-solid' : ''}" id="modal-set-todo">К выполнению</button>
          <button class="btn btn-silver-outline ${task.status === 'in_progress' ? 'btn-silver-solid' : ''}" id="modal-set-prog">В процессе</button>
          <button class="btn btn-silver-outline ${task.status === 'completed' ? 'btn-silver-solid' : ''}" id="modal-set-done">✓ Завершено</button>
        </div>
      </div>
    `;

    content.querySelector('#modal-set-todo').onclick = () => {
      updateTaskStatus(task.id, 'todo');
      closeModal(modal);
    };
    content.querySelector('#modal-set-prog').onclick = () => {
      updateTaskStatus(task.id, 'in_progress');
      closeModal(modal);
    };
    content.querySelector('#modal-set-done').onclick = () => {
      updateTaskStatus(task.id, 'completed');
      closeModal(modal);
    };

    openModal(modal);
  }

  function openModal(modalEl) {
    modalEl.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modalEl) {
    modalEl.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ============================================================
  // ДОБАВЛЕНИЕ НОВОЙ ЗАДАЧИ
  // ============================================================

  async function handleAddTaskSubmit(e) {
    e.preventDefault();
    const stageId = parseInt(document.getElementById('add-stage-id').value, 10);
    const title = document.getElementById('add-task-title').value.trim();
    const category = document.getElementById('add-task-category').value.trim() || 'Разработка';
    const priority = document.getElementById('add-task-priority').value;
    const hours = parseInt(document.getElementById('add-task-hours').value, 10) || 15;
    const desc = document.getElementById('add-task-desc').value.trim();
    const skills = document.getElementById('add-task-skills').value.trim();
    const deliverable = document.getElementById('add-task-deliverable').value.trim();

    if (!title) {
      alert('Введите название задачи');
      return;
    }

    const newTask = {
      id: Date.now(),
      stage_id: stageId,
      task_code: `CUSTOM-${Math.floor(Math.random() * 900 + 100)}`,
      title: title,
      category: category,
      priority: priority,
      status: 'todo',
      estimated_hours: hours,
      description: desc || 'Пользовательская задача кодекса 1С',
      skills_after: skills || '• Успешное выполнение и внедрение на практике',
      deliverables: deliverable || 'Выполненная задача и фиксация в истории',
      checklist_items: ['Выполнить задачу', 'Проверить результат', 'Зафиксировать опыт'],
      notes: ''
    };

    if (state.isDbConnected) {
      try {
        const resp = await fetch('api.php?action=add_task', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            stage_id: stageId,
            title: title,
            category: category,
            priority: priority,
            estimated_hours: hours,
            description: desc,
            skills_after: skills,
            deliverables: deliverable
          })
        });
        const res = await resp.json();
        if (res.status === 'success' && res.task_id) {
          newTask.id = res.task_id;
        }
      } catch (err) {
        console.error('Ошибка сохранения в MySQL:', err);
      }
    }

    state.tasks.push(newTask);
    saveToLocalStorage();
    recalculateLocalStats();
    renderStats();
    renderTasks();

    closeModal(document.getElementById('modal-add-task'));
    document.getElementById('form-add-task').reset();
    showToast(`Задача «${title.substring(0, 30)}» добавлена!`);
  }

  // ============================================================
  // СЛУШАТЕЛИ СОБЫТИЙ И ФИЛЬТРЫ
  // ============================================================

  function setupDomListeners() {
    // 1. Фильтр по квестам / стадиям
    document.querySelectorAll('[data-filter-stage]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('[data-filter-stage]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.currentStageFilter = btn.getAttribute('data-filter-stage');
        renderStages();
        renderTasks();
      });
    });

    // 2. Фильтр по статусу
    document.querySelectorAll('[data-filter-status]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('[data-filter-status]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.currentStatusFilter = btn.getAttribute('data-filter-status');
        renderTasks();
      });
    });

    // 3. Поиск по задачам
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderTasks();
      });
    }

    // 4. Кнопки модалок
    const btnOpenAdd = document.getElementById('btn-open-add-modal');
    if (btnOpenAdd) {
      btnOpenAdd.addEventListener('click', () => {
        openModal(document.getElementById('modal-add-task'));
      });
    }

    const btnOpenGuide = document.getElementById('btn-open-guide');
    if (btnOpenGuide) {
      btnOpenGuide.addEventListener('click', () => {
        openModal(document.getElementById('modal-openserver-guide'));
      });
    }

    // Закрытие модалок по крестику и фону
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
      const closeBtn = modal.querySelector('.btn-close-modal');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => closeModal(modal));
      }
    });

    // Форма добавления задачи
    const formAdd = document.getElementById('form-add-task');
    if (formAdd) {
      formAdd.addEventListener('submit', handleAddTaskSubmit);
    }

    // Кнопка сброса к эталону
    const btnReset = document.getElementById('btn-reset-db');
    if (btnReset) {
      btnReset.addEventListener('click', async () => {
        if (confirm('Сбросить весь прогресс и вернуть эталонные задачи плана?')) {
          if (state.isDbConnected) {
            try {
              await fetch('api.php?action=reset_defaults');
            } catch (e) {}
          }
          localStorage.removeItem('chronica_1c_tasks');
          await loadData();
          showToast('Кодекс сброшен к эталонному состоянию.');
        }
      });
    }
  }

  // ============================================================
  // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
  // ============================================================

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 50);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  function triggerConfetti() {
    // Минималистичный монохромно-серебряный конфетти-салют
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#ffffff', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b'];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.7) * 16,
        size: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        rotation: Math.random() * 360,
        spin: (Math.random() - 0.5) * 10
      });
    }

    let frame = 0;
    function renderConfetti() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // гравитация
        p.alpha -= 0.015;
        p.rotation += p.spin;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      frame++;
      if (frame < 80) {
        requestAnimationFrame(renderConfetti);
      } else {
        canvas.remove();
      }
    }
    renderConfetti();
  }

  // Экспорт в глобальную область для возможного дебага
  window.chronicaApp = {
    state,
    loadData,
    updateTaskStatus,
    saveTaskNotes
  };

  // Старт приложения при готовности DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
