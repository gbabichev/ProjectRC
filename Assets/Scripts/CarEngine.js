#pragma strict
/*
Car Mechanics Script
George Babichev
August, 2014
*/
/// Defines wheel colliders
var wheelFR : WheelCollider;
var wheelFL : WheelCollider;
var wheelRR : WheelCollider;
var wheelRL : WheelCollider;
// Defines the game object which wheel model is child of
// I am using a 'sub-model' to align axis so the rotation
// is correct
var wheelFRM : Transform;
var wheelFLM : Transform;
var wheelRRM : Transform;
var wheelRLM : Transform;

// Car Specs
var gear1Torque : int = 500;
var gear2Torque : int = 400;
var gear3Torque : int = 300;
var gear4Torque : int = 200;
var gear5Torque : int = 100;
var gearRTorque : int;
var engineTorque : int;
var currentGear : String;

var brakeTorque = 50;
var topSpeed : float = 200;
var hbTorque : float = 50;
var lowSpeedSteerAngle : float = 40;
var highSpeedSteerAngle : float = 1;
// Game Play Variables
var currentSpeed : float;
var currentSpeedMPH : int;
var handbrake : boolean = false;
var speedLimited : boolean = true;
var startPos : Vector3;
var throttle : float;
var showHelp : boolean = true;
var fuelAmount : double = 100;
var displayFuelAmount : int;

var go : GameObject;


// Friction & Slip - UPDATE VAR NAMES
private var myForwardFriction : float;
private var mySideWayFriction : float;
private var slipSidewayFriction : float;
private var slipForwardFriction : float;

function Awake() {
	// Sets center of mass lower, so car doesnt flip
	rigidbody.centerOfMass.y = -0.9;
	rigidbody.centerOfMass.z = 0.5;
	// Starting position - so we can respawn
	startPos = transform.position;
	// Setting default friction & slip values
	SetValues();
}

function Start() {

//var go = GameObject.Find("Character");
	
}

