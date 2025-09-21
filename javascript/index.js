function init() {

	askques = confirm("Do you want to use my project")
	if (askques === true) {
		askNeeding = confirm("USD to VND/ VND to USD (OK/Cancel): ")
		if (askNeeding === true) {
			document.getElementById("btn2").style.display = "none";
			document.getElementById("message2").style.display = "none";
		} else {
			document.getElementById("btn1").style.display = "none";
			document.getElementById("message1").style.display = "none";
		}
		var htmlBtn1 = document.getElementById("btn1");
		htmlBtn1.onclick = convertButtonClick;

		var htmlBtn2 = document.getElementById("btn2");
		htmlBtn2.onclick = convertButtonClick;		
	} else{
		var hidden;
		hidden = document.getElementById("myproject");
		hidden.style.display = "none";
	}
}


function printConversion(usd, vnd) {
	if (askNeeding === true) {
		var htmlMessage = document.getElementById("message1");
		htmlMessage.textContent = "You have " + usd + "US$ " + " .This is converted " + vnd + "kVND"
	} else {
		var htmlMessage = document.getElementById("message2");
		htmlMessage.textContent = "You have " + vnd + "kVND " + " .This is converted " + Math.round(usd) + "US$"
	}
}


function convertButtonClick() {

	if (askNeeding === true) {
		var usd = prompt("Enter USD:...US$");
		var vnd = usd*26.38;
		printConversion(usd, vnd);

	} else{
		var vnd = prompt("Enter VND:...kVND");
		var usd = vnd/26.38;
		printConversion(usd, vnd)
	}
   	
}

window.onload = init;