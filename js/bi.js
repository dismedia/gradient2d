var bi=function(resX,resY,container) {

    var arr=[];

    function make(x,y,v){
        return {x:x,y:y,v:v,dist:0,weight:0}
    }

    var cnv = document.createElement('canvas');
    cnv.width=resX;
    cnv.height=resY;
    cnv.id="bilinearGradient";

    container.appendChild(cnv);
    var ctx=cnv.getContext("2d");
    ctx.fillStyle="#000000";
    ctx.fillRect(0,0,resX,resY);

    var imageData = ctx.getImageData(0,0,resX,resY);
    var rawData = imageData.data;

    function metric(x1,y1,x2,y2){

        var f=resX/resY;

        var x=(x2-x1);
        var y=(y2-y1);


       x=x*x*f;

        y=y*y/f;

        return (1/(x+y));
    }


    function drawGradient(){


        var p={x:0,y:0};

        function sortBy(a,b){


            return a.dist>b.dist;
        }


        function calculateDist(p){

            var sumDist=0;
            var maxDist=0;

            for(var i=0;i<arr.length;i++){
                var d=metric(p.x, p.y,arr[i].x,arr[i].y);
                d+=0.001;
                arr[i].dist=d;
            }

            for(i=0;i<arr.length;i++){

                sumDist+=arr[i].dist;
            }

            for(i=0;i<arr.length;i++){
                arr[i].weight=arr[i].dist/sumDist;
            }

        }

        for (y = 0; y < resY; y++) {
            for (x = 0; x < resX; x++) {

                p.x=x/resX;
                p.y=y/resY;

                calculateDist(p);

                var r=0;
                var g=0;
                var b=0;

                for(var i=0;i<arr.length;i++){

                    r+=arr[i].v[0]*arr[i].weight;
                    g+=arr[i].v[1]*arr[i].weight;
                    b+=arr[i].v[2]*arr[i].weight;

                }

                r=Math.floor(Math.min(255,r));
                g=Math.floor(Math.min(255,g));
                b=Math.floor(Math.min(255,b));

                var index=(x+y*resX)*4;
                rawData[index]=r;
                rawData[index+1]=g;
                rawData[index+2]=b;


            }
        }


    ctx.putImageData(imageData,0,0);

    }


    function getCanvas(){
        return cnv;

    }

    function addPoint(x,y,r,g,b){

        var point=make(x,y,[r,g,b]);
        arr.push(point);
        drawGradient();

        return point;

    }

    function removePoint(point){
        var index=arr.indexOf(point)
        arr.splice(index, 1);

        drawGradient();
    }

    drawGradient();
    return {

        addPoint:addPoint,
        removePoint:removePoint,
        getCanvas:getCanvas
    };

};










