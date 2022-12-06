let fbo_ux0;
let fbo_ux1;
let fbo_uy0;
let fbo_uy1;
let fbo_s0;
let fbo_s1;
let fbo_source;
let fbo_force;
let fbo_temp;

let display_mouse_shader;
let add_forces_shader;
let lin_solve_shader;
let advect_shader;
let shdr2;
let frame = 0;
const FPS = 30;
const DT = 0.5;
const DIM = 512;
const VISC = 0.00001;
const DIFF = 0.00005;
const ITERS = 8; // MUST BE EVEN FOR LINSOLVE

function setup() {
    const canvas = createCanvas(DIM, DIM, WEBGL);
    fbo_s0 = new p5Fbo({renderer: canvas, width: DIM, height: DIM, wrapMode: REPEAT, floatTexture: true});
    fbo_s1 = new p5Fbo({renderer: canvas, width: DIM, height: DIM, wrapMode: REPEAT, floatTexture: true});
    fbo_ux0 = new p5Fbo({renderer: canvas, width: DIM, height: DIM, wrapMode: REPEAT, floatTexture: true});
    fbo_ux1 = new p5Fbo({renderer: canvas, width: DIM, height: DIM, wrapMode: REPEAT, floatTexture: true});
    fbo_uy0 = new p5Fbo({renderer: canvas, width: DIM, height: DIM, wrapMode: REPEAT, floatTexture: true});
    fbo_uy1 = new p5Fbo({renderer: canvas, width: DIM, height: DIM, wrapMode: REPEAT, floatTexture: true});
    fbo_source = new p5Fbo({renderer: canvas, width: DIM, height: DIM, wrapMode: REPEAT, floatTexture: true});
    fbo_force = new p5Fbo({renderer: canvas, width: DIM, height: DIM, wrapMode: REPEAT, floatTexture: true});
    fbo_temp = new p5Fbo({renderer: canvas, width: DIM, height: DIM, wrapMode: REPEAT, floatTexture: true});
    // fbo2 = new p5Fbo({renderer: canvas, width: DIM, height: DIM, floatTexture: true});
    frameRate(FPS);
    // Lets load a shader as well. 
    display_mouse_shader = loadShader("sketch.vert", "display_mouse_pos.frag");
    add_forces_shader = loadShader("sketch.vert", "add_forces.frag");
    lin_solve_shader = loadShader("sketch.vert", "lin_solve.frag");
    advect_shader = loadShader("sketch.vert", "advect.frag");
    // shdr2 = loadShader("sketch.vert", "change_color.frag");
}

function draw() {
    noStroke();

    let mouse_x = map(mouseX, 0, width, -1, 1);
    let mouse_y = map(mouseY, 0, height, 1, -1);

    fbo_source.begin();
    display_mouse_shader.setUniform("mouse", [mouse_x, mouse_y]);
    clear();
    shader(display_mouse_shader);
    quad(-1, -1, 1, -1, 1, 1, -1, 1);
    fbo_source.end();

    // vstep(fbo_u0, fbo_u1);
    if (frame % 2 == 0) {
        vstep(fbo_ux0, fbo_uy0, fbo_ux1, fbo_uy1, fbo_force);
    } else {
        vstep(fbo_ux1, fbo_uy1, fbo_ux0, fbo_uy0, fbo_force);
    }
    sstep(fbo_s0, fbo_s1, fbo_source, fbo_ux0, fbo_uy0);

    fbo_s0.draw();

    frame++;


    // shdr2.setUniform("inputTexture", fbo.getTexture());

    // fbo2.begin();
    // clear();
    // shader(shdr2);
    // quad(-1, -1, 1, -1, 1, 1, -1, 1);
    // fbo2.end();

    
    // shdr.setUniform("time", frameCount/FPS);
    
  
    // // Now we need to draw the fbo to the screen. 
    // fbo2.draw();
}

function linSolve(x, x_prev, a, c) {
    // TODO: WHY DOES C NOT WORK IN THE SHADER? WTF??
    // console.log(c);
    // lin_solve_shader.setUniform("norm_const", c);
    lin_solve_shader.setUniform("a", a);
    lin_solve_shader.setUniform("resolution", 1.0 / DIM);
    lin_solve_shader.setUniform("x_prev", x_prev.getTexture());
    // x_prev.copyTo(x);
    for (let k = 0; k < ITERS; k++) {
        if (k % 2 == 0) {
            fbo_temp.begin();
            lin_solve_shader.setUniform("x", x.getTexture());
            clear();
            shader(lin_solve_shader);
            quad(-1, -1, 1, -1, 1, 1, -1, 1);
            fbo_temp.end();
        } else {
            x.begin();
            lin_solve_shader.setUniform("x", fbo_temp.getTexture());
            clear();
            shader(lin_solve_shader);
            quad(-1, -1, 1, -1, 1, 1, -1, 1);
            x.end();
        }
    }
}

