// Importa dotenv para usar variables del archivo .env
import dotenv from "dotenv";
// Carga las variables de entorno en process.env
dotenv.config();

// Esta función asincrónica maneja las solicitudes GET en una API de Next.js para consultar productos con su stock por almacén.
export async function GET() {
  try {
    // Se realiza una petición HTTP GET a la API externa de productos y almacenes.
    const response = await fetch('https://apigloma.xentra.com.mx/productos_almacenes', {
      method: 'GET',
      // Se especifica el token de autorización necesario para consumir la API.
      headers: {
        'Authorization': process.env.API_KEY,
        'Content-Type': 'application/json'
      },
      // Se indica que no se debe almacenar en caché esta solicitud.
      cache: 'no-store'
    });

    // Si la respuesta no fue exitosa, se captura el contenido del error y se devuelve un mensaje detallado.
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

    // Si la respuesta fue correcta, se convierte el contenido a formato JSON.
    const data = await response.json();

    // Se define un objeto para almacenar los datos transformados por producto.
    const resultado = {};
    // Se itera sobre cada producto recibido en la respuesta.
    data.datos.forEach((item) => {
      // Se extrae la referencia del producto o se asigna un valor por defecto.
      const referencia = item.referencia || 'Sin Referencia';
      // Se convierte el stock, el costo y la oferta a valores numéricos.
      const existencia = parseInt(item.stock) || 0;
      const costo = parseFloat(item.precio) || 0;
      const oferta = parseFloat(item.precio_oferta) || 0;

      // Se crea un objeto para agrupar la información de los almacenes relacionados con este producto.
      const almacenes = {};
      item.almacenes.forEach((almacen) => {
        // Por cada almacén, se guarda su clave, nombre y stock.
        almacenes[almacen.almacen_clave] = {
          nombre: almacen.almacen,
          stock: parseInt(almacen.stock) || 0,
        };
      });

      // Se guarda en el resultado final la información estructurada de cada producto.
      resultado[referencia] = {
        referencia,
        existencia,
        costo,
        oferta,
        almacenes
      };
    });

    // Se retorna la respuesta final en formato JSON con código 200 (OK).
    return new Response(JSON.stringify(resultado), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    // Si ocurre un error en la ejecución del código, se devuelve una respuesta con estado 500 (Error interno del servidor).
    return new Response(JSON.stringify({
      error: 'Error interno del servidor',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
