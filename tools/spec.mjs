// What each control is, in one place. tools/docs.mjs turns this into every folder's README.md and index.html,
// registry.json and llms.txt, so they cannot drift apart. Edit here, then run `node tools/docs.mjs`.
export const REPO = 'Brajesh31/GrainMotion-UI';
export const SITE = 'https://brajesh31.github.io/GrainMotion-UI';
export const AUTHOR = 'Brajesh Kumar <https://github.com/Brajesh31>';
export const COUNT = 'fourteen';

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
    ]
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
  }
];
