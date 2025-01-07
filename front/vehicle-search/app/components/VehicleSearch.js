"use client"

import React, { useState } from "react";
import axios from "axios";

const VehicleSearch = () => {
  const [plate, setPlate] = useState(""); // État pour la plaque
  const [vehicleData, setVehicleData] = useState(null); // État pour les données
  const [error, setError] = useState(""); // État pour les erreurs
  const [loading, setLoading] = useState(false); // État pour le spinner

  const handleSearch = async () => {
    setError("");
    setVehicleData(null);
    setLoading(true); // Activer le spinner

    if (!plate) {
      setLoading(false);
      setError("Veuillez entrer une plaque d'immatriculation !");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/vehicle/${plate}`);
      setVehicleData(response.data);
    } catch (err) {
      setError("Erreur lors de la récupération des données.");
    } finally {
      setLoading(false); // Désactiver le spinner
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-white mb-6 text-center">
          Rechercher un véhicule
        </h1>

        {/* Champ d'entrée */}
        <div className="mb-4">
          <input
            type="text"
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
            placeholder="Entrez une plaque d'immatriculation"
            className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Bouton Rechercher */}
        <div className="text-center">
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Rechercher
          </button>
        </div>

        {/* Spinner pendant le chargement */}
        {loading && (
          <div className="flex justify-center mt-4">
            <svg
              className="animate-spin h-6 w-6 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.964 7.964 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}

        {/* Erreur */}
        {error && (
          <p className="text-red-500 text-center mt-4">
            {error}
          </p>
        )}

        {/* Résultats */}
        {vehicleData && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-white mb-4 text-center">
              Informations du véhicule
            </h2>
            <p className="text-gray-300">
              <strong>Nom :</strong> {vehicleData.carName}
            </p>
            <p className="text-gray-300">
              <strong>Détails :</strong> {vehicleData.carDetails}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleSearch;
