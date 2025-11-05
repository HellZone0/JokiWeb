// ======= Konfigurasi dasar =======
const WHATSAPP_NUMBER = "6282120158690"; // ganti sesuai nomor admin WA
const pricing = { "1":15000,"3":40000,"7":90000,"14":170000,"30":350000 };

// ======= Utilitas =======
const $ = (sel,ctx=document)=>ctx.querySelector(sel);
const $$ = (sel,ctx=document)=>Array.from(ctx.querySelectorAll(sel));

// Format Rupiah
const fmtIDR = n => new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR'}).format(n);

// Toast kecil
function showToast(msg){
  const toast = $('#toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'),3000);
}

// ======= Tema gelap/terang =======
(function(){
  const root=document.documentElement;
  const saved=localStorage.getItem('theme');
  if(saved)root.dataset.theme=saved;
  $('#themeToggle').addEventListener('click',()=>{
    const cur=root.dataset.theme;
    const next=cur==='light'?'dark':'light';
    root.dataset.theme=next;localStorage.setItem('theme',next);
  });
})();

// ======= Update harga realtime =======
function updatePrices(){
  const dur=$('#duration').value;
  $$('[data-price]').forEach(p=>{
    const base=pricing[dur];
    p.textContent=fmtIDR(base);
  });
}
$('#duration').addEventListener('change',updatePrices);
updatePrices();

// ======= Build link WhatsApp =======
function buildWhatsAppLink(number,payload){
  const msg =
`Halo Admin, saya ingin order Joki AFK Fish It.
———
Paket: ${payload.name}
Durasi: ${payload.durasi} hari
Qty: ${payload.qty}
Username/IGN: ${payload.ign}
Server/Platform: ${payload.server||'-'}
Catatan: ${payload.note||'-'}
Metode Pembayaran: ${payload.pay}
Total: ${fmtIDR(payload.total)}
Waktu: ${new Date().toLocaleString('id-ID')}
Order ID: AFK-${Date.now()}-${Math.random().toString(36).slice(2,6).toUpperCase()}
———
Mohon konfirmasinya, terima kasih!`;
  return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
}

// ======= Handle tombol Buy =======
$$('.btn-buy').forEach(btn=>{
  btn.addEventListener('click',e=>{
    const card=btn.closest('.card');
    const form=$('form',card);
    const dur=$('#duration').value;
    const base=pricing[dur];
    const qty=+form.qty.value||1;
    const total=base*qty;

    const payload={
      name:card.dataset.name,
      durasi:dur,qty,
      ign:form.ign.value.trim(),
      server:form.server.value.trim(),
      note:form.note.value.trim(),
      pay:form.pay.value,
      total
    };
    if(!payload.ign){showToast('Isi Username/IGN terlebih dahulu');return;}
    const link=buildWhatsAppLink(WHATSAPP_NUMBER,payload);
    showToast('Membuka WhatsApp…');
    setTimeout(()=>window.open(link,'_blank'),400);
  });
});

// ======= Chat Admin tombol =======
$('#chatAdmin').addEventListener('click',e=>{
  e.preventDefault();
  const text="Halo Admin, saya ingin konsultasi seputar Joki AFK Fish It.";
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,'_blank');
});

// ======= Scroll reveal animasi =======
const io=new IntersectionObserver(entries=>{
  entries.forEach(en=>{
    if(en.isIntersecting){en.target.classList.add('
