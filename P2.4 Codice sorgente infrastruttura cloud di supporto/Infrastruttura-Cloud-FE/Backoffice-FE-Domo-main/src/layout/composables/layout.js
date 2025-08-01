import { toRefs, reactive, computed } from 'vue';

const availableThemes = {
    "light": [
        'aura-light-green',
        'aura-light-cyan',
        'aura-light-blue',
        'aura-light-indigo',
        'aura-light-pink',
        'aura-light-teal',
        'aura-light-amber',
        'aura-light-purple',
        'aura-light-noir',
        'aura-light-lime',
        'lara-light-green',
        'lara-light-cyan',
        'lara-light-blue',
        'lara-light-indigo',
        'lara-light-pink',
        'lara-light-teal',
        'lara-light-amber',
        'lara-light-purple',
        'md-light-indigo',
        'md-light-deeppurple',
    ],
    "dark": [
        'aura-dark-green',
        'aura-dark-cyan',
        'aura-dark-blue',
        'aura-dark-indigo',
        'aura-dark-pink',
        'aura-dark-teal',
        'aura-dark-amber',
        'aura-dark-purple',
        'aura-dark-noir',
        'aura-dark-lime',
        'lara-dark-green',
        'lara-dark-cyan',
        'lara-dark-blue',
        'lara-dark-indigo',
        'lara-dark-pink',
        'lara-dark-teal',
        'lara-dark-amber',
        'lara-dark-purple',
        'md-dark-indigo',
        'md-dark-deeppurple'
    ]
};

const layoutConfig = reactive({
    ripple: true,
    darkTheme: false,
    inputStyle: 'outlined',
    menuMode: 'static',
    theme: availableThemes['light'][6],
    scale: 14,
    activeMenuItem: null
});

const layoutState = reactive({
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false
});

export function useLayout() {
    const setScale = (scale) => {
        layoutConfig.scale = scale;
    };

    const setActiveMenuItem = (item) => {
        layoutConfig.activeMenuItem = item.value || item;
    };

    const onMenuToggle = () => {
        if (layoutConfig.menuMode === 'overlay') {
            layoutState.overlayMenuActive = !layoutState.overlayMenuActive;
        }

        if (window.innerWidth > 991) {
            layoutState.staticMenuDesktopInactive = !layoutState.staticMenuDesktopInactive;
        } else {
            layoutState.staticMenuMobileActive = !layoutState.staticMenuMobileActive;
        }
    };


    const isSidebarActive = computed(() => layoutState.overlayMenuActive || layoutState.staticMenuMobileActive);

    const isDarkTheme = computed(() => layoutConfig.darkTheme);

    return { layoutConfig: toRefs(layoutConfig), layoutState: toRefs(layoutState), setScale, onMenuToggle, isSidebarActive, isDarkTheme, setActiveMenuItem };
}
