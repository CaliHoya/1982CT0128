// jQuery Script

$(document).ready(function() {
//Generation of user ID for email
	$('#register').click(function () {
       	  var dateTimeID = new Date().getTime();
		  var randomID = Math.floor(Math.random()*9000) + 1000;
		  var userID = dateTimeID.toString() + randomID.toString();
	});
//Dynamically add sections of provider form based on input
	$('#providerName').change(function() {
		$('#providerSecondaryForm, #providerTertiaryForm').find('input:text, input:password, input:file, textarea').val('');
		$('#providerSecondaryForm, #providerTertiaryForm').find(':checked, :selected').removeAttr('checked').removeAttr('selected');
		$('#servicesReceivedDropdown, #providerTertiaryForm').hide();
		$('.chosen-select').trigger("chosen:updated");
		$('#providerButton').hide();
		$('#servicesReceivedDropdown').show();
	});
	$('#servicesReceived').change(function() {
		var provider = $('#providerName').val();
		console.log(provider);
		var providerServices = $('#servicesReceived').val();
		$('#providerTertiaryForm > div').hide();
		$('#providerTertiaryForm' ).show();
		$('#providerSecondSection').show();
		switch (providerServices) {
			case "tv":
				$("#"+provider+"-TV").show();
				$('#providerButton').show();
				break;
			case "tv-internet":
				$("#"+provider+"-TV").show();
				$("#"+provider+"-internet").show();
				$('#providerButton').show();
				break;
			case "internet":
				$("#"+provider+"-internet").show();
				$('#providerButton').show();
				break;
			case "tv-internet-phone":
				$("#"+provider+"-TV").show();
				$("#"+provider+"-internet").show();
				$("#"+provider+"-phone").show();
				$('#providerButton').show();	
				break;
			case "internet-phone":
				$("#"+provider+"-internet").show();
				$("#"+provider+"-phone").show();
				$('#providerButton').show();	
				break;	
			case "tv-phone":
				$("#"+provider+"-TV").show();
				$("#"+provider+"-phone").show();
				$('#providerButton').show();	
				break;
			default:
				console.log("Please select a service type to continue.")
		};
	});
//Hide spans with no value
	$("span[value='']").hide();
//Initiate chosen and set width
	$(".chosen-select").chosen({width: "300px"});
//Initiate iCheck
	$('input').iCheck({
	    checkboxClass: 'icheckbox_square-orange',
    	radioClass: 'iradio_square-orange',
	});
 });

//Create an Firebase Simple Login client to do Facebook auth
var authRef = new Firebase('https://cabletipster.firebaseio.com/');
var auth = new FirebaseSimpleLogin(authRef, function(error, user) {
  if (error) {
    // an error occurred while attempting login
	//trying to then take user back to signup page
	window.location = 'http://cabletipster.com/signup.html';
    console.log(error);
  } else if (user) {
    // user authenticated with Firebase
	//check to see if data already inputted
	window.userID = user.provider+":"+user.id;
	new Firebase("https://cabletipster.firebaseio.com/").child("users/"+window.userID).once('value', function(snap) {
if(snap.val() === null) { 
// does not exist
	//write user data to Firebase
	var UserRef = new Firebase('https://cabletipster.firebaseio.com/users/'+window.userID).update({firstName: user.first_name, lastName: user.last_name, email: user.email, userProvider: user.provider});
   //attempts to take user to next screen if Facebook signup is successful
}; 
});
    console.log('User ID: ' + window.userID + ', Provider: ' + user.provider);
	if(window.location.pathname === "/signup.html") {
		window.location = "http://www.cabletipster.com/provider-input-dynamic.html";
	};
  } else {
    // user is logged out
  }
});

//Handle FB Login
function FBLoginButtonClicked() {
  auth.login("facebook", {
	  rememberMe: true,
	  scope: 'email,user_location'
	  });
}
	
//Handle Logout
function userLogout() {
	auth.logout();
}
	 
//Handle Email Login
function EmailSignupButtonClicked() {
	      var dateTimeID = new Date().getTime();
		  var randomID = Math.floor(Math.random()*9000) + 1000;
		  var userID = dateTimeID.toString() + randomID.toString();
		  var UserRef = new Firebase('https://cabletipster.firebaseio.com/users/'+userID);
	      var emailInput = $('#email-input').val();
          var pwdInput = $('#pwd-input').val();
          UserRef.set({email: emailInput, pwd: pwdInput});
}

