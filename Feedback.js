function Feedback(event) {
	var form = document.getElementById("feedback");
	var name, email, phone, address, comments; 
	var warning = new Array();
	var text = "";		
	
	if (!form.elements['name'].checkValidity()) {
    warning.push("\"Name\" is a required field.");
	}
   
	if (!form.elements['phone'].checkValidity()) {
    warning.push("\"Phone\" must be in the form of ###-###-#### to be valid.");
	}
	
	if (!form.elements['email'].checkValidity()) {
    warning.push("\"Email\" is a required field and must be a valid email.");
	}
    
	if (!form.elements['address'].checkValidity()) {
    warning.push("\"Address\" must be a vaild address.");
	}
	 
	if (!form.elements['comments'].checkValidity()) {
    warning.push("\"Comments\" is a required field.");
	}
	if (warning.length > 0) {
    for (var element of collection) {
      text += element + "\n";
		}
		alert(text);
		return false;
	}
	name = form.elements["name"].value;
	email = form.elements["email"].value;
	phone = form.elements["phone"].value;
	address = form.elements["address"].value;
	comments = form.elements["comments"].value;
	
	text = "Thanks for your submition," + name + "," + "\nA confirmation email will be sent to you shortlly.";
	alert(text);
	form.submit();
}

function validateField(dirty, field) {
	if (dirty.type == "email") {
		if (!dirty.checkValidity()) {
		alert("\"Email\" is a required field and must be a valid email");
		return false;
		}
	}
	else if (dirty.type == "tel") {
		if (!dirty.checkValidity()) {
		alert("\"Phone\" must be in the form of ###-###-#### to be valid");
		return false;
		}
	}
	else { 
		alert(field + " is a required field");
		return false;
	}
	return true;
}
   
   