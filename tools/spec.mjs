// What each control is, in one place. tools/docs.mjs turns this into every folder's README.md and index.html,
// registry.json and llms.txt, so they cannot drift apart. Edit here, then run `node tools/docs.mjs`.
export const REPO = 'Brajesh31/GrainMotion-UI';
export const SITE = 'https://brajesh31.github.io/GrainMotion-UI';
export const AUTHOR = 'Brajesh Kumar <https://github.com/Brajesh31>';
export const COUNT = 'twenty-nine';

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
}
{
  "id":"tabs","name":"Tabs","tag":"sand-tabs",
  "categories":["navigation","tabs","sand","animation"],
  "sub":"A river stone glides between carved tab wells.",
  "desc":"A tactile tab system with a flat river-stone marker moving between carved tab wells. Real HTML tab buttons and content panels preserve native interaction and accessible semantics.",
  "docs":"Use <sand-tabs tabs=\"overview:Overview,activity:Activity\" value=\"overview\"></sand-tabs>. Put template[data-panel] elements inside for real panel content. Read or set value and listen for the bubbling change event.",
  "intro":["A low river stone rests in one of several carved wells. The selected well is active, while the panel beneath remains actual HTML content."],
  "use":"<script src=\"tabs.js\"></script>\n<sand-tabs tabs=\"overview:Overview,activity:Activity\" value=\"overview\"><template data-panel=\"overview\"><p>Overview content</p></template><template data-panel=\"activity\"><p>Activity content</p></template></sand-tabs>",
  "js":"const tabs = document.querySelector('sand-tabs');\ntabs.value = 'activity';\ntabs.addEventListener('change', event => console.log(event.detail.value));",
  "attrs":[["tabs","Comma-separated id:Label entries, up to six","Overview, Activity, Settings"],["value","Selected tab identifier","First enabled tab"],["label","Accessible tab group name","Content tabs"],["orientation","horizontal or vertical","horizontal"],["activation","automatic or manual keyboard activation","automatic"],["disabled-tabs","Comma-separated disabled tab IDs","none"]],
  "notes":["Panel bodies are supplied as template[data-panel] elements and cloned during refresh().","Horizontal arrow keys move between tabs. Vertical orientation uses Up/Down. Home and End move to the edges; manual mode activates with Enter or Space.","A change event exposes value, previousValue and index."],
  "happens":[["select a tab","the stone marker glides to its carved well and the matching panel is revealed"],["change orientation","the tab list and keyboard direction switch between horizontal and vertical"],["disable a tab","the disabled option is removed from keyboard selection"]],
  "limits":["Up to six tab entries. Attribute definitions reserve comma and colon as delimiters.","The component does not provide routing, data fetching or lazy loading."],
  "manualDocs":true
},
{
  "id":"accordion","name":"Accordion","tag":"sand-accordion",
  "categories":["disclosure","navigation","sand","animation"],
  "sub":"Walnut lids lift to reveal separate sand compartments.",
  "desc":"An accordion made from walnut lids with small stone pulls. Opening a lid reveals a sand-toned compartment containing preserved native HTML content.",
  "docs":"Use <sand-accordion items=\"shipping:Shipping,returns:Returns\" value=\"shipping\"></sand-accordion> with template[data-panel] children. Add multiple for simultaneous panels and collapsible to allow all panels to close.",
  "intro":["Walnut lids sit over separate sand compartments. Opening a lid lifts it from the frame and reveals the content below without rebuilding it on every toggle."],
  "use":"<script src=\"accordion.js\"></script>\n<sand-accordion items=\"shipping:Shipping,returns:Returns\" value=\"shipping\"><template data-panel=\"shipping\"><p>Delivery information</p></template><template data-panel=\"returns\"><p>Return information</p></template></sand-accordion>",
  "js":"const accordion = document.querySelector('sand-accordion');\naccordion.toggle('returns');\naccordion.addEventListener('change', event => console.log(event.detail.openItems));",
  "attrs":[["items","Comma-separated id:Label entries, optional :disabled suffix","Shipping, Returns, Care"],["value","Open item ID or comma-separated IDs in multiple mode","First enabled item"],["label","Accessible group name","Expandable sections"],["multiple","Allow multiple panels to remain open","absent"],["collapsible","Allow all panels to close","absent"],["disabled-items","Comma-separated disabled item IDs","none"],["disabled","Disable every header","absent"]],
  "notes":["Each panel is populated from a matching template[data-panel] child. Collapsing a panel hides its existing DOM instead of destroying form state.","Each header is a real button with aria-expanded and aria-controls; each panel is a labelled region.","The change event exposes value and openItems."],
  "happens":[["open a section","the walnut lid lifts and its sand compartment is revealed"],["enable multiple","more than one lid may remain open"],["disable a section","its header button is disabled"]],
  "limits":["Up to five accordion items. Attribute definitions reserve comma and colon as delimiters.","This is a disclosure control, not a nested tree view."],
  "manualDocs":true
},
{
  "id":"pagination","name":"Pagination","tag":"sand-pagination",
  "categories":["navigation","pagination","sand","animation"],
  "sub":"A stone marks the current page along a carved sand track.",
  "desc":"A pagination control with numbered sand wells and a moving river-stone page marker. Page state and navigation are native buttons; data loading remains the host application's responsibility.",
  "docs":"Use <sand-pagination page=\"4\" total=\"24\"></sand-pagination>. Read or set page, configure sibling-count and boundary-count, and listen for change to load the selected page.",
  "intro":["A row of numbered wells is carved into a shallow sand track. The low river stone marks the current 1-based page."],
  "use":"<script src=\"pagination.js\"></script>\n<sand-pagination page=\"4\" total=\"24\" sibling-count=\"1\" boundary-count=\"1\" show-first-last label=\"Search results\"></sand-pagination>",
  "js":"const pages = document.querySelector('sand-pagination');\npages.addEventListener('change', event => loadResults(event.detail.page));\npages.page = 5;",
  "attrs":[["page","Current 1-based page","1"],["total","Total page count, minimum 1","1"],["sibling-count","Adjacent page buttons, 0 to 3","1"],["boundary-count","Buttons at each end, 1 to 3","1"],["show-first-last","Include first/last navigation buttons","absent"],["disabled","Disable all page buttons","absent"],["label","Navigation landmark name","Pagination"]],
  "notes":["Ellipses are decorative separators. A single-page gap is rendered as its missing page number.","The change event exposes page, previousPage and total. The component does not fetch data or change browser history.","The current page uses aria-current=page. Navigation edges use disabled buttons."],
  "happens":[["select a page","the stone marker moves to that page's well and change is dispatched"],["reach the first or last page","the previous or next control is disabled"],["reduce the page window","the number of visible sibling and boundary buttons changes"]],
  "limits":["Page values are clamped to the inclusive 1..total range.","The control is a single-row pagination bar, not infinite scrolling or cursor pagination."],
  "manualDocs":true
},
{
  "id":"breadcrumbs","name":"Breadcrumbs","tag":"sand-breadcrumbs",
  "categories":["navigation","breadcrumbs","sand","animation"],
  "sub":"Stepping stones form a navigable hierarchy through raked sand.",
  "desc":"A breadcrumb navigation trail with real ancestor links and a non-interactive current page marker. River stones sit along a shallow raked path.",
  "docs":"Use <sand-breadcrumbs items=\"Home|/;Library|/library;Current\"></sand-breadcrumbs>. Supply semicolon-separated Label|URL ancestors and a plain current label, or assign the items array property.",
  "intro":["A hierarchy becomes a path of stepping stones across raked sand. Ancestors are links; the final stone marks the current location."],
  "use":"<script src=\"breadcrumbs.js\"></script>\n<sand-breadcrumbs items=\"Home|/;Library|/library;Components|/components;Breadcrumbs\"></sand-breadcrumbs>",
  "js":"const crumbs = document.querySelector('sand-breadcrumbs');\ncrumbs.items = [{ label: 'Home', href: '/' }, { label: 'Current' }];",
  "attrs":[["items","Semicolon-separated Label|URL entries or an array of objects","Home, Library, Current project"],["label","Navigation landmark name","Breadcrumb"],["separator","Visible separator glyph","›"]],
  "notes":["Ancestors render as native anchors. The final label is a span with aria-current=page.","Only HTTP(S) and safe relative destinations become links. javascript:, data:, protocol-relative and other schemes are rejected.","The items property accepts an array of {label, href} objects and supports labels/URLs containing delimiters."],
  "happens":[["navigate an ancestor","the browser follows the supplied href as a normal link"],["change the item array","the breadcrumb path and stepping-stone positions are rebuilt"],["reach the final item","it is marked aria-current=page and is not a link"]],
  "limits":["Up to eight breadcrumb items.","The component does not create routes or intercept navigation."],
  "manualDocs":true
},
{
  "id":"menu","name":"Menu / Popover","tag":"sand-menu",
  "categories":["navigation","menu","popover","overlay","sand"],
  "sub":"A stone trigger lifts a walnut-framed command tray.",
  "desc":"A compact command menu with a lifting stone trigger, anchored walnut tray, keyboard navigation, outside dismissal and focus restoration. Commands are emitted as events for the host application.",
  "docs":"Use <sand-menu items=\"new:New project,duplicate:Duplicate\"></sand-menu>. Listen for the bubbling select event to run an action. The open property and attribute control the menu visibility.",
  "intro":["A small river stone lifts from a carved trigger well and reveals a walnut-framed option tray. Actions remain native buttons and are reported to the host application."],
  "use":"<script src=\"menu.js\"></script>\n<sand-menu label=\"Project actions\" items=\"new:New project,duplicate:Duplicate,archive:Archive\"></sand-menu>",
  "js":"const menu = document.querySelector('sand-menu');\nmenu.addEventListener('select', event => runAction(event.detail.value));\nmenu.open = true;",
  "attrs":[["items","Comma-separated value:Label definitions, optional :disabled suffix","New project, Duplicate, Archive"],["label","Trigger and menu accessible name","Actions"],["open","Reflects open visibility","absent"],["disabled","Disable trigger and prevent opening","absent"],["keep-open","Keep menu open after a selection","absent"]],
  "notes":["ArrowDown/ArrowUp open and focus the first/last enabled item. Up/Down move inside; Home/End move to edges; Escape closes and restores trigger focus.","Tab closes without trapping focus. Outside pointer press dismisses. The tray repositions on scroll and resize and stays within the viewport.","The select event exposes value and label; the component never executes the action itself."],
  "happens":[["open the trigger","the stone lifts and the anchored walnut option tray appears"],["select an enabled action","a select event is emitted and the menu closes unless keep-open is present"],["press Escape or click outside","the tray closes; Escape restores focus to the trigger"]],
  "limits":["Up to eight menu items.","This component is a command menu, not a modal dialog or general rich-content popover."],
  "manualDocs":true
}
];
