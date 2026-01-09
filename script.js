<script>
let data = JSON.parse(localStorage.getItem("fabricData")||"[]")
let cutEntries = JSON.parse(localStorage.getItem("cutEntries")||"[]") // ⭐ NEW
let current=null, edit=null

data.forEach(d=>{ if(!Array.isArray(d.rolls)) d.rolls=[] })

function saveAll(){
 localStorage.setItem("fabricData",JSON.stringify(data))
 localStorage.setItem("cutEntries",JSON.stringify(cutEntries)) // ⭐ NEW
}

/* ===== LOT SUMMARY ===== */
function loadLot(){
 let map={}
 cutEntries.forEach(c=>{
  if(!map[c.lot]) map[c.lot]={pcs:0,m:0,r:0}
  map[c.lot].pcs+=c.pcs
  map[c.lot].m+=c.meter
  map[c.lot].r+=c.rolls
 })

 lotTable.innerHTML=""
 cutLot.innerHTML='<option value="">Select Lot</option>'

 Object.keys(map).reverse().forEach(l=>{
  let avg = map[l].pcs ? (map[l].m/map[l].pcs).toFixed(2) : ""
  lotTable.innerHTML+=`
   <tr>
    <td>${l}</td>
    <td>${map[l].r}</td>
    <td>${map[l].m.toFixed(2)}</td>
    <td>${map[l].pcs}</td>
    <td>${avg}</td>
    <td>-</td>
   </tr>`
  cutLot.innerHTML+=`<option>${l}</option>`
 })
}

/* ===== CUT ENTRY ===== */
function loadLotCutInfo(){
 let lot=cutLot.value,r=0,m=0
 data.forEach(d=>d.rolls.forEach(x=>{
  if(x.cut && x.lot===lot){ r++; m+=x.meter }
 }))
 cutTotalRoll.value=r
 cutTotalMeter.value=m.toFixed(2)
 calcAvg()
}

function calcAvg(){
 let pcs=+cutPcs.value,mtr=+cutTotalMeter.value
 cutAvg.value=pcs>0?(mtr/pcs).toFixed(2):""
}

function saveCutEntry(){
 if(!cutDate.value||!cutLot.value||!cutPcs.value)
  return alert("Date, Lot aur PCS zaroori hai")

 cutEntries.push({
  date: cutDate.value,
  lot: cutLot.value,
  pcs: +cutPcs.value,
  meter: +cutTotalMeter.value,
  rolls: +cutTotalRoll.value
 })

 cutPcs.value=""; cutAvg.value=""
 saveAll(); loadLot()
 alert("Cut Entry Saved with Date")
}

/* ===== CUT REPORT (DATE WISE REAL) ===== */
function generateCutReport(){
 let f=rFrom.value,t=rTo.value
 if(!f||!t) return alert("Select dates")

 let list = cutEntries.filter(c=>c.date>=f && c.date<=t)

 let html=`<table width="100%">
 <tr><th>Date</th><th>Lot</th><th>Rolls</th>
 <th>Meter</th><th>PCS</th><th>Avg</th></tr>`

 let tr=0,tm=0,tp=0

 list.forEach(c=>{
  let avg=c.pcs?(c.meter/c.pcs).toFixed(2):""
  html+=`<tr>
   <td>${c.date}</td>
   <td>${c.lot}</td>
   <td>${c.rolls}</td>
   <td>${c.meter.toFixed(2)}</td>
   <td>${c.pcs}</td>
   <td>${avg}</td></tr>`
  tr+=c.rolls; tm+=c.meter; tp+=c.pcs
 })

 html+=`<tr style="font-weight:bold">
 <td colspan="2">TOTAL</td>
 <td>${tr}</td>
 <td>${tm.toFixed(2)}</td>
 <td>${tp}</td>
 <td>${tp?(tm/tp).toFixed(2):""}</td></tr></table>`

 reportArea.innerHTML=html
}

window.onload=()=>{
 date.value=new Date().toISOString().split("T")[0]
 cutDate.value=date.value // ⭐ auto today
 loadDashboard()
 refreshPartyDropdown()
}
</script>
