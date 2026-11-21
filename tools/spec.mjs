// What each control is, in one place. tools/docs.mjs turns this into every folder's README.md and index.html,
// registry.json and llms.txt, so they cannot drift apart. Edit here, then run `node tools/docs.mjs`.
export const REPO = 'Brajesh31/GrainMotion-UI';
export const SITE = 'https://brajesh31.github.io/GrainMotion-UI';
export const AUTHOR = 'Brajesh Kumar <https://github.com/Brajesh31>';
export const COUNT = 'fifty';

// Limits every control shares; each README ends with its own, then these.
export const COMMON_LIMITS = [
  '**Needs WebGL2** to draw the sand. Without it the control still works with keys and a screen reader, but nothing is drawn.',
  '**One live tray per element.** Each is its own WebGL canvas, and browsers keep only about sixteen alive at once, so it is not for long lists.',
  '**It does not hold still for `prefers-reduced-motion`.** The sand still moves. If that matters on your page, use a plain control there.',
  '**Drawn for a light page.** The sand and the walnut frame are warm and light; they look pasted on over a dark background.',
  '**The sand is simulated at one cell per CSS pixel,** so a wider element costs more. Each scales to its CSS `width`; the height follows.',
  '**Sound is on** after the first touch or key on the page. `GrainMotionUI.Sound.on = false` turns every control quiet.',
  '**Checked in headless Chromium** with real touch and key events, with the CPU slowed four times. Not tried in Safari or Firefox, on a real phone, or with a screen reader.',
];

