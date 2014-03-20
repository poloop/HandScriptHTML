/**
 * Created by plong on 06/11/13.
 */

var wishes = wishes || {};

(function($, wishes){
    var canvas;
    var context;
    var loader;
    var emitter;
    var sign;

    $(function() {
        //Ready
        init();
    });

    function init() {
        console.log("INIT");

        canvas = document.getElementById("canvas");
        context = canvas.getContext("2d");
        loader = new createjs.LoadQueue();
        loader.addEventListener("complete", handleLoadingComplete);
        loader.loadManifest([{id:"emitter", src:"images/emitter.png"}, {id:"data-happy", src:"data/data.json", type:createjs.LoadQueue.JSON}]);

        loader.load();
    }

    function handleLoadingComplete() {
        var data = loader.getResult("data-happy");
        emitter = new createjs.Bitmap(loader.getResult("emitter"));
        sign = new wishes.PathWord(data);
    }

    wishes.PathWord = function(data) {
        console.log("NEW PathWord " + data);
        this.data = data[0].effects[0].props[0].values;

        this.interval = 0;
        this.step = 30;
        this.currentframe = 0;
        this.offset = {x : -200, y : 0};
        this.alpha = .2;
        this.init();
    };

    wishes.PathWord.prototype.init = function() {

        console.log("INIT PathWord " + this.data);
        this.start();
    };

    wishes.PathWord.prototype.start = function() {
        var self = this;
        self.intervalHandler = function() {
            self.draw();
        };
        this.interval = setInterval(self.intervalHandler, 20);
    };

    wishes.PathWord.prototype.draw = function() {
       //console.log(this.currentframe + " " + this.data.length);
        var i;
        if (this.currentframe < this.data.length - 1)
        {
            var f = this.currentframe;
            for (i = f; i < Math.min(f + this.step, this.data.length - 1); i++)
            {
                this.currentframe += 1;
                this.update(this.currentframe);
            }
        } else
        {
            context.clearRect(0, 0, canvas.width, canvas.height);
            this.currentframe = 0;
        }
    };

    wishes.PathWord.prototype.update = function(i) {
        var destX = Number(this.data[i][0]) + Number(this.offset.x);
        var destY = Number(this.data[i][1]) + Number(this.offset.y);
        context.globalCompositeOperation = "lighter";
        context.globalAlpha = this.alpha;
        context.drawImage(emitter.image, destX, destY);
    };

})(jQuery, wishes);
