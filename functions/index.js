require("dotenv").config();

const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const { Resend } = require("resend");

admin.initializeApp();

exports.sendEmail = onDocumentCreated(
  "emailQueue/{id}",
  async (event) => {

    const data = event.data.data();
    const docId = event.params.id;

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {

      console.log("Enviando email a:", data.email);

      await resend.emails.send({
        from: "Sorteo <onboarding@resend.dev>",
        to: data.email,
        subject: "🎉 Confirmación de Registro",
        html: `
          <h2>Hola ${data.name} 👋</h2>
          <p>Tu registro fue exitoso.</p>
          <p><strong>Número de sorteo:</strong> ${data.raffleNumber}</p>
          <br/>
          <p>¡Mucha suerte! 🍀</p>
        `,
      });

      await admin.firestore()
        .collection("emailQueue")
        .doc(docId)
        .update({
          status: "sent"
        });

      console.log("Email enviado");

    } catch (error) {

      console.error("Error enviando email:", error);

      await admin.firestore()
        .collection("emailQueue")
        .doc(docId)
        .update({
          status: "error",
          error: error.message
        });

    }

  }
);