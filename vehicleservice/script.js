/* ===============================
LOAD VEHICLES
================================ */
let vehicles = JSON.parse(localStorage.getItem("vehicles")) || [];

/* ===============================
CO3 - QUEUE (Vehicles waiting)
================================ */
let serviceQueue = [];

function enqueue(vehicle){
    serviceQueue.push(vehicle);
}

function dequeue(){
    if(serviceQueue.length === 0){
        alert("No vehicles in queue");
        return;
    }

    const vehicle = serviceQueue.shift();
    alert("Processing: " + vehicle.model);
}

/* ===============================
CO2 - LINKED LIST (Service History)
================================ */

class Node{
    constructor(data){
        this.data = data;
        this.next = null;
    }
}

class LinkedList{

    constructor(){
        this.head = null;
    }

    insert(data){
        const newNode = new Node(data);

        if(!this.head){
            this.head = newNode;
            return;
        }

        let temp = this.head;

        while(temp.next){
            temp = temp.next;
        }

        temp.next = newNode;
    }

    traverse(){
        let temp = this.head;

        while(temp){
            console.log(temp.data);
            temp = temp.next;
        }
    }

}

let serviceHistory = new LinkedList();

/* ===============================
CO4 - HASH MAP
================================ */

let vehicleMap = new Map();

/* ===============================
CAR LOGOS
================================ */

const carLogos = {

    "toyota": "https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_carlogo.svg",
    "bmw": "https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg",
    "audi": "https://upload.wikimedia.org/wikipedia/commons/9/92/Audi-Logo_2016.svg",
    "mercedes": "https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg",
    "ford": "https://upload.wikimedia.org/wikipedia/commons/3/3e/Ford_logo_flat.svg"

};

/* ===============================
ADD VEHICLE
================================ */

function addVehicle(){

    const ownerInput = document.getElementById("ownerName");
    const modelInput = document.getElementById("vehicleName");

    if(!ownerInput || !modelInput) return;

    const owner = ownerInput.value.trim();
    const model = modelInput.value.trim();

    if(!owner || !model){
        alert("Please fill all fields");
        return;
    }

    const vehicle = {
        owner: owner,
        model: model,
        status: "Pending"
    };

    vehicles.push(vehicle);

    enqueue(vehicle); 
    vehicleMap.set(owner.toLowerCase(), vehicle); 

    localStorage.setItem("vehicles", JSON.stringify(vehicles));

    ownerInput.value = "";
    modelInput.value = "";

    displayVehicles();

    alert("Vehicle Added 🚗");
}

/* ===============================
DISPLAY VEHICLES
================================ */

function displayVehicles(list = vehicles){

    const container = document.getElementById("vehicleContainer");

    if(!container) return;

    container.innerHTML = "";

    list.forEach((v,index)=>{

        let logo = "https://upload.wikimedia.org/wikipedia/commons/6/6e/Car_icon.png";

        const modelLower = v.model.toLowerCase();

        for(let brand in carLogos){
            if(modelLower.includes(brand)){
                logo = carLogos[brand];
                break;
            }
        }

        container.innerHTML += `
        <div class="vehicle-card">

            <img src="${logo}" class="car-logo">

            <p><strong>${v.model}</strong></p>
            <p>Owner: ${v.owner}</p>
            <p>Status: ${v.status}</p>

            <button onclick="completeService(${index})">Mark Completed</button>
            <button onclick="deleteVehicle(${index})">Delete</button>

        </div>
        `;
    });

}

/* ===============================
COMPLETE SERVICE
================================ */

function completeService(index){

    vehicles[index].status = "Completed";

    serviceHistory.insert(vehicles[index]);

    localStorage.setItem("vehicles", JSON.stringify(vehicles));

    displayVehicles();
}

/* ===============================
DELETE VEHICLE
================================ */

function deleteVehicle(index){

    vehicles.splice(index,1);

    localStorage.setItem("vehicles", JSON.stringify(vehicles));

    displayVehicles();
}

/* ===============================
SORTING
================================ */

function sortVehiclesByOwner(){

    vehicles.sort((a,b)=>a.owner.localeCompare(b.owner));

    displayVehicles();
}

function sortVehiclesByVehicle(){

    vehicles.sort((a,b)=>a.model.localeCompare(b.model));

    displayVehicles();
}

/* ===============================
SEARCH
================================ */

function searchVehicleByOwner(){

    const name = prompt("Enter owner name");

    if(!name) return;

    const result = vehicles.filter(
        v => v.owner.toLowerCase().includes(name.toLowerCase())
    );

    if(result.length > 0){
        displayVehicles(result);
    }
    else{
        alert("No vehicle found");
    }

}

/* ===============================
TYPING EFFECT
================================ */

const typingElement = document.querySelector(".typing-text");

if(typingElement){

    const text = "Smart Garage Dashboard";

    let i = 0;

    function typeEffect(){

        if(i < text.length){

            typingElement.innerHTML += text.charAt(i);

            i++;

            setTimeout(typeEffect,60);

        }

    }

    typeEffect();

}

/* ===============================
INITIAL LOAD
================================ */

if(document.getElementById("vehicleContainer")){
    displayVehicles();
}