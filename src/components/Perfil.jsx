import Perfiluser from "../../public/img/user_img.png"
import off from "../../public/img/off.png"

const Perfil = () =>{

    return <div className="flex text-black items-center gap-x-4 text-xl">
      <p>juan Hernandez</p>
      <img src={Perfiluser} alt="" />
      <img src={off} alt="" />
    </div>
}

export default Perfil