function advect(d, d0, ux, uy) {
    d.begin();
    advect_shader.setUniform("prev", d0.getTexture());
    advect_shader.setUniform("vel_x", ux.getTexture());
    advect_shader.setUniform("vel_y", uy.getTexture());
    advect_shader.setUniform("dt", DT);
    clear();
    shader(advect_shader);
    quad(-1, -1, 1, -1, 1, 1, -1, 1);
    d.end();
}

function project(ux, uy, ux_prev, uy_prev) {
    let h = 1.0 / DIM;
    ux_prev.begin();
    clear(0, 0, 0, 1);
    quad(-1, -1, 1, -1, 1, 1, -1, 1);
    ux_prev.end();
    project_shader_1.setUniform("h", h);
    project_shader_1.setUniform("resolution", DIM);
    uy_prev.begin();
    project_shader_1.setUniform("vel_x", ux.getTexture());
    project_shader_1.setUniform("vel_y", uy.getTexture());
    clear();
    shader(project_shader_1);
    quad(-1, -1, 1, -1, 1, 1, -1, 1);
    uy_prev.end();
    linSolve(ux_prev, uy_prev, 1, 4);
    project_shader_2.setUniform("h", h);
    project_shader_2.setUniform("resolution", DIM);
    project_shader_3.setUniform("h", h);
    project_shader_3.setUniform("resolution", DIM);
    fbo_temp.begin();
    project_shader_2.setUniform("input", ux.getTexture());
    project_shader_2.setUniform("p", ux_prev.getTexture());
    clear();
    shader(project_shader_2);
    quad(-1, -1, 1, -1, 1, 1, -1, 1);
    fbo_temp.end();
    fbo_temp.copyTo(ux);
    fbo_temp.begin();
    project_shader_3.setUniform("input", uy.getTexture());
    project_shader_3.setUniform("p", uy_prev.getTexture());
    clear();
    shader(project_shader_3);
    quad(-1, -1, 1, -1, 1, 1, -1, 1);
    fbo_temp.end();
    fbo_temp.copyTo(uy);
}

// def project(self, u, u_prev):
//     h = 1 / self.gridsize
//     u_prev[0] = 0
//     u_prev[1] = -0.5 * h * (np.roll(u[0], 1, axis=-2) - np.roll(u[0], -1, axis=-2) + np.roll(u[1], -1, axis=-1) - np.roll(u[1], 1, axis=-1))
//     self.linSolve(u_prev[0], u_prev[1], 1, 4)
//     u[0] -= 0.5 * (np.roll(u_prev[0], 1, axis=0) - np.roll(u_prev[0], -1, axis=0)) / h
//     u[1] -= 0.5 * (np.roll(u_prev[0], 1, axis=1) - np.roll(u_prev[0], -1, axis=1)) / h

function add_forces(input, out, forces) {
    out.begin();
    add_forces_shader.setUniform("field", input.getTexture());
    add_forces_shader.setUniform("forces", forces.getTexture());
    add_forces_shader.setUniform("dt", DT);
    clear();
    shader(add_forces_shader);
    quad(-1, -1, 1, -1, 1, 1, -1, 1);
    out.end();
}

// def linSolve(self, x, x_prev, a, c, iters=20):
    // # solve for x using Gauss-Seidel relaxation
    // for i in range(iters):
    //     x[:] = (x_prev + a * (np.roll(x, 1, axis=-2) + np.roll(x, -1, axis=-2) + np.roll(x, 1, axis=-1) + np.roll(x, -1, axis=-1))) / (c)

function sstep(scalar, scalar_prev, source, vel_x, vel_y) {
    // ADD FORCES
    add_forces(scalar, fbo_temp, source);
    fbo_temp.copyTo(scalar);
    // DIFFUSE
    let a = DIFF * DIM * DIM * DT;
    linSolve(scalar_prev, scalar, a, 1.0 + 4.0*a);
    // ADVECT
    advect(scalar, scalar_prev, vel_x, vel_y);
}


// def vstep(self, u, u_prev, F):
//     u += self.dt * F
//     u, u_prev = u_prev, u
//     a = self.dt * self.visc * self.gridsize * self.gridsize
//     self.linSolve(u, u_prev, a, 1 + 4*a)
//     self.project(u, u_prev)
//     u, u_prev = u_prev, u
//     self.advect(u[0], u_prev[0], u_prev)
//     self.advect(u[1], u_prev[1], u_prev)
//     self.project(u, u_prev)

function vstep(ux, uy, ux_prev, uy_prev, F) {
    // ADD FORCES
    add_forces(ux, fbo_temp, F);
    fbo_temp.copyTo(ux);
    add_forces(uy, fbo_temp, F);
    fbo_temp.copyTo(uy);
    // DIFFUSE
    let a = VISC * DIM * DIM * DT;
    linSolve(ux_prev, ux, a, 1.0 + 4.0*a);
    linSolve(uy_prev, uy, a, 1.0 + 4.0*a);
    // PROJECT
    project(ux_prev, uy_prev, ux, uy);
    // ADVECT
    advect(ux, ux_prev, ux_prev, uy_prev);
    advect(uy, uy_prev, ux_prev, uy_prev);
    // PROJECT
    project(ux, uy, ux_prev, uy_prev);
}