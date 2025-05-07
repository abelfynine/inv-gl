// Se indica que este componente se ejecuta en el cliente (navegador).
"use client";

// Se importa el componente de navegación superior.
import Navbar from "../components/Navbar";
// Se importan hooks de React para manejar estado y efectos.
import React, { useEffect, useState } from "react";
// Se importan componentes de gráficos desde la librería Recharts.
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Se define el componente principal de la página de inicio.
export default function PaginaInicio() {
  // Se crean estados para guardar la información de productos, stock y almacenes.
  const [productos, setProductos] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [almacenData, setAlmacenData] = useState([]);

  // Se utiliza useEffect para cargar los datos desde las APIs cuando el componente se monta.
  useEffect(() => {
    // Se hace una petición a la API de productos
    fetch("/api/productos")
      .then((res) => res.json())
      .then((data) => {
        // Se transforma la respuesta en un arreglo con referencia y costo, y se guarda en el estado.
        const parsed = Object.entries(data).map(([key, item]) => ({
          referencia: item.referencia || key,
          costo: parseFloat(item.costo) || 0,
        }));
        // Se almacena el arreglo transformado en el estado.
        setProductos(parsed);
      });

    // Se obtiene la información de stock por producto y por almacén desde otra API.
    fetch("/api/stocksprecios")
      .then((res) => res.json())
      .then((data) => {
        const parsedStock = [];
        const acumuladoAlmacenes = {};

        // Se recorren los productos y se acumula el stock total y el stock por almacén.
        Object.entries(data).forEach(([key, item]) => {
          parsedStock.push({ referencia: key, existencia: item.existencia || 0 });

          if (item.almacenes) {
            Object.entries(item.almacenes).forEach(([clave, info]) => {
              const nombre = info.nombre?.trim();
              if (nombre) {
                acumuladoAlmacenes[nombre] = (acumuladoAlmacenes[nombre] || 0) + (info.stock || 0);
              }
            });
          }
        });

        // Se transforma el objeto de almacenes a un arreglo para graficar.
        const parsedAlmacenes = Object.entries(acumuladoAlmacenes)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([nombre, total]) => ({
            nombre,
            stock: total
          }));

        setStockData(parsedStock);
        setAlmacenData(parsedAlmacenes);
      });
  }, []);

  // Se definen las variables y funciones para la paginación de la gráfica de productos.
  const [paginaProductos, setPaginaProductos] = useState(1);
  const productosPorPagina = 10;
  const totalPaginasProductos = Math.ceil(productos.length / productosPorPagina);
  const productosVisibles = productos.slice(
    (paginaProductos - 1) * productosPorPagina,
    paginaProductos * productosPorPagina
  );

  // Se definen las variables y funciones para la paginación de la gráfica de stock por producto.
  const [paginaStock, setPaginaStock] = useState(1);
  const totalPaginasStock = Math.ceil(stockData.length / productosPorPagina);
  const stockVisible = stockData.slice(
    (paginaStock - 1) * productosPorPagina,
    paginaStock * productosPorPagina
  );

  // Se retorna el JSX que define la estructura visual de la página de inicio.
  return (
    <div className="bg-white min-h-screen pt-16">
      <Navbar />
      <main className="text-black p-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Gráfica de costo de productos */}
          <div className="bg-gray-50 rounded shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Costo de Productos</h2>
            <ResponsiveContainer width="100%" height={Math.max(300, productosVisibles.length * 25)}>
              <BarChart data={productosVisibles} layout="vertical">
                <XAxis type="number" />
                <YAxis type="category" dataKey="referencia" width={150} />
                <Tooltip />
                <Bar dataKey="costo" fill="#1B9CFC" />
              </BarChart>
            </ResponsiveContainer>
            {/* Controles de paginación para productos */}
            <div className="flex justify-center items-center mt-4 space-x-4">
              <button
                onClick={() => setPaginaProductos((prev) => Math.max(prev - 1, 1))}
                disabled={paginaProductos === 1}
                className={`px-3 py-1 bg-gray-200 rounded ${paginaProductos === 1 ? 'opacity-50' : 'cursor-pointer'}`}
              >
                ← Anterior
              </button>
              <span className="text-sm text-gray-700">
                Página {paginaProductos} de {totalPaginasProductos}
              </span>
              <button
                onClick={() => setPaginaProductos((prev) => Math.min(prev + 1, totalPaginasProductos))}
                disabled={paginaProductos === totalPaginasProductos}
                className={`px-3 py-1 bg-gray-200 rounded ${paginaProductos === totalPaginasProductos ? 'opacity-50' : 'cursor-pointer'}`}
              >
                Siguiente →
              </button>
            </div>
          </div>

          {/* Gráfica de stock por producto */}
          <div className="bg-gray-50 rounded shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Stock por Producto</h2>
            <ResponsiveContainer width="100%" height={Math.max(400, stockVisible.length * 25)}>
              <BarChart data={stockVisible} layout="vertical">
                <XAxis type="number" />
                <YAxis type="category" dataKey="referencia" width={150} />
                <Tooltip />
                <Bar dataKey="existencia" fill="#F97F51" />
              </BarChart>
            </ResponsiveContainer>
            {/* Controles de paginación para stock */}
            <div className="flex justify-center items-center mt-4 space-x-4">
              <button
                onClick={() => setPaginaStock((prev) => Math.max(prev - 1, 1))}
                disabled={paginaStock === 1}
                className={`px-3 py-1 bg-gray-200 rounded ${paginaStock === 1 ? 'opacity-50' : 'cursor-pointer'}`}
              >
                ← Anterior
              </button>
              <span className="text-sm text-gray-700">
                Página {paginaStock} de {totalPaginasStock}
              </span>
              <button
                onClick={() => setPaginaStock((prev) => Math.min(prev + 1, totalPaginasStock))}
                disabled={paginaStock === totalPaginasStock}
                className={`px-3 py-1 bg-gray-200 rounded ${paginaStock === totalPaginasStock ? 'opacity-50' : 'cursor-pointer'}`}
              >
                Siguiente →
              </button>
            </div>


          </div>
        </div>

        {/* Gráfica de stock total por almacén */}
        <div className="mt-12 bg-gray-50 rounded shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Stock Total por Almacén</h2>
          <ResponsiveContainer width="100%" height={Math.max(400, almacenData.length * 25)}>
            <BarChart data={almacenData} layout="vertical">
              <XAxis type="number" />
              <YAxis type="category" dataKey="nombre" width={150} />
              <Tooltip />
              <Bar dataKey="stock" fill="#82589F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
}
