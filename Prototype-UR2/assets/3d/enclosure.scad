use <pin-hinge.scad>;
width=40;
length=66;
height=17.5;
lid_height=7;
wall=1;
radius_xy=wall*4;
radius_z=wall*2;
inset=0.75;

// the base
translate([-1.2*width/2,0,height/2+wall]) {
    difference() {
        union() {
            hinged_box(width, length, height, 1);
        }
        union() {
            // aperture for the usb port
            *translate([0, -length/2, -2]) {
                charge_port(10, 5, wall);
            }
            // top strap receiver
            top_strap(width/3);
        }
    }
}

// the lid
translate([1.2*width/2,0,lid_height/2+wall]) rotate([0,180,0]) {
    difference() {
        union() {
            hinged_box(width, length, lid_height, -1);
        }
        #translate([0,12,lid_height/2]) rotate(180) button(10,36,wall*2);
    }

}

// the strap
translate([1.2*width+1.2*width/2,0,width/3/2]) {
    rotate([0,90,0]) {
        top_strap(width/3);
    }
}

module top_strap(strap_w) {
    strap_len=length+inset;
    wall=1;
    translate([0,0,inset*2]) difference() {
        union() {
            cube([strap_w, strap_len, height-wall], center=true);
            translate([0,0,-height/2+inset*2]) {
                rotate([0,0,90]) outer_ridges(inset, strap_w, [strap_len, strap_w, height]);
            }
        }
        translate([0,0,-wall/2]) cube([strap_w, strap_len-2*wall, height-wall*2], center=true);
    }
}
module outer_ridges(radius, length, bounds) {
    translate([-1*(bounds[0]/2+radius/2), 0]) {
        rotate([180,0,0]) ridge(radius, length, 1);
    }
    translate([bounds[0]/2+radius/2, 0]) {
        rotate([180,0,0]) ridge(radius, length, -1);
    }
}
module ridge(radius, length, orient=1) {
    rotate([0,0,orient<0?0:180])
    translate([-radius/2, 0, radius/2]) difference() {
        rotate([90,0,0]) cylinder(r=radius, h=length, center=true, $fn=12);
        union() {
            translate([0,0,radius/2]) cube([radius*2, length, radius], center=true);
            translate([-radius/2,0,0]) cube([radius, length, radius*2], center=true);
        }
    }
}

module hinged_oval_box(width, length, height, orient) {
    hull() {
        translate([0, -length/2+5, 2]) {
            resize(newsize=[width, width/2, height]) sphere(d=width, center=true);
        }
        translate([0, +length/2-5, 2]) {
            resize(newsize=[width*1.25, width/2, height]) sphere(d=width, center=true);
        }
    }
}
module hinged_box(width, length, height, orient) {
    hinge_radius=4;
    hinge_y_offset=length/2+radius_xy+hinge_radius/2;
    difference() {
        union() {
            difference() {
                shell(width, length, height, orient);
                translate([0, -1*hinge_y_offset, orient*(height/2)]) {
                  rotate(a=[0,90,0]) translate([0,0,0.25]) {
                      cylinder(r=hinge_radius, h=width*.66, center=true);
                  }
                }

            }
            translate([0, -1*hinge_y_offset, orient*(height/2)]) {
              rotate(a=[90,180,0]) translate([0,0,0.25]) {
                  _pin_hinge(width*.66, hinge_radius, orient>0?0:1);
              }
            }
        }
        union() {
            // the slot for the LEDs
        }
    }
}

