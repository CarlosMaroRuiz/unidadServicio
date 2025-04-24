import logo from "../../public/img/logo.png"
import Linkeables from "./linkeables"
import Perfil from "./Perfil"
const NavBar = () =>{
   
    return <nav className="w-full flex justify-between items-center">
       <img src={logo} alt="" className="h-10 flex-shrink-0"/>
       {/*parte de enlace */}
       <section className="flex items-center gap-x-8">
            <Linkeables/>
             <Perfil/>
       </section>
  
    </nav>
}

export default NavBar