#!/usr/bin/env python3
"""Regenerates every .html page. Edit the config/data below, then run: python3 build.py"""
import html
PHONE_DISPLAY="+92 323 5952364"; PHONE_TEL="+923235952364"; WA="923235952364"
ADDRESS="Near Bonanza, City Center Qamber, KPK, Pakistan"
ADDRESS_LOC="Near Bonanza, City Center Qamber, Swat, KPK, Pakistan"
SOCIAL={}  # e.g. {"Instagram":"https://instagram.com/yourpage","Facebook":"https://facebook.com/yourpage"}; empty = hidden
UPCOMING=[] # e.g. [{"name":"Item name","desc":"Short description","when":"Coming in November"}]
MAP="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d289.7181436802553!2d72.32012755643457!3d34.76096748563967!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dc2332f714a857%3A0xbc5be368a586dfb2!2sDIP%20N%27%20STICK!5e0!3m2!1sen!2s!4v1791574739705!5m2!1sen!2s"
DIR="https://www.google.com/maps/dir/?api=1&destination=34.760967,72.320128"
HOURS=[("Saturday","11 AM–10 PM",6),("Sunday","11 AM–10 PM",0),("Monday","1 PM–10 PM",1),("Tuesday","1 PM–10 PM",2),("Wednesday","1 PM–10 PM",3),("Thursday","1 PM–10 PM",4),("Friday","3 PM–9 PM",5)]
MENU=[("Corn Dogs","corn-dog",[("Full Cheese",450),("Full Sausage",350),("Half Cheese & Sausage",400)]),
("Croquettes","croquettes",[("5 PCS",280),("8 PCS",350)]),
("Twister Potato","twister-potato",[("Twister Potato",150)]),
("French Fries","french-fries",[("Regular",250),("Large",320)]),
("Nuggets","nuggets",[("5 PCS",300),("8 PCS",380)]),
("Extra Dips","dips",[("Extra Dip",30)]),
("Cans","cans",[("Can",130)])]
POL=[("Please Check Your Order","Please check your items before leaving the counter so we can fix anything right away."),
("Quality Complaints Before Consumption","If something isn’t right, tell us before you eat it and we’ll gladly look into it."),
("Product Fully Consumed","Once a product has been fully consumed, we’re unable to assess a quality concern."),
("Partially Consumed Products","Please keep the product and packaging with you so our team can review the concern fairly."),
("No Refund After Full Consumption","Refunds are not available once an item has been fully eaten."),
("Immediate Reporting","Please report any issue as soon as you notice it so we can help quickly."),
("Preparation Time","Everything is cooked fresh, so a short wait is normal. Busy hours may take a little longer."),
("Allergies & Dietary Requirements","Tell our team about any allergy or dietary need before ordering so we can advise you."),
("Order & Payment","Please check your order and total before paying."),
("Fair Resolution","Every concern is reviewed respectfully, and we aim for a fair outcome for everyone.")]
PAGES=[("index","Home"),("menu","Menu"),("about","About"),("upcoming","Upcoming"),("reviews","Reviews"),("policies","Policies"),("location","Location")]
e=html.escape
def price(p): return f'<b>{p}</b>'
def card(cat,img,items,link=False):
    rows="".join(f'<div class="row"><span>{e(n)}</span><i></i>{price(p)}</div>' for n,p in items)
    return f'<article class="card" data-cat="{e(cat)}"><div class="pic"><img src="assets/images/menu/{img}.webp" alt="{e(cat)}" loading="lazy" width="150" height="150"></div><h3>{e(cat)}</h3>{rows}</article>'
def mblock(cat,img,items,wide=False):
    rows="".join(f'<div class="mrow"><span>{e(n)}</span><i></i>{price(p)}</div>' for n,p in items)
    return f'<article class="mb{" wide" if wide else ""}" data-cat="{e(cat)}"><div class="mpic"><img src="assets/images/menu/{img}.webp" alt="{e(cat)}" loading="lazy"></div><div class="mtx"><h2>{e(cat)}</h2>{rows}</div></article>'
