# App Inventario de Productos

Este proyecto es una aplicación web moderna desarrollada con Next.js que permite consultar y visualizar productos, su stock, precios y distribución en almacenes. Incluye un dashboard con gráficas interactivas.

## Características

- Visualización de productos con detalles como SKU, GTIN, precio, categoría, subcategoría, etc.
- Consulta de existencia total, precio normal y precio en oferta por producto.
- Desglose de stock por almacén.
- Dashboard interactivo con gráficas:
  - Costo de productos.
  - Stock por producto.
  - Stock total por almacén.
- Paginación en tablas y gráficos.
- UI moderna con Tailwind CSS.

## Tecnologías Utilizadas

- Next.js: Framework de React para renderizado del lado del servidor.
- React: Biblioteca de JavaScript para construir interfaces de usuario.
- Tailwind CSS: Framework de utilidades CSS para estilos modernos.

## Dependencias Principales

- `next`: Framework de React que facilita el desarrollo de aplicaciones web con renderizado del lado del servidor, enrutamiento automático y optimización.
- `react`: Biblioteca de JavaScript para construir interfaces de usuario mediante componentes reutilizables.
- `react-dom`: Punto de entrada al DOM y a los renderizadores del servidor para React.
- `recharts`: Librería para crear gráficos interactivos en aplicaciones React.
- `dotenv`: Para cargar variables de entorno desde un archivo .env.

## API Utilizada

- API privada de productos y almacenes: `https://apigloma.xentra.com.mx`
