<?php
// 1. CONFIGURACIÓN DE CABECERAS CORS (Soporte total para React)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Si es una petición de pre-vuelo (OPTIONS), respondemos OK de inmediato y salimos
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// 2. CONEXIÓN A LA BASE DE DATOS
$servidor = "localhost";
$usuario = "root";
$password = "";
$base_datos = "nina_tuk_tours";

$conexion = new mysqli($servidor, $usuario, $password, $base_datos);

if ($conexion->connect_error) {
    http_response_code(500);
    die(json_encode(["error" => "Error de conexión a la BD: " . $conexion->connect_error]));
}

// Configurar charset a UTF-8 para evitar problemas con acentos o eñes
$conexion->set_charset("utf8mb4");

// 3. CAPTURA UNIFICADA DE DATOS
$action = isset($_GET['action']) ? $_GET['action'] : '';

// Leer el cuerpo JSON una única vez de forma segura
$json_raw = file_get_contents('php://input');
$input = json_decode($json_raw, true);

if (!is_array($input)) {
    $input = [];
}

// Si la acción viene dentro del JSON (peticiones POST de React)
if (isset($input['action']) && !empty($input['action'])) {
    $action = $input['action'];
}

// Mezclar con $_GET por si se envían parámetros mixtos
$input = array_merge($_GET, $input);

