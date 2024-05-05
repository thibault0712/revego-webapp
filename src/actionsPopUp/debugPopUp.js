import { motion } from "framer-motion";

const DebugPopup = (setPopUp, debugMessages) => {
    // Simulons des actions reçues par une télécommande

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-80 z-50" onClick={() => setPopUp(null)}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 }} className="bg-white rounded-lg shadow-lg p-4 w-4/5 h-4/5 flex flex-col" onClick={(event) => event.stopPropagation()}>
          <h2 className=" mb-4 text-center text-2xl font-bold text-black">Terminal de débogage</h2>
          {/* Affichage des actions reçues */}
          <div className="bg-gray-800 px-3 py-2 rounded-lg overflow-auto h-full mb-2 flex flex-col-reverse">
            {debugMessages.map((debugMessage, index) => (
              <p key={index} className="text-gray-100">{debugMessage}</p>
            ))}
          </div>
          {/* Bouton "Fermer" en dehors de la div contenant les actions */}
          <div className="flex justify-end mt-auto">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-16 rounded-md transition duration-300"
              onClick={() => setPopUp(null)}
            >
              Fermer
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
}
export default DebugPopup;
