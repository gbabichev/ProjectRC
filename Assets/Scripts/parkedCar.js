#pragma strict

// This scripts checks if the Engine script is on.
// If it's not, put on the parking brake!

var carObject : GameObject;
var theCar : CarEngine;

function Awake(){
	theCar = carObject.GetComponent(CarEngine);
}

function Update () {
	if (theCar.enabled == false){
		theCar.wheelFL.brakeTorque = 30;
		theCar.wheelFR.brakeTorque = 30;
		theCar.wheelRL.brakeTorque = 30;
		theCar.wheelRR.brakeTorque = 30;
	}
}

function FixedUpdate ()
{
	theCar.wheelFRM.Rotate(theCar.wheelFR.rpm/60*360*Time.deltaTime,0,0);
	theCar.wheelFLM.Rotate(theCar.wheelFL.rpm/60*360*Time.deltaTime*-1,0,0);
	theCar.wheelRRM.Rotate(theCar.wheelRR.rpm/60*360*Time.deltaTime,0,0);
	theCar.wheelRLM.Rotate(theCar.wheelRL.rpm/60*360*Time.deltaTime,0,0);
}