def hours_rows(): return "".join(f'<tr data-day="{d}"><th scope="row">{n}</th><td>{h}</td></tr>' for n,h,d in HOURS)
def hours_tbl(): return f'<table class="hrs"><caption class="sr" hidden>Opening hours</caption><tbody>{hours_rows()}</tbody></table>'
def layout(slug,title,desc,body,h1=None):
    n="".join(f'<li><a href="{s}.html"{" aria-current=\"page\"" if s==slug else ""}>{t}</a></li>' for s,t in PAGES)
    soc="".join(f'<li><a href="{e(u)}" rel="noopener" target="_blank">{e(k)}</a></li>' for k,u in SOCIAL.items())
    ld='<script type="application/ld+json">{"@context":"https://schema.org","@type":"FastFoodRestaurant","name":"DIP N’ STICKS","telephone":"%s","address":{"@type":"PostalAddress","streetAddress":"Near Bonanza, City Center","addressLocality":"Qamber","addressRegion":"KPK","addressCountry":"PK"},"geo":{"@type":"GeoCoordinates","latitude":34.760967,"longitude":72.320128},"openingHours":["Sa-Su 11:00-22:00","Mo-Th 13:00-22:00","Fr 15:00-21:00"]}</script>'%PHONE_TEL if slug=="index" else ""
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{e(title)}</title><meta name="description" content="{e(desc)}"><meta name="theme-color" content="#C8171C">
<meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(desc)}"><meta property="og:type" content="website"><meta property="og:image" content="assets/images/logo.webp">
<link rel="icon" href="favicon.ico" sizes="any"><link rel="icon" type="image/png" href="assets/icons/favicon-32.png"><link rel="apple-touch-icon" href="assets/icons/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;800&family=Oswald:wght@500;600;700&display=swap">
<link rel="stylesheet" href="css/style.css">{ld}</head><body>
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
<symbol id="i-phone" viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></symbol>
<symbol id="i-pin" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></symbol>
<symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></symbol>
<symbol id="i-chat" viewBox="0 0 24 24"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/></symbol>
<symbol id="i-list" viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></symbol>
<symbol id="i-up" viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7"/></symbol>
<symbol id="i-star" viewBox="0 0 24 24"><path d="m12 2 3.1 6.3 6.9 1-5 4.8 1.2 6.9-6.2-3.2-6.2 3.2L7 14.1 2 9.3l6.9-1z"/></symbol>
<symbol id="i-check" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></symbol>
<symbol id="i-alert" viewBox="0 0 24 24"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01"/></symbol>
<symbol id="i-ban" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></symbol>
<symbol id="i-box" viewBox="0 0 24 24"><path d="M21 8v13H3V8M1 3h22v5H1zM10 12h4"/></symbol>
<symbol id="i-card" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></symbol>
<symbol id="i-zap" viewBox="0 0 24 24"><path d="M13 2 3 14h9l-1 8 10-12h-9z"/></symbol>
<symbol id="i-heart" viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/></symbol>
</defs></svg>
<a class="skip" href="#main">Skip to content</a>
<header class="top"><div class="wrap bar"><a class="brand" href="index.html" aria-label="DIP N’ STICKS home"><img src="assets/images/logo.webp" alt="" width="46" height="46">Dip N’ Sticks</a><div class="sp"></div>
<nav id="nav" aria-label="Main"><ul>{n}</ul></nav><a class="btn red hide-m" href="tel:{PHONE_TEL}"><svg class="ic" aria-hidden="true"><use href="#i-phone"/></svg>Call us</a><button class="burger" id="burger" aria-expanded="false" aria-controls="nav" aria-label="Toggle menu">☰</button></div></header>
<main id="main">{body}</main>
<footer><div class="wrap"><div class="g"><div class="fb"><img class="fmas" src="assets/images/logo.webp" alt="" width="96" height="96" decoding="async"><h3>DIP N’ STICKS</h3><p>Crunch • Dip • Stick.<br>Fast food, cooked fresh.</p><p class="badge open-now">Checking…</p><p class="fa"><a class="btn" href="tel:{PHONE_TEL}"><svg class="ic" aria-hidden="true"><use href="#i-phone"/></svg>Call</a><a class="btn red" href="{DIR}" target="_blank" rel="noopener"><svg class="ic" aria-hidden="true"><use href="#i-pin"/></svg>Directions</a></p></div>
<div><h3><svg class="ic" aria-hidden="true"><use href="#i-pin"/></svg>Visit</h3><p>{e(ADDRESS)}</p><p><a href="tel:{PHONE_TEL}">{PHONE_DISPLAY}</a></p></div>
<div><h3><svg class="ic" aria-hidden="true"><use href="#i-clock"/></svg>Hours</h3><p>Sat–Sun: 11 AM–10 PM<br>Mon–Thu: 1 PM–10 PM<br>Fri: 3 PM–9 PM</p></div>
<div><h3><svg class="ic" aria-hidden="true"><use href="#i-list"/></svg>Explore</h3><ul>{n}</ul></div>{f'<div><h3>Follow</h3><ul>{soc}</ul></div>' if soc else ''}</div>
<p class="copy">© DIP N’ STICKS, . All rights reserved.</p></div></footer>
<nav class="mbar" aria-label="Quick actions"><a href="tel:{PHONE_TEL}"><svg class="ic" aria-hidden="true"><use href="#i-phone"/></svg>Call</a><a href="menu.html"><svg class="ic" aria-hidden="true"><use href="#i-list"/></svg>Menu</a><a href="{DIR}" target="_blank" rel="noopener"><svg class="ic" aria-hidden="true"><use href="#i-pin"/></svg>Map</a><a href="https://wa.me/{WA}" target="_blank" rel="noopener"><svg class="ic" aria-hidden="true"><use href="#i-chat"/></svg>Chat</a></nav>
<div class="fab"><button id="top" aria-label="Back to top"><svg class="ic" aria-hidden="true"><use href="#i-up"/></svg></button><a href="https://wa.me/{WA}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp"><svg class="ic" aria-hidden="true"><use href="#i-chat"/></svg></a></div>
<script src="js/config.js"></script><script src="js/site.js"></script>{EXTRA.get(slug,"")}</body></html>'''
EXTRA={"menu":'<script src="js/menu.js"></script>',"reviews":'<script src="js/reviews.js"></script>'}
def head(t,s): return f'<div class="page-h"><div class="wrap"><h1>{t}</h1><p class="sub">{s}</p></div></div>'
pages={}
feat="".join(card(c,i,it) for c,i,it in MENU[:4])
words="".join('<span>Crunch</span><span>•</span><span>Dip</span><span>•</span><span>Stick</span><span>•</span>' for _ in range(6))
pages["index"]=("DIP N’ STICKS — Corn Dogs, Fries & Nuggets","DIP N’ STICKS: corn dogs, croquettes, twister potato, fries and nuggets, cooked fresh. See the menu, hours and location.",f'''
<section class="hero"><div class="wrap"><div class="ht"><p class="badge open-now">Checking…</p><h1><span>Crunch</span><span>Dip</span><span>Stick</span></h1><p class="lead">Corn dogs, twister potatoes and crispy bites, cooked fresh.</p><div class="acts"><a class="btn big cr" href="menu.html"><svg class="ic" aria-hidden="true"><use href="#i-list"/></svg>View the menu</a><a class="btn big" href="location.html"><svg class="ic" aria-hidden="true"><use href="#i-pin"/></svg>Find us</a></div></div>
<div class="stage"><svg viewBox="0 0 400 400" aria-hidden="true"><defs><path id="c" d="M200,200 m-170,0 a170,170 0 1,1 340,0 a170,170 0 1,1 -340,0"/></defs><text><textPath href="#c" textLength="1060" lengthAdjust="spacing">DIP IT • STICK IT • LOVE IT • DIP IT • STICK IT • LOVE IT • </textPath></text></svg><div class="disc"><img src="assets/images/logo.webp" alt="DIP N’ STICKS: a smiling potato mascot wearing a chef hat" width="420" height="420" fetchpriority="high"></div></div></div></section>
<div class="ticker" aria-hidden="true"><div>{words}</div></div>
<section><div class="wrap"><div class="sh"><div><h2>Fan favourites</h2><p class="sub">Sticks and bites made fresh. Prices in PKR.</p></div><a class="btn" href="menu.html">Full menu</a></div><div class="grid fav">{feat}</div></div></section>
<section class="band"><div class="wrap"><div class="sh"><div><h2>Dip it. Stick it. Love it!</h2></div></div><ol class="steps"><li><b>1</b><h3>Dip it</h3><p>Add extra dips to any order for just PKR 30.</p></li><li><b>2</b><h3>Stick it</h3><p>Corn dogs and twister potato, made to hold and made to dip.</p></li><li><b>3</b><h3>Love it</h3><p>Everything is cooked fresh, so a short wait is normal.</p></li></ol></div></section>
<section><div class="wrap two"><div><div class="sh"><h2>Opening hours</h2></div>{hours_tbl()}</div><div><div class="sh"><h2>Find us</h2></div><p class="sub">{e(ADDRESS)}</p><p style="margin:.6rem 0 1.2rem"><a href="tel:{PHONE_TEL}">{PHONE_DISPLAY}</a></p><div class="map"><iframe title="DIP N’ STICKS location on Google Maps" src="{MAP}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div><p style="margin-top:1rem"><a class="btn red" href="{DIR}" target="_blank" rel="noopener"><svg class="ic" aria-hidden="true"><use href="#i-pin"/></svg>Get directions</a></p></div></div></section>
<section class="cta"><div class="wrap"><h2>Been here? Tell us.</h2><p class="sub">Real reviews from real customers.</p><a class="btn big cr" href="reviews.html"><svg class="ic" aria-hidden="true"><use href="#i-star"/></svg>Read &amp; write reviews</a></div></section>''')
chips='<button class="chip" data-f="all" aria-pressed="true">All</button>'+"".join(f'<button class="chip" data-f="{e(c)}" aria-pressed="false">{e(c)}</button>' for c,_,_ in MENU)
pages["menu"]=("Menu — DIP N’ STICKS","Full DIP N’ STICKS menu with prices in PKR: corn dogs, croquettes, twister potato, french fries, nuggets, extra dips and cans.",f'''<div class="mh"><div class="wrap"><h1>Menu</h1><p>Dip it. Stick it. Love it!</p></div></div>
<section class="msec"><div class="wrap"><div class="chips" role="group" aria-label="Filter menu">{chips}</div><div class="board">{"".join(mblock(c,i,it,k==0) for k,(c,i,it) in enumerate(MENU))}</div>
<p class="mnote">All prices in PKR. Allergies or dietary needs? Tell our team before ordering. See our <a href="policies.html">policies</a>.</p></div></section>''')
pages["about"]=("About — DIP N’ STICKS","The story and concept behind DIP N’ STICKS, a fast-food brand built around crispy food you can dip.",head("About","A small idea: crispy food, a stick, and a dip.")+f'''<section><div class="wrap two"><div><h2>Our concept</h2><p class="sub">DIP N’ STICKS is a fast-food brand built around food that’s fun to hold and even better to dip: corn dogs, twister potato, croquettes, fries and nuggets.</p><p class="sub">Everything is cooked fresh, and every order can be finished with extra dips. Our promise is in the line we put on every menu: Dip it. Stick it. Love it!</p></div><img src="assets/images/logo.webp" alt="DIP N’ STICKS mascot: a smiling potato wearing a chef hat" width="360" height="360" style="margin:auto;max-width:320px"></div></section>
<section class="band"><div class="wrap"><h2>The brand</h2><div class="hl"><div><h3>Playful</h3><p>Our smiling potato chef sets the tone: friendly, relaxed, hungry.</p></div><div><h3>Bold</h3><p>Red, yellow and cream, loud like the food.</p></div><div><h3>Simple</h3><p>A short menu done properly, with clear prices.</p></div></div></div></section>''')
up=("".join(f'<article class="card"><h3>{e(u["name"])}</h3><p>{e(u["desc"])}</p><p><b>{e(u["when"])}</b></p></article>' for u in UPCOMING) or f'<div class="empty"><img src="assets/images/logo.webp" alt="" width="110" height="110"><h3>Nothing announced yet</h3><p>New menu items will be announced here first. Call us on <a href="tel:{PHONE_TEL}">{PHONE_DISPLAY}</a> or check back soon.</p></div>')
pages["upcoming"]=("Upcoming — DIP N’ STICKS","Coming-soon products and new menu announcements from DIP N’ STICKS.",head("Upcoming","New products and menu announcements.")+f'<section><div class="wrap"><div class="grid">{up}</div></div></section>')
pages["reviews"]=("Reviews — DIP N’ STICKS","Read what customers say about DIP N’ STICKS and share your own review.",head("Reviews","Tell us how we did.")+'''<section><div class="wrap two"><div><h2>Customer reviews</h2><div id="sum" aria-live="polite"></div><div id="list" aria-live="polite"><p>Loading reviews…</p></div></div>
<div><h2>Write a review</h2><form class="rv card" id="rv" novalidate><div><label for="name">Your name</label><input id="name" name="name" maxlength="40" autocomplete="name" required><div class="err" id="e-name" role="alert"></div></div>
<fieldset class="stars"><legend><b>Rating</b></legend>'''+"".join(f'<input type="radio" name="rating" id="s{i}" value="{i}"><label for="s{i}" title="{i} star{"s" if i>1 else ""}"><span class="sr" hidden>{i} stars</span>★</label>' for i in range(1,6))+'''</fieldset><div class="err" id="e-rating" role="alert"></div>
<div><label for="comment">Your review</label><textarea id="comment" name="comment" rows="5" maxlength="600" required></textarea><div class="err" id="e-comment" role="alert"></div></div>
<button class="btn red" type="submit"><svg class="ic" aria-hidden="true"><use href="#i-star"/></svg>Submit review</button><p id="msg" role="status"></p></form></div></div></section>''')
pages["policies"]=("Policies — DIP N’ STICKS","Order, quality, refund and allergy policies at DIP N’ STICKS.",head("Policies","Simple rules so everyone gets a fair, fast fix.")+f'<section><div class="wrap"><ol class="pol">{"".join(f'<li class=card><span class="pi"><svg class="ic" aria-hidden="true"><use href="#i-{k}"/></svg></span><h3>{e(t)}</h3><p>{e(d)}</p></li>' for (t,d),k in zip(POL,["check","alert","ban","box","ban","zap","clock","alert","card","heart"]))}</ol></div></section>')
pages["location"]=("Location & Hours — DIP N’ STICKS Swat","Find DIP N’ STICKS near Bonanza, City Center Qamber, Swat. Address, phone, opening hours and directions.",head("Location","Near Bonanza, City Center Qamber, Swat.")+f'''<section><div class="wrap two"><div class="map"><iframe title="DIP N’ STICKS location on Google Maps" src="{MAP}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>
<div><h2>Visit us</h2><p class="sub">{e(ADDRESS_LOC)}</p><p style="margin:.8rem 0"><a href="tel:{PHONE_TEL}">{PHONE_DISPLAY}</a></p><p class="badge open-now">Checking…</p>{hours_tbl()}<p style="margin-top:1.2rem;display:flex;gap:.8rem;flex-wrap:wrap"><a class="btn red" href="{DIR}" target="_blank" rel="noopener"><svg class="ic" aria-hidden="true"><use href="#i-pin"/></svg>Get directions</a><a class="btn" href="tel:{PHONE_TEL}"><svg class="ic" aria-hidden="true"><use href="#i-phone"/></svg>Call now</a></p></div></div></section>''')
for s,(t,d,b) in pages.items(): open(f"{s}.html","w",encoding="utf-8").write(layout(s,t,d,b))
open("404.html","w",encoding="utf-8").write(layout("404","Page not found — DIP N’ STICKS","Page not found.",'<section class="nf"><div class="wrap"><h1>404</h1><h2>This stick came off.</h2><p class="sub" style="margin:1rem auto 1.5rem">We couldn’t find that page.</p><a class="btn" href="index.html">Back to home</a> <a class="btn red" href="menu.html">See the menu</a></div></section>').replace('href="index.html"','href="/index.html"').replace('href="css/','href="/css/').replace('href="assets/','href="/assets/').replace('src="assets/','src="/assets/').replace('src="js/','src="/js/'))
