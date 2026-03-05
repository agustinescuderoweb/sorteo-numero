"use client";

import { useState } from "react";

export default function Registro() {
  const [form, setForm] = useState({
    sellerId: "",
    name: "",
    dni: "",
    edad: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        setSuccessMessage(
          `🎉 Registro exitoso! N° de sorteo: ${data.raffleNumber}`
        );

        // 🔄 Limpiar formulario
        setForm({
          sellerId: "",
          name: "",
          dni: "",
          edad: "",
          email: "",
          phone: "",
        });
      } else {
        setErrorMessage(data.error || "Ocurrió un error");
      }
    } catch (error) {
      setErrorMessage("Error de conexión con el servidor");
    }

    setLoading(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold text-center text-black">
          Registro de Participante
        </h1>

        {/* 🔵 PROMOTOR */}
        <div className="flex flex-col gap-3">
          <h2 className="text-gray-600 font-semibold">Promotor</h2>

          <input
            name="sellerId"
            value={form.sellerId}
            onChange={handleChange}
            placeholder="DNI Promotor"
            required
            className="border p-2 rounded text-black"
          />
        </div>

        {/* 🟢 PARTICIPANTE */}
        <div className="flex flex-col gap-3">
          <h2 className="text-gray-600 font-semibold">Participante</h2>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nombre"
            required
            className="border p-2 rounded text-black"
          />

          <input
            name="dni"
            value={form.dni}
            onChange={handleChange}
            placeholder="DNI Participante"
            required
            className="border p-2 rounded text-black"
          />

          <input
            name="edad"
            value={form.edad}
            onChange={handleChange}
            placeholder="Edad"
            required
            className="border p-2 rounded text-black"
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            type="email"
            className="border p-2 rounded text-black"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Teléfono"
            className="border p-2 rounded text-black"
          />
        </div>

        {/* 🟡 MENSAJES */}
        {successMessage && (
          <div className="bg-green-100 text-green-700 p-3 rounded text-sm">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-3 rounded text-sm">
            {errorMessage}
          </div>
        )}

        {/* 🔘 BOTÓN */}
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white p-3 rounded hover:bg-gray-800 transition"
        >
          {loading ? "Registrando..." : "Registrar"}
        </button>
      </form>
    </div>
  );
}