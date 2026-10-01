/* ==========================================================
   KGMTLAKS Portfolio – scripts
   EDIT THESE to your real details (they update on every page):
   ========================================================== */
const CONTACT = {
  email: "info@example.com",
  phone: "+27 00 000 0000"
};

/* ---------- Contact details ---------- */
document.querySelectorAll("[data-mail]").forEach(a=>{a.href="mailto:"+CONTACT.email;a.textContent=CONTACT.email;});
document.querySelectorAll("[data-tel]").forEach(a=>{a.href="tel:"+CONTACT.phone.replace(/\s/g,"");a.textContent=CONTACT.phone;});

/* ---------- Mobile menu ---------- */
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("nav");
toggle.addEventListener("click",()=>{
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded",open);
});
nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");toggle.setAttribute("aria-expanded","false");}));

/* ---------- Lightbox (every .g-item on the page, in order) ---------- */
const items = [...document.querySelectorAll(".g-item")];
const lb = document.getElementById("lightbox");
if(items.length){
  const lbImg = document.getElementById("lb-img"), lbCap = document.getElementById("lb-cap");
  let current = 0;
  const show = ()=>{
    const el = items[current];
    lbImg.src = el.dataset.full; lbImg.alt = el.dataset.alt;
    lbCap.textContent = `${el.dataset.alt}  ·  ${current+1} / ${items.length}`;
  };
  const step = d=>{current=(current+d+items.length)%items.length; show();};
  const openLb = el=>{current=items.indexOf(el); show(); lb.classList.add("open"); lb.setAttribute("aria-hidden","false"); document.body.style.overflow="hidden";};
  const closeLb = ()=>{lb.classList.remove("open"); lb.setAttribute("aria-hidden","true"); document.body.style.overflow=""; lbImg.src="";};
  items.forEach(it=>{
    it.addEventListener("click",()=>openLb(it));
    it.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openLb(it);}});
  });
  lb.querySelector(".lb-close").onclick = closeLb;
  lb.querySelector(".prev").onclick = ()=>step(-1);
  lb.querySelector(".next").onclick = ()=>step(1);
  lb.addEventListener("click",e=>{if(e.target===lb) closeLb();});
  document.addEventListener("keydown",e=>{
    if(!lb.classList.contains("open")) return;
    if(e.key==="Escape") closeLb();
    if(e.key==="ArrowLeft") step(-1);
    if(e.key==="ArrowRight") step(1);
  });
  let tx=null;
  lb.addEventListener("touchstart",e=>tx=e.touches[0].clientX,{passive:true});
  lb.addEventListener("touchend",e=>{if(tx===null)return;const dx=e.changedTouches[0].clientX-tx; if(Math.abs(dx)>50) step(dx<0?1:-1); tx=null;});
}

/* ---------- Contact form (opens the visitor's email app) ---------- */
const form = document.getElementById("contact-form");
if(form){
  const note = document.getElementById("form-note");
  form.addEventListener("submit",e=>{
    e.preventDefault();
    let ok = true;
    form.querySelectorAll("[required]").forEach(f=>{
      const bad = !f.value.trim() || (f.type==="email" && !/^\S+@\S+\.\S+$/.test(f.value));
      f.classList.toggle("err",bad); if(bad) ok=false;
    });
    if(!ok){note.textContent="Please fill in your name, a valid email and a message."; return;}
    const d = Object.fromEntries(new FormData(form));
    const subject = encodeURIComponent(`${d.type} enquiry from ${d.name}`);
    const body = encodeURIComponent(`${d.message}\n\n— ${d.name} (${d.email})`);
    note.textContent = "Opening your email app…";
    window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
  });
}

/* ---------- Scroll reveal + misc ---------- */
document.querySelectorAll(".about>*").forEach(el=>el.classList.add("reveal"));
const io = new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add("in");io.unobserve(en.target);}}),{threshold:.08});
document.querySelectorAll(".reveal").forEach(el=>io.observe(el));
document.getElementById("year").textContent = new Date().getFullYear();
