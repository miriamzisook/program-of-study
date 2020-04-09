var allSound = [];
var movingAverage = 0;
var localMax = 0;
var state = "inhale";
var peak = false; 
var timeOfLastPeak = Date.now();
var timeSinceLastPeak = 0;  
var recentSums = [];
var size = 0; 
var change = "increasing";
var changeWas; 

var intervals = []; 
var size = 300; 

window.onload = function () {
	"use strict";

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
        //make empty array with number of bins analyser uses to count frequencies 
        var frequencyArray = new Uint8Array(analyser.frequencyBinCount);
        //get the volume of signal across time and put it into frequency array (timeDOmain is volume frequencyDomain is spectogram)
        analyser.getByteTimeDomainData(frequencyArray);
        

        function breaths(newestSound){

            var arrSum = function(arr){
              return arr.reduce(function(a,b){
                return a + b
            }, 0);
          } 
          var sum = arrSum(frequencyArray);  
          var average = sum/frequencyArray.length;    
          recentSums.unshift(average);

          var nowIndex = 20; 
          var windowSize = 20; 

          var arrSum = function(arr){
              return arr.reduce(function(a,b){
                return a + b
            }, 0);
          } 

          changeWas = change; 
          var justBeforeAve= arrSum(recentSums.slice(nowIndex, nowIndex + windowSize))/windowSize;
          var justAfterAve = arrSum(recentSums.slice(0, nowIndex))/windowSize; 

          var timeSinceLastPeak = 0; 
            //if the value "now" is higher than the average of the window just before "now" it's increasing

            if (recentSums[nowIndex] > justBeforeAve){
                change = "increasing";
            }
            //if the value "now" is higher than the average of the window just after "now" it's decreasing
            else if (recentSums[nowIndex] > justAfterAve){ 
                change = "decreasing";
            }
            //if it's decreasing now and it was just increasing thast's a peak 
            if (changeWas != change && change == "decreasing"){
                peak = true; 
                timeSinceLastPeak = Date.now() - timeOfLastPeak; 
                timeOfLastPeak = Date.now(); 
                //console.log(peak + "  time since last peak    " + timeSinceLastPeak);
                intervals.unshift(timeSinceLastPeak);
            }
            else {
                peak =false;
            }
            //console.log("change = " + change + "   peak = " + peak);

            
            //This is to make the plot
            for (var i = 0; i <= frequencyArray.length; i++ ){
                var dataPoint = document.createElement("div");
                dataPoint.setAttribute("class", "point");
                dataPoint.setAttribute("id", "point-" + i);
                document.getElementById("plot").appendChild(dataPoint);

            }
            document.getElementById("plot").style.display = "block";
            for (var i = 0; i <= frequencyArray.length; i++ ){
                var thisPoint = document.getElementById("point-"+i)
                thisPoint.setAttribute("class", "point");
                thisPoint.style.position = "absolute"; 
                thisPoint.style.left = i-nowIndex +"px";
                thisPoint.style.top = frequencyArray[i-nowIndex] +"px";
                thisPoint.style.backgroundColor = "red";

                thisPoint.style.width = "4px";
                thisPoint.style.height = "4px";
            }


            for (var i = 0; i <= 1000; i++ ){
                var dataPoint = document.createElement("div");
                dataPoint.setAttribute("class", "line");
                dataPoint.setAttribute("id", "line-" + i);
                document.getElementById("plot").appendChild(dataPoint);

            }

            for (var i = 0; i < 1000; i ++){
                    //console.log(recentSums[i]);
                    var thisPoint = document.getElementById("line-"+i)
                    thisPoint.setAttribute("class", "line");
                    thisPoint.style.position = "absolute"; 
                    thisPoint.style.left = i + 512 + "px";
                    thisPoint.style.top = 100 - recentSums[i] +"px";
                    thisPoint.style.backgroundColor = "blue";

                    thisPoint.style.width = "4px";
                    thisPoint.style.height = "4px";
                }
             //this ends the plot section 
            

            }

            var doDraw = function () {
            //console.log(state);
            breaths();
            requestAnimationFrame(doDraw);
            analyser.getByteTimeDomainData(frequencyArray);
            
            
            //animation start the bubble big and decrease for 60% then increase for 40% of the interval 
            var animationTime = intervals[0]/100;

            var id;  
            if (peak){
                //console.log("peak here, peak interval is " + intervals[0]);
                id = setInterval(shrink, animationTime);
            }
            function shrink() {
                if (size <= 10) {
                  clearInterval(id);
                  size = 300; 
              } else {
                  size = size - 10;
                  document.getElementById("my-breath").style.width = size + "px";
                  document.getElementById("my-breath").style.height = size + "px";
              }
          }
        


        document.getElementById("my-breath").style.backgroundImage = "url('firefly2.png')";
        document.getElementById("my-breath").style.backgroundSize = "cover";            
        }

        doDraw();
    }

    var soundNotAllowed = function (error) {
    	console.log(error);
        //put interaction here
    }

    /*window.navigator = window.navigator || {};
    /*navigator.getUserMedia =  navigator.getUserMedia       ||
                              navigator.webkitGetUserMedia ||
                              navigator.mozGetUserMedia    ||
                              null;*/
                              navigator.getUserMedia({audio:true}, soundAllowed, soundNotAllowed);

                          };




