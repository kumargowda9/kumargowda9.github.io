
<!-- FILE: products.js -->
// products.js — initial product list. Admin can add custom products (stored in localStorage under 'customProducts').
const initialProducts = [
  {id:'p1',name:'Wireless Headphones',price:1999,img:'https://images.unsplash.com/photo-1585386959984-a415522c4e17?auto=format&fit=crop&w=1000&q=60',category:'Electronics',description:'Noise-cancelling over-ear headphones with great bass.'},
  {id:'p2',name:'Smart Watch',price:2499,img:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=60',category:'Accessories',description:'Water resistant with step and heart tracking.'},
  {id:'p3',name:'Running Shoes',price:2999,img:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=60',category:'Footwear',description:'Lightweight shoes engineered for comfort.'},
  {id:'p4',name:'Backpack',price:1599,img:'https://images.unsplash.com/photo-1593032465175-481ac7f401f0?auto=format&fit=crop&w=1000&q=60',category:'Bags',description:'Durable travel backpack with laptop compartment.'}
];

function getCustomProducts(){
  try { return JSON.parse(localStorage.getItem('customProducts')||'[]') } catch(e){ return [] }
}
function saveCustomProduct(p){
  const list=getCustomProducts(); list.unshift(p); localStorage.setItem('customProducts',JSON.stringify(list));
}
function clearCustomProducts(){ localStorage.removeItem('customProducts') }
function getAllProducts(){ return [...getCustomProducts().reverse(), ...initialProducts] }
function getProductById(id){ if(!id) return null; return getAllProducts().find(x=>String(x.id)===String(id)) }