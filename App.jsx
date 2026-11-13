import {useEffect,useState} from 'react'
import {sb,SHOPS,LABEL,ICON,Logo,toast,upload,off} from './lib'
const STEPS=['Pending','Accepted','Out for Delivery','Delivered'],STEP_TXT=['Order Placed','Rider Assigned','Out for Delivery','Delivered']
export default function App(){
const[splash,setSplash]=useState(true),[prods,setProds]=useState([]),[shops,setShops]=useState({}),[cart,setCart]=useState({}),[cat,setCat]=useState('All'),[q,setQ]=useState(''),[open,setOpen]=useState(false),[banner,setBanner]=useState(''),[done,setDone]=useState(null),[loc,setLoc]=useState(localStorage.loc||'Set your area')
useEffect(()=>{setTimeout(()=>setSplash(false),2000)
const load=async()=>{const[p,s,b]=await Promise.all([sb.from('products').select('*').order('id'),sb.from('shop_settings').select('*'),sb.from('app_settings').select('*').eq('key','banner').maybeSingle()]);setProds(p.data||[]);setShops(Object.fromEntries((s.data||[]).map(x=>[x.shop_name,x])));setBanner(b.data?.value||'')}
load();const ch=sb.channel('pub').on('postgres_changes',{event:'*',schema:'public',table:'shop_settings'},load).on('postgres_changes',{event:'*',schema:'public',table:'products'},load).subscribe();return()=>{sb.removeChannel(ch)}},[])
const isOpen=s=>shops[s]?.is_open!==false
const add=(p,d)=>{setCart(c=>{const n={...c,[p.id]:Math.max(0,(c[p.id]||0)+d)};if(!n[p.id])delete n[p.id];return n});if(d>0)toast('Added to cart')}
const lines=prods.filter(p=>cart[p.id]).map(p=>({...p,qty:cart[p.id]}))
const count=lines.reduce((a,l)=>a+l.qty,0),total=lines.reduce((a,l)=>a+l.qty*l.selling_price,0)
const list=prods.filter(p=>(cat==='All'||p.shop_name===cat)&&p.name.toLowerCase().includes(q.toLowerCase()))
if(splash)return <div className="fixed inset-0 bg-gradient-to-b from-yellow-300 to-green-500 grid place-items-center text-center"><div><div style={{animation:'ride 1s ease-out'}}><div style={{animation:'pop .8s'}} className="inline-block"><Logo size={140}/></div></div><h1 className="text-4xl font-extrabold text-green-900 mt-4">Apna Bazaar</h1><p className="text-green-900 font-medium mt-1">Fast Local Delivery in 10-15 Mins</p></div></div>
if(done)return <Done gid={done} onBack={()=>setDone(null)}/>
return <div className="max-w-md mx-auto pb-28 min-h-screen bg-white">
<header className="sticky top-0 z-30 bg-gradient-to-r from-yellow-300 to-green-400 p-3 shadow">
<div className="flex items-center gap-2"><Logo size={40}/><div className="flex-1 leading-tight"><b className="text-green-900 text-lg">Apna Bazaar</b><div className="text-xs font-semibold text-green-900">⚡ Delivery in 10-15 mins</div></div>
<button className="text-xs bg-white/70 rounded-full px-3" onClick={()=>{const a=prompt('Your delivery area?',loc);if(a){setLoc(a);localStorage.loc=a}}}>📍 {loc}</button></div>
<input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search products…" className="w-full mt-2 rounded-xl px-4 bg-white"/></header>
{banner&&<div className="m-3 p-3 rounded-xl bg-green-100 text-green-800 text-sm font-semibold">{banner}</div>}
<div className="grid grid-cols-2 gap-3 px-3">{SHOPS.map(s=><button key={s} onClick={()=>setCat(cat===s?'All':s)} className={`relative rounded-2xl p-4 text-left border-2 min-h-24 ${cat===s?'border-green-600 bg-green-50':'border-gray-200 bg-yellow-50'}`}><div className="text-3xl">{ICON[s]}</div><div className="font-bold text-sm">{LABEL[s]}</div>{!isOpen(s)&&<span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">CLOSED</span>}</button>)}</div>
<div className="px-3 mt-3"><button onClick={()=>setCat('All')} className={`px-5 rounded-full font-semibold ${cat==='All'?'bg-green-600 text-white':'bg-gray-100'}`}>All</button></div>
<div className="grid grid-cols-2 gap-3 p-3">{list.map(p=>{const dis=!isOpen(p.shop_name)||!p.in_stock,n=cart[p.id]||0;return <div key={p.id} className={`border rounded-2xl p-2 flex flex-col ${dis?'opacity-60':''}`}>
<div className="relative"><img src={p.image_url} alt={p.name} className="w-full aspect-square object-cover rounded-xl bg-gray-100"/><span className="absolute top-1 left-1 bg-yellow-300 text-[10px] font-bold px-2 rounded-full">{ICON[p.shop_name]} {p.shop_name}</span>{off(p)>0&&<span className="absolute top-1 right-1 bg-blue-600 text-white text-[10px] font-bold px-1.5 rounded">{off(p)}% OFF</span>}</div>
<div className="font-semibold text-sm mt-1 leading-tight">{p.name}</div><div className="text-xs text-gray-500">{p.unit}</div>
<div className="flex items-end justify-between mt-auto pt-2"><div><b>₹{p.selling_price}</b> {p.mrp>p.selling_price&&<s className="text-xs text-gray-400">₹{p.mrp}</s>}</div>
{!p.in_stock?<span className="text-xs text-red-600 font-bold">Out of stock</span>:n===0?<button disabled={dis} onClick={()=>add(p,1)} className="border-2 border-green-600 text-green-700 font-bold rounded-lg px-4 disabled:border-gray-300 disabled:text-gray-400">ADD</button>:
<div className="flex items-center bg-green-600 text-white rounded-lg font-bold"><button className="w-9" onClick={()=>add(p,-1)}>−</button><span className="w-6 text-center">{n}</span><button className="w-9" onClick={()=>add(p,1)}>+</button></div>}</div></div>})}</div>
{count>0&&<button onClick={()=>setOpen(true)} className="fixed bottom-3 inset-x-3 max-w-md mx-auto z-40 bg-green-600 text-white rounded-2xl p-4 flex justify-between font-bold shadow-xl"><span>{count} item{count>1&&'s'} • ₹{total}</span><span>View Cart ›</span></button>}
{open&&<Cart lines={lines} add={add} isOpen={isOpen} close={()=>setOpen(false)} onDone={g=>{setCart({});setOpen(false);setDone(g)}}/>}</div>}
function Cart({lines,add,isOpen,close,onDone}){
const[code,setCode]=useState(''),[cp,setCp]=useState(null),[f,setF]=useState({name:'',phone:'',address:''}),[rx,setRx]=useState(null),[busy,setBusy]=useState(false)
const by={};lines.forEach(l=>(by[l.shop_name]??=[]).push(l))
const total=lines.reduce((a,l)=>a+l.qty*l.selling_price,0),k=Object.keys(by).length
const fee=total>=199?0:k?15+5*(k-1):0,disc=cp&&total>=cp.min_order_amount?cp.discount_amount:0,grand=total+fee-disc
const closed=Object.keys(by).filter(s=>!isOpen(s))
const apply=async()=>{const{data}=await sb.from('coupons').select('*').eq('code',code.trim().toUpperCase()).eq('is_active',true).maybeSingle();if(!data)return toast('Invalid coupon');if(total<data.min_order_amount)return toast(`Min order ₹${data.min_order_amount}`);setCp(data);toast('Coupon applied')}
const place=async()=>{if(closed.length)return toast(`${closed.join(', ')} closed — remove items`);if(!f.name||f.phone.length<10||!f.address)return toast('Fill name, 10-digit mobile & address')
setBusy(true);const gid='AB'+Date.now().toString(36).toUpperCase()
const rows=Object.entries(by).map(([s,ls])=>({order_group_id:gid,shop_name:s,customer_name:f.name,phone:f.phone,address:f.address,items_json:ls.map(l=>({name:l.name,unit:l.unit,qty:l.qty,price:l.selling_price})),prescription_url:s==='Medical'?rx:null,total_amount:ls.reduce((a,l)=>a+l.qty*l.selling_price,0),group_total:grand,status:'Pending'}))
const{error}=await sb.from('orders').insert(rows);setBusy(false);if(error)return toast('Order failed');onDone(gid)}
return <div className="fixed inset-0 z-50 bg-black/50 flex justify-end" onClick={close}><div onClick={e=>e.stopPropagation()} className="bg-white w-full max-w-md h-full overflow-y-auto p-4 animate-[pop_.2s]">
<div className="flex justify-between items-center"><h2 className="font-bold text-xl">Your Cart</h2><button onClick={close} className="text-2xl w-11">✕</button></div>
<div className="mt-2 p-3 bg-green-50 rounded-xl text-sm">{total>=199?'🎉 You get FREE delivery!':`Add ₹${199-total} more for FREE delivery`}<div className="h-2 bg-white rounded mt-1"><div className="h-2 bg-green-600 rounded" style={{width:Math.min(100,total/199*100)+'%'}}/></div></div>
{Object.entries(by).map(([s,ls])=><div key={s} className="mt-3"><div className="font-bold bg-yellow-100 rounded-lg px-3 py-1">{ICON[s]} {LABEL[s]} {!isOpen(s)&&<span className="text-red-600 text-xs">(CLOSED)</span>}</div>
{ls.map(l=><div key={l.id} className="flex items-center justify-between py-2 border-b text-sm"><div>{l.name}<div className="text-xs text-gray-500">{l.unit} • ₹{l.selling_price}</div></div><div className="flex items-center gap-2"><div className="flex bg-green-600 text-white rounded-lg font-bold"><button className="w-9" onClick={()=>add(l,-1)}>−</button><span className="w-6 text-center leading-[44px]">{l.qty}</span><button className="w-9" onClick={()=>add(l,1)}>+</button></div><b className="w-12 text-right">₹{l.qty*l.selling_price}</b></div></div>)}</div>)}
{by.Medical&&<div className="mt-3 p-3 border-2 border-dashed rounded-xl"><b className="text-sm">💊 Upload Prescription Photo (optional)</b><input type="file" accept="image/*" capture="environment" className="block mt-1 text-sm" onChange={async e=>{const u=await upload(e.target.files[0]);if(u){setRx(u);toast('Prescription uploaded')}}}/>{rx&&<img src={rx} className="h-20 mt-2 rounded"/>}</div>}
<div className="flex gap-2 mt-3"><input value={code} onChange={e=>setCode(e.target.value)} placeholder="Coupon code" className="flex-1 border rounded-xl px-3 uppercase"/><button onClick={apply} className="bg-yellow-300 font-bold rounded-xl px-4">Apply</button></div>
<div className="mt-3 text-sm space-y-1 bg-gray-50 p-3 rounded-xl"><Row a="Item Total" b={'₹'+total}/><Row a={`Delivery (${k} shop${k>1?'s':''})`} b={fee?'₹'+fee:'FREE'}/>{disc>0&&<Row a={`Coupon ${cp.code}`} b={'−₹'+disc}/>}<div className="border-t pt-1"><Row a={<b>Grand Total</b>} b={<b>₹{grand}</b>}/></div></div>
{['name','phone','address'].map(x=><input key={x} value={f[x]} inputMode={x==='phone'?'numeric':undefined} maxLength={x==='phone'?10:200} onChange={e=>setF({...f,[x]:e.target.value})} placeholder={{name:'Customer Name',phone:'Mobile Number',address:'Full Address'}[x]} className="w-full border rounded-xl px-3 mt-2"/>)}
<button disabled={busy||!lines.length} onClick={place} className="w-full mt-4 bg-green-600 disabled:bg-gray-400 text-white font-bold rounded-2xl py-4">{busy?'Placing…':`Place Order (Cash on Delivery) • ₹${grand}`}</button></div></div>}
const Row=({a,b})=><div className="flex justify-between"><span>{a}</span><span>{b}</span></div>
function Done({gid,onBack}){const[rows,setRows]=useState([])
useEffect(()=>{const l=()=>sb.from('orders').select('*').eq('order_group_id',gid).then(r=>setRows(r.data||[]));l();const ch=sb.channel('t'+gid).on('postgres_changes',{event:'UPDATE',schema:'public',table:'orders',filter:`order_group_id=eq.${gid}`},l).subscribe();return()=>{sb.removeChannel(ch)}},[gid])
const st=Math.min(...rows.map(r=>STEPS.indexOf(r.status)).filter(i=>i>=0),3),rider=rows.find(r=>r.rider_name)?.rider_name
return <div className="max-w-md mx-auto min-h-screen bg-white p-5 text-center"><div className="flex justify-center"><Logo size={80}/></div><h1 className="text-2xl font-extrabold text-green-700 mt-2">Order Confirmed! ✅</h1><p className="text-gray-500">Order ID: <b>{gid}</b></p><p className="text-sm">Pay ₹{rows[0]?.group_total} cash on delivery</p>
<div className="text-left mt-6 space-y-4">{STEP_TXT.map((t,i)=><div key={t} className="flex items-center gap-3"><div className={`w-8 h-8 rounded-full grid place-items-center font-bold ${i<=st?'bg-green-600 text-white':'bg-gray-200'}`}>{i<=st?'✓':i+1}</div><div className={i<=st?'font-bold':'text-gray-400'}>{t}{i===1&&rider&&i<=st?` — ${rider}`:''}</div></div>)}</div>
<button onClick={onBack} className="mt-8 w-full bg-yellow-300 font-bold rounded-2xl py-3">Continue Shopping</button></div>}
                                                    
