(function(){
  const cfg = window.WEDDING_CONFIG || {};
  // Countdown
  const target = new Date(cfg.datetime || "2025-09-20T15:30:00");
  const dEl = document.getElementById("cd-days");
  const hEl = document.getElementById("cd-hours");
  const mEl = document.getElementById("cd-mins");
  const sEl = document.getElementById("cd-secs");

  function updateCountdown(){
    const now = new Date();
    const diff = target - now;
    if (diff <= 0){
      dEl.textContent = "00"; hEl.textContent ="00"; mEl.textContent="00"; sEl.textContent="00";
      return;
    }
    const secs = Math.floor(diff / 1000);
    const days = Math.floor(secs / (3600*24));
    const hours = Math.floor((secs % (3600*24)) / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    dEl.textContent = String(days).padStart(2,"0");
    hEl.textContent = String(hours).padStart(2,"0");
    mEl.textContent = String(mins).padStart(2,"0");
    sEl.textContent = String(s).padStart(2,"0");
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Add to Calendar (ics file via data URI)
  function buildICS(){
    const start = new Date(cfg.datetime);
    const end = new Date(start.getTime() + (cfg.durationMinutes||120)*60000);
    const dt = (d)=> d.toISOString().replace(/[-:]/g,"").split(".")[0]+"Z";
    const ics =
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding Invite//EN
BEGIN:VEVENT
UID:${Date.now()}@wedding
DTSTAMP:${dt(new Date())}
DTSTART:${dt(start)}
DTEND:${dt(end)}
SUMMARY:${cfg.title||"Wedding"}
DESCRIPTION:${cfg.description||"Join us to celebrate"}
LOCATION:${cfg.location||""}
END:VEVENT
END:VCALENDAR`;
    return "data:text/calendar;charset=utf8," + encodeURIComponent(ics);
  }
  const addToCal = document.getElementById("addToCal");
  if (addToCal){
    addToCal.setAttribute("href", buildICS());
    addToCal.setAttribute("download", "wedding.ics");
  }

  // Enable Google Form embed if provided
  const formFrame = document.querySelector(".form-embed");
  if (formFrame && formFrame.getAttribute("src")){
    const native = document.querySelector(".rsvp-form");
    if (native) native.style.display = "none";
    formFrame.style.display = "block";
  }
})();
