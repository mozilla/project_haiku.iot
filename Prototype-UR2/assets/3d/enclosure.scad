use <pin-hinge.scad>;
width=40;
length=66;
height=17.5;
lid_height=5;
wall=1.5;
r=wall*2;

translate([-1.2*width/2,0,0]) {
    difference() {
        hinged_box(width, length, 10, 1);
        translate([0, -length/2, -2]) {
            charge_port(10, 5, wall);
        }
    }
}
translate([1.2*width/2,0,0]) rotate([0,180,0]) {
    difference() {
        union() {
            hinged_box(width, length, 10, -1);
        }
        translate([0,12,5+wall]) rotate(180) button(10,36,wall*2);
    }

}

module hinged_box(width, length, height, orient) {
    difference() {
        union() {
            shell(width, length, height, r, orient);
            clearance=wall+1;
            translate([0,-1*(length/2+r),orient*(height-3.25)]) {
              rotate(a=[90,180,0]) translate([0,0,0.25]) {
                  _pin_hinge(width*.66, 4, orient>0?0:1);
              }
            }
        }
        union() {
            #translate([0,0,orient*wall]) outer_box(width, length, height+r*2, r/2);
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
    difference() {
        radiused_cube([width+wall*2, length+wall*2, height+wall*2], r);
        translate([0,0,orient*r/2])#radiused_cube([width, length, height+r], r);
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


