const supportedThemes = new Set(["green", "gold", "blue"]);

export const getCharityThemeClass = (theme) => {
    const normalizedTheme = String(theme || "").toLowerCase();

    if (supportedThemes.has(normalizedTheme)) {
        return `charity-theme-${normalizedTheme}`;
    }

    return "charity-theme-green";
};