export const SPEC = [
  {
    "id": "slider",
    "manualDocs": true,
    "name": "Slider",
    "tag": "sand-slider",
    "categories": [
      "slider",
      "range",
      "sand",
      "animation"
    ],
    "sub": "A rake in a tray of sand.",
    "desc": "A slider that is a bamboo rake in a tray of sand. Drag right and its four tines cut grooves and push a little heap of sand ahead of it; pull back and its back drags the sand flat again.",
    "docs": "then use <sand-slider value=\"40\" label=\"Volume\"></sand-slider>. Read el.value; it fires input while it moves and change when it comes to rest. min, max and step work; with a name it is sent with its form.",
    "intro": [
      "A slider that is a bamboo rake in a tray of sand. The rake is the thumb and the grooves behind it are the value. Drag it right and its four tines cut fresh lines, pushing a little heap of sand ahead of them that slumps when it stops. Pull it back and the back of the rake drags the sand level, so the tray only ever shows how far it has gone. Throw it at the end and it knocks against the frame. Double-click and it rakes the whole tray flat."
    ],
    "demo": {
      "html": "<div class=\"field\"><span class=\"lab\">Volume</span><output id=\"out\"></output></div>\n    <sand-slider id=\"el\" value=\"40\" label=\"Volume\"></sand-slider>",
      "hint": "Drag the rake and let go, then pull it back. Double-click to rake the tray flat.",
      "script": "const out = document.getElementById('out'); const show = () => out.textContent = el.value + '%'; el.addEventListener('input', show); show();"
    },
    "use": "<script src=\"slider.js\"></script>\n<sand-slider value=\"40\" label=\"Volume\"></sand-slider>",
    "js": "const el = document.querySelector('sand-slider');\nel.addEventListener('input', () => setVolume(el.value));   // while it moves\nel.addEventListener('change', () => save(el.value));      // when it comes to rest\nel.value = 80;        // the rake goes there and cuts on the way",
    "attrs": [
      [
        "`value`",
        "where it starts",
        "the `min`"
      ],
      [
        "`min`, `max`, `step`",
        "like a range input's",
        "0, 100, 1"
      ],
      [
        "`label`",
        "what a screen reader calls it",
        "Slider"
      ],
      [
        "`name`",
        "sent with its form",
        ""
      ]
    ],
    "notes": [
      "**The whole tray takes the pointer.** Press anywhere and the rake comes to that point. Dragging past an end pushes it into the frame.",
      "**A slider underneath:** `role=\"slider\"` with the value, minimum and maximum set, and arrow keys, Page Up and Down, Home and End.",
      "**The value is not drawn.** The grooves show how far it has gone; put the number beside it, as the demo does."
    ],
    "happens": [
      [
        "drag right",
        "four tines cut four grooves; the sand they move is pushed ahead as a heap that slumps to its angle of rest"
      ],
      [
        "drag left",
        "the back of the rake drags the grooves flat; what it collects is pushed ahead of it too"
      ],
      [
        "let go",
        "the rake stops under the finger; a soft settle of sand if it was moving"
      ],
      [
        "throw it at an end",
        "one knock against the frame, and the heap piles up against the rim"
      ],
      [
        "double-click",
        "the rake sweeps back to the start and the tray is flat again"
      ]
    ],
    "limits": [
      "**Four grooves, whatever the range.** The tray is drawn for a short row, about four to six times as wide as it is high."
    ]
  },
  {
    "id": "toggle",
    "manualDocs": true,
    "name": "Toggle",
    "tag": "sand-toggle",
    "categories": [
      "switch",
      "toggle",
      "sand",
      "animation"
    ],
    "sub": "A stone that hides a seal.",
    "desc": "A switch that is a river stone in a tray of raked sand. Switch it on and the stone glides along, parting the sand into a wake, and uncovers a power symbol it had pressed into the sand where it was resting.",
    "docs": "then use <sand-toggle label=\"Focus mode\"></sand-toggle>. Read el.checked and listen for change. Works in forms with a name.",
    "intro": [
      "A switch that is a river stone resting at one end of a pill-shaped tray of raked sand. The stone is also a seal: where it rests at the off end it has pressed a power symbol into the sand underneath it, so you cannot see it. Switch it on and the stone glides gently to the other end. It parts the sand as it goes, which rolls off to either side and trails behind it as a wake, and the symbol it was hiding is uncovered. Switch it off and the stone glides back over it. There is no colour for on: on is the symbol you can see."
    ],
    "demo": {
      "html": "<div class=\"field\"><span class=\"lab\">Focus mode</span><output id=\"out\"></output></div>\n    <sand-toggle id=\"el\" label=\"Focus mode\"></sand-toggle>",
      "hint": "Switch it on, then off. Or drag the stone part way and let go.",
      "script": "const out = document.getElementById('out'); const show = () => out.textContent = el.checked ? 'On' : 'Off'; el.addEventListener('change', show); show();"
    },
    "use": "<script src=\"toggle.js\"></script>\n<sand-toggle label=\"Focus mode\"></sand-toggle>",
    "js": "const el = document.querySelector('sand-toggle');\nel.addEventListener('change', () => setFocus(el.checked));\nel.checked = true;    // the stone glides there",
    "attrs": [
      [
        "`checked`",
        "starts on",
        "off"
      ],
      [
        "`label`",
        "what a screen reader calls it",
        "Toggle"
      ],
      [
        "`name`",
        "sent with its form when on",
        ""
      ],
      [
        "`value`",
        "what its form gets when it is on",
        "on"
      ]
    ],
    "notes": [
      "**A switch underneath:** `role=\"switch\"` with `aria-checked`. Click, Space or Enter switch it.",
      "**Drag the stone** part way and let go, and it glides on to the nearer end."
    ],
    "happens": [
      [
        "switch on",
        "the stone glides over about a second, eased in and out, pushing a bow of sand ahead and leaving a wake with ridges either side"
      ],
      [
        "when it gets there",
        "a soft thock as it settles, and the power symbol it was sitting on is in plain view"
      ],
      [
        "switch off",
        "it glides back the way it came and covers the symbol again"
      ],
      [
        "drag it part way",
        "the stone follows the finger; let go and it finishes the trip to the nearer end"
      ]
    ],
    "limits": [
      "**The symbol is a power symbol.** It is drawn in code, not taken from a font, and is not set by an attribute.",
      "**The wake stays.** Switch it often and the tray shows it, like a real one."
    ]
  },
  {
    "id": "signature",
    "manualDocs": true,
    "name": "Signature",
    "tag": "sand-signature",
    "categories": [
      "signature",
      "input",
      "drawing",
      "sand",
      "animation"
    ],
    "sub": "Sign your name with a stick.",
    "desc": "A signature pad of smoothed sand, written in with a stick that cuts like a brush: linger and the line is wide and deep, hurry and it thins. The sand heaps up along the line. Clear sends a rake across that smooths it all away.",
    "docs": "then use <sand-signature name=\"signature\"></sand-signature>. el.empty, el.undo(), el.clear() and el.toDataURL() give you the signature as ink on a transparent PNG; it fires input after each stroke. With a name its form gets the PNG.",
    "intro": [
      "A signature pad of smoothed sand. You write with a bamboo stick that cuts like a brush: linger and the line is wide and deep, hurry and it thins, and with a pen, pressing harder cuts wider. The sand it moves heaps up along both sides of the line, a quick flick throws a few grains, and the line tapers off as the stick lifts. Undo fills the last line back in. Clear sends a rake across the tray that smooths everything away, pushing a low ridge of sand ahead of it. What you get back is not a picture of sand: `toDataURL()` gives the signature as plain ink on a transparent PNG, ready for a document."
    ],
    "demo": {
      "html": "<sand-signature id=\"el\" name=\"signature\"></sand-signature>\n    <div class=\"row\"><button class=\"pill\" type=\"button\" id=\"undo\">Undo</button><button class=\"pill\" type=\"button\" id=\"clear\">Clear</button><button class=\"pill\" type=\"button\" id=\"done\">Done</button></div>\n    <img id=\"ink\" alt=\"\" hidden>",
      "hint": "Sign with a finger, a pen or the mouse. Done shows what a document would get.",
      "script": "const ink = document.getElementById('ink');\ndocument.getElementById('undo').onclick = () => el.undo();\ndocument.getElementById('clear').onclick = () => { el.clear(); ink.hidden = true; };\ndocument.getElementById('done').onclick = () => { if (el.empty) return; ink.src = el.toDataURL(); ink.hidden = false; };"
    },
    "use": "<script src=\"signature.js\"></script>\n<sand-signature name=\"signature\"></sand-signature>",
    "js": "const el = document.querySelector('sand-signature');\nel.addEventListener('input', () => submit.disabled = el.empty);\nconst png = el.toDataURL('#1f2a44');   // ink colour; a transparent PNG at twice the size\nel.undo(); el.clear();",
    "attrs": [
      [
        "`name`",
        "its form gets the signature as a PNG data URL",
        ""
      ],
      [
        "`aria-label`",
        "what a screen reader calls it",
        "Signature pad: draw your signature in the sand"
      ]
    ],
    "notes": [
      "**`el.strokes`** is the signature as points: one array per stroke of `[x, y, width]` in CSS pixels, if you want to keep it as data.",
      "**Keys:** Backspace undoes the last stroke and Delete clears. There is no way to sign without a pointer.",
      "**The cursor is the stick.** The pointer is hidden over the tray and a stick is drawn where it is; it reaches past the tray's edges."
    ],
    "happens": [
      [
        "press",
        "the stick goes in and starts a groove"
      ],
      [
        "draw slowly",
        "a wide, deep line, the sand heaped up on both sides"
      ],
      [
        "draw fast",
        "a thinner line; a quick flick throws a few grains that land as small bumps"
      ],
      [
        "lift",
        "the line runs on a little and tapers out"
      ],
      [
        "undo",
        "the last line fills back in over a third of a second"
      ],
      [
        "clear",
        "a rake crosses the tray in a second and a half and leaves it smooth"
      ]
    ],
    "limits": [
      "**It needs a pointer to sign.** A keyboard can undo and clear but not write.",
      "**Twelve undos** are kept."
    ]
  },
  {
    "id": "thinking",
    "name": "Thinking",
    "tag": "sand-thinking",
    "categories": [
      "loader",
      "status",
      "ai",
      "agent",
      "sand",
      "animation"
    ],
    "sub": "A different line for each state.",
    "desc": "An AI agent's working state as a rock in a round tray of sand that rakes itself. Thinking draws rings round the rock, searching draws spokes, using a tool draws lines that flow round it like water, and writing draws dashes like lines of text.",
    "docs": "then use <sand-thinking state=\"thinking\"></sand-thinking> and set el.state to thinking, searching, tool, writing or idle as your agent works. It is a status region, so the state is read out.",
    "intro": [
      "An AI agent's working state as a rock in a round tray of sand, raked by nothing you can see: the sand just moves. Each state drags its own kind of line, so you can tell what the agent is doing at a glance. Thinking draws closed rings round the rock, out to the rim, then smooths them away and starts again. Searching draws straight spokes out from the rock, each one a golden angle round from the last, so it never looks in the same place twice. Using a tool draws parallel lines that part round the rock the way water flows past a stone. Writing draws one line spiralling out from the rock in dashes, like lines of text. Between states the sand sweeps itself smooth, and when the agent is done the sand stops and the garden stays as it is. Each state has its own sound."
    ],
    "demo": {
      "html": "<sand-thinking id=\"el\" state=\"thinking\"></sand-thinking>\n    <div class=\"row\" id=\"states\"><button class=\"pill on\" type=\"button\" data-s=\"thinking\">Thinking</button><button class=\"pill\" type=\"button\" data-s=\"searching\">Searching</button><button class=\"pill\" type=\"button\" data-s=\"tool\">Using a tool</button><button class=\"pill\" type=\"button\" data-s=\"writing\">Writing</button><button class=\"pill\" type=\"button\" data-s=\"idle\">Done</button></div>",
      "hint": "Switch states and watch the lines change. Done leaves the garden as it is.",
      "script": "document.getElementById('states').onclick = (e) => { const b = e.target.closest('button'); if (!b) return; el.state = b.dataset.s; for (const x of b.parentNode.children) x.classList.toggle('on', x === b); };"
    },
    "use": "<script src=\"thinking.js\"></script>\n<sand-thinking state=\"thinking\"></sand-thinking>",
    "js": "const el = document.querySelector('sand-thinking');\nel.state = 'searching';   // thinking, searching, tool, writing, or idle when it is done\nel.thinking = true;       // the same as state = 'thinking' (false is idle)",
    "attrs": [
      [
        "`state`",
        "`thinking`, `searching`, `tool`, `writing` or `idle`",
        "idle"
      ],
      [
        "`rock`",
        "a top-down image of your own rock, with a transparent background",
        "the basalt rock inside the file"
      ],
      [
        "`thinking`",
        "the same as `state=\"thinking\"`",
        ""
      ]
    ],
    "notes": [
      "**A status region:** `role=\"status\"` with `aria-busy` while it works, and an accessible name of Thinking, Searching, Using a tool, Writing or Ready.",
      "**Small sizes work.** At chat size (76 pixels or less) it cuts one bolder groove at a time instead of three, so the lines still read.",
      "**Your own rock:** any square cut-out seen from above. Its outline becomes the shape the rings and the flowing lines bend round."
    ],
    "happens": [
      [
        "thinking",
        "rings round the rock, hugging its outline near it and rounding out further away; at the rim it smooths them back in and starts again"
      ],
      [
        "searching",
        "spokes drawn out from the rock one at a time with a swish each, a golden angle apart"
      ],
      [
        "tool",
        "lines that flow across the tray and part round the rock, drawn back and forth to a steady rush of sand"
      ],
      [
        "writing",
        "a spiral of dashes of different lengths, a tiny scratch at the start of each word"
      ],
      [
        "a new state",
        "the sand sweeps itself smooth in a few wide passes, about two seconds, then the new line starts"
      ],
      [
        "idle",
        "the sand stops and settles, and the garden stays as it is"
      ]
    ],
    "limits": [
      "**The change between states takes about two seconds,** the sweep included. A state that lasts less than that is barely seen.",
      "**It is round,** and as high as it is wide."
    ],
    "manualDocs": true
  },
  {
    "id": "checkbox",
    "name": "Checkbox",
    "tag": "sand-checkbox",
    "categories": [
      "checkbox",
      "selection",
      "input",
      "sand",
      "animation"
    ],
    "sub": "A pebble reveals a checkmark pressed into sand.",
    "desc": "A checkbox where a small river stone rolls aside to reveal a checkmark etched into a circular sand well.",
    "docs": "Use <sand-checkbox label=\"Enable notifications\" value=\"notifications\"></sand-checkbox>. Read el.checked; it fires input and change when toggled. With a name, a checked value is submitted with its form.",
    "intro": [
      "A small river stone rests over a checkmark etched into a circular sand well. Checking the control lifts and rolls the stone to one side, revealing the pressed mark; unchecking returns it to cover the mark."
    ],
    "demo": {
      "html": "<sand-checkbox id=\"el\" label=\"Enable notifications\" name=\"notifications\" value=\"yes\"></sand-checkbox><p id=\"out\"></p>",
      "hint": "Click the tray or focus it and press Space. Watch the stone roll aside and expose the checkmark.",
      "script": "const out = document.getElementById('out'); const show = () => out.textContent = el.checked ? 'Notifications are on' : 'Notifications are off'; el.addEventListener('change', show); show();"
    },
    "use": "<script src=\"checkbox.js\"></script>\n<sand-checkbox label=\"Enable notifications\" name=\"notifications\" value=\"yes\"></sand-checkbox>",
    "js": "const el = document.querySelector('sand-checkbox');\nel.addEventListener('change', () => savePreference(el.checked));\nel.checked = true;",
    "attrs": [
      [
        "`checked`",
        "Starts selected",
        "absent"
      ],
      [
        "`disabled`",
        "Prevents interaction and form participation",
        "absent"
      ],
      [
        "`label`",
        "Accessible name",
        "Checkbox"
      ],
      [
        "`value`",
        "Form value when checked",
        "on"
      ],
      [
        "`name`",
        "Form field name",
        ""
      ]
    ],
    "notes": [
      "**Checkbox semantics:** exposes `role=\"checkbox\"`, `aria-checked`, and a programmatic accessible name.",
      "**Keyboard:** Space and Enter toggle the control.",
      "**Form behavior:** unchecked submits no value; checked submits its value (or `on`)."
    ],
    "happens": [
      [
        "click or press Space/Enter",
        "the stone moves aside and exposes the checkmark"
      ],
      [
        "uncheck",
        "the stone settles back over the pressed mark"
      ],
      [
        "disable",
        "interaction is blocked and the element is removed from the tab order"
      ]
    ],
    "limits": [
      "**One binary value.** This control is a single checkbox, not a checkbox group."
    ],
    "manualDocs": true
  },
  {
    "id": "radio-group",
    "name": "Radio Group",
    "tag": "sand-radio-group",
    "categories": [
      "radio",
      "selection",
      "input",
      "sand",
      "animation"
    ],
    "sub": "A row of river stones marks one selected option.",
    "desc": "A radio group with individual stone wells and one selected pebble moving to the active option.",
    "docs": "Use <sand-radio-group name=\"size\" label=\"Choose a size\" options=\"Small,Medium,Large\" value=\"Medium\"></sand-radio-group>. Read el.value and listen for input/change. Options are comma-separated labels, up to five.",
    "intro": [
      "A row of individually pressed wells holds a small stone for each choice. The selected stone rises slightly and glides to the chosen well; the other pebbles remain settled in their own impressions."
    ],
    "demo": {
      "html": "<sand-radio-group id=\"el\" name=\"delivery\" label=\"Delivery speed\" options=\"Standard,Express,Overnight\" value=\"Standard\"></sand-radio-group><p id=\"out\"></p>",
      "hint": "Choose a pebble well with the pointer, or use the arrow keys when an option is focused.",
      "script": "const out = document.getElementById('out'); const show = () => out.textContent = 'Selected: ' + el.value; el.addEventListener('change', show); show();"
    },
    "use": "<script src=\"radio-group.js\"></script>\n<sand-radio-group name=\"size\" label=\"Choose a size\" options=\"Small,Medium,Large\" value=\"Medium\"></sand-radio-group>",
    "js": "const el = document.querySelector('sand-radio-group');\nel.addEventListener('change', () => updateSize(el.value));\nel.value = 'Large';",
    "attrs": [
      [
        "`options`",
        "Comma-separated option labels, maximum five",
        "Pebble 1,Pebble 2,Pebble 3"
      ],
      [
        "`value`",
        "Initially selected option",
        "First option"
      ],
      [
        "`label`",
        "Accessible group name",
        "Choose an option"
      ],
      [
        "`disabled`",
        "Disables all choices",
        "absent"
      ],
      [
        "`name`",
        "Form field name",
        ""
      ]
    ],
    "notes": [
      "**Radio semantics:** the host exposes `role=\"radiogroup\"`; visually hidden radio buttons expose the individual options.",
      "**Keyboard:** arrow keys change and select; Home and End select first and last; Space selects the focused option.",
      "**Pointer:** clicking a well selects the nearest option."
    ],
    "happens": [
      [
        "select an option",
        "the selected pebble moves to its sand well"
      ],
      [
        "select another option",
        "the marker glides to the new well and settles"
      ],
      [
        "use arrow keys",
        "focus and selection move through the options"
      ]
    ],
    "limits": [
      "**Up to five options.** The first implementation accepts comma-separated labels; a comma cannot be part of one label.",
      "**Options are configured at creation.** Dynamic option-list mutation is not exposed in this version."
    ],
    "manualDocs": true
  },
  {
    "id": "segmented",
    "name": "Segmented Control",
    "tag": "sand-segmented",
    "categories": [
      "segmented-control",
      "selection",
      "navigation",
      "sand",
      "animation"
    ],
    "sub": "A flat stone glides between carved sections.",
    "desc": "A segmented control where a flat river-stone marker glides across individually carved sections in a sand track.",
    "docs": "Use <sand-segmented name=\"period\" label=\"Time period\" options=\"Day,Week,Month\" value=\"Week\"></sand-segmented>. Read el.value and listen for input/change.",
    "intro": [
      "A shallow, flat stone travels between sections carved into one long sand tray. The sections are separated by narrow grooves; the stone settles over the active segment like a physical selector."
    ],
    "demo": {
      "html": "<sand-segmented id=\"el\" name=\"period\" label=\"Time period\" options=\"Day,Week,Month\" value=\"Week\"></sand-segmented><p id=\"out\"></p>",
      "hint": "Select a carved section. The flat stone travels and settles over the active segment.",
      "script": "const out = document.getElementById('out'); const show = () => out.textContent = 'Showing: ' + el.value; el.addEventListener('change', show); show();"
    },
    "use": "<script src=\"segmented.js\"></script>\n<sand-segmented name=\"period\" label=\"Time period\" options=\"Day,Week,Month\" value=\"Week\"></sand-segmented>",
    "js": "const el = document.querySelector('sand-segmented');\nel.addEventListener('change', () => loadPeriod(el.value));\nel.value = 'Month';",
    "attrs": [
      [
        "`options`",
        "Comma-separated option labels, maximum five",
        "Day,Week,Month"
      ],
      [
        "`value`",
        "Initially selected option",
        "First option"
      ],
      [
        "`label`",
        "Accessible group name",
        "Choose a view"
      ],
      [
        "`disabled`",
        "Disables all choices",
        "absent"
      ],
      [
        "`name`",
        "Form field name",
        ""
      ]
    ],
    "notes": [
      "**Radio semantics:** exposes a radiogroup with individually focusable radio options.",
      "**Keyboard:** arrow keys change and select; Home and End select first and last; Space selects the focused option.",
      "**Visual marker:** one flat stone moves between all carved sections."
    ],
    "happens": [
      [
        "select a section",
        "the flat stone glides to the chosen segment"
      ],
      [
        "switch sections",
        "the stone pushes a subtle wake and settles over the new section"
      ],
      [
        "disable",
        "the selection is visible but cannot be changed"
      ]
    ],
    "limits": [
      "**Up to five options.** Option labels are comma-separated; commas within labels are not supported.",
      "**Single selected value.** This is not a multi-select control."
    ],
    "manualDocs": true
  },
  {
    "id": "range",
    "name": "Range Slider",
    "tag": "sand-range",
    "categories": [
      "range",
      "slider",
      "input",
      "sand",
      "animation"
    ],
    "sub": "Two bamboo rakes define an interval in the sand.",
    "desc": "A two-handle range slider with independently adjustable bamboo rake markers and a visibly disturbed selected interval.",
    "docs": "Use <sand-range name=\"budget\" label=\"Budget range\" min=\"0\" max=\"100\" step=\"5\" low=\"20\" high=\"80\"></sand-range>. Read el.low and el.high; el.value returns the pair. It fires input while adjusting and change when an interaction completes.",
    "intro": [
      "Two miniature bamboo rakes move independently through a shared tray. The area between them is cut with a denser set of grooves, making the selected interval visible as disturbed sand."
    ],
    "demo": {
      "html": "<sand-range id=\"el\" name=\"price\" label=\"Price range\" min=\"0\" max=\"500\" step=\"10\" low=\"100\" high=\"400\"></sand-range><p id=\"out\"></p>",
      "hint": "Drag either bamboo rake. Each handle can also be focused separately and adjusted with the keyboard.",
      "script": "const out = document.getElementById('out'); const show = () => out.textContent = '₹' + el.low + ' to ₹' + el.high; el.addEventListener('input', show); show();"
    },
    "use": "<script src=\"range.js\"></script>\n<sand-range name=\"budget\" label=\"Budget range\" min=\"0\" max=\"100\" step=\"5\" low=\"20\" high=\"80\"></sand-range>",
    "js": "const el = document.querySelector('sand-range');\nel.addEventListener('input', () => updateBudget(el.low, el.high));\nel.value = [30, 70];",
    "attrs": [
      [
        "`min`",
        "Minimum permitted value",
        "0"
      ],
      [
        "`max`",
        "Maximum permitted value",
        "100"
      ],
      [
        "`step`",
        "Keyboard and pointer increment",
        "1"
      ],
      [
        "`low`",
        "Initial lower value",
        "25"
      ],
      [
        "`high`",
        "Initial upper value",
        "75"
      ],
      [
        "`value`",
        "Initial pair as low,high",
        "Overrides low/high when valid"
      ],
      [
        "`label`",
        "Accessible group label",
        "Range"
      ],
      [
        "`disabled`",
        "Disables both handles",
        "absent"
      ],
      [
        "`name`",
        "Form field name, serialized as low,high",
        ""
      ]
    ],
    "notes": [
      "**Two independently accessible handles:** each handle exposes slider role, value, minimum and maximum.",
      "**Keyboard:** arrow keys change by one step; Page Up/Down change by ten steps; Home/End move to min/max.",
      "**Pointer:** the nearest handle is selected; touch scrolling is preserved until a horizontal drag begins."
    ],
    "happens": [
      [
        "move lower rake",
        "the lower bound changes without crossing the upper bound"
      ],
      [
        "move upper rake",
        "the upper bound changes without crossing the lower bound"
      ],
      [
        "release a rake",
        "the adjusted value settles and a change event is emitted"
      ]
    ],
    "limits": [
      "**Form serialization:** one comma-separated `low,high` value is submitted.",
      "**The first implementation uses a fixed horizontal range layout.**"
    ],
    "manualDocs": true
  },
  {
    "id": "rating",
    "name": "Rating",
    "tag": "sand-rating",
    "categories": [
      "rating",
      "input",
      "selection",
      "sand",
      "animation"
    ],
    "sub": "Five river stones sit in separate rating wells.",
    "desc": "A five-point rating control where a selected river stone marks the chosen rating in one of five individual sand wells.",
    "docs": "Use <sand-rating name=\"product-rating\" label=\"Product rating\" value=\"4\"></sand-rating>. Read el.value and listen for input/change. The supported scale is zero through five.",
    "intro": [
      "Five individually pressed wells hold small pebbles along a horizontal tray. Choosing a rating lifts the selected pebble into a more prominent position while the remaining stones stay settled in their wells."
    ],
    "demo": {
      "html": "<sand-rating id=\"el\" name=\"rating\" label=\"Experience rating\" value=\"3\"></sand-rating><p id=\"out\"></p>",
      "hint": "Click a well to give a rating. Use the arrow keys to adjust it while focused.",
      "script": "const out = document.getElementById('out'); const show = () => out.textContent = el.value ? el.value + ' of 5' : 'Not rated'; el.addEventListener('change', show); show();"
    },
    "use": "<script src=\"rating.js\"></script>\n<sand-rating name=\"product-rating\" label=\"Product rating\" value=\"4\"></sand-rating>",
    "js": "const el = document.querySelector('sand-rating');\nel.addEventListener('change', () => saveRating(el.value));\nel.value = 5;",
    "attrs": [
      [
        "`value`",
        "Initial rating from zero to five",
        "0"
      ],
      [
        "`disabled`",
        "Prevents rating changes",
        "absent"
      ],
      [
        "`label`",
        "Accessible name",
        "Rating"
      ],
      [
        "`name`",
        "Form field name, omitted from submission when value is zero",
        ""
      ]
    ],
    "notes": [
      "**Slider semantics:** exposes minimum zero, maximum five, current value and a readable value text.",
      "**Keyboard:** arrow keys increase/decrease by one; Home sets zero; End sets five.",
      "**Pointer:** clicking across the tray selects one of five rating positions."
    ],
    "happens": [
      [
        "choose a rating",
        "the selected pebble rises slightly in its well"
      ],
      [
        "change rating",
        "the selected marker moves to the new well"
      ],
      [
        "clear rating",
        "set `value` to zero to return to Not rated"
      ]
    ],
    "limits": [
      "**Fixed scale:** this version supports zero through five only.",
      "**One value:** half-star and custom-step ratings are not currently supported."
    ],
    "manualDocs": true
  },
  {
    "id": "input",
    "name": "Text Field",
    "tag": "sand-input",
    "categories": [
      "input",
      "text",
      "form",
      "sand",
      "animation"
    ],
    "desc": "A native text input with a bamboo stylus-like focus marker and fine pressed guide line, retaining normal browser editing, selection and validation.",
    "docs": "Use <sand-input name=\"displayName\" label=\"Display name\" placeholder=\"Your name\"></sand-input>. Read or set el.value; native input and change events bubble from its internal input. Supported types are text, email, tel, url and search.",
    "manualDocs": true
  },
  {
    "id": "textarea",
    "name": "Textarea",
    "tag": "sand-textarea",
    "categories": [
      "textarea",
      "input",
      "text",
      "form",
      "sand",
      "animation"
    ],
    "desc": "A native multiline textarea over a wider sand tray, with shallow writing grooves and a moving stylus focus cue.",
    "docs": "Use <sand-textarea name=\"message\" label=\"Message\" rows=\"4\" maxlength=\"500\"></sand-textarea>. Read or set el.value; native input and change events bubble from the internal textarea. Rows are clamped from 2 to 10.",
    "manualDocs": true
  },
  {
    "id": "password",
    "name": "Password Field",
    "tag": "sand-password",
    "categories": [
      "password",
      "input",
      "security",
      "form",
      "sand",
      "animation"
    ],
    "desc": "A native password input with a physical Show/Hide stone shutter. The value remains masked by default and is never printed in the demo status text.",
    "docs": "Use <sand-password name=\"password\" label=\"Password\" autocomplete=\"current-password\"></sand-password>. Read or set el.value. The revealed property or attribute toggles visibility; password is hidden by default.",
    "manualDocs": true
  },
  {
    "id": "search",
    "name": "Search Field",
    "tag": "sand-search",
    "categories": [
      "search",
      "input",
      "form",
      "sand",
      "animation"
    ],
    "desc": "A native search input with a small search well, a clear button, an Enter-to-search event and a moving sand rake while busy.",
    "docs": "Use <sand-search name=\"q\" label=\"Search\" placeholder=\"Search\"></sand-search>. Pressing Enter dispatches a bubbling search event with detail.value. Set el.busy=true while your application fetches results; call el.clear() to reset.",
    "manualDocs": true
  },
  {
    "id": "otp",
    "name": "OTP / PIN Input",
    "tag": "sand-otp",
    "categories": [
      "otp",
      "pin",
      "input",
      "security",
      "form",
      "sand",
      "animation"
    ],
    "desc": "A numeric OTP/PIN input drawn across individual engraved wells. One native input preserves mobile one-time-code autofill, paste, selection and keyboard behavior.",
    "docs": "Use <sand-otp name=\"verificationCode\" label=\"Verification code\" length=\"6\" autocomplete=\"one-time-code\" required></sand-otp>. Length is clamped from four to ten. The complete event exposes detail.length only, never the entered digits.",
    "manualDocs": true
  },
  {
    "id": "select",
    "name": "Select / Dropdown",
    "tag": "sand-select",
    "categories": [
      "select",
      "dropdown",
      "selection",
      "form",
      "sand",
      "animation"
    ],
    "sub": "A river stone settles in the well of the chosen option.",
    "desc": "A native select control with a floating river stone and a carved chevron. The browser retains its familiar option popup, keyboard navigation and form semantics.",
    "docs": "Use <sand-select name=\"delivery\" label=\"Delivery speed\" options=\"Standard,Express,Overnight\" placeholder=\"Choose delivery\"></sand-select>. Options are comma-separated; use value:Label for distinct submitted values and visible labels. Read or set el.value.",
    "intro": [
      "A small river stone settles into a carved well for the chosen option. The browser-native select remains responsible for its popup, keyboard navigation and selection semantics; the sand layer adds a physical marker and a pressed chevron."
    ],
    "use": "<script src=\"select.js\"></script>\n<sand-select name=\"delivery\" label=\"Delivery speed\" options=\"standard:Standard,express:Express,overnight:Overnight\" placeholder=\"Choose delivery\" required></sand-select>",
    "js": "const select = document.querySelector('sand-select');\nselect.addEventListener('change', () => saveDelivery(select.value));\nselect.value = 'express';",
    "attrs": [
      [
        "options",
        "Comma-separated options; `value:Label` defines a distinct form value and display label",
        "empty"
      ],
      [
        "value",
        "Initially selected option value",
        "empty"
      ],
      [
        "label",
        "Accessible name for the native select",
        "Select a value"
      ],
      [
        "placeholder",
        "First empty option label",
        "Choose an option"
      ],
      [
        "name",
        "Form submission name",
        "empty"
      ],
      [
        "required",
        "Require a non-empty selection",
        "absent"
      ],
      [
        "disabled",
        "Disable selection and form participation",
        "absent"
      ],
      [
        "lang",
        "Locale hint for browser popup",
        "document language"
      ]
    ],
    "notes": [
      "**Native select:** the inner control is a real `<select>`. The browser owns the option popup, arrow-key behavior, touch selection and option semantics.",
      "**Option syntax:** `options=\"standard:Standard,express:Express\"` submits `standard` and displays `Standard`. Without a colon, the same text is used for both value and label.",
      "**Form value:** the selected option value is submitted as a string; the empty placeholder submits an empty value."
    ],
    "happens": [
      [
        "open the control",
        "the browser displays its native option picker"
      ],
      [
        "choose an option",
        "the select value changes and the sand stone settles at the selected position"
      ],
      [
        "change the options attribute",
        "the native option list is rebuilt while preserving the selected value when it still exists"
      ]
    ],
    "limits": [
      "The option popup is rendered by the browser/operating system and cannot be styled like a custom HTML menu.",
      "The physical stone represents the current selection; it does not replace the native select popup."
    ],
    "manualDocs": true
  },
  {
    "id": "combobox",
    "name": "Combobox / Autocomplete",
    "tag": "sand-combobox",
    "categories": [
      "combobox",
      "autocomplete",
      "search",
      "input",
      "form",
      "sand",
      "animation"
    ],
    "sub": "A bamboo rake follows the typed query as native suggestions appear.",
    "desc": "A native text input connected to a datalist for browser-managed suggestions. It permits free text, keyboard entry and paste while a small rake follows the query.",
    "docs": "Use <sand-combobox name=\"city\" label=\"City\" options=\"DEL:Delhi,BLR:Bengaluru,HYD:Hyderabad\" placeholder=\"Start typing\"></sand-combobox>. The browser provides the datalist suggestion UI. Read or set el.value; free text is allowed.",
    "intro": [
      "A thin bamboo rake follows the characters as the user types. Suggestions come from a real browser `<datalist>` connected to a native text input, so free text, paste and keyboard editing remain available."
    ],
    "use": "<script src=\"combobox.js\"></script>\n<sand-combobox name=\"city\" label=\"City\" options=\"DEL:Delhi,BLR:Bengaluru,HYD:Hyderabad\" placeholder=\"Start typing\"></sand-combobox>",
    "js": "const city = document.querySelector('sand-combobox');\ncity.addEventListener('option-selected', event => useCity(event.detail.value));\ncity.addEventListener('input', () => preview(city.value));",
    "attrs": [
      [
        "options",
        "Comma-separated suggestions; `value:Label` separates values from labels",
        "empty"
      ],
      [
        "value",
        "Initial text value",
        "empty"
      ],
      [
        "label",
        "Accessible name for the native text input",
        "Search options"
      ],
      [
        "placeholder",
        "Native input placeholder",
        "empty"
      ],
      [
        "name",
        "Form submission name",
        "empty"
      ],
      [
        "disabled",
        "Disable editing and form participation",
        "absent"
      ],
      [
        "required",
        "Require a non-empty value",
        "absent"
      ],
      [
        "autocomplete",
        "Browser autocomplete hint",
        "off"
      ]
    ],
    "notes": [
      "**Native datalist:** the component uses an actual text input and an associated `<datalist>`. Suggestion display varies by browser and operating system.",
      "**Free text:** users are not restricted to the provided options. This is an autocomplete input, not a strict select.",
      "**Option event:** when the changed value exactly matches a suggestion, the component emits `option-selected` with `{ value, label }`."
    ],
    "happens": [
      [
        "type a query",
        "the browser offers matching datalist suggestions where supported; the rake follows the input length"
      ],
      [
        "choose a suggestion",
        "the native input receives its value and a matching change emits option-selected"
      ],
      [
        "enter an unlisted value",
        "the value remains valid free text unless the integrating application applies its own validation"
      ]
    ],
    "limits": [
      "The suggestion popup is native browser UI and is not fully styleable.",
      "Datalist filtering and announcement details differ across browsers; manual screen-reader verification is required.",
      "Suggestions are comma-separated in the options attribute. For complex or dynamic data, set the `options` attribute from application code."
    ],
    "manualDocs": true
  },
  {
    "id": "date-picker",
    "name": "Date Picker",
    "tag": "sand-date-picker",
    "categories": [
      "date-picker",
      "calendar",
      "date",
      "form",
      "sand",
      "animation"
    ],
    "sub": "An engraved calendar grid holds a pebble on the selected day.",
    "desc": "A native date input over an engraved sand calendar. The value remains an ISO YYYY-MM-DD date string, with min, max and unavailable-day validation that avoids local timezone conversions.",
    "docs": "Use <sand-date-picker name=\"startDate\" label=\"Start date\" min=\"2026-01-01\" max=\"2026-12-31\" unavailable=\"2026-12-25\"></sand-date-picker>. The value uses YYYY-MM-DD and is not converted through the local timezone. The native date picker handles calendar keyboard interaction.",
    "intro": [
      "An engraved calendar grid is cut into the sand, with a small pebble marking the selected day. The actual calendar popup and keyboard behavior are provided by a native `<input type=\"date\">`; the component stores the browser's ISO `YYYY-MM-DD` value without converting it into a local-time timestamp."
    ],
    "use": "<script src=\"date-picker.js\"></script>\n<sand-date-picker name=\"startDate\" label=\"Start date\" min=\"2026-01-01\" max=\"2026-12-31\" unavailable=\"2026-12-25\" required></sand-date-picker>",
    "js": "const date = document.querySelector('sand-date-picker');\ndate.addEventListener('change', () => saveDate(date.value));\ndate.value = '2026-11-21';",
    "attrs": [
      [
        "value",
        "Initial ISO calendar date (`YYYY-MM-DD`)",
        "empty"
      ],
      [
        "label",
        "Accessible name",
        "Choose a date"
      ],
      [
        "name",
        "Form submission name",
        "empty"
      ],
      [
        "min / max",
        "Inclusive ISO date bounds",
        "unset"
      ],
      [
        "unavailable",
        "Comma-separated ISO dates that fail validation",
        "empty"
      ],
      [
        "required",
        "Require a selected date",
        "absent"
      ],
      [
        "disabled",
        "Disable selection and form participation",
        "absent"
      ],
      [
        "lang",
        "Locale hint for native calendar UI",
        "document language"
      ]
    ],
    "notes": [
      "**Native date input:** the browser provides its platform calendar UI, keyboard support and date formatting.",
      "**Stable date value:** `value` is the native ISO `YYYY-MM-DD` string. The component does not parse the date through local time, so it does not shift at timezone boundaries.",
      "**Unavailable dates:** put exact ISO dates in the comma-separated `unavailable` attribute. A selected unavailable date receives a custom validity message; min and max are enforced by the native input."
    ],
    "happens": [
      [
        "open the date field",
        "the browser opens its native date picker"
      ],
      [
        "choose a date",
        "the ISO date value updates and the pebble marks its day position"
      ],
      [
        "choose an unavailable date",
        "the field becomes invalid with an explanatory validation message"
      ],
      [
        "set min or max",
        "the browser prevents dates outside the inclusive range"
      ]
    ],
    "limits": [
      "Individual unavailable days are validated after selection; the native browser calendar popup is not modified to gray out those days.",
      "Calendar appearance and keyboard behavior are controlled by the browser/operating system and vary by platform.",
      "The value is a calendar date, not a timestamp or timezone-aware instant."
    ],
    "manualDocs": true
  },
  {
    "id": "date-range",
    "name": "Date Range Picker",
    "tag": "sand-date-range",
    "categories": [
      "date-range",
      "calendar",
      "date",
      "range",
      "form",
      "sand",
      "animation"
    ],
    "sub": "Two river stones mark the start and end of a date interval.",
    "desc": "Two native date fields represent an inclusive calendar range. The component validates order, required endpoints, min/max bounds and unavailable days; it serializes complete ranges as start/end ISO strings.",
    "docs": "Use <sand-date-range name=\"stay\" start=\"2026-11-21\" end=\"2026-11-25\" min=\"2026-01-01\" max=\"2026-12-31\"></sand-date-range>. The value is `YYYY-MM-DD/YYYY-MM-DD`; start and end are separate properties. Dates are compared as calendar days, not local timestamps.",
    "intro": [
      "Two river stones mark the beginning and end of a date interval, with a shallow line pressed between them. Two native date inputs preserve each endpoint's calendar popup and keyboard support. The complete value is serialized as `start/end` using ISO calendar dates."
    ],
    "use": "<script src=\"date-range.js\"></script>\n<sand-date-range name=\"stay\" label=\"Stay dates\" start=\"2026-11-21\" end=\"2026-11-25\" min=\"2026-01-01\" max=\"2026-12-31\" required></sand-date-range>",
    "js": "const range = document.querySelector('sand-date-range');\nrange.addEventListener('date-range-change', ({ detail }) => showDates(detail.start, detail.end));\nrange.start = '2026-11-21';\nrange.end = '2026-11-25';",
    "attrs": [
      [
        "start / end",
        "Initial ISO start and end dates",
        "empty"
      ],
      [
        "value",
        "Combined `start/end` ISO value",
        "empty"
      ],
      [
        "label",
        "Accessible label prefix for the range",
        "Date range"
      ],
      [
        "name",
        "Form submission name",
        "empty"
      ],
      [
        "min / max",
        "Inclusive bounds for both endpoints",
        "unset"
      ],
      [
        "unavailable",
        "Comma-separated ISO dates invalid for either endpoint",
        "empty"
      ],
      [
        "required",
        "Require both endpoints",
        "absent"
      ],
      [
        "disabled",
        "Disable both date fields and form participation",
        "absent"
      ],
      [
        "lang",
        "Locale hint for native date UI",
        "document language"
      ]
    ],
    "notes": [
      "**Two native date fields:** start and end each use a browser `<input type=\"date\">` and have separate accessible names. The browser handles calendar popups and keyboard support.",
      "**Stable serialization:** the complete form value is `YYYY-MM-DD/YYYY-MM-DD`. Both dates are calendar strings; no local timezone conversion is performed.",
      "**Validation:** the end date cannot precede the start date. Both endpoints respect min/max and the unavailable list. Required means both endpoints must be present.",
      "**Events:** native `input` and `change` events bubble from each field. `date-range-change` includes `{ start, end }` when an endpoint is committed."
    ],
    "happens": [
      [
        "choose a start date",
        "the first stone moves to that calendar day"
      ],
      [
        "choose an end date",
        "the second stone moves and the interval becomes visible"
      ],
      [
        "set the end before the start",
        "the range receives a validation error"
      ],
      [
        "leave one endpoint empty",
        "the range stays incomplete and required validation fails"
      ]
    ],
    "limits": [
      "The native calendar popup cannot visually disable individual unavailable days; those dates are rejected through validity after selection.",
      "The visual marker position is a compact calendar-day scale, not a full month-layout calendar.",
      "The form value is null until both endpoints are provided; when complete it is serialized as `start/end`."
    ],
    "manualDocs": true
  },
  {
    "id": "time-picker",
    "name": "Time Picker",
    "tag": "sand-time-picker",
    "categories": [
      "time-picker",
      "time",
      "form",
      "sand",
      "animation"
    ],
    "sub": "A small clock dial is etched into the sand, with a stone hand marking the time.",
    "desc": "A native time input paired with a circular sand dial and deterministic 12/24-hour readout. Values remain timezone-free HH:MM strings; min, max and step use native time constraints.",
    "docs": "Use <sand-time-picker name=\"appointment\" label=\"Appointment time\" format=\"12\" min=\"09:00\" max=\"17:30\" step=\"900\"></sand-time-picker>. Read or set el.value in 24-hour `HH:MM` form. The `format` property controls a 12/24-hour readout; native input presentation follows browser locale.",
    "intro": [
      "A small clock dial is etched into the sand, with a river stone marking the selected time. A native `<input type=\"time\">` retains platform time selection, keyboard behavior and constraints. Values remain timezone-free `HH:MM` strings; a separate readout shows either 12-hour or 24-hour formatting."
    ],
    "use": "<script src=\"time-picker.js\"></script>\n<sand-time-picker name=\"appointment\" label=\"Appointment time\" format=\"12\" min=\"09:00\" max=\"17:30\" step=\"900\" required></sand-time-picker>",
    "js": "const time = document.querySelector('sand-time-picker');\ntime.addEventListener('change', () => saveTime(time.value));\ntime.format = '24';\ntime.value = '16:30';",
    "attrs": [
      [
        "value",
        "Initial time in 24-hour `HH:MM` form",
        "empty"
      ],
      [
        "label",
        "Accessible name",
        "Choose a time"
      ],
      [
        "name",
        "Form submission name",
        "empty"
      ],
      [
        "format",
        "Readout format: `12` or `24`",
        "24"
      ],
      [
        "min / max",
        "Inclusive time bounds in `HH:MM`",
        "unset"
      ],
      [
        "step",
        "Native time step in seconds",
        "60"
      ],
      [
        "required",
        "Require a time value",
        "absent"
      ],
      [
        "disabled",
        "Disable selection and form participation",
        "absent"
      ],
      [
        "lang",
        "Locale hint for native input presentation",
        "en-US for 12-hour readout, en-GB for 24-hour"
      ]
    ],
    "notes": [
      "**Native time input:** the browser provides time selection and keyboard behavior; its visible controls follow browser and operating-system locale conventions.",
      "**Deterministic value:** the component reads and submits a timezone-free `HH:MM` string. It does not create a `Date`, apply a timezone or convert the chosen time into an instant.",
      "**12/24-hour display:** set `format=\"12\"` or `format=\"24\"` for the explicit readout. The component supplies an en-US/en-GB locale hint to the native control when no `lang` is specified; the exact native UI remains browser-controlled.",
      "**Constraints:** min, max and step are passed to the native time input. Step is in seconds, so 900 means fifteen-minute increments."
    ],
    "happens": [
      [
        "choose a time",
        "the stone moves around the dial to the corresponding minute of the day"
      ],
      [
        "set format to 12",
        "the readout displays AM/PM time"
      ],
      [
        "set format to 24",
        "the readout displays 00:00 through 23:59"
      ],
      [
        "change timezone or DST settings",
        "the raw `HH:MM` value does not shift because no date or timezone is attached"
      ]
    ],
    "limits": [
      "The operating system/browser may render the native time selection popup differently from the explicit 12/24-hour readout.",
      "A time-only value has no date or timezone and cannot identify a unique point in time across daylight-saving transitions.",
      "The clock dial is a visual indicator; the native time input remains the actual keyboard-accessible control."
    ],
    "manualDocs": true
  },
  {
    "id": "progress",
    "name": "Progress Bar",
    "tag": "sand-progress",
    "categories": [
      "progress",
      "status",
      "sand",
      "animation"
    ],
    "sub": "A rake leaves a growing trail in a sand channel.",
    "desc": "A bamboo rake advances through a sand channel, leaving a growing trail and a soft ridge ahead of its tines. Supports determinate and indeterminate progress.",
    "docs": "Use <sand-progress value=\"42\" label=\"Upload progress\"></sand-progress>. Set value, min and max; add indeterminate for unknown progress. The element exposes progressbar semantics and aria-valuetext.",
    "intro": [
      "A long sand channel holds a growing rake trail. The bamboo rake advances with the completion value, pushing a small ridge ahead of its tines. Indeterminate mode moves the rake back and forth without announcing a fabricated percentage."
    ],
    "use": "<script src=\"progress.js\"></script>\n<sand-progress value=\"42\" label=\"Upload progress\"></sand-progress>",
    "js": "const progress = document.querySelector('sand-progress');\nprogress.value = 72;\nprogress.setAttribute('indeterminate', '');",
    "attrs": [
      [
        "value",
        "Current progress value",
        "0"
      ],
      [
        "min / max",
        "Numeric progress bounds",
        "0 / 100"
      ],
      [
        "indeterminate",
        "Use moving indeterminate animation and omit aria-valuenow",
        "absent"
      ],
      [
        "label",
        "Accessible progress name",
        "Progress"
      ]
    ],
    "notes": [
      "**Determinate progress:** value is clamped between min and max and reflected through aria-valuenow.",
      "**Indeterminate progress:** add indeterminate; the moving rake loops without exposing a misleading numeric value.",
      "**Accessibility:** role=progressbar, aria-valuemin, aria-valuemax, aria-valuenow when determinate and aria-valuetext are maintained."
    ],
    "happens": [
      [
        "increase value",
        "the rake advances and leaves a longer groove behind"
      ],
      [
        "decrease value",
        "the rake moves back through the channel"
      ],
      [
        "enable indeterminate",
        "the rake moves back and forth without a numeric announcement"
      ]
    ],
    "limits": [
      "The progress bar is a visual status indicator, not a form input."
    ],
    "manualDocs": true
  },
  {
    "id": "progress-ring",
    "name": "Progress Ring",
    "tag": "sand-progress-ring",
    "categories": [
      "progress",
      "status",
      "ring",
      "sand",
      "animation"
    ],
    "sub": "A pebble follows a circular groove.",
    "desc": "A circular progress indicator with a river pebble travelling around an engraved sand groove. Supports determinate and indeterminate states.",
    "docs": "Use <sand-progress-ring value=\"68\" label=\"Processing\"></sand-progress-ring>. Set value, min and max, or add indeterminate for a looping marker.",
    "intro": [
      "A circular groove is pressed into the sand. A small river pebble follows the ring as the completion value changes, tracing a full turn from the top. In indeterminate mode the pebble travels continuously without suggesting a percentage."
    ],
    "use": "<script src=\"progress-ring.js\"></script>\n<sand-progress-ring value=\"68\" label=\"Processing\"></sand-progress-ring>",
    "js": "const ring = document.querySelector('sand-progress-ring');\nring.value = 90;\nring.toggleAttribute('indeterminate', false);",
    "attrs": [
      [
        "value",
        "Current progress value",
        "0"
      ],
      [
        "min / max",
        "Numeric progress bounds",
        "0 / 100"
      ],
      [
        "indeterminate",
        "Move the pebble continuously",
        "absent"
      ],
      [
        "label",
        "Accessible progress name",
        "Progress"
      ]
    ],
    "notes": [
      "**Determinate:** value is clamped to min/max and reflected as aria-valuenow.",
      "**Indeterminate:** the pebble loops around the groove and aria-valuenow is omitted.",
      "**Accessibility:** role=progressbar with min, max, current value and readable value text."
    ],
    "happens": [
      [
        "increase value",
        "the pebble moves clockwise around the groove"
      ],
      [
        "decrease value",
        "the pebble travels counter-clockwise"
      ],
      [
        "enable indeterminate",
        "the pebble loops around the ring"
      ]
    ],
    "limits": [
      "The ring is a status indicator, not an input control."
    ],
    "manualDocs": true
  },
  {
    "id": "steps",
    "name": "Step Indicator",
    "tag": "sand-steps",
    "categories": [
      "steps",
      "navigation",
      "progress",
      "sand"
    ],
    "sub": "Stepping stones mark completed, current and upcoming steps.",
    "desc": "A multi-step indicator using stepping stones and native buttons. Completed, current and upcoming steps are visually distinct and keyboard operable.",
    "docs": "Use <sand-steps steps=\"Account,Details,Review,Done\" value=\"1\" label=\"Setup progress\"></sand-steps>. Read or set value as a zero-based active step index. The element submits that index when name is supplied.",
    "intro": [
      "A line of stepping stones crosses the tray. Stones behind the current step show completed progress, the current stone is raised, and the remaining stones wait ahead. Native buttons keep each step keyboard accessible; the active index is zero-based."
    ],
    "use": "<script src=\"steps.js\"></script>\n<sand-steps name=\"setupStep\" steps=\"Account,Details,Review,Done\" value=\"1\" label=\"Setup progress\"></sand-steps>",
    "js": "const steps = document.querySelector('sand-steps');\nsteps.addEventListener('change', () => showStep(steps.value));\nsteps.value = 2;",
    "attrs": [
      [
        "steps",
        "Comma-separated step labels, up to five",
        "Start,Details,Review,Finish"
      ],
      [
        "value",
        "Zero-based active step index",
        "0"
      ],
      [
        "label",
        "Accessible group name",
        "Progress steps"
      ],
      [
        "name",
        "Form submission name",
        "empty"
      ],
      [
        "disabled",
        "Disable step buttons",
        "absent"
      ]
    ],
    "notes": [
      "**Native buttons:** each step is a real button with an accessible label and aria-current=step on the active step.",
      "**Value:** zero-based active step index. The element emits bubbling input and change events when it changes.",
      "**Forms:** when name is supplied, the active index is submitted as a string."
    ],
    "happens": [
      [
        "choose a later step",
        "the selected stone lifts and previous stones are marked complete"
      ],
      [
        "choose an earlier step",
        "the active marker moves back and later stones become upcoming"
      ],
      [
        "disable the control",
        "all step buttons become disabled"
      ]
    ],
    "limits": [
      "The current layout supports up to five steps so each stone remains legible."
    ],
    "manualDocs": true
  },
  {
    "id": "timer",
    "name": "Hourglass Timer",
    "tag": "sand-timer",
    "categories": [
      "timer",
      "time",
      "status",
      "sand",
      "animation"
    ],
    "sub": "Sand falls between two chambers to show remaining time.",
    "desc": "A countdown timer rendered as a two-chamber hourglass. Sand falls through a narrow waist; pause, resume, reset and cancel controls remain native buttons.",
    "docs": "Use <sand-timer duration=\"90\" label=\"Break timer\"></sand-timer>. Call start(), pause(), reset() or cancel(); read remaining and listen for timer-tick and complete.",
    "intro": [
      "An hourglass is drawn into the sand tray. The upper chamber empties as grains fall through its narrow waist and collect below. Pause, resume, reset and cancel are native buttons; the countdown uses the animation frame clock rather than a background interval."
    ],
    "use": "<script src=\"timer.js\"></script>\n<sand-timer duration=\"90\" label=\"Break timer\"></sand-timer>",
    "js": "const timer = document.querySelector('sand-timer');\ntimer.start();\ntimer.addEventListener('timer-tick', e => showRemaining(e.detail.remaining));\ntimer.addEventListener('complete', () => announceDone());",
    "attrs": [
      [
        "duration",
        "Initial duration in seconds",
        "60"
      ],
      [
        "label",
        "Accessible timer name",
        "Countdown timer"
      ],
      [
        "disabled",
        "Disable timer controls",
        "absent"
      ],
      [
        "name",
        "Form submission name for remaining seconds",
        "empty"
      ]
    ],
    "notes": [
      "**Methods:** start(), pause(), reset() and cancel(). The Pause button becomes Resume while paused.",
      "**Events:** timer-tick emits remaining whole seconds; complete fires once when the countdown reaches zero.",
      "**Reduced motion:** countdown timing remains correct, but sand animation is held static when reduced motion is requested."
    ],
    "happens": [
      [
        "start",
        "sand begins falling from the upper chamber"
      ],
      [
        "pause",
        "the countdown and falling sand stop"
      ],
      [
        "resume",
        "the remaining sand continues falling"
      ],
      [
        "reset",
        "the original duration is restored"
      ],
      [
        "cancel",
        "the timer stops and reports Cancelled"
      ],
      [
        "reach zero",
        "the timer stops and emits complete"
      ]
    ],
    "limits": [
      "The countdown uses requestAnimationFrame and pauses when the page is background-throttled; it is not a precision alarm clock."
    ],
    "manualDocs": true
  },
  {
    "id": "loader",
    "name": "Loading Indicator",
    "tag": "sand-loader",
    "categories": [
      "loading",
      "status",
      "animation",
      "sand"
    ],
    "sub": "A miniature rake loops through a changing sand pattern.",
    "desc": "An indeterminate loading indicator with a miniature rake that loops through a recognizable sand pattern, distinct from the AI Thinking state.",
    "docs": "Use <sand-loader label=\"Loading results\"></sand-loader>. Set active=false when work completes and speed to adjust the animation rate. Reduced motion holds the rake still.",
    "intro": [
      "A miniature rake repeatedly crosses a short sand channel, smoothing one set of grooves and cutting another. Its repeating motion is deliberately simpler than the AI Thinking component, which communicates changing agent activity states."
    ],
    "use": "<script src=\"loader.js\"></script>\n<sand-loader label=\"Loading results\"></sand-loader>",
    "js": "const loader = document.querySelector('sand-loader');\nloader.speed = 1.5;\nloader.active = false;",
    "attrs": [
      [
        "label",
        "Accessible status name",
        "Loading"
      ],
      [
        "active",
        "Whether work is ongoing",
        "true"
      ],
      [
        "speed",
        "Animation speed multiplier from 0.25 to 4",
        "1"
      ]
    ],
    "notes": [
      "**Status semantics:** role=status, aria-live=polite and aria-busy reflect the active state.",
      "**Control:** set active=false when the operation completes. The label then defaults to Loading complete unless supplied.",
      "**Reduced motion:** the rake remains still while prefers-reduced-motion is active."
    ],
    "happens": [
      [
        "active",
        "the rake loops and re-cuts the pattern"
      ],
      [
        "inactive",
        "the rake rests and aria-busy becomes false"
      ],
      [
        "reduced motion",
        "the indicator remains visible without continuous motion"
      ]
    ],
    "limits": [
      "The loader is intentionally indeterminate; it does not accept a percentage."
    ],
    "manualDocs": true
  },
  {
    "id": "tabs",
    "name": "Tabs",
    "tag": "sand-tabs",
    "categories": [
      "navigation",
      "tabs",
      "sand",
      "animation"
    ],
    "sub": "A river stone glides between carved tab wells.",
    "desc": "A tactile tab system with a flat river-stone marker moving between carved tab wells. Real HTML tab buttons and content panels preserve native interaction and accessible semantics.",
    "docs": "Use <sand-tabs tabs=\"overview:Overview,activity:Activity\" value=\"overview\"></sand-tabs>. Put template[data-panel] elements inside for real panel content. Read or set value and listen for the bubbling change event.",
    "intro": [
      "A low river stone rests in one of several carved wells. The selected well is active, while the panel beneath remains actual HTML content."
    ],
    "use": "<script src=\"tabs.js\"></script>\n<sand-tabs tabs=\"overview:Overview,activity:Activity\" value=\"overview\"><template data-panel=\"overview\"><p>Overview content</p></template><template data-panel=\"activity\"><p>Activity content</p></template></sand-tabs>",
    "js": "const tabs = document.querySelector('sand-tabs');\ntabs.value = 'activity';\ntabs.addEventListener('change', event => console.log(event.detail.value));",
    "attrs": [
      [
        "tabs",
        "Comma-separated id:Label entries, up to six",
        "Overview, Activity, Settings"
      ],
      [
        "value",
        "Selected tab identifier",
        "First enabled tab"
      ],
      [
        "label",
        "Accessible tab group name",
        "Content tabs"
      ],
      [
        "orientation",
        "horizontal or vertical",
        "horizontal"
      ],
      [
        "activation",
        "automatic or manual keyboard activation",
        "automatic"
      ],
      [
        "disabled-tabs",
        "Comma-separated disabled tab IDs",
        "none"
      ]
    ],
    "notes": [
      "Panel bodies are supplied as template[data-panel] elements and cloned during refresh().",
      "Horizontal arrow keys move between tabs. Vertical orientation uses Up/Down. Home and End move to the edges; manual mode activates with Enter or Space.",
      "A change event exposes value, previousValue and index."
    ],
    "happens": [
      [
        "select a tab",
        "the stone marker glides to its carved well and the matching panel is revealed"
      ],
      [
        "change orientation",
        "the tab list and keyboard direction switch between horizontal and vertical"
      ],
      [
        "disable a tab",
        "the disabled option is removed from keyboard selection"
      ]
    ],
    "limits": [
      "Up to six tab entries. Attribute definitions reserve comma and colon as delimiters.",
      "The component does not provide routing, data fetching or lazy loading."
    ],
    "manualDocs": true
  },
  {
    "id": "accordion",
    "name": "Accordion",
    "tag": "sand-accordion",
    "categories": [
      "disclosure",
      "navigation",
      "sand",
      "animation"
    ],
    "sub": "Walnut lids lift to reveal separate sand compartments.",
    "desc": "An accordion made from walnut lids with small stone pulls. Opening a lid reveals a sand-toned compartment containing preserved native HTML content.",
    "docs": "Use <sand-accordion items=\"shipping:Shipping,returns:Returns\" value=\"shipping\"></sand-accordion> with template[data-panel] children. Add multiple for simultaneous panels and collapsible to allow all panels to close.",
    "intro": [
      "Walnut lids sit over separate sand compartments. Opening a lid lifts it from the frame and reveals the content below without rebuilding it on every toggle."
    ],
    "use": "<script src=\"accordion.js\"></script>\n<sand-accordion items=\"shipping:Shipping,returns:Returns\" value=\"shipping\"><template data-panel=\"shipping\"><p>Delivery information</p></template><template data-panel=\"returns\"><p>Return information</p></template></sand-accordion>",
    "js": "const accordion = document.querySelector('sand-accordion');\naccordion.toggle('returns');\naccordion.addEventListener('change', event => console.log(event.detail.openItems));",
    "attrs": [
      [
        "items",
        "Comma-separated id:Label entries, optional :disabled suffix",
        "Shipping, Returns, Care"
      ],
      [
        "value",
        "Open item ID or comma-separated IDs in multiple mode",
        "First enabled item"
      ],
      [
        "label",
        "Accessible group name",
        "Expandable sections"
      ],
      [
        "multiple",
        "Allow multiple panels to remain open",
        "absent"
      ],
      [
        "collapsible",
        "Allow all panels to close",
        "absent"
      ],
      [
        "disabled-items",
        "Comma-separated disabled item IDs",
        "none"
      ],
      [
        "disabled",
        "Disable every header",
        "absent"
      ]
    ],
    "notes": [
      "Each panel is populated from a matching template[data-panel] child. Collapsing a panel hides its existing DOM instead of destroying form state.",
      "Each header is a real button with aria-expanded and aria-controls; each panel is a labelled region.",
      "The change event exposes value and openItems."
    ],
    "happens": [
      [
        "open a section",
        "the walnut lid lifts and its sand compartment is revealed"
      ],
      [
        "enable multiple",
        "more than one lid may remain open"
      ],
      [
        "disable a section",
        "its header button is disabled"
      ]
    ],
    "limits": [
      "Up to five accordion items. Attribute definitions reserve comma and colon as delimiters.",
      "This is a disclosure control, not a nested tree view."
    ],
    "manualDocs": true
  },
  {
    "id": "pagination",
    "name": "Pagination",
    "tag": "sand-pagination",
    "categories": [
      "navigation",
      "pagination",
      "sand",
      "animation"
    ],
    "sub": "A stone marks the current page along a carved sand track.",
    "desc": "A pagination control with numbered sand wells and a moving river-stone page marker. Page state and navigation are native buttons; data loading remains the host application's responsibility.",
    "docs": "Use <sand-pagination page=\"4\" total=\"24\"></sand-pagination>. Read or set page, configure sibling-count and boundary-count, and listen for change to load the selected page.",
    "intro": [
      "A row of numbered wells is carved into a shallow sand track. The low river stone marks the current 1-based page."
    ],
    "use": "<script src=\"pagination.js\"></script>\n<sand-pagination page=\"4\" total=\"24\" sibling-count=\"1\" boundary-count=\"1\" show-first-last label=\"Search results\"></sand-pagination>",
    "js": "const pages = document.querySelector('sand-pagination');\npages.addEventListener('change', event => loadResults(event.detail.page));\npages.page = 5;",
    "attrs": [
      [
        "page",
        "Current 1-based page",
        "1"
      ],
      [
        "total",
        "Total page count, minimum 1",
        "1"
      ],
      [
        "sibling-count",
        "Adjacent page buttons, 0 to 3",
        "1"
      ],
      [
        "boundary-count",
        "Buttons at each end, 1 to 3",
        "1"
      ],
      [
        "show-first-last",
        "Include first/last navigation buttons",
        "absent"
      ],
      [
        "disabled",
        "Disable all page buttons",
        "absent"
      ],
      [
        "label",
        "Navigation landmark name",
        "Pagination"
      ]
    ],
    "notes": [
      "Ellipses are decorative separators. A single-page gap is rendered as its missing page number.",
      "The change event exposes page, previousPage and total. The component does not fetch data or change browser history.",
      "The current page uses aria-current=page. Navigation edges use disabled buttons."
    ],
    "happens": [
      [
        "select a page",
        "the stone marker moves to that page's well and change is dispatched"
      ],
      [
        "reach the first or last page",
        "the previous or next control is disabled"
      ],
      [
        "reduce the page window",
        "the number of visible sibling and boundary buttons changes"
      ]
    ],
    "limits": [
      "Page values are clamped to the inclusive 1..total range.",
      "The control is a single-row pagination bar, not infinite scrolling or cursor pagination."
    ],
    "manualDocs": true
  },
  {
    "id": "breadcrumbs",
    "name": "Breadcrumbs",
    "tag": "sand-breadcrumbs",
    "categories": [
      "navigation",
      "breadcrumbs",
      "sand",
      "animation"
    ],
    "sub": "Stepping stones form a navigable hierarchy through raked sand.",
    "desc": "A breadcrumb navigation trail with real ancestor links and a non-interactive current page marker. River stones sit along a shallow raked path.",
    "docs": "Use <sand-breadcrumbs items=\"Home|/;Library|/library;Current\"></sand-breadcrumbs>. Supply semicolon-separated Label|URL ancestors and a plain current label, or assign the items array property.",
    "intro": [
      "A hierarchy becomes a path of stepping stones across raked sand. Ancestors are links; the final stone marks the current location."
    ],
    "use": "<script src=\"breadcrumbs.js\"></script>\n<sand-breadcrumbs items=\"Home|/;Library|/library;Components|/components;Breadcrumbs\"></sand-breadcrumbs>",
    "js": "const crumbs = document.querySelector('sand-breadcrumbs');\ncrumbs.items = [{ label: 'Home', href: '/' }, { label: 'Current' }];",
    "attrs": [
      [
        "items",
        "Semicolon-separated Label|URL entries or an array of objects",
        "Home, Library, Current project"
      ],
      [
        "label",
        "Navigation landmark name",
        "Breadcrumb"
      ],
      [
        "separator",
        "Visible separator glyph",
        "›"
      ]
    ],
    "notes": [
      "Ancestors render as native anchors. The final label is a span with aria-current=page.",
      "Only HTTP(S) and safe relative destinations become links. javascript:, data:, protocol-relative and other schemes are rejected.",
      "The items property accepts an array of {label, href} objects and supports labels/URLs containing delimiters."
    ],
    "happens": [
      [
        "navigate an ancestor",
        "the browser follows the supplied href as a normal link"
      ],
      [
        "change the item array",
        "the breadcrumb path and stepping-stone positions are rebuilt"
      ],
      [
        "reach the final item",
        "it is marked aria-current=page and is not a link"
      ]
    ],
    "limits": [
      "Up to eight breadcrumb items.",
      "The component does not create routes or intercept navigation."
    ],
    "manualDocs": true
  },
  {
    "id": "menu",
    "name": "Menu / Popover",
    "tag": "sand-menu",
    "categories": [
      "navigation",
      "menu",
      "popover",
      "overlay",
      "sand"
    ],
    "sub": "A stone trigger lifts a walnut-framed command tray.",
    "desc": "A compact command menu with a lifting stone trigger, anchored walnut tray, keyboard navigation, outside dismissal and focus restoration. Commands are emitted as events for the host application.",
    "docs": "Use <sand-menu items=\"new:New project,duplicate:Duplicate\"></sand-menu>. Listen for the bubbling select event to run an action. The open property and attribute control the menu visibility.",
    "intro": [
      "A small river stone lifts from a carved trigger well and reveals a walnut-framed option tray. Actions remain native buttons and are reported to the host application."
    ],
    "use": "<script src=\"menu.js\"></script>\n<sand-menu label=\"Project actions\" items=\"new:New project,duplicate:Duplicate,archive:Archive\"></sand-menu>",
    "js": "const menu = document.querySelector('sand-menu');\nmenu.addEventListener('select', event => runAction(event.detail.value));\nmenu.open = true;",
    "attrs": [
      [
        "items",
        "Comma-separated value:Label definitions, optional :disabled suffix",
        "New project, Duplicate, Archive"
      ],
      [
        "label",
        "Trigger and menu accessible name",
        "Actions"
      ],
      [
        "open",
        "Reflects open visibility",
        "absent"
      ],
      [
        "disabled",
        "Disable trigger and prevent opening",
        "absent"
      ],
      [
        "keep-open",
        "Keep menu open after a selection",
        "absent"
      ]
    ],
    "notes": [
      "ArrowDown/ArrowUp open and focus the first/last enabled item. Up/Down move inside; Home/End move to edges; Escape closes and restores trigger focus.",
      "Tab closes without trapping focus. Outside pointer press dismisses. The tray repositions on scroll and resize and stays within the viewport.",
      "The select event exposes value and label; the component never executes the action itself."
    ],
    "happens": [
      [
        "open the trigger",
        "the stone lifts and the anchored walnut option tray appears"
      ],
      [
        "select an enabled action",
        "a select event is emitted and the menu closes unless keep-open is present"
      ],
      [
        "press Escape or click outside",
        "the tray closes; Escape restores focus to the trigger"
      ]
    ],
    "limits": [
      "Up to eight menu items.",
      "This component is a command menu, not a modal dialog or general rich-content popover."
    ],
    "manualDocs": true
  },
  {
    "id": "dropzone",
    "name": "File Dropzone",
    "tag": "sand-dropzone",
    "categories": [
      "file",
      "upload",
      "dropzone",
      "input",
      "sand",
      "animation"
    ],
    "sub": "A file tile lands in a recessed walnut tray.",
    "desc": "A file dropzone with real drag-and-drop and native file selection, type and size checks, clearable file state and accessible rejection messages. A file tile settles into a sand tray when accepted.",
    "docs": "Use <sand-dropzone accept=\"image/*,.pdf\" multiple max-size=\"10485760\" label=\"Project files\"></sand-dropzone>. Read files, call addFiles() or clear(), and listen for files-change and file-reject. max-size is in bytes; the component selects files but does not upload them.",
    "intro": [
      "A file is a small object arriving at a physical tray. Dragging over the frame raises a settled stone; dropping a valid file makes its tile land in the tray and the sand settle around it. The native file picker remains available for keyboard and touch users."
    ],
    "use": "<script src=\"dropzone.js\"></script>\n<sand-dropzone accept=\"image/*,.pdf\" multiple max-size=\"10485760\" label=\"Project files\"></sand-dropzone>",
    "js": "const zone = document.querySelector('sand-dropzone');\nzone.addEventListener('files-change', event => queueFiles(event.detail.files));\nzone.addEventListener('file-reject', event => showRejected(event.detail.rejected));\n// zone.files returns a copy; zone.clear() empties the tray.",
    "attrs": [
      [
        "accept",
        "Comma-separated MIME types, wildcards or extensions",
        "all files"
      ],
      [
        "multiple",
        "Accept more than one file",
        "absent"
      ],
      [
        "max-size",
        "Maximum size of each file, in bytes",
        "no limit"
      ],
      [
        "disabled",
        "Disable picker and drop handling",
        "absent"
      ],
      [
        "label",
        "Accessible name for the file area",
        "File upload area"
      ]
    ],
    "notes": [
      "The component validates file MIME types/extensions and individual file size before accepting a file. It does not inspect file contents or upload anything.",
      "The files-change event contains files and rejected entries. file-reject contains only rejected entries and reasons.",
      "The Choose files button opens a real input[type=file]; drag-and-drop is an additional pointer interaction, not the only way to select files."
    ],
    "happens": [
      [
        "drag files over the tray",
        "the recessed border brightens and a stone tile rises"
      ],
      [
        "drop an accepted file",
        "the file appears as a tile and the sand settles"
      ],
      [
        "drop an unsupported file",
        "the file is rejected with a readable reason"
      ],
      [
        "clear the tray",
        "selected files and status are removed"
      ]
    ],
    "limits": [
      "The component stores File objects in memory for the lifetime of the element. It does not create previews, persist files or send network requests."
    ],
    "demo": {
      "html": "<sand-dropzone id=\"el\" accept=\"image/*,.pdf\" multiple max-size=\"10485760\" label=\"Project files\"></sand-dropzone><p class=\"readout\" id=\"out\">Drop an image or PDF, or use Choose files.</p>",
      "hint": "Try dropping a file or choosing one. Unsupported types and files above 10 MB are rejected.",
      "script": "const out = document.getElementById('out'); el.addEventListener('files-change', e => out.textContent = e.detail.files.length + ' accepted file(s)'); el.addEventListener('file-reject', e => out.textContent = e.detail.rejected.map(x => x.name + ': ' + x.reason).join(' · '));"
    }
  },
  {
    "id": "upload-queue",
    "name": "Upload Queue",
    "tag": "sand-upload-queue",
    "categories": [
      "file",
      "upload",
      "queue",
      "progress",
      "sand",
      "animation"
    ],
    "sub": "File tiles move through a walnut transfer channel.",
    "desc": "A transport-agnostic upload queue with per-file progress, queued/uploading/complete/error/cancelled states, retry and removal controls. It emits requests so the host application can perform the actual transfer.",
    "docs": "Use <sand-upload-queue label=\"Uploads\"></sand-upload-queue>. Call addFiles(files), update(id, {status, progress, error}), remove(id) or clear(). Listen for upload-request, upload-cancel, retry-request and queue-change. The host application owns the network transfer.",
    "intro": [
      "The queue is a small transfer channel: each file has its own tile, status and progress ridge. The component owns the queue's state and controls; your application owns the actual HTTP request, authentication, storage destination and retry policy."
    ],
    "use": "<script src=\"upload-queue.js\"></script>\n<sand-upload-queue label=\"Uploads\"></sand-upload-queue>",
    "js": "const queue = document.querySelector('sand-upload-queue');\nqueue.addEventListener('upload-request', ({ detail }) => startYourUpload(detail.item));\n// From your transport callback:\nqueue.update(id, { status: 'uploading', progress: 46 });\nqueue.update(id, { status: 'complete', progress: 100 });",
    "attrs": [
      [
        "label",
        "Accessible queue name",
        "Upload queue"
      ]
    ],
    "notes": [
      "addFiles(files) returns stable item IDs and emits upload-request once for each new item. It does not start a network request itself.",
      "update(id, patch) accepts queued, uploading, complete, error and cancelled states. Progress is clamped to 0–100; reaching 100 while uploading completes the item.",
      "Cancel and retry controls emit upload-cancel and retry-request. The host must cancel or restart the real transfer, then update queue state.",
      "The queue-change event contains a snapshot of the item list. File objects are retained in memory and are not persisted."
    ],
    "happens": [
      [
        "add files",
        "file tiles enter the queue with a waiting state"
      ],
      [
        "report progress",
        "a carved channel fills beneath the active tile"
      ],
      [
        "complete a transfer",
        "the tile settles and its status becomes complete"
      ],
      [
        "cancel or retry",
        "a request event is sent to the host application"
      ]
    ],
    "limits": [
      "No HTTP transport is built in. Connect upload-request, upload-cancel and retry-request to your own upload service.",
      "Progress is supplied by the host; the queue does not infer progress from a File object."
    ],
    "demo": {
      "html": "<sand-upload-queue id=\"el\" label=\"Uploads\"></sand-upload-queue><div class=\"row\"><button class=\"pill\" id=\"simulate\" type=\"button\">Add sample files</button></div><p class=\"readout\" id=\"out\">The demo simulates queue events, not a network upload.</p>",
      "hint": "Add sample files. The queue emits upload-request; the demo simulates progress locally.",
      "script": "const out = document.getElementById('out'); el.addEventListener('upload-request', e => out.textContent = 'Queued: ' + e.detail.item.name + '. Demo will simulate progress.'); document.getElementById('simulate').onclick = () => { const ids = el.addFiles([new File(['one'], 'brand-assets.zip', {type:'application/zip'}), new File(['two'], 'hero-image.png', {type:'image/png'})]); ids.forEach((id,i) => { el.update(id,{status:'uploading',progress:22}); setTimeout(()=>el.update(id,{status:'uploading',progress:68}),450+i*120); setTimeout(()=>el.update(id,{status:'complete',progress:100}),900+i*160); }); };"
    }
  },
  {
    "id": "carousel",
    "name": "Image Carousel",
    "tag": "sand-carousel",
    "categories": [
      "media",
      "image",
      "carousel",
      "gallery",
      "sand",
      "animation"
    ],
    "sub": "Framed image plates travel along a sand track.",
    "desc": "An image carousel that displays real images in a recessed walnut frame with previous/next buttons, indexed selection, touch swipes and keyboard navigation. It never fetches or transforms image sources.",
    "docs": "Set el.items to an array of {src, alt, caption} objects. Read or set el.index and listen for change. Only HTTP(S), blob and data:image sources are accepted.",
    "intro": [
      "Photographs sit in framed walnut plates. The selected plate moves along a shallow sand track while the native controls and accessible text identify the current image."
    ],
    "use": "<script src=\"carousel.js\"></script>\n<sand-carousel id=\"photos\" label=\"Project photos\"></sand-carousel>\n<script>\nphotos.items = [{ src: '/images/one.jpg', alt: 'Studio', caption: 'Studio light' }];\n</script>",
    "js": "const carousel = document.querySelector('sand-carousel');\ncarousel.items = [\n  { src: '/images/studio.jpg', alt: 'Studio', caption: 'Studio light' },\n  { src: '/images/material.jpg', alt: 'Material', caption: 'Walnut and sand' },\n];\ncarousel.addEventListener('change', event => showImage(event.detail.index));",
    "attrs": [
      [
        "label",
        "Accessible carousel name",
        "Image carousel"
      ],
      [
        "index",
        "Initial/current image index (zero-based)",
        "0"
      ],
      [
        "disabled",
        "Disable navigation controls",
        "absent"
      ],
      [
        "items",
        "Property array of image objects",
        "empty"
      ]
    ],
    "notes": [
      "items is a property array of {src, alt, caption}; the component does not parse an arbitrary HTML string into images.",
      "Previous/next buttons, dot buttons, Left/Right keys and touch swipes change the selected image. Selection wraps at either end.",
      "Only HTTP(S), blob and data:image URLs are accepted. Images use object-fit:cover within a beveled frame."
    ],
    "happens": [
      [
        "select another frame",
        "the framed plate changes and the stone marker moves along the track"
      ],
      [
        "swipe left or right",
        "the next or previous image is selected"
      ],
      [
        "press an arrow key",
        "the carousel advances while focus remains within it"
      ]
    ],
    "limits": [
      "The component does not lazy-fetch remote images beyond the browser's normal image loading and does not implement video slides or automatic autoplay."
    ],
    "demo": {
      "html": "<sand-carousel id=\"el\" label=\"Material study\"></sand-carousel><div class=\"readout\" id=\"out\">Image 1 of 3</div>",
      "hint": "Use the arrows, dots, Left/Right keys or swipe across the framed image.",
      "script": "el.items = [{src:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1100&q=85',alt:'Mountain landscape',caption:'Stone and open sky'},{src:'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=1100&q=85',alt:'Warm interior',caption:'Quiet interior details'},{src:'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1100&q=85',alt:'Mountain under stars',caption:'Night over the mountains'}]; const out=document.getElementById('out'); const show=()=>out.textContent='Image '+(el.index+1)+' of '+el.items.length;el.addEventListener('change',show);show();"
    }
  },
  {
    "id": "lightbox",
    "name": "Lightbox Gallery",
    "tag": "sand-lightbox",
    "categories": [
      "media",
      "image",
      "gallery",
      "lightbox",
      "dialog",
      "sand"
    ],
    "sub": "A selected framed image opens above the tray.",
    "desc": "A thumbnail gallery with a native modal dialog for expanded images, accessible previous/next navigation, Escape/backdrop dismissal and focus restoration.",
    "docs": "Set el.items to {src, alt, caption} objects. Call openAt(index, opener) or close(), and listen for open, change and close. The expanded viewer uses the native dialog element.",
    "intro": [
      "A set of thumbnail plates sits inside a walnut gallery tray. Opening a plate lifts it into a full-screen viewing surface; the browser's native dialog supplies modal behavior and focus containment."
    ],
    "use": "<script src=\"lightbox.js\"></script>\n<sand-lightbox id=\"gallery\" label=\"Product gallery\"></sand-lightbox>\n<script>\ngallery.items = [{ src: '/images/one.jpg', alt: 'Detail', caption: 'Close detail' }];\n</script>",
    "js": "const gallery = document.querySelector('sand-lightbox');\ngallery.items = [{ src: '/images/one.jpg', alt: 'Detail', caption: 'Close detail' }];\ngallery.openAt(0); // gallery.close() dismisses the dialog",
    "attrs": [
      [
        "label",
        "Accessible gallery/viewer name",
        "Image gallery"
      ],
      [
        "items",
        "Property array of {src, alt, caption} objects",
        "empty"
      ]
    ],
    "notes": [
      "The thumbnail grid uses actual images with alt text. Activating a thumbnail opens a native <dialog> using showModal().",
      "Escape, Close and backdrop clicks dismiss the dialog. Focus returns to the element that opened the image when that opener remains connected.",
      "Left/Right keys and Previous/Next buttons navigate images; open, change and close events expose the current index/item."
    ],
    "happens": [
      [
        "choose a thumbnail",
        "a framed image opens above the page"
      ],
      [
        "navigate",
        "the displayed plate changes without closing the viewer"
      ],
      [
        "press Escape or Close",
        "the viewer closes and focus returns to the opener"
      ]
    ],
    "limits": [
      "The image URLs are supplied by the host and are not downloaded, proxied or cached by this component.",
      "Browser-native dialog support is required for the modal viewer."
    ],
    "demo": {
      "html": "<sand-lightbox id=\"el\" label=\"Material gallery\"></sand-lightbox><p class=\"readout\" id=\"out\">Select a thumbnail to open the viewer.</p>",
      "hint": "Select a thumbnail, then navigate inside the viewer or close it with Escape.",
      "script": "el.items=[{src:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=90',alt:'Mountain landscape',caption:'Open sky above the ridge'},{src:'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=1200&q=90',alt:'Warm interior',caption:'A quiet interior'},{src:'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=90',alt:'Night sky',caption:'Stars above the mountains'}];const out=document.getElementById('out');el.addEventListener('open',e=>out.textContent='Opened image '+(e.detail.index+1));el.addEventListener('close',()=>out.textContent='Viewer closed');"
    }
  },
  {
    "id": "scrubber",
    "name": "Media Scrubber",
    "tag": "sand-scrubber",
    "categories": [
      "media",
      "audio",
      "video",
      "timeline",
      "scrubber",
      "sand"
    ],
    "sub": "A rake and stone mark the playhead in a media timeline.",
    "desc": "A media timeline bound to an existing HTMLAudioElement or HTMLVideoElement, with play/pause, current position, buffered range visualization and keyboard-accessible seeking.",
    "docs": "Assign el.media = document.querySelector('video') or an audio element. The scrubber does not fetch media; it reads duration/currentTime/buffered and writes currentTime when seeking.",
    "intro": [
      "A narrow raked channel becomes a media timeline. A stone marks the playhead, a pale ridge shows buffered content, and the native range input makes seeking available to touch, mouse and keyboard users."
    ],
    "use": "<script src=\"scrubber.js\"></script>\n<video id=\"clip\" controls src=\"/media/demo.mp4\"></video>\n<sand-scrubber id=\"timeline\" label=\"Clip position\"></sand-scrubber>\n<script>timeline.media = clip;</script>",
    "js": "const media = document.querySelector('video');\nconst scrubber = document.querySelector('sand-scrubber');\nscrubber.media = media;\nscrubber.addEventListener('seek', event => logSeek(event.detail.time));",
    "attrs": [
      [
        "label",
        "Accessible timeline label",
        "Media position"
      ],
      [
        "disabled",
        "Disable play and seek controls",
        "absent"
      ],
      [
        "media",
        "HTMLAudioElement/HTMLVideoElement property",
        "null"
      ]
    ],
    "notes": [
      "Assign a real audio or video element to the media property. The component listens for timeupdate, durationchange, progress, play, pause, seeking, seeked, loadedmetadata and ended.",
      "Play/Pause delegates to the media element. Seeking writes its currentTime and emits seek while adjusting and seeked when committed.",
      "Buffered width is derived from the media element's TimeRanges. The component does not own the source URL or network loading."
    ],
    "happens": [
      [
        "play media",
        "the play button reflects the media element's state"
      ],
      [
        "seek",
        "the stone playhead and media currentTime move together"
      ],
      [
        "buffer media",
        "the buffered ridge advances along the carved channel"
      ]
    ],
    "limits": [
      "Duration/currentTime and buffered data are browser media APIs; live streams with unknown duration may not show a seekable range.",
      "The component does not implement a media player, source selection, captions or transport controls beyond play/pause."
    ],
    "demo": {
      "html": "<video id=\"media\" controls muted playsinline preload=\"metadata\" src=\"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4\" style=\"width:min(100%,440px);border-radius:12px\"></video><sand-scrubber id=\"el\" label=\"Video position\"></sand-scrubber><p class=\"readout\" id=\"out\">Loading media metadata…</p>",
      "hint": "Load the sample clip, play it, then seek using the stone timeline or keyboard.",
      "script": "const media=document.getElementById('media'),out=document.getElementById('out');el.media=media;const show=()=>out.textContent=media.duration?Math.floor(media.currentTime)+'s / '+Math.floor(media.duration)+'s':'Waiting for media metadata';media.addEventListener('loadedmetadata',show);media.addEventListener('timeupdate',show);show();"
    }
  },
  {
    "id": "color-picker",
    "name": "Color Picker",
    "tag": "sand-color-picker",
    "categories": [
      "color",
      "picker",
      "input",
      "form",
      "sand",
      "palette"
    ],
    "sub": "Mineral pigment stones select a usable color value.",
    "desc": "A color control with the native browser color dialog and a palette of tactile mineral swatches. Supports hexadecimal, RGB and HSL readouts plus form submission.",
    "docs": "Use <sand-color-picker name=\"accent\" value=\"#c28b55\" format=\"hex\"></sand-color-picker>. Read or set value; input and change events expose both formatted value and normalized hex.",
    "intro": [
      "A pigment well holds a mineral sample. The native color input opens the browser's color chooser, while named mineral stones provide quick selections without replacing native keyboard and platform behavior."
    ],
    "use": "<script src=\"color-picker.js\"></script>\n<sand-color-picker name=\"accent\" value=\"#c28b55\" format=\"hex\" label=\"Accent color\"></sand-color-picker>",
    "js": "const picker = document.querySelector('sand-color-picker');\npicker.addEventListener('input', event => preview(event.detail.hex));\npicker.addEventListener('change', event => save(event.detail.value));\npicker.value = '#547d73';",
    "attrs": [
      [
        "value",
        "Selected CSS color; normalized to #rrggbb",
        "#c28b55"
      ],
      [
        "format",
        "hex, rgb or hsl readout and submitted value",
        "hex"
      ],
      [
        "label",
        "Accessible name for the native color control",
        "Choose a colour"
      ],
      [
        "name",
        "Form field name",
        "absent"
      ],
      [
        "disabled",
        "Disable color input and mineral swatches",
        "absent"
      ]
    ],
    "notes": [
      "The browser's native input[type=color] opens the platform color chooser. The component does not emulate a custom hue/saturation canvas.",
      "Preset mineral stones select named values. input and change events expose detail.value in the selected format and detail.hex in normalized hexadecimal.",
      "When a name is present, the normalized selected value is submitted through ElementInternals. The component participates in form reset and disabled-state callbacks."
    ],
    "happens": [
      [
        "choose a pigment stone",
        "the sample well changes to that mineral color"
      ],
      [
        "open the native chooser",
        "the browser color dialog is used"
      ],
      [
        "change format",
        "the displayed and submitted value is represented as hex, rgb or hsl"
      ]
    ],
    "limits": [
      "Exact appearance of the native color dialog is browser/OS controlled.",
      "CSS color names and rgb/hsl strings are normalized to 6-digit hex; alpha/transparency is not preserved."
    ],
    "demo": {
      "html": "<sand-color-picker id=\"el\" name=\"accent\" value=\"#c28b55\" format=\"hex\" label=\"Accent color\"></sand-color-picker><p class=\"readout\" id=\"out\">#c28b55</p>",
      "hint": "Choose one of the mineral swatches or open the native browser color chooser.",
      "script": "const out=document.getElementById('out');el.addEventListener('input',e=>out.textContent=e.detail.hex);"
    }
  },
  {
    "id": "sortable",
    "name": "Sortable List",
    "tag": "sand-sortable",
    "categories": [
      "list",
      "sortable",
      "drag-and-drop",
      "reorder",
      "sand",
      "accessibility"
    ],
    "sub": "Stone tiles reorder inside carved sand grooves.",
    "desc": "A reorderable list with native drag-and-drop, keyboard shortcuts and explicit move buttons. Ordering is stored as stable item IDs and exposed through a property and events.",
    "docs": "Set items to an array of {id,label,disabled} objects. Read value for the ordered IDs or call move(fromIndex,toIndex). Native dragging, arrow keys and Move Up/Down buttons are supported.",
    "intro": [
      "A row of small stone tiles rests in individually carved grooves. Drag a tile to another position, use the keyboard to move it, or press the raised arrow controls. The data order is real and is reported to the host application; the sand marker simply follows the active row."
    ],
    "use": "<script src=\"sortable.js\"></script>\n<sand-sortable id=\"tasks\" label=\"Project tasks\"></sand-sortable>\n<script>\ntasks.items = [{ id: 'brief', label: 'Prepare brief' }, { id: 'build', label: 'Build prototype' }];\n</script>",
    "js": "const list = document.querySelector('sand-sortable');\nlist.addEventListener('reorder', event => saveOrder(event.detail.order));\nlist.move(1, 0); // move the second item to the first position\nlist.value;       // stable IDs in current order",
    "attrs": [
      [
        "`label`",
        "Accessible list name",
        "Sortable list"
      ],
      [
        "`disabled`",
        "Disable dragging and move actions",
        "absent"
      ],
      [
        "`items`",
        "Property array of {id,label,disabled} objects",
        "empty"
      ],
      [
        "`value`",
        "Ordered array of stable item IDs",
        "items order"
      ]
    ],
    "notes": [
      "Set `items` as a property array. IDs must be unique; labels are rendered as text, not interpreted as HTML.",
      "Drag a row with a mouse, use Arrow Up/Down or Home/End on its handle, or use the visible Move Up/Down buttons.",
      "`move(fromIndex,toIndex)` moves one row. `reorder` and `change` expose the item, indices, updated items and ordered ID array.",
      "Disabled items cannot be dragged or moved through the component API."
    ],
    "happens": [
      [
        "drag a tile",
        "the row lifts and settles into the new position"
      ],
      [
        "press Arrow Up/Down",
        "the focused handle reorders the tile and stays focused"
      ],
      [
        "use Move Up/Down",
        "the tile moves one place and the stone marker follows"
      ]
    ],
    "limits": [
      "The component manages list order only. Persistence, server synchronization, virtualization and application-specific validation belong to the host."
    ],
    "demo": {
      "html": "<sand-sortable id=\"el\" label=\"Sprint tasks\"></sand-sortable><p class=\"readout\" id=\"out\">Move a task with its handle, arrow keys or move buttons.</p>",
      "hint": "Drag a row or focus its handle and press Arrow Up/Down. The visible buttons provide the same action.",
      "script": "el.items=[{id:'plan',label:'Plan the release'},{id:'design',label:'Review the design'},{id:'build',label:'Build the feature'},{id:'ship',label:'Ship the update'}];const out=document.getElementById('out');el.addEventListener('reorder',e=>out.textContent='New order: '+e.detail.order.join(' → '));"
    }
  },
  {
    "id": "transfer-list",
    "name": "Transfer List",
    "tag": "sand-transfer-list",
    "categories": [
      "list",
      "transfer",
      "selection",
      "multi-select",
      "sand",
      "accessibility"
    ],
    "sub": "Selected stones move between two sand compartments.",
    "desc": "A two-sided transfer control with multi-selection, explicit move-selected and move-all actions, and stable item IDs. The host owns the data and persistence.",
    "docs": "Set items to {id,label,side,disabled} objects. Select IDs through the selected property, then call move(ids,'left'|'right'), moveSelected(target) or moveAll(target).",
    "intro": [
      "Two shallow walnut-edged trays hold small river stones. Select one or more stones in either tray, then move them across the channel. The selected set and each item's side remain ordinary data, ready for the host application to persist."
    ],
    "use": "<script src=\"transfer-list.js\"></script>\n<sand-transfer-list id=\"fields\" label=\"Included fields\"></sand-transfer-list>\n<script>\nfields.items = [{ id: 'name', label: 'Name', side: 'left' }, { id: 'email', label: 'Email', side: 'right' }];\n</script>",
    "js": "const transfer = document.querySelector('sand-transfer-list');\ntransfer.addEventListener('transfer', event => saveFields(event.detail.items));\ntransfer.select(['name', 'email']);\ntransfer.moveSelected('right');",
    "attrs": [
      [
        "`label`",
        "Accessible transfer control name",
        "Transfer items"
      ],
      [
        "`disabled`",
        "Disable selection and transfer actions",
        "absent"
      ],
      [
        "`items`",
        "Property array with id, label and side",
        "empty"
      ],
      [
        "`selected`",
        "Selected item ID array",
        "empty"
      ]
    ],
    "notes": [
      "Each item uses `side: 'left'` or `side: 'right'`. An unknown or omitted side starts on the left.",
      "Click an item to toggle its selection. The selected property can also be assigned from application state.",
      "`move(ids,target)`, `moveSelected(target)` and `moveAll(target)` update side values and emit `transfer` plus `change`.",
      "The component does not fetch, filter or persist data. It only changes which tray owns each item."
    ],
    "happens": [
      [
        "select stones",
        "the selected tiles lift against the walnut tray"
      ],
      [
        "move selected",
        "the stones cross to the opposite compartment"
      ],
      [
        "move all",
        "every enabled item in the source tray transfers"
      ]
    ],
    "limits": [
      "The component is designed for compact option sets. Large data sets should be filtered or virtualized by the host application."
    ],
    "demo": {
      "html": "<sand-transfer-list id=\"el\" label=\"Included project assets\"></sand-transfer-list><p class=\"readout\" id=\"out\">Select assets and transfer them between trays.</p>",
      "hint": "Select one or more assets, then use the centre arrows. You can move all items back as well.",
      "script": "el.items=[{id:'logo',label:'Brand logo',side:'left'},{id:'fonts',label:'Font files',side:'left'},{id:'tokens',label:'Design tokens',side:'left'},{id:'copy',label:'Product copy',side:'right'}];const out=document.getElementById('out');el.addEventListener('transfer',e=>out.textContent=e.detail.ids.length+' item(s) moved '+e.detail.target);"
    }
  },
  {
    "id": "split-pane",
    "name": "Split Pane",
    "tag": "sand-split-pane",
    "categories": [
      "layout",
      "split-pane",
      "resizable",
      "panels",
      "sand",
      "accessibility"
    ],
    "sub": "A stone divider adjusts the balance of two working surfaces.",
    "desc": "A two-pane horizontal or vertical layout with a pointer-draggable separator, keyboard resizing, minimum and maximum bounds, and slotted host content.",
    "docs": "Place child elements in slot=\"start\" and slot=\"end\". Set value as the first pane percentage, axis to horizontal or vertical, and configure min-size/max-size. Listen for input and change.",
    "intro": [
      "Two sand-backed work surfaces meet at a narrow walnut divider. Move the divider to give the primary workspace or its inspector more room. Content remains ordinary DOM supplied by the host; the component only controls the split and its accessible separator."
    ],
    "use": "<script src=\"split-pane.js\"></script>\n<sand-split-pane value=\"62\" axis=\"horizontal\" label=\"Editor layout\">\n  <section slot=\"start\">Editor content</section>\n  <aside slot=\"end\">Inspector content</aside>\n</sand-split-pane>",
    "js": "const split = document.querySelector('sand-split-pane');\nsplit.addEventListener('input', event => previewRatio(event.detail.value));\nsplit.value = 68; // first pane receives 68 percent",
    "attrs": [
      [
        "`value`",
        "First pane size as a percentage",
        "58"
      ],
      [
        "`axis`",
        "`horizontal` (left/right) or `vertical` (top/bottom)",
        "horizontal"
      ],
      [
        "`min-size` / `max-size`",
        "Minimum and maximum first-pane percentage",
        "20 / 80"
      ],
      [
        "`disabled`",
        "Disable pointer and keyboard resizing",
        "absent"
      ],
      [
        "`label`",
        "Accessible separator name",
        "Resize panes"
      ]
    ],
    "notes": [
      "Place content in direct children with `slot=\"start\"` and `slot=\"end\"`. Content nodes are moved into the two scrollable pane containers without parsing HTML strings.",
      "`value` is the first pane's percentage. The second pane receives the remaining space after the divider.",
      "Drag the divider with a pointer or focus it and use the axis arrows, Home or End. The separator exposes `role=\"separator\"` and its current value.",
      "`input` fires while the divider moves; `change` fires when a pointer drag completes or a keyboard adjustment commits."
    ],
    "happens": [
      [
        "drag the divider",
        "one pane grows while the other gives up the same space"
      ],
      [
        "press an axis arrow",
        "the divider moves by the configured step"
      ],
      [
        "press Home or End",
        "the first pane moves to its minimum or maximum"
      ]
    ],
    "limits": [
      "This component provides a single two-pane split. It does not persist sizes, coordinate nested layouts or manage application routing."
    ],
    "demo": {
      "html": "<sand-split-pane id=\"el\" value=\"58\" axis=\"horizontal\" label=\"Design workspace\"><section slot=\"start\"><h3>Canvas</h3><p>Primary workspace and live preview.</p></section><aside slot=\"end\"><h3>Inspector</h3><p>Selected layer properties.</p></aside></sand-split-pane><p class=\"readout\" id=\"out\">First pane: 58%</p>",
      "hint": "Drag the stone divider, or focus it and use Left/Right. Switch axis to vertical to stack the panes.",
      "script": "const out=document.getElementById('out');el.addEventListener('input',e=>out.textContent='First pane: '+Math.round(e.detail.value)+'%');"
    }
  },
  {
    "id": "resizable",
    "name": "Resizable Panels",
    "tag": "sand-resizable",
    "categories": [
      "layout",
      "panels",
      "resize",
      "dashboard",
      "sand",
      "accessibility"
    ],
    "sub": "Walnut partitions resize several sand-backed panels.",
    "desc": "A multi-panel layout with two to four panels, adjacent resizable boundaries, keyboard controls, minimum and maximum proportions, and serializable panel sizes.",
    "docs": "Assign panels as an array of {id,label,content,min,max} objects. Read or set sizes as percentages and call resizeBoundary(index,delta) to adjust an adjacent pair.",
    "intro": [
      "Several sand-backed panels sit behind thin walnut partitions. Each divider balances the two adjacent sections while keeping their combined width unchanged. The panel metadata and percentages are public state, so a dashboard can save and restore its layout."
    ],
    "use": "<script src=\"resizable.js\"></script>\n<sand-resizable id=\"layout\" label=\"Dashboard panels\"></sand-resizable>\n<script>\nlayout.panels = [{ id: 'summary', label: 'Summary', content: 'Key metrics' }, { id: 'activity', label: 'Activity', content: 'Recent events' }, { id: 'details', label: 'Details', content: 'Selected record' }];\n</script>",
    "js": "const layout = document.querySelector('sand-resizable');\nlayout.addEventListener('change', event => savePanelSizes(event.detail.sizes));\nlayout.resizeBoundary(0, 6); // grow panel 1 by six percentage points",
    "attrs": [
      [
        "`panels`",
        "Property array of two to four panel descriptors",
        "Three sample panels"
      ],
      [
        "`sizes`",
        "Panel size percentages; values sum to 100",
        "Equal or default layout"
      ],
      [
        "`disabled`",
        "Disable all resize handles",
        "absent"
      ],
      [
        "`label`",
        "Accessible layout group name",
        "Resizable panels"
      ]
    ],
    "notes": [
      "Each panel descriptor accepts `id`, `label`, `content`, `min` and `max`. Content is rendered as text, not HTML.",
      "Read or set `sizes` as percentages. Use `resizeBoundary(index,delta)` to adjust the panel pair on either side of a divider.",
      "Each divider is a focusable `role=\"separator\"`. Arrow Left/Right and Home/End provide keyboard resizing; pointer dragging works with mouse and touch.",
      "`input` is emitted during pointer changes and `change` is emitted on commit. The host is responsible for persisting sizes."
    ],
    "happens": [
      [
        "drag a partition",
        "one panel gains space while its neighbor gives up the same amount"
      ],
      [
        "use arrow keys",
        "the focused partition moves in small increments"
      ],
      [
        "save sizes",
        "the host stores the public percentage array"
      ]
    ],
    "limits": [
      "This component intentionally renders panel descriptions as text. Mount full application content in adjacent layout regions rather than injecting arbitrary HTML into panel descriptors."
    ],
    "demo": {
      "html": "<sand-resizable id=\"el\" label=\"Project dashboard\"></sand-resizable><p class=\"readout\" id=\"out\">Drag a partition or focus it and press Left/Right.</p>",
      "hint": "Resize any boundary. The host can store the sizes array and restore it later.",
      "script": "el.panels=[{id:'summary',label:'Summary',content:'Milestones, status and project health.',min:20,max:58},{id:'activity',label:'Activity',content:'Recent changes and team updates.',min:20,max:60},{id:'inspector',label:'Inspector',content:'Selected task properties.',min:18,max:58}];const out=document.getElementById('out');el.addEventListener('change',e=>out.textContent='Panel sizes: '+e.detail.sizes.map(x=>Math.round(x)+'%').join(' / '));"
    }
  },
  {
    "id": "tree",
    "name": "Tree View",
    "tag": "sand-tree",
    "categories": [
      "tree",
      "hierarchy",
      "navigation",
      "nested-data",
      "sand",
      "accessibility"
    ],
    "sub": "Branching paths are etched into sand and marked with stones.",
    "desc": "A nested tree with expansion state, single-node selection, visible-node keyboard navigation and accessible treeitem semantics.",
    "docs": "Assign nested items with id, label and children. Read or set value and expanded, or call select(id) and toggle(id). Arrow keys navigate and expand/collapse branches.",
    "intro": [
      "Branches are carved into a sand bed, with a river stone marking the selected node. Expand and collapse folders to reveal paths; the tree remains a real nested data structure and uses a roving keyboard focus model for navigation."
    ],
    "use": "<script src=\"tree.js\"></script>\n<sand-tree id=\"files\" label=\"Project files\"></sand-tree>\n<script>\nfiles.items = [{ id: 'src', label: 'src', children: [{ id: 'components', label: 'components' }] }];\nfiles.expanded = ['src'];\n</script>",
    "js": "const tree = document.querySelector('sand-tree');\ntree.addEventListener('select', event => openNode(event.detail.value));\ntree.value = 'components';\ntree.toggle('src');",
    "attrs": [
      [
        "`items`",
        "Nested property array with id, label, children and disabled",
        "Sample project tree"
      ],
      [
        "`value`",
        "Selected node ID",
        "First active node"
      ],
      [
        "`expanded`",
        "Array of expanded parent IDs",
        "Workspace and src"
      ],
      [
        "`disabled`",
        "Disable selection and expansion",
        "absent"
      ],
      [
        "`label`",
        "Accessible tree name",
        "Tree view"
      ]
    ],
    "notes": [
      "Each node accepts `id`, `label`, `disabled` and a nested `children` array. IDs must be unique across the whole tree.",
      "Set `expanded` to restore expanded branches. `toggle(id)` expands or collapses a parent; `select(id)` sets the active node.",
      "Arrow Up/Down moves through visible nodes, Arrow Right expands or enters a child, Arrow Left collapses or moves to the parent, and Home/End move to the first/last visible node.",
      "The tree emits `select` and `change` for selection, and `expand` for branch changes. The host owns loading children and persistence."
    ],
    "happens": [
      [
        "expand a branch",
        "child rows appear under the carved path"
      ],
      [
        "select a node",
        "the marker settles beside the active branch"
      ],
      [
        "use arrow keys",
        "focus follows the visible hierarchy without leaving the tree"
      ]
    ],
    "limits": [
      "The component renders the supplied tree in one DOM pass. Lazy loading, virtualized very large trees, checkbox selection and context menus are host responsibilities."
    ],
    "demo": {
      "html": "<sand-tree id=\"el\" label=\"Project files\"></sand-tree><p class=\"readout\" id=\"out\">Select a node or expand a branch.</p>",
      "hint": "Use Arrow Up/Down to move, Arrow Right to expand, Arrow Left to collapse or return to the parent.",
      "script": "el.items=[{id:'app',label:'app',children:[{id:'components',label:'components',children:[{id:'controls',label:'controls'},{id:'layout',label:'layout'}]},{id:'styles',label:'styles'}]},{id:'public',label:'public',children:[{id:'images',label:'images'}]},{id:'readme',label:'README.md'}];el.expanded=['app','components'];const out=document.getElementById('out');el.addEventListener('select',e=>out.textContent='Selected: '+e.detail.value);"
    }
  },
  {
    "id": "tooltip",
    "name": "Tooltip",
    "tag": "sand-tooltip",
    "categories": [
      "tooltip",
      "hint",
      "accessibility",
      "feedback",
      "sand"
    ],
    "sub": "A small information stone appears beside a focused or hovered control.",
    "desc": "A non-interactive tooltip anchored to a trigger by element ID, with pointer and keyboard activation, Escape dismissal, configurable placement and delay, and aria-describedby token preservation.",
    "docs": "Use the for attribute to reference a trigger element ID and text for the hint. Set placement and delay, or read/write open and call show() or hide().",
    "intro": [
      "A small stone of information appears beside the control that needs it. The hint is connected to its trigger through aria-describedby, opens on pointer hover or keyboard focus, and never steals focus from the control."
    ],
    "use": "<script src=\"tooltip.js\"></script>\\n<button id=\"save\" type=\"button\">Save draft</button>\\n<sand-tooltip for=\"save\" text=\"Saves the current draft.\" placement=\"top\" delay=\"250\"></sand-tooltip>",
    "js": "const tip = document.querySelector('sand-tooltip');\\ntip.show(); // show it programmatically\\ntip.hide(); // dismiss it without moving focus",
    "attrs": [
      [
        "`for`",
        "ID of the trigger element in the same document",
        "required"
      ],
      [
        "`text`",
        "Tooltip message, inserted as text",
        "empty"
      ],
      [
        "`placement`",
        "Preferred placement: top, right, bottom or left",
        "top"
      ],
      [
        "`delay`",
        "Show delay in milliseconds, clamped to 0–2000",
        "350"
      ],
      [
        "`disabled`",
        "Disable tooltip display",
        "absent"
      ],
      [
        "`open`",
        "Reflects open state",
        "absent"
      ]
    ],
    "notes": [
      "The tooltip is associated with the trigger using `aria-describedby`. Existing description IDs are preserved and the tooltip's ID is removed on disconnect.",
      "Pointer hover and keyboard focus show the hint. Pointer exit, focus loss and Escape hide it; the tooltip itself never receives focus.",
      "Use `show()` and `hide()` for programmatic control, or read/write the `open` property.",
      "The tooltip only positions the hint. It does not add a trigger button or make a non-interactive element interactive."
    ],
    "happens": [
      [
        "hover or focus the trigger",
        "a short delay lets the small information stone appear"
      ],
      [
        "press Escape",
        "the tooltip closes without changing trigger focus"
      ],
      [
        "remove the tooltip",
        "its described-by token and event listeners are cleaned up"
      ]
    ],
    "limits": [
      "A tooltip is for short, non-interactive supplementary text. Use a dialog, popover or disclosure for content containing links, controls or longer instructions. `for` must resolve to an element in the same document."
    ],
    "demo": {
      "html": "<button id=\"save\" type=\"button\" class=\"pill\">Hover or focus to see the hint</button><sand-tooltip id=\"el\" for=\"save\" text=\"Saves the current draft.\" placement=\"top\" delay=\"250\"></sand-tooltip><p class=\"readout\">The hint is associated through aria-describedby.</p>",
      "hint": "Hover the button or Tab to it. Press Escape to dismiss the tooltip.",
      "script": "const trigger=document.getElementById('save');"
    }
  },
  {
    "id": "toast",
    "name": "Toast Notification",
    "tag": "sand-toast",
    "categories": [
      "toast",
      "notification",
      "status",
      "feedback",
      "accessibility",
      "sand"
    ],
    "sub": "A stone rolls into a miniature tray, displays a message and exits.",
    "desc": "A timed notification with status or alert semantics, action and dismiss controls, timer pausing on hover/focus, and independent corner stacking.",
    "docs": "Call show(message?) and dismiss(reason?) or set open. Configure title, message, tone, duration, position and action-label. Listen for action and dismiss events.",
    "intro": [
      "A small walnut tray receives a river stone, announces a status message and settles out of view. Notifications can coexist, pause their timer while the user points at or focuses them, and expose an optional action."
    ],
    "use": "<script src=\"toast.js\"></script>\\n<sand-toast id=\"notice\" tone=\"success\" title=\"Saved\" message=\"Your changes are stored.\" duration=\"4500\"></sand-toast>\\n<script>\\nnotice.show();\\nnotice.addEventListener('dismiss', event => console.log(event.detail.reason));\\n</script>",
    "js": "const notice = document.querySelector('sand-toast');\\nnotice.show('Profile updated');\\nnotice.addEventListener('action', () => undoLastChange());\\nnotice.addEventListener('dismiss', event => recordDismissReason(event.detail.reason));",
    "attrs": [
      [
        "`message`",
        "Notification body text",
        "empty"
      ],
      [
        "`title`",
        "Optional short heading",
        "empty"
      ],
      [
        "`tone`",
        "info, success, warning or error",
        "info"
      ],
      [
        "`duration`",
        "Auto-dismiss time in milliseconds; zero disables timeout",
        "4500"
      ],
      [
        "`position`",
        "top-right, top-left, bottom-right or bottom-left",
        "top-right"
      ],
      [
        "`action-label`",
        "Optional action button text",
        "absent"
      ],
      [
        "`dismissible`",
        "Show the close button; defaults on unless set to false",
        "true"
      ],
      [
        "`open`",
        "Reflects whether the toast is visible",
        "absent"
      ]
    ],
    "notes": [
      "Call `show(message?)` to display the toast and `dismiss(reason?)` to close it. Reasons include `programmatic`, `timeout`, `action` and `close`.",
      "An optional action button dispatches `action` and then dismisses the toast. The close button dispatches `dismiss`.",
      "Info and success use `role=status` with polite live announcements. Warning and error use `role=alert` with assertive announcements.",
      "The timer pauses while the toast is hovered or contains keyboard focus. Set `duration=\"0\"` for a persistent toast.",
      "Multiple toast elements can be open at once. The component stacks them by corner; the host owns the application-level notification queue."
    ],
    "happens": [
      [
        "call show()",
        "the stone settles into a corner tray and the message is announced"
      ],
      [
        "hover or focus the toast",
        "the automatic dismissal timer pauses"
      ],
      [
        "activate its action",
        "the action event is emitted before the toast closes"
      ]
    ],
    "limits": [
      "A toast is transient feedback, not a durable error log or the only way to access a critical action. The component does not persist notifications across page loads or manage a network operation."
    ],
    "demo": {
      "html": "<sand-toast id=\"el\" tone=\"success\" title=\"Changes saved\" message=\"Your project is up to date.\" duration=\"0\" position=\"top-right\" action-label=\"Undo\"></sand-toast><button class=\"pill\" type=\"button\" id=\"show-toast\">Show toast</button><p class=\"readout\">The example uses duration 0 so you can dismiss it yourself.</p>",
      "hint": "Show the toast, hover or focus it, activate Undo, or use the close button.",
      "script": "const out=document.querySelector('.readout');document.getElementById('show-toast').addEventListener('click',()=>el.show());el.addEventListener('action',()=>out.textContent='Undo action requested');el.addEventListener('dismiss',e=>out.textContent='Dismissed: '+e.detail.reason);"
    }
  },
  {
    "id": "alert",
    "name": "Alert Banner",
    "tag": "sand-alert",
    "categories": [
      "alert",
      "banner",
      "status",
      "feedback",
      "accessibility",
      "sand"
    ],
    "sub": "A raised sand strip and mineral marker communicate status.",
    "desc": "A persistent status banner with tone-aware live-region semantics, optional title, action and dismissal. It stays visible until the host or user dismisses it.",
    "docs": "Set tone, title, message, dismissible and action-label. Call dismiss() or show(), and listen for action and dismiss events.",
    "intro": [
      "A broad raised strip of sand holds a mineral marker beside a message that should remain visible until it is resolved. Unlike a toast, an alert does not disappear on a timer."
    ],
    "use": "<script src=\"alert.js\"></script>\\n<sand-alert tone=\"warning\" title=\"Storage almost full\" message=\"Remove unused files to continue.\" dismissible></sand-alert>",
    "js": "const alert = document.querySelector('sand-alert');\\nalert.addEventListener('action', () => openStorageSettings());\\nalert.addEventListener('dismiss', () => markNoticeHidden());",
    "attrs": [
      [
        "`tone`",
        "info, success, warning or error",
        "info"
      ],
      [
        "`title`",
        "Optional banner heading",
        "empty"
      ],
      [
        "`message`",
        "Banner body text",
        "empty"
      ],
      [
        "`dismissible`",
        "Show a close button",
        "absent"
      ],
      [
        "`action-label`",
        "Optional action button text",
        "absent"
      ],
      [
        "`dismissed`",
        "Reflects whether the banner is hidden",
        "absent"
      ]
    ],
    "notes": [
      "The alert uses `role=status` with polite announcements for info/success, and `role=alert` with assertive announcements for warning/error.",
      "Set `dismissible` to show the close control. Call `dismiss()` programmatically or `show()` to restore it.",
      "The optional action button dispatches an `action` event. The alert does not close automatically after an action.",
      "Message and title are inserted as text. Application state, persistence and remediation remain host responsibilities."
    ],
    "happens": [
      [
        "show a warning",
        "a raised sand strip and attention stone signal a persistent message"
      ],
      [
        "activate the action",
        "the host receives an action event and can open its workflow"
      ],
      [
        "dismiss the banner",
        "the host receives a dismiss event and can restore the banner later"
      ]
    ],
    "limits": [
      "An alert banner remains until dismissed; it is not a toast and has no auto-dismiss timer. It does not fetch data, resolve the alert or persist dismissal state."
    ],
    "demo": {
      "html": "<sand-alert id=\"el\" tone=\"warning\" title=\"Storage almost full\" message=\"Remove unused files to continue.\" dismissible action-label=\"Review storage\"></sand-alert><p class=\"readout\">This banner stays until dismissed.</p>",
      "hint": "Try the action or close button, then restore the message from the host.",
      "script": "const out=document.querySelector('.readout');el.addEventListener('action',()=>out.textContent='Storage review requested');el.addEventListener('dismiss',()=>out.textContent='Alert dismissed');"
    }
  },
  {
    "id": "dialog",
    "name": "Dialog / Modal",
    "tag": "sand-dialog",
    "categories": [
      "dialog",
      "modal",
      "overlay",
      "accessibility",
      "feedback",
      "sand"
    ],
    "sub": "A framed sand surface appears above the page with actions.",
    "desc": "A native modal dialog custom element that preserves caller content, traps focus through the browser top layer, supports Escape and optional backdrop dismissal, and restores opener focus.",
    "docs": "Set open or call showModal()/show(). Use close(returnValue), title, description, confirm-label, cancel-label and dismissal policy attributes.",
    "intro": [
      "A framed walnut surface rises above the page while the rest of the document falls behind a quiet backdrop. The component uses the browser's native modal dialog, so focus containment and the top layer are genuine browser behavior."
    ],
    "use": "<script src=\"dialog.js\"></script>\\n<button id=\"confirm\" type=\"button\">Review changes</button>\\n<sand-dialog id=\"review\" title=\"Confirm changes\" description=\"Review before saving.\">\\n  <p>Your draft is ready to publish.</p>\\n</sand-dialog>\\n<script>\\nconfirm.addEventListener('click', () => review.showModal());\\nreview.addEventListener('dialog-close', event => console.log(event.detail.returnValue));\\n</script>",
    "js": "const modal = document.querySelector('sand-dialog');\\nmodal.addEventListener('confirm', () => publishDraft());\\nmodal.addEventListener('dialog-close', event => restorePageState(event.detail.returnValue));\\nmodal.showModal();",
    "attrs": [
      [
        "`open`",
        "Reflects native modal open state",
        "absent"
      ],
      [
        "`title`",
        "Dialog heading",
        "Dialog"
      ],
      [
        "`description`",
        "Optional accessible description",
        "empty"
      ],
      [
        "`confirm-label`",
        "Primary action button text",
        "Done"
      ],
      [
        "`cancel-label`",
        "Secondary action button text",
        "Cancel"
      ],
      [
        "`close-on-escape`",
        "Allow Escape to close unless value is false",
        "true"
      ],
      [
        "`close-on-backdrop`",
        "Allow a click on the backdrop to close",
        "absent"
      ],
      [
        "`label`",
        "Accessible name override",
        "heading"
      ]
    ],
    "notes": [
      "The implementation uses the native `<dialog>` element with `showModal()`, allowing the browser to manage the top layer and modal focus containment.",
      "Caller-provided child nodes are moved into the dialog body without parsing HTML. Use DOM nodes for interactive content and keep ownership in the host.",
      "The Close, Cancel and Done controls call `close()` with a return value. Done also emits `confirm` before closing.",
      "The `cancel` event from Escape is prevented and handled according to `close-on-escape`; backdrop closing is opt-in through `close-on-backdrop`.",
      "The component restores focus to the element that opened it when that element is still connected. Listen for `dialog-open` and `dialog-close`."
    ],
    "happens": [
      [
        "call showModal()",
        "the native dialog enters the top layer and the rest of the page becomes inert"
      ],
      [
        "press Tab",
        "the browser keeps keyboard focus inside the modal"
      ],
      [
        "confirm or cancel",
        "the return value and close event let the host decide what happens next"
      ]
    ],
    "limits": [
      "The dialog manages presentation and focus only. It does not validate, submit or persist the form content placed inside it. The caller remains responsible for the opener and business workflow."
    ],
    "demo": {
      "html": "<button id=\"open-dialog\" class=\"pill\" type=\"button\">Open dialog</button><sand-dialog id=\"el\" title=\"Publish this project?\" description=\"This action makes the current draft visible.\" confirm-label=\"Publish\" cancel-label=\"Keep editing\"><p>Check your title, description and access settings before publishing.</p></sand-dialog><p class=\"readout\">The modal uses native dialog focus containment.</p>",
      "hint": "Open the modal, use Tab, Escape, Cancel or Publish.",
      "script": "const out=document.querySelector('.readout');document.getElementById('open-dialog').addEventListener('click',()=>el.showModal());el.addEventListener('confirm',()=>out.textContent='Publish action requested');el.addEventListener('dialog-close',e=>out.textContent='Dialog closed: '+e.detail.returnValue);"
    }
  },
  {
    "id": "drawer",
    "name": "Drawer / Sheet",
    "tag": "sand-drawer",
    "categories": [
      "drawer",
      "sheet",
      "overlay",
      "modal",
      "accessibility",
      "sand"
    ],
    "sub": "A wood-framed sand panel enters from a screen edge.",
    "desc": "A responsive modal sheet that slides from the left, right, top or bottom, uses native dialog focus containment, and provides Escape/backdrop and action controls.",
    "docs": "Set open or call showModal()/show(). Configure placement, size, title and description; close(returnValue) and listen for drawer-open, drawer-close and confirm.",
    "intro": [
      "A wood-framed sheet moves in from the edge of the viewport, carrying a compact workspace or filter surface. It uses a native modal dialog for focus containment while the panel itself follows the selected edge."
    ],
    "use": "<script src=\"drawer.js\"></script>\\n<button id=\"filters\" type=\"button\">Open filters</button>\\n<sand-drawer id=\"sheet\" title=\"Filters\" placement=\"right\" size=\"360px\">\\n  <p>Choose the filters to apply.</p>\\n</sand-drawer>\\n<script>\\nfilters.addEventListener('click', () => sheet.showModal());\\n</script>",
    "js": "const sheet = document.querySelector('sand-drawer');\\nsheet.setAttribute('placement', 'bottom');\\nsheet.showModal();\\nsheet.addEventListener('drawer-close', event => saveSheetResult(event.detail.returnValue));",
    "attrs": [
      [
        "`open`",
        "Reflects native modal open state",
        "absent"
      ],
      [
        "`title`",
        "Sheet heading",
        "Details"
      ],
      [
        "`description`",
        "Optional accessible description",
        "empty"
      ],
      [
        "`placement`",
        "left, right, top or bottom",
        "right"
      ],
      [
        "`size`",
        "Panel width or height as CSS length; clamped to viewport",
        "380px"
      ],
      [
        "`close-on-escape`",
        "Allow Escape to close unless value is false",
        "true"
      ],
      [
        "`close-on-backdrop`",
        "Allow a click on the backdrop to close",
        "absent"
      ],
      [
        "`action-label`",
        "Show an optional primary action button",
        "absent"
      ],
      [
        "`label`",
        "Accessible name override",
        "heading"
      ]
    ],
    "notes": [
      "The drawer uses a native modal `<dialog>` to enter the top layer and keep focus within the sheet.",
      "Set `placement` to `left`, `right`, `top` or `bottom`. The `size` attribute sets the width for side sheets or height for top/bottom sheets and is clamped to the viewport.",
      "Child DOM nodes are moved into the sheet body without parsing HTML. They remain real host-owned nodes.",
      "Escape closes by default. Backdrop closing is opt-in with `close-on-backdrop`. The optional action button emits `confirm` before closing.",
      "Listen for `drawer-open` and `drawer-close`. Focus returns to the opener if it is still connected."
    ],
    "happens": [
      [
        "call showModal()",
        "the framed sheet enters from its configured edge"
      ],
      [
        "change placement",
        "the panel switches to left, right, top or bottom"
      ],
      [
        "close the sheet",
        "the native modal closes and focus returns to its opener"
      ]
    ],
    "limits": [
      "The drawer is modal in this phase. Non-modal docked sidebars belong to the layout system. The component does not manage route changes, filter state or persistence."
    ],
    "demo": {
      "html": "<button id=\"open-drawer\" class=\"pill\" type=\"button\">Open filters</button><sand-drawer id=\"el\" title=\"Filter results\" description=\"Choose the project status to display.\" placement=\"right\" size=\"360px\" action-label=\"Apply filters\"><p>In progress</p><p>Needs review</p><p>Completed</p></sand-drawer><p class=\"readout\">Choose an edge sheet to inspect filters.</p>",
      "hint": "Open the drawer, change its placement, then Apply or close.",
      "script": "const out=document.querySelector('.readout');document.getElementById('open-drawer').addEventListener('click',()=>el.showModal());el.addEventListener('confirm',()=>out.textContent='Filters applied');el.addEventListener('drawer-close',e=>out.textContent='Drawer closed: '+e.detail.returnValue);"
    }
  },
{
  "id": "command",
  "name": "Command Palette",
  "tag": "sand-command",
  "categories": [
    "command",
    "palette",
    "search",
    "navigation",
    "productivity",
    "sand"
  ],
  "sub": "A central river stone moves through a searchable command list.",
  "desc": "A keyboard-first searchable command palette with native modal focus containment, filtering, active result navigation and host-facing command events.",
  "docs": "Set commands to records with id, label, description, keywords, shortcut and disabled. Call show(), hide(reason) or run(id); read value and listen for command, select, command-open and command-close.",
  "intro": [
    "A central marker searches through a compact list of possible actions. The palette owns filtering and keyboard navigation, while the application remains responsible for executing each command."
  ],
  "use": "<script src=\"command.js\"></script>\\n<sand-command id=\"commands\"></sand-command>\\n<script>\\ncommands.commands = [{ id: 'new', label: 'New project', keywords: 'create add' }];\\ncommands.addEventListener('command', event => runCommand(event.detail.id));\\n</script>",
  "js": "const palette = document.querySelector('sand-command');\\npalette.show();\\npalette.addEventListener('command', event => runCommand(event.detail.id));\\npalette.hide('complete');",
  "attrs": [
    [
      "commands (property)",
      "Array of command records with unique id, label, description, keywords, shortcut and disabled",
      "Built-in sample commands"
    ],
    [
      "value (property)",
      "ID of the active result",
      "First result"
    ],
    [
      "open",
      "Reflects the native modal open state",
      "absent"
    ],
    [
      "placeholder",
      "Search field placeholder",
      "Search commands"
    ],
    [
      "label",
      "Accessible dialog and trigger name",
      "Command palette"
    ],
    [
      "disabled",
      "Prevents opening and execution",
      "absent"
    ]
  ],
  "notes": [
    "Search matches command label, description and keywords. Filtering is local and synchronous; remote search and permissions remain host responsibilities.",
    "Arrow Up/Down changes the active result; Home/End select the first/last enabled result; Enter emits the command; Escape closes the native modal.",
    "Call show(), hide(reason) and run(id). Events include command-open, command-close, select and command.",
    "The Ctrl K label is illustrative. Applications should register their own global shortcut and call show(); this element does not capture Ctrl K globally.",
    "Native dialog behavior provides top-layer and focus containment. User-defined actions are never evaluated by the component."
  ],
  "happens": [
    [
      "open the palette",
      "a walnut frame rises above the page and focus moves into search"
    ],
    [
      "type a query",
      "the result stones narrow to matching commands"
    ],
    [
      "press Enter",
      "the selected command is emitted to the host and the palette closes"
    ]
  ],
  "limits": [
    "Search is in-memory and synchronous. Remote command discovery, shortcut registration, permissions, execution and recent-command history belong to the host.",
    "The list is not virtualized. Keep the local palette practical in size or implement remote/virtualized search in the host."
  ],
  "demo": {
    "html": "<sand-command id=\"el\"></sand-command><p class=\"readout\">Open the palette and search for a command.</p>",
    "hint": "Use the trigger, type a query, move with Arrow Up/Down and press Enter. Escape closes.",
    "script": "const out=document.querySelector('.readout');el.addEventListener('command',e=>out.textContent='Command selected: '+e.detail.label);el.addEventListener('command-close',e=>{if(e.detail.reason==='escape')out.textContent='Palette closed'});"
  },
  "manualDocs": true
},
{
  "id": "context-menu",
  "name": "Context Menu",
  "tag": "sand-context-menu",
  "categories": [
    "context-menu",
    "menu",
    "pointer",
    "touch",
    "accessibility",
    "sand"
  ],
  "sub": "A carved walnut menu appears at the point of contact.",
  "desc": "A context menu anchored to a target element or built-in demo surface, opened by right-click, long-press or keyboard shortcut, with viewport-aware positioning and keyboard navigation.",
  "docs": "Set items to action records and optionally set the for attribute to a target ID. Listen for menu-open, select/menu-select and menu-close. The host executes the selected action.",
  "intro": [
    "A carved walnut tray appears where the user asks for more actions. It supports pointer, touch and keyboard requests; the application retains ownership of every action."
  ],
  "use": "<script src=\"context-menu.js\"></script>\\n<button id=\"file-target\">Project file</button>\\n<sand-context-menu id=\"menu\" for=\"file-target\"></sand-context-menu>\\n<script>\\nmenu.addEventListener('select', event => performFileAction(event.detail.id));\\n</script>",
  "js": "const menu = document.querySelector('sand-context-menu');\\nmenu.items = [{ id: 'rename', label: 'Rename' }, { id: 'archive', label: 'Archive' }];\\nmenu.addEventListener('select', event => performAction(event.detail.id));",
  "attrs": [
    [
      "for",
      "ID of an element that receives contextmenu, touch and keyboard listeners",
      "Internal demo target"
    ],
    [
      "items (property)",
      "Records with id, label, disabled, separator and shortcut",
      "Open, Rename, Duplicate, Archive"
    ],
    [
      "label",
      "Accessible menu name",
      "Context menu"
    ],
    [
      "disabled",
      "Prevents opening and selection",
      "absent"
    ]
  ],
  "notes": [
    "Right-click opens the menu at the pointer. A touch long-press opens after approximately 560 ms. ContextMenu and Shift+F10 open it near the target.",
    "Arrow Up/Down, Home and End move among enabled items. Escape closes the menu and restores focus; Tab closes without forcing focus back.",
    "The for target must exist when the component binds. Change the attribute after the target is available to rebind listeners.",
    "Outside-click, scroll, resize and target listeners are removed when closed or disconnected. Events include select, menu-select, menu-open and menu-close."
  ],
  "happens": [
    [
      "right-click or long-press a target",
      "the menu opens near the pointer and stays inside the viewport"
    ],
    [
      "use keyboard navigation",
      "focus moves only between enabled menu items"
    ],
    [
      "choose an action",
      "the selected item ID is emitted to the host and the menu closes"
    ]
  ],
  "limits": [
    "The component presents actions but does not execute them, manage permissions, provide nested submenus or maintain application state.",
    "Touch long-press is best-effort and can conflict with browser or operating-system gestures. Test with the host page's scrolling behavior."
  ],
  "demo": {
    "html": "<sand-context-menu id=\"el\"></sand-context-menu><p class=\"readout\">Right-click, long-press or press Shift + F10 on the target.</p>",
    "hint": "Try pointer, touch long-press or Shift + F10. Escape closes the menu.",
    "script": "const out=document.querySelector('.readout');el.addEventListener('select',e=>out.textContent='Selected action: '+e.detail.label);"
  },
  "manualDocs": true
},
{
  "id": "filter-builder",
  "name": "Filter Builder",
  "tag": "sand-filter-builder",
  "categories": [
    "filter",
    "query",
    "form",
    "builder",
    "productivity",
    "sand"
  ],
  "sub": "Filter conditions connect through carved logical grooves.",
  "desc": "A structured filter editor with configurable fields, operators and values, AND/OR logic, add/remove/reset operations and a serializable query contract.",
  "docs": "Set fields and filters as properties, select AND or OR through logic, and listen for input, change, apply and reset. toQuery() returns the host-facing query object.",
  "intro": [
    "Filter conditions become small stones linked by a logical channel. This editor owns the condition rows and query shape, not the evaluation or fetching of records."
  ],
  "use": "<script src=\"filter-builder.js\"></script>\\n<sand-filter-builder id=\"filters\"></sand-filter-builder>\\n<script>\\nfilters.addEventListener('apply', event => loadResults(event.detail.query));\\n</script>",
  "js": "const filters = document.querySelector('sand-filter-builder');\\nfilters.fields = [{ id: 'status', label: 'Status', type: 'select', options: ['Open', 'Done'] }];\\nfilters.logic = 'OR';\\nfilters.add();\\nconsole.log(filters.toQuery());",
  "attrs": [
    [
      "fields (property)",
      "Field definitions with id, label, type and optional select options",
      "Status, Owner, Priority"
    ],
    [
      "filters (property)",
      "Condition records with id, field, operator and value",
      "One status condition"
    ],
    [
      "logic (property)",
      "AND or OR grouping for all conditions",
      "AND"
    ],
    [
      "disabled",
      "Disables editing and apply controls",
      "absent"
    ],
    [
      "label",
      "Accessible filter-builder name",
      "Filter builder"
    ]
  ],
  "notes": [
    "Supported field types are text, number, date and select. Supported operators are is, is-not, contains, starts-with, greater-than, less-than, before, after, empty and not-empty.",
    "Set fields, filters and logic as properties. The filters getter returns copies; toQuery() emits { logic, conditions } without internal row IDs.",
    "add(), remove(index), clear() and reset() edit local builder state. apply() emits an apply event but does not fetch or filter data.",
    "input and change events report the reason, logic, filters and serialized query. reset is emitted on clear."
  ],
  "happens": [
    [
      "add a condition",
      "a new field, operator and value row appears"
    ],
    [
      "change AND to OR",
      "query grouping changes and a change event is emitted"
    ],
    [
      "apply filters",
      "the structured query is emitted for the host to execute"
    ]
  ],
  "limits": [
    "This component defines a portable query shape; it does not validate a backend schema, sanitize SQL, run a query or fetch records.",
    "All conditions share one AND/OR operator. Nested groups, custom operators, async field loading, per-field validation and query execution remain host responsibilities."
  ],
  "demo": {
    "html": "<sand-filter-builder id=\"el\"></sand-filter-builder><p class=\"readout\">Edit conditions and apply the structured query.</p>",
    "hint": "Add, remove and edit filter conditions. The component emits a serializable query, not a data fetch.",
    "script": "const out=document.querySelector('.readout');el.addEventListener('apply',e=>out.textContent=JSON.stringify(e.detail.query));"
  },
  "manualDocs": true
},
{
  "id": "table",
  "name": "Data Table",
  "tag": "sand-table",
  "categories": [
    "table",
    "data-grid",
    "sorting",
    "filtering",
    "selection",
    "sand"
  ],
  "sub": "Rows settle into a sand board with sortable headings and selection stones.",
  "desc": "A searchable, sortable and selectable data table with stable row IDs, column visibility, multi-selection, sticky headings and bounded client-side pagination.",
  "docs": "Set columns and rows as properties; read selected, page and pageSize. Set filter, sortBy and sortDirection, call sort(key), select(id, checked), selectVisible(ids, checked) and listen for sort, filter, select, change and row-activate.",
  "intro": [
    "Rows rest inside a walnut frame. A stone marks selected records while column headings act as sortable rails. Pagination bounds rendered rows; the host owns data fetching and persistence."
  ],
  "use": "<script src=\"table.js\"></script>\\n<sand-table id=\"projects\" page-size=\"10\"></sand-table>\\n<script>\\nprojects.addEventListener('select', event => saveSelection(event.detail.selected));\\nprojects.addEventListener('sort', event => sortRemoteData(event.detail));\\n</script>",
  "js": "const table = document.querySelector('sand-table');\\ntable.columns = [{ key: 'name', label: 'Project' }, { key: 'status', label: 'Status' }];\\ntable.rows = [{ id: 'p1', name: 'Atlas', status: 'In progress' }];\\ntable.sort('name');\\ntable.select('p1', true);",
  "attrs": [
    [
      "columns (property)",
      "Column definitions with key, label, sortable, hidden and align",
      "Name, Status, Owner, Updated"
    ],
    [
      "rows (property)",
      "Records with unique id and column values",
      "Sample project records"
    ],
    [
      "selected (property)",
      "Selected row IDs",
      "Empty selection"
    ],
    [
      "filter (property)",
      "Case-insensitive text filter across visible columns",
      "Empty"
    ],
    [
      "sortBy / sortDirection",
      "Sort key and asc/desc direction",
      "Unsorted, ascending"
    ],
    [
      "page / pageSize",
      "One-based page and bounded rows per page (1–100)",
      "1 / 5"
    ],
    [
      "disabled / label",
      "Disable controls and set accessible name",
      "Enabled / Data table"
    ]
  ],
  "notes": [
    "Column values are rendered as text. The columns and rows getters return shallow copies; row IDs must be unique.",
    "Search is case-insensitive across visible columns. Sorting is stable and supports numeric values or locale-aware strings.",
    "Use sort(key), select(id, checked) and selectVisible(ids, checked). Header buttons expose aria-sort; select-all applies to the visible page.",
    "filter, sortBy, sortDirection, page and pageSize properties keep the table in sync. Events include filter, sort, select, change and row-activate."
  ],
  "happens": [
    [
      "type in the filter field",
      "rows are filtered across visible columns"
    ],
    [
      "activate a sortable heading",
      "the table sorts by that column and toggles direction on repeat"
    ],
    [
      "select rows and change pages",
      "selected IDs persist while visible row windows change"
    ]
  ],
  "limits": [
    "Client-side pagination bounds the current DOM to pageSize rows, so a separate virtual scroller is not needed for this contract. Large or remote datasets should be paged by the host.",
    "Column filtering is substring matching. The component does not implement server sorting, column resizing, column reordering, row editing, nested rows, CSV export or persistence."
  ],
  "demo": {
    "html": "<sand-table id=\"el\" page-size=\"4\"></sand-table><p class=\"readout\">Filter rows, sort a heading, select records and page through the dataset.</p>",
    "hint": "Pagination bounds rendered rows. Selected row IDs persist across pages and filtering.",
    "script": "const out=document.querySelector('.readout');el.addEventListener('select',e=>out.textContent=e.detail.selected.length+' row(s) selected: '+e.detail.selected.join(', '));el.addEventListener('sort',e=>out.textContent='Sorted by '+e.detail.key+' ('+e.detail.direction+')');"
  },
  "manualDocs": true
},
{
  "id": "kanban",
  "name": "Kanban Board",
  "tag": "sand-kanban",
  "categories": [
    "kanban",
    "board",
    "drag-and-drop",
    "workflow",
    "productivity",
    "sand"
  ],
  "sub": "Task cards travel between walnut-framed workflow columns.",
  "desc": "A multi-column Kanban board with stable card and column IDs, native drag-and-drop, explicit move buttons, arrow-key movement, priority labels and host-facing move/select events.",
  "docs": "Set columns to records containing id, label and cards. Call moveCard(cardId, columnId, index) or action(cardId, direction); listen for move, change and select events.",
  "intro": [
    "Task cards settle into distinct work stages. The board supports drag movement and explicit directional controls so moving a card does not depend on pointer precision."
  ],
  "use": "<script src=\"kanban.js\"></script>\\n<sand-kanban id=\"board\"></sand-kanban>\\n<script>\\nboard.addEventListener('move', event => persistBoard(event.detail.columns));\\n</script>",
  "js": "const board = document.querySelector('sand-kanban');\\nboard.moveCard('prototype', 'done');\\nboard.addEventListener('move', event => console.log(event.detail.from, event.detail.to));",
  "attrs": [
    [
      "columns (property)",
      "Columns with unique IDs, labels and card arrays",
      "Backlog, In progress, Done"
    ],
    [
      "value (property)",
      "Alias for the columns array",
      "Current board state"
    ],
    [
      "disabled",
      "Disables card moves and selection",
      "absent"
    ],
    [
      "label",
      "Accessible board name",
      "Kanban board"
    ]
  ],
  "notes": [
    "Each card has a unique id, title, optional description, priority low/normal/high and optional disabled state. IDs are unique across the board.",
    "Use moveCard(cardId, targetColumnId, targetIndex?) for deterministic movement. action(cardId, left/right/up/down) supports explicit controls.",
    "Drag-and-drop is an enhancement. Each card also has buttons and Arrow Left/Right/Up/Down plus Home/End keyboard movement.",
    "move and change report the moved card, source and destination IDs, indices and resulting columns. select reports card activation; the host persists the board."
  ],
  "happens": [
    [
      "drag a card to another column",
      "the card moves and column counts update"
    ],
    [
      "use arrow keys or move buttons",
      "the same move is available without drag-and-drop"
    ],
    [
      "listen for move",
      "the host receives the new board state for persistence"
    ]
  ],
  "limits": [
    "The component renders all supplied cards. It does not implement virtual scrolling, swimlanes, column creation, card editing, workflow permissions, server persistence or conflict resolution.",
    "Native HTML drag-and-drop and touch behavior vary. The explicit arrow controls provide an alternative; host applications should test touch hardware and assistive technology."
  ],
  "demo": {
    "html": "<sand-kanban id=\"el\"></sand-kanban><p class=\"readout\">Move a card with drag-and-drop or its arrow controls.</p>",
    "hint": "Use card buttons or focus a card and press Arrow Left/Right/Up/Down, Home or End.",
    "script": "const out=document.querySelector('.readout');el.addEventListener('move',e=>out.textContent=e.detail.card.title+': '+e.detail.from+' → '+e.detail.to);"
  },
  "manualDocs": true
}
];