(function(){const canvas=document.getElementById('shader-canvas-ANIMATION_2');function syncSize(){const w=canvas.clientWidth||1280;const h=canvas.clientHeight||720;if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}}
if(typeof ResizeObserver!=='undefined'){new ResizeObserver(syncSize).observe(canvas)}
syncSize();const gl=canvas.getContext('webgl')||canvas.getContext('experimental-webgl');if(!gl)return;const vs=`attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;const fs=`precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
varying vec2 v_texCoord;

void main() {
    vec2 uv = v_texCoord;
    float t = u_time * 0.3;
    vec3 color1 = vec3(0.02, 0.05, 0.15); // Deep Navy
    vec3 color2 = vec3(0.3, 0.1, 0.5);   // Purple
    vec3 color3 = vec3(0.0, 0.4, 0.8);   // Blue
    vec3 color4 = vec3(0.6, 0.0, 0.2);   // Crimson
    
    float n1 = sin(uv.x * 3.0 + t) * cos(uv.y * 2.0 - t * 0.5);
    float n2 = sin(uv.y * 4.0 - t * 0.8) * cos(uv.x * 5.0 + t * 0.3);
    float n3 = sin((uv.x + uv.y) * 2.0 + t);
    
    vec3 color = color1;
    color = mix(color, color2, smoothstep(0.1, 0.8, n1 * 0.5 + 0.5) * 0.3);
    color = mix(color, color3, smoothstep(0.2, 0.9, n2 * 0.5 + 0.5) * 0.2);
    color = mix(color, color4, smoothstep(0.3, 1.0, n3 * 0.5 + 0.5) * 0.15);
    
    float dist = distance(uv, vec2(0.5));
    color *= 1.2 - dist;
    
    gl_FragColor = vec4(color, 1.0);
}`;function cs(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return s}
const prog=gl.createProgram();gl.attachShader(prog,cs(gl.VERTEX_SHADER,vs));gl.attachShader(prog,cs(gl.FRAGMENT_SHADER,fs));gl.linkProgram(prog);gl.useProgram(prog);const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);const pos=gl.getAttribLocation(prog,'a_position');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,!1,0,0);const uTime=gl.getUniformLocation(prog,'u_time');const uRes=gl.getUniformLocation(prog,'u_resolution');const uMouse=gl.getUniformLocation(prog,'u_mouse');let mouse={x:canvas.width/2,y:canvas.height/2};window.addEventListener('mousemove',(event)=>{const rect=canvas.getBoundingClientRect();if(rect.width&&rect.height){const nx=(event.clientX-rect.left)/rect.width;const ny=1.0-(event.clientY-rect.top)/rect.height;mouse.x=nx*canvas.width;mouse.y=ny*canvas.height}});function render(t){if(typeof ResizeObserver==='undefined')syncSize();gl.viewport(0,0,canvas.width,canvas.height);if(uTime)gl.uniform1f(uTime,t*0.001);if(uRes)gl.uniform2f(uRes,canvas.width,canvas.height);if(uMouse)gl.uniform2f(uMouse,mouse.x,mouse.y);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);requestAnimationFrame(render)}
render(0)})();const observerOptions={root:null,rootMargin:'0px',threshold:0.1};const observer=new IntersectionObserver((entries,observer)=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}})},observerOptions);document.querySelectorAll('.reveal-on-scroll').forEach((el)=>{observer.observe(el)});const nav=document.querySelector('nav');window.addEventListener('scroll',()=>{if(window.scrollY>50){nav.classList.add('bg-[#050505]/80');nav.classList.remove('bg-transparent')}else{nav.classList.remove('bg-[#050505]/80');nav.classList.add('bg-transparent')}});const cards=document.querySelectorAll('.stacked-card');window.addEventListener('scroll',()=>{cards.forEach((card,index)=>{const rect=card.getBoundingClientRect();const maxScroll=window.innerHeight*0.8;const progress=Math.max(0,Math.min(1,(100-rect.top)/maxScroll));if(rect.top<=100){const scale=1-(progress*0.05);card.style.transform=`scale(${scale})`;card.style.filter=`brightness(${1 - (progress * 0.5)})`}else{card.style.transform=`scale(1)`;card.style.filter=`brightness(1)`}})});const hamburgerBtn=document.getElementById('hamburger-btn');const mobileDrawer=document.getElementById('mobile-drawer');const hbLine1=document.getElementById('hb-line1');const hbLine2=document.getElementById('hb-line2');const hbLine3=document.getElementById('hb-line3');let menuOpen=!1;function openMenu(){menuOpen=!0;mobileDrawer.style.display='flex';document.body.style.overflow='hidden';hbLine1.style.transform='translateY(7px) rotate(45deg)';hbLine2.style.opacity='0';hbLine3.style.transform='translateY(-7px) rotate(-45deg)'}
function closeMenu(){menuOpen=!1;mobileDrawer.style.display='none';document.body.style.overflow='';hbLine1.style.transform='';hbLine2.style.opacity='1';hbLine3.style.transform=''}
if(hamburgerBtn){hamburgerBtn.addEventListener('click',()=>{if(menuOpen)closeMenu();else openMenu()})}
document.querySelectorAll('.mobile-nav-link').forEach(link=>{link.addEventListener('click',closeMenu)})
