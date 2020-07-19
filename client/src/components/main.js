import * as view from './view.js';

export default function overall(){
	var main_canvas = document.getElementById('canvas');
	var context = main_canvas.getContext('2d');

	view.setup_canvas(main_canvas);
	var screen_width = main_canvas.width;
	var screen_height = main_canvas.height;


	console.log(main_canvas);
	console.log(screen_width);
	console.log(screen_height);
	
	//this draws the board
	//start drawing our game
	//where / how is this updated?
	//have one class for an episode
	//one class for punishments? bc this only happens once. hm.
	var episode_drawer = new view.episode_drawer(context, main_canvas);
	episode_drawer.set_radius(screen_height/19.2);
	//episode_drawer.draw_field_layout( "#000000");
}