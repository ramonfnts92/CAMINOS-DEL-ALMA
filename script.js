"use strict";
const nav=document.querySelector('nav');
const toggle=document.querySelector('.mobile-toggle');
function closeMenu(){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir menú');}
toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
const sections=[...document.querySelectorAll('main section[id]')];
const links=[...nav.querySelectorAll('a[href^="#"]')];
function updateNav(){let current=sections[0].id;for(const section of sections){if(section.getBoundingClientRect().top<=150)current=section.id;}for(const link of links){if(link.getAttribute('href')==='#'+current)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');}}
window.addEventListener('scroll',updateNav,{passive:true});updateNav();
