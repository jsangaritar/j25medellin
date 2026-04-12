import admin from "firebase-admin";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Load .env manually for the script
const envPath = resolve(import.meta.dirname, "..", ".env");
const envContent = readFileSync(envPath, "utf-8");
const serviceAccountRaw = envContent
  .split("\n")
  .find((l) => l.startsWith("FIREBASE_SERVICE_ACCOUNT_KEY="));
if (!serviceAccountRaw) {
  console.error("FIREBASE_SERVICE_ACCOUNT_KEY not found in .env");
  process.exit(1);
}
const serviceAccountJson = serviceAccountRaw
  .replace("FIREBASE_SERVICE_ACCOUNT_KEY=", "")
  .trim();

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceAccountJson)),
});

const db = admin.firestore();

async function main() {
  const snapshot = await db.collection("events").get();
  let updated = 0;

  const defaultLocation = "Casa Sobre la Roca - Medellín";

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const title = (data.title ?? "").toLowerCase();
    const updates: Record<string, string> = {};

    // Auto-assign image based on title
    if (title.includes("la mesa") && data.imageUrl !== "/images/la-mesa.png") {
      updates.imageUrl = "/images/la-mesa.png";
    } else if (
      title.includes("la sala") &&
      data.imageUrl !== "/images/la-sala.png"
    ) {
      updates.imageUrl = "/images/la-sala.png";
    }

    updates.location = defaultLocation;

    if (Object.keys(updates).length > 0) {
      await db.collection("events").doc(doc.id).update(updates);
      console.log(
        `Updated "${data.title}" →`,
        Object.entries(updates)
          .map(([k, v]) => `${k}: ${v}`)
          .join(", "),
      );
      updated++;
    }
  }

  console.log(`\nDone. Updated ${updated} of ${snapshot.size} events.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
