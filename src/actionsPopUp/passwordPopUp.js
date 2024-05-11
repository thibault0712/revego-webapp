import { toast } from 'react-toastify';
import { motion } from "framer-motion";


const PasswordPopUp = ( setPopUp, loginData, setIsConnected ) => {
    const handleConfirmButtonClick = async () => {
        const inputPasswordValue = document.getElementById("inputPassword").value;
        const password = await loginData.password
        if (inputPasswordValue === password){
            toast.success("Connexion réussi !")
            setPopUp(null);
            setIsConnected(true)
        }else{
            document.getElementById("inputPassword").value = ""
            toast.error("Erreur : Mot de passe incorect")
        }
    }
    return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-80 z-50"
          onClick={() => setPopUp(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-lg shadow-lg p-6 w-4/5 md:w-2/5 h-auto overflow-auto flex flex-col no-scrollbar"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4 text-center text-black">Connexion</h2>
            <input
              id="inputPassword"
              type="password"
              placeholder="Mot de passe"
              className="border border-gray-300 rounded-md px-3 py-2 mb-4"
            />
            <div className='flex self-end mt-2'>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="bg-red-500 hover:bg-red-600 mr-4 text-white font-bold py-2 px-4 rounded-md transition duration-300"
                onClick={() => setPopUp(null)}
              >
                Fermer
              </motion.button>
              <motion.button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
            onClick={() => handleConfirmButtonClick()}
          >
            Confirmer
          </motion.button>
            </div>
          </motion.div>
        </motion.div>
    );
};

export default PasswordPopUp;
