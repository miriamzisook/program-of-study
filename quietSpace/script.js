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

        var doDraw = function () {
            //console.log("drawing!");
            requestAnimationFrame(doDraw);
            analyser.getByteFrequencyData(frequencyArray);
            console.log(frequencyArray[0]);
            document.getElementById("viz-box").innerHTML = frequencyArray[0];
            document.getElementById("viz-box").style.backgroundColor = "blue";
            document.getElementById("viz-box").style.width = 60 + frequencyArray[0] + "px";
            document.getElementById("viz-box").style.height = 60 + frequencyArray[0] + "px";
            document.getElementById("viz-box").style.borderRadius = 30 + frequencyArray[0]/2 + "px";

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