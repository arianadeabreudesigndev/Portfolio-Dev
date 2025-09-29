emailjs.init("sD4tM5rhfzPmWW5KN");

const form = document.getElementById("contact-form");

form.addEventListener("submit", function(event) {
  event.preventDefault();
  
  emailjs.sendForm("service_1wm80rl", "template_hugu3a9", this)
    .then(function() {
      alert("Mensagem enviada com sucesso!");
      form.reset();
    }, function(error) {
      alert("Erro ao enviar a mensagem. Tente novamente.");
      console.log("EmailJS Error:", error);
    });
});