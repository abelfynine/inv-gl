// Importa dotenv para usar variables del archivo .env
import dotenv from "dotenv";
// Carga las variables de entorno en process.env
dotenv.config();

// Esta función asincrónica maneja las solicitudes HTTP GET en una ruta API de Next.js.
export async function GET() {
  try {
    // Se realiza una solicitud fetch al endpoint externo que proporciona datos de productos.
    const response = await fetch('https://apigloma.xentra.com.mx/productos', {
      method: 'GET',
      // Se incluye el token de autorización necesario para acceder a la API.
      headers: {
        'Authorization': process.env.API_KEY,
        'Content-Type': 'application/json'
      },
      // Se evita el almacenamiento en caché de la respuesta.
      cache: 'no-store'
    });

    // Si la respuesta no es exitosa, se captura el error y se retorna con el estado correspondiente.
    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({
        error: 'Error al obtener los datos',
        status: response.status,
        message: errorText
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Si la respuesta es válida, se convierte el contenido a JSON.
    const data = await response.json();

    // Se transforma la respuesta original en un nuevo formato de objeto, utilizando la 'referencia' como clave.
    const resultado = {};
    data.datos.forEach((item) => {
      const referencia = item.referencia || 'Sin Referencia';
      // Se estructura cada producto con sus respectivos campos, usando valores por defecto si faltan datos.
      resultado[referencia] = {
        marca: item.marca_nombre || 'Sin Marca',
        categoria: item.categoria_nombre || 'Sin Categoria',
        grupo: item.grupo || 'Sin Grupo',
        subcategoria: item.subcategoria || 'Sin Subcategoria',
        referencia: referencia,
        nombre: item.nombre || 'Sin Nombre',
        sku: item.sku || 'Sin SKU',
        costo: item.precio || '0.00',
        gtin: item.gtin || 'Sin Gtin'
      };
    });

    // Se retorna la respuesta transformada en formato JSON con estado 200 OK.
    return new Response(JSON.stringify(resultado), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    // En caso de ocurrir un error durante la ejecución, se devuelve un mensaje con estado 500.
    return new Response(JSON.stringify({
      error: 'Error interno del servidor',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
