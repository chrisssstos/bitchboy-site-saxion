# Homepage Model, Text and Lines Animations Guide

Below is a casual, step-by-step guide you change the model’s scroll-based animations, lines/text, and the scroll text. I'll walk through each file, explain what does what, and show you where to make modifications :D
#### ps (this is not a guide for the model that is stationary and that u can drag around u can change that directly in the ModelSpin.jsx)

ㅤ
## 1. Changing the Model’s Position & Animations on Scroll

**Path:**
```
\src\components\jsx\LandingPage\ModelScrollAnimated.jsx
```

**What’s Happening Here?**
- This file handles the 3D model animations when the user scrolls (like scaling, rotating, positioning, and fading).  
- It divides the animations into “sections” named something like `sectionStart`, `sectionIntro`, etc., each with a start and end scroll percentage, for example `start: 0.2, end: 0.35` aka 20% or 35%.
- For each section, you can set:  
    - **position** (x, y, z in 3D space)  
    - **rotation** (angles in radians)  
    - **scale** (size on each axis)  
    - **opacity** (transparency)

**Important Lines to Look For for Example:**
```jsx
const ANIMATION_CONFIG = {
    sectionIntro: {
        start: 0.2,
        end: 0.35,
        position: { x: -1.5, y: -1, z: 3 },
        rotation: { x: 0.3, y: Math.PI / 5, z: 0 },
        scale: { x: 1.5, y: 1.5, z: 1.5 },
        opacity: 1,
    },
    ...
};
```

**How to Adjust:**
1. **Position**: Find the relevant section (e.g., `sectionIntro`) and change `position.x, position.y, position.z`.
2. **Rotation**: Adjust `rotation.x, rotation.y, rotation.z` (remember `Math.PI / 2` is 90° for example).
3. **Scale**: Tweak `scale.x, scale.y, scale.z` to make the model bigger or smaller.
4. **Timing**: Change the `start` and `end` values to control when the animation begins or ends during scroll.

#### Rememeber there is the mobile version below it where only necessary changes are made since it copies the default set values for desktop.

#### If you wanna create new animation frames then dont forget to update the getAnimationState add it there too as well as other places that seem logical.
ㅤ
## 2. Changing the Lines & Their Text

**Path:**
```
\src\components\jsx\LandingPage\ModelLines.jsx
```

**What’s Happening Here?**
- This file controls lines of text that appear at certain scroll ranges, like “Designed for speed...” or “Control key parameters...”.
- Each line or text block is revealed when certain scroll conditions are met, for example:
    ```jsx
    if (scrollProgress >= 0.40 && scrollProgress <= 0.60) {
        setShowLines1(true);
    } else {
        setShowLines1(false);
    }
    ```
- Positions are set in `desktopStyles` or `mobileStyles` objects, with properties like `top`, `left`, `width`, etc.

**Important Lines to Look For:**
- The scroll condition:
    ```jsx
    if (scrollProgress >= 0.40 && scrollProgress <= 0.60) {
        ...
    }
    ```
    Adjust these to decide when the lines appear.
- Each line’s style:
    ```js
    line1_1: {
        transform: 'rotate(5deg)',
        top: '30%',
        left: '35%',
        width: '350px',
        ...
    }
    ```
    Changing `top`, `left`, `width`, etc. will move or resize the line. `transform: 'rotate(...)'` rotates it.

**Text Content**: Look for `<span className="line-text">` and replace the text inside with your own.


ㅤ

## 3. Changing the Scroll Text

**Path:**
```
\src\components\jsx\LandingPage\ScrollText.jsx
```

**What’s Happening Here?**
- `ScrollText` shows a block of text and an image that fades or slides in/out between certain scroll percentages.
- Currently it’s visible between scroll fractions `0.1` and `0.20`, defined by:
    ```jsx
    if (scrollProgress >= 0.1 && scrollProgress <= 0.20) {
        setShowText(true);
    } else {
        setShowText(false);
    }
    ```
- It uses inline styling to handle things like `opacity` and `transform`.

**How to Adjust:**
1. **Scroll Range**: In the snippet above, try changing `0.1` and `0.20` if you want the text at different points in the page scroll.
2. **Text Content**: The `<h2>` and `<p>` tags contain “What’s a BitchBoy?” and the description. Just replace that text with anything you like.
3. **Position & Style**: 
     ```jsx
     style={{
         margin: '150px auto 0',
         transform: `translate(-50%, -50%) ${...}`
     }}
     ```
     - Increase `150px` to push the text block further down.  
     - `transform: translateX(300px)` or different values can move it horizontally.  
     - Changing the `transition: 'opacity 0.4s ease, transform 0.4s ease'` modifies how quickly it animates in/out.

---

## Final Tips
- Basically all code for animations uses scroll fraction (`scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight)`). That means `1.0` is the bottom of the page, and `0.0` is the top.
- If you see something like `0.40` to `0.60`, that means 40% to 60% down the page. Play around with these numbers to shift animations or text up or down the scroll timeline.
- For major 3D changes (size, rotation, position), edit the objects in `ModelScrollAnimated.jsx` within the `ANIMATION_CONFIG` or `SMALL_SCREEN_ANIMATION_CONFIG`.tweak it and see how it moves.
- For text lines, jump into `ModelLines.jsx` and adjust the `desktopStyles` or `mobileStyles` (depending on your screen size).
- For scroll-based text blocks, go to `ScrollText.jsx` and tweak the content and style in the return statement.
- This guide should help anyone jump in and quickly edit the layout, timing, and animations for the homepage’s 3D model and text elements.

**Alot of styling and stuff is found in the LandingPage.css so go there for some extra styling for things on the page even the animations and text.**

**Also go to LandingPage.jsx for changing something like the size of the page meaning more scroll time or less etc...**

**Smthing like this:**

    <div
      style={{
        minHeight: "1200vh",  <- change this line for scroll amount aka page size
        minWidth: "100vw",
        background: "#ffffff",
        position: "relative",
      }}
    >