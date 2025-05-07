// Se indica que este componente se ejecuta en el cliente (navegador).
"use client";

// Se importa el componente de navegación principal.
import Navbar from "../components/Navbar";
// Se importan los hooks necesarios desde React para manejar estado y efectos.
import React, { useEffect, useState } from 'react';

// Se define el componente principal de la página StocksPrecios.
export default function StocksPreciosPage() {
  // Se definen los estados para guardar productos, errores, paginación y cantidad de filas por página.
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [filasPorPagina, setFilasPorPagina] = useState(10);

  // Se utiliza useEffect para cargar los datos al montar el componente.
  useEffect(() => {
    // Se hace una solicitud a la API de stock y precios.
    fetch('/api/stocksprecios')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          // Se formatean los datos recibidos, estableciendo valores por defecto en caso de ausencia.
          const productosFormateados = Object.entries(data).map(([referencia, item]) => ({
            referencia,
            existencia: item.existencia || 0,
            costo: new Intl.NumberFormat('es-MX', {
              style: 'currency',
              currency: 'MXN',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(parseFloat(item.costo)) || 'Sin Costo',
            oferta: new Intl.NumberFormat('es-MX', {
              style: 'currency',
              currency: 'MXN',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(parseFloat(item.oferta)) || 'Sin Oferta',
            almacenes: item.almacenes || {},
          }));
          setProductos(productosFormateados);
        } else {
          setError('No se encontraron datos.');
        }
      })
      .catch((err) => {
        setError('Error al obtener los datos.');
        console.error(err);
      });
  }, []);

  // Si hay error, se muestra el mensaje.
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Si no hay productos aún, se muestra el mensaje de carga.
  if (productos.length === 0) {
    return <div>Cargando productos...</div>;
  }

  // Se calcula el número total de páginas para la paginación.
  const totalPaginas = Math.ceil(productos.length / filasPorPagina);

  // Se obtienen los productos que deben mostrarse en la página actual.
  const productosVisibles = productos.slice(
    (paginaActual - 1) * filasPorPagina,
    paginaActual * filasPorPagina
  );

  // Se retorna el contenido visual de la página.
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto pt-24 px-6 pb-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Stock y Precios por Producto
        </h1>

        {/* Tabla que muestra los datos de productos */}
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
            <thead className="bg-[#1B9CFC] text-white">
              <tr>
                <th className="px-4 py-3 text-left">Referencia</th>
                <th className="px-4 py-3 text-left">Existencia Total</th>
                <th className="px-4 py-3 text-left">Costo</th>
                <th className="px-4 py-3 text-left">Oferta</th>
                <th className="px-4 py-3 text-left">Almacenes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {productosVisibles.map((producto, index) => (
                <tr key={index} className="hover:bg-gray-50 transition duration-200">
                  <td className="px-4 py-2">{producto.referencia}</td>
                  <td className="px-4 py-2">{producto.existencia}</td>
                  <td className="px-4 py-2">{producto.costo}</td>
                  <td className="px-4 py-2">{producto.oferta}</td>
                  <td className="px-4 py-2">
                    {/* Se muestra un select para visualizar almacenes */}
                    <select
                      defaultValue=""
                      onChange={(e) => e.target.value = ""}
                      className="w-full text-sm border rounded px-2 py-1 cursor-pointer"
                    >
                      <option value="" disabled>
                        Ver Almacenes
                      </option>
                      {Object.entries(producto.almacenes).map(([clave, data]) => (
                        <option key={clave} value={clave}>
                          Nombre: {data.nombre} | Clave: {clave} | Stock: {data.stock}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {/* Si no hay productos visibles, se muestra un mensaje */}
              {productosVisibles.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500 py-4">
                    No hay productos para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Controles de paginación y selección de filas por página */}
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
