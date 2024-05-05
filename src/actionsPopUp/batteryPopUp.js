import { toast } from 'react-toastify';
import { motion } from "framer-motion";

const BatteryPopup = ( setPopUp, batteryTrailer, batteryRemote, usageCharacteristic, delayCharacteristic, delayValue, setDelayValue, usageValue, setUsageValue ) => {
  const handleConfirmButtonClick = async () => {
    try {
      const delayInputValue = parseInt(document.getElementById('delay').value, 10);
      const usageInputValue = parseInt(document.getElementById('usage').value, 10);
  
      if (!isNaN(delayInputValue) && delayInputValue >= 0 && delayInputValue <= 2000) {
        setDelayValue(delayInputValue);
        await delayCharacteristic.writeValue(Uint16Array.of(delayInputValue));
      } else {
        toast.error("Veuillez entrer une valeur valide pour le délai (entre 0 et 2000).");
        return;
      }
  
      if (!isNaN(usageInputValue) && usageInputValue >= 0 && usageInputValue <= 100) {
        setUsageValue(usageInputValue);
        // Attendre 1 seconde avant d'envoyer la deuxième donnée
        setTimeout(async () => {
          await usageCharacteristic.writeValue(Uint8Array.of(usageInputValue));
          toast.success("Changement appliqué avec succès !");
          setPopUp(null);
        }, 1000);
      } else {
        toast.error("Veuillez entrer une valeur valide pour l'utilisation moteur (entre 0 et 100).");
        return;
      }
    } catch (error) {
      toast.error("Oops, erreur inconnue...");
      console.error(error);
    }
  };

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-80 z-50" onClick={() => setPopUp(null)}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 }} className="bg-white rounded-lg shadow-lg p-6 w-4/5 md:w-auto h-4/5 overflow-auto flex flex-col no-scrollbar" onClick={(event) => event.stopPropagation()}>
          <h2 className="text-2xl font-bold mb-4 text-center text-black">Informations sur les batteries</h2>
          <div className="flex flex-wrap mx-auto items-center justify-center ">
            <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-between mb-4 md:mx-6 shadow-md">
              <div>
                <h3 className="text-lg font-semibold mb-1">Télécommande</h3>
                <p className="text-3xl font-bold mb-1">{batteryRemote}%</p>
                <div className="flex flex-col">
                  <p className="text-sm">Temps restant : 1h30</p>
                  <p className="text-sm">Économisateur : 2h30</p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center ml-8">
                <div className="h-28 w-6 bg-blue-500 rounded-lg overflow-hidden">
                  <div style={{ height: `${100 - batteryRemote}%` }} className="bg-gray-200"></div>
                </div>
                <p className="text-xs font-semibold mt-2 text-center">Niveau de batterie</p>
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-between mb-4 md:mx-6 shadow-md">
              <div>
                <h3 className="text-lg font-semibold mb-1">Remorque</h3>
                <p className="text-3xl font-bold mb-1">{batteryTrailer}%</p>
                <div className="flex flex-col">
                  <p className="text-sm">Temps restant : 1h30</p>
                  <p className="text-sm">Économisateur : 2h30</p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center ml-8">
                <div className="h-28 w-6 bg-blue-500 rounded-lg overflow-hidden">
                  <div style={{ height: `${100 - batteryTrailer}%` }} className="bg-gray-200"></div>
                </div>
                <p className="text-xs font-semibold mt-2 text-center">Niveau de batterie</p>
              </div>
            </div>
          </div>
  
          <h2 className="text-2xl font-bold mb-4 text-center text-black mt-6">Économisateur de batteries</h2>
          <div className="max-w-md mx-auto p-6 bg-gray-100 rounded-lg shadow-md mb-4">
            <div className="space-y-4">
              <div className="flex items-center">
                <label htmlFor="delay" className="mr-2 text-gray-700">
                  Délai entre l'envoi des données :
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="delay"
                    defaultValue={delayValue}
                    className="w-20 py-2 pl-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    />
                  <span className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-600">ms</span>
                </div>
              </div>
              <div className="flex items-center">
                <label htmlFor="usage" className="mr-2 text-gray-700">
                  Utilisation maximale du moteur :
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="usage"
                    defaultValue={usageValue}
                    className="w-20 py-2 pl-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                  <span className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-600">%</span>
                </div>
              </div>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleConfirmButtonClick()} className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-md focus:outline-none">
                Confirmer
              </motion.button>
            </div>
          </div>
  
          {/* Bouton "Fermer" */}
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 self-end mt-4"
            onClick={() => setPopUp(null)}
          >
            Fermer
          </motion.button>
        </motion.div>
      </motion.div>
    );
  };
  
  export default BatteryPopup;
  