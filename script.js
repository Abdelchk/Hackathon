document.addEventListener('DOMContentLoaded', function () {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const conversation = document.querySelector('.conversation');

    // Tableau de questions et réponses prédéfinies
    const qaPairs = [
        {
            question: "Quel est ton nom ?",
            answer: "Je suis Gilbot, 72 ans et un génie de l'info 😎."
        },
        {
            question: "Quelle est la météo aujourd'hui ?",
            answer: "Je ne peux pas vous donner la météo actuelle."
        },
        {
            question: "Qui est le président actuel ?",
            answer: "Je ne suis pas à jour avec l'actualité politique puis en vrai les rois c'est mieux."
        },
        {
            question: "Comment ça va ?",
            answer: "Je suis une intelligence artificielle, donc je n'ai pas d'émotions, mais je suis là pour vous aider !"
        },
        {
            question: "Quel est le but de la vie ?",
            answer: "Le but de la vie peut varier d'une personne à l'autre, c'est une question philosophique qui n'a pas de réponse unique."
        },
        {
            question: "Quel est ton langage de programmation préféré ?",
            answer: "Je n'ai pas de préférence, mais je suis programmé pour comprendre de nombreux langages de programmation."
        },
        {
            question: "Raconte moi une blague ?",
            answer: "Bien sûr, voici une : Qu'est-ce qui est beige, avec des reflets argentés et qui fait beaucoup de bruit ? Un bébé avec une fourchette dans l'oeil."
        },
        {
            question: "Quelle est la réponse à la grande question de la vie, de l'univers et de tout le reste ?",
            answer: "D'après Douglas Adams dans son livre Le Guide du voyageur galactique, la réponse est 42. Cependant, la question précise est toujours inconnue puis en vrai on s'en fou."
        },
        {
            question: "Peux-tu me donner des conseils pour apprendre la programmation ?",
            answer: "Bien sûr ! Pour apprendre la programmation il te faut un clavier."
        }
        
    ];

    const errorElement = document.getElementById('error-message');

    chatForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const userMessage = userInput.value.trim();

        if (userMessage === "") {
            // Affichez un message d'erreur
            errorElement.textContent = "Veuillez écrire quelque chose avant d'envoyer votre message.";
            return; // Empêche l'envoi du formulaire
        } else {
            // Effacez le message d'erreur s'il y en a un
            errorElement.textContent = "";
        }
        
        // Récupérez l'heure et la date actuelles
        const currentTime = new Date();
        const currentTimeString = currentTime.toLocaleTimeString();
        const currentDate = currentTime.toLocaleDateString();
        
        // Stockez l'heure et la date dans des variables
        const userMessageTime = currentTimeString;
        const userMessageDate = currentDate;

        appendMessage('user', userMessage, userMessageTime, userMessageDate);
        userInput.value = '';

        // Vérifiez si la question de l'utilisateur correspond à l'une des questions prédéfinies
        const matchedPair = qaPairs.find(pair => userMessage.toLowerCase().includes(pair.question.toLowerCase()));

        if (matchedPair) {
            // Si une question correspond, affichez la réponse correspondante
            appendMessage('assistant', matchedPair.answer, currentTimeString, currentDate);
            
            sendFormHttp(userMessage, matchedPair.answer);
        } else {
            // Si aucune correspondance n'a été trouvée, affichez un message par défaut
            appendMessage('assistant', "Je ne peux pas répondre à cette question.", currentTimeString, currentDate);
        
            sendFormHttp(userMessage, "Non reconnus");
        }


    });

    function sendFormHttp(userMessage, matchedPair) {
        // Créez un nouvel objet XMLHttpRequest
        let xhr = new XMLHttpRequest();
    
        // Configurez la demande POST pour votre script PHP (index.php)
        xhr.open('POST', 'api.php', true);
    
        // Configurez l'en-tête HTTP pour envoyer des données JSON
        xhr.setRequestHeader('Content-Type', 'application/json');
    
        // Définissez la fonction à appeler lorsque la demande est terminée
        xhr.onload = function () {
            console.log(xhr)
            if (xhr.status === 200) {
                // La demande s'est terminée avec succès, traitez la réponse JSON
                let response = JSON.parse(xhr.responseText);
    
                if (response.status === 'success') {
                    // Succès, faites quelque chose avec la réponse si nécessaire
                    console.log(response.message);
                } else {
                    // Erreur, affichez le message d'erreur si nécessaire
                    console.error(response.message);
                }
            } else {
                // La demande a échoué, affichez l'erreur si nécessaire
                console.error(`Erreur ${xhr.status}: ${xhr.statusText}`);
            }
        };
    
        // Récupérez les données du formulaire sous forme d'objet JavaScript
        let formData = {
            userMessage: userMessage,
            matchedPair: matchedPair
        };
    
        // Convertissez les données en format JSON
        
    
        // Envoyez la demande avec les données JSON
        xhr.send(JSON.stringify(formData));
    }
    

    function appendMessage(sender, message, time, date) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        messageDiv.innerHTML = `<small>${time} le ${date}</small><p>${message}</p>`;
        conversation.appendChild(messageDiv);
        conversation.scrollTop = conversation.scrollHeight;
    }
    
});