//Handle Provider input submission
 function ProviderInputButtonClicked() {
	var myProviderRef = new Firebase('https://cabletipster.firebaseio.com');
	var providerName = $('#providerName').val();
 	var servicesReceived = $('#servicesReceived').val();
	var lengthContract = $('#lengthContract').val();
	var priceMonthly = $('#priceMonthly').val();
	var inputTime = new Date();
	var TVPackageRadio = $("input[type='radio'][name='TV-radio']:checked");
		if (TVPackageRadio.length > 0) {
		    var TVPackage = TVPackageRadio.val();
		};
	var numberTotalTV = $('#total-tv-input').val();
	var numberHDTV = $('#hd-tv-input').val();
	var numberDVRTV = $('#dvr-tv-input').val();
	var addOns = $('input:checkbox:checked.TV-addon').map(function() {
		return this.value;
	}).get();
	var internetPackageRadio = $("input[type='radio'][name='internet-radio']:checked");
		if (internetPackageRadio.length > 0) {
			var internetPackage = internetPackageRadio.val();
		};
	var phonePackageRadio = $("input[type='radio'][name='phone-radio']:checked");
		if (phonePackageRadio.length > 0) {
			var phonePackage = phonePackageRadio.val();
		};
	var id = myProviderRef.child("/tips").push();
	var currentTipRef = myProviderRef.child('/tips/').endAt().limit(1);
 	var providerServices = $('#servicesReceived').val();
 	switch (providerServices) {
			case "tv":
				 id.set({'providerName': providerName, 'servicesReceived': servicesReceived, 'lengthContract': lengthContract, 'priceMonthly': priceMonthly, 'submitted': window.userID, 'TVPackage': TVPackage, 'numberTotalTV': numberTotalTV, 'numberHDTV': numberHDTV, 'numberDVRTV': numberDVRTV, 'addOns': addOns, 'inputTime': inputTime}, function(error) {
					if(!error) {
						var name = id.name();
						myProviderRef.child("/users/"+window.userID+"/tips/"+name).set(true);
						}
					});				
				break;
			case "tv-internet":
				 id.set({'providerName': providerName, 'servicesReceived': servicesReceived, 'lengthContract': lengthContract, 'priceMonthly': priceMonthly, 'submitted': window.userID, 'TVPackage': TVPackage, 'numberTotalTV': numberTotalTV, 'numberHDTV': numberHDTV, 'numberDVRTV': numberDVRTV, 'addOns': addOns, 'internetPackage': internetPackage, 'inputTime': inputTime}, function(error) {
					if(!error) {
						var name = id.name();
						myProviderRef.child("/users/"+window.userID+"/tips/"+name).set(true);
						}
					});				
				break;
			case "internet":
				 id.set({'providerName': providerName, 'servicesReceived': servicesReceived, 'lengthContract': lengthContract, 'priceMonthly': priceMonthly, 'submitted': window.userID, 'internetPackage': internetPackage, 'inputTime': inputTime}, function(error) {
					if(!error) {
						var name = id.name();
						myProviderRef.child("/users/"+window.userID+"/tips/"+name).set(true);
						}
					});				
				break;
			case "tv-internet-phone":
				 id.set({'providerName': providerName, 'servicesReceived': servicesReceived, 'lengthContract': lengthContract, 'priceMonthly': priceMonthly, 'submitted': window.userID, 'TVPackage': TVPackage, 'numberTotalTV': numberTotalTV, 'numberHDTV': numberHDTV, 'numberDVRTV': numberDVRTV, 'addOns': addOns, 'internetPackage': internetPackage, 'phonePackage': phonePackage, 'inputTime': inputTime}, function(error) {
					if(!error) {
						var name = id.name();
						myProviderRef.child("/users/"+window.userID+"/tips/"+name).set(true);
						}
					});	
				break;
			case "internet-phone":
				 id.set({'providerName': providerName, 'servicesReceived': servicesReceived, 'lengthContract': lengthContract, 'priceMonthly': priceMonthly, 'submitted': window.userID, 'internetPackage': internetPackage, 'phonePackage': phonePackage, 'inputTime': inputTime}, function(error) {
					if(!error) {
						var name = id.name();
						myProviderRef.child("/users/"+window.userID+"/tips/"+name).set(true);
						}
					});				
				break;	
			case "tv-phone":
				 id.set({'providerName': providerName, 'servicesReceived': servicesReceived, 'lengthContract': lengthContract, 'priceMonthly': priceMonthly, 'submitted': window.userID, 'phonePackage': phonePackage, 'inputTime': inputTime}, function(error) {
					if(!error) {
						var name = id.name();
						myProviderRef.child("/users/"+window.userID+"/tips/"+name).set(true);
						}
					});						
				break;
			default:
				console.log("Please select a service type to continue.")
		};
		currentTipRef.once('value', function(snap) {
			console.log('the id is', snap.name());
			console.log('the data is', snap.val());
			var tipObj = snap.val();
			var tipStr = JSON.stringify(tipObj);
			console.log(tipStr);
		});
 };	
 
 //Handle Address input submission
function AddressInputButtonClicked() {
	var address1 = $('#address1').val();
	var address2 = $('#address2').val();
	var city = $('#city').val();
	var state = $('#state').val();
	var zipCode = $('#zipCode').val();
	var AddressRef = new Firebase('https://cabletipster.firebaseio.com/users/'+window.userID).update({'address1': address1, 'address2': address2, 'city': city, 'state': state, 'zipCode': zipCode});
};

function EmailSignupClicked() {
	var myEmailRef = new Firebase('https://cabletipster.firebaseio.com');
	var id = myEmailRef.child("/emailSignup").push();
	var email = $('#mail').val();
	id.set({'emailAddress': email});
};



  