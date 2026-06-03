<?php
// 1. Cabeceras CORS: Esto es VITAL para que React (puerto 5173) pueda hablar con PHP (puerto 80)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json; charset=UTF-8");

// 2. Credenciales de tu base de datos XAMPP
$servidor = "localhost";
$usuario = "root";
$password = ""; // En XAMPP por defecto la contraseña está vacía
$base_datos = "nina_tuk_tours";

// 3. Crear la conexión a MySQL
$conexion = new mysqli($servidor, $usuario, $password, $base_datos);

// Verificar si hay error de conexión
if ($conexion->connect_error) {
    http_response_code(500);
    die(json_encode(["error" => "Error de conexión a la BD: " . $conexion->connect_error]));
}

// 4. Buscar los datos en la tabla 'tours'
$sql = "SELECT * FROM tours";
$resultado = $conexion->query($sql);

$tours = array();

// 5. Recorrer los resultados y guardarlos en un arreglo
if ($resultado->num_rows > 0) {
    while($fila = $resultado->fetch_assoc()) {
        $tours[] = $fila;
    }
}

// 6. Imprimir el resultado en formato JSON para que React lo entienda
echo json_encode($tours);

// Cerrar conexión
$conexion->close();
?>