module _pin_hinge(h, radius, is_top=0, clearance=0) {
    fingers=5; pin_radius=1.5; gap=0.75;
    total_gap=(fingers-1)*gap;
    unit_h=(h-total_gap)/fingers;
    rotate([-90,0,0]) rotate([0,90,0]) translate([0,-radius,-1*(h/2)+unit_h/2]) {
        for(i=[0:fingers-1]) {
            if (i%2>0 && is_top) {
                translate([0,0, gap*i+i*unit_h]) {
                    pin_hinge_unit(unit_h, radius, pin_radius, i);
                    translate([radius-1,radius*2,0]) #cube([radius*1.5, radius, unit_h], center=true);
                }
            }
            if (i%2==0 && !is_top) {
                translate([0,0, gap*i+i*unit_h]) {
                    pin_hinge_unit(unit_h, radius, pin_radius, i);
                    translate([-1*(radius-1),radius*2,0]) #cube([radius*1.5, radius, unit_h], center=true);
                }
            }
        }
    }
}

module shell(width, length, height, orient=1) {
    difference() {
        union() {
            //cube([2,length, 2], center=true);
            hull() {
                linear_extrude(height=height+wall, center=true) {
                    offset(radius_xy) square([width-radius_xy*2+wall*2, length], center=true);
                }
                translate([0,length/2-wall,0]) {
                    difference() {
                        resize([width, width/2, height]) cylinder(d=width, height=height, center=true);
                        translate([0,-width/4,0]) cube([width, width/2, height], center=true);
                    }
                }
            }
        }
        translate([0,0,orient*wall]) {
            translate([0,length/2-inset, orient*wall]) {
                difference() {
                    resize([width-wall, width/2-wall*4, height], auto=true) cylinder(d=width, height=height, center=true);
                    translate([0,-width/4+wall*2,0]) cube([width-wall, width/2-wall*4, height], center=true);
                }
            }
            cube([width, length, height], center=true);
        }
    }
    translate([0,length/2+wall,0]) {
        cube([width*0.75, wall*2, height], center=true);
    }
}

module radiused_cube(dims, radii, center=true) {
    // radiused box sized to *outer* dimensions
    // flatten the radii to 1/2 height
    rad_x=radii[0];
    rad_y=radii[1];
    rad_z=radii[2];
    w=dims[0]; l=dims[1]; h=dims[2];

    translate([-w/2,-l/2,-h/2]) hull() {
        for(z=[0:1]) {
            translate([rad_x,rad_y,z==0?rad_z:h-rad_z]) {
                resize(newsize=[rad_x, rad_y, rad_z]) sphere(rad_x, center=true);
            }
            translate([w-rad_x,rad_y,z==0?rad_z:h-rad_z]) {
                resize(newsize=[rad_x, rad_y, rad_z]) sphere(rad_x, center=true);
            }
            translate([rad_x,l-rad_y,z==0?rad_z:h-rad_z]) {
                resize(newsize=[rad_x, rad_y, rad_z]) sphere(rad_x, center=true);
            }
            translate([w-rad_x,l-rad_y,z==0?rad_z:h-rad_z]) {
                resize(newsize=[rad_x, rad_y, rad_z]) sphere(rad_x, center=true);
            }
        }
    }
}

module button(radius, length, depth) {
    gap=1;
    difference() {
        linear_extrude(height=depth, twist=0, center=true) {
            difference() {
                offset(r=radius_xy+gap) {
                    circle(radius, center = true);
                    translate([0, 10, 0]) square([radius, radius*2.5], center = true);
                }
                offset(r=radius_xy) {
                    circle(radius, center = true);
                    translate([0, 10, 0]) square([radius, radius*2.5], center = true);
                }
            }
        }
        translate([0,  radius*2.5, 0]) cube([radius*2, radius_xy+gap, depth], center=true);
    }
}


module hanger() {
    hull() {
        translate([w/2, 0, h]) resize([width, width*0.66, radius*4]) #sphere(radius, center=true);
        translate([w/2, 10, h]) resize([width, width*0.66, radius*4]) #sphere(radius, center=true);
    }
}

module charge_port(width, height, wall) {
    radius=height/2;
    rotate([90, 0, 0]) hull() {
        translate([-width/2+radius, 0, 0]) cylinder(r=radius, h=wall, $fn=16);
        translate([width/2-radius, 0, 0]) cylinder(r=radius, h=wall, $fn=16);
    }
}