function SetValues() {
	myForwardFriction = wheelRR.forwardFriction.stiffness;
	mySideWayFriction = wheelRR.sidewaysFriction.stiffness;
	slipForwardFriction = 0.04;
	slipSidewayFriction = 0.2;
}
function FixedUpdate() {
	handBrake();
	// Calculates current speed in KPH & MPH using standard formula
	// MPH Returns an always positive value, since it is the one displayed
	currentSpeed = Mathf.Round(2*22/7*wheelRL.radius*wheelRL.rpm*60/1000);
	currentSpeedMPH = Mathf.Abs(Mathf.Round(currentSpeed * 0.62));
	
	// ENGINE
	
	// If speed limiter is on, disable speed when we hit top speed.
	if (currentSpeedMPH >= topSpeed && speedLimited == true && !handbrake){
		// Do nothing. Do not apply torque.
		engineTorque = 0;
	}
	else if (currentSpeed < -50){
		// Limit Reverse Speed
			engineTorque = 0;
	}
	// If the handbrake is not on, we move forward
	else if(!handbrake) {
		if (currentSpeed > 0 && currentSpeed < 25){
			engineTorque = gear1Torque;
			currentGear = "1";
		}
		else if (currentSpeed > 25 && currentSpeed < 50){
			engineTorque = gear2Torque;
			currentGear = "2";
		}
		else if (currentSpeed > 50 && currentSpeed < 80){
			engineTorque = gear3Torque;
			currentGear = "3";
		}
		else if (currentSpeed > 80 && currentSpeedMPH < 145){
			engineTorque = gear4Torque;
			currentGear = "4";
		}
		else if (currentSpeedMPH > 145){
			engineTorque = gear5Torque;
			currentGear = "5";
		}
		else if (currentSpeed < 0){
			engineTorque = gearRTorque;
			currentGear = "R";
		}
	}
	// Check if there is fuel first
	if (fuelAmount > 0){
		throttle = Input.GetAxis("Vertical") * engineTorque;
	}
	else {
		throttle = 0;
	}
	rigidbody.AddForce(transform.forward * throttle * rigidbody.mass * Time.deltaTime);
	
	// BRAKES
	
	// If the car is not moving, slow down the car 
	// Otherwise, apply regular brakes.
	if (!Input.GetAxis("Vertical") || fuelAmount < 0 && !handbrake){
		// NOT using scripted brake values here because
		// car is supposed to simmulate engine braking
		wheelRR.brakeTorque = 30;
		wheelRL.brakeTorque = 30;	
	}
	else if (Input.GetAxis("Vertical") < 0 && currentSpeedMPH > 5 && currentGear != "R"){
			wheelRR.brakeTorque = brakeTorque;
			wheelRL.brakeTorque = brakeTorque;
			wheelFR.brakeTorque = brakeTorque;
			wheelFL.brakeTorque = brakeTorque;
	}
	else if (Input.GetAxis("Vertical") > 0 && currentSpeed < 0)
	{
			wheelRR.brakeTorque = brakeTorque;
			wheelRL.brakeTorque = brakeTorque;
			wheelFR.brakeTorque = brakeTorque;
			wheelFL.brakeTorque = brakeTorque;
	}
	else if (!handbrake){
		wheelRR.brakeTorque = 0;
		wheelRL.brakeTorque = 0;
		wheelFR.brakeTorque = 0;
		wheelFL.brakeTorque = 0;
	}

	// WHEELS & STEERING
	// Allows the wheels to turn when you press A/D
	//wheelFRM.localEulerAngles.y=-40;
	wheelFRM.localEulerAngles.y = wheelFR.steerAngle - wheelFRM.localEulerAngles.z;
	wheelFLM.localEulerAngles.y = 180 + wheelFL.steerAngle - wheelFLM.localEulerAngles.z;
	// Steering Angle 
	var speedFactor = rigidbody.velocity.magnitude/35;
	var currentSteerAngle = Mathf.Lerp(lowSpeedSteerAngle,highSpeedSteerAngle,speedFactor);
	currentSteerAngle *= Input.GetAxis("Horizontal");
	wheelFL.steerAngle = currentSteerAngle;
	wheelFR.steerAngle = currentSteerAngle;
	
		if (Input.GetAxis("Vertical") != 0 && fuelAmount > 0){
		fuelAmount = fuelAmount - .005;
	}
	displayFuelAmount = Mathf.Abs(Mathf.Round(fuelAmount));
	
}
function Update() {

	if (Input.GetKeyDown("e")){// && currentSpeedMPH < 5){
				// Set that we are not in a vehicle
				go.GetComponent(GTAController).playerInVehicle = false;
				go.GetComponent(GTAController).Vehicle = null;
				// Disable the car
				GetComponent(CarEngine).enabled = false;
				//Car.GetComponent(AudioSource).enabled = false;
				// Enable the FP Character
				
				go.transform.parent = null;
				//go.SetActive(true);
				//go.transform.parent = transform;
				//go.transform.position = Vector3.zero;
				go.transform.position.y += .10;
				//go.transform.position.z += 1;
				go.transform.rotation.x = 0.00;
				go.transform.rotation.y = transform.rotation.y;
				go.transform.rotation.z = 0.00;
				//rigidbody.velocity = Vector3.zero;
				go.SetActive(true);
				//go.transform.parent = null;
				//wheelFL.brakeTorque = 100;
				//wheelFR.brakeTorque = 100;
				//wheelRL.brakeTorque = 100;
				//wheelRR.brakeTorque = 100;
			}
	// Function to check position (Up/Down) of wheels
	WheelSuspensionPosition();
	// Listen to user input
	listenKeys();
}
function WheelSuspensionPosition(){
var hit : RaycastHit;
var wheelPos : Vector3;
	// FL Front Left Wheel
	if (Physics.Raycast(wheelFL.transform.position, -wheelFL.transform.up,hit,wheelFL.radius+wheelFL.suspensionDistance))
	{
		wheelPos = hit.point+wheelFL.transform.up * wheelFL.radius;
	}
	else {
		wheelPos = wheelFL.transform.position - wheelFL.transform.up * wheelFL.suspensionDistance;
	}
	wheelFLM.position = wheelPos;
	// FR Front Right Wheel
	if (Physics.Raycast(wheelFR.transform.position, -wheelFR.transform.up,hit,wheelFR.radius+wheelFR.suspensionDistance))
	{
		wheelPos = hit.point+wheelFR.transform.up * wheelFR.radius;
	}
	else {
		wheelPos = wheelFR.transform.position - wheelFR.transform.up * wheelFR.suspensionDistance;
	}
	wheelFRM.position = wheelPos;
	// RL Rear Left Wheel
	if (Physics.Raycast(wheelRL.transform.position, -wheelRL.transform.up,hit,wheelRL.radius+wheelRL.suspensionDistance))
	{
		wheelPos = hit.point+wheelRL.transform.up * wheelRL.radius;
	}
	else {
		wheelPos = wheelRL.transform.position - wheelRL.transform.up * wheelRL.suspensionDistance;
	}
	wheelRLM.position = wheelPos;
	// RR Rear Right Wheel
	if (Physics.Raycast(wheelRR.transform.position, -wheelRR.transform.up,hit,wheelRR.radius+wheelRR.suspensionDistance))
	{
		wheelPos = hit.point+wheelRR.transform.up * wheelRR.radius;
	}
	else {
		wheelPos = wheelRR.transform.position - wheelRR.transform.up * wheelRR.suspensionDistance;
	}
	wheelRRM.position = wheelPos;
}
// Handbrake function
function handBrake(){
	if (Input.GetButton("Jump")){
		handbrake = true;
	}
	else {
		handbrake = false;
	}
	// Setting handbrake values
	if (handbrake){
		engineTorque = 0;
		wheelRR.brakeTorque = hbTorque;
		wheelRL.brakeTorque = hbTorque;
		// If the wheels are turned, change slip to allow for a slide
		// Otherwise leave slip standard so handbrake actually works 
		if (wheelFR.steerAngle < 0 || wheelFR.steerAngle > 0)
		{
			SetSlip(slipForwardFriction,slipSidewayFriction);
		}
		else {
			SetSlip(myForwardFriction,mySideWayFriction);
		}
	}
	else {
		// Gears get stuck sometimes
		engineTorque = 100;
		SetSlip(myForwardFriction,mySideWayFriction);
	}
}
function SetSlip(currentForwardFriction : float,currentSidewayFriction : float) {
	// Setting slip for the car
	wheelRR.forwardFriction.stiffness = currentForwardFriction;
	wheelRL.forwardFriction.stiffness = currentForwardFriction;
	
	wheelRR.sidewaysFriction.stiffness = currentSidewayFriction;
	wheelRL.sidewaysFriction.stiffness = currentSidewayFriction;

}
function listenKeys(){
	// User hits 'l' key, speed limiter turns on/off
	if (Input.GetKeyDown("l"))
	{
		speedLimited = !speedLimited;
	}
	// User hits 'r' key, position is reset to starting position.
	if (Input.GetKeyDown("r")){
		// Kills velocity
		rigidbody.velocity = Vector3.zero;
		rigidbody.rotation = Quaternion.Euler(0,90,0);
		transform.position=startPos;
	}
	if (Input.GetKeyDown("f1")){
		showHelp = !showHelp;
	}
}
function OnGUI(){
	GUI.contentColor = Color.red;
	GUI.Label(Rect(0,0,Screen.width,Screen.height),"Project RC Alpha 0.5");
	GUI.Label(Rect(0,15,Screen.width,Screen.height),"Speed (MPH):   "+currentSpeedMPH);
	GUI.Label(Rect(0,30,Screen.width,Screen.height),"Current Gear:    "+currentGear);
	GUI.Label(Rect(0,45,Screen.width,Screen.height),"Fuel:     "+displayFuelAmount+" %");

	if (showHelp){
		GUI.Box (Rect(0,80,400,400),"Controls");
		GUI.Label(Rect(0,95,Screen.width,Screen.height),"Show/Hide Menu (Press F1)");
		GUI.Label(Rect(0,115,Screen.width,Screen.height),"Reset (Press r)");
		GUI.Label(Rect(0,135,Screen.width,Screen.height),"Speed Limiter (Press l):  "+speedLimited); 
		GUI.Label(Rect(0,155,Screen.width,Screen.height),"To Quit: Esc");
	}
}
// Collisions
function OnTriggerStay (col : Collider)
{
	// Gas Station - Refueling.
	if(col.gameObject.name == "gasPumpCollider" && Input.GetAxis("getFuel") && currentSpeedMPH == 0 && fuelAmount < 100){
		fuelAmount += .05;
	}
}
