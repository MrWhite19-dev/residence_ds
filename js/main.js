/* RÉSIDENCE DS — menu mobile, formulaire WhatsApp et année du pied de page */
document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".main-nav");

  if (menuButton && navigation) {
    const closeMenu = () => {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Ouvrir le menu");
      navigation.classList.remove("is-open");
    };

    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Ouvrir le menu" : "Fermer le menu");
      navigation.classList.toggle("is-open", !isOpen);
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (!navigation.contains(event.target) && !menuButton.contains(event.target)) {
        closeMenu();
      }
    });
  }

  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  const form = document.querySelector("#booking-form");
  if (!form) return;

  const arrival = form.querySelector("#arrival");
  const departure = form.querySelector("#departure");
  const error = document.querySelector("#form-error");
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);

  arrival.min = localToday;
  departure.min = localToday;

  arrival.addEventListener("change", () => {
    departure.min = arrival.value || localToday;
    if (departure.value && arrival.value && departure.value < arrival.value) {
      departure.value = "";
    }
    error.textContent = "";
  });

  departure.addEventListener("change", () => {
    error.textContent = "";
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    error.textContent = "";

    if (!form.reportValidity()) return;

    if (departure.value <= arrival.value) {
      error.textContent = "La date de départ doit être postérieure à la date d’arrivée.";
      departure.focus();
      return;
    }

    const data = new FormData(form);
    const fullName = String(data.get("fullname") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const arrivalDate = formatDate(String(data.get("arrival") || ""));
    const departureDate = formatDate(String(data.get("departure") || ""));
    const guests = String(data.get("guests") || "");
    const room = String(data.get("room") || "");
    const message = String(data.get("message") || "").trim();

    const lines = [
      "Bonjour RÉSIDENCE DS, je souhaite faire une demande de réservation.",
      "",
      `Nom complet : ${fullName}`,
      `Téléphone : ${phone}`,
      `Date d’arrivée souhaitée : ${arrivalDate}`,
      `Date de départ souhaitée : ${departureDate}`,
      `Nombre de personnes : ${guests}`,
      `Type de logement souhaité : ${room}`,
      message ? `Précisions : ${message}` : "",
      "",
      "Merci de me confirmer les disponibilités et les tarifs."
    ].filter(Boolean);

    const whatsappUrl = `https://wa.me/2250576046084?text=${encodeURIComponent(lines.join("\n"))}`;
    const openedWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    if (!openedWindow) {
      window.location.href = whatsappUrl;
    }
  });

  function formatDate(value) {
    if (!value) return "";
    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
  }
});
