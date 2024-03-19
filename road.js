class Road{
    constructor(x, width, laneCount=3){ // Road centered around "x" value
        this.x = x;                     // Centre position of road.
        this.width = width;
        this.laneCount = laneCount;

        this.left = x-width/2;   // Calculates leftmost and,
        this.right = x+width/2;  // rightmost coordinates  of the road.

        // To make the road infinite.
        const infinity = 1000000;
        this.top = -infinity;
        this.bottom = infinity; // As y-axis grows downwards.

        const topLeft = {x:this.left, y:this.top};
        const topRight = {x:this.right, y:this.top};
        const bottomLeft = {x:this.left, y:this.bottom};
        const bottomRight = {x:this.right, y:this.bottom};
        
        // Representing one side of the road.
        this.borders = [
            [topLeft, bottomLeft],          // Left side
            [topRight, bottomRight]         // right side
        ]
    }

    getLaneCenter(laneIndex){
        const laneWidth = this.width/this.laneCount;
        return this.left+laneWidth/2+Math.min(laneIndex, this.laneCount-1)*laneWidth;
    }

    draw(ctx){
        // Draw the lines on the boundary of the road.
        ctx.lineWidth = 5;
        ctx.strokeStyle = "white";

        for(let i=1; i<=this.laneCount-1; i++){
            const x = lerp(
                this.left,
                this.right,
                i/this.laneCount
            );

            // draw dashed lines.
            ctx.setLineDash([20, 20]);

            // Draws the line from x's top to x's bottom.
            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.stroke();
        }

        ctx.setLineDash([]);
        this.borders.forEach(border=>{
            ctx.beginPath();
            ctx.moveTo(border[0].x, border[0].y);
            ctx.lineTo(border[1].x, border[1].y);
            ctx.stroke();
        });
    }
}
