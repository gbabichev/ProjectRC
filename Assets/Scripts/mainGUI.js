#pragma strict

// Script is always running, so we will use the
// Inputs & GUI in here

// Still working on adding the GUI. 

function Update () {
	if (Input.GetKey("escape")){
		Application.Quit();
	}
	// Hide the cursor
	Screen.showCursor = false;
}

function OnGUI () {
    //GUI.Box (new Rect (Screen.width - 100,Screen.height - 50,100,30), "DEBUG BUILD");
}