use <pin-hinge.scad>;
width=40;
length=66;
height=17.5;
lid_height=5;
wall=1.5;
r=wall*2;
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
            #top_strap(width/3);
        }
    }
}

// the lid
translate([1.2*width/2,0,lid_height/2+wall]) rotate([0,180,0]) {
    difference() {
        union() {
            hinged_box(width, length, lid_height, -1);
        }
        translate([0,12,lid_height/2+wall]) rotate(180) button(10,36,wall*2);
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
    translate([0,0,inset*2]) union() {
        union() {
            cube([strap_w, strap_len, height-wall], center=true);
            translate([0,0,-height/2+inset*2]) {
                rotate([0,0,90]) outer_ridges(inset, strap_w, [strap_len, strap_w, height]);
            }
        }
        translate([0,0,-wall/2]) #cube([strap_w, strap_len-2*wall, height-wall*2], center=true);
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
            translate([-radius/2,0,0]) #cube([radius, length, radius*2], center=true);
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
    difference() {
        union() {
            shell(width, length, height, r, orient);
            clearance=wall;
            translate([0,-1*(length/2+r+clearance),orient*(height/2+r/2)]) {
              rotate(a=[90,180,0]) translate([0,0,0.25]) {
                  _pin_hinge(width*.66, 4, orient>0?0:1);
              }
            }
        }
        union() {
            translate([0,0,orient*wall]) radiused_cube([width, length, height+r*2], r/2);
        }
    }
}

module _pin_hinge(h, radius, is_top=0) {
    fingers=5; pin_radius=1.5; gap=0.75;
    total_gap=(fingers-1)*gap;
    unit_h=(h-total_gap)/fingers;
    rotate([-90,0,0]) rotate([0,90,0]) translate([0,-radius,-1*(h/2)+unit_h/2]) {
        for(i=[0:fingers-1]) {
            if (i%2>0 && is_top) {
                translate([0,0, gap*i+i*unit_h]) pin_hinge_unit(unit_h, radius, pin_radius, i);
            }
            if (i%2==0 && !is_top) {
                translate([0,0, gap*i+i*unit_h]) pin_hinge_unit(unit_h, radius, pin_radius, i);
            }
        }
    }
}

module shell(width, length, height, r, orient=1) {
    // hollow box sized to interior dimension
    // w. thicker end walls
    difference() {
        radiused_cube([width+wall*2, length+wall*4, height+wall*2], r);
        translate([0,0,orient*r/2]) radiused_cube([width, length, height+r], r);
    }
}

module radiused_cube(dims, radius, center=true) {
    // radiused box sized to *outer* dimensions
    w=dims[0]; l=dims[1]; h=dims[2];
    offset=radius;
    translate([-w/2,-l/2,-h/2]) hull() {
        for(z=[0:1]) {
            translate([offset,offset,z==0?offset:h-offset]) sphere(radius, center=true);
            translate([w-offset,offset,z==0?offset:h-offset]) sphere(radius, center=true);
            translate([offset,l-offset,z==0?offset:h-offset]) sphere(radius, center=true);
            translate([w-offset,l-offset,z==0?offset:h-offset]) sphere(radius, center=true);
        }
    }
}

module button(radius, length, depth) {
    gap=1;
    difference() {
        linear_extrude(height=depth, twist=0, center=true) {
            difference() {
                offset(r=r+gap) {
                    circle(radius, center = true);
                    translate([0, 10, 0]) square([radius, radius*2.5], center = true);
                }
                offset(r=r) {
                    circle(radius, center = true);
                    translate([0, 10, 0]) square([radius, radius*2.5], center = true);
                }
            }
        }
        translate([0,  radius*2.5, 0]) #cube([radius*2, r+gap, depth], center=true);
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


