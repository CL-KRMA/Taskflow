import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("myDatabase");

    // 🔹 Retourne directement un tableau
    const images = await db.collection("images").find({}).toArray();
    return NextResponse.json(images);
  } catch (error) {
    console.error("Erreur MongoDB :", error);
    // 🔹 Même en cas d’erreur, on renvoie un tableau vide pour éviter le crash
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, imageUrl } = body;

    if (!name || !description || !imageUrl) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("myDatabase");

    const newEntry = {
      name,
      description,
      imageUrl,
      createdAt: new Date(),
    };

    const result = await db.collection("images").insertOne(newEntry);

    return NextResponse.json({ message: "Image ajoutée", id: result.insertedId });
  } catch (error) {
    console.error("Erreur MongoDB :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
