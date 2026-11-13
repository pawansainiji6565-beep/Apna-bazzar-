import {useEffect,useRef,useState} from 'react'
import QRCode from 'qrcode'
import {Logo,logoSrc} from './lib'
export default function QR(){const url=window.location.origin,c=useRef(),[png,setPng]=useState('')
useEffect(()=>{(async()=>{const W=1240,H=1754,cv=c.current;cv.width=W;cv.height=H;const x=cv.getContext('2d');x.fillStyle='#fde047';x.fillRect(0,0,W,H);x.fillStyle='#16a34a';x.fillRect(0,0,W,260);x.fillStyle='#fff';x.textAlign='center'
const img=new Image();img.src=logoSrc;await new Promise(r=>img.onload=r);x.drawImage(img,W/2-160,300,320,320)
x.fillStyle='#14532d';x.font='bold 120px sans-serif';x.fillText('Apna Bazaar',W/2,740);x.font='bold 62px sans-serif';x.fillText('Scan to Order in 10 Minutes',W/2,840)
const q=new Image();q.src=await QRCode.toDataURL(url,{width:700,margin:2});await new Promise(r=>q.onload=r);x.fillStyle='#fff';x.fillRect(W/2-380,900,760,760);x.drawImage(q,W/2-350,930,700,700)
x.fillStyle='#fff';x.font='bold 50px sans-serif';x.fillText('Vegetable • Kirana • Plastic • Medical',W/2,150);x.fillStyle='#14532d';x.font='40px sans-serif';x.fillText(url,W/2,1720);setPng(cv.toDataURL('image/png'))})()},[url])
return <div className="max-w-md mx-auto p-4 text-center"><div className="flex justify-center"><Logo size={60}/></div><h1 className="font-bold text-xl my-2">QR Poster</h1><canvas ref={c} className="w-full border rounded-xl"/>
<a href={png} download="apna-bazaar-qr-poster.png" className="block mt-3 bg-green-600 text-white font-bold rounded-2xl py-4">⬇ Download Poster (1240×1754)</a></div>}
