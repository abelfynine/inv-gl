// Se indica que este componente se ejecuta en el cliente (navegador).
"use client";

// Se importa el componente de navegación principal.
import Navbar from "../components/Navbar";
// Se importan los hooks necesarios desde React para manejar estado y efectos.
import React, { useEffect, useState } from 'react';

// Se define el componente principal de la página de productos.
export default function ProductosPage() {
  // Se define el estado para guardar los productos obtenidos de la API.
  const [productos, setProductos] = useState([]);
  // Se define el estado para mostrar errores si ocurren durante la carga.
  const [error, setError] = useState(null);
  // Se define el estado para el número de página actual.
  const [paginaActual, setPaginaActual] = useState(1);
  // Se define el estado para controlar cuántas filas se muestran por página.
  const [filasPorPagina, setFilasPorPagina] = useState(10);

  // Se utiliza useEffect para ejecutar la carga de datos una vez al montar el componente.
  useEffect(() => {
    // Se realiza una solicitud a la API local para obtener los productos.
    fetch('/api/productos')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          // Se transforma el objeto recibido en un arreglo de productos con formato legible.
          const productosFormateados = Object.entries(data).map(([referencia, item]) => ({
            referencia,
            nombre: item.nombre || 'Sin Nombre',
            sku: item.sku || 'Sin SKU',
            costo: new Intl.NumberFormat('es-MX', {
              style: 'currency',
              currency: 'MXN',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(parseFloat(item.costo)) || 'Sin Costo',
            gtin: item.gtin || 'Sin Gtin',
            marca: item.marca || 'Sin Marca',
            categoria: item.categoria || 'Sin Categoria',
            grupo: item.grupo || 'Sin Grupo',
            subcategoria: item.subcategoria || 'Sin Subcategoria',
          }));
          // Se actualiza el estado con los productos formateados.
          setProductos(productosFormateados);
        } else {
          setError('No se encontraron datos.');
        }
      })
      .catch((err) => {
        // Si ocurre un error en la solicitud, se captura y muestra.
        setError('Error al obtener los datos.');
        console.error(err);
      });
  }, []);

  // Si ocurrió un error, se muestra en pantalla.
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Si aún no se han cargado los productos, se muestra un mensaje de carga.
  if (productos.length === 0) {
    return <div>Cargando productos...</div>;
  }

  // Se calcula el número total de páginas basado en los productos y las filas por página.
  const totalPaginas = Math.ceil(productos.length / filasPorPagina);

  // Se obtiene el subconjunto de productos que corresponde a la página actual.
  const productosVisibles = productos.slice(
    (paginaActual - 1) * filasPorPagina,
    paginaActual * filasPorPagina
  );

  // Se retorna el contenido visual del componente.
  return (
    <div className="bg-white min-h-screen">
      {/* Se renderiza la barra de navegación */}
      <Navbar />
      <div className="max-w-7xl mx-auto pt-24 px-6 pb-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Lista de Productos</h1>
        {/* Tabla con productos */}
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
            {/* Encabezado de tabla */}
            <thead className="bg-[#1B9CFC] text-white">
              <tr>
                <th className="px-4 py-3 text-left">Referencia</th>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">SKU</th>
                <th className="px-4 py-3 text-left">Costo</th>
                <th className="px-4 py-3 text-left">GTIN</th>
                <th className="px-4 py-3 text-left">Marca</th>
                <th className="px-4 py-3 text-left">Categoría</th>
                <th className="px-4 py-3 text-left">Grupo</th>
                <th className="px-4 py-3 text-left">Subcategoría</th>
              </tr>
            </thead>
            {/* Cuerpo de tabla con productos visibles */}
            <tbody className="divide-y divide-gray-100">
              {productosVisibles.map((producto, index) => (
                <tr key={index} className="hover:bg-gray-50 transition duration-200">
                  <td className="px-4 py-2">{producto.referencia}</td>
                  <td className="px-4 py-2">{producto.nombre}</td>
                  <td className="px-4 py-2">{producto.sku}</td>
                  <td className="px-4 py-2">{producto.costo}</td>
                  <td className="px-4 py-2">{producto.gtin}</td>
                  <td className="px-4 py-2">{producto.marca}</td>
                  <td className="px-4 py-2">{producto.categoria}</td>
                  <td className="px-4 py-2">{producto.grupo}</td>
                  <td className="px-4 py-2">{producto.subcategoria}</td>
                </tr>
              ))}
              {/* Mensaje si no hay productos visibles */}
              {productosVisibles.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center text-gray-500 py-4">
                    No hay productos para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Sección de paginación y selección de cantidad de filas */}
          <div className="flex justify-between items-center mt-4">
            <div>
              <label className="ml-2 mr-2 text-sm text-gray-700">Mostrar:</label>
              <select
                className="border border-gray-300 rounded px-2 py-1 text-sm cursor-pointer"
                value={filasPorPagina}
                onChange={(e) => {
                  setFilasPorPagina(Number(e.target.value));
                  setPaginaActual(1);
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            {/* Botones de navegación de páginas */}
            <div className="space-x-2">
              <button
                className={`px-3 py-1 bg-gray-200 rounded disabled:opacity-50 ${paginaActual === 1 ? '' : 'cursor-pointer'
                  }`}
                onClick={() => setPaginaActual(paginaActual - 1)}
                disabled={paginaActual === 1}
              >
                ← Anterior
              </button>
              <span className="text-sm text-gray-700">
                Página {paginaActual} de {totalPaginas}
              </span>
              <button
                className={`px-3 py-1 bg-gray-200 rounded disabled:opacity-50 ${paginaActual === totalPaginas ? '' : 'cursor-pointer'
                  }`}
                onClick={() => setPaginaActual(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
              >
                Siguiente →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
