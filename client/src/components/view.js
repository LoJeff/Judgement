class field_drawer{
	constructor(context, canvas){
		this.context = context;
		this.canvas = canvas;

		this.radius = 0; //ideally screen_height/19.2
		this.horizontal_shift = 0;
		this.world_center_x = 0;
		this.world_center_y = 0
	}

}

class unit_drawer{
	constructor(context){
		this.context = context;
	}
}

function setup_canvas(canvas){
	console.log('hi');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight * 0.8;
}

class coordinate{
	constructor(x,y){
		this.x = x;
		this.y = y;
	}
}

function get_dimensions(canvas){
	var dimensions = new coordinate(canvas.width, canvas.height);
	return (dimensions);
}



export {field_drawer, get_dimensions, setup_canvas};