class field_drawer{
	constructor(context, canvas){
		this.context = context;
		this.canvas = canvas;
		this.angle = 1.0472;//value in radians of angle from x axis to top left corner (acute angle), this is 60 degrees in rad
		
		this.radius = 0; //ideally screen_height/19.2
		this.max_vertical_radius =0; //in units of hexes
		this.max_horizontal_radius = 0;
		this.hex_height = 0;
		this.hex_edge_length = 0;
		this.horizontal_shift = 0;
		this.world_center_x = 0;
		this.world_center_y = 0
	}

	draw_field_layout(colour){
		this.recalculate();
		var offset;
		
		for(offset = 0; offset < this.max_horizontal_radius; offset += 2){
			this.draw_hex_column_odd(this.world_center_x + (this.horizontal_shift * offset), this.world_center_y, this.max_vertical_radius - offset/2, colour);
			this.draw_hex_column_odd(this.world_center_x - (this.horizontal_shift * offset), this.world_center_y, this.max_vertical_radius - offset/2, colour);
			this.draw_hex_column_even(this.world_center_x + this.horizontal_shift * (offset+1), this.world_center_y, this.max_vertical_radius - offset/2, colour);
			this.draw_hex_column_even(this.world_center_x - this.horizontal_shift * (offset+1), this.world_center_y, this.max_vertical_radius - offset/2, colour);
		}
	}
	
	set_radius(radius){
		this.radius = radius;
	}

	draw_hex_column_odd(center_x, center_y, column_height, colour){
		var vertical_hex_num;
		for (vertical_hex_num = column_height; vertical_hex_num >= -column_height ; vertical_hex_num --){
			var hex_center = new coordinate(center_x, center_y - (vertical_hex_num*this.hex_height));
			//////////////////////////////////////////
			console.log("the x possition is");
			console.log(Math.round((center_x - this.world_center_x)/this.horizontal_shift));
			console.log("the y possition is");
			console.log(vertical_hex_num);
			//////////////////////////////////////////
			this.draw_hex(hex_center, colour);
		}
		console.log("done this one");
	}

	draw_hex_column_even(center_x, center_y, column_height, colour){
		var vertical_hex_num;
		for (vertical_hex_num = column_height; vertical_hex_num > -column_height ; vertical_hex_num --){
			var hex_center = new coordinate(center_x, center_y - (vertical_hex_num*this.hex_height) + (this.hex_height/2));
			//////////////////////////////////////////
			console.log("the x possition is");
			console.log(Math.round((center_x - this.world_center_x)/this.horizontal_shift));
			console.log("the y possition is");
			console.log(vertical_hex_num);
			//////////////////////////////////////////
			this.draw_hex(hex_center, colour);
		}
		console.log("done this one");
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