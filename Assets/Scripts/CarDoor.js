#pragma strict

var playerInVehicle : boolean = false;
var playerInRange : boolean = false;

var Char : GameObject;
var Car : GameObject;
var Cam : Camera;
var CarCam : Camera;

var CamTarget1 : Transform;
var CamTarget2 : Transform;

function Awake(){
	//Car.GetComponent(Vehicle).enabled = false;
}

function Start (){
	
}
function Update (){
	if (playerInVehicle == true){
		ParkingBrakeOff();
	}
	else if (playerInVehicle == false){
		ParkingBrakeOn();
	}
	if (Input.GetKey("escape")){
		Application.Quit();
	}
	
	Controls();
}
function OnTriggerStay(other : Collider){
	
	if (other.gameObject.name == "Character"){
		playerInRange = true;
	}
}

function OnTriggerExit(other : Collider){
	
	if (other.gameObject.name == "Character"){
		playerInRange = false;
	}
}


function Controls(){
	
	if (playerInRange == true){
		if (Input.GetKeyDown("e")){
			if (playerInVehicle == false){
				playerInVehicle = true;
				Char.SetActive(false);
				Char.transform.parent = gameObject.transform;
				
				//Car.GetComponent(AudioSource).enabled = true;
				Car.GetComponent(CarEngine).enabled = true;
				
				//Cam.GetComponent(MouseOrbit).target = CamTarget2;
				// Disable mouse cam, and enable car cam.
				CarCam.GetComponent(CarCamera).car = CamTarget2;
				CarCam.GetComponent(CarCamera).enabled = true;
			}
	else if (playerInVehicle == true){// && Car.GetComponent(Vehicle).currentSpeed <= 0.5 && Car.GetComponent(Vehicle).currentSpeed >= -0.5){
				playerInVehicle = false;
				Car.GetComponent(CarEngine).enabled = false;
				//Car.GetComponent(AudioSource).enabled = false;
							
				Char.SetActive(true);
				Char.transform.parent = null;
				Char.transform.position.y += 0.10;
				Char.transform.rotation.x = 0.00;
				Char.transform.rotation.y = Car.transform.rotation.y;
				Char.transform.rotation.z = 0.00;
			}
		}		
	}
}

function OnGUI () {
    GUI.Box (new Rect (Screen.width - 100,Screen.height - 50,100,30), "DEBUG BUILD");
}

function ParkingBrakeOn(){
	/*Car.GetComponent(CarEngine).wheelFL.brakeTorque = 100;
	Car.GetComponent(CarEngine).wheelFR.brakeTorque = 100;
	Car.GetComponent(CarEngine).wheelRL.brakeTorque = 100;
	Car.GetComponent(CarEngine).wheelRR.brakeTorque = 100;*/
}
function ParkingBrakeOff(){
	/*Car.GetComponent(CarEngine).wheelFL.brakeTorque = 0;
	Car.GetComponent(CarEngine).wheelFR.brakeTorque = 0;
	Car.GetComponent(CarEngine).wheelRL.brakeTorque = 0;
	Car.GetComponent(CarEngine).wheelRR.brakeTorque = 0;*/
}