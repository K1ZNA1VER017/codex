<?php
/**
 * API ДЛЯ ПОРТАЛА-ТРЕКЕРА ОБУЧЕНИЯ 1С (OPENSERVER 6 / MYSQL 8.4)
 * Обрабатывает AJAX-запросы фронтенда к базе данных `hightech`
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Загрузка конфигурации из файла config.php (формат: return [...])
$config = require __DIR__ . '/config.php';

function get_db_connection(array $cfg) {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $host     = $cfg['host']     ?? 'MySQL-8.4';
    $dbname   = $cfg['dbname']   ?? 'hightech';
    $user     = $cfg['user']     ?? 'root';
    $password = $cfg['password'] ?? '';
    $charset  = $cfg['charset']  ?? 'utf8mb4';

    // Для MySQL 8.4 используем стандартный DSN
    $dsn = sprintf("mysql:host=%s;dbname=%s;charset=%s", $host, $dbname, $charset);
    
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES {$charset}"
    ];

    try {
        $pdo = new PDO($dsn, $user, $password, $options);
        return $pdo;
    } catch (PDOException $e) {
        // Умный фолбэк для локальной среды: если хост модуля 'MySQL-8.4' не резолвится вне OpenServer 6
        if ($host !== '127.0.0.1' && $host !== 'localhost') {
            try {
                $fallbackDsn = sprintf("mysql:host=127.0.0.1;dbname=%s;charset=%s", $dbname, $charset);
                $pdo = new PDO($fallbackDsn, $user, $password, $options);
                return $pdo;
            } catch (PDOException $e2) {
                // Продолжаем вывод оригинальной ошибки OpenServer
            }
        }

        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'status'  => 'error',
            'message' => 'Не удалось подключиться к базе данных MySQL 8.4 на OpenServer.',
            'details' => $e->getMessage(),
            'config'  => [
                'host'   => $host,
                'dbname' => $dbname,
                'user'   => $user
            ],
            'hint' => 'Убедитесь, что модуль MySQL-8.4 запущен в OpenServer 6, а база `hightech` импортирована из файла database.sql через phpMyAdmin.'
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }
}

$action = $_GET['action'] ?? $_POST['action'] ?? '';

// Читаем входные JSON-данные если есть
$input = [];
$rawInput = file_get_contents('php://input');
if (!empty($rawInput)) {
    $decoded = json_decode($rawInput, true);
    if (is_array($decoded)) {
        $input = $decoded;
    }
}
if (empty($action) && isset($input['action'])) {
    $action = $input['action'];
}

try {
    $pdo = get_db_connection($config);

    switch ($action) {
        // ============================================================
        // ПОЛУЧЕНИЕ ВСЕХ ДАННЫХ (СТАДИИ, ЗАДАЧИ, ПРОФИЛЬ, СТАТИСТИКА)
        // ============================================================
        case 'get_data':
        case '':
            // 1. Стадии
            $stmtStages = $pdo->query("SELECT * FROM `stages` ORDER BY `sort_order` ASC, `id` ASC");
            $stages = $stmtStages->fetchAll();

            // 2. Задачи
            $stmtTasks = $pdo->query("SELECT * FROM `tasks` ORDER BY `stage_id` ASC, `id` ASC");
            $rawTasks = $stmtTasks->fetchAll();

            $tasks = array_map(function($t) {
                if (!empty($t['checklist'])) {
                    $decoded = json_decode($t['checklist'], true);
                    $t['checklist_items'] = is_array($decoded) ? $decoded : [];
                } else {
                    $t['checklist_items'] = [];
                }
                $t['estimated_hours'] = (int)$t['estimated_hours'];
                return $t;
            }, $rawTasks);

            // 3. Профиль
            $stmtProfile = $pdo->query("SELECT * FROM `profile` LIMIT 1");
            $profile = $stmtProfile->fetch();
            if (!$profile) {
                $profile = [
                    'user_title' => 'Инженер-программист 1С',
                    'current_role' => 'Инженер-программист (Франчайзи 1С)',
                    'target_role' => 'Junior+ / Middle Разработчик 1С',
                    'experience_years' => 1.5,
                    'college_months_left' => 8,
                    'target_salary_min' => 110000,
                    'target_salary_max' => 160000,
                    'motto' => '«От рутины фискальных накопителей — к архитектуре микросервисов и 1С:Предприятие.Элемент»'
                ];
            }

            // 4. Расчет статистики
            $totalTasks = count($tasks);
            $completedTasks = 0;
            $inProgressTasks = 0;
            $todoTasks = 0;
            $totalHours = 0;
            $completedHours = 0;

            foreach ($tasks as $task) {
                $totalHours += (int)$task['estimated_hours'];
                if ($task['status'] === 'completed') {
                    $completedTasks++;
                    $completedHours += (int)$task['estimated_hours'];
                } elseif ($task['status'] === 'in_progress') {
                    $inProgressTasks++;
                } else {
                    $todoTasks++;
                }
            }

            $percentage = $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100) : 0;

            // Расчет звания / ранга в Кодексе
            if ($percentage < 25) {
                $rankTitle = 'Оруженосец Франчайзи';
                $rankSubtitle = 'Базовые регламенты, кассовая рутина и пробуждение к кодингу';
                $rankBadge = 'I';
            } elseif ($percentage < 50) {
                $rankTitle = 'Адепт Элемента и API';
                $rankSubtitle = 'Полномочия веб-интеграций и владение 1С:Предприятие.Элемент';
                $rankBadge = 'II';
            } elseif ($percentage < 75) {
                $rankTitle = 'Рыцарь Платформы и БСП';
                $rankSubtitle = 'Официальный сертификат Профессионала и стандарты Enterprise';
                $rankBadge = 'III';
            } elseif ($percentage < 95) {
                $rankTitle = 'Магистр Корпоративных Архитектур';
                $rankSubtitle = 'Крепкое боевое портфолио, диплом закрыт, открыты двери лучших офферов';
                $rankBadge = 'IV';
            } else {
                $rankTitle = 'Грандмастер 1С / Middle-Инженер';
                $rankSubtitle = 'Триумфальный вход в штат с высоким окладом и новыми масштабами';
                $rankBadge = 'V';
            }

            echo json_encode([
                'status' => 'success',
                'stages' => $stages,
                'tasks' => $tasks,
                'profile' => $profile,
                'stats' => [
                    'total_tasks' => $totalTasks,
                    'completed_tasks' => $completedTasks,
                    'in_progress_tasks' => $inProgressTasks,
                    'todo_tasks' => $todoTasks,
                    'percentage' => $percentage,
                    'total_hours' => $totalHours,
                    'completed_hours' => $completedHours,
                    'rank' => [
                        'title' => $rankTitle,
                        'subtitle' => $rankSubtitle,
                        'badge' => $rankBadge
                    ]
                ]
            ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            break;

        // ============================================================
        // ОБНОВЛЕНИЕ СТАТУСА ЗАДАЧИ
        // ============================================================
        case 'update_status':
            $taskId = (int)($input['task_id'] ?? $_POST['task_id'] ?? 0);
            $newStatus = trim($input['status'] ?? $_POST['status'] ?? '');

            if (!$taskId || !in_array($newStatus, ['todo', 'in_progress', 'completed'])) {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'Некорректный ID задачи или статус']);
                exit;
            }

            $completedAt = ($newStatus === 'completed') ? date('Y-m-d H:i:s') : null;

            $stmt = $pdo->prepare("UPDATE `tasks` SET `status` = :status, `completed_at` = :completed_at WHERE `id` = :id");
            $stmt->execute([
                ':status' => $newStatus,
                ':completed_at' => $completedAt,
                ':id' => $taskId
            ]);

            echo json_encode([
                'status' => 'success',
                'message' => 'Статус задачи успешно обновлен',
                'task_id' => $taskId,
                'new_status' => $newStatus,
                'completed_at' => $completedAt
            ], JSON_UNESCAPED_UNICODE);
            break;

        // ============================================================
        // ОБНОВЛЕНИЕ ЛИЧНЫХ ЗАМЕТОК К ЗАДАЧЕ
        // ============================================================
        case 'update_notes':
            $taskId = (int)($input['task_id'] ?? $_POST['task_id'] ?? 0);
            $notes = trim($input['notes'] ?? $_POST['notes'] ?? '');

            if (!$taskId) {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'Не указан ID задачи']);
                exit;
            }

            $stmt = $pdo->prepare("UPDATE `tasks` SET `notes` = :notes WHERE `id` = :id");
            $stmt->execute([
                ':notes' => $notes,
                ':id' => $taskId
            ]);

            echo json_encode([
                'status' => 'success',
                'message' => 'Заметки к задаче сохранены',
                'task_id' => $taskId
            ], JSON_UNESCAPED_UNICODE);
            break;

        // ============================================================
        // ДОБАВЛЕНИЕ НОВОЙ ЗАДАЧИ
        // ============================================================
        case 'add_task':
            $stageId = (int)($input['stage_id'] ?? $_POST['stage_id'] ?? 1);
            $title = trim($input['title'] ?? $_POST['title'] ?? '');
            $category = trim($input['category'] ?? $_POST['category'] ?? 'Дополнительно');
            $priority = trim($input['priority'] ?? $_POST['priority'] ?? 'HIGH');
            $hours = (int)($input['estimated_hours'] ?? $_POST['estimated_hours'] ?? 10);
            $description = trim($input['description'] ?? $_POST['description'] ?? '');
            $skillsAfter = trim($input['skills_after'] ?? $_POST['skills_after'] ?? '');
            $deliverables = trim($input['deliverables'] ?? $_POST['deliverables'] ?? '');

            if (empty($title)) {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'Название задачи обязательно']);
                exit;
            }

            $taskCode = 'CUSTOM-' . time();

            $stmt = $pdo->prepare("INSERT INTO `tasks` 
                (`stage_id`, `task_code`, `title`, `category`, `priority`, `status`, `estimated_hours`, `description`, `skills_after`, `deliverables`, `checklist`, `notes`)
                VALUES (:stage_id, :task_code, :title, :category, :priority, 'todo', :hours, :description, :skills_after, :deliverables, '[]', '')");
            
            $stmt->execute([
                ':stage_id' => $stageId,
                ':task_code' => $taskCode,
                ':title' => $title,
                ':category' => $category,
                ':priority' => $priority,
                ':hours' => $hours,
                ':description' => $description,
                ':skills_after' => $skillsAfter,
                ':deliverables' => $deliverables
            ]);

            $newId = $pdo->lastInsertId();

            echo json_encode([
                'status' => 'success',
                'message' => 'Задача успешно создана',
                'task_id' => $newId
            ], JSON_UNESCAPED_UNICODE);
            break;

        // ============================================================
        // СБРОС И ВОССТАНОВЛЕНИЕ НАЧАЛЬНЫХ ДАННЫХ
        // ============================================================
        case 'reset_defaults':
            $sqlFile = __DIR__ . '/database.sql';
            if (file_exists($sqlFile)) {
                $sqlContent = file_get_contents($sqlFile);
                $pdo->exec($sqlContent);
                echo json_encode(['status' => 'success', 'message' => 'База данных успешно сброшена до начальных эталонных значений!']);
            } else {
                http_response_code(500);
                echo json_encode(['status' => 'error', 'message' => 'Файл database.sql не найден']);
            }
            break;

        default:
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Неизвестное действие: ' . htmlspecialchars($action)]);
            break;
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Внутренняя ошибка сервера API',
        'details' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
