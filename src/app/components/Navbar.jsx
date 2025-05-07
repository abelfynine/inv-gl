// Se indica que este componente debe ejecutarse en el cliente (navegador).
"use client";

// Se importa el componente Link de Next.js para la navegación entre páginas.
import Link from "next/link";

// Se define y exporta el componente Navbar.
export default function Navbar() {
    return (
        <nav className="bg-black text-white shadow fixed w-full top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">

                {/* Menú alineado a la derecha */}
                <div className="flex space-x-10 ml-auto mr-10">
                    {/* Enlace al componente/página de Inicio */}
                    <Link href="/inicio" className="hover:text-gray-300 transition duration-300">
                        Inicio
                    </Link>
                    {/* Enlace al componente/página de Productos */}
                    <Link href="/productos" className="hover:text-gray-300 transition duration-300">
                        Productos
                    </Link>
                    {/* Enlace al componente/página de Stocks y Precios */}
                    <Link href="/stocksprecios" className="hover:text-gray-300 transition duration-300">
                        Stocks y Precios
                    </Link>
                </div>

            </div>
        </nav>
    );
}
