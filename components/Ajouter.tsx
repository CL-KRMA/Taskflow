"use client";

import React, { useState } from "react";

interface FormData {
  name: string;
  description: string;
  imageUrl: string;
}

const Ajouter: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    imageUrl: "",
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Vérification côté JS
    if (!formData.name || !formData.description || !formData.imageUrl) {
      alert("Tous les champs sont requis !");
      return;
    }

    try {
      const response = await fetch("/api/images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Image ajoutée avec succès !");
        console.log("Réponse du serveur :", data);
        // Réinitialiser le formulaire
        setFormData({ name: "", description: "", imageUrl: "" });
      } else {
        alert("Erreur lors de l'envoi des données.");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      alert("Impossible de contacter le serveur.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Ajouter une image par URL</h2>

      <div style={{ marginBottom: "10px" }}>
        <label>
          Nom :
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: "100%" }}
          />
        </label>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>
          Description :
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            style={{ width: "100%" }}
          />
        </label>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>
          URL de l’image :
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            required
            style={{ width: "100%" }}
          />
        </label>
      </div>

      {formData.imageUrl && (
        <div style={{ marginTop: "10px" }}>
          <img
            src={formData.imageUrl}
            alt="Aperçu"
            style={{ width: "100%", borderRadius: "8px" }}
          />
        </div>
      )}

      <button type="submit" style={{ marginTop: "15px" }}>
        Envoyer
      </button>
    </form>
  );
};

export default Ajouter;
