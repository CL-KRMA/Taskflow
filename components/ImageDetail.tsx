"use client";

import React, { useState } from "react";

export interface Image {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
}

interface ImageDetailProps {
  image: Image;
  onUpdate: (id: string, editData: Omit<Image, "_id">) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
}

const ImageDetail: React.FC<ImageDetailProps> = ({ image, onUpdate, onDelete, onCancel }) => {
  const [editData, setEditData] = useState<Omit<Image, "_id">>({
    name: image.name,
    description: image.description,
    imageUrl: image.imageUrl,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ marginTop: "20px", padding: "15px", border: "1px solid #444" }}>
      <h2>{image.name}</h2>
      <img
        src={image.imageUrl}
        alt={image.name}
        style={{ width: "100%", borderRadius: "8px", marginBottom: "10px" }}
      />
      <input
        type="text"
        name="name"
        value={editData.name}
        onChange={handleChange}
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <textarea
        name="description"
        value={editData.description}
        onChange={handleChange}
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <input
        type="url"
        name="imageUrl"
        value={editData.imageUrl}
        onChange={handleChange}
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => onUpdate(image._id, editData)}>Modifier</button>
        <button onClick={() => onDelete(image._id)}>Supprimer</button>
        <button onClick={onCancel}>Annuler</button>
      </div>
    </div>
  );
};

export default ImageDetail;
