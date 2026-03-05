import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import admin from "firebase-admin";

// 🔢 Generar número único
async function generateUniqueNumber() {
  let number = 0;
  let exists = true;

  while (exists) {
    number = Math.floor(1000 + Math.random() * 9000);

    const raffleRef = db.collection("raffleNumbers").doc(number.toString());
    const raffleDoc = await raffleRef.get();

    if (!raffleDoc.exists) {
      exists = false;

      await raffleRef.set({
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  }

  return number;
}

export async function POST(req: Request) {
  try {

    const { sellerId, name, dni, edad, email, phone } = await req.json();

    if (!sellerId || !name || !dni || !edad) {
      return NextResponse.json({
        success: false,
        error: "Faltan datos obligatorios",
      });
    }

    const promoterRef = db.collection("promoters").doc(sellerId);
    const promoterDoc = await promoterRef.get();

    // 🧑‍💼 crear promotor si no existe
    if (!promoterDoc.exists) {
      await promoterRef.set({
        dni: sellerId,
        totalParticipants: 0,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // 📊 contar participantes
    const participantsSnapshot = await promoterRef
      .collection("participants")
      .get();

    if (participantsSnapshot.size >= 50) {
      return NextResponse.json({
        success: false,
        error: "Este promotor ya alcanzó el máximo de 50 participantes",
      });
    }

    // 🔍 validar DNI duplicado
    const existingParticipant = await promoterRef
      .collection("participants")
      .where("dni", "==", dni)
      .get();

    if (!existingParticipant.empty) {
      return NextResponse.json({
        success: false,
        error: "Este DNI ya está registrado con este promotor",
      });
    }

    const raffleNumber = await generateUniqueNumber();

    // 👤 guardar participante
    await promoterRef.collection("participants").add({
      name,
      dni,
      edad,
      email: email || "",
      phone: phone || "",
      raffleNumber,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // ➕ sumar participante al promotor
    await promoterRef.update({
      totalParticipants: admin.firestore.FieldValue.increment(1),
    });

    // 📧 cola de email
    if (email) {
      await db.collection("emailQueue").add({
        email,
        name,
        raffleNumber,
        status: "pending",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    return NextResponse.json({
      success: true,
      raffleNumber,
    });

  } catch (error) {

    console.error("ERROR REGISTER:", error);

    return NextResponse.json({
      success: false,
      error: "Error en el servidor",
    });

  }
}