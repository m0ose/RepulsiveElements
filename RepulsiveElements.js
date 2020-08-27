/***
 *
 * Make elements avoid your mouse.
 *
 * Cody Smith 2020
 *
 *
 *
 * */

export class RepulsiveElements {
  constructor(element, opts = {}) {
    const config = {
      textSplitter: "",
      friction: 0.09,
      springK: 1,
      mouseK: 0.1,
      scrollK: 0.3,
      ...opts,
    };
    this.friction = config.friction;
    this.springK = config.springK;
    this.mouseK = config.mouseK;
    this.scrollK = config.scrollK;
    this.mouseDecay = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    // Seperate words iinto spererate elements
    const bees1 = elementizeStrings(element, config.textSplitter);
    this.hive = bees1.map((b) => new Bee(b, element));

    element.addEventListener("mousemove", (ev) => {
      var rect = element.getBoundingClientRect();

      var x = ev.clientX - rect.left; //x position within the element.
      var y = ev.clientY - rect.top; //y position within the element.
      this.moveMouse(x, y);
    });
    this.lastScrollPosition = 0;
    window.addEventListener("scroll", (e) => {
      const y = window.scrollY;
      const change = this.lastScrollPosition - y;
      this.hive.forEach((b) => {
        b.y = b.y - this.scrollK * change;
      });
      this.lastScrollPosition = y;
    });
    this.animate();
  }

  animate() {
    this.step(this.friction, this.springK, this.mouseK);
    this.moveElements();
    requestAnimationFrame(this.animate.bind(this));
  }

  moveMouse(mouseX, mouseY) {
    this.mouseDecay = 100;
    this.mouseX = mouseX;
    this.mouseY = mouseY;
  }

  step(friction, springForce = 1, mouseForceK = 0.01) {
    this.hive.forEach((b) => {
      const dispX = b.x; //- b.originX;
      const dispY = b.y; //- b.originY;
      b.vx += -1 * springForce * friction * dispX; //elastic return
      b.vy += -1 * springForce * friction * dispY;
      const mdx = b.originX + b.w / 2 + b.x - this.mouseX; //mouse force
      const mdy = b.originY + b.h / 2 + b.y - this.mouseY;
      const md = Math.max(0.0001, Math.hypot(mdx, mdy)); //displacement from mouse
      const mouseForce = mouseForceK / Math.pow(md / this.mouseDecay, 2);
      b.vx += (mdx / md) * mouseForce;
      b.vy += (mdy / md) * mouseForce;
      b.vx = b.vx * (1 - friction); //friction
      b.vy = b.vy * (1 - friction);
      b.x += b.vx;
      b.y += b.vy;
      if (isNaN(b.vx)) {
        console.log(b);
      }
    });
    this.mouseDecay = Math.max(0, this.mouseDecay - 1);
  }

  moveElements() {
    this.hive.forEach((b) => {
      // dont update if not moving for energy saving
      if (Math.hypot(b.x, b.y) > 0.01 || Math.hypot(b.vx, b.vy) > 0.01) {
        const x = Math.round(b.x);
        const y = Math.round(b.y);
        b.element.style.transform = `translate(${x}px,${y}px)`; //`matrix3d(1, 0, 0, ${b.x}, 0, 1, 0, ${b.y}, 0, 0, 1, 0, 0, 0, 0, 1);`;
      }
    });
  }
}

class Bee {
  constructor(element, boundingElement) {
    const pp = boundingElement.getBoundingClientRect();
    const pe = element.getBoundingClientRect();
    this.w = pe.width;
    this.h = pe.height;
    this.originX = pe.left - pp.left;
    this.originY = pe.top - pp.top;
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.element = element;
  }
}

function elementizeStrings(element, textSplitter, recursiveDepth = 6) {
  const childElements = Array.from(element.childNodes);
  element.textContent = undefined;
  let elems = [];
  childElements.forEach((a) => {
    if (a.nodeType == 3) {
      //text Node
      const spans = textToSpans(a.wholeText, textSplitter);
      elems = elems.concat(spans);
      spans.forEach((b) => {
        element.appendChild(b);
      });
    } else {
      //regular node
      if (recursiveDepth > 0) {
        const subElements = elementizeStrings(
          a,
          textSplitter,
          recursiveDepth - 1
        );
        elems = elems.concat(subElements);
        element.appendChild(a);
      } else {
        elems.push(a);
        element.appendChild(a);
      }
    }
  });
  return elems;
}

function textToSpans(text, splitter) {
  let text1 = text.replace(/\s{2,}/g, " "); // remove extra whitespace

  if (!splitter) splitter = "";
  if (splitter.length == 0) text1 = Array.from(text1);
  else {
    text1 = text1.split(splitter);
    text1 = text1.reduce((acc, cur) => {
      const split2 = splitter;
      return acc.concat([cur, split2]);
    }, []);
    //   text1 = text1.replace(/\s/g, "&nbsp;");
  }

  const result = [];
  text1.forEach((v) => {
    const elm = document.createElement("span");
    elm.style.display = "inline-block";
    elm.style["white-space"] = "pre";
    elm.textContent = v;
    result.push(elm);
  });
  return result;
}
