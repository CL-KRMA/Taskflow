"use client";

import React, { useEffect, useState } from "react";
import ImageDetail, { Image } from "./ImageDetail";

const ImageList: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  // Récupérer les images depuis l'API Next.js
  useEffect(() => {
    fetch("/api/images")
      .then((res) => res.json())
      .then((data: Image[]) => setImages(data))
      .catch((err) => console.error("Erreur :", err));
  }, []);

  // Mettre à jour une image
  const handleUpdate = async (id: string, editData: Omit<Image, "_id">) => {
    const response = await fetch(`/api/images/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    });
    if (response.ok) {
      const updated = await response.json();
      setImages((prev) =>
        prev.map((img) => (img._id === id ? { ...img, ...editData } : img))
      );
      setSelectedImage(null);
    }
  };

  // Supprimer une image
  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/images/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setImages((prev) => prev.filter((img) => img._id !== id));
      setSelectedImage(null);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto" }}>
      <h2>Liste des images</h2>

      {!selectedImage ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "20px",
          }}
        >
          {images.map((img) => (
            <div
              key={img._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px",
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={() => setSelectedImage(img)}
            >
              <h3>{img.name}</h3>
              <img
                src={img.imageUrl}
                alt={img.name}
                style={{ width: "100%", borderRadius: "6px" }}
              />
            </div>
          ))}
        </div>
      ) : (
        <ImageDetail
          image={selectedImage}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onCancel={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};

export default ImageList;
