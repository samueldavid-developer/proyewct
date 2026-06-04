<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$servidor = "localhost";
$usuario = "root";
$password = ""; 
$base_datos = "nina_tuk_tours";

$conexion = new mysqli($servidor, $usuario, $password, $base_datos);

if ($conexion->connect_error) {
    http_response_code(500);
    die(json_encode(["error" => "Error de conexión a la BD: " . $conexion->connect_error]));
}

// Configurar charset a UTF-8 para evitar problemas de acentos y caracteres especiales
$conexion->set_charset("utf8mb4");

// Obtener la acción del query string o del cuerpo de la petición
$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (isset($input['action'])) {
        $action = $input['action'];
    }
} else {
    $input = $_GET;
}

switch ($action) {
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
        $fileSize = $file['size'];

        if ($fileError !== 0) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Error al subir archivo: " . $fileError]);
            break;
        }

        // Validar extensiones de imagen
        $allowed = ['jpg', 'jpeg', 'png', 'svg', 'gif', 'webp'];
        $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        if (!in_array($fileExt, $allowed)) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Tipo de archivo no permitido. Solo se aceptan: " . implode(', ', $allowed)]);
            break;
        }

        // Directorio destino (media en la raíz del proyecto)
        $uploadDir = __DIR__ . '/media/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        // Generar un nombre único para evitar colisiones
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
        $email = $conexion->real_escape_string($input['email']);
        $contrasena = isset($input['contrasena']) ? trim($input['contrasena']) : '';

        $sql = "SELECT id, nombre, email, contrasena FROM usuarios WHERE email='$email'";
        $resultado = $conexion->query($sql);
        if ($resultado && $resultado->num_rows > 0) {
            $user = $resultado->fetch_assoc();
            if (password_verify($contrasena, $user['contrasena'])) {
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
            $duracion_minutos = intval($input['duracion_minutos']);
            $precio = floatval($input['precio']);
            $capacidad_max_personas = isset($input['capacidad_max_personas']) ? intval($input['capacidad_max_personas']) : 4;
            $imagenes = isset($input['imagenes']) ? $input['imagenes'] : [];

            if ($id > 0) {
                // Update
                $sql = "UPDATE tours SET nombre_es='$nombre_es', nombre_en='$nombre_en', nombre_pl='$nombre_pl', duracion_minutos=$duracion_minutos, precio=$precio, capacidad_max_personas=$capacidad_max_personas WHERE id=$id";
                if (!$conexion->query($sql)) {
                    throw new Exception("Error al actualizar tour: " . $conexion->error);
                }
                $tour_id = $id;

                // Eliminar imágenes antiguas
                $sql_del = "DELETE FROM imagenes_tours WHERE tour_id=$tour_id";
                if (!$conexion->query($sql_del)) {
                    throw new Exception("Error al eliminar imágenes antiguas: " . $conexion->error);
                }
            } else {
                // Insert
                $sql = "INSERT INTO tours (nombre_es, nombre_en, nombre_pl, duracion_minutos, precio, capacidad_max_personas) VALUES ('$nombre_es', '$nombre_en', '$nombre_pl', $duracion_minutos, $precio, $capacidad_max_personas)";
                if (!$conexion->query($sql)) {
                    throw new Exception("Error al insertar tour: " . $conexion->error);
                }
                $tour_id = $conexion->insert_id;
            }

            // Insertar nuevas imágenes
            foreach ($imagenes as $img) {
                if (trim($img) !== '') {
                    $ruta = $conexion->real_escape_string(trim($img));
                    $sql_img = "INSERT INTO imagenes_tours (tour_id, ruta_imagen) VALUES ($tour_id, '$ruta')";
                    if (!$conexion->query($sql_img)) {
                        throw new Exception("Error al insertar imagen ($ruta): " . $conexion->error);
                    }
                }
            }

            $conexion->commit();
            echo json_encode(["success" => true, "tour_id" => $tour_id]);
        } catch (Exception $e) {
            $conexion->rollback();
            http_response_code(400);
            echo json_encode(["success" => false, "error" => $e->getMessage()]);
        }
        break;

    case 'delete_tour':
        $id = isset($input['id']) ? intval($input['id']) : 0;
        if ($id <= 0) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "ID de tour inválido"]);
            break;
        }

        $conexion->begin_transaction();
        try {
            // Eliminar de reservas asociadas (opcional, o podemos dejar que falle si hay FK, pero para CRUD completo vamos a limpiar)
            // Primero eliminar imágenes
            $sql_del_img = "DELETE FROM imagenes_tours WHERE tour_id=$id";
            $conexion->query($sql_del_img);

            $sql_del_tour = "DELETE FROM tours WHERE id=$id";
            if (!$conexion->query($sql_del_tour)) {
                throw new Exception("Error al eliminar el tour: " . $conexion->error);
            }

            $conexion->commit();
            echo json_encode(["success" => true]);
        } catch (Exception $e) {
            $conexion->rollback();
            http_response_code(400);
            echo json_encode(["success" => false, "error" => $e->getMessage()]);
        }
        break;

    case 'get_reservations':
        $sql = "SELECT r.*, 
                       u.nombre as usuario_nombre, 
                       u.email as usuario_email, 
                       u.telefono as usuario_telefono,
                       t.nombre_es as tour_nombre_es,
                       t.nombre_en as tour_nombre_en,
                       t.nombre_pl as tour_nombre_pl
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

    case 'update_reservation_status':
        $id = isset($input['id']) ? intval($input['id']) : 0;
        $estado = $conexion->real_escape_string($input['estado_reserva']);
        if ($id <= 0 || !in_array($estado, ['pendiente', 'confirmada', 'cancelada'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Parámetros inválidos"]);
            break;
        }

        $sql = "UPDATE reservas SET estado_reserva='$estado' WHERE id=$id";
        if ($conexion->query($sql)) {
            echo json_encode(["success" => true]);
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => $conexion->error]);
        }
        break;

    case 'get_payments':
        $sql = "SELECT p.*, 
                       r.fecha_tour,
                       r.hora_tour,
                       u.nombre as usuario_nombre, 
                       u.email as usuario_email,
                       t.nombre_es as tour_nombre_es
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
        $id = isset($input['id']) ? intval($input['id']) : 0;
        $nombre = $conexion->real_escape_string($input['nombre']);
        $email = $conexion->real_escape_string($input['email']);
        $telefono = $conexion->real_escape_string($input['telefono']);
        $idioma = $conexion->real_escape_string($input['idioma_preferido']);
        $contrasena = isset($input['contrasena']) ? trim($input['contrasena']) : '';

        if ($id > 0) {
            // Para actualizar, si la contraseña se deja en blanco no se modifica en base de datos
            if ($contrasena !== '') {
                $hash = password_hash($contrasena, PASSWORD_DEFAULT);
                $hash_escaped = $conexion->real_escape_string($hash);
                $sql = "UPDATE usuarios SET nombre='$nombre', email='$email', telefono='$telefono', idioma_preferido='$idioma', contrasena='$hash_escaped' WHERE id=$id";
            } else {
                $sql = "UPDATE usuarios SET nombre='$nombre', email='$email', telefono='$telefono', idioma_preferido='$idioma' WHERE id=$id";
            }
        } else {
            // Para inserción, si viene vacía le asignamos una por defecto
            $pass_to_hash = $contrasena !== '' ? $contrasena : '123456';
            $hash = password_hash($pass_to_hash, PASSWORD_DEFAULT);
            $hash_escaped = $conexion->real_escape_string($hash);
            $sql = "INSERT INTO usuarios (nombre, email, telefono, idioma_preferido, contrasena) VALUES ('$nombre', '$email', '$telefono', '$idioma', '$hash_escaped')";
        }

        if ($conexion->query($sql)) {
            echo json_encode(["success" => true, "usuario_id" => $id > 0 ? $id : $conexion->insert_id]);
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => $conexion->error]);
        }
        break;

    case 'delete_user':
        $id = isset($input['id']) ? intval($input['id']) : 0;
        if ($id <= 0) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "ID inválido"]);
            break;
        }

        $sql = "DELETE FROM usuarios WHERE id=$id";
        if ($conexion->query($sql)) {
            echo json_encode(["success" => true]);
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => $conexion->error]);
        }
        break;

    default:
        http_response_code(400);
        echo json_encode(["error" => "Acción no válida o no especificada."]);
        break;
}

$conexion->close();
?>
