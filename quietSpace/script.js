var allSound = [];
var movingAverage = 0;
var localMax = 0;
var state = "inhale";
var peak = false; 
var timeOfLastPeak = Date.now(); 

window.onload = function () {
	"use strict";
	var path;
	var report = 0; 

var soundAllowed = function (stream) {
        //Audio stops listening in FF without // window.persistAudioStream = stream;
        //https://bugzilla.mozilla.org/show_bug.cgi?id=965483
        //https://support.mozilla.org/en-US/questions/984179
        window.persistAudioStream = stream;
        var audioContent = new AudioContext();
        var audioStream = audioContent.createMediaStreamSource( stream );
        var analyser = audioContent.createAnalyser();
        audioStream.connect(analyser);
        analyser.fftSize = 1024;

        var frequencyArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteTimeDomainData(frequencyArray);

        function breaths(newestSound){
        	allSound.push(newestSound);
        	//plot();  
        	var sum = 0; 
        	var windowSize = 100; 
        	localMax = Math.max(allSound[allSound.length -1], allSound[allSound.length -1 - windowSize]);

        	//console.log(localMax);
        	if (allSound[allSound.length -1] >= localMax & localMax > 10){
        		if (state == "exhale"){
        			//this is en exhale following a previous exhale
        			peak = false; 
        		}
        		else {
        			//this is if it was an inhale, but now it's an exhale. This is the beginning of an exhale
        			if (Date.now() - timeOfLastPeak >= 2000){
        				console.log("starting to exhale"); 
        				peak = true; 
        				timeOfLastPeak = Date.now(); 
        			}
        			

        		}
        		state = "exhale";
        	}
        	else {
        		state = "inhale"; 
        	}

        	

        	function plot(){
        		document.getElementById("plot").style.display = "block";
        		//allSound.slice(0, 1000);
        	//for (var i = 0; i <= allSound.length; i ++){
        		var dataPoint = document.createElement("div");
        		//console.log(dataPoint); 
        		//dataPoint.innerHTML = i;
        		dataPoint.setAttribute("class", "point");
        		dataPoint.style.position = "absolute"; 
        		dataPoint.style.left = allSound.length +"px";
        		dataPoint.style.top = 100 - allSound[allSound.length-1] +"px";
        		if (state == "exhale"){
        			dataPoint.style.backgroundColor = "red";
        		}

        		else {
        			dataPoint.style.backgroundColor = "blue";
        		}
        		if (peak == true){
        			dataPoint.style.backgroundColor = "yellow";
        		}
        		dataPoint.style.width = "4px";
        		dataPoint.style.height = "4px";
        		document.getElementById("plot").appendChild(dataPoint);
        		//console.log(newestSound);
        	//}
        	}
        	


		}

        var doDraw = function () {
        	breaths(frequencyArray[0]);
        	requestAnimationFrame(doDraw);
        	analyser.getByteFrequencyData(frequencyArray);

        	var arrSum = function(arr){
        		return arr.reduce(function(a,b){
        			return a + b
        		}, 0);
        	}
        	var averageVol = arrSum(frequencyArray)/512;
        	var size = 300; 
            
            //var size = averageVol * 100; 

            if (peak == true) {
            	size = 300; 
            }

            else {
            	size = 100; 
            }
            //var size = 300 -  frequencyArray[0]*10;
            //var size = 220;

            //document.getElementById("viz-box").innerHTML = frequencyArray[0];
            document.getElementById("my-breath").style.backgroundImage = "url('firefly2.png')";
            document.getElementById("my-breath").style.backgroundSize = "cover";
            document.getElementById("my-breath").style.width = size + "px";
            document.getElementById("my-breath").style.height = size + "px";
            //console.log(" frequency now = " + frequencyArray[0] + "   average frequency = " + averageVol);
            
        }
       
        doDraw();
    }

    var soundNotAllowed = function (error) {
    	console.log(error);
    }

    /*window.navigator = window.navigator || {};
    /*navigator.getUserMedia =  navigator.getUserMedia       ||
                              navigator.webkitGetUserMedia ||
                              navigator.mozGetUserMedia    ||
                              null;*/
    navigator.getUserMedia({audio:true}, soundAllowed, soundNotAllowed);

                          };




