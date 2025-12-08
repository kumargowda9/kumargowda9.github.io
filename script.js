
<!-- FILE: script.js -->
// script.js — site logic: render products, cart handling (localStorage)
(function(){
  // Set year
  document.querySelectorAll('#year,#year2,#year3,#year4').forEach(el=>{ if(el) el.textContent=new Date().getFullYear() });

  function renderHomeProducts(){
    const grid=document.getElementById('productsGrid'); if(!grid) return;
    grid.innerHTML='';
    getAllProducts().forEach(p=>{
      const card=document.createElement('div'); card.className='card';
      card.innerHTML=`<img src="${p.img}"><div class="card-content"><h3>${escapeHtml(p.name)}</h3><div class="price">₹${p.price}</div><p class="muted">${escapeHtml(p.category||'')}</p><div style="margin-top:10px;display:flex;gap:8px;"><a class="btn" href="product.html?id=${encodeURIComponent(p.id)}">View</a><button data-id="${p.id}" class="btn primary add-now">Add to Cart</button></div></div>`;
      grid.appendChild(card);
    });
    document.querySelectorAll('.add-now').forEach(b=>b.addEventListener('click', (e)=>{ addProductToCart(e.target.getAttribute('data-id'),1); updateCartCountUi(); }));
  }

  function escapeHtml(str){ return String(str||'').replace(/[&<>"']/g, function(s){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[s]}); }

  // Cart functions
  function readCart(){ try { return JSON.parse(localStorage.getItem('cart')||'{}') } catch(e){ return {} } }
  function writeCart(c){ localStorage.setItem('cart', JSON.stringify(c)) }
  window.addProductToCart = function(id,qty){ if(!id) return; const c=readCart(); const key=String(id); const q = Math.max(1, parseInt(qty)||1); if(c[key]) c[key].qty+=q; else { const p=getProductById(id); if(!p) return; c[key]={id:p.id,name:p.name,price:p.price,img:p.img,qty:q} } writeCart(c); }
  function removeFromCart(id){ const c=readCart(); delete c[String(id)]; writeCart(c); }
  function updateQty(id,qty){ const c=readCart(); if(!c[id]) return; if(qty<=0) delete c[id]; else c[id].qty=qty; writeCart(c); }

  window.updateCartCountUi = function(idElem){ const c=readCart(); const count=Object.values(c).reduce((s,i)=>s+i.qty,0); const el=document.getElementById(idElem||'cartCount'); if(el) el.textContent=count; }

  window.renderCartPage = function(){
    const area=document.getElementById('cartArea'); if(!area) return;
    const c=readCart(); const items=Object.values(c);
    if(items.length===0){ area.innerHTML='<div class="notice">Your cart is empty. <a href="index.html">Continue shopping</a></div>'; document.getElementById('cartSummary').innerHTML=''; updateCartCountUi(); return; }
    area.innerHTML='';
    const table=document.createElement('div'); table.className='card';
    items.forEach(it=>{
      const row=document.createElement('div'); row.style.display='flex'; row.style.padding='10px'; row.style.alignItems='center'; row.innerHTML=`<img src="${it.img}" style="width:100px;height:70px;object-fit:cover;border-radius:8px;margin-right:12px"><div style="flex:1"><strong>${escapeHtml(it.name)}</strong><div class="muted">Price: ₹${it.price}</div><div style="margin-top:8px">Qty: <input type="number" min="1" value="${it.qty}" data-id="${it.id}" class="qty-input" style="width:70px"></div></div><div><button data-id="${it.id}" class="btn" style="margin-bottom:6px">Remove</button></div>`;
      table.appendChild(row);
    });
    area.appendChild(table);
    // Summary
    const sum=document.getElementById('cartSummary'); const total=items.reduce((s,i)=>s+i.price*i.qty,0);
    sum.innerHTML=`<div class="card" style="padding:12px"><div><strong>Subtotal: ₹${total}</strong></div><div style="margin-top:10px"><a href="payment.html" class="btn primary">Proceed to Payment</a> <button id="clearCartBtn" class="btn">Clear Cart</button></div></div>`;
    // events
    document.querySelectorAll('.qty-input').forEach(inp=>inp.addEventListener('change', (e)=>{ const id=e.target.getAttribute('data-id'); const q=parseInt(e.target.value,10)||1; updateQty(id,q); renderCartPage(); updateCartCountUi(); }));
    document.querySelectorAll('button[data-id]').forEach(b=>b.addEventListener('click', (e)=>{ removeFromCart(e.target.getAttribute('data-id')); renderCartPage(); updateCartCountUi(); }));
    document.getElementById('clearCartBtn').addEventListener('click', ()=>{ if(confirm('Clear cart?')){ localStorage.removeItem('cart'); renderCartPage(); updateCartCountUi(); } });
    updateCartCountUi();
  }

  // Expose functions
  window.getProductById = getProductById;
  window.getAllProducts = getAllProducts;
  window.saveCustomProduct = saveCustomProduct;
  window.clearCustomProducts = clearCustomProducts;

  // Bootstrap
  if (document.getElementById('productsGrid')) renderHomeProducts();
  updateCartCountUi();
})();
