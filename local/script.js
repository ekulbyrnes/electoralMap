//NOTE: must run chrome with this command: 
//open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security
//otherwise you cannot access svg through html due to CORS issue (cross origin)
//this should stop being a problem once this is hosted on a web server (even a local server should work)

// next steps: 
  // - clean up this code!!!!!!
    // keep another "messy" version to look at later

// fix the divide by zero bug on the bar 
  // code snippet at bottom of this w/idea of how to do this 

//slideshow of versions 

// get rid of counters in bottom left 

// host 

// check hosted, local version of hosted, and mobile version of hosted for bugs

// change everything top jquery, no vanilla js for dom manipulation

// make svg responsive

// State abbreviations + DC 
var statesArray = ["AK", "HI", "AL", "AR", "AZ", "CA", "CO", "CT", "DE", "FL", "GA", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY", "DC2"];

// so many blues and reds
var colorsArray = {
  "tossup": "#9E8767", // Tan toss-up/undecided
  "tilt_r": "#CF8980", // Tilt R
  "lean_r": "#FF8B98", // Lean R
  "likely_r": "#FF5865", // Likely R
  "safe_r": "#D22532", // Safe R
  "safe_d": "#244999", // Safe D
  "likely_d": "#577CCC", // Likely D
  "lean_d": "#8AAFFF", // Lean D
  "tilt_d": "#949BB3", // Tilt D
  "ind": "#CCAD29", // Independent yellow. (Green: 29D755)
  "purple": "#800080",
  "poll": "#DDDDDD"  // unpolled gray #CCC
};


window.onload = initAll;

function initAll(){
  var myMap = $('#map').get(0).getSVGDocument();

  var totalElectoralVotes = 538;
  var sum = 0;
  var svg = myMap.querySelector('svg');
  var obj = document.getElementById("map");
  var objDoc = obj.contentDocument;
  var demSum = 0;
  var repSum = 0;
  var leanRepSum = 0;
  var likRepSum = 0; 
  var solRepSum = 0;
  var tossupSum = 0;
  var leanDemSum = 0; 
  var likDemSum = 0; 
  var solDemSum = 0;

  var kentucky = objDoc.getElementById('KY');
  d3.select(kentucky).style('fill', colorsArray["lean_d"]);

  statesArray.forEach(function(state){
    var currState = objDoc.getElementById(state);
    var myNewDiv = document.createElement('div')  
    var foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    var body = document.createElement('body'); // you cannot create bodies with .append("<body />") for some reason
    var statePath = svg.querySelector("#" + state);
    var EV = $(statePath).data("other");
    var initialColor = $(statePath).data("color")
    var voteCount = parseInt($(currState).data('other'), 10);

    // TODO - get rid of redundant code
    if (initialColor == "likely_r"){ // Likely R 
      repSum += voteCount;
      likRepSum += voteCount;
    } else if (initialColor == "safe_r"){ // Safe R  
      repSum += voteCount;
      solRepSum += voteCount;
    } else if (initialColor == "safe_d"){ // Safe D 
      demSum += voteCount;
      solDemSum += voteCount;
    } else if (initialColor == "likely_d"){ // Likely D 
      demSum += voteCount;
      likDemSum += voteCount;
    } else if (initialColor == "lean_d"){ // Lean D 
      demSum += voteCount;
      leanDemSum += voteCount;
    } else if (initialColor == "lean_r"){ // Lean R 
      repSum += voteCount;
      leanRepSum += voteCount;
    } else {
      tossupSum += voteCount;
    }

    var leanRepPercentage = leanRepSum > 0 ? leanRepSum/totalElectoralVotes : 0;
    var likRepPercentage = likRepSum > 0 ? likRepSum/totalElectoralVotes : 0;
    var solRepPercentage = solRepSum > 0 ? solRepSum/totalElectoralVotes : 0;
    var leanDemPercentage = leanDemSum > 0 ? leanDemSum/totalElectoralVotes : 0;
    var likDemPercentage = likDemSum > 0 ? likDemSum/totalElectoralVotes : 0;
    var solDemPercentage = solDemSum > 0 ? solDemSum/totalElectoralVotes : 0;
    var tossupPercentage = tossupSum > 0 ? tossupSum/totalElectoralVotes : 0;

    var leanRepBar = document.getElementsByClassName("lean-rep-bar");
    var likRepBar = document.getElementsByClassName("lik-rep-bar");
    var solRepBar = document.getElementsByClassName("sol-rep-bar");
    var leanDemBar = document.getElementsByClassName("lean-dem-bar");
    var likDemBar = document.getElementsByClassName("lik-dem-bar");
    var solDemBar = document.getElementsByClassName("sol-dem-bar");
    var tossupBar = document.getElementsByClassName("tossup-bar");

    $(leanRepBar).css("width", leanRepPercentage.toFixed(2) + "%");
    $(likRepBar).css("width", likRepPercentage.toFixed(2) + "%");
    $(solRepBar).css("width", solRepPercentage.toFixed(2) + "%");
    $(leanDemBar).css("width", leanDemPercentage.toFixed(2) + "%");
    $(likDemBar).css("width", likDemPercentage.toFixed(2) + "%");
    $(solDemBar).css("width", solDemPercentage.toFixed(2) + "%");
    $(tossupBar).css("width", tossupPercentage.toFixed(2) + "%");

    $(leanRepBar).html(leanRepSum);  
    $(likRepBar).html(likRepSum);  
    $(solRepBar).html(solRepSum);  
    $(leanDemBar).html(leanDemSum);  
    $(likDemBar).html(likDemSum);  
    $(solDemBar).html(solDemSum);  
    $(tossupBar).html(tossupSum);  

    // console.log(initialColor);
    d3.select(currState).style('fill', colorsArray[initialColor]);
    var element = d3.select(currState).node();
    var bbox = element.getBBox();

    $(foreignObject)
    .attr("x", (bbox.x + bbox.width/2 - 15))
      // .attr("x", function(d){
      //   return statePath.centroid(d)[0];
      // })
      .attr("y", (bbox.y + bbox.height/2 - 25))
      // .attr("y", function(d){
      //   return statePath.centroid(d)[1];
      // })
      .attr("width", 30).attr("height", 50).append(body);

      $(body).append("<div>"+ state + "<br>" + EV + "</div>");
      $(foreignObject).attr("id", "stateName");
      $(svg).append(foreignObject);
      sum += parseInt($(currState).data('other'), 10);
    });

  $(document.body).append("<div id=\"demSum\">DEM: " + demSum + "</div>");
  $(document.body).append("<div id=\"repSum\">GOP: " + repSum + "</div>");
  $(document.body).append("<div id=\"leanRepSum\">lean GOP: " + leanRepSum + "</div>");
  $(document.body).append("<div id=\"likRepSum\">likely GOP: " + likRepSum + "</div>");
  $(document.body).append("<div id=\"solRepSum\">solid GOP: " + solRepSum + "</div>");
  $(document.body).append("<div id=\"leanDemSum\">lean DEM: " + leanDemSum + "</div>");
  $(document.body).append("<div id=\"likDemSum\">likely DEM: " + likDemSum + "</div>");
  $(document.body).append("<div id=\"solDemSum\">solid DEM: " + solDemSum + "</div>");
  $(document.body).append("<div id=\"tossup\">tossup: " + tossupSum + "</div>");
  
  var myPath = $(myMap).find("path, circle");

  $(myPath).click(function(e){
    console.log($(this).data('color'));
    console.log(tinycolor.equals(this.style.fill, "rgb(255, 88, 101)"));

    var currStateColor = this.style.fill;
    console.log(currStateColor);
    demSumObj = document.getElementById("demSum");
    repSumObj = document.getElementById("repSum");
    leanDemSumObj = document.getElementById("leanDemSum");
    likDemSumObj = document.getElementById("likDemSum");
    solDemSumObj = document.getElementById("solDemSum");
    leanRepSumObj = document.getElementById("leanRepSum");
    likRepSumObj = document.getElementById("likRepSum");
    solRepSumObj = document.getElementById("solRepSum");
    tossupObj = document.getElementById("tossup");


    // TODO: clean this up  
    // too much redundant code
    // should implement shared function for this and init too with counting EVs
    // dash case for IDs
    if (tinycolor.equals(currStateColor, "rgb(255, 88, 101)")){ // Likely R --> Safe R
      this.style.fill = "#D22532";

      likRepSum -= parseInt(this.getAttribute('data-other'));
      likRepSumObj.innerHTML = "<div id=\"likRepSum\">likely GOP: " + likRepSum + "</div>";
      solRepSum += parseInt(this.getAttribute('data-other'));
      solRepSumObj.innerHTML = "<div id=\"solRepSum\">solid GOP: " + solRepSum + "</div>";

      barAction();
    } 

    else if (tinycolor.equals(currStateColor, "rgb(210, 37, 50)")){ // Safe R --> Safe D 
      this.style.fill = "#244999";

      repSum -= parseInt(this.getAttribute('data-other'));
      solRepSum -= parseInt(this.getAttribute('data-other'));

      repSumObj.innerHTML = "<div id=\"repSum\">GOP: " + repSum + "</div>";
      solRepSumObj.innerHTML = "<div id=\"solRepSum\">solid GOP: " + solRepSum + "</div>";

      demSum += parseInt(this.getAttribute('data-other'));
      solDemSum += parseInt(this.getAttribute('data-other'));

      demSumObj.innerHTML = "<div id=\"demSum\">DEM: " + demSum + "</div>";
      solDemSumObj.innerHTML = "<div id=\"solDemSum\">solid DEM: " + solDemSum + "</div>";
      
      barAction();
    } 

    else if (tinycolor.equals(currStateColor, "rgb(36, 73, 153)")){ // Safe D --> Likely D
      this.style.fill = "#577CCC";
      solDemSum -= parseInt(this.getAttribute('data-other'));
      solDemSumObj.innerHTML = "<div id=\"solDemSum\">solid DEM: " + solDemSum + "</div>";
      likDemSum += parseInt(this.getAttribute('data-other'));
      likDemSumObj.innerHTML = "<div id=\"likDemSum\">likely DEM: " + likDemSum + "</div>";

      barAction();
  } 

    else if (tinycolor.equals(currStateColor, "rgb(87, 124, 204)")){ // Likely D --> Lean D
      this.style.fill = "#8AAFFF";
      likDemSum -= parseInt(this.getAttribute('data-other'));
      likDemSumObj.innerHTML = "<div id=\"likDemSum\">likely DEM: " + likDemSum + "</div>";

      leanDemSum += parseInt(this.getAttribute('data-other'));
      leanDemSumObj.innerHTML = "<div id=\"leanDemSum\">lean DEM: " + leanDemSum + "</div>";
      barAction();
  } 

    else if (tinycolor.equals(currStateColor, "rgb(138, 175, 255)")){ // Lean D --> Tossup
      this.style.fill = "#9E8767";
      demSum -= parseInt(this.getAttribute('data-other'));
      demSumObj.innerHTML = "<div id=\"demSum\">DEM: " + demSum + "</div>";

      tossupSum += parseInt(this.getAttribute('data-other'));
      tossupObj.innerHTML = "<div id=\"tossupSum\">tossup: " + tossupSum + "</div>";

      leanDemSum -= parseInt(this.getAttribute('data-other'));
      leanDemSumObj.innerHTML = "<div id=\"leanDemSum\">lean DEM: " + leanDemSum + "</div>";
      barAction();
  } 

    else if (tinycolor.equals(currStateColor, "rgb(158, 135, 103)")){ // Tossup --> Lean R
      this.style.fill = "#FF8B98";
      repSum += parseInt(this.getAttribute('data-other'));
      repSumObj.innerHTML = "<div id=\"repSum\">GOP: " + repSum + "</div>";

      tossupSum -= parseInt(this.getAttribute('data-other'));
      tossupObj.innerHTML = "<div id=\"tossupSum\">tossup: " + tossupSum + "</div>";

      leanRepSum += parseInt(this.getAttribute('data-other'));
      leanRepSumObj.innerHTML = "<div id=\"leanRepSum\">lean GOP: " + leanRepSum + "</div>";
      barAction();

  } 

    else if (tinycolor.equals(currStateColor, "rgb(255, 139, 152)")){ // Lean R --> Likely R
      this.style.fill = "#FF5865";

      leanRepSum -= parseInt(this.getAttribute('data-other'));
      leanRepSumObj.innerHTML = "<div id=\"leanRepSum\">lean GOP: " + leanRepSum + "</div>";

      likRepSum += parseInt(this.getAttribute('data-other'));
      likRepSumObj.innerHTML = "<div id=\"likRepSum\">likely GOP: " + likRepSum + "</div>";

      barAction();
  } 
});

function barAction(){
 var leanRepPercentage = leanRepSum > 0 ? leanRepSum/totalElectoralVotes : 0;
 var likRepPercentage = likRepSum > 0 ? likRepSum/totalElectoralVotes : 0;
 var solRepPercentage = solRepSum > 0 ? solRepSum/totalElectoralVotes : 0;
 var leanDemPercentage = leanDemSum > 0 ? leanDemSum/totalElectoralVotes : 0;
 var likDemPercentage = likDemSum > 0 ? likDemSum/totalElectoralVotes : 0;
 var solDemPercentage = solDemSum > 0 ? solDemSum/totalElectoralVotes : 0;
 var tossupPercentage = tossupSum > 0 ? tossupSum/totalElectoralVotes : 0;

 var leanRepBar = document.getElementsByClassName("lean-rep-bar");
 var likRepBar = document.getElementsByClassName("lik-rep-bar");
 var solRepBar = document.getElementsByClassName("sol-rep-bar");
 var leanDemBar = document.getElementsByClassName("lean-dem-bar");
 var likDemBar = document.getElementsByClassName("lik-dem-bar");
 var solDemBar = document.getElementsByClassName("sol-dem-bar");
 var tossupBar = document.getElementsByClassName("tossup-bar");


    // this works, need to do it for the rest of them... going to clean up the rest of the code first 
    // IMPORTANT
    // need to also flip the display back on when the sum goes above zero again

    if (leanRepPercentage > 0) {
      $(leanRepBar).css("width", leanRepPercentage.toFixed(2) + "%");
      $(leanRepBar).show();
    }  else {
      $(leanRepBar).hide();
    }

    if (likRepPercentage > 0) {
      $(likRepBar).css("width", likRepPercentage.toFixed(2) + "%");
      $(likRepBar).show();
    }  else {
      $(likRepBar).hide();
    }

    if (solRepPercentage > 0) {
      $(solRepBar).css("width", solRepPercentage.toFixed(2) + "%");
      $(solRepBar).show();
    }  else {
      $(solRepBar).hide();
    }
    
    if (leanDemPercentage > 0) {
      $(leanDemBar).css("width", leanDemPercentage.toFixed(2) + "%");
      $(leanDemBar).show();
    }  else {
      $(leanDemBar).hide();
    }

    if (likDemPercentage > 0) {
      $(likDemBar).css("width", likDemPercentage.toFixed(2) + "%");
      $(likDemBar).show();
    }  else {
      $(likDemBar).hide();
    }

    if (solDemPercentage > 0) {
      $(solDemBar).css("width", solDemPercentage.toFixed(2) + "%");
      $(solDemBar).show();
    }  else {
      $(solDemBar).hide();
    }

    if (tossupPercentage > 0) {
      $(tossupBar).css("width", tossupPercentage.toFixed(2) + "%");
      $(tossupBar).show();
    }  else {
      $(tossupBar).hide();
    }

    $(leanRepBar).html(leanRepSum);  
    $(likRepBar).html(likRepSum);  
    $(solRepBar).html(solRepSum);  
    $(leanDemBar).html(leanDemSum);  
    $(likDemBar).html(likDemSum);  
    $(solDemBar).html(solDemSum);  
    $(tossupBar).html(tossupSum);  
  }
}
