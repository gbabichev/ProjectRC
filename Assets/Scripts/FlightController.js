#pragma strict

// Speed of Rotation
var RotationSpeed : float = 100;
var roll : float = 0;
var pitch : float = 0;
var yaw : float = 0;
var accel : float = 0;
var AddRot : Quaternion = Quaternion.identity;
var speed : float = 0;
var engineToggle : boolean;
var currentSpeed : Vector3;
var showHelp : boolean = true;
var VTOL : float;
var terrainHeight : float;
// This function works for a non rigidbody (no physics) 

function FixedUpdate () {
	// Engines Online, Commander.
	if (engineToggle == true){
		// Flight Controls
		roll = Input.GetAxis("Roll") * (Time.fixedDeltaTime * RotationSpeed);
    	pitch = Input.GetAxis("Pitch") * (Time.fixedDeltaTime * RotationSpeed);
    	yaw = Input.GetAxis("Yaw") * (Time.fixedDeltaTime * RotationSpeed);
    	AddRot.eulerAngles = new Vector3(-pitch, yaw, -roll);
		
		transform.rotation *= AddRot;
		
		accel = Input.GetAxis("Accel");
		if (accel > 0){
			speed += 1;
		}
		else if (accel < 0){
			speed -= 1;
		}
		//if (speed < -5){
		//	speed = -10;
		//}
		//else
		if (speed > 200){
			speed = 200;
		}
		// Broken for some reason
		// So instead, lets just reboot the game!
		if (Input.GetKey('x')){
			//speed = 0;
			//rigidbody.velocity = Vector3.zero;
			//rigidbody.rotation = Quaternion.Euler(0,0,0);
			Application.LoadLevel (0); 
		}
		
		// VTOL Controls
		VTOL = Input.GetAxis("VTOL");
		if (VTOL > 0){
			transform.position += transform.up * Time.deltaTime * 10;
		}
		else if (VTOL < 0){
			transform.position += -transform.up * Time.deltaTime * 10;
		}
		
		transform.position += transform.forward * Time.deltaTime * speed;
		
	}
	else {
	// Engines Off
		speed = 0;
	}
	
	terrainHeight = Terrain.activeTerrain.SampleHeight(transform.position);
	if (terrainHeight > transform.position.y){
		transform.position = new Vector3 (transform.position.x,
											terrainHeight,
											transform.position.z);
	}
}
function Update () {
	// Toggle Engines
	if (Input.GetKeyDown('r')){
		engineToggle = !engineToggle;
	}
	// Toggle Help
	if (Input.GetKeyDown("h")){
		showHelp = !showHelp;
	}
	// User Hits ESC, game quits.
	if (Input.GetKey("escape")){
		Application.Quit();
	}
}
// PHYSICS GHETTO BITCH VERSION
// Does not work of course
/*
function Update () {
	currentSpeed = rigidbody.velocity;
	roll = Input.GetAxis("Roll") * (Time.fixedDeltaTime * RotationSpeed);
    pitch = Input.GetAxis("Pitch") * (Time.fixedDeltaTime * RotationSpeed);
    yaw = Input.GetAxis("Yaw") * (Time.fixedDeltaTime * RotationSpeed);
    AddRot.eulerAngles = new Vector3(-pitch, yaw, -roll);
	transform.rotation *= AddRot;
	accel = Input.GetAxis("Accel");
	if (accel > 0){
		speed += .5;
	}
	else if (accel < 0){
		speed -= .5;
	}
	rigidbody.velocity = speed * Vector3.forward;
	if (speed > 50){
		rigidbody.AddForce (Vector3.up * 100);
	}
}*/

// GUI
function OnGUI(){
	GUI.contentColor = Color.red;
	GUI.Label(Rect(0,0,Screen.width,Screen.height),"Space Wright Bros 0.01");
	GUI.Label(Rect(0,15,Screen.width,Screen.height),"Engines:    "+engineToggle);
	GUI.Label(Rect(0,30,Screen.width,Screen.height),"Speed:   "+speed);
		if (showHelp){
		GUI.Box (Rect(0,80,400,300),"Controls");
		GUI.Label(Rect(0,95,Screen.width,Screen.height),"Toggle Engines (Press r)");
		GUI.Label(Rect(0,115,Screen.width,Screen.height),"Restart (Press x)");
		GUI.Label(Rect(0,135,Screen.width,Screen.height),"Pitch (Press w/s):  "); 
		GUI.Label(Rect(0,155,Screen.width,Screen.height),"Roll (Press a/d)");
		GUI.Label(Rect(0,175,Screen.width,Screen.height),"Yaw (Press q/e)");
		GUI.Label(Rect(0,195,Screen.width,Screen.height),"Throttle (Press shift/ctrl)");
		GUI.Label(Rect(0,210,Screen.width,Screen.height),"VTOL (Press up/down)");
		GUI.Label(Rect(0,235,Screen.width,Screen.height),"Hide This (Press h)");
		GUI.Label(Rect(0,255,Screen.width,Screen.height),"Quit (Press ESC)");
	}
}