var last_health = health();
var attacked = false;
var mode = 'roaming';
var max_speed=20;

var check_health_every = 20;
var check_health_tick = check_health_every;
var change_direction_every = 100;
var change_direction_tick = change_direction_every;

var scan_width = 20;
var scan_angle=0;
var enemy_range = 100;

function scan_tick() {
  scan_angle += scan_width;
  return scan(scan_angle,Math.abs(scan_width));
}
function under_attack() {
  if(check_health_tick>0) {
    check_health_tick--;
  } else {
    check_health_tick = check_health_every;
    attacked = last_health > health();
    last_health = health();
  }
  
  return attacked;
}
function choose_new_direction(now = false) {
  if(now) {
    swim(Math.random() * 360,max_speed);
  } else {
    if(change_direction_tick>0) {
      change_direction_tick--;
    } else {
      change_direction_tick = change_direction_every;
      choose_new_direction(true);
    }
  }
}

function near_edge() {
  return   (speed()>80 && (getX()<10||getX()>90 || getY()<10||getY()>90))
         ||(speed()>20 && (getX()<2||getX()>98 || getY()<2||getY()>98));
}


swim(Math.random() * 360,max_speed);

while (true) {
  if (under_attack() && mode != 'fleeing') {
    swim(Math.random() * 360,100);
    mode = 'fleeing';
  }
  if (!under_attack() && mode == 'fleeing') {
    mode = 'roaming';
  }
  
  switch(mode) {
    case 'roaming': choose_new_direction();break;
  }
  if(mode != 'stand' ) {
    if(speed() == 0 || near_edge()) {
      choose_new_direction(true);
    }
  }
  enemy_range = scan_tick();
  if(enemy_range<70) {
    cannon(scan_angle,enemy_range)
  }
  if(enemy_range<20) {
    stop();
  }
  if(enemy_range<100 && mode != 'fleeing') {
    swim(scan_angle,max_speed);
    scan_width/=2;
    scan_width*=-1;
  }
  if(enemy_range>100) {
    scan_width=20;
  }
}

