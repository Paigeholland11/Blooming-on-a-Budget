// MOBILE MENU
const menu = document.querySelector(".menu");
const nav = document.querySelector("#navigation");

menu.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") !== "true";

  menu.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("open", open);
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
  });
});

// SELECT THE RELEVANT INQUIRY OPTION
document.querySelectorAll("[data-goal]").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector("#goal").value = link.dataset.goal;
  });
});

// CURRENT COPYRIGHT YEAR
document.querySelector("#year").textContent = new Date().getFullYear();

// CREATE THE INQUIRY MESSAGE
function buildInquiry(data) {
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const goal = String(data.get("goal") || "");
  const preference = String(data.get("preference") || "");

  const message =
    String(data.get("message") || "").trim() ||
    "I’d love to learn more about getting started.";

  return (
    `Hi Alysia! My name is ${name}. ` +
    `I’m interested in: ${goal}.\n\n` +
    `${message}\n\n` +
    `I’d prefer to connect through: ${preference}.` +
    (email ? `\nMy email is ${email}.` : "") +
    "\n\nCould you share more about the next steps?"
  );
}

// CREATE A TEXTING LINK
function smsLink(message, userAgent = navigator.userAgent) {
  const apple = /iPhone|iPad|iPod|Macintosh/i.test(userAgent);
  const separator = apple ? "&" : "?";

  return (
    `sms:+13869836369${separator}body=` +
    encodeURIComponent(message)
  );
}

// OPEN THE INQUIRY IN THE VISITOR'S TEXTING APP
document.querySelector("#inquiry").addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(event.target);
  const message = buildInquiry(data);
  const link = smsLink(message);

  document.querySelector("#draft-text").value = message;
  document.querySelector("#text-again").href = link;
  document.querySelector("#draft").hidden = false;
  document.querySelector("#copy-status").textContent = "";

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  document.querySelector("#draft").scrollIntoView({
    behavior: reducedMotion ? "auto" : "smooth",
    block: "nearest"
  });

  // This opens a draft only. The visitor must tap Send.
  window.location.href = link;
});

// COPY FALLBACK FOR COMPUTERS OR DEVICES WITHOUT TEXTING
document.querySelector("#copy").addEventListener("click", async () => {
  const messageField = document.querySelector("#draft-text");
  const status = document.querySelector("#copy-status");

  try {
    await navigator.clipboard.writeText(messageField.value);

    status.textContent =
      "Copied. You can paste this into a message to Alysia.";
  } catch {
    messageField.focus();
    messageField.select();

    status.textContent =
      "Select and copy the message above, then text it to (386) 983-6369.";
  }
});