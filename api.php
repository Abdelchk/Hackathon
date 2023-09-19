<?php

use DateTime;

header("Access-Control-Allow-Origin: *");
// Autres en-têtes CORS facultatifs
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

// Connexion à la base de données (ajustez les paramètres en fonction de votre configuration)
$serveur = "localhost:3307";
$utilisateur = "root";
$motDePasse = "AC95";
$baseDeDonnees = "ensitech-web";

$connexion = new mysqli($serveur, $utilisateur, $motDePasse, $baseDeDonnees);

// Vérifier la connexion
if ($connexion->connect_error) {
    die("Erreur de connexion à la base de données : " . $connexion->connect_error);
}

// Récupérer les données JSON de la demande
$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData);

$userMessage = $data->userMessage;
$now = new DateTime();
$currentTimestamp = $now->format('Y-m-d H:i:s');
$matchedPair = $data->matchedPair;


// Préparez et exécutez la requête d'insertion
$requete = "INSERT INTO messages (date_heure_message, question, reponse) VALUES (?, ?, ?)";
$statement = $connexion->prepare($requete);
$statement->bind_param("sss", $currentTimestamp, $userMessage, $matchedPair);



if ($statement->execute()) {
    echo json_encode(array("status" => "success", "message" => "Message enregistré avec succès dans la base de données."));
} else {
    echo json_encode(array("status" => "error", "message" => "Erreur lors de l'enregistrement du message : " . $statement->error));
}

// Fermer la connexion
$statement->close();
$connexion->close();
?>
