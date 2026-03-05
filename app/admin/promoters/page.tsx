"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

type Promoter = {
  id: string;
  totalParticipants?: number;
};

export default function PromotersPage() {
  const [promoters, setPromoters] = useState<Promoter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/promoters")
      .then((res) => res.json())
      .then((data) => {
        setPromoters(data);
        setLoading(false);
      });
  }, []);

  const descargarExcel = () => {
    const dataFormateada = promoters.map((p) => ({
      DNI: p.id,
      "Total Participantes": p.totalParticipants || 0,
      Estado:
        (p.totalParticipants || 0) > 0
          ? "Activo"
          : "Sin participantes",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataFormateada);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Promotores");

    XLSX.writeFile(workbook, "promotores.xlsx");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Cargando promotores...
      </div>
    );

  return (
    <div className="flex justify-center min-h-screen bg-gray-50 p-10">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Promotores Registrados
          </h1>

          <button
            onClick={descargarExcel}
            className="w-40 bg-black text-white px-4 py-2 rounded-lg hover:opacity-80 transition m-5"
          >
            Descargar Excel
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                <th className="text-left px-6 py-4">DNI</th>
                <th className="text-left px-6 py-4">
                  Total Participantes
                </th>
                <th className="text-left px-6 py-4">Estado</th>
              </tr>
            </thead>
            <tbody>
              {promoters.map((promoter) => (
                <tr
                  key={promoter.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {promoter.id}
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    {promoter.totalParticipants || 0}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-semibold ${
                        (promoter.totalParticipants || 0) > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {(promoter.totalParticipants || 0) > 0
                        ? "Activo"
                        : "Sin participantes"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          Total promotores: {promoters.length}
        </div>
      </div>
    </div>
  );
}