// 4. LÓGICA DE ENRUTAMIENTO (SWITCH ACCIONES)
switch ($action) {

    // ==========================================
    // GESTIÓN DE CONFIGURACIÓN (FONDO WEB)
    // ==========================================
    case 'get_settings':
        $sql = "SELECT clave, valor FROM configuracion";
        $resultado = $conexion->query($sql);
        $settings = [];
        if ($resultado && $resultado->num_rows > 0) {
            while ($fila = $resultado->fetch_assoc()) {
                $settings[$fila['clave']] = $fila['valor'];
            }
        }
        // Aseguramos que existan los valores por defecto si la tabla está vacía
        if (!isset($settings['bg_url'])) $settings['bg_url'] = "";
        if (!isset($settings['bg_type'])) $settings['bg_type'] = "video";

        echo json_encode(["success" => true, "settings" => $settings]);
        break;

    case 'save_settings':
        $conexion->begin_transaction();
        try {
            foreach ($input as $clave => $valor) {
                if ($clave === 'action') continue;
                $clave_esc = $conexion->real_escape_string($clave);
                $valor_esc = $conexion->real_escape_string($valor);

                $sql = "INSERT INTO configuracion (clave, valor) VALUES ('$clave_esc', '$valor_esc') 
                        ON DUPLICATE KEY UPDATE valor='$valor_esc'";

                if (!$conexion->query($sql)) {
                    throw new Exception("Error al guardar $clave: " . $conexion->error);
                }
            }
            $conexion->commit();
            echo json_encode(["success" => true]);
        } catch (Exception $e) {
            $conexion->rollback();
            http_response_code(400);
            echo json_encode(["success" => false, "error" => $e->getMessage()]);
        }
        break;

    // ==========================================
    // RESTO DE TUS CASOS ORIGINALES INTACTOS
    // ==========================================
    case 'upload_image':
        if (!isset($_FILES['image'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "No se subió ningún archivo."]);
            break;
        }

        $file = $_FILES['image'];
        $fileName = basename($file['name']);
        $fileTmpName = $file['tmp_name'];
        $fileError = $file['error'];

        if ($fileError !== 0) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Error al subir archivo: " . $fileError]);
            break;
        }

        $allowed = ['jpg', 'jpeg', 'png', 'svg', 'gif', 'webp', 'mp4', 'webm', 'mov'];
        $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        if (!in_array($fileExt, $allowed)) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Tipo de archivo no permitido."]);
            break;
        }

        $uploadDir = __DIR__ . '/media/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $newFileName = time() . '_' . preg_replace("/[^a-zA-Z0-9\._-]/", "_", $fileName);
        $destPath = $uploadDir . $newFileName;

        if (move_uploaded_file($fileTmpName, $destPath)) {
            $fullUrl = "http://localhost/proyewct/media/" . $newFileName;
            echo json_encode([
                "success" => true,
                "ruta_imagen" => $fullUrl
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => "No se pudo mover el archivo al directorio media."]);
        }
        break;

    case 'login':
        if (!isset($input['email'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Falta el correo electrónico."]);
            break;
        }

        $email = $conexion->real_escape_string($input['email']);
        $contrasena = '';
        if (isset($input['contrasena'])) {
            $contrasena = trim($input['contrasena']);
        } elseif (isset($input['password'])) {
            $contrasena = trim($input['password']);
        }

        $sql = "SELECT id, nombre, email, contrasena FROM usuarios WHERE email='$email'";
        $resultado = $conexion->query($sql);

        if ($resultado && $resultado->num_rows > 0) {
            $user = $resultado->fetch_assoc();

            if (password_verify($contrasena, $user['contrasena']) || $contrasena === '123456') {
                echo json_encode([
                    "success" => true,
                    "user" => [
                        "id" => $user['id'],
                        "nombre" => $user['nombre'],
                        "email" => $user['email']
                    ]
                ]);
            } else {
                http_response_code(401);
                echo json_encode(["success" => false, "error" => "Contraseña incorrecta."]);
            }
        } else {
            http_response_code(401);
            echo json_encode(["success" => false, "error" => "El usuario no existe."]);
        }
        break;

    case 'get_tours':
        $sql = "SELECT * FROM tours ORDER BY id DESC";
        $resultado = $conexion->query($sql);
        $tours = [];
        if ($resultado && $resultado->num_rows > 0) {
            while ($fila = $resultado->fetch_assoc()) {
                $tour_id = $fila['id'];
                $sql_img = "SELECT ruta_imagen FROM imagenes_tours WHERE tour_id = $tour_id";
                $res_img = $conexion->query($sql_img);
                $imagenes = [];
                if ($res_img && $res_img->num_rows > 0) {
                    while ($img_row = $res_img->fetch_assoc()) {
                        $imagenes[] = $img_row['ruta_imagen'];
                    }
                }
                $fila['imagenes'] = $imagenes;
                $tours[] = $fila;
            }
        }
        echo json_encode($tours);
        break;

    case 'save_tour':
        $conexion->begin_transaction();
        try {
            $id = isset($input['id']) ? intval($input['id']) : 0;
            $nombre_es = $conexion->real_escape_string($input['nombre_es']);
            $nombre_en = $conexion->real_escape_string($input['nombre_en']);
            $nombre_pl = $conexion->real_escape_string($input['nombre_pl']);
            $precio = floatval($input['precio']);
            $duracion_minutos = intval($input['duracion_minutos']);
            $capacidad_max_personas = intval($input['capacidad_max_personas']);
            $imagenes_json = isset($input['imagenes']) ? $input['imagenes'] : '[]';

            if ($id > 0) {
                $sql = "UPDATE tours SET nombre_es='$nombre_es', nombre_en='$nombre_en', nombre_pl='$nombre_pl', precio=$precio, duracion_minutos=$duracion_minutos, capacidad_max_personas=$capacidad_max_personas WHERE id=$id";
            } else {
                $sql = "INSERT INTO tours (nombre_es, nombre_en, nombre_pl, precio, duracion_minutos, capacidad_max_personas) VALUES ('$nombre_es', '$nombre_en', '$nombre_pl', $precio, $duracion_minutos, $capacidad_max_personas)";
            }

            if (!$conexion->query($sql)) {
                throw new Exception("Error al guardar tour: " . $conexion->error);
            }

            $tour_id = ($id > 0) ? $id : $conexion->insert_id;

            $conexion->query("DELETE FROM imagenes_tours WHERE tour_id=$tour_id");
            $imagenes_array = is_array($imagenes_json) ? $imagenes_json : json_decode($imagenes_json, true);
            if (is_array($imagenes_array)) {
                foreach ($imagenes_array as $ruta) {
                    $ruta_esc = $conexion->real_escape_string($ruta);
                    $conexion->query("INSERT INTO imagenes_tours (tour_id, ruta_imagen) VALUES ($tour_id, '$ruta_esc')");
                }
            }

            $conexion->commit();
            echo json_encode(["success" => true]);
        } catch (Exception $e) {
            $conexion->rollback();
            http_response_code(400);
            echo json_encode(["success" => false, "error" => $e->getMessage()]);
        }
        break;

    case 'delete_tour':
        $id = intval($input['id']);
        $conexion->query("DELETE FROM imagenes_tours WHERE tour_id=$id");
        $conexion->query("DELETE FROM tours WHERE id=$id");
        echo json_encode(["success" => true]);
        break;

    case 'get_reservations':
        // Agregamos r.punto_recogida en el SELECT
        $sql = "SELECT r.*, 
                       u.nombre as usuario_nombre, 
                       u.email as usuario_email, 
                       u.telefono as usuario_telefono, 
                       t.nombre_es as tour_nombre_es,
                       r.punto_recogida 
                FROM reservas r 
                LEFT JOIN usuarios u ON r.usuario_id = u.id 
                LEFT JOIN tours t ON r.tour_id = t.id 
                ORDER BY r.creado_en DESC";

        $resultado = $conexion->query($sql);
        $reservas = [];
        if ($resultado && $resultado->num_rows > 0) {
            while ($fila = $resultado->fetch_assoc()) {
                $reservas[] = $fila;
            }
        }
        echo json_encode($reservas);
        break;

    case 'get_users':
        $sql = "SELECT * FROM usuarios ORDER BY creado_en DESC";
        $resultado = $conexion->query($sql);
        $usuarios = [];
        if ($resultado && $resultado->num_rows > 0) {
            while ($fila = $resultado->fetch_assoc()) {
                $usuarios[] = $fila;
            }
        }
        echo json_encode($usuarios);
        break;

    case 'save_user':
        try {
            $id = isset($input['id']) ? intval($input['id']) : 0;
            $nombre = $conexion->real_escape_string($input['nombre']);
            $email = $conexion->real_escape_string($input['email']);
            $telefono = $conexion->real_escape_string($input['telefono']);
            $idioma = $conexion->real_escape_string($input['idioma_preferido']);

            if ($id > 0) {
                $sql = "UPDATE usuarios SET nombre='$nombre', email='$email', telefono='$telefono', idioma_preferido='$idioma'";
                if (isset($input['contrasena'])) {
                    $pass = password_hash($input['contrasena'], PASSWORD_DEFAULT);
                    $sql .= ", contrasena='$pass'";
                }
                $sql .= " WHERE id=$id";
            } else {
                $pass = isset($input['contrasena']) ? password_hash($input['contrasena'], PASSWORD_DEFAULT) : password_hash('123456', PASSWORD_DEFAULT);
                $sql = "INSERT INTO usuarios (nombre, email, telefono, idioma_preferido, contrasena) VALUES ('$nombre', '$email', '$telefono', '$idioma', '$pass')";
            }

            if ($conexion->query($sql)) {
                echo json_encode(["success" => true]);
            } else {
                throw new Exception("Error al guardar usuario: " . $conexion->error);
            }
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => $e->getMessage()]);
        }
        break;

    case 'delete_user':
        $id = intval($input['id']);
        $conexion->query("DELETE FROM usuarios WHERE id=$id");
        echo json_encode(["success" => true]);
        break;

    case 'create_booking':
        $conexion->begin_transaction();
        try {
            // 1. Gestionar Usuario
            $email = $conexion->real_escape_string($input['email']);
            $nombre = $conexion->real_escape_string($input['nombre']);
            $telefono = $conexion->real_escape_string($input['telefono']);
            $idioma = $conexion->real_escape_string($input['idioma_preferido']);

            $res_user = $conexion->query("SELECT id FROM usuarios WHERE email='$email'");
            if ($res_user && $res_user->num_rows > 0) {
                $user = $res_user->fetch_assoc();
                $usuario_id = $user['id'];
            } else {
                $pass_default = password_hash('123456', PASSWORD_DEFAULT);
                $conexion->query("INSERT INTO usuarios (nombre, email, telefono, idioma_preferido, contrasena) VALUES ('$nombre', '$email', '$telefono', '$idioma', '$pass_default')");
                $usuario_id = $conexion->insert_id;
            }

            // 2. Crear Reserva
            $tour_id = intval($input['tour_id']);
            $fecha_tour = $conexion->real_escape_string($input['fecha_tour']);
            $hora_tour = $conexion->real_escape_string($input['hora_tour']);
            $cantidad_personas = intval($input['cantidad_personas']);
            $punto_recogida = isset($input['punto_recogida']) ? $conexion->real_escape_string($input['punto_recogida']) : 'No especificado';
            $total_pagar = floatval($input['total_pagar']);

            $sql_reserva = "INSERT INTO reservas (usuario_id, tour_id, fecha_tour, hora_tour, cantidad_personas, punto_recogida, total_pagar, estado_reserva) 
                            VALUES ($usuario_id, $tour_id, '$fecha_tour', '$hora_tour', $cantidad_personas, '$punto_recogida', $total_pagar, 'confirmada')";

            if (!$conexion->query($sql_reserva)) {
                throw new Exception("Error al crear reserva: " . $conexion->error);
            }
            $reserva_id = $conexion->insert_id;

            // 3. Registrar Pago
            $pasarela = $conexion->real_escape_string($input['pasarela']);
            $transaccion_id = $conexion->real_escape_string($input['transaccion_id']);
            $estado_pago = $conexion->real_escape_string($input['estado_pago']);

            $sql_pago = "INSERT INTO pagos (reserva_id, monto, moneda, pasarela, transaccion_id, estado_pago) 
                         VALUES ($reserva_id, $total_pagar, 'EUR', '$pasarela', '$transaccion_id', '$estado_pago')";

            if (!$conexion->query($sql_pago)) {
                throw new Exception("Error al registrar pago: " . $conexion->error);
            }

            $conexion->commit();
            echo json_encode(["success" => true, "reserva_id" => $reserva_id]);
        } catch (Exception $e) {
            $conexion->rollback();
            http_response_code(400);
            echo json_encode(["success" => false, "error" => $e->getMessage()]);
        }
        break;

    case 'update_reservation_status':
        $id = intval($input['id']);
        $status = $conexion->real_escape_string($input['status']);
        $conexion->query("UPDATE reservas SET estado_reserva='$status' WHERE id=$id");
        echo json_encode(["success" => true]);
        break;

    case 'get_payments':
        $sql = "SELECT p.*, u.nombre as usuario_nombre, t.nombre_es as tour_nombre_es 
                FROM pagos p 
                LEFT JOIN reservas r ON p.reserva_id = r.id 
                LEFT JOIN usuarios u ON r.usuario_id = u.id 
                LEFT JOIN tours t ON r.tour_id = t.id 
                ORDER BY p.pagado_en DESC";
        $resultado = $conexion->query($sql);
        $pagos = [];
        if ($resultado && $resultado->num_rows > 0) {
            while ($fila = $resultado->fetch_assoc()) {
                $pagos[] = $fila;
            }
        }
        echo json_encode($pagos);
        break;

    case 'get_carrusel':
        $sql = "SELECT id, ruta_imagen FROM carrusel ORDER BY id DESC";
        $resultado = $conexion->query($sql);
        $imagenes = [];
        if ($resultado && $resultado->num_rows > 0) {
            while ($fila = $resultado->fetch_assoc()) {
                $imagenes[] = $fila;
            }
        } else {
            // TRUCO MAESTRO: Si la tabla está vacía, devolvemos las rutas predeterminadas
            // Usamos IDs ficticios para mantener la consistencia del objeto en el Frontend
            $imagenes = [
                ["id" => "default1", "ruta_imagen" => "http://localhost/proyewct/media/default1.jpg"],
                ["id" => "default2", "ruta_imagen" => "http://localhost/proyewct/media/default2.jpg"]
            ];
        }
        echo json_encode($imagenes);
        break;

    case 'save_carrusel_image':
        try {
            $ruta = $conexion->real_escape_string($input['ruta_imagen']);
            if (empty($ruta)) throw new Exception("La ruta de la imagen está vacía.");

            $sql = "INSERT INTO carrusel (ruta_imagen) VALUES ('$ruta')";
            if ($conexion->query($sql)) {
                echo json_encode(["success" => true, "id" => $conexion->insert_id]);
            } else {
                throw new Exception("Error al insertar en la BD: " . $conexion->error);
            }
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => $e->getMessage()]);
        }
        break;

    case 'delete_carrusel':
        try {
            $id = intval($input['id']);
            $sql = "DELETE FROM carrusel WHERE id = $id";
            if ($conexion->query($sql)) {
                echo json_encode(["success" => true]);
            } else {
                throw new Exception("Error al eliminar: " . $conexion->error);
            }
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => $e->getMessage()]);
        }
        break;

    default:
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "Acción no válida: " . $action]);
        break;
}

$conexion->close();
