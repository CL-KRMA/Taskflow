import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

// 🔹 Modifier une image
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params; // ⚠️ on attend params
    const body = await req.json();
    const { name, description, imageUrl } = body;

    const client = await clientPromise;
    const db = client.db("myDatabase");

    const result = await db.collection("images").updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, description, imageUrl } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Image non trouvée" }, { status: 404 });
    }

    return NextResponse.json({ message: "Image modifiée avec succès" });
  } catch (error) {
    console.error("Erreur PUT:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// 🔹 Supprimer une image
export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params; // ⚠️ on attend params

    const client = await clientPromise;
    const db = client.db("myDatabase");

    const result = await db.collection("images").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Image non trouvée" }, { status: 404 });
    }

    return NextResponse.json({ message: "Image supprimée avec succès" });
  } catch (error) {
    console.error("Erreur DELETE:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
