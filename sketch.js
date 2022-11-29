let fbo_u0;
let fbo_u1;
let fbo_s0;
let fbo_s1;
let fbo_source;
let fbo_temp;

let display_mouse_shader;
let add_forces_shader;
let lin_solve_shader;
let shdr2;
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
    fbo_u0 = new p5Fbo({renderer: canvas, width: DIM, height: DIM, wrapMode: REPEAT, floatTexture: true});
    fbo_u1 = new p5Fbo({renderer: canvas, width: DIM, height: DIM, wrapMode: REPEAT, floatTexture: true});
    fbo_source = new p5Fbo({renderer: canvas, width: DIM, height: DIM, wrapMode: REPEAT, floatTexture: true});
    fbo_temp = new p5Fbo({renderer: canvas, width: DIM, height: DIM, wrapMode: REPEAT, floatTexture: true});
    // fbo2 = new p5Fbo({renderer: canvas, width: DIM, height: DIM, floatTexture: true});
    frameRate(FPS);
    // Lets load a shader as well. 
    display_mouse_shader = loadShader("sketch.vert", "display_mouse_pos.frag");
    add_forces_shader = loadShader("sketch.vert", "add_forces.frag");
    lin_solve_shader = loadShader("sketch.vert", "lin_solve.frag");
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
    sstep(fbo_s0, fbo_s1, fbo_source, fbo_u0);

    // fbo_s0.begin();
    // add_forces_shader.setUniform("field", fbo_s0.getTexture());
    // add_forces_shader.setUniform("forces", fbo_source.getTexture());
    // add_forces_shader.setUniform("dt", 1.0 / FPS);
    // clear();
    // shader(add_forces_shader);
    // quad(-1, -1, 1, -1, 1, 1, -1, 1);
    // fbo_s0.end();

    fbo_s0.draw();


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

// def linSolve(self, x, x_prev, a, c, iters=20):
    // # solve for x using Gauss-Seidel relaxation
    // for i in range(iters):
    //     x[:] = (x_prev + a * (np.roll(x, 1, axis=-2) + np.roll(x, -1, axis=-2) + np.roll(x, 1, axis=-1) + np.roll(x, -1, axis=-1))) / (c)

function sstep(scalar, scalar_prev, source, vel) {
    // ADD FORCES
    fbo_temp.begin();
    add_forces_shader.setUniform("field", scalar.getTexture());
    add_forces_shader.setUniform("forces", source.getTexture());
    add_forces_shader.setUniform("dt", DT);
    clear();
    shader(add_forces_shader);
    quad(-1, -1, 1, -1, 1, 1, -1, 1);
    fbo_temp.end();
    fbo_temp.copyTo(scalar);

    // DIFFUSE
    let a = DIFF * DIM * DIM * DT;
    // scalar_prev, scalar = scalar, scalar_prev;
    linSolve(scalar_prev, scalar, a, 1.0 + 4.0*a);

    // scalar_prev, scalar = scalar, scalar_prev;
    scalar_prev.copyTo(scalar);
    // ADVECT
    // advect(scalar_prev, scalar, vel);
}

function vstep(u, u_prev) {
    u.begin();
    add_forces_shader.setUniform("field", u.getTexture());
    clear();
    shader(add_forces_shader);
    quad(-1, -1, 1, -1, 1, 1, -1, 1);
    u.end();

    // u += self.dt * F
    // u, u_prev = u_prev, u
    // let a = VISC * DIM * DIM / FPS;
    // self.linSolve(u, u_prev, a, 1 + 4*a)
    // self.project(u, u_prev)
    // u, u_prev = u_prev, u
    // self.advect(u[0], u_prev[0], u_prev)
    // self.advect(u[1], u_prev[1], u_prev)
    // self.project(u, u_prev)
}