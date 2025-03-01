"use strict"

const MAIN_CLASS = "main-container"
const SIDEBAR_ID = {
    left: "left-sidebar-container",
    right: "right-sidebar-container",
}
const DISPLAY_STYLE_FROM_STATE = {
    "off": "none",
    "on": "block",
}

const STATE_FROM_DISPLAY_STYLE = {
    "": "on",
    "none": "off",
    "block": "on",
}

const TOGGLE_STATE = {
    "off": "on",
    "on": "off"
}

const CUSTOM_HTML = `
<div id="custom-html" hidden></div>
<span data-part="leftSidebar" class="contents">
	<button
		id="btnLeftSidebar"
		rpl=""
		class="button-medium px-[var(--rem8)] button-plain icon items-center justify-center button inline-flex"
		title="Toggle Left Sidebar"
	>
		<span class="flex items-center justify-center">
			<span class="flex">
				<svg rpl="" fill="currentColor" height="22" icon-name="chat-outline" width="22"
					xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1.6 1.6">
					<path id="sidebar"
						d="M1.25 1.4H0.35A0.15 0.15 0 0 1 0.2 1.25V0.35a0.15 0.15 0 0 1 0.15 -0.15h0.9a0.15 0.15 0 0 1 0.15 0.15v0.9A0.15 0.15 0 0 1 1.25 1.4M0.6 1.3V0.3h-0.225a0.075 0.075 0 0 0 -0.075 0.075V1.225a0.075 0.075 0 0 0 0.075 0.075zM1.225 0.3H0.7v1h0.525a0.075 0.075 0 0 0 0.075 -0.075V0.375A0.075 0.075 0 0 0 1.225 0.3"></path>
					<path id="code"
						d="m0.5 0.969 -0.171 -0.171 0.171 -0.171 0.071 0.071 -0.1 0.1 0.1 0.1z"></path>
				</svg>
			</span>
		</span>
	</button>
</span>

<span data-part="rightSidgebar" class="contents">
	<button
		id="btnRightSidebar"
        rpl=""
        class="button-medium px-[var(--rem8)] button-plain icon items-center justify-center button inline-flex"
        title="Toggle Right Sidebar"
    >
		<span class="flex items-center justify-center">
			<span class="flex">
				<svg rpl="" fill="currentColor" height="22" icon-name="chat-outline" width="22"
					xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1.6 1.6" version="1.1"
					xmlns:xlink="http://www.w3.org/1999/xlink" transform="matrix(-1,0,0,1,0,0)">
					<path id="sidebar"
						d="M1.25 1.4H0.35A0.15 0.15 0 0 1 0.2 1.25V0.35a0.15 0.15 0 0 1 0.15 -0.15h0.9a0.15 0.15 0 0 1 0.15 0.15v0.9A0.15 0.15 0 0 1 1.25 1.4M0.6 1.3V0.3h-0.225a0.075 0.075 0 0 0 -0.075 0.075V1.225a0.075 0.075 0 0 0 0.075 0.075zM1.225 0.3H0.7v1h0.525a0.075 0.075 0 0 0 0.075 -0.075V0.375A0.075 0.075 0 0 0 1.225 0.3"></path>
					<path id="code"
						d="m0.5 0.969 -0.171 -0.171 0.171 -0.171 0.071 0.071 -0.1 0.1 0.1 0.1z"></path>
				</svg>
			</span>
		</span>
	</button>
</span>
`



function applyState(side, state) {
    let sidebar = document.getElementById(SIDEBAR_ID[side])
    console.debug(state, sidebar.style.display, STATE_FROM_DISPLAY_STYLE[sidebar.style.display])
    if (state == null || state == STATE_FROM_DISPLAY_STYLE[sidebar.style.display])  
        return

    sidebar.style.display = DISPLAY_STYLE_FROM_STATE[state]
    if (side == 'right') {
        if (state == 'on')
            document.getElementsByClassName('main')[0]?.classList.add('right-sidebar-xs')
        else
            document.getElementsByClassName('main')[0]?.classList.remove('right-sidebar-xs')
    } else {
        if (state == 'on') {
            document.getElementsByClassName('subgrid-container')[0]?.classList.add("m:w-[1120px]")
            document.getElementsByClassName('subgrid-container')[0]?.classList.add("m:col-start-2")
            document.getElementsByClassName('grid-container')[0]?.classList.add('grid-container')
        } else {
            document.getElementsByClassName('grid-container')[0]?.classList.remove('grid-container')
            document.getElementsByClassName('subgrid-container')[0]?.classList.remove("m:col-start-2")
            document.getElementsByClassName('subgrid-container')[0]?.classList.remove("m:w-[1120px]")
        }
    }
}


function toggleSidebar(side) {
    try {
        let currState = localStorage.getItem(`${side}SidebarState`)
        let toggledState = TOGGLE_STATE[currState]
        localStorage.setItem(`${side}SidebarState`, toggledState)
        applyState(side, toggledState)
    } catch (ex) {
        console.debug(ex)
    }
}

function loadHTML() {
    try {
        if (document.getElementById("custom-html") != null) {
            console.debug("module already loaded")
            applyState('right', localStorage.getItem('rightSidebarState'))
            applyState('left', localStorage.getItem('leftSidebarState'))
            return
        }
        // if (localStorage.getItem('rightSiddebarState') == null) localStorage.setItem('rightSidebarState', 'on')
        // if (localStorage.getItem('leftSidebarState') == null) localStorage.setItem('leftSidebarState', 'on')

        let targetContainer = document.querySelectorAll('[data-part="advertise"]')[0]?.parentElement
        targetContainer.innerHTML = CUSTOM_HTML + targetContainer.innerHTML

        let btnLeftSidebar = document.getElementById("btnLeftSidebar")
        btnLeftSidebar.onclick = () => toggleSidebar("left")

        let btnRightSidebar = document.getElementById("btnRightSidebar")
        btnRightSidebar.onclick = () => toggleSidebar("right")
    } catch (ex) {
        console.debug(ex)
    }
}

new MutationObserver(() => {
    loadHTML()
}).observe(document, { subtree: true, childList: true });