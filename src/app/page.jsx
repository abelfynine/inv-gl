// Se importa el componente principal de la página de inicio desde su ruta correspondiente.
import PagInicio from "../app/inicio/page";

// Se define una función llamada 'page' que representa un componente de página en Next.js.
function page(params) {
  // Este componente retorna el componente de la página de inicio para ser renderizado.
  return (
    <PagInicio />
  );
}

// Se exporta el componente 'page' como exportación por defecto para que Next.js lo utilice como una ruta.
export default page;
