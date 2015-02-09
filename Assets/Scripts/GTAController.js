#pragma strict

var playerInVehicle : boolean = false;
var playerInRange : boolean = false;

var Vehicle : GameObject;
var ObjCamera : Camera;

function Update (){
	if (playerInRange == true){
		if (Input.GetKeyDown("e") && playerInVehicle == false){
			if (playerInVehicle == false){
				playerInVehicle = true;
				transform.parent = Vehicle.transform;
				gameObject.SetActive(false);
				Vehicle.GetComponent(CarEngine).enabled = true;
				ObjCamera.GetComponent(CarCamera).car = Vehicle.transform;
				ObjCamera.GetComponent(CarCamera).enabled = true;
			}
		}		
	}
}

function OnTriggerEnter(vehCol : Collider){
	if (vehCol.gameObject.name == "GTACollider"){
		playerInRange = true;
		// HIERARCHY (within Unity) MATTERS!!!
		Vehicle = vehCol.transform.parent.parent.gameObject;
		}
}

function OnTriggerExit(vehCol : Collider){
	if (vehCol.gameObject.name == "GTACollider"){
		playerInRange = false;
		Vehicle = null;
	}
}