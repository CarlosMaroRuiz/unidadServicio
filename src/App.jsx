// App.js con AlertProvider integrado
import React from "react";
import NavBar from "./components/navBar";
import BusinessUnitForm from "./components/BusinessUnitForm";
import { AlertProvider } from "./providers/AlertContainer";

function App() {
  return (
    <AlertProvider>
      <main className="w-full px-10 py-8 flex flex-col">
        <NavBar />
        <div className="flex mt-8">
          <p className="text-[#D5D5D5] font-semibold text-sm">Inicio/</p>
          <p className="text-[#F26400] font-semibold text-sm">Administración de clientes</p>
        </div>
        <h1 className="font-black text-3xl mb-6">Unidad de negocio</h1>
        
        {/* Agregamos nuestro formulario que ahora usa el sistema de alertas */}
        <BusinessUnitForm />
      </main>
    </AlertProvider>
  );
}